"""
Panneau de contrôle expérimentateur pour Eye Tracking Neuromarketing.

Fenêtre temps réel affichant :
- Overlay gaze sur stimulus
- Indicateurs qualité du signal
- Statistiques d'enregistrement
- Bouton d'arrêt d'urgence
"""
from __future__ import annotations

import time
from collections import deque
from typing import Optional

from PyQt6.QtCore import Qt, QTimer, QRectF, pyqtSlot, pyqtSignal
from PyQt6.QtGui import (
    QPainter, QColor, QPen, QBrush, QFont, QPixmap, QImage,
    QPainterPath,
)
from PyQt6.QtWidgets import (
    QWidget, QVBoxLayout, QHBoxLayout, QLabel, QPushButton,
    QFrame, QGridLayout, QProgressBar, QGroupBox, QSizePolicy,
    QSplitter,
)

from data.models import GazeSample
from utils.logger import get_logger

logger = get_logger(__name__)

# Constantes visuelles
GAZE_TRAIL_LENGTH: int = 30
GAZE_DOT_RADIUS: int = 12
QUALITY_UPDATE_INTERVAL_MS: int = 200


class GazeOverlayWidget(QWidget):
    """Widget affichant le regard en temps réel sur le stimulus.

    Dessine un point de gaze animé avec trail (traînée)
    superposé à l'image du stimulus.
    """

    def __init__(self, parent: Optional[QWidget] = None) -> None:
        super().__init__(parent)
        self.setMinimumSize(480, 270)
        self.setSizePolicy(QSizePolicy.Policy.Expanding,
                           QSizePolicy.Policy.Expanding)

        self._stimulus_pixmap: Optional[QPixmap] = None
        self._gaze_trail: deque[tuple[float, float, float]] = deque(
            maxlen=GAZE_TRAIL_LENGTH)  # (x, y, quality)
        self._current_gaze: tuple[float, float] = (-1, -1)
        self._current_quality: float = 0.0
        self._is_blink: bool = False

        # Échelle d'affichage
        self._display_scale_x: float = 1.0
        self._display_scale_y: float = 1.0
        self._offset_x: float = 0.0
        self._offset_y: float = 0.0
        self._stimulus_w: int = 1920
        self._stimulus_h: int = 1080

        self.setStyleSheet("background-color: #0a0a1a; border-radius: 8px;")

    def set_stimulus(self, pixmap: QPixmap) -> None:
        """Définit l'image du stimulus à afficher en arrière-plan.

        Args:
            pixmap: Image du stimulus.
        """
        self._stimulus_pixmap = pixmap
        self._stimulus_w = pixmap.width()
        self._stimulus_h = pixmap.height()
        self._update_scale()
        self.update()

    def set_stimulus_from_path(self, path: str) -> None:
        """Charge un stimulus depuis un fichier image.

        Args:
            path: Chemin vers l'image.
        """
        pixmap = QPixmap(path)
        if not pixmap.isNull():
            self.set_stimulus(pixmap)

    def clear_stimulus(self) -> None:
        """Retire le stimulus affiché."""
        self._stimulus_pixmap = None
        self._gaze_trail.clear()
        self.update()

    def update_gaze(self, gaze_x: float, gaze_y: float,
                    quality: float, is_blink: bool) -> None:
        """Met à jour la position du regard.

        Args:
            gaze_x: Position X en pixels écran (-1 si perte).
            gaze_y: Position Y en pixels écran (-1 si perte).
            quality: Score de qualité (0-1).
            is_blink: True si clignement détecté.
        """
        self._current_gaze = (gaze_x, gaze_y)
        self._current_quality = quality
        self._is_blink = is_blink

        if gaze_x >= 0 and gaze_y >= 0 and not is_blink:
            self._gaze_trail.append((gaze_x, gaze_y, quality))

        self.update()

    def resizeEvent(self, event: object) -> None:
        """Recalcule l'échelle à chaque redimensionnement."""
        self._update_scale()
        super().resizeEvent(event)

    def _update_scale(self) -> None:
        """Calcule l'échelle de mapping stimulus → widget."""
        w = self.width()
        h = self.height()
        if self._stimulus_w > 0 and self._stimulus_h > 0:
            scale_x = w / self._stimulus_w
            scale_y = h / self._stimulus_h
            self._display_scale_x = min(scale_x, scale_y)
            self._display_scale_y = self._display_scale_x

            scaled_w = self._stimulus_w * self._display_scale_x
            scaled_h = self._stimulus_h * self._display_scale_y
            self._offset_x = (w - scaled_w) / 2
            self._offset_y = (h - scaled_h) / 2

    def _to_widget_coords(self, gaze_x: float,
                          gaze_y: float) -> tuple[float, float]:
        """Convertit les coordonnées écran en coordonnées widget.

        Args:
            gaze_x: X en pixels écran.
            gaze_y: Y en pixels écran.

        Returns:
            Tuple (widget_x, widget_y).
        """
        wx = self._offset_x + gaze_x * self._display_scale_x
        wy = self._offset_y + gaze_y * self._display_scale_y
        return (wx, wy)

    def paintEvent(self, event: object) -> None:
        """Dessine le stimulus et l'overlay gaze."""
        painter = QPainter(self)
        painter.setRenderHint(QPainter.RenderHint.Antialiasing)

        # Fond
        painter.fillRect(self.rect(), QColor(10, 10, 26))

        # Stimulus
        if self._stimulus_pixmap:
            scaled = self._stimulus_pixmap.scaled(
                self.size(), Qt.AspectRatioMode.KeepAspectRatio,
                Qt.TransformationMode.SmoothTransformation)
            x = (self.width() - scaled.width()) // 2
            y = (self.height() - scaled.height()) // 2
            painter.drawPixmap(x, y, scaled)
        else:
            # Placeholder
            painter.setPen(QColor(60, 60, 80))
            font = QFont("Segoe UI", 14)
            painter.setFont(font)
            painter.drawText(self.rect(), Qt.AlignmentFlag.AlignCenter,
                             "Aucun stimulus chargé")

        # Trail du regard
        trail_len = len(self._gaze_trail)
        for i, (gx, gy, q) in enumerate(self._gaze_trail):
            wx, wy = self._to_widget_coords(gx, gy)
            alpha = int(40 + (180 * i / max(trail_len, 1)))
            radius = 3 + (GAZE_DOT_RADIUS - 3) * (i / max(trail_len, 1))
            color = QColor(108, 99, 255, alpha)
            painter.setBrush(QBrush(color))
            painter.setPen(Qt.PenStyle.NoPen)
            painter.drawEllipse(QRectF(
                wx - radius / 2, wy - radius / 2, radius, radius))

        # Point de gaze actuel
        gx, gy = self._current_gaze
        if gx >= 0 and gy >= 0 and not self._is_blink:
            wx, wy = self._to_widget_coords(gx, gy)

            # Halo
            q = self._current_quality
            halo_color = QColor(74, 222, 128, 60) if q > 0.7 else \
                QColor(251, 191, 36, 60) if q > 0.4 else \
                QColor(239, 68, 68, 60)
            painter.setBrush(QBrush(halo_color))
            painter.setPen(Qt.PenStyle.NoPen)
            painter.drawEllipse(QRectF(
                wx - GAZE_DOT_RADIUS * 1.5, wy - GAZE_DOT_RADIUS * 1.5,
                GAZE_DOT_RADIUS * 3, GAZE_DOT_RADIUS * 3))

            # Point central
            dot_color = QColor(74, 222, 128) if q > 0.7 else \
                QColor(251, 191, 36) if q > 0.4 else \
                QColor(239, 68, 68)
            painter.setBrush(QBrush(dot_color))
            painter.drawEllipse(QRectF(
                wx - GAZE_DOT_RADIUS / 2, wy - GAZE_DOT_RADIUS / 2,
                GAZE_DOT_RADIUS, GAZE_DOT_RADIUS))

            # Crosshair
            painter.setPen(QPen(QColor(255, 255, 255, 80), 1))
            painter.drawLine(int(wx - 20), int(wy), int(wx + 20), int(wy))
            painter.drawLine(int(wx), int(wy - 20), int(wx), int(wy + 20))

        elif self._is_blink:
            # Indicateur de clignement
            painter.setPen(QColor(251, 191, 36))
            font = QFont("Segoe UI", 12, QFont.Weight.Bold)
            painter.setFont(font)
            painter.drawText(self.rect(), Qt.AlignmentFlag.AlignCenter,
                             "👁 Clignement détecté")

        painter.end()


class MetricCard(QFrame):
    """Petite carte affichant une métrique en temps réel."""

    def __init__(self, label: str, unit: str = "",
                 parent: Optional[QWidget] = None) -> None:
        super().__init__(parent)
        self.setObjectName("metricCard")
        self.setStyleSheet("""
            #metricCard {
                background-color: #12122a;
                border: 1px solid #2a2a4a;
                border-radius: 8px;
                padding: 8px;
            }
        """)
        self.setFixedHeight(72)

        layout = QVBoxLayout(self)
        layout.setContentsMargins(12, 8, 12, 8)
        layout.setSpacing(2)

        self._label = QLabel(label)
        self._label.setStyleSheet(
            "font-size: 10px; color: #6a6a8a; background: transparent; "
            "font-weight: 600; text-transform: uppercase;")
        layout.addWidget(self._label)

        value_layout = QHBoxLayout()
        self._value = QLabel("—")
        self._value.setStyleSheet(
            "font-size: 20px; font-weight: 800; color: #ffffff; "
            "background: transparent;")
        value_layout.addWidget(self._value)

        if unit:
            self._unit = QLabel(unit)
            self._unit.setStyleSheet(
                "font-size: 11px; color: #6a6a8a; background: transparent; "
                "padding-top: 6px;")
            value_layout.addWidget(self._unit)

        value_layout.addStretch()
        layout.addLayout(value_layout)

    def set_value(self, value: str, color: str = "#ffffff") -> None:
        """Met à jour la valeur affichée.

        Args:
            value: Nouvelle valeur à afficher.
            color: Couleur CSS de la valeur.
        """
        self._value.setText(value)
        self._value.setStyleSheet(
            f"font-size: 20px; font-weight: 800; color: {color}; "
            f"background: transparent;")


class ControlPanel(QWidget):
    """Panneau de contrôle pour l'expérimentateur.

    Affiche :
    - Overlay gaze temps réel sur le stimulus
    - Métriques : FPS, qualité, tracking rate, samples
    - Barre de qualité du signal
    - Timeline de la session
    - Bouton d'arrêt d'urgence

    Signals:
        emergency_stop: Émis quand le bouton d'arrêt d'urgence est pressé.
        session_paused: Émis quand la session est mise en pause.
        session_resumed: Émis quand la session reprend.
    """
    emergency_stop = pyqtSignal()
    session_paused = pyqtSignal()
    session_resumed = pyqtSignal()

    def __init__(self, parent: Optional[QWidget] = None) -> None:
        super().__init__(parent)
        self._is_paused: bool = False
        self._session_start_time: float = 0.0
        self._setup_ui()

    def _setup_ui(self) -> None:
        """Construit l'interface du panneau de contrôle."""
        main_layout = QVBoxLayout(self)
        main_layout.setContentsMargins(20, 16, 20, 16)
        main_layout.setSpacing(16)

        # --- En-tête ---
        header = QHBoxLayout()
        title = QLabel("🎛 Contrôle Expérimentateur")
        title.setStyleSheet(
            "font-size: 20px; font-weight: 700; color: #ffffff; "
            "background: transparent;")
        header.addWidget(title)
        
        # P1-2: Badge IA Inference (GPU/CPU)
        import torch
        is_gpu = torch.cuda.is_available()
        device_name = "🚀 GPU (CUDA)" if is_gpu else "💻 CPU"
        color = "#4ade80" if is_gpu else "#fbbf24"
        self._device_badge = QLabel(device_name)
        self._device_badge.setStyleSheet(f"""
            QLabel {{
                background-color: {color}20;
                color: {color};
                border: 1px solid {color};
                border-radius: 4px;
                padding: 4px 8px;
                font-weight: bold;
                font-size: 12px;
            }}
        """)
        header.addWidget(self._device_badge)
        
        header.addStretch()

        # Bouton Pause
        self._pause_btn = QPushButton("⏸ Pause")
        self._pause_btn.setStyleSheet("""
            QPushButton {
                background-color: #2a2a5a; color: #ffffff;
                border: 1px solid #3a3a7a; border-radius: 8px;
                padding: 8px 20px; font-weight: 600;
            }
            QPushButton:hover { background-color: #3a3a7a; }
        """)
        self._pause_btn.clicked.connect(self._toggle_pause)
        header.addWidget(self._pause_btn)

        # Bouton Arrêt d'urgence
        self._stop_btn = QPushButton("🛑 ARRÊT D'URGENCE")
        self._stop_btn.setObjectName("dangerButton")
        self._stop_btn.setStyleSheet("""
            QPushButton {
                background-color: #dc2626; color: #ffffff;
                border: none; border-radius: 8px;
                padding: 8px 24px; font-weight: 700; font-size: 13px;
            }
            QPushButton:hover { background-color: #ef4444; }
        """)
        self._stop_btn.clicked.connect(self._on_emergency_stop)
        header.addWidget(self._stop_btn)

        main_layout.addLayout(header)

        # --- Contenu principal (splitter) ---
        splitter = QSplitter(Qt.Orientation.Horizontal)
        splitter.setStyleSheet(
            "QSplitter::handle { background-color: #2a2a4a; width: 2px; }")

        # Gauche : Overlay gaze
        self._gaze_overlay = GazeOverlayWidget()
        splitter.addWidget(self._gaze_overlay)

        # Droite : Métriques et contrôles
        right_panel = QWidget()
        right_layout = QVBoxLayout(right_panel)
        right_layout.setContentsMargins(0, 0, 0, 0)
        right_layout.setSpacing(12)

        # Barre de qualité signal
        quality_group = QGroupBox("Qualité du signal")
        quality_group.setStyleSheet("""
            QGroupBox {
                border: 1px solid #2a2a4a; border-radius: 8px;
                margin-top: 12px; padding-top: 20px;
                color: #c0c0e0; font-weight: 600;
            }
            QGroupBox::title {
                subcontrol-origin: margin;
                padding: 2px 8px; color: #6c63ff;
            }
        """)
        q_layout = QVBoxLayout(quality_group)
        self._quality_bar = QProgressBar()
        self._quality_bar.setRange(0, 100)
        self._quality_bar.setValue(0)
        self._quality_bar.setTextVisible(True)
        self._quality_bar.setFormat("%v%")
        self._quality_bar.setStyleSheet("""
            QProgressBar {
                background-color: #12122a; border: 1px solid #2a2a4a;
                border-radius: 6px; text-align: center;
                color: #ffffff; font-weight: 600; min-height: 24px;
            }
            QProgressBar::chunk {
                background: qlineargradient(x1:0, y1:0, x2:1, y2:0,
                    stop:0 #6c63ff, stop:1 #4ade80);
                border-radius: 5px;
            }
        """)
        q_layout.addWidget(self._quality_bar)

        self._quality_status = QLabel("En attente...")
        self._quality_status.setStyleSheet(
            "font-size: 11px; color: #8888aa; background: transparent;")
        q_layout.addWidget(self._quality_status)
        right_layout.addWidget(quality_group)

        # Métriques en grille
        metrics_grid = QGridLayout()
        metrics_grid.setSpacing(8)

        self._metric_fps = MetricCard("FPS", "Hz")
        self._metric_quality = MetricCard("Qualité Moy.", "%")
        self._metric_tracking = MetricCard("Tracking", "%")
        self._metric_samples = MetricCard("Samples", "")
        self._metric_duration = MetricCard("Durée", "")
        self._metric_blinks = MetricCard("Blinks", "")
        self._metric_latency = MetricCard("Latence", "ms")
        self._metric_drops = MetricCard("Drops", "")

        metrics_grid.addWidget(self._metric_fps, 0, 0)
        metrics_grid.addWidget(self._metric_quality, 0, 1)
        metrics_grid.addWidget(self._metric_tracking, 1, 0)
        metrics_grid.addWidget(self._metric_samples, 1, 1)
        metrics_grid.addWidget(self._metric_duration, 2, 0)
        metrics_grid.addWidget(self._metric_blinks, 2, 1)
        metrics_grid.addWidget(self._metric_latency, 3, 0)
        metrics_grid.addWidget(self._metric_drops, 3, 1)

        right_layout.addLayout(metrics_grid)

        # Statut stimulus
        stim_group = QGroupBox("Stimulus actif")
        stim_group.setStyleSheet("""
            QGroupBox {
                border: 1px solid #2a2a4a; border-radius: 8px;
                margin-top: 12px; padding-top: 20px;
                color: #c0c0e0; font-weight: 600;
            }
            QGroupBox::title {
                subcontrol-origin: margin;
                padding: 2px 8px; color: #6c63ff;
            }
        """)
        stim_layout = QVBoxLayout(stim_group)
        self._stim_label = QLabel("Aucun")
        self._stim_label.setStyleSheet(
            "font-size: 14px; font-weight: 600; color: #ffffff; "
            "background: transparent;")
        stim_layout.addWidget(self._stim_label)
        self._stim_time = QLabel("—")
        self._stim_time.setStyleSheet(
            "font-size: 12px; color: #8888aa; background: transparent;")
        stim_layout.addWidget(self._stim_time)
        right_layout.addWidget(stim_group)

        right_layout.addStretch()

        right_panel.setFixedWidth(320)
        splitter.addWidget(right_panel)
        splitter.setStretchFactor(0, 3)
        splitter.setStretchFactor(1, 1)

        main_layout.addWidget(splitter, stretch=1)

        # Timer de mise à jour de la durée
        self._duration_timer = QTimer(self)
        self._duration_timer.setInterval(500)
        self._duration_timer.timeout.connect(self._update_duration)

        # Compteurs internes
        self._blink_count: int = 0
        self._sample_count: int = 0

    # ---- Slots publics ----

    @pyqtSlot(object)
    def on_gaze_sample(self, sample: GazeSample) -> None:
        """Reçoit un nouveau GazeSample du pipeline.

        Args:
            sample: GazeSample traité.
        """
        self._sample_count += 1
        if sample.blink:
            self._blink_count += 1

        self._gaze_overlay.update_gaze(
            sample.gaze_x, sample.gaze_y,
            sample.quality, sample.blink)

        # Mise à jour samples (throttled par l'affichage Qt)
        if self._sample_count % 10 == 0:
            self._metric_samples.set_value(str(self._sample_count))
            self._metric_blinks.set_value(str(self._blink_count))

    @pyqtSlot(float, float, bool)
    def on_quality_updated(self, avg_quality: float,
                           tracking_rate: float,
                           is_lost: bool) -> None:
        """Met à jour les indicateurs de qualité.

        Args:
            avg_quality: Qualité moyenne (0-1).
            tracking_rate: Taux de tracking (0-1).
            is_lost: True si le signal est perdu.
        """
        # Barre de qualité
        q_pct = int(avg_quality * 100)
        self._quality_bar.setValue(q_pct)

        if is_lost:
            self._quality_status.setText("⚠ SIGNAL PERDU")
            self._quality_status.setStyleSheet(
                "font-size: 11px; color: #ef4444; background: transparent; "
                "font-weight: 700;")
            color = "#ef4444"
        elif avg_quality > 0.7:
            self._quality_status.setText("✅ Signal excellent")
            self._quality_status.setStyleSheet(
                "font-size: 11px; color: #4ade80; background: transparent;")
            color = "#4ade80"
        elif avg_quality > 0.4:
            self._quality_status.setText("⚡ Signal acceptable")
            self._quality_status.setStyleSheet(
                "font-size: 11px; color: #fbbf24; background: transparent;")
            color = "#fbbf24"
        else:
            self._quality_status.setText("⚠ Signal faible")
            self._quality_status.setStyleSheet(
                "font-size: 11px; color: #ef4444; background: transparent;")
            color = "#ef4444"

        self._metric_quality.set_value(f"{q_pct}", color)
        self._metric_tracking.set_value(
            f"{tracking_rate:.0%}",
            "#4ade80" if tracking_rate > 0.85 else "#fbbf24")

    @pyqtSlot(float)
    def on_fps_updated(self, fps: float) -> None:
        """Met à jour l'indicateur FPS.

        Args:
            fps: FPS actuel.
        """
        color = "#4ade80" if fps >= 28 else "#fbbf24" if fps >= 20 else "#ef4444"
        self._metric_fps.set_value(f"{fps:.0f}", color)

    @pyqtSlot(float)
    def on_latency_updated(self, latency_ms: float) -> None:
        """Met à jour l'indicateur de latence."""
        color = "#4ade80" if latency_ms < 100 else "#fbbf24" if latency_ms < 200 else "#ef4444"
        self._metric_latency.set_value(f"{latency_ms:.0f}", color)

    @pyqtSlot(dict)
    def on_metrics_updated(self, metrics: dict) -> None:
        """Reçoit les métriques de CameraFeedProducer ou PerformanceMonitor."""
        if "fps" in metrics:
            self.on_fps_updated(metrics["fps"])
        if "dropped_frames" in metrics:
            drops = metrics["dropped_frames"]
            color = "#ef4444" if drops > 10 else "#fbbf24" if drops > 0 else "#ffffff"
            self._metric_drops.set_value(str(drops), color)
        
        # CPU/RAM du PerformanceMonitor
        # on peut potentiellement les afficher si besoin

    def on_stimulus_changed(self, stimulus_name: str,
                            stimulus_path: str = "") -> None:
        """Met à jour l'affichage du stimulus actif.

        Args:
            stimulus_name: Nom du stimulus.
            stimulus_path: Chemin vers l'image (pour l'overlay).
        """
        self._stim_label.setText(stimulus_name)
        if stimulus_path:
            self._gaze_overlay.set_stimulus_from_path(stimulus_path)

    def start_session(self) -> None:
        """Démarre le tracking de la durée de session."""
        self._session_start_time = time.perf_counter()
        self._sample_count = 0
        self._blink_count = 0
        self._duration_timer.start()

    def stop_session(self) -> None:
        """Arrête le tracking de la durée."""
        self._duration_timer.stop()

    # ---- Méthodes privées ----

    def _toggle_pause(self) -> None:
        """Bascule pause/reprise."""
        self._is_paused = not self._is_paused
        if self._is_paused:
            self._pause_btn.setText("▶ Reprendre")
            self.session_paused.emit()
        else:
            self._pause_btn.setText("⏸ Pause")
            self.session_resumed.emit()

    def _on_emergency_stop(self) -> None:
        """Déclenche l'arrêt d'urgence."""
        logger.warning("🛑 ARRÊT D'URGENCE déclenché par l'expérimentateur.")
        self.emergency_stop.emit()

    def _update_duration(self) -> None:
        """Met à jour l'affichage de la durée."""
        if self._session_start_time > 0:
            elapsed = time.perf_counter() - self._session_start_time
            mins = int(elapsed // 60)
            secs = int(elapsed % 60)
            self._metric_duration.set_value(f"{mins:02d}:{secs:02d}")
