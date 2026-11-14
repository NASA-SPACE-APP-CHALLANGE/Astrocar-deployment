"""Health check endpoint."""
from fastapi import APIRouter
from app.core.database import get_connection
from app.schemas.schemas import HealthCheckResponse
from app.core.config import settings

router = APIRouter()

@router.get("/health", response_model=HealthCheckResponse)
def health_check():
    try:
        conn = get_connection()
        row = conn.execute("SELECT COUNT(*) as cnt FROM readings").fetchone()
        total = row["cnt"] if row else 0
        conn.close()
        db_status = "ok"
    except Exception as e:
        total = 0
        db_status = f"error: {str(e)}"
    
    return HealthCheckResponse(
        status="ok",
        app=settings.APP_NAME,
        version=settings.APP_VERSION,
        database=db_status,
        total_readings=total,
    )
