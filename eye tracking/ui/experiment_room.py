"""
Salle d'expérimentation — Orchestrateur de session complète.

Gère le workflow : Sélection participant → Calibration → Présentation stimuli
→ Enregistrement des données → Fin de session.
"""
from __future__ import annotations

from pathlib import Path
from queue import Queue
from typing import Optional, Any

from PyQt6.QtCore import Qt, pyqtSignal, pyqtSlot, QThread, QTimer  # type: ignore
from PyQt6.QtWidgets import (  # type: ignore
    QWidget, QVBoxLayout, QHBoxLayout, QLabel, QPushButton,
    QFrame, QComboBox, QStackedWidget, QMessageBox, QGroupBox,
    QFileDialog, QSizePolicy, QApplication,
)
from resources.themes.theme_constants import Theme
from ui.widgets.neuro_alert import NeuroAlert

from core.calibration_engine import CalibrationEngine
from core.eye_tracker import WebcamTracker
from core.camera_feed_producer import CameraFeedProducer
from core.eye_data_pipeline import EyeDataPipeline
from core.session_recorder import SessionRecorder
from core.stimulus_engine import StimulusDisplay
from core.session_synchronizer import SessionSynchronizer
from core.facial_coder import FacialCoder
from core.facial_coding_thread import FacialCodingThread
from core.sql_writer_worker import SQLWriterWorker
from core.performance_workers import (
    PerformanceMonitor, SessionSafetyNet,
)
from core.question_manager import QuestionManager
from data.database import DatabaseManager
from data.models import (
    Participant, Protocol, Session, Stimulus, StimulusType, SessionStatus,
    SyncMode, GazeSample
)
from ui.calibration_widget import CalibrationWidget
from ui.control_panel import ControlPanel
from ui.preflight_widget import PreFlightWidget
from ui.facial_viewer import FacialViewerWidget
from ui.kiosk_questionnaire import KioskQuestionnaireWindow
from ui.widgets.quality_widget import QualityWidget
from core.quality_monitor import QualityMonitor

from core.thread_manager import ThreadManager
from core.error_handler import ErrorHandler, ErrorLevel
from core.memory_monitor import MemoryMonitor
from utils.logger import get_logger

logger = get_logger(__name__)


class FacialCoderLoader(QThread):
    """Thread de chargement asynchrone du modèle IA (DeepFace/PyTorch) pour éviter de bloquer l'UI."""
    loaded = pyqtSignal(object)
    
    def run(self):
        coder = FacialCoder(backend="deepface")
        self.loaded.emit(coder)  # type: ignore

class ExperimentRoom(QWidget):
    """Page d'expérimentation complète.

    Workflow :
    1. Sélection du participant et du protocole
    2. Calibration du tracker
    3. Présentation des stimuli + enregistrement
    4. Affichage du panneau de contrôle

    Signals:
        session_completed: Émis avec le session_id quand la session est terminée.
    """
    session_completed = pyqtSignal(str)

    def __init__(self, parent: Optional[QWidget] = None) -> None:
        super().__init__(parent)
        self._db = DatabaseManager()
        self._tracker: Optional[WebcamTracker] = None
        self._pipeline: Optional[EyeDataPipeline] = None
        self._recorder: Optional[SessionRecorder] = None
        self._calibration_engine: Optional[CalibrationEngine] = None
        self._stimulus_display: Optional[StimulusDisplay] = None
        self._current_session: Optional[Session] = None
        self._loaded_stimuli: list[Stimulus] = []

        # Tri-sensor modules
        self._synchronizer = SessionSynchronizer(SyncMode.SEQUENTIAL)
        
        self._facial_coder: Optional[FacialCoder] = None
        self._facial_thread: Optional[FacialCodingThread] = None  # Legacy fallback
        
        # Chargement asynchrone du modèle IA
        self._coder_loader = FacialCoderLoader(self)
        self._coder_loader.loaded.connect(self._on_coder_loaded)  # type: ignore
        self._coder_loader.start()
        
        self._question_manager = QuestionManager(self._db)

        # Activer le memory monitor
        self._memory_monitor = MemoryMonitor.instance()
        self._memory_monitor.start()
        
        # Connecter le gestionnaire d'erreurs
        ErrorHandler.instance().error_reported.connect(self._on_error_reported)
        ErrorHandler.instance().critical_shutdown_requested.connect(self._on_critical_error)

        # ── Nouveaux Workers thread-safe ──
        self._camo_worker = None
        self._camo_source: Any = None
        self._facial_worker: Optional[FacialCodingThread] = None
        self._db_worker: Optional[SQLWriterWorker] = None
        self._perf_monitor: Optional[PerformanceMonitor] = None
        self._safety_net: Optional[SessionSafetyNet] = None
        
        # P1-1: Heartbeat
        self._heartbeat_timer = QTimer(self)
        self._heartbeat_timer.timeout.connect(self._on_heartbeat)
        
        self._eye_queue = Queue(maxsize=1)
        self._face_queue = Queue(maxsize=1)
        
        self._old_camo_workers = [] # Keep refs to prevent QThread destroyed crash

        self._setup_ui()
        self._refresh_data()

    def _setup_ui(self) -> None:
        """Construit l'interface."""
        main_layout = QVBoxLayout(self)
        main_layout.setContentsMargins(32, 24, 32, 24)
        main_layout.setSpacing(20)

        # --- En-tête ---
        title = QLabel("🧪 Salle d'Expérimentation")
        title.setStyleSheet(f"font-size: 24px; font-weight: 800; color: {Theme.TEXT_PRIMARY}; background: transparent;")
        main_layout.addWidget(title)

        subtitle = QLabel("Configurez et lancez une session d'eye tracking complète")
        subtitle.setStyleSheet(f"font-size: 13px; color: {Theme.TEXT_SECONDARY}; background: transparent;")
        main_layout.addWidget(subtitle)

        # --- Stack : setup / contrôle ---
        self._stack = QStackedWidget()

        # Page 1 : Configuration
        setup_page = self._create_setup_page()
        self._stack.addWidget(setup_page)

        # Page 2 : Contrôle en temps réel (avec panneaux latéraux)
        control_page = QWidget()
        control_layout = QHBoxLayout(control_page)
        control_layout.setContentsMargins(0, 0, 0, 0)
        control_layout.setSpacing(8)

        self._control_panel = ControlPanel()
        self._control_panel.emergency_stop.connect(self._on_emergency_stop)
        control_layout.addWidget(self._control_panel, stretch=3)

        # Panneau latéral droit : Facial Viewer + Questionnaire + Quality
        right_panel = QVBoxLayout()
        right_panel.setSpacing(8)
        
        self._quality_widget = QualityWidget()
        right_panel.addWidget(self._quality_widget)
        
        self._facial_viewer = FacialViewerWidget()
        right_panel.addWidget(self._facial_viewer, stretch=1)
        # Questionnaire Kiosk (fenêtre indépendante plein écran)
        self._questionnaire_widget = KioskQuestionnaireWindow()
        self._questionnaire_widget.questionnaire_completed.connect(
            self._on_questionnaire_completed)
        control_layout.addLayout(right_panel, stretch=1)

        self._stack.addWidget(control_page)

        main_layout.addWidget(self._stack, stretch=1)

    def _create_setup_page(self) -> QWidget:
        """Crée la page de configuration de session."""
        from PyQt6.QtWidgets import QScrollArea  # type: ignore

        # Scroll wrapper pour permettre au contenu de s'étendre
        page = QWidget()
        page_layout = QVBoxLayout(page)
        page_layout.setContentsMargins(0, 0, 0, 0)

        scroll = QScrollArea()
        scroll.setWidgetResizable(True)
        scroll.setFrameShape(QFrame.Shape.NoFrame)
        scroll.setStyleSheet("QScrollArea { background: transparent; border: none; }")

        content = QWidget()
        layout = QVBoxLayout(content)
        layout.setSpacing(16)
        layout.setContentsMargins(0, 0, 8, 0)

        secondary_btn_style = f"""
            QPushButton {{
                background: {Theme.BG_ELEVATED};
                border: 1px solid {Theme.BORDER};
                color: {Theme.TEXT_PRIMARY};
                font-size: 13px;
                border-radius: {Theme.RADIUS_SM};
                font-weight: 600;
                padding: 6px 12px;
            }}
            QPushButton:hover {{
                background: {Theme.BORDER_HOVER};
                border-color: {Theme.PRIMARY}40;
            }}
        """

        group_style = f"""
            QGroupBox {{
                border: 1px solid {Theme.BORDER}; border-radius: {Theme.RADIUS_MD};
                margin-top: 12px; padding: 20px; padding-top: 28px;
                color: {Theme.TEXT_PRIMARY}; font-weight: 600;
                background-color: {Theme.BG_CARD};
            }}
            QGroupBox::title {{
                subcontrol-origin: margin; padding: 2px 8px; color: {Theme.PRIMARY};
            }}
        """

        # --- Participant ---
        part_group = QGroupBox("1. Participant")
        part_group.setStyleSheet(group_style)
        part_layout = QHBoxLayout(part_group)

        part_layout.addWidget(QLabel("Participant :"))
        self._participant_combo = QComboBox()
        self._participant_combo.setMinimumWidth(250)
        part_layout.addWidget(self._participant_combo)

        new_part_btn = QPushButton("+ Nouveau")
        new_part_btn.setStyleSheet(secondary_btn_style)
        new_part_btn.clicked.connect(self._create_quick_participant)
        part_layout.addWidget(new_part_btn)
        part_layout.addStretch()

        layout.addWidget(part_group)

        # --- Stimuli ---
        stim_group = QGroupBox("2. Stimuli")
        stim_group.setStyleSheet(group_style)
        stim_layout = QVBoxLayout(stim_group)

        load_layout = QHBoxLayout()
        self._stim_label = QLabel("Aucun stimulus chargé")
        self._stim_label.setStyleSheet(f"color: {Theme.TEXT_SECONDARY}; background: transparent;")
        load_layout.addWidget(self._stim_label)

        load_btn = QPushButton("📁 Charger des images")
        load_btn.setStyleSheet(secondary_btn_style)
        load_btn.clicked.connect(self._load_stimuli)
        load_layout.addWidget(load_btn)
        stim_layout.addLayout(load_layout)

        layout.addWidget(stim_group)

        # --- Pre-Flight Check & Calibration ---
        calib_group = QGroupBox("3. Pre-Flight Check & Calibration")
        calib_group.setStyleSheet(group_style)
        calib_inner = QVBoxLayout(calib_group)

        # ---- Ajout du sélecteur de caméra ----
        cam_layout = QHBoxLayout()
        cam_icon = QLabel("📹")
        cam_icon.setStyleSheet("font-size: 16px; background: transparent;")
        cam_layout.addWidget(cam_icon)
        
        cam_label = QLabel("Caméra :")
        cam_label.setStyleSheet(f"font-size: 13px; font-weight: 600; color: {Theme.TEXT_SECONDARY}; background: transparent;")
        cam_layout.addWidget(cam_label)
        
        self._camera_combo = QComboBox()
        self._camera_combo.setMinimumWidth(300)
        self._camera_combo.setStyleSheet(f"""
            QComboBox {{
                background-color: {Theme.BG_DEEP}; color: {Theme.TEXT_PRIMARY};
                border: 1px solid {Theme.BORDER}; border-radius: {Theme.RADIUS_SM};
                padding: 6px 12px; font-size: 13px;
            }}
            QComboBox::drop-down {{ border: none; }}
            QComboBox QAbstractItemView {{
                background-color: {Theme.BG_DEEP}; color: {Theme.TEXT_PRIMARY};
                selection-background-color: {Theme.BG_ELEVATED};
            }}
        """)
        self._camera_combo.currentIndexChanged.connect(self._on_camera_changed)
        cam_layout.addWidget(self._camera_combo)

        scan_btn = QPushButton("🔄 Actualiser")
        scan_btn.setStyleSheet(secondary_btn_style)
        scan_btn.clicked.connect(self._refresh_cameras)
        cam_layout.addWidget(scan_btn)
        
        cam_layout.addStretch()
        calib_inner.addLayout(cam_layout)
        # ----------------------------------------

        self._preflight = PreFlightWidget()
        self._preflight.setMinimumHeight(480)
        self._preflight.calibration_requested.connect(self._start_calibration)
        calib_inner.addWidget(self._preflight)

        self._calib_status = QLabel("⚪ Non calibré")
        self._calib_status.setStyleSheet(
            f"font-size: 14px; color: {Theme.TEXT_SECONDARY}; background: transparent; padding-top: 8px;")
        calib_inner.addWidget(self._calib_status)

        layout.addWidget(calib_group)

        # --- Bouton lancement ---
        self._start_btn = QPushButton("⏳ Chargement de l'IA (Patientez...)")
        self._start_btn.setEnabled(False)
        self._start_btn.setFixedHeight(56)
        self._start_btn.setCursor(Qt.CursorShape.PointingHandCursor)
        self._start_btn.setStyleSheet(f"""
            QPushButton {{
                background: {Theme.GRADIENT_PRIMARY_BTN};
                color: {Theme.TEXT_INVERSE};
                font-weight: bold;
                border-radius: {Theme.RADIUS_MD};
                font-size: 15px;
                border: none;
            }}
            QPushButton:hover {{
                background-color: {Theme.PRIMARY_HOVER};
            }}
            QPushButton:pressed {{
                background-color: {Theme.PRIMARY_PRESSED};
            }}
        """)
        self._start_btn.clicked.connect(self._start_session)
        layout.addWidget(self._start_btn)

        scroll.setWidget(content)
        page_layout.addWidget(scroll)

        return page

    @pyqtSlot(object)
    def _on_coder_loaded(self, coder: FacialCoder) -> None:
        """Appelé quand le modèle IA a fini de charger."""
        self._facial_coder = coder
        self._facial_coder.set_analysis_interval(1)
        if hasattr(self, '_start_btn'):
            self._start_btn.setText("▶  Démarrer la session")
            self._start_btn.setEnabled(True)

    def _refresh_data(self) -> None:
        """Rafraîchit les données depuis la DB."""
        self._participant_combo.clear()
        participants = self._db.get_all_participants()
        for p in participants:
            label = f"{p.id} — Âge: {p.age or '?'} | {p.gender.value}"
            self._participant_combo.addItem(label, p.id)

        if not participants:
            self._participant_combo.addItem("Aucun participant", None)

    def _refresh_cameras(self) -> None:
        """Détecte les caméras et met à jour le sélecteur."""
        from core.plugins.camera_auto_detector import get_camera_detector
        detector = get_camera_detector()
        cameras = detector.scan_all()
        best = detector.get_best_camera(prefer_iphone=True)
        
        self._camera_combo.blockSignals(True)
        self._camera_combo.clear()
        
        best_idx = 0
        for i, cam in enumerate(cameras):
            label = f"{cam.name} ({cam.resolution_label}) - Score: {cam.quality_score:.1f}"
            self._camera_combo.addItem(label, cam.index)
            if best and cam.index == best.index:
                best_idx = i
                
        if not cameras:
            self._camera_combo.addItem("Aucune caméra détectée", None)
            
        self._camera_combo.setCurrentIndex(best_idx)
        self._camera_combo.blockSignals(False)

    def _on_camera_changed(self, index: int) -> None:
        """Change la caméra active pour le pre-flight."""
        cam_idx = self._camera_combo.currentData()
        if cam_idx is None:
            return
            
        logger.info(f"Changement manuel vers la caméra index: {cam_idx}")
        if self._preflight:
            self._preflight.stop()
        if self._tracker:
            self._tracker.stop()
        if self._camo_worker:
            self._camo_worker.stop()
            self._old_camo_workers.append(self._camo_worker)
            
        try:
            self._tracker = WebcamTracker()
            self._tracker.start()
            
            self._camo_worker = CameraFeedProducer(
                camera_index=cam_idx, 
                eye_queue=self._eye_queue, 
                face_queue=self._face_queue
            )
            self._camo_worker.start()
            
            self._preflight.set_camo_worker(self._camo_worker)
            self._preflight.set_tracker(self._tracker)
            self._preflight.start()
        except Exception as e:
            logger.error(f"Erreur lors du changement de caméra: {e}")

    def showEvent(self, a0) -> None:
        """Initialise le tracker et démarre le Pre-Flight à l'affichage."""
        super().showEvent(a0)
        
        if self._camera_combo.count() == 0:
            self._refresh_cameras()
            
        if not self._tracker:
            try:
                self._tracker = WebcamTracker()
                self._tracker.start()
                
                if not self._camo_worker:
                    cam_idx = self._camera_combo.currentData()
                    self._camo_worker = CameraFeedProducer(
                        camera_index=cam_idx if cam_idx is not None else 0,
                        eye_queue=self._eye_queue,
                        face_queue=self._face_queue
                    )
                    self._camo_worker.start()
                    
                self._preflight.set_camo_worker(self._camo_worker)
                self._preflight.set_tracker(self._tracker)
                self._preflight.start()
                logger.info("Pre-Flight Check démarré automatiquement.")
            except Exception as e:
                logger.warning(f"Impossible de démarrer le tracker pour le Pre-Flight: {e}")

    def hideEvent(self, a0) -> None:
        """Arrête le Pre-Flight et libère les ressources quand la page n'est plus visible."""
        super().hideEvent(a0)
        if self._preflight:
            self._preflight.stop()
        if self._tracker:
            self._tracker.stop()
            self._tracker = None
        if self._camo_worker:
            self._camo_worker.stop()
            self._old_camo_workers.append(self._camo_worker)
            self._camo_worker = None
        if hasattr(self, '_camo_source') and self._camo_source:
            self._camo_source.release()

    # ---- Stimuli ----

    def _load_stimuli(self) -> None:
        """Charge des images comme stimuli via dialogue fichier."""
        files, _ = QFileDialog.getOpenFileNames(
            self, "Charger des stimuli",
            "", "Images (*.jpg *.jpeg *.png *.bmp);;Vidéos (*.mp4 *.avi)")

        if not files:
            return

        self._loaded_stimuli: list[Stimulus] = []
        for f in files:
            path = Path(f)
            stim_type = StimulusType.VIDEO if path.suffix.lower() in (
                ".mp4", ".avi") else StimulusType.IMAGE

            stimulus = Stimulus(
                name=path.stem,
                stimulus_type=stim_type,
                file_path=str(path),
                duration_ms=5000,  # 5s par défaut pour les images
            )
            self._loaded_stimuli.append(stimulus)

        self._stim_label.setText(f"✅ {len(self._loaded_stimuli)} stimuli chargés")
        self._stim_label.setStyleSheet(
            f"color: {Theme.SUCCESS}; background: transparent; font-weight: 600;")
        logger.info(f"{len(self._loaded_stimuli)} stimuli chargés.")

    # ---- Participant rapide ----

    def _create_quick_participant(self) -> None:
        """Crée un participant anonyme rapidement."""
        participant = Participant()
        self._db.insert_participant(participant)
        self._refresh_data()
        # Sélectionner le dernier
        self._participant_combo.setCurrentIndex(
            self._participant_combo.count() - 1)
        logger.info(f"Participant créé : {participant.id}")

    # ---- Calibration ----

    def _start_calibration(self) -> None:
        """Lance l'écran de test qualité (30s) puis la calibration plein écran."""
        from ui.camera_test_widget import CameraTestWidget
        from core.camocam_source import CamoCamWorker
        from PyQt6.QtCore import QTimer
        
        try:
            self._calib_status.setText("⏳ Test Qualité en cours (30s)...")
            self._calib_status.setStyleSheet(f"color: {Theme.WARNING}; font-weight: bold;")
            
            # Afficher le widget de test
            self._camera_test_widget = CameraTestWidget(parent=self)
            self._camera_test_widget.test_passed.connect(self._on_camera_test_passed)
            self._camera_test_widget.retry_requested.connect(self._start_calibration) # Relancer
            self._camera_test_widget.show()
            
            # Forcer le rendu de l'interface graphique AVANT de bloquer avec OpenCV/MediaPipe
            from PyQt6.QtWidgets import QApplication
            QApplication.processEvents()
            
            if getattr(self, '_camo_worker', None):
                self._camo_worker.stop()
                
            if getattr(self, '_camo_source', None) is None:
                from core.camocam_source import CamoCamSource
                self._camo_source = CamoCamSource()
                
            cam_idx = self._camera_combo.currentData()
            self._camo_worker = CamoCamWorker(self._camo_source, run_quality=True, camera_index=cam_idx)
            
            if hasattr(self._camo_worker, 'quality_report'):
                self._camo_worker.quality_report.connect(self._camera_test_widget.on_quality_report)
            
            # Use error_occurred instead of camera_error if the worker has error_occurred
            if hasattr(self._camo_worker, 'camera_error'):
                self._camo_worker.camera_error.connect(self._on_camera_error)
            elif hasattr(self._camo_worker, 'error_occurred'):
                self._camo_worker.error_occurred.connect(self._on_camera_error)
            
            self._camera_test_widget.start_test()
            
            # Démarrer le thread de capture avec un léger délai pour que la fenêtre soit 100% affichée
            if hasattr(self._camo_worker, 'start'):
                QTimer.singleShot(100, self._camo_worker.start)
            
        except Exception as e:
            import traceback
            from utils.logger import get_logger
            logger = get_logger(__name__)
            logger.error(f"Erreur fatale dans _start_calibration: {e}")
            logger.error(traceback.format_exc())

    @pyqtSlot()
    def _on_camera_test_passed(self) -> None:
        """Appelé quand l'utilisateur clique sur Continuer après succès du test."""
        self._camera_test_widget.close()
        
        self._calib_status.setText("✅ Qualité optimale")
        self._calib_status.setStyleSheet(f"color: {Theme.SUCCESS}; font-weight: bold;")
        
        # Le worker tourne toujours en arrière-plan et émet frame_ready.
        # On lance la calibration
        self._calibration_widget = CalibrationWidget(num_points=9)
        # Assigner le tracker et le lier au worker
        self._calibration_widget.set_camo_worker(self._camo_worker)
        self._calibration_widget.calibration_finished.connect(
            self._on_calibration_done)
        self._calibration_widget.showFullScreen()

    @pyqtSlot(str)
    def _on_camera_error(self, err_msg: str) -> None:
        """Gère les erreurs de la CamoCam."""
        QMessageBox.critical(self, "Erreur Caméra", err_msg)
        self._calib_status.setText("🔴 Erreur Caméra")
        self._calib_status.setStyleSheet(f"color: {Theme.DANGER}; font-weight: bold;")

    @pyqtSlot(bool)
    def _on_calibration_done(self, success: bool) -> None:
        """Callback après calibration.

        Args:
            success: True si la calibration est réussie.
        """
        if success:
            self._calib_status.setText("🟢 Calibré")
            self._calib_status.setStyleSheet(
                f"font-size: 14px; color: {Theme.SUCCESS}; background: transparent; "
                "font-weight: 600;")
            # Récupérer l'engine de calibration
            if hasattr(self._calibration_widget, '_engine'):
                self._calibration_engine = self._calibration_widget._engine
        else:
            self._calib_status.setText("🔴 Calibration échouée")
            self._calib_status.setStyleSheet(
                f"font-size: 14px; color: {Theme.DANGER}; background: transparent; font-weight: 600;")

    # ---- Session ----

    def _start_session(self) -> None:
        """Démarre une session d'expérimentation complète."""
        # Vérifications
        participant_id = self._participant_combo.currentData()
        if not participant_id:
            NeuroAlert.warning(
                "Participant manquant",
                "Veuillez sélectionner ou créer un participant avant de démarrer la session.",
                parent=self)
            return

        if not self._loaded_stimuli:
            NeuroAlert.warning(
                "Stimuli manquants",
                "Veuillez charger au moins un stimulus avant de lancer la session.",
                parent=self)
            return

        # Arrêter le preflight et son tracker pour éviter les conflits OpenCV/QThread
        self._preflight.stop()
        if self._tracker:
            self._tracker.stop()

        # Créer le tracker SANS le démarrer (il sera démarré dans le QThread)
        cam_idx = self._camera_combo.currentData()
        self._tracker = WebcamTracker()

        # Créer la session en DB
        self._current_session = Session(
            participant_id=participant_id,
            protocol_id="",
            tracker_type="webcam",
        )
        self._db.insert_session(self._current_session)

        # Démarrer l'horloge maître
        self._synchronizer.register_module("eye")
        self._synchronizer.register_module("face")
        self._synchronizer.register_module("questionnaire")
        self._synchronizer.start()

        # ══ Architecture Workers thread-safe ══
        
        # Brancher la reconnexion au SessionSynchronizer
        if self._camo_worker:
            if hasattr(self._camo_worker, 'camera_reconnected'):
                try:
                    self._camo_worker.camera_reconnected.disconnect()
                except Exception:
                    pass
                self._camo_worker.camera_reconnected.connect(
                    lambda: logger.info("Caméra reconnectée")
                )
            
            if hasattr(self._camo_worker, 'metrics_updated'):
                try:
                    self._camo_worker.metrics_updated.disconnect()
                except Exception:
                    pass
                self._camo_worker.metrics_updated.connect(self._control_panel.on_metrics_updated)

        self._pipeline = EyeDataPipeline(
            tracker=self._tracker,
            eye_queue=self._eye_queue,
            calibration=self._calibration_engine,
            session_id=self._current_session.id
        )

        self._quality_monitor = QualityMonitor()
        self._quality_monitor.quality_updated.connect(self._quality_widget.update_metrics)
        self._quality_monitor.quality_warning.connect(self._quality_widget.show_warning)
        self._quality_monitor.quality_critical.connect(self._quality_widget.show_critical)
        self._quality_monitor.start()

        if self._camo_worker:
            self._camo_worker.metrics_updated.connect(
                lambda fps, qual: self._quality_monitor.add_sample(qual)
            )

        # Créer le recorder
        self._recorder = SessionRecorder(
            db=self._db,
            session=self._current_session,
        )

        # Connecter pipeline → recorder + control panel
        self._pipeline.new_gaze_sample.connect(self._on_pipeline_sample)
        self._pipeline.error_occurred.connect(self._on_pipeline_error)

        # 1. SQLWriterWorker — écriture SQLite asynchrone (batch 1000ms) avec transactions
        self._db_worker = SQLWriterWorker(
            db=self._db,
            flush_interval_ms=1000,
        )
        self._db_worker.error_occurred.connect(self._on_pipeline_error)
        
        # Connecter EyeDataPipeline au SQLWriterWorker
        self._pipeline.new_gaze_sample.connect(self._db_worker.add_gaze_sample)
        
        self._db_worker.start()

        # 2. FacialCodingThread — DeepFace dans son propre thread pool (max 10Hz)
        self._facial_worker = FacialCodingThread(
            coder=self._facial_coder,
            face_queue=self._face_queue,
            session_id=self._current_session.id,
            target_fps=10,
        )
        self._facial_worker.new_facial_sample.connect(
            self._facial_viewer.update_sample)
        
        # Connecter FacialCodingThread au SQLWriterWorker
        self._facial_worker.new_facial_sample.connect(self._db_worker.add_facial_sample)
        
        self._facial_worker.latency_updated.connect(self._control_panel.on_latency_updated)
        
        self._facial_worker.error_occurred.connect(self._on_pipeline_error)
        self._facial_worker.start()

        # 4. PerformanceMonitor — surveillance CPU/RAM/FPS
        self._perf_monitor = PerformanceMonitor(
            interval_s=5.0,
            queues={
                "eye": self._eye_queue,
                "face": self._face_queue,
            },
        )
        self._perf_monitor.start()

        # 5. SessionSafetyNet — crash recovery
        self._safety_net = SessionSafetyNet(
            db=self._db,
            db_worker=self._db_worker,
            session_id=self._current_session.id,
        )
        self._safety_net.activate()

        self._synchronizer.activate_module("eye")
        self._synchronizer.activate_module("face")

        # Configurer le questionnaire
        self._questionnaire_widget.set_timestamp_source(
            self._synchronizer.get_timestamp_ms)

        # Configurer le premier stimulus
        if self._loaded_stimuli:
            first = self._loaded_stimuli[0]
            self._control_panel.on_stimulus_changed(
                first.name, first.file_path)
            self._pipeline.set_stimulus_id(first.id)
            self._facial_worker.set_stimulus_id(first.id)
            self._synchronizer.log_stimulus_start(first.id)

        # Démarrer
        self._recorder.start()
        self._pipeline.start()
        self._control_panel.start_session()
        
        # P1-1: Démarrer heartbeat
        self._heartbeat_timer.start(5000)

        # Lancer l'affichage des stimuli sur l'écran participant
        self._stimulus_display = StimulusDisplay()
        self._stimulus_display.load_stimuli(
            self._loaded_stimuli,
            inter_stimulus_ms=1000,
            instructions="Fixez l'écran naturellement.\n"
                         "Ne bougez pas la tête.")
        self._stimulus_display.stimulus_started.connect(
            self._on_stimulus_started)
        self._stimulus_display.stimulus_ended.connect(
            self._on_stimulus_ended)
        self._stimulus_display.all_stimuli_finished.connect(
            self._on_all_finished)
        self._stimulus_display.showFullScreen()
        self._stimulus_display.start_presentation()

        # Basculer vers le panneau de contrôle
        self._stack.setCurrentIndex(1)

        logger.info(f"Session démarrée : {self._current_session.id}")

    @pyqtSlot(int, str, str)
    def _on_error_reported(self, level: int, source: str, message: str) -> None:
        """Log et affiche les erreurs du gestionnaire centralisé."""
        if level == ErrorLevel.CRITICAL:
            self._on_critical_error(f"{source}: {message}")
        elif level == ErrorLevel.DEGRADED:
            # Ne pas spammer l'UI avec des popups non bloquants, on pourrait juste logguer
            # ou afficher une notification discrète.
            pass

    @pyqtSlot(str)
    def _on_critical_error(self, err_msg: str) -> None:
        """Gère les erreurs critiques du pipeline ou ErrorHandler."""
        NeuroAlert.critical(
            "Erreur Critique",
            "Le pipeline de traitement a rencontré une erreur critique.",
            detail=err_msg, parent=self)
        self._stop_session()

    @pyqtSlot(str)
    def _on_pipeline_error(self, err_msg: str) -> None:
        """Gère les erreurs directes du pipeline (legacy)."""
        ErrorHandler.instance().report(ErrorLevel.CRITICAL, "Pipeline", err_msg)

    @pyqtSlot(object)
    def _on_pipeline_sample(self, sample: GazeSample) -> None:
        """Reçoit un sample du pipeline et l'envoie au recorder + UI."""
        if self._recorder:
            self._recorder.add_sample(sample)
        self._control_panel.on_gaze_sample(sample)

    @pyqtSlot(str, float)
    def _on_stimulus_started(self, stim_id: str, timestamp: float) -> None:
        """Callback quand un stimulus commence."""
        if self._pipeline:
            self._pipeline.set_stimulus_id(stim_id)
        if self._facial_worker:
            self._facial_worker.set_stimulus_id(stim_id)
        self._synchronizer.log_stimulus_start(stim_id)
        for s in self._loaded_stimuli:
            if s.id == stim_id:
                self._control_panel.on_stimulus_changed(s.name, s.file_path)
                break
        logger.info(f"Stimulus démarré : {stim_id}")

    @pyqtSlot(str, int)
    def _on_stimulus_ended(self, stim_id: str, duration_ms: int) -> None:
        """Callback quand un stimulus se termine."""
        self._synchronizer.log_stimulus_end(stim_id)
        if self._current_session is None:
            return
            
        # Mode séquentiel : questionnaire après chaque stimulus
        if self._synchronizer.mode == SyncMode.SEQUENTIAL:
            questions = self._question_manager.load_stimulus_questions(
                self._current_session.protocol_id, stim_id)
            if questions:
                self._synchronizer.log_questionnaire_start(stim_id)
                self._questionnaire_widget.load_questions(
                    questions, self._current_session.id, stim_id)
        logger.info(f"Stimulus terminé : {stim_id} ({duration_ms}ms)")

    @pyqtSlot()
    def _on_all_finished(self) -> None:
        """Callback quand tous les stimuli ont été présentés."""
        if self._current_session is None:
            return
            
        # Mode parallèle : questionnaire global post-session
        if self._synchronizer.mode == SyncMode.PARALLEL:
            questions = self._question_manager.load_protocol_questions(
                self._current_session.protocol_id)
            if questions:
                self._synchronizer.log_questionnaire_start()
                self._questionnaire_widget.load_questions(
                    questions, self._current_session.id)
                return  # Attendre fin du questionnaire
        self._stop_session()

    def _on_questionnaire_completed(self, responses: list) -> None:
        """Callback quand le questionnaire est terminé."""
        self._synchronizer.log_questionnaire_end()
        self._question_manager.save_responses_batch(responses)
        logger.info(f"Questionnaire terminé : {len(responses)} réponses")
        # Si tous les stimuli sont passés, arrêter la session
        if self._stimulus_display and not self._stimulus_display.isVisible():
            self._stop_session()

    def _on_emergency_stop(self) -> None:
        """Arrêt d'urgence."""
        logger.warning("Arrêt d'urgence de la session.")
        if self._stimulus_display:
            self._stimulus_display.stop_presentation()
            self._stimulus_display.close()
        if self._current_session:
            self._db.update_session_status(
                self._current_session.id, SessionStatus.ABORTED)
        self._stop_session()

    def _stop_session(self) -> None:
        """Arrête proprement la session en cours.

        Ordre d'arrêt critique (amont → aval) :
        1. CaptureWorker (arrête la production de frames)
        2. FacialWorker (finit l'analyse en cours, vide la queue)
        3. DatabaseWorker (flush final de tous les samples)
        4. Pipeline eye tracking + recorder
        5. PerformanceMonitor + SafetyNet
        """
        # Fermer le StimulusDisplay s'il est encore ouvert
        if self._stimulus_display:
            try:
                self._stimulus_display.stop_presentation()
                self._stimulus_display.close()
            except Exception:
                pass
                
        self._heartbeat_timer.stop()

        # ── 1. Arrêter CamoCamWorker (source des frames) ──
        if self._camo_worker:
            self._camo_worker.stop()
            
            # P1-3: Vérification de la validité scientifique (Frame drop)
            if self._current_session:
                total_frames = getattr(self._camo_worker, '_total_frames', 0)
                dropped_frames = getattr(self._camo_worker, 'dropped_frames', 0)
                if total_frames > 0:
                    drop_rate = dropped_frames / total_frames
                    if drop_rate > 0.15:  # MAX_DROP_RATE
                        logger.warning(f"Session {self._current_session.id} invalidée: drop rate {drop_rate:.1%} > 15%")
                        from core.audit_trail import AuditTrail
                        try:
                            # Marquer session en warning dans DB
                            self._db.update_session_status(self._current_session.id, SessionStatus.ABORTED) # Ou un nouveau status WARNING si existant
                            with self._db._db_lock:
                                cursor = self._db._conn.cursor()
                                AuditTrail.log_event(cursor, "INVALID_SESSION_QUALITY", "system", "session", self._current_session.id, {"drop_rate": drop_rate, "dropped": dropped_frames, "total": total_frames})
                                self._db._conn.commit()
                        except Exception as e:
                            logger.error(f"Erreur d'audit INVALID_SESSION_QUALITY: {e}")
                        
                        NeuroAlert.warning(
                            "Validité Scientifique Compromise",
                            f"Le taux de perte d'images ({drop_rate:.1%}) a dépassé le seuil critique (15%).\n"
                            "L'intégrité de cette session est invalidée.",
                            parent=self)
            
            # Délégation au ThreadManager
            self._camo_worker = None

        # ── 2. Arrêter FacialWorker (consommateur de frames) ──
        if self._facial_worker:
            self._facial_worker.stop()
            self._facial_worker = None

        # ── 3. Arrêter DatabaseWorker (flush final) ──
        if self._db_worker:
            self._db_worker.stop()
            # Flush de sécurité final
            self._db_worker.flush_remaining()
            logger.info(
                f"DatabaseWorker: {self._db_worker.total_flushed} samples écrits au total.")
            self._db_worker = None

        # ── 4. Arrêter le pipeline eye tracking + recorder ──
        if self._pipeline:
            self._pipeline.stop()
        if self._recorder:
            self._recorder.stop()
            
        # ── Arrêt gracieux de tous les threads par le ThreadManager ──
        logger.info("Fermeture centralisée via ThreadManager...")
        ThreadManager.instance().graceful_shutdown(timeout_per_thread=5.0)

        # Legacy fallback
        if self._facial_thread:
            self._facial_thread.stop()
            self._facial_thread.wait(3000)
            self._facial_thread = None

        # ── 5. Arrêter le monitoring ──
        if self._perf_monitor:
            self._perf_monitor.stop()
            self._perf_monitor.wait(2000)
            self._perf_monitor = None

        # ── 6. Désactiver le SafetyNet ──
        if self._safety_net:
            self._safety_net.deactivate()
            self._safety_net = None

        # Nettoyer les queues
        self._frame_queue = None
        self._eye_frame_queue = None
        self._sample_queue = None

        # Libérer la caméra
        if self._camo_source:
            self._camo_source.release()

        self._synchronizer.stop()
        self._control_panel.stop_session()
        self._facial_viewer.reset()
        self._questionnaire_widget.reset()

        # GC forcé post-session (Memory Monitor)
        MemoryMonitor.post_session_cleanup()
        
        # Effacer erreurs
        ErrorHandler.instance().clear()

        # Revenir à la page de setup
        self._stack.setCurrentIndex(0)

        if self._current_session:
            self.session_completed.emit(self._current_session.id)
            logger.info(f"Session terminée : {self._current_session.id}")

        self._current_session = None

    @pyqtSlot()
    def _on_heartbeat(self) -> None:
        """P1-1: Met à jour le timestamp de dernière activité pour le crash recovery."""
        if self._current_session:
            from datetime import datetime, timezone
            now_str = datetime.now(timezone.utc).isoformat()
            dropped = 0
            # Si le worker (par ex CameraFeedProducer ou PerformanceMonitor) expose dropped_frames
            if hasattr(self, '_camo_worker') and getattr(self._camo_worker, 'dropped_frames', 0) > 0:
                dropped = self._camo_worker.dropped_frames
            elif getattr(self._perf_monitor, 'dropped_frames', 0) > 0:
                dropped = self._perf_monitor.dropped_frames
            
            try:
                self._db.update_session_heartbeat(self._current_session.id, now_str, dropped)
            except Exception as e:
                logger.warning(f"Impossible de mettre à jour le heartbeat: {e}")
