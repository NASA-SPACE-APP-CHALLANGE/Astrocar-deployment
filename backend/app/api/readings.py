"""Readings and Health Trends endpoints."""
from fastapi import APIRouter, Query, HTTPException
from typing import Optional
from app.schemas.schemas import ReadingListResponse, ReadingOut, ReadingCreate, HealthTrendsResponse
from app.services.data_service import get_readings_page, get_readings_time_series, get_health_trends, insert_reading

router = APIRouter()


@router.get("/readings", response_model=ReadingListResponse)
@router.get("/health-readings", response_model=ReadingListResponse)
def list_readings(
    page: int = Query(1, ge=1),
    page_size: int = Query(50, ge=1, le=200),
    metric: Optional[str] = None,
    astronaut_id: Optional[str] = None,
    start: Optional[str] = None,
    end: Optional[str] = None,
    sort: Optional[str] = "timestamp",
    order: Optional[str] = "desc",
    search: Optional[str] = None,
):
    return get_readings_page(page, page_size, metric, astronaut_id, start, end, sort, order, search)


@router.post("/readings", response_model=ReadingOut)
@router.post("/health-readings", response_model=ReadingOut)
def create_reading(payload: ReadingCreate):
    created = insert_reading(payload.dict())
    return created


@router.get("/readings/timeseries")
def readings_timeseries(
    metric: str = Query("heart_rate"),
    start: Optional[str] = None,
    end: Optional[str] = None,
    limit: int = Query(200, le=500),
    astronaut_id: Optional[str] = None,
):
    return get_readings_time_series(metric, start, end, limit, astronaut_id)


@router.get("/health-trends", response_model=HealthTrendsResponse)
def health_trends(
    range: str = Query("24h", pattern="^(24h|7d|30d|all)$"),
    astronaut_id: str = "ASTRO-01",
):
    """Retrieve chart-ready trend data for 24h, 7d, 30d, or all mission intervals."""
    return get_health_trends(range_selected=range, astronaut_id=astronaut_id)
