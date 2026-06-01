"""
Point d'entrée principal — MAKRI TRACKING.

Lance l'application PyQt6 avec dark theme, détection caméra automatique,
et fenêtre principale premium.
"""
from __future__ import annotations

import sys
import webbrowser
from pathlib import Path

from PyQt6.QtWidgets import QApplication, QMessageBox
from PyQt6.QtGui import QFont
from PyQt6.QtCore import Qt, QTimer

from ui.main_window import MainWindow
from ui.splash_screen import MakriSplashScreen
from data.database import DatabaseManager
from core.plugins.camera_auto_detector import get_camera_detector
from utils.logger import get_logger
from utils.logger import get_logger
import multiprocessing

# Fonction racine pour le processus FastAPI (doit être top-level pour pickling)
def run_api(queue: multiprocessing.Queue):
    try:
        import uvicorn
        from api.rest_server import app
        # Configuration spécifique au processus enfant
        uvicorn.run(app, host="127.0.0.1", port=8000, log_level="error")
    except ImportError:
        pass
    except Exception as e:
        print(f"Erreur API: {e}")

def _initialize_camera(logger) -> bool:
    """Détecte automatiquement la meilleure caméra disponible.

    Priorité : iPhone (Camo Studio) > Webcam HD > Webcam standard.

    Returns:
        True si au moins une caméra est disponible.
    """
    detector = get_camera_detector()
    devices = detector.scan_all(test_latency=False)

    if not devices:
        msg = QMessageBox()
        msg.setWindowTitle("MAKRI TRACKING — Caméra requise")
        msg.setIcon(QMessageBox.Icon.Warning)
        msg.setText("Aucune caméra détectée")
        msg.setInformativeText(
            "Pour utiliser MAKRI TRACKING, vous devez connecter :\n\n"
            "• iPhone + Camo Studio (recommandé)\n"
            "  → Installez Camo sur l'App Store\n"
            "  → Connectez l'iPhone en USB-C\n\n"
            "• Ou une webcam HD (720p minimum)\n\n"
            "Voulez-vous ouvrir le guide d'installation ?"
        )
        msg.setStandardButtons(
            QMessageBox.StandardButton.Open
            | QMessageBox.StandardButton.Cancel
        )
        msg.setDefaultButton(QMessageBox.StandardButton.Open)

        if msg.exec() == QMessageBox.StandardButton.Open:
            webbrowser.open("https://reincubate.com/camo/")

        return False

    best = detector.get_best_camera(prefer_iphone=True)

    if best and best.is_iphone:
        logger.info(f"📱 iPhone détecté : {best.name} (index={best.index})")
    elif best:
        logger.info(f"🎥 Webcam détectée : {best.name} (index={best.index})")

    return True


def main() -> int:
    """Point d'entrée de l'application.

    Returns:
        int: Code de sortie (0 = succès).
    """
    logger = get_logger("main")
    logger.info("=== MAKRI TRACKING — Démarrage ===")

    # Initialiser l'application Qt
    app = QApplication(sys.argv)
    app.setApplicationName("MAKRI TRACKING")
    app.setApplicationVersion("2.0.0")
    app.setOrganizationName("MAKRI")

    # Appliquer l'icône globale de l'application (SVG)
    try:
        from PyQt6.QtGui import QIcon, QPixmap, QPainter
        from PyQt6.QtSvg import QSvgRenderer
        from resources.logo_makri import LOGO_ICON_SVG
        
        # Helper inline pour le rendu SVG
        renderer = QSvgRenderer(bytearray(LOGO_ICON_SVG, encoding='utf-8'))
        pixmap = QPixmap(64, 64)
        pixmap.fill(Qt.GlobalColor.transparent)
        painter = QPainter(pixmap)
        renderer.render(painter)
        painter.end()
        
        app.setWindowIcon(QIcon(pixmap))
        logger.info("Icône principale de l'application (SVG) configurée avec succès.")
    except Exception as e:
        logger.warning(f"Impossible de configurer l'icône de l'application : {e}")

    # Font par défaut
    font = QFont("Segoe UI", 12)
    app.setFont(font)

    # Racine du projet (gestion du bundle PyInstaller)
    if getattr(sys, 'frozen', False):
        # En mode exécutable, les ressources sont décompressées dans _MEIPASS
        project_root = Path(sys._MEIPASS)
    else:
        # En mode développement
        project_root = Path(__file__).parent

    # Note: Le thème QSS est chargé directement par MainWindow via makri_dark.py
    # Plus besoin de style.qss séparé (fusionné dans le thème v2.0)

    # Créer et afficher le Splash Screen
    splash = MakriSplashScreen()
    splash.show()
    app.processEvents()

    # Initialiser la base de données
    db_path = project_root / "data" / "eye_tracking.db"
    db = DatabaseManager(str(db_path))
    logger.info(f"Base de données : {db_path}")

    # Détection caméra automatique (étape critique)
    splash.set_status("Détection de la caméra...")
    app.processEvents()

    camera_ok = _initialize_camera(logger)

    if camera_ok:
        detector = get_camera_detector()
        best = detector.best_camera
        if best and best.is_iphone:
            splash.set_status(f"📱 {best.name} connecté")
        elif best:
            splash.set_status(f"🎥 {best.name}")
    else:
        splash.set_status("⚠️ Aucune caméra — mode limité")

    app.processEvents()

    # Préparer la fenêtre principale en arrière-plan
    splash.set_status("Chargement de l'interface...")
    app.processEvents()
    window = MainWindow()

    # Fonction pour fermer le splash et afficher la fenêtre principale
    def start_main():
        splash.close()
        window.show()
        logger.info("Fenêtre principale affichée.")

    # Attendre la fin de l'animation du splash screen (2.5 secondes)
    QTimer.singleShot(2500, start_main)

    # --- Démarrage de l'API REST en tâche de fond (P3) via multiprocessing ---
    data_queue = multiprocessing.Queue()
    api_process = multiprocessing.Process(target=run_api, args=(data_queue,), daemon=True)
    api_process.start()
    logger.info("Démarrage du processus API REST (multiprocessing) sur le port 8000...")

    # Boucle événementielle
    exit_code = app.exec()

    # Nettoyage
    db.close()
    logger.info(f"=== Application terminée (code={exit_code}) ===")
    return exit_code


if __name__ == "__main__":
    multiprocessing.freeze_support()
    sys.exit(main())
