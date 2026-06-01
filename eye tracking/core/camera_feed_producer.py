"""
Camera Feed Producer — Hardened (MAKRI TRACKING v2.0)
Acquisition vidéo ultra-optimisée avec fallback simulation et heartbeat.
"""
from __future__ import annotations

import time
import queue
from typing import Optional
import cv2
import numpy as np
import threading
from PyQt6.QtCore import QThread, pyqtSignal

from core.thread_manager import ThreadManager
from core.error_handler import ErrorHandler, ErrorLevel
from utils.logger import get_logger

logger = get_logger(__name__)

class CameraFeedProducer(QThread):
    """
    Thread producteur vidéo (30 FPS constant).
    
    Responsabilités :
    1. Connexion optimisée (CAP_DSHOW + BUFFERSIZE=1) pour réduire la latence USB.
    2. Scaling précoce de l'image (1280x720) pour alléger la RAM et les bus mémoire.
    3. Distribution vers deux files d'attente (Eye et Facial) avec Active Frame Dropping.
    4. Watchdog matériel : redémarrage si aucune frame pendant > 2.0s.
    5. Mode simulation si caméra indisponible > 3s.
    """
    frame_available = pyqtSignal()
    metrics_updated = pyqtSignal(dict)
    camera_error = pyqtSignal(str)
    camera_reconnected = pyqtSignal()

    THREAD_NAME = "CameraFeedProducer"
    SIMULATION_TIMEOUT_S = 3.0

    def __init__(self, camera_index: int = 0, 
                 eye_queue: Optional[queue.Queue] = None,
                 face_queue: Optional[queue.Queue] = None,
                 parent=None):
        super().__init__(parent)
        self.camera_index = camera_index
        
        self.eye_queue = eye_queue if eye_queue is not None else queue.Queue(maxsize=1)
        self.face_queue = face_queue if face_queue is not None else queue.Queue(maxsize=1)
        
        self._running = False
        self._paused = False
        self._cap: Optional[cv2.VideoCapture] = None
        self._simulation_mode = False
        
        self.dropped_eye = 0
        self.dropped_face = 0
        self._fps_count = 0
        self._total_frames = 0
        self.dropped_frames = 0
        
        self._ui_frame_lock = threading.Lock()
        self._latest_ui_frame = None
        
    def get_latest_ui_frame(self) -> Optional[np.ndarray]:
        with self._ui_frame_lock:
            return self._latest_ui_frame
        
    def pause(self):
        self._paused = True

    def resume(self):
        self._paused = False

    def stop(self):
        self._running = False
        self.wait(2000)
        ThreadManager.instance().unregister_thread(self.THREAD_NAME)

    def _init_camera(self) -> bool:
        """Initialise la caméra avec gestion d'erreur complète."""
        try:
            if self._cap is not None:
                self._cap.release()
        except Exception:
            pass
            
        try:
            self._cap = cv2.VideoCapture(self.camera_index, cv2.CAP_DSHOW)
            
            if not self._cap.isOpened():
                logger.error("Impossible d'ouvrir la caméra via CAP_DSHOW.")
                return False
                
            self._cap.set(cv2.CAP_PROP_BUFFERSIZE, 1)
            self._cap.set(cv2.CAP_PROP_FRAME_WIDTH, 1280)
            self._cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 720)
            self._cap.set(cv2.CAP_PROP_FPS, 30)
            
            self._simulation_mode = False
            return True
        except Exception as e:
            logger.error(f"Erreur initialisation caméra: {e}")
            ErrorHandler.instance().report(
                ErrorLevel.RECOVERABLE, self.THREAD_NAME,
                f"Erreur init caméra: {e}")
            return False

    def _generate_simulation_frame(self, timestamp_ms: int) -> np.ndarray:
        """Génère un frame noir avec texte d'avertissement (mode simulation)."""
        frame = np.zeros((720, 1280, 3), dtype=np.uint8)
        cv2.putText(frame, "MODE SIMULATION", (400, 340),
                    cv2.FONT_HERSHEY_SIMPLEX, 1.5, (0, 0, 255), 3)
        cv2.putText(frame, "Camera indisponible", (420, 400),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.8, (150, 150, 150), 2)
        cv2.putText(frame, f"t={timestamp_ms}ms", (520, 450),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.6, (100, 100, 100), 1)
        return frame

    def run(self):
        # Enregistrement ThreadManager
        ThreadManager.instance().register_thread(
            self.THREAD_NAME, self, max_lifetime=7200)

        camera_ok = self._init_camera()
        if not camera_ok:
            self.camera_error.emit("Échec initialisation Caméra. Passage en mode simulation.")
            self._simulation_mode = True
            ErrorHandler.instance().report(
                ErrorLevel.DEGRADED, self.THREAD_NAME,
                "Caméra indisponible → mode simulation activé")

        self._running = True
        logger.info(f"CameraFeedProducer: Démarrage "
                    f"({'SIMULATION' if self._simulation_mode else '30 FPS, CAP_DSHOW'})")
        
        last_frame_time = time.perf_counter()
        metrics_timer = time.perf_counter()
        heartbeat_timer = time.perf_counter()
        start_ts = time.perf_counter()
        no_frame_since = time.perf_counter()
        
        try:
            while self._running:
                now = time.perf_counter()

                # Heartbeat toutes les 5s
                if now - heartbeat_timer >= 5.0:
                    ThreadManager.instance().heartbeat(self.THREAD_NAME)
                    heartbeat_timer = now

                if self._paused:
                    self.msleep(50)
                    last_frame_time = time.perf_counter()
                    no_frame_since = time.perf_counter()
                    continue

                timestamp_ms = int((now - start_ts) * 1000)

                # ── Mode simulation ──
                if self._simulation_mode:
                    frame = self._generate_simulation_frame(timestamp_ms)
                    self.msleep(33)  # ~30 FPS

                    # Tenter de reconnecter toutes les 5s
                    if now - no_frame_since > 5.0:
                        if self._init_camera():
                            self._simulation_mode = False
                            self.camera_reconnected.emit()
                            logger.info("CameraFeedProducer: caméra reconnectée.")
                            no_frame_since = now
                            continue
                        no_frame_since = now

                else:
                    # ── Mode caméra réelle ──
                    ret, frame = self._cap.read()
                    
                    if not ret or frame is None:
                        if now - last_frame_time > 2.0:
                            logger.warning("Watchdog déclenché (>2.0s sans frame). "
                                           "Tentative de redémarrage.")
                            self.camera_error.emit(
                                "Perte de signal Camo Studio. Redémarrage...")
                            
                            if self._init_camera():
                                self.camera_reconnected.emit()
                                last_frame_time = time.perf_counter()
                            else:
                                # Caméra perdue > 3s → simulation
                                if now - last_frame_time > self.SIMULATION_TIMEOUT_S:
                                    self._simulation_mode = True
                                    ErrorHandler.instance().report(
                                        ErrorLevel.DEGRADED, self.THREAD_NAME,
                                        "Caméra perdue >3s → simulation")
                                else:
                                    self.msleep(500)
                        else:
                            self.msleep(5)
                        continue
                        
                    last_frame_time = now
                    no_frame_since = now
                    
                    if frame.shape[1] > 1280:
                        frame = cv2.resize(frame, (1280, 720),
                                           interpolation=cv2.INTER_LINEAR)

                # ── Distribution vers les queues ──
                self._fps_count += 1
                self._total_frames += 1
                packet = (frame, timestamp_ms)

                try:
                    self.eye_queue.put_nowait(packet)
                except queue.Full:
                    self.dropped_eye += 1
                    try:
                        self.eye_queue.get_nowait()
                        self.eye_queue.put_nowait(packet)
                    except (queue.Empty, queue.Full):
                        pass

                try:
                    self.face_queue.put_nowait(packet)
                except queue.Full:
                    self.dropped_face += 1
                    try:
                        self.face_queue.get_nowait()
                        self.face_queue.put_nowait(packet)
                    except (queue.Empty, queue.Full):
                        pass
                
                # Throttle UI frame emission to ~10 FPS to prevent event queue buildup
                if not hasattr(self, '_last_ui_emit'):
                    self._last_ui_emit = 0
                
                if now - self._last_ui_emit >= 0.1:
                    ui_frame = cv2.resize(frame, (640, 360),
                                          interpolation=cv2.INTER_NEAREST)
                    with self._ui_frame_lock:
                        self._latest_ui_frame = ui_frame
                    self.frame_available.emit()
                    self._last_ui_emit = now
                
                # Métriques toutes les secondes
                if now - metrics_timer >= 1.0:
                    fps = self._fps_count / (now - metrics_timer)
                    self.dropped_frames = self.dropped_eye + self.dropped_face
                    self.metrics_updated.emit({
                        "fps_effective": round(fps, 1),
                        "dropped_eye": self.dropped_eye,
                        "dropped_face": self.dropped_face,
                        "dropped_frames": self.dropped_frames,
                        "total_frames": self._total_frames,
                        "simulation_mode": self._simulation_mode,
                    })
                    self._fps_count = 0
                    metrics_timer = now
        finally:
            # Libération garantie de la caméra
            if self._cap is not None:
                try:
                    self._cap.release()
                except Exception:
                    pass
                self._cap = None

        logger.info(f"CameraFeedProducer: Arrêté (drops eye={self.dropped_eye}, "
                    f"face={self.dropped_face})")
