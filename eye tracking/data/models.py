"""
Modèles de données pour Eye Tracking Neuromarketing.
Dataclasses pures — aucune dépendance à la base de données.
"""
from __future__ import annotations
import json
import uuid
from dataclasses import dataclass, field
from datetime import datetime
from enum import Enum
from typing import Optional


class Gender(Enum):
    MALE = "male"
    FEMALE = "female"
    OTHER = "other"
    NOT_SPECIFIED = "not_specified"

class DominantHand(Enum):
    LEFT = "left"
    RIGHT = "right"
    AMBIDEXTROUS = "ambidextrous"

class SessionStatus(Enum):
    PENDING = "pending"
    CALIBRATING = "calibrating"
    RUNNING = "running"
    PAUSED = "paused"
    COMPLETED = "completed"
    ABORTED = "aborted"

class StimulusType(Enum):
    IMAGE = "image"
    VIDEO = "video"
    WEB = "web"
    SLIDE = "slide"

class ShapeType(Enum):
    RECTANGLE = "rectangle"
    POLYGON = "polygon"
    ELLIPSE = "ellipse"
    CIRCLE = "circle"

class UserRole(Enum):
    ADMIN = "admin"
    RESEARCHER = "researcher"
    OBSERVER = "observer"


def _generate_id() -> str:
    """Génère un identifiant unique anonymisé (UUID4 tronqué 12 chars)."""
    return uuid.uuid4().hex[:12]


@dataclass
class Experimenter:
    """Expérimentateur utilisant le logiciel."""
    id: str = field(default_factory=_generate_id)
    username: str = ""
    role: UserRole = UserRole.RESEARCHER
    password_hash: str = ""
    created_at: str = field(default_factory=lambda: datetime.now().isoformat())


@dataclass
class Participant:
    """Participant anonymisé à une expérimentation."""
    id: str = field(default_factory=_generate_id)
    age: Optional[int] = None
    gender: Gender = Gender.NOT_SPECIFIED
    dominant_hand: DominantHand = DominantHand.RIGHT
    visual_correction: str = "none"
    notes: str = ""
    created_at: str = field(default_factory=lambda: datetime.now().isoformat())


@dataclass
class Stimulus:
    """Stimulus marketing présenté au participant."""
    id: str = field(default_factory=_generate_id)
    name: str = ""
    stimulus_type: StimulusType = StimulusType.IMAGE
    file_path: str = ""
    duration_ms: int = 0
    width: int = 1920
    height: int = 1080
    metadata: str = "{}"


@dataclass
class Protocol:
    """Protocole expérimental définissant l'ordre des stimuli."""
    id: str = field(default_factory=_generate_id)
    name: str = ""
    description: str = ""
    stimuli_ids: str = "[]"
    randomize: bool = False
    inter_stimulus_ms: int = 1000
    instructions: str = ""
    created_at: str = field(default_factory=lambda: datetime.now().isoformat())
    updated_at: str = field(default_factory=lambda: datetime.now().isoformat())

    def get_stimuli_list(self) -> list[str]:
        try:
            return json.loads(self.stimuli_ids)
        except (json.JSONDecodeError, TypeError):
            return []

    def set_stimuli_list(self, ids: list[str]) -> None:
        self.stimuli_ids = json.dumps(ids)


@dataclass
class Session:
    """Session expérimentale liant participant et protocole."""
    id: str = field(default_factory=_generate_id)
    participant_id: str = ""
    protocol_id: str = ""
    experimenter_id: str = ""
    status: SessionStatus = SessionStatus.PENDING
    started_at: str = field(default_factory=lambda: datetime.now().isoformat())
    ended_at: Optional[str] = None
    calibration_error_px: float = 0.0
    calibration_error_deg: float = 0.0
    tracker_type: str = "webcam"
    notes: str = ""
    last_heartbeat: Optional[str] = None
    dropped_frames_count: int = 0


@dataclass
class GazeSample:
    """Échantillon oculaire brut — format CDC obligatoire."""
    timestamp_ms: int = 0
    stimulus_id: str = ""
    participant_id: str = ""
    session_id: str = ""
    gaze_x: float = -1.0
    gaze_y: float = -1.0
    pupil_left: float = 0.0
    pupil_right: float = 0.0
    fixation_id: int = 0
    blink: bool = False
    quality: float = 0.0


@dataclass
class AOIDefinition:
    """Zone d'intérêt (AOI) sur un stimulus."""
    id: str = field(default_factory=_generate_id)
    stimulus_id: str = ""
    name: str = ""
    shape_type: ShapeType = ShapeType.RECTANGLE
    coordinates: str = "[]"
    color: str = "#ff0000"

    def get_coords(self) -> list:
        try:
            return json.loads(self.coordinates)
        except (json.JSONDecodeError, TypeError):
            return []

    def set_coords(self, coords: list) -> None:
        self.coordinates = json.dumps(coords)


@dataclass
class CalibrationResult:
    """Résultat d'une procédure de calibration."""
    id: str = field(default_factory=_generate_id)
    session_id: str = ""
    num_points: int = 9
    points_data: str = "[]"
    coefficients_x: str = "[]"
    coefficients_y: str = "[]"
    avg_error_px: float = 0.0
    avg_error_deg: float = 0.0
    max_error_px: float = 0.0
    timestamp: str = field(default_factory=lambda: datetime.now().isoformat())
    is_valid: bool = False


@dataclass
class FixationEvent:
    """Fixation détectée par I-VT ou I-DT."""
    id: int = 0
    session_id: str = ""
    stimulus_id: str = ""
    start_ms: int = 0
    end_ms: int = 0
    duration_ms: int = 0
    center_x: float = 0.0
    center_y: float = 0.0
    dispersion_px: float = 0.0
    sample_count: int = 0


@dataclass
class SaccadeEvent:
    """Saccade entre deux fixations."""
    id: int = 0
    session_id: str = ""
    stimulus_id: str = ""
    start_ms: int = 0
    end_ms: int = 0
    start_x: float = 0.0
    start_y: float = 0.0
    end_x: float = 0.0
    end_y: float = 0.0
    amplitude_px: float = 0.0
    amplitude_deg: float = 0.0
    peak_velocity: float = 0.0


# ────────────────────────── Facial Coding ──────────────────────────

class EmotionType(Enum):
    """7 émotions de base (modèle Ekman) + neutre."""
    HAPPY = "happy"
    SAD = "sad"
    ANGRY = "angry"
    FEAR = "fear"
    SURPRISE = "surprise"
    DISGUST = "disgust"
    NEUTRAL = "neutral"


@dataclass
class FacialSample:
    """Échantillon facial — résultat d'analyse émotionnelle par frame."""
    timestamp_ms: int = 0
    session_id: str = ""
    stimulus_id: str = ""
    face_detected: bool = False
    emotion_primary: str = "neutral"
    emotion_scores: str = "{}"          # JSON dict des 7 scores (0-1)
    valence: float = 0.0                # -1 (négatif) à +1 (positif)
    arousal: float = 0.0                # 0 (calme) à 1 (excité)
    face_confidence: float = 0.0        # Confiance détection 0-1

    def get_scores(self) -> dict[str, float]:
        try:
            return json.loads(self.emotion_scores)
        except (json.JSONDecodeError, TypeError):
            return {}

    def set_scores(self, scores: dict[str, float]) -> None:
        self.emotion_scores = json.dumps(scores)


# ────────────────────────── Questionnaire ──────────────────────────

class QuestionType(Enum):
    """Types de questions supportés."""
    LIKERT = "likert"
    SLIDER = "slider"
    SAM = "sam"
    OPEN = "open"
    MULTIPLE = "multiple"


class SyncMode(Enum):
    """Modes de synchronisation des capteurs."""
    SEQUENTIAL = "sequential"   # Stimulus → Eye+Face → Questionnaire → Next
    PARALLEL = "parallel"       # Eye+Face en continu, questionnaire post-session


@dataclass
class QuestionDefinition:
    """Définition d'une question du questionnaire expérimental."""
    id: str = field(default_factory=_generate_id)
    protocol_id: str = ""
    question_text: str = ""
    question_type: QuestionType = QuestionType.LIKERT
    options: str = "[]"             # JSON list des options/labels
    scale_min: int = 1
    scale_max: int = 5
    scale_name: str = ""            # Nom de l'échelle (ex: "Rook & Fisher")
    order_index: int = 0
    stimulus_id: str = ""           # Lié à un stimulus spécifique ("" = global)
    required: bool = True

    def get_options(self) -> list[str]:
        try:
            return json.loads(self.options)
        except (json.JSONDecodeError, TypeError):
            return []

    def set_options(self, opts: list[str]) -> None:
        self.options = json.dumps(opts)


@dataclass
class QuestionResponse:
    """Réponse d'un participant à une question."""
    id: str = field(default_factory=_generate_id)
    session_id: str = ""
    question_id: str = ""
    stimulus_id: str = ""
    timestamp_ms: int = 0
    response_value: str = ""        # Valeur brute (numérique ou texte)
    response_time_ms: int = 0       # Temps de réflexion (affichage → soumission)


if __name__ == "__main__":
    p = Participant(age=25, gender=Gender.MALE)
    print(f"Participant: {p.id} | age={p.age}")
    proto = Protocol(name="Test Packaging")
    proto.set_stimuli_list(["stim_001", "stim_002"])
    print(f"Protocol: {proto.name} | stimuli={proto.get_stimuli_list()}")
    sample = GazeSample(timestamp_ms=1500, gaze_x=960.5, gaze_y=540.2, quality=0.95)
    print(f"GazeSample: t={sample.timestamp_ms}ms | ({sample.gaze_x}, {sample.gaze_y})")
    fs = FacialSample(timestamp_ms=1500, emotion_primary="happy", valence=0.8, arousal=0.6)
    fs.set_scores({"happy": 0.85, "neutral": 0.1, "surprise": 0.05})
    print(f"FacialSample: t={fs.timestamp_ms}ms | {fs.emotion_primary} | scores={fs.get_scores()}")
    qd = QuestionDefinition(question_text="Intention d'achat ?", question_type=QuestionType.LIKERT)
    print(f"Question: {qd.question_text} | type={qd.question_type.value}")
    print("\n✅ Tous les modèles OK.")
