import secrets
from fastapi import HTTPException, Security
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

# Génération d'un token aléatoire au démarrage
SESSION_TOKEN = secrets.token_urlsafe(32)
security = HTTPBearer()

def verify_token(credentials: HTTPAuthorizationCredentials = Security(security)):
    """Vérifie que le token Bearer correspond au token de session généré."""
    if credentials.credentials != SESSION_TOKEN:
        raise HTTPException(status_code=401, detail="Invalid token")
    return credentials.credentials
