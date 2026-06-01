"""
Widget AuditPanel pour visualiser la chaîne d'audit de manière sécurisée.
"""
from PyQt6.QtWidgets import (
    QWidget, QVBoxLayout, QHBoxLayout, QTableWidget, QTableWidgetItem,
    QPushButton, QLabel, QHeaderView, QMessageBox, QComboBox, QFileDialog
)
import json
import hashlib
import hmac
from pathlib import Path
from PyQt6.QtCore import Qt, pyqtSlot
from PyQt6.QtGui import QColor
from typing import Optional

from resources.themes.theme_constants import Theme
from data.database import DatabaseManager

# Ensure ACCENT_HOVER exists
if not hasattr(Theme, "ACCENT_HOVER"):
    Theme.ACCENT_HOVER = "#2980b9"

class AuditPanel(QWidget):
    """Panneau d'administration en lecture seule de la chaîne d'audit."""
    
    def __init__(self, db: DatabaseManager, parent: Optional[QWidget] = None):
        super().__init__(parent)
        self._db = db
        self._setup_ui()
        self._load_data()
        
    def _setup_ui(self) -> None:
        layout = QVBoxLayout(self)
        layout.setContentsMargins(20, 20, 20, 20)
        layout.setSpacing(15)
        
        # Titre et contrôles
        header_layout = QHBoxLayout()
        title = QLabel("🛡️ Journal d'Audit (SHA-256 Chained)")
        title.setStyleSheet(f"font-size: 20px; font-weight: bold; color: {Theme.TEXT_PRIMARY};")
        header_layout.addWidget(title)
        
        header_layout.addStretch()
        
        self._filter_combo = QComboBox()
        self._filter_combo.addItems(["Toutes les entités", "session", "protocol"])
        self._filter_combo.setStyleSheet(f"padding: 5px; background: {Theme.BG_ELEVATED}; color: white;")
        self._filter_combo.currentTextChanged.connect(self._load_data)
        header_layout.addWidget(self._filter_combo)
        
        self._btn_verify = QPushButton("🔍 Vérifier l'Intégrité")
        self._btn_verify.setStyleSheet(f"""
            QPushButton {{
                background-color: {Theme.PRIMARY};
                color: {Theme.TEXT_PRIMARY};
                border-radius: 4px;
                padding: 8px 15px;
                font-weight: bold;
            }}
            QPushButton:hover {{ background-color: {Theme.PRIMARY_HOVER}; }}
        """)
        self._btn_verify.clicked.connect(self._on_verify_clicked)
        header_layout.addWidget(self._btn_verify)
        
        # P0-5 Bouton pour vérifier un fichier lock
        self._btn_verify_lock = QPushButton("🔐 Vérifier Fichier .lock")
        self._btn_verify_lock.setStyleSheet(f"""
            QPushButton {{
                background-color: {Theme.ACCENT};
                color: {Theme.TEXT_PRIMARY};
                border-radius: 4px;
                padding: 8px 15px;
                font-weight: bold;
            }}
            QPushButton:hover {{ background-color: {Theme.ACCENT_HOVER}; }}
        """)
        self._btn_verify_lock.clicked.connect(self._on_verify_lock_clicked)
        header_layout.addWidget(self._btn_verify_lock)
        
        layout.addLayout(header_layout)
        
        # Indicateur de statut
        self._status_label = QLabel("Statut : En attente de vérification")
        self._status_label.setStyleSheet(f"color: {Theme.TEXT_SECONDARY};")
        layout.addWidget(self._status_label)
        
        # Table
        self._table = QTableWidget()
        self._table.setColumnCount(6)
        self._table.setHorizontalHeaderLabels([
            "ID", "Horodatage (UTC)", "Action", "Utilisateur", "Entité", "Hash Actuel"
        ])
        header = self._table.horizontalHeader()
        if header is not None:
            header.setSectionResizeMode(QHeaderView.ResizeMode.ResizeToContents)
            header.setSectionResizeMode(5, QHeaderView.ResizeMode.Stretch)
        self._table.setStyleSheet(f"""
            QTableWidget {{
                background-color: {Theme.BG_CARD};
                color: {Theme.TEXT_PRIMARY};
                gridline-color: {Theme.BORDER};
                border: 1px solid {Theme.BORDER};
                border-radius: 8px;
            }}
            QHeaderView::section {{
                background-color: {Theme.BG_ELEVATED};
                color: {Theme.TEXT_PRIMARY};
                padding: 6px;
                font-weight: bold;
                border: none;
                border-right: 1px solid {Theme.BORDER};
            }}
        """)
        self._table.setEditTriggers(QTableWidget.EditTrigger.NoEditTriggers)
        self._table.setSelectionBehavior(QTableWidget.SelectionBehavior.SelectRows)
        self._table.setAlternatingRowColors(True)
        
        layout.addWidget(self._table)
        
    @pyqtSlot()
    def _load_data(self) -> None:
        """Charge les logs depuis la base de données."""
        filter_text = self._filter_combo.currentText()
        entity_type = filter_text if filter_text != "Toutes les entités" else None
        
        logs = self._db.get_audit_log(entity_type=entity_type)
        
        self._table.setRowCount(len(logs))
        for row, log in enumerate(logs):
            self._table.setItem(row, 0, QTableWidgetItem(str(log["id"])))
            self._table.setItem(row, 1, QTableWidgetItem(log["timestamp_utc"]))
            
            action_item = QTableWidgetItem(log["action"])
            if "DELETE" in log["action"]:
                action_item.setForeground(QColor(Theme.DANGER))
            elif "CREATE" in log["action"]:
                action_item.setForeground(QColor(Theme.SUCCESS))
            self._table.setItem(row, 2, action_item)
            
            self._table.setItem(row, 3, QTableWidgetItem(log["user_id"]))
            self._table.setItem(row, 4, QTableWidgetItem(f"{log['entity_type']} ({log['entity_id']})"))
            
            hash_display = log["current_hash"][:16] + "..."
            hash_item = QTableWidgetItem(hash_display)
            hash_item.setToolTip(log["current_hash"])
            self._table.setItem(row, 5, hash_item)

    @pyqtSlot()
    def _on_verify_clicked(self) -> None:
        """Déclenche la vérification cryptographique de la chaîne."""
        self._btn_verify.setEnabled(False)
        self._status_label.setText("Vérification en cours...")
        
        is_valid, corrupt_id = self._db.verify_chain_integrity()
        
        if is_valid:
            self._status_label.setText("✅ Chaîne d'audit intègre. Aucune altération détectée.")
            self._status_label.setStyleSheet(f"color: {Theme.SUCCESS}; font-weight: bold;")
            QMessageBox.information(self, "Intégrité Validée", 
                                    "La chaîne cryptographique est parfaitement intègre. "
                                    "Aucune donnée n'a été falsifiée.")
        else:
            self._status_label.setText(f"❌ CHAÎNE CORROMPUE À L'ID {corrupt_id} !")
            self._status_label.setStyleSheet(f"color: {Theme.DANGER}; font-weight: bold; font-size: 16px;")
            QMessageBox.critical(self, "VIOLATION D'INTÉGRITÉ", 
                                 f"La chaîne d'audit a été rompue au niveau du bloc ID {corrupt_id}.\n"
                                 "Les données scientifiques pourraient avoir été altérées manuellement dans la base SQLite.")
            
        self._btn_verify.setEnabled(True)

    @pyqtSlot()
    def _on_verify_lock_clicked(self) -> None:
        """Vérifie un fichier .lock de session (P0-5)."""
        file_path, _ = QFileDialog.getOpenFileName(
            self, "Sélectionner un fichier .lock", "sessions", "Lock Files (*.lock)"
        )
        if not file_path:
            return

        try:
            with open(file_path, "r") as f:
                data = json.load(f)
                
            session_id = data.get("session_id")
            root_hash = data.get("root_hash")
            signature = data.get("signature")
            
            if not all([session_id, root_hash, signature]):
                raise ValueError("Format de fichier .lock invalide.")

            # Vérifier la signature HMAC
            secret = b"neurovision_hmac_secret"
            expected_sig = hmac.new(secret, root_hash.encode('utf-8'), hashlib.sha256).hexdigest()
            if not hmac.compare_digest(expected_sig, signature):
                raise ValueError("Signature HMAC invalide. Ce fichier a été forgé !")

            # Vérifier que le hash existe dans la base
            logs = self._db.get_audit_log(entity_type="session", entity_id=session_id)
            hash_found = any(log["current_hash"] == root_hash for log in logs)

            if hash_found:
                QMessageBox.information(
                    self, "Vérification Réussie", 
                    f"Le fichier .lock de la session {session_id} est valide.\n\n"
                    "L'intégrité de la racine est confirmée par rapport à la base de données actuelle."
                )
            else:
                QMessageBox.critical(
                    self, "VIOLATION D'INTÉGRITÉ", 
                    f"Le hash racine {root_hash[:16]}... du fichier .lock ne correspond "
                    "à aucune entrée dans la base d'audit actuelle.\n\n"
                    "La base de données SQLite a été altérée et ne correspond plus à l'empreinte d'origine !"
                )
                
        except Exception as e:
            QMessageBox.critical(self, "Erreur de Vérification", f"Erreur lors de l'analyse du fichier : {e}")
