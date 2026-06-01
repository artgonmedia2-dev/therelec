"""
Serveur API REST pour l'interopérabilité (P3).
Permet l'accès sécurisé aux données de session, participants et protocoles
depuis des systèmes externes (ex: tableaux de bord web).
"""
import os
import uvicorn
from fastapi import FastAPI, Depends, HTTPException, Security, status
from fastapi.security import APIKeyHeader
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional

from data.database import DatabaseManager

app = FastAPI(
    title="NeuroVision REST API",
    description="API for accessing Eye Tracking and Neuromarketing data.",
    version="2.0.0"
)

from api.auth import verify_token, SESSION_TOKEN
from utils.logger import get_logger

logger = get_logger("api")
logger.info(f"API Authentication Token (Bearer): {SESSION_TOKEN}")

# --- CORS ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # En production, spécifier les domaines
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Base de données ---
def get_db():
    return DatabaseManager()

# --- Routes ---

@app.get("/")
def read_root():
    return {"status": "online", "version": "2.0.0"}

@app.get("/participants", dependencies=[Depends(verify_token)])
def list_participants(db: DatabaseManager = Depends(get_db)):
    """Récupère la liste des participants."""
    parts = db.get_all_participants()
    return [{"id": p.id, "name": p.name, "age": p.age, "gender": p.gender} for p in parts]

@app.get("/protocols", dependencies=[Depends(verify_token)])
def list_protocols(db: DatabaseManager = Depends(get_db)):
    """Récupère la liste des protocoles."""
    protos = db.get_all_protocols()
    return [{"id": p.id, "name": p.name, "description": p.description} for p in protos]

@app.get("/sessions", dependencies=[Depends(verify_token)])
def list_sessions(db: DatabaseManager = Depends(get_db)):
    """Récupère la liste des sessions."""
    sessions = db.get_all_sessions()
    return [{
        "id": s.id, 
        "participant_id": s.participant_id, 
        "protocol_id": s.protocol_id,
        "status": s.status.value,
        "created_at": s.created_at
    } for s in sessions]

@app.get("/sessions/{session_id}/stats", dependencies=[Depends(verify_token)])
def get_session_stats(session_id: str, db: DatabaseManager = Depends(get_db)):
    """Récupère les statistiques d'une session (qualité, durée, etc.)."""
    gaze_df = db.get_session_gaze_data(session_id)
    if gaze_df.empty:
        raise HTTPException(status_code=404, detail="Session or gaze data not found")
        
    avg_quality = float(gaze_df["quality"].mean())
    blink_count = int(gaze_df["blink"].sum())
    total_samples = len(gaze_df)
    
    return {
        "session_id": session_id,
        "total_samples": total_samples,
        "average_quality": avg_quality,
        "blinks_detected": blink_count
    }

def start_server(host: str = "127.0.0.1", port: int = 8000):
    """Démarre le serveur Uvicorn."""
    uvicorn.run(app, host=host, port=port)
