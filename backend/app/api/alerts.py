"""Alerts management endpoints."""
from fastapi import APIRouter, HTTPException, Query
from typing import Optional
from app.schemas.schemas import AlertOut, AlertListResponse, AlertUpdate
from app.services.alert_service import get_alerts, acknowledge_alert, update_alert

router = APIRouter()


@router.get("/alerts", response_model=AlertListResponse)
def list_alerts(
    severity: Optional[str] = None,
    metric: Optional[str] = None,
    acknowledged: Optional[bool] = None,
    alert_type: Optional[str] = None,
    review_status: Optional[str] = None,
    search: Optional[str] = None,
    limit: int = Query(100, le=500),
    offset: int = 0,
):
    return get_alerts(severity, metric, acknowledged, alert_type, review_status, search, limit, offset)


@router.patch("/alerts/{alert_id}")
def patch_alert(alert_id: str, payload: AlertUpdate):
    """Update alert review status, notes, or acknowledgment."""
    result = update_alert(alert_id, payload.dict(exclude_unset=True))
    if not result:
        raise HTTPException(status_code=404, detail="Alert not found")
    return result


@router.patch("/alerts/{alert_id}/acknowledge")
def acknowledge(alert_id: str):
    result = acknowledge_alert(alert_id)
    if not result:
        raise HTTPException(status_code=404, detail="Alert not found")
    return {"status": "acknowledged", "alert_id": alert_id}
