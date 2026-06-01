"""
Fenêtre principale de l'application MAKRI TRACKING Neuromarketing.

QMainWindow avec sidebar de navigation premium et AnimatedStackedWidget.
Dark mode via QSS stylesheet MAKRI v2.0.
"""
from __future__ import annotations

import sys
from pathlib import Path
from typing import Optional

from PyQt6.QtCore import Qt, QSize, QPropertyAnimation, QEasingCurve
from PyQt6.QtGui import QIcon, QFont, QPixmap, QPainter, QColor
from PyQt6.QtSvg import QSvgRenderer
from PyQt6.QtWidgets import (
    QMainWindow, QWidget, QVBoxLayout, QHBoxLayout,
    QPushButton, QLabel, QStatusBar,
    QFrame, QSizePolicy, QApplication, QGraphicsOpacityEffect,
)

# Importer le thème et les constantes
sys.path.insert(0, str(Path(__file__).parent.parent))
from resources.themes.theme_constants import Theme, COLORS
from resources.themes.makri_dark import MAKRI_DARK_THEME
from resources.logo_makri import LOGO_ICON_SVG

from ui.widgets.animated_stacked_widget import AnimatedStackedWidget
from ui.widgets.toast_widget import ToastManager, ToastType

from ui.home_page import HomePage
from ui.calibration_widget import CalibrationWidget
from ui.experiment_room import ExperimentRoom
from ui.control_panel import ControlPanel
from ui.test_image_widget import TestImageWidget
from ui.analysis_dashboard import AnalysisDashboard
from ui.report_page import ReportPage
from ui.participants_page import ParticipantsPage
from ui.protocol_studio import ProtocolStudio
from ui.widgets.audit_panel import AuditPanel
from data.database import DatabaseManager
from utils.logger import get_logger

logger = get_logger(__name__)

# ── Répertoire des icônes SVG ──
ICONS_DIR = Path(__file__).parent.parent / "resources" / "icons"


class SidebarButton(QPushButton):
    """Bouton de navigation latéral avec icône SVG et indicateur actif."""

    def __init__(self, icon_path: str, label: str,
                 parent: Optional[QWidget] = None) -> None:
        super().__init__(parent)
        self._label_text = label
        self.setText(f"   {label}")
        self.setFixedHeight(46)
        self.setCursor(Qt.CursorShape.PointingHandCursor)
        self.setCheckable(True)

        # Charger l'icône SVG
        if icon_path and Path(icon_path).exists():
            icon = QIcon(icon_path)
            self.setIcon(icon)
            self.setIconSize(QSize(20, 20))

        self.setStyleSheet(f"""
            QPushButton {{
                background-color: transparent;
                color: {Theme.TEXT_MUTED};
                border: none;
                border-radius: 10px;
                text-align: left;
                padding-left: 14px;
                font-size: 13px;
                font-weight: 500;
                margin: 1px 8px;
            }}
            QPushButton:hover {{
                background-color: {Theme.BG_ELEVATED};
                color: {Theme.TEXT_PRIMARY};
            }}
            QPushButton:checked {{
                background-color: {Theme.SIDEBAR_ACTIVE_BG};
                color: {Theme.PRIMARY};
                border-left: 3px solid {Theme.PRIMARY};
                font-weight: 600;
            }}
        """)


class MainWindow(QMainWindow):
    """Fenêtre principale avec navigation par sidebar MAKRI premium.

    Attributes:
        _stack: AnimatedStackedWidget contenant toutes les pages.
        _sidebar_buttons: Liste des boutons de navigation.
        _toast_manager: Gestionnaire de notifications toast.
    """

    def __init__(self) -> None:
        super().__init__()
        self.setWindowTitle("MAKRI TRACKING — Plateforme Neuromarketing")
        self.setMinimumSize(1280, 720)
        self.resize(1440, 900)

        # Charger le logo principal de la plateforme en icône de fenêtre
        try:
            window_icon = QIcon(self._render_svg(LOGO_ICON_SVG, 64, 64))
            self.setWindowIcon(window_icon)
        except Exception as e:
            logger.warning(f"Impossible de charger l'icône de la fenêtre : {e}")

        # Charger le dark theme MAKRI v2.0
        self.setStyleSheet(MAKRI_DARK_THEME)

        # Widget central
        central = QWidget()
        central.setStyleSheet(f"background-color: {Theme.BG_DEEP};")
        self.setCentralWidget(central)
        main_layout = QHBoxLayout(central)
        main_layout.setContentsMargins(0, 0, 0, 0)
        main_layout.setSpacing(0)

        # Sidebar
        sidebar = self._create_sidebar()
        main_layout.addWidget(sidebar)

        # Content area avec header et stack
        content_area = QWidget()
        content_area.setStyleSheet(f"background-color: {Theme.BG_PRIMARY};")
        content_layout = QVBoxLayout(content_area)
        content_layout.setContentsMargins(0, 0, 0, 0)
        content_layout.setSpacing(0)

        # Page header (breadcrumb)
        self._page_header = self._create_page_header()
        content_layout.addWidget(self._page_header)

        # Stack de pages animé
        self._stack = AnimatedStackedWidget(duration=Theme.ANIM_NORMAL)
        self._stack.setStyleSheet(f"background-color: {Theme.BG_PRIMARY};")
        content_layout.addWidget(self._stack, stretch=1)

        main_layout.addWidget(content_area, stretch=1)

        # Toast Manager (overlay)
        self._toast_manager = ToastManager(self)

        # Créer les pages
        self._home_page = HomePage()
        self._home_page.new_session_requested.connect(
            lambda: self._navigate(2))
        self._home_page.calibration_requested.connect(
            self._open_calibration)
        self._home_page.protocol_requested.connect(
            lambda: self._navigate(1))
        self._home_page.analysis_requested.connect(
            lambda: self._navigate(3))
        self._home_page.export_requested.connect(
            lambda: self._navigate(4))
        self._home_page.test_image_requested.connect(
            lambda: self._navigate(5))

        self._stack.addWidget(self._home_page)  # index 0

        # Pages réelles
        self._create_real_pages()
        self._create_placeholder_pages()

        # Sélectionner la page d'accueil
        self._navigate(0)

        # --- P0-4: Maintenance périodique SQLite (Incremental Vacuum) ---
        self._maintenance_timer = QTimer(self)
        self._maintenance_timer.timeout.connect(DatabaseManager().run_maintenance)
        self._maintenance_timer.start(30 * 60 * 1000)  # 30 minutes

        logger.info("MainWindow MAKRI v2.0 initialisée.")

    def _create_sidebar(self) -> QFrame:
        """Crée la barre latérale premium avec logo et navigation SVG."""
        sidebar = QFrame()
        sidebar.setObjectName("sidebar")
        sidebar.setStyleSheet(f"""
            QFrame#sidebar {{
                background-color: {Theme.SIDEBAR_BG};
                border-right: 1px solid {Theme.SIDEBAR_BORDER};
                min-width: 250px;
                max-width: 250px;
            }}
        """)

        layout = QVBoxLayout(sidebar)
        layout.setContentsMargins(12, 20, 12, 20)
        layout.setSpacing(4)

        # ── LOGO ──
        logo_container = QWidget()
        logo_container.setStyleSheet("background: transparent;")
        logo_layout = QHBoxLayout(logo_container)
        logo_layout.setContentsMargins(12, 0, 0, 0)
        logo_layout.setSpacing(12)

        # Rendu SVG du logo
        logo_label = QLabel()
        logo_label.setStyleSheet("background: transparent;")
        logo_pixmap = self._render_svg(LOGO_ICON_SVG, 42, 42)
        logo_label.setPixmap(logo_pixmap)
        logo_layout.addWidget(logo_label)

        text_container = QWidget()
        text_container.setStyleSheet("background: transparent;")
        text_layout = QVBoxLayout(text_container)
        text_layout.setContentsMargins(0, 0, 0, 0)
        text_layout.setSpacing(0)

        makri_text = QLabel("MAKRI")
        makri_text.setStyleSheet(f"""
            font-size: 20px;
            font-weight: 800;
            color: {Theme.TEXT_PRIMARY};
            letter-spacing: 2px;
            background: transparent;
        """)

        tracking_text = QLabel("TRACKING")
        tracking_text.setStyleSheet(f"""
            font-size: 10px;
            font-weight: 500;
            color: {Theme.PRIMARY};
            letter-spacing: 5px;
            background: transparent;
        """)

        text_layout.addWidget(makri_text)
        text_layout.addWidget(tracking_text)

        logo_layout.addWidget(text_container, stretch=1)
        layout.addWidget(logo_container)

        # ── Séparateur ──
        sep = QFrame()
        sep.setFixedHeight(1)
        sep.setStyleSheet(f"""
            background: qlineargradient(x1:0, y1:0, x2:1, y2:0,
                stop:0 {Theme.PRIMARY}40,
                stop:0.5 {Theme.BORDER},
                stop:1 transparent);
            margin: 16px 12px 12px 12px;
        """)
        layout.addWidget(sep)

        # ── NAVIGATION ──
        nav_label = QLabel("NAVIGATION")
        nav_label.setStyleSheet(f"""
            font-size: {Theme.FONT_SIZE_CAPTION};
            color: {Theme.TEXT_MUTED};
            letter-spacing: 3px;
            padding-left: 20px;
            margin-bottom: 4px;
            font-weight: 600;
            background: transparent;
        """)
        layout.addWidget(nav_label)

        self._sidebar_buttons: list[SidebarButton] = []
        self._page_titles: list[str] = []

        nav_items = [
            (str(ICONS_DIR / "activity.svg"), "Accueil"),
            (str(ICONS_DIR / "clipboard.svg"), "Protocoles"),
            (str(ICONS_DIR / "flask.svg"), "Expérimentation"),
            (str(ICONS_DIR / "bar-chart-2.svg"), "Analyse"),
            (str(ICONS_DIR / "download.svg"), "Rapports"),
            (str(ICONS_DIR / "image.svg"), "Test Image"),
            (str(ICONS_DIR / "users.svg"), "Participants"),
            (str(ICONS_DIR / "shield.svg"), "Audit Trail"),
        ]

        for i, (icon_path, label) in enumerate(nav_items):
            btn = SidebarButton(icon_path, label)
            btn.clicked.connect(
                lambda checked, idx=i: self._navigate(idx))
            self._sidebar_buttons.append(btn)
            self._page_titles.append(label)
            layout.addWidget(btn)

        layout.addStretch()

        # ── STATUT TRACKER ──
        status_frame = QFrame()
        status_frame.setObjectName("statusFrame")
        status_frame.setStyleSheet(f"""
            QFrame#statusFrame {{
                background-color: {Theme.BG_CARD};
                border: 1px solid {Theme.BORDER};
                border-radius: {Theme.RADIUS_MD};
                margin: 4px;
            }}
        """)
        status_layout = QVBoxLayout(status_frame)
        status_layout.setContentsMargins(14, 12, 14, 12)
        status_layout.setSpacing(8)

        # Titre statut
        status_title = QLabel("SYSTÈME")
        status_title.setStyleSheet(f"""
            font-size: {Theme.FONT_SIZE_CAPTION};
            color: {Theme.TEXT_MUTED};
            letter-spacing: 2px;
            font-weight: 700;
            background: transparent;
        """)
        status_layout.addWidget(status_title)

        # Tracker status avec dot
        tracker_row = QHBoxLayout()
        tracker_row.setSpacing(8)

        self._tracker_dot = QLabel("●")
        self._tracker_dot.setFixedSize(16, 16)
        self._tracker_dot.setAlignment(Qt.AlignmentFlag.AlignCenter)
        self._tracker_dot.setStyleSheet(f"""
            color: {Theme.TEXT_MUTED};
            font-size: 10px;
            background: transparent;
        """)
        tracker_row.addWidget(self._tracker_dot)

        self._tracker_status = QLabel("Tracker : Déconnecté")
        self._tracker_status.setStyleSheet(f"""
            color: {Theme.TEXT_MUTED};
            font-size: 12px;
            font-weight: 500;
            background: transparent;
        """)
        tracker_row.addWidget(self._tracker_status, 1)
        status_layout.addLayout(tracker_row)

        # FPS
        self._fps_label = QLabel("FPS : —")
        self._fps_label.setStyleSheet(f"""
            color: {Theme.TEXT_MUTED};
            font-size: 11px;
            padding-left: 24px;
            background: transparent;
        """)
        status_layout.addWidget(self._fps_label)

        # Qualité
        self._quality_label = QLabel("Qualité : —")
        self._quality_label.setStyleSheet(f"""
            color: {Theme.TEXT_MUTED};
            font-size: 11px;
            padding-left: 24px;
            background: transparent;
        """)
        status_layout.addWidget(self._quality_label)

        layout.addWidget(status_frame)

        # ── Version ──
        version = QLabel("v2.0.0")
        version.setAlignment(Qt.AlignmentFlag.AlignCenter)
        version.setStyleSheet(f"""
            color: {Theme.TEXT_MUTED};
            font-size: {Theme.FONT_SIZE_CAPTION};
            padding: 8px;
            background: transparent;
        """)
        layout.addWidget(version)

        return sidebar

    def _create_page_header(self) -> QFrame:
        """Crée le header de page avec titre et breadcrumb."""
        header = QFrame()
        header.setObjectName("pageHeader")
        header.setFixedHeight(52)
        header.setStyleSheet(f"""
            QFrame#pageHeader {{
                background-color: {Theme.BG_PRIMARY};
                border-bottom: 1px solid {Theme.BORDER};
            }}
        """)

        layout = QHBoxLayout(header)
        layout.setContentsMargins(32, 0, 32, 0)

        self._page_title_label = QLabel("Accueil")
        self._page_title_label.setStyleSheet(f"""
            font-size: 15px;
            font-weight: 600;
            color: {Theme.TEXT_PRIMARY};
            background: transparent;
        """)
        layout.addWidget(self._page_title_label)

        layout.addStretch()

        # Indicateur de session
        self._session_indicator = QLabel()
        self._session_indicator.setStyleSheet(f"""
            color: {Theme.TEXT_MUTED};
            font-size: 12px;
            background: transparent;
        """)
        layout.addWidget(self._session_indicator)

        return header

    @staticmethod
    def _render_svg(svg_content: str, width: int, height: int) -> QPixmap:
        """Rend un SVG en QPixmap.

        Args:
            svg_content: Contenu SVG en string.
            width: Largeur du pixmap.
            height: Hauteur du pixmap.
        """
        renderer = QSvgRenderer(bytearray(svg_content, encoding='utf-8'))
        pixmap = QPixmap(width, height)
        pixmap.fill(Qt.GlobalColor.transparent)
        painter = QPainter(pixmap)
        renderer.render(painter)
        painter.end()
        return pixmap

    def _create_real_pages(self) -> None:
        """Crée les pages fonctionnelles implémentées."""
        self._protocol_studio = ProtocolStudio()
        self._stack.addWidget(self._protocol_studio)  # index 1

        self._experiment_room = ExperimentRoom()
        self._experiment_room.session_completed.connect(
            self._on_session_completed)
        self._stack.addWidget(self._experiment_room)  # index 2

    def _create_placeholder_pages(self) -> None:
        """Crée les pages restantes."""
        self._analysis_dashboard = AnalysisDashboard()
        self._stack.addWidget(self._analysis_dashboard)  # index 3

        self._report_page = ReportPage()
        self._stack.addWidget(self._report_page)  # index 4

        self._test_image = TestImageWidget()
        self._stack.addWidget(self._test_image)  # index 5

        self._participants_page = ParticipantsPage()
        self._stack.addWidget(self._participants_page)  # index 6
        self._home_page.participants_requested.connect(
            lambda: self._navigate(6))
            
        self._audit_panel = AuditPanel(db=DatabaseManager())
        self._stack.addWidget(self._audit_panel)  # index 7

    def _on_session_completed(self, session_id: str) -> None:
        """Callback quand une session est terminée.

        Args:
            session_id: ID de la session terminée.
        """
        logger.info(f"Session {session_id} terminée — retour à l'accueil.")
        self.show_toast(
            f"Session {session_id[:8]}… terminée avec succès !",
            ToastType.SUCCESS
        )
        self._navigate(0)

    def update_tracker_status(self, connected: bool, fps: float = 0.0,
                              quality: float = 0.0) -> None:
        """Met à jour les indicateurs de la sidebar.

        Args:
            connected: True si le tracker est connecté.
            fps: FPS actuel.
            quality: Score de qualité actuel.
        """
        if connected:
            self._tracker_dot.setStyleSheet(f"""
                color: {Theme.SUCCESS};
                font-size: 10px;
                background: transparent;
            """)
            self._tracker_status.setText("Tracker : Connecté")
            self._tracker_status.setStyleSheet(f"""
                color: {Theme.SUCCESS};
                font-size: 12px;
                font-weight: 600;
                background: transparent;
            """)
        else:
            self._tracker_dot.setStyleSheet(f"""
                color: {Theme.TEXT_MUTED};
                font-size: 10px;
                background: transparent;
            """)
            self._tracker_status.setText("Tracker : Déconnecté")
            self._tracker_status.setStyleSheet(f"""
                color: {Theme.TEXT_MUTED};
                font-size: 12px;
                font-weight: 500;
                background: transparent;
            """)

        self._fps_label.setText(f"FPS : {fps:.0f}")

        if quality > 0.7:
            q_color = Theme.SUCCESS
        elif quality > 0.4:
            q_color = Theme.WARNING
        else:
            q_color = Theme.DANGER

        self._quality_label.setText(f"Qualité : {quality:.0%}")
        self._quality_label.setStyleSheet(f"""
            color: {q_color};
            font-size: 11px;
            font-weight: 600;
            padding-left: 24px;
            background: transparent;
        """)

    def _navigate(self, index: int) -> None:
        """Navigue vers la page à l'index donné.

        Args:
            index: Index de la page dans le QStackedWidget.
        """
        if 0 <= index < self._stack.count():
            self._stack.setCurrentIndex(index)
            for i, btn in enumerate(self._sidebar_buttons):
                btn.setChecked(i == index)

            # Mettre à jour le titre de page
            if index < len(self._page_titles):
                self._page_title_label.setText(self._page_titles[index])

            if index == 0:
                self._home_page.refresh_data()
            elif index == 3:
                self._analysis_dashboard._refresh_sessions()

    def show_toast(self, message: str,
                   toast_type: ToastType = ToastType.INFO) -> None:
        """Affiche une notification toast.

        Args:
            message: Texte de la notification.
            toast_type: Type de toast.
        """
        self._toast_manager.show_toast(message, toast_type)

    def _open_calibration(self) -> None:
        """Ouvre le widget de calibration en plein écran."""
        self._calibration = CalibrationWidget()
        self._calibration.calibration_finished.connect(
            self._on_calibration_finished)
        self._calibration.showFullScreen()

    def _on_calibration_finished(self, success: bool) -> None:
        """Callback après calibration.

        Args:
            success: True si la calibration est réussie.
        """
        if success:
            logger.info("Calibration réussie.")
            self.show_toast("Calibration réussie !", ToastType.SUCCESS)
        else:
            logger.warning("Calibration échouée ou annulée.")
            self.show_toast("Calibration échouée.", ToastType.WARNING)

    def resizeEvent(self, event) -> None:
        """Repositionne le toast manager lors du redimensionnement."""
        super().resizeEvent(event)
        # Placer le toast manager en bas-droite
        self._toast_manager.setGeometry(
            self.width() - 480, self.height() - 250,
            460, 230
        )

    def closeEvent(self, event) -> None:
        """Gère la fermeture propre de l'application et libère les ressources."""
        logger.info("Fermeture de l'application...")

        if hasattr(self, '_experiment_room'):
            self._experiment_room._stop_session()
            if hasattr(self._experiment_room, '_preflight'):
                self._experiment_room._preflight.stop()
            if hasattr(self._experiment_room, '_tracker') \
                    and self._experiment_room._tracker:
                self._experiment_room._tracker.stop()

        import cv2
        cv2.destroyAllWindows()

        event.accept()
