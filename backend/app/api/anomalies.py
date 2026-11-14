"""Anomaly detection endpoints using Isolation Forest."""
from fastapi import APIRouter, Query
from typing import Optional, List
from app.schemas.schemas import AnomalyRunResult, AnomalyOut
from app.services.anomaly_service import run_analysis, get_anomalies_list

router = APIRouter()


@router.post("/analyze", response_model=AnomalyRunResult)
@router.post("/anomalies/analyze", response_model=AnomalyRunResult)
def analyze_anomalies(
    contamination: float = Query(0.05, ge=0.01, le=0.5),
    limit: int = Query(500, ge=10, le=2000),
):
    """Run Isolation Forest anomaly detection across stored telemetry."""
    return run_analysis(contamination=contamination, limit=limit)


@router.get("/anomalies", response_model=List[AnomalyOut])
def list_anomalies(
    run_id: Optional[str] = None,
    only_flagged: bool = True,
    limit: int = Query(100, le=500),
):
    return get_anomalies_list(run_id=run_id, only_flagged=only_flagged, limit=limit)
