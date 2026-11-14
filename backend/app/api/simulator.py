"""Data simulator endpoints for realistic astronaut telemetry generation."""
from fastapi import APIRouter, Query
from app.schemas.schemas import SimulatorStatus, SimulatorStepRequest
from app.services.simulator_service import get_simulator_status, step_simulator, reset_simulator

router = APIRouter()


@router.get("/simulator/status", response_model=SimulatorStatus)
def status():
    return get_simulator_status()


@router.post("/simulator/start")
def start_simulation(n_records: int = Query(500, ge=10, le=2000), astronaut_id: str = "ASTRO-01"):
    """Start or replenish sample-data generation."""
    return reset_simulator(n_records=n_records, astronaut_id=astronaut_id)


@router.post("/simulator/step")
def step(payload: SimulatorStepRequest):
    """Generate and append the next single reading with chosen scenario anomaly."""
    return step_simulator(scenario=payload.scenario, astronaut_id=payload.astronaut_id)


@router.post("/simulator/reset")
def reset(n_records: int = Query(500, ge=50, le=2000), astronaut_id: str = "ASTRO-01"):
    """Reset simulator database to standard baseline."""
    return reset_simulator(n_records=n_records, astronaut_id=astronaut_id)
