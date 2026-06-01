"""
Facial Coder — Analyse émotionnelle temps réel (DeepFace / MediaPipe).
Modèle Ekman : happy, sad, angry, fear, surprise, disgust, neutral.

Corrections appliquées (v2 — Mai 2026) :
  - Backend 'retinaface' pour détection précise des micro-expressions
  - enforce_detection=True avec fallback gracieux
  - Vérification de luminosité avant analyse (seuil mean > 80)
  - Calcul ratio visage/frame pour valider la distance (40-60%)
  - Crop visage isolé avant analyse (supprime bruit de fond)
  - Throttling configurable (analyse 1 frame sur N)
  - Logging complet des scores de confiance par émotion
"""
from __future__ import annotations
import time, threading
from collections import deque
from typing import Optional
import cv2, cv2.data, numpy as np  # type: ignore
from PyQt6.QtCore import QThread, pyqtSignal  # type: ignore
from data.database import DatabaseManager
from data.models import FacialSample
from utils.logger import get_logger
import os
import torch
from core.models.ck_cnn import EmotionCNN, preprocess_image, predict_emotion

logger = get_logger(__name__)
BUFFER_SIZE = 500

# ─── Seuils de qualité ───────────────────────────────────────────────
MIN_BRIGHTNESS = 80           # Luminosité moyenne minimale (0-255)
MIN_FACE_RATIO = 0.08         # Ratio minimal visage/frame (8%)
IDEAL_FACE_RATIO_MIN = 0.15   # Ratio idéal bas (15%)
IDEAL_FACE_RATIO_MAX = 0.60   # Ratio idéal haut (60%)
DEEPFACE_BACKEND = "retinaface"  # Backend le plus précis pour les expressions


class EmotionCalculator:
    """Valence/Arousal via modèle circumplex de Russell (1980)."""
    V = {"happy":1.0,"surprise":0.3,"neutral":0.0,"sad":-0.7,"fear":-0.6,"angry":-0.8,"disgust":-0.9}
    A = {"happy":0.6,"surprise":0.9,"neutral":0.1,"sad":0.3,"fear":0.8,"angry":0.9,"disgust":0.5}

    @classmethod
    def compute(cls, scores: dict[str,float]) -> tuple[float,float]:
        t = sum(scores.values()) or 1.0
        val = sum(s*cls.V.get(e,0) for e,s in scores.items()) / t
        aro = sum(s*cls.A.get(e,0) for e,s in scores.items()) / t
        return max(-1,min(1,val)), max(0,min(1,aro))


class FacialCoder:
    """Moteur d'analyse émotionnelle. Backend: deepface ou opencv (fallback)."""
    def __init__(self, backend: str = "deepface") -> None:
        self._backend = backend
        self._deepface_available = False
        self._baseline: Optional[dict[str,float]] = None
        self._DeepFace = None
        self._face_cascade = None
        self._frame_count = 0
        self._analysis_interval = 1   # Analyser toutes les N frames (throttling)
        self._last_sample: Optional[FacialSample] = None
        self._quality_degraded = False  # Flag si fallback enforce_detection=False
        
        # --- Anti-Biais Neutral et Lissage ---
        self._ema_scores: Optional[dict[str, float]] = None
        self._ema_alpha = 0.6         # Lissage exponentiel (1.0 = aucun, 0.1 = fort)
        self._neutral_penalty = 0.85  # Facteur de réduction du score neutre brut

        if backend == "deepface":
            try:
                from deepface import DeepFace  # type: ignore
                self._DeepFace = DeepFace
                self._deepface_available = True
                logger.info(f"DeepFace chargé — backend: {DEEPFACE_BACKEND}")
            except ImportError:
                logger.warning("DeepFace absent, fallback OpenCV Haar Cascade.")
                self._backend = "opencv"
        if self._backend in ["mediapipe", "opencv"]:
            # Fallback to simple OpenCV face detection
            self._backend = "opencv"
            cascade_path = cv2.data.haarcascades + 'haarcascade_frontalface_default.xml'
            self._face_cascade = cv2.CascadeClassifier(cascade_path)
            if self._face_cascade.empty():
                logger.error("Erreur chargement haarcascade.")

        # P1-2: Détection matérielle GPU / CUDA
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        logger.info(f"Matériel d'inférence détecté : {self.device.type.upper()}")

        # --- Chargement du modèle CNN CK+ (PyTorch) ---
        self._pytorch_model = None
        self._pytorch_available = False
        try:
            model_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), "exports", "ck_cnn_model.pth")
            if os.path.exists(model_path):
                self._pytorch_model = EmotionCNN(num_classes=8)
                self._pytorch_model.load_state_dict(torch.load(model_path, map_location=self.device))
                self._pytorch_model.to(self.device)
                self._pytorch_model.eval()
                self._pytorch_available = True
                logger.info(f"Modèle PyTorch (CK+ CNN) chargé avec succès sur {self.device.type.upper()} depuis {model_path}")
            else:
                logger.warning(f"Modèle PyTorch introuvable à {model_path}. L'inférence émotionnelle échouera.")
        except Exception as e:
            logger.error(f"Erreur chargement modèle PyTorch : {e}")

    @property
    def backend(self) -> str:
        return self._backend

    @property
    def quality_degraded(self) -> bool:
        """True si le dernier appel a utilisé enforce_detection=False (qualité dégradée)."""
        return self._quality_degraded

    def set_analysis_interval(self, n: int) -> None:
        """Définit le throttling : analyser 1 frame sur N."""
        self._analysis_interval = max(1, n)
        logger.info(f"Intervalle d'analyse facial coding: 1/{self._analysis_interval}")

    def analyze_frame(self, frame: np.ndarray, session_id="",
                      stimulus_id="", timestamp_ms=0) -> FacialSample:
        self._frame_count += 1

        # Throttling : si ce n'est pas le tour, retourner le dernier sample
        if self._frame_count % self._analysis_interval != 0:
            if self._last_sample is not None:
                # Retourner le dernier sample avec le timestamp mis à jour
                s = FacialSample(
                    timestamp_ms=timestamp_ms,
                    session_id=session_id,
                    stimulus_id=stimulus_id,
                    face_detected=self._last_sample.face_detected,
                    emotion_primary=self._last_sample.emotion_primary,
                    emotion_scores=self._last_sample.emotion_scores,
                    valence=self._last_sample.valence,
                    arousal=self._last_sample.arousal,
                    face_confidence=self._last_sample.face_confidence,
                )
                return s
            return FacialSample(timestamp_ms=timestamp_ms, session_id=session_id,
                                stimulus_id=stimulus_id, face_detected=False)

        if self._deepface_available:
            sample = self._analyze_deepface(frame, session_id, stimulus_id, timestamp_ms)
        else:
            sample = self._analyze_opencv(frame, session_id, stimulus_id, timestamp_ms)

        self._last_sample = sample
        return sample

    # ─── Vérifications de qualité pré-analyse ─────────────────────────

    @staticmethod
    def check_brightness(frame: np.ndarray) -> tuple[bool, float]:
        """Vérifie la luminosité moyenne du visage.

        Returns:
            (is_sufficient, mean_value) — True si mean > MIN_BRIGHTNESS.
        """
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY) if len(frame.shape) == 3 else frame
        mean_val = float(np.mean(gray))
        return mean_val >= MIN_BRIGHTNESS, mean_val

    @staticmethod
    def check_face_ratio(face_region: dict, frame_shape: tuple) -> tuple[bool, float]:
        """Vérifie que le visage occupe un ratio suffisant de la frame.

        Args:
            face_region: dict avec 'x', 'y', 'w', 'h' (retourné par DeepFace).
            frame_shape: (height, width, channels) de la frame.

        Returns:
            (is_good_ratio, ratio) — True si ratio >= MIN_FACE_RATIO.
        """
        fh, fw = frame_shape[:2]
        face_area = face_region.get('w', 0) * face_region.get('h', 0)
        frame_area = fh * fw
        ratio = face_area / frame_area if frame_area > 0 else 0.0
        return ratio >= MIN_FACE_RATIO, ratio

    @staticmethod
    def extract_face_crop(frame: np.ndarray, face_region: dict,
                          margin: float = 0.2) -> np.ndarray:
        """Extrait le crop visage avec une marge proportionnelle.

        Args:
            frame: Image BGR complète.
            face_region: dict avec 'x', 'y', 'w', 'h'.
            margin: Pourcentage de marge autour du visage (0.2 = 20%).

        Returns:
            Crop BGR du visage.
        """
        h, w = frame.shape[:2]
        x = face_region.get('x') or 0
        y = face_region.get('y') or 0
        fw = face_region.get('w') or w
        fh = face_region.get('h') or h

        # Ajouter marge
        mx = int(fw * margin)
        my = int(fh * margin)
        x1 = max(0, x - mx)
        y1 = max(0, y - my)
        x2 = min(w, x + fw + mx)
        y2 = min(h, y + fh + my)

        crop = frame[y1:y2, x1:x2]
        if crop.size == 0:
            return frame  # Fallback sur la frame entière
        return crop

    # ─── Analyse DeepFace (corrigée) ──────────────────────────────────

    def _analyze_deepface(self, frame, sid, stim, ts) -> FacialSample:
        """Analyse émotionnelle via DeepFace avec vérifications de qualité.

        Pipeline :
        1. Vérifier luminosité → rejet si trop sombre
        2. enforce_detection=True avec backend retinaface
        3. Si échec → fallback enforce_detection=False + flag qualité dégradée
        4. Extraire crop visage + vérifier ratio
        5. Calculer scores, valence, arousal
        6. Logger tous les scores (pas seulement le dominant)
        """
        self._quality_degraded = False

        # ── 1. Vérification luminosité ──
        bright_ok, brightness = self.check_brightness(frame)
        if not bright_ok:
            logger.debug(f"Luminosité insuffisante: {brightness:.0f} < {MIN_BRIGHTNESS}")
            return FacialSample(
                timestamp_ms=ts, session_id=sid, stimulus_id=stim,
                face_detected=False, emotion_primary="neutral",
            )

        # ── 1.5 Optimisation : Redimensionnement pour accélérer DeepFace ──
        # RetinaFace est très lent sur du 1080p. On réduit la largeur à 640px max.
        h, w = frame.shape[:2]
        max_width = 640
        if w > max_width:
            ratio = max_width / w
            # Copie pour ne pas modifier la frame originale pointée par l'EyeTracker
            frame_resized = cv2.resize(frame, (max_width, int(h * ratio)), interpolation=cv2.INTER_AREA)
        else:
            frame_resized = frame.copy()

        # ── 2. Détection Visage avec DeepFace (RetinaFace) ──
        result = None
        face_region = {}
        assert self._DeepFace is not None
        try:
            res = self._DeepFace.extract_faces(
                img_path=frame_resized,
                detector_backend=DEEPFACE_BACKEND,
                enforce_detection=True,
                align=False,
            )
            result = res[0] if isinstance(res, list) else res
            face_region = result.get("facial_area", {})

        except ValueError as e:
            # enforce_detection=True a échoué → pas de visage détecté proprement
            # Fallback avec enforce_detection=False + flag qualité dégradée
            self._quality_degraded = True
            logger.debug(f"Détection stricte échouée ({e}), fallback enforce_detection=False")
            try:
                res = self._DeepFace.extract_faces(
                    img_path=frame_resized,
                    detector_backend=DEEPFACE_BACKEND,
                    enforce_detection=False,
                    align=False,
                )
                result = res[0] if isinstance(res, list) else res
                face_region = result.get("facial_area", {})
            except Exception as e:
                logger.warning(f"DeepFace fallback échoué: {e}")
                return FacialSample(
                    timestamp_ms=ts, session_id=sid, stimulus_id=stim,
                    face_detected=False,
                )

        except Exception as e:
            logger.warning(f"DeepFace erreur inattendue: {e}")
            return FacialSample(
                timestamp_ms=ts, session_id=sid, stimulus_id=stim,
                face_detected=False,
            )

        if result is None or not face_region:
            return FacialSample(
                timestamp_ms=ts, session_id=sid, stimulus_id=stim,
                face_detected=False,
            )

        # ── 3. Extraire le crop et les scores (CNN PyTorch) ──
        # On utilise le frame_resized car les coordonnées de face_region correspondent à celui-ci
        crop = self.extract_face_crop(frame_resized, face_region)
        
        scores = {}
        if self._pytorch_available:
            try:
                with torch.inference_mode():
                    tensor = preprocess_image(crop).to(self.device)
                    pred_class, probs = predict_emotion(self._pytorch_model, tensor)
                
                # CK+ Classes: 0=Neutral, 1=Anger, 2=Contempt, 3=Disgust, 4=Fear, 5=Happy, 6=Sadness, 7=Surprise
                classes_map = ["neutral", "angry", "contempt", "disgust", "fear", "happy", "sad", "surprise"]
                scores = {classes_map[i]: float(probs[i]) for i in range(len(classes_map))}
            except Exception as e:
                logger.error(f"Erreur inférence PyTorch : {e}")
                scores = {"neutral": 1.0}
        else:
            scores = {"neutral": 1.0}

        # ── 3.5 Anti-Biais "Neutral" ──
        # DeepFace a tendance à surestimer le neutre par défaut.
        if "neutral" in scores:
            scores["neutral"] *= self._neutral_penalty
            t = sum(scores.values())
            if t > 0:
                scores = {k: v/t for k,v in scores.items()}

        # ── 4. Vérifier le ratio visage/frame ──
        ratio_ok, face_ratio = self.check_face_ratio(face_region, frame.shape)

        if not ratio_ok and not self._quality_degraded:
            logger.debug(f"Visage trop petit: ratio={face_ratio:.2%} < {MIN_FACE_RATIO:.0%}")
            # On continue quand même mais on flag
            self._quality_degraded = True

        # ── 5. Appliquer la baseline si définie ──
        if self._baseline:
            scores = self._apply_baseline(scores)

        # ── 5.5 Lissage exponentiel (EMA) ──
        if self._ema_scores is None:
            self._ema_scores = scores
        else:
            self._ema_scores = {
                e: self._ema_alpha * scores.get(e, 0) + (1 - self._ema_alpha) * self._ema_scores.get(e, 0)
                for e in set(scores) | set(self._ema_scores)
            }
            t = sum(self._ema_scores.values())
            if t > 0:
                self._ema_scores = {k: v/t for k,v in self._ema_scores.items()}
        scores = self._ema_scores

        # ── 6. Calculer émotion dominante + valence/arousal ──
        primary = max(scores, key=lambda k: scores[k]) if scores else "neutral"
        val, aro = EmotionCalculator.compute(scores)
        conf = float(result.get("face_confidence", 0.0) or 0.0)

        # ── 7. Logging détaillé des scores ──
        scores_str = " | ".join(f"{e}={s:.1%}" for e, s in
                                 sorted(scores.items(), key=lambda x: -x[1]))
        quality_tag = " [DEGRADED]" if self._quality_degraded else ""
        logger.debug(
            f"Facial: {primary} (conf={conf:.2f}, ratio={face_ratio:.1%})"
            f"{quality_tag} — {scores_str}"
        )

        s = FacialSample(
            timestamp_ms=ts, session_id=sid, stimulus_id=stim,
            face_detected=True, emotion_primary=primary,
            valence=round(val, 4), arousal=round(aro, 4),
            face_confidence=round(conf, 4),
        )
        s.set_scores(scores)
        return s

    def _analyze_opencv(self, frame, sid, stim, ts) -> FacialSample:
        if self._face_cascade is None or self._face_cascade.empty():
            return FacialSample(timestamp_ms=ts, session_id=sid,
                                stimulus_id=stim, face_detected=False)
        try:
            gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
            faces = self._face_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5, minSize=(30, 30))
            detected = len(faces) > 0
            return FacialSample(timestamp_ms=ts, session_id=sid, stimulus_id=stim,
                                face_detected=detected, emotion_primary="neutral",
                                face_confidence=0.8 if detected else 0.0)
        except Exception:
            return FacialSample(timestamp_ms=ts, session_id=sid,
                                stimulus_id=stim, face_detected=False)

    def set_baseline(self, samples: list[FacialSample]) -> None:
        detected = [s for s in samples if s.face_detected]
        if not detected:
            return
        all_sc = [s.get_scores() for s in detected]
        emos = all_sc[0].keys() if all_sc else []
        self._baseline = {e: sum(sc.get(e,0) for sc in all_sc)/len(all_sc) for e in emos}
        logger.info(f"Baseline définie ({len(detected)} samples)")

    def _apply_baseline(self, scores: dict) -> dict:
        if not self._baseline: 
            return scores
            
        adj = {}
        for e, s in scores.items():
            base = self._baseline.get(e, 0)
            diff = s - base
            if diff > 0:
                adj[e] = diff
            else:
                # Soustraction douce : au lieu de couper à 0 net, on conserve 10% de la valeur
                # Cela évite que toutes les émotions tombent à zéro absolu.
                adj[e] = s * 0.1
                
        t = sum(adj.values())
        return {k: v/t for k,v in adj.items()} if t > 0 else scores

    def reset(self):
        self._baseline = None
        self._frame_count = 0
        self._last_sample = None
        self._quality_degraded = False
        self._ema_scores = None


class FacialCodingThread(QThread):
    """Thread d'acquisition facial coding non bloquant."""
    new_sample = pyqtSignal(object)
    face_lost = pyqtSignal()
    face_found = pyqtSignal()
    fps_updated = pyqtSignal(float)
    error_occurred = pyqtSignal(str)

    def __init__(self, coder: FacialCoder, db: DatabaseManager, session_id="",
                 capture=None, camera_index=None, fps_target=10, parent=None):
        super().__init__(parent)
        self._coder = coder
        self._db = db
        self._session_id = session_id
        self._capture = capture

        if camera_index is None:
            from core.plugins.camera_auto_detector import get_camera_detector
            best = get_camera_detector().get_best_camera(prefer_iphone=True)
            self._cam_idx = best.index if best else 0
        else:
            self._cam_idx = camera_index
        self._fps_target = fps_target
        self._owns_capture = capture is None
        self._running = False
        self._paused = False
        self._stimulus_id = ""
        self._get_ts = lambda: 0
        self._buffer: deque[FacialSample] = deque(maxlen=BUFFER_SIZE)
        self._buf_lock = threading.Lock()
        self._count = 0
        self._face_was = False

    def set_timestamp_source(self, func): self._get_ts = func
    def set_stimulus_id(self, sid): self._stimulus_id = sid
    def set_tracker(self, tracker): self._external_tracker = tracker
    def pause(self): self._paused = True
    def resume(self): self._paused = False
    def stop(self): self._running = False

    def process_external_frame(self, frame: np.ndarray, timestamp_ms: int):
        """Traite une frame reçue d'un producteur externe."""
        if self._paused or not self._running:
            return

        sample = self._coder.analyze_frame(
            frame, self._session_id, self._stimulus_id, timestamp_ms)

        self.new_sample.emit(sample)
        self._count += 1

        if sample.face_detected and not self._face_was:
            self.face_found.emit()
        elif not sample.face_detected and self._face_was:
            self.face_lost.emit()
        self._face_was = sample.face_detected

        with self._buf_lock:
            self._buffer.append(sample)

    def run(self):
        self._running = True
        # Créer la capture si on en est propriétaire et pas de tracker externe
        has_external = hasattr(self, '_external_tracker') and self._external_tracker is not None
        if self._owns_capture and not has_external:
            self._capture = cv2.VideoCapture(self._cam_idx, cv2.CAP_DSHOW)
            if not self._capture.isOpened():
                self.error_occurred.emit("Caméra inaccessible pour le Facial Coding.")
                return

        interval = 1.0 / self._fps_target
        fps_n, fps_t = 0, time.perf_counter()
        try:
            while self._running:
                if self._paused:
                    self.msleep(50); continue
                t0 = time.perf_counter()
                if hasattr(self, '_external_tracker') and self._external_tracker is not None:
                    frame = self._external_tracker.get_frame()
                    if frame is None:
                        self.msleep(10); continue
                else:
                    if self._capture is None:
                        self.msleep(10); continue
                    ret, frame = self._capture.read()
                    if not ret:
                        self.msleep(10); continue
                sample = self._coder.analyze_frame(
                    frame, self._session_id, self._stimulus_id, self._get_ts())
                self.new_sample.emit(sample)
                self._count += 1
                if sample.face_detected and not self._face_was:
                    self.face_found.emit()
                elif not sample.face_detected and self._face_was:
                    self.face_lost.emit()
                self._face_was = sample.face_detected
                with self._buf_lock:
                    self._buffer.append(sample)
                    
                # Flush periodique
                if self._count % 50 == 0:
                    self.flush_buffer(self._db)
                    
                fps_n += 1
                if time.perf_counter() - fps_t >= 1.0:
                    self.fps_updated.emit(fps_n / (time.perf_counter()-fps_t))
                    fps_n, fps_t = 0, time.perf_counter()
                sl = interval - (time.perf_counter()-t0)
                if sl > 0: self.msleep(int(sl*1000))
        except Exception as e:
            self.error_occurred.emit(str(e))
        finally:
            if self._owns_capture and self._capture:
                self._capture.release()

    def flush_buffer(self, db: DatabaseManager) -> int:
        with self._buf_lock:
            if not self._buffer: return 0
            samples = list(self._buffer); self._buffer.clear()
        return db.insert_facial_samples_batch(samples)

    @property
    def sample_count(self): return self._count
