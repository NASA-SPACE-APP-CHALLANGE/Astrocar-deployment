"""API router aggregator."""
from fastapi import APIRouter
from app.api import (
    health,
    astronauts,
    metrics,
    readings,
    anomalies,
    alerts,
    reports,
    simulator,
    auth,
    datasets,
    imports,
)

router = APIRouter()
router.include_router(health.router, tags=["Health"])
router.include_router(astronauts.router, tags=["Astronauts"])
router.include_router(metrics.router, tags=["Metrics"])
router.include_router(readings.router, tags=["Readings"])
router.include_router(anomalies.router, tags=["Anomalies"])
router.include_router(alerts.router, tags=["Alerts"])
router.include_router(reports.router, tags=["Reports"])
router.include_router(simulator.router, tags=["Simulator"])
router.include_router(auth.router, tags=["Authentication"])
router.include_router(datasets.router, tags=["Datasets"])
router.include_router(imports.router, tags=["Imports"])
