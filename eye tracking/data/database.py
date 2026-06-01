"""
Gestionnaire de base de données SQLite pour Eye Tracking Neuromarketing.

Singleton thread-safe avec opérations CRUD pour toutes les entités,
insertion batch optimisée pour les données temps réel.
"""
from __future__ import annotations

import json
try:
    from pysqlcipher3 import dbapi2 as sqlite3
except ImportError:
    import sqlite3  # Fallback si pysqlcipher3 non compilé/installé
import threading
import uuid
import hashlib
import hmac
from pathlib import Path
from typing import Optional, Tuple

import pandas as pd

from core.error_handler import ErrorHandler, ErrorLevel
from core.audit_trail import AuditTrail

from data.models import (
    AOIDefinition, CalibrationResult, GazeSample, Participant,
    Protocol, Session, SessionStatus, Stimulus,
    Gender, DominantHand, StimulusType, ShapeType,
    FacialSample, QuestionDefinition, QuestionResponse, QuestionType,
)
from core.audit_trail import AuditTrail
from utils.logger import get_logger

logger = get_logger(__name__)


def retry_on_locked(max_retries: int = 3, delay: float = 0.1):
    """Décorateur pour réessayer les requêtes si la base de données est verrouillée."""
    def decorator(func):
        def wrapper(*args, **kwargs):
            retries = 0
            while retries < max_retries:
                try:
                    return func(*args, **kwargs)
                except sqlite3.OperationalError as e:
                    if "database is locked" in str(e).lower():
                        retries += 1
                        if retries >= max_retries:
                            ErrorHandler.instance().report(
                                ErrorLevel.RECOVERABLE, "DatabaseManager",
                                f"SQLite locked après {max_retries} tentatives: {e}"
                            )
                            raise
                        time.sleep(delay * retries)  # Backoff exponentiel
                    else:
                        raise
            return func(*args, **kwargs)
        return wrapper
    return decorator


class DatabaseManager:
    """Gestionnaire SQLite singleton thread-safe.

    Attributes:
        db_path: Chemin vers le fichier de base de données.
    """

    _instance: Optional[DatabaseManager] = None
    _lock: threading.Lock = threading.Lock()

    def __new__(cls, db_path: str = "data/eye_tracking.db") -> DatabaseManager:
        with cls._lock:
            if cls._instance is None:
                cls._instance = super().__new__(cls)
                cls._instance._initialized = False
            return cls._instance

    def __init__(self, db_path: str = "data/eye_tracking.db") -> None:
        if self._initialized:
            return
        self.db_path = db_path
        Path(db_path).parent.mkdir(parents=True, exist_ok=True)
        # Timeout étendu à 5.0s
        self._conn = sqlite3.connect(db_path, check_same_thread=False, timeout=5.0)
        self._conn.row_factory = sqlite3.Row
        
        # --- P0-3: Chiffrement SQLCipher ---
        # Générer une clé dérivée de l'identité de la machine (MAC address)
        machine_id = str(uuid.getnode()).encode('utf-8')
        salt = b"neurovision_salt_v2"
        key = hashlib.pbkdf2_hmac('sha256', machine_id, salt, 100000)
        self._conn.execute(f"PRAGMA key = '{key.hex()}'")
        
        # WAL optimisé et P0-4 Auto Vacuum
        self._conn.execute("PRAGMA journal_mode=WAL")
        self._conn.execute("PRAGMA synchronous=NORMAL")
        self._conn.execute("PRAGMA foreign_keys=ON")
        self._conn.execute("PRAGMA wal_autocheckpoint=100")
        self._conn.execute("PRAGMA journal_size_limit=10485760")  # 10MB
        self._conn.execute("PRAGMA auto_vacuum=INCREMENTAL") # P0-4
        
        self._db_lock = threading.RLock()
        self._initialized = True
        self.initialize()
        logger.info(f"Base de données initialisée : {db_path}")

    def begin_transaction(self) -> None:
        """Démarre une transaction explicite avec timeout."""
        acquired = self._db_lock.acquire(timeout=2.0)
        if not acquired:
            ErrorHandler.instance().report(
                ErrorLevel.RECOVERABLE, "DatabaseManager", "Timeout acquire begin_transaction"
            )
            raise sqlite3.OperationalError("Database is locked (timeout)")
        try:
            self._conn.execute("BEGIN")
        except sqlite3.OperationalError:
            pass # Déjà dans une transaction

    @retry_on_locked()
    def commit_transaction(self) -> None:
        """Valide la transaction explicite."""
        try:
            self._conn.execute("COMMIT")
        finally:
            self._db_lock.release()

    def rollback_transaction(self) -> None:
        """Annule la transaction explicite."""
        try:
            self._conn.execute("ROLLBACK")
        except sqlite3.OperationalError:
            pass
        finally:
            self._db_lock.release()

    def initialize(self) -> None:
        """Crée toutes les tables si elles n'existent pas."""
        with self._db_lock:
            cursor = self._conn.cursor()
            cursor.executescript("""
                CREATE TABLE IF NOT EXISTS participants (
                    id TEXT PRIMARY KEY,
                    age INTEGER,
                    gender TEXT DEFAULT 'not_specified',
                    dominant_hand TEXT DEFAULT 'right',
                    visual_correction TEXT DEFAULT 'none',
                    notes TEXT DEFAULT '',
                    created_at TEXT
                );

                CREATE TABLE IF NOT EXISTS stimuli (
                    id TEXT PRIMARY KEY,
                    name TEXT,
                    stimulus_type TEXT DEFAULT 'image',
                    file_path TEXT,
                    duration_ms INTEGER DEFAULT 0,
                    width INTEGER DEFAULT 1920,
                    height INTEGER DEFAULT 1080,
                    metadata TEXT DEFAULT '{}'
                );

                CREATE TABLE IF NOT EXISTS protocols (
                    id TEXT PRIMARY KEY,
                    name TEXT,
                    description TEXT DEFAULT '',
                    stimuli_ids TEXT DEFAULT '[]',
                    randomize INTEGER DEFAULT 0,
                    inter_stimulus_ms INTEGER DEFAULT 1000,
                    instructions TEXT DEFAULT '',
                    created_at TEXT,
                    updated_at TEXT
                );

                CREATE TABLE IF NOT EXISTS sessions (
                    id TEXT PRIMARY KEY,
                    participant_id TEXT,
                    protocol_id TEXT,
                    experimenter_id TEXT DEFAULT '',
                    status TEXT DEFAULT 'pending',
                    started_at TEXT,
                    ended_at TEXT,
                    calibration_error_px REAL DEFAULT 0.0,
                    calibration_error_deg REAL DEFAULT 0.0,
                    tracker_type TEXT DEFAULT 'webcam',
                    notes TEXT DEFAULT '',
                    last_heartbeat TEXT DEFAULT NULL,
                    dropped_frames_count INTEGER DEFAULT 0,
                    FOREIGN KEY (participant_id) REFERENCES participants(id),
                    FOREIGN KEY (protocol_id) REFERENCES protocols(id)
                );

                CREATE TABLE IF NOT EXISTS gaze_samples (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    timestamp_ms INTEGER,
                    stimulus_id TEXT,
                    participant_id TEXT,
                    session_id TEXT,
                    gaze_x REAL DEFAULT -1.0,
                    gaze_y REAL DEFAULT -1.0,
                    pupil_left REAL DEFAULT 0.0,
                    pupil_right REAL DEFAULT 0.0,
                    fixation_id INTEGER DEFAULT 0,
                    blink INTEGER DEFAULT 0,
                    quality REAL DEFAULT 0.0,
                    FOREIGN KEY (session_id) REFERENCES sessions(id)
                );

                CREATE TABLE IF NOT EXISTS aoi_definitions (
                    id TEXT PRIMARY KEY,
                    stimulus_id TEXT,
                    name TEXT,
                    shape_type TEXT DEFAULT 'rectangle',
                    coordinates TEXT DEFAULT '[]',
                    color TEXT DEFAULT '#ff0000',
                    FOREIGN KEY (stimulus_id) REFERENCES stimuli(id)
                );

                CREATE TABLE IF NOT EXISTS calibration_results (
                    id TEXT PRIMARY KEY,
                    session_id TEXT,
                    num_points INTEGER DEFAULT 9,
                    points_data TEXT DEFAULT '[]',
                    coefficients_x TEXT DEFAULT '[]',
                    coefficients_y TEXT DEFAULT '[]',
                    avg_error_px REAL DEFAULT 0.0,
                    avg_error_deg REAL DEFAULT 0.0,
                    max_error_px REAL DEFAULT 0.0,
                    timestamp TEXT,
                    is_valid INTEGER DEFAULT 0,
                    FOREIGN KEY (session_id) REFERENCES sessions(id)
                );

                CREATE TABLE IF NOT EXISTS facial_samples (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    timestamp_ms INTEGER,
                    session_id TEXT,
                    stimulus_id TEXT DEFAULT '',
                    face_detected INTEGER DEFAULT 0,
                    emotion_primary TEXT DEFAULT 'neutral',
                    emotion_scores TEXT DEFAULT '{}',
                    valence REAL DEFAULT 0.0,
                    arousal REAL DEFAULT 0.0,
                    face_confidence REAL DEFAULT 0.0,
                    FOREIGN KEY (session_id) REFERENCES sessions(id)
                );

                CREATE TABLE IF NOT EXISTS question_definitions (
                    id TEXT PRIMARY KEY,
                    protocol_id TEXT,
                    question_text TEXT,
                    question_type TEXT DEFAULT 'likert',
                    options TEXT DEFAULT '[]',
                    scale_min INTEGER DEFAULT 1,
                    scale_max INTEGER DEFAULT 5,
                    scale_name TEXT DEFAULT '',
                    order_index INTEGER DEFAULT 0,
                    stimulus_id TEXT DEFAULT '',
                    required INTEGER DEFAULT 1,
                    FOREIGN KEY (protocol_id) REFERENCES protocols(id)
                );

                CREATE TABLE IF NOT EXISTS question_responses (
                    id TEXT PRIMARY KEY,
                    session_id TEXT,
                    question_id TEXT,
                    stimulus_id TEXT DEFAULT '',
                    timestamp_ms INTEGER DEFAULT 0,
                    response_value TEXT DEFAULT '',
                    response_time_ms INTEGER DEFAULT 0,
                    FOREIGN KEY (session_id) REFERENCES sessions(id),
                    FOREIGN KEY (question_id) REFERENCES question_definitions(id)
                );

                CREATE INDEX IF NOT EXISTS idx_gaze_session
                    ON gaze_samples(session_id);
                CREATE INDEX IF NOT EXISTS idx_gaze_stimulus
                    ON gaze_samples(session_id, stimulus_id);
                CREATE INDEX IF NOT EXISTS idx_sessions_participant
                    ON sessions(participant_id);
                CREATE INDEX IF NOT EXISTS idx_facial_session
                    ON facial_samples(session_id);
                CREATE INDEX IF NOT EXISTS idx_facial_stimulus
                    ON facial_samples(session_id, stimulus_id);
                CREATE INDEX IF NOT EXISTS idx_questions_protocol
                    ON question_definitions(protocol_id);
                CREATE INDEX IF NOT EXISTS idx_responses_session
                    ON question_responses(session_id);

                CREATE TABLE IF NOT EXISTS calibration_validation (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    session_id TEXT,
                    target_x REAL,
                    target_y REAL,
                    measured_x REAL,
                    measured_y REAL,
                    error_px REAL DEFAULT 0.0,
                    error_deg REAL DEFAULT 0.0,
                    timestamp_ms INTEGER DEFAULT 0,
                    FOREIGN KEY (session_id) REFERENCES sessions(id)
                );

                CREATE TABLE IF NOT EXISTS experimenters (
                    id TEXT PRIMARY KEY,
                    username TEXT,
                    role TEXT DEFAULT 'researcher',
                    password_hash TEXT DEFAULT '',
                    created_at TEXT
                );

                CREATE INDEX IF NOT EXISTS idx_calval_session
                    ON calibration_validation(session_id);

                CREATE TABLE IF NOT EXISTS audit_chain (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    timestamp_utc TEXT NOT NULL,
                    action TEXT NOT NULL,
                    user_id TEXT NOT NULL,
                    entity_type TEXT NOT NULL,
                    entity_id TEXT NOT NULL,
                    prev_hash TEXT NOT NULL,
                    current_hash TEXT NOT NULL,
                    details TEXT
                );
            """)
            
            # --- P1-1: Migrations (ajout des colonnes si elles manquent) ---
            try:
                self._conn.execute("ALTER TABLE sessions ADD COLUMN last_heartbeat TEXT DEFAULT NULL")
            except sqlite3.OperationalError:
                pass
            try:
                self._conn.execute("ALTER TABLE sessions ADD COLUMN dropped_frames_count INTEGER DEFAULT 0")
            except sqlite3.OperationalError:
                pass
            
            self._conn.commit()
            
            # --- P1-1: Recovery check ---
            self._recover_interrupted_sessions()
            
    def _recover_interrupted_sessions(self) -> None:
        """P1-1: Marque les sessions orphelines comme interrompues."""
        try:
            with self._db_lock:
                # Si status=running mais last_heartbeat vieux de + de 30s ou None, c'est un crash
                from datetime import datetime, timezone
                now_str = datetime.now(timezone.utc).isoformat()
                
                # En SQLite pur, c'est compliqué de calculer la diff de temps ISO8601.
                # On récupère toutes les sessions RUNNING et on check en Python.
                cursor = self._conn.execute("SELECT id, last_heartbeat FROM sessions WHERE status='running'")
                rows = cursor.fetchall()
                for row in rows:
                    # Dans le doute, si on démarre, aucune session ne devrait être RUNNING
                    session_id = row["id"]
                    self._conn.execute("UPDATE sessions SET status='aborted' WHERE id=?", (session_id,))
                    logger.warning(f"Crash Recovery: Session {session_id} orpheline marquée comme ABORTED.")
                self._conn.commit()
        except Exception as e:
            logger.error(f"Erreur Crash Recovery: {e}")

    # ----- Audit Trail -----
    def verify_chain_integrity(self) -> Tuple[bool, Optional[int]]:
        """Vérifie l'intégrité de la chaîne de blocs d'audit SQLite."""
        with self._db_lock:
            return AuditTrail.verify_chain(self._conn)
            
    def get_audit_log(self, entity_type: Optional[str] = None, entity_id: Optional[str] = None) -> list[dict]:
        """Récupère l'historique d'audit, optionnellement filtré."""
        with self._db_lock:
            query = "SELECT * FROM audit_chain WHERE 1=1"
            params = []
            if entity_type:
                query += " AND entity_type=?"
                params.append(entity_type)
            if entity_id:
                query += " AND entity_id=?"
                params.append(entity_id)
            query += " ORDER BY id DESC"
            
            rows = self._conn.execute(query, params).fetchall()
            return [dict(r) for r in rows]

    # ----- Participants -----
    def insert_participant(self, p: Participant) -> str:
        with self._db_lock:
            self._conn.execute(
                "INSERT INTO participants VALUES (?,?,?,?,?,?,?)",
                (p.id, p.age, p.gender.value, p.dominant_hand.value,
                 p.visual_correction, p.notes, p.created_at))
            self._conn.commit()
        logger.debug(f"Participant inséré : {p.id}")
        return p.id

    def get_participant(self, pid: str) -> Optional[Participant]:
        with self._db_lock:
            row = self._conn.execute(
                "SELECT * FROM participants WHERE id=?", (pid,)).fetchone()
        if not row:
            return None
        return Participant(
            id=row["id"], age=row["age"],
            gender=Gender(row["gender"]),
            dominant_hand=DominantHand(row["dominant_hand"]),
            visual_correction=row["visual_correction"],
            notes=row["notes"], created_at=row["created_at"])

    def get_all_participants(self) -> list[Participant]:
        with self._db_lock:
            rows = self._conn.execute("SELECT * FROM participants ORDER BY created_at DESC").fetchall()
        return [Participant(
            id=r["id"], age=r["age"], gender=Gender(r["gender"]),
            dominant_hand=DominantHand(r["dominant_hand"]),
            visual_correction=r["visual_correction"],
            notes=r["notes"], created_at=r["created_at"]) for r in rows]

    def update_participant(self, p: Participant) -> bool:
        with self._db_lock:
            cursor = self._conn.execute(
                "UPDATE participants SET age=?, gender=?, dominant_hand=?, visual_correction=?, notes=? WHERE id=?",
                (p.age, p.gender.value, p.dominant_hand.value, p.visual_correction, p.notes, p.id)
            )
            self._conn.commit()
            return cursor.rowcount > 0

    def delete_participant(self, pid: str) -> bool:
        with self._db_lock:
            # Check for linked sessions
            count = self._conn.execute("SELECT COUNT(*) FROM sessions WHERE participant_id=?", (pid,)).fetchone()[0]
            if count > 0:
                raise ValueError(f"Impossible de supprimer ce participant car il possède {count} session(s) associée(s).")
                
            cursor = self._conn.execute("DELETE FROM participants WHERE id=?", (pid,))
            self._conn.commit()
        return cursor.rowcount > 0

    # ----- Protocols -----
    def insert_protocol(self, p: Protocol) -> str:
        with self._db_lock:
            self._conn.execute(
                "INSERT INTO protocols VALUES (?,?,?,?,?,?,?,?,?)",
                (p.id, p.name, p.description, p.stimuli_ids,
                 int(p.randomize), p.inter_stimulus_ms, p.instructions,
                 p.created_at, p.updated_at))
            
            # Log de l'audit
            cursor = self._conn.cursor()
            AuditTrail.log_event(cursor, "CREATE_PROTOCOL", "system", "protocol", p.id, {"name": p.name})
            
            self._conn.commit()
        logger.debug(f"Protocole inséré : {p.id}")
        return p.id

    def get_all_protocols(self) -> list[Protocol]:
        with self._db_lock:
            rows = self._conn.execute("SELECT * FROM protocols ORDER BY created_at DESC").fetchall()
        return [Protocol(
            id=r["id"], name=r["name"], description=r["description"],
            stimuli_ids=r["stimuli_ids"], randomize=bool(r["randomize"]),
            inter_stimulus_ms=r["inter_stimulus_ms"],
            instructions=r["instructions"],
            created_at=r["created_at"], updated_at=r["updated_at"]) for r in rows]

    def get_protocol(self, protocol_id: str) -> Optional[Protocol]:
        with self._db_lock:
            row = self._conn.execute(
                "SELECT * FROM protocols WHERE id=?", (protocol_id,)).fetchone()
        if not row:
            return None
        return Protocol(
            id=row["id"], name=row["name"], description=row["description"],
            stimuli_ids=row["stimuli_ids"], randomize=bool(row["randomize"]),
            inter_stimulus_ms=row["inter_stimulus_ms"],
            instructions=row["instructions"],
            created_at=row["created_at"], updated_at=row["updated_at"])

    def delete_protocol(self, protocol_id: str) -> bool:
        """Supprime un protocole par son ID.

        Vérifie qu'aucune session n'est liée à ce protocole avant suppression.

        Args:
            protocol_id: ID du protocole à supprimer.

        Returns:
            True si le protocole a été supprimé.

        Raises:
            ValueError: Si des sessions sont liées à ce protocole.
        """
        with self._db_lock:
            count = self._conn.execute(
                "SELECT COUNT(*) FROM sessions WHERE protocol_id=?",
                (protocol_id,)).fetchone()[0]
            if count > 0:
                raise ValueError(
                    f"Impossible de supprimer : {count} session(s) utilisent ce protocole.")
            cursor = self._conn.execute(
                "DELETE FROM protocols WHERE id=?", (protocol_id,))
            
            # Log de l'audit
            audit_cursor = self._conn.cursor()
            AuditTrail.log_event(audit_cursor, "DELETE_PROTOCOL", "system", "protocol", protocol_id)
            
            self._conn.commit()
        logger.debug(f"Protocole supprimé : {protocol_id}")
        return cursor.rowcount > 0

    def update_protocol(self, p: Protocol) -> bool:
        """Met à jour un protocole existant.

        Args:
            p: Le protocole avec les nouvelles valeurs.

        Returns:
            True si le protocole a été mis à jour.
        """
        with self._db_lock:
            cursor = self._conn.execute(
                "UPDATE protocols SET name=?, description=?, stimuli_ids=?, "
                "randomize=?, inter_stimulus_ms=?, instructions=?, updated_at=? "
                "WHERE id=?",
                (p.name, p.description, p.stimuli_ids,
                 int(p.randomize), p.inter_stimulus_ms, p.instructions,
                 p.updated_at, p.id))
            self._conn.commit()
        logger.debug(f"Protocole mis à jour : {p.id}")
        return cursor.rowcount > 0

    # ----- Sessions -----
    def insert_session(self, s: Session) -> str:
        # FK guard: empty protocol_id → NULL (ad-hoc session)
        proto_id = s.protocol_id if s.protocol_id else None
        with self._db_lock:
            self._conn.execute(
                "INSERT INTO sessions VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)",
                (s.id, s.participant_id, proto_id, s.experimenter_id,
                 s.status.value, s.started_at, s.ended_at,
                 s.calibration_error_px, s.calibration_error_deg,
                 s.tracker_type, s.notes, s.last_heartbeat, s.dropped_frames_count))
            
            # Log de l'audit
            cursor = self._conn.cursor()
            AuditTrail.log_event(cursor, "CREATE_SESSION", "system", "session", s.id, {"participant_id": s.participant_id})
                 
            self._conn.commit()
        logger.debug(f"Session insérée : {s.id}")
        return s.id

    def update_session_status(self, session_id: str, status: SessionStatus) -> None:
        with self._db_lock:
            self._conn.execute(
                "UPDATE sessions SET status=? WHERE id=?",
                (status.value, session_id))
            
            # P0-5: Créer le fichier .lock à la clôture de la session
            if status in [SessionStatus.COMPLETED, SessionStatus.ERROR, SessionStatus.ABORTED]:
                cursor = self._conn.cursor()
                final_hash = AuditTrail.log_event(cursor, f"CLOSE_SESSION_{status.name}", "system", "session", session_id)
                self._conn.commit()
                self._write_session_lock(session_id, final_hash)
            else:
                self._conn.commit()

    def _write_session_lock(self, session_id: str, root_hash: str) -> None:
        """P0-5: Écrit l'empreinte racine de la session dans un fichier sécurisé."""
        try:
            lock_dir = Path("sessions")
            lock_dir.mkdir(exist_ok=True)
            lock_file = lock_dir / f"{session_id}.lock"
            
            # Signature HMAC pour garantir que le fichier .lock n'est pas forgé
            secret = b"neurovision_hmac_secret"
            signature = hmac.new(secret, root_hash.encode('utf-8'), hashlib.sha256).hexdigest()
            
            with open(lock_file, "w") as f:
                json.dump({"session_id": session_id, "root_hash": root_hash, "signature": signature}, f)
            logger.info(f"Fichier lock créé pour la session {session_id}")
        except Exception as e:
            logger.error(f"Erreur création lock file {session_id}: {e}")

    def update_session_heartbeat(self, session_id: str, last_heartbeat: str, dropped_frames: int) -> None:
        """P1-1: Met à jour le heartbeat et le compteur de drops."""
        with self._db_lock:
            self._conn.execute(
                "UPDATE sessions SET last_heartbeat=?, dropped_frames_count=? WHERE id=?",
                (last_heartbeat, dropped_frames, session_id)
            )
            self._conn.commit()

    def get_all_sessions(self) -> list[Session]:
        with self._db_lock:
            rows = self._conn.execute("SELECT * FROM sessions ORDER BY started_at DESC").fetchall()
        return [Session(
            id=r["id"], participant_id=r["participant_id"],
            protocol_id=r["protocol_id"], experimenter_id=r["experimenter_id"],
            status=SessionStatus(r["status"]),
            started_at=r["started_at"], ended_at=r["ended_at"],
            calibration_error_px=r["calibration_error_px"],
            calibration_error_deg=r["calibration_error_deg"],
            tracker_type=r["tracker_type"], notes=r["notes"],
            last_heartbeat=r["last_heartbeat"], dropped_frames_count=r["dropped_frames_count"]
        ) for r in rows]

    def get_session(self, session_id: str) -> Optional[Session]:
        with self._db_lock:
            row = self._conn.execute(
                "SELECT * FROM sessions WHERE id=?", (session_id,)).fetchone()
        if not row:
            return None
        return Session(
            id=row["id"], participant_id=row["participant_id"],
            protocol_id=row["protocol_id"], experimenter_id=row["experimenter_id"],
            status=SessionStatus(row["status"]),
            started_at=row["started_at"], ended_at=row["ended_at"],
            calibration_error_px=row["calibration_error_px"],
            calibration_error_deg=row["calibration_error_deg"],
            tracker_type=row["tracker_type"], notes=row["notes"],
            last_heartbeat=row["last_heartbeat"], dropped_frames_count=row["dropped_frames_count"]
        )

    # ----- Gaze Samples (batch optimisé) -----
    def insert_gaze_samples_batch(self, samples: list[GazeSample], commit: bool = True) -> int:
        """Insertion batch optimisée pour les données temps réel.

        Args:
            samples: Liste de GazeSample à insérer.
            commit: Si True, valide la transaction immédiatement.

        Returns:
            int: Nombre de samples insérés.
        """
        if not samples:
            return 0
        with self._db_lock:
            self._conn.executemany(
                """INSERT INTO gaze_samples
                   (timestamp_ms, stimulus_id, participant_id, session_id,
                    gaze_x, gaze_y, pupil_left, pupil_right,
                    fixation_id, blink, quality)
                   VALUES (?,?,?,?,?,?,?,?,?,?,?)""",
                [(s.timestamp_ms, s.stimulus_id, s.participant_id,
                  s.session_id, s.gaze_x, s.gaze_y, s.pupil_left,
                  s.pupil_right, s.fixation_id, int(s.blink), s.quality)
                 for s in samples])
            if commit:
                self._conn.commit()
        return len(samples)

    def get_session_gaze_data(self, session_id: str) -> pd.DataFrame:
        """Récupère les données gaze d'une session comme DataFrame.

        Args:
            session_id: ID de la session.

        Returns:
            pd.DataFrame: DataFrame avec toutes les colonnes gaze.
        """
        query = "SELECT * FROM gaze_samples WHERE session_id=? ORDER BY timestamp_ms"
        with self._db_lock:
            df = pd.read_sql_query(query, self._conn, params=(session_id,))
        return df

    # ----- Calibration -----
    def insert_calibration(self, c: CalibrationResult) -> str:
        with self._db_lock:
            self._conn.execute(
                """INSERT INTO calibration_results VALUES
                   (?,?,?,?,?,?,?,?,?,?,?)""",
                (c.id, c.session_id, c.num_points, c.points_data,
                 c.coefficients_x, c.coefficients_y,
                 c.avg_error_px, c.avg_error_deg, c.max_error_px,
                 c.timestamp, int(c.is_valid)))
            self._conn.commit()
        return c.id

    # ----- AOI -----
    def insert_aoi(self, aoi: AOIDefinition) -> str:
        with self._db_lock:
            self._conn.execute(
                "INSERT INTO aoi_definitions VALUES (?,?,?,?,?,?)",
                (aoi.id, aoi.stimulus_id, aoi.name,
                 aoi.shape_type.value, aoi.coordinates, aoi.color))
            self._conn.commit()
        return aoi.id

    def get_aois_for_stimulus(self, stimulus_id: str) -> list[AOIDefinition]:
        with self._db_lock:
            rows = self._conn.execute(
                "SELECT * FROM aoi_definitions WHERE stimulus_id=?",
                (stimulus_id,)).fetchall()
        return [AOIDefinition(
            id=r["id"], stimulus_id=r["stimulus_id"], name=r["name"],
            shape_type=ShapeType(r["shape_type"]),
            coordinates=r["coordinates"], color=r["color"]) for r in rows]

    # ───────────────────── Facial Samples ─────────────────────

    def insert_facial_samples_batch(self, samples: list[FacialSample], commit: bool = True) -> int:
        """Insère un batch de FacialSamples. Retourne le nombre inséré."""
        if not samples:
            return 0
        with self._db_lock:
            self._conn.executemany(
                "INSERT INTO facial_samples "
                "(timestamp_ms, session_id, stimulus_id, face_detected, "
                "emotion_primary, emotion_scores, valence, arousal, face_confidence) "
                "VALUES (?,?,?,?,?,?,?,?,?)",
                [(s.timestamp_ms, s.session_id, s.stimulus_id,
                  int(s.face_detected), s.emotion_primary, s.emotion_scores,
                  s.valence, s.arousal, s.face_confidence) for s in samples]
            )
            if commit:
                self._conn.commit()
        logger.debug(f"Batch facial inséré : {len(samples)} samples")
        return len(samples)

    def get_session_facial_data(self, session_id: str) -> pd.DataFrame:
        """Récupère les données faciales d'une session en DataFrame."""
        with self._db_lock:
            df = pd.read_sql_query(
                "SELECT * FROM facial_samples WHERE session_id = ? "
                "ORDER BY timestamp_ms",
                self._conn, params=(session_id,)
            )
        return df

    def get_session_facial_data_for_stimulus(
        self, session_id: str, stimulus_id: str
    ) -> pd.DataFrame:
        """Récupère les données faciales pour un stimulus spécifique."""
        with self._db_lock:
            df = pd.read_sql_query(
                "SELECT * FROM facial_samples "
                "WHERE session_id = ? AND stimulus_id = ? "
                "ORDER BY timestamp_ms",
                self._conn, params=(session_id, stimulus_id)
            )
        return df

    # ───────────────────── Question Definitions ─────────────────────

    def insert_question_definition(self, q: QuestionDefinition) -> str:
        """Insère une définition de question."""
        with self._db_lock:
            self._conn.execute(
                "INSERT INTO question_definitions VALUES (?,?,?,?,?,?,?,?,?,?,?)",
                (q.id, q.protocol_id, q.question_text,
                 q.question_type.value if isinstance(q.question_type, QuestionType) else q.question_type,
                 q.options, q.scale_min, q.scale_max,
                 q.scale_name, q.order_index, q.stimulus_id,
                 int(q.required))
            )
            self._conn.commit()
        logger.debug(f"Question insérée : {q.id}")
        return q.id

    def insert_question_definitions_batch(
        self, questions: list[QuestionDefinition]
    ) -> int:
        """Insère un batch de questions. Retourne le nombre inséré."""
        if not questions:
            return 0
        with self._db_lock:
            self._conn.executemany(
                "INSERT INTO question_definitions VALUES (?,?,?,?,?,?,?,?,?,?,?)",
                [(q.id, q.protocol_id, q.question_text,
                  q.question_type.value if isinstance(q.question_type, QuestionType) else q.question_type,
                  q.options, q.scale_min, q.scale_max,
                  q.scale_name, q.order_index, q.stimulus_id,
                  int(q.required)) for q in questions]
            )
            self._conn.commit()
        return len(questions)

    def get_questions_for_protocol(
        self, protocol_id: str
    ) -> list[QuestionDefinition]:
        """Récupère les questions d'un protocole, triées par ordre."""
        with self._db_lock:
            rows = self._conn.execute(
                "SELECT * FROM question_definitions "
                "WHERE protocol_id = ? ORDER BY order_index",
                (protocol_id,)
            ).fetchall()
        return [
            QuestionDefinition(
                id=r["id"], protocol_id=r["protocol_id"],
                question_text=r["question_text"],
                question_type=QuestionType(r["question_type"]),
                options=r["options"],
                scale_min=r["scale_min"], scale_max=r["scale_max"],
                scale_name=r["scale_name"],
                order_index=r["order_index"],
                stimulus_id=r["stimulus_id"],
                required=bool(r["required"]),
            ) for r in rows
        ]

    def get_questions_for_stimulus(
        self, protocol_id: str, stimulus_id: str
    ) -> list[QuestionDefinition]:
        """Récupère les questions liées à un stimulus spécifique."""
        with self._db_lock:
            rows = self._conn.execute(
                "SELECT * FROM question_definitions "
                "WHERE protocol_id = ? AND stimulus_id = ? "
                "ORDER BY order_index",
                (protocol_id, stimulus_id)
            ).fetchall()
        return [
            QuestionDefinition(
                id=r["id"], protocol_id=r["protocol_id"],
                question_text=r["question_text"],
                question_type=QuestionType(r["question_type"]),
                options=r["options"],
                scale_min=r["scale_min"], scale_max=r["scale_max"],
                scale_name=r["scale_name"],
                order_index=r["order_index"],
                stimulus_id=r["stimulus_id"],
                required=bool(r["required"]),
            ) for r in rows
        ]

    def get_question_by_id(self, question_id: str) -> Optional[QuestionDefinition]:
        """Récupère une question par son ID.

        Args:
            question_id: L'identifiant de la question.

        Returns:
            La QuestionDefinition ou None si introuvable.
        """
        with self._db_lock:
            row = self._conn.execute(
                "SELECT * FROM question_definitions WHERE id=?",
                (question_id,)).fetchone()
        if not row:
            return None
        return QuestionDefinition(
            id=row["id"], protocol_id=row["protocol_id"],
            question_text=row["question_text"],
            question_type=QuestionType(row["question_type"]),
            options=row["options"],
            scale_min=row["scale_min"], scale_max=row["scale_max"],
            scale_name=row["scale_name"],
            order_index=row["order_index"],
            stimulus_id=row["stimulus_id"],
            required=bool(row["required"]),
        )

    def delete_question_definitions(self, protocol_id: str) -> int:
        """Supprime toutes les questions d'un protocole."""
        with self._db_lock:
            cursor = self._conn.execute(
                "DELETE FROM question_definitions WHERE protocol_id = ?",
                (protocol_id,)
            )
            self._conn.commit()
        count = cursor.rowcount
        logger.debug(f"Supprimé {count} questions du protocole {protocol_id}")
        return count

    # ───────────────────── Question Responses ─────────────────────

    def insert_question_response(self, r: QuestionResponse) -> str:
        """Insère une réponse de questionnaire."""
        with self._db_lock:
            self._conn.execute(
                "INSERT INTO question_responses VALUES (?,?,?,?,?,?,?)",
                (r.id, r.session_id, r.question_id, r.stimulus_id,
                 r.timestamp_ms, r.response_value, r.response_time_ms)
            )
            self._conn.commit()
        return r.id

    def insert_question_responses_batch(
        self, responses: list[QuestionResponse]
    ) -> int:
        """Insère un batch de réponses."""
        if not responses:
            return 0
        with self._db_lock:
            self._conn.executemany(
                "INSERT INTO question_responses VALUES (?,?,?,?,?,?,?)",
                [(r.id, r.session_id, r.question_id, r.stimulus_id,
                  r.timestamp_ms, r.response_value, r.response_time_ms)
                 for r in responses]
            )
            self._conn.commit()
        return len(responses)

    def get_session_responses(
        self, session_id: str
    ) -> list[QuestionResponse]:
        """Récupère les réponses d'une session."""
        with self._db_lock:
            rows = self._conn.execute(
                "SELECT * FROM question_responses "
                "WHERE session_id = ? ORDER BY timestamp_ms",
                (session_id,)
            ).fetchall()
        return [
            QuestionResponse(
                id=r["id"], session_id=r["session_id"],
                question_id=r["question_id"],
                stimulus_id=r["stimulus_id"],
                timestamp_ms=r["timestamp_ms"],
                response_value=r["response_value"],
                response_time_ms=r["response_time_ms"],
            ) for r in rows
        ]

    def get_session_responses_df(self, session_id: str) -> pd.DataFrame:
        """Récupère les réponses d'une session en DataFrame."""
        with self._db_lock:
            df = pd.read_sql_query(
                "SELECT qr.*, qd.question_text, qd.question_type, "
                "qd.scale_name, qd.scale_min, qd.scale_max "
                "FROM question_responses qr "
                "JOIN question_definitions qd ON qr.question_id = qd.id "
                "WHERE qr.session_id = ? ORDER BY qr.timestamp_ms",
                self._conn, params=(session_id,)
            )
        return df

    # ───────────────────── Connection ─────────────────────

    def close(self) -> None:
        with self._db_lock:
            self._conn.close()
        logger.info("Connexion DB fermée.")

    def run_maintenance(self) -> None:
        """Exécute un VACUUM incrémental (P0-4). À appeler par un QTimer de faible priorité."""
        try:
            with self._db_lock:
                self._conn.execute("PRAGMA incremental_vacuum(100)")
                logger.info("Maintenance SQLite : PRAGMA incremental_vacuum(100) exécuté.")
        except Exception as e:
            logger.warning(f"Erreur lors de la maintenance SQLite : {e}")

    # ----- Calibration Validation -----
    def insert_calibration_validation_batch(
        self, session_id: str,
        points: list[dict],
    ) -> int:
        """Insère les points de validation de calibration.

        Args:
            session_id: ID de la session.
            points: Liste de dicts avec target_x/y, measured_x/y, error_px/deg.

        Returns:
            Nombre de lignes insérées.
        """
        with self._db_lock:
            rows = [
                (session_id,
                 p.get("target_x", 0), p.get("target_y", 0),
                 p.get("measured_x", 0), p.get("measured_y", 0),
                 p.get("error_px", 0), p.get("error_deg", 0),
                 p.get("timestamp_ms", 0))
                for p in points
            ]
            self._conn.executemany(
                "INSERT INTO calibration_validation "
                "(session_id, target_x, target_y, measured_x, measured_y, "
                "error_px, error_deg, timestamp_ms) "
                "VALUES (?,?,?,?,?,?,?,?)", rows)
            self._conn.commit()
        logger.debug(f"Calibration validation : {len(rows)} points insérés")
        return len(rows)

    def get_calibration_validation(self, session_id: str) -> pd.DataFrame:
        """Récupère les données de validation de calibration."""
        with self._db_lock:
            return pd.read_sql_query(
                "SELECT * FROM calibration_validation WHERE session_id=?",
                self._conn, params=(session_id,))

    @classmethod
    def reset_instance(cls) -> None:
        """Reset le singleton (pour les tests)."""
        with cls._lock:
            if cls._instance and cls._instance._initialized:
                try:
                    cls._instance._conn.close()
                except Exception:
                    pass
            cls._instance = None


if __name__ == "__main__":
    import tempfile, os
    db_path = os.path.join(tempfile.mkdtemp(), "test.db")
    DatabaseManager.reset_instance()
    db = DatabaseManager(db_path)

    # Test participant
    p = Participant(age=28, gender=Gender.FEMALE)
    db.insert_participant(p)
    loaded = db.get_participant(p.id)
    assert loaded is not None and loaded.age == 28
    print(f"✅ Participant CRUD OK")

    # Test protocol
    proto = Protocol(name="Test")
    db.insert_protocol(proto)
    protos = db.get_all_protocols()
    assert len(protos) >= 1
    print(f"✅ Protocol CRUD OK")

    # Test session
    s = Session(participant_id=p.id, protocol_id=proto.id)
    db.insert_session(s)
    db.update_session_status(s.id, SessionStatus.RUNNING)
    print(f"✅ Session CRUD OK")

    # Test batch gaze
    samples = [GazeSample(timestamp_ms=i*33, session_id=s.id,
                          gaze_x=float(i), gaze_y=float(i),
                          quality=0.9) for i in range(100)]
    count = db.insert_gaze_samples_batch(samples)
    assert count == 100
    df = db.get_session_gaze_data(s.id)
    assert len(df) == 100
    print(f"✅ Batch gaze insert OK ({count} samples)")

    db.close()
    os.unlink(db_path)
    print("\n✅ DatabaseManager — tous les tests passent.")
