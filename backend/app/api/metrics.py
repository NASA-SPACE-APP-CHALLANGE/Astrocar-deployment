"""Metrics summary endpoint."""
from fastapi import APIRouter
from typing import List
from app.schemas.schemas import MetricStats
from app.services.data_service import get_metric_stats

router = APIRouter()

METRIC_META = {
    "heart_rate":   {"label": "Heart Rate",         "unit": "bpm",          "normal": {"min": 50, "max": 100}},
    "spo2":         {"label": "Oxygen Saturation",  "unit": "%",            "normal": {"min": 94, "max": 100}},
    "body_temp":    {"label": "Body Temperature",   "unit": "°C",           "normal": {"min": 36.1, "max": 37.5}},
    "resp_rate":    {"label": "Respiratory Rate",   "unit": "breaths/min",  "normal": {"min": 12, "max": 20}},
    "systolic_bp":  {"label": "Systolic BP",        "unit": "mmHg",         "normal": {"min": 90, "max": 140}},
    "diastolic_bp": {"label": "Diastolic BP",       "unit": "mmHg",         "normal": {"min": 60, "max": 90}},
}

@router.get("/metrics", response_model=List[MetricStats])
def get_metrics():
    stats = get_metric_stats()
    results = []
    for key, meta in METRIC_META.items():
        s = stats.get(key, {})
        results.append(MetricStats(
            metric=key,
            label=meta["label"],
            unit=meta["unit"],
            latest_value=s.get("latest_value"),
            latest_timestamp=s.get("latest_timestamp"),
            mean=s.get("mean"),
            std=s.get("std"),
            min_val=s.get("min_val"),
            max_val=s.get("max_val"),
            count=s.get("count", 0),
            missing=s.get("missing", 0),
            sparkline=s.get("sparkline", []),
            change_from_prev=s.get("change_from_prev"),
            normal_range=meta["normal"],
        ))
    return results
