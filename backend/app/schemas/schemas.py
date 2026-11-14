"""Pydantic schemas for API requests and responses."""
from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime


# ----------------------------------------------------
# ASTRONAUT SCHEMAS
# ----------------------------------------------------
class AstronautBase(BaseModel):
    astronaut_id: str
    name: str
    role: str
    mission_id: str
    mission_duration_days: int = 180
    current_mission_day: int = 142
    baseline_heart_rate: float = 62.0
    baseline_spo2: float = 98.2
    baseline_body_temp: float = 36.6
    baseline_systolic_bp: float = 118.0
    baseline_diastolic_bp: float = 76.0
    baseline_sleep_hours: float = 7.5
    baseline_activity_mets: float = 3.8
    max_radiation_limit_msv: float = 200.0
    current_cumulative_radiation_msv: float = 42.6
    monitoring_preferences: Optional[str] = None
    avatar_url: Optional[str] = None


class AstronautOut(AstronautBase):
    created_at: Optional[str] = None


class AstronautUpdate(BaseModel):
    name: Optional[str] = None
    role: Optional[str] = None
    baseline_heart_rate: Optional[float] = None
    baseline_spo2: Optional[float] = None
    baseline_body_temp: Optional[float] = None
    baseline_systolic_bp: Optional[float] = None
    baseline_diastolic_bp: Optional[float] = None
    baseline_sleep_hours: Optional[float] = None
    baseline_activity_mets: Optional[float] = None
    max_radiation_limit_msv: Optional[float] = None
    monitoring_preferences: Optional[str] = None


class AstronautListResponse(BaseModel):
    total: int
    astronauts: List[AstronautOut]


# ----------------------------------------------------
# READING SCHEMAS
# ----------------------------------------------------
class ReadingBase(BaseModel):
    timestamp: str
    heart_rate: Optional[float] = None
    spo2: Optional[float] = None
    body_temp: Optional[float] = None
    resp_rate: Optional[float] = None
    systolic_bp: Optional[float] = None
    diastolic_bp: Optional[float] = None
    sleep_hours: Optional[float] = None
    activity_level: Optional[float] = None
    radiation_exposure: Optional[float] = None
    cumulative_radiation: Optional[float] = None
    value_statuses: Optional[str] = None  # JSON string or dict of field -> 'measured'|'simulated'|'unavailable'
    source: str = "simulated"
    astronaut_id: str = "ASTRO-01"


class ReadingCreate(ReadingBase):
    pass


class ReadingOut(ReadingBase):
    id: int
    created_at: Optional[str] = None


class ReadingListResponse(BaseModel):
    total: int
    page: int
    page_size: int
    readings: List[ReadingOut]


# ----------------------------------------------------
# HEALTH TRENDS SCHEMAS
# ----------------------------------------------------
class TrendPoint(BaseModel):
    timestamp: str
    heart_rate: Optional[float] = None
    spo2: Optional[float] = None
    body_temp: Optional[float] = None
    resp_rate: Optional[float] = None
    systolic_bp: Optional[float] = None
    diastolic_bp: Optional[float] = None
    sleep_hours: Optional[float] = None
    activity_level: Optional[float] = None
    radiation_exposure: Optional[float] = None
    is_anomaly: bool = False
    anomaly_score: Optional[float] = None
    anomaly_reason: Optional[str] = None


class HealthTrendsResponse(BaseModel):
    astronaut_id: str
    range_selected: str  # "24h", "7d", "30d", "all"
    point_count: int
    points: List[TrendPoint]
    summary_insights: List[str]


# ----------------------------------------------------
# ANOMALY DETECTION SCHEMAS
# ----------------------------------------------------
class AnomalyOut(BaseModel):
    id: int
    reading_id: Optional[int] = None
    timestamp: str
    metric: Optional[str] = None
    value: Optional[float] = None
    unit: Optional[str] = None
    anomaly_score: Optional[float] = None
    is_anomaly: bool
    method: Optional[str] = None
    reason: Optional[str] = None
    run_id: Optional[str] = None
    created_at: Optional[str] = None


class AnomalyRunResult(BaseModel):
    model_config = {"protected_namespaces": ()}
    run_id: str
    method: str
    records_analyzed: int
    anomalies_found: int
    anomaly_rate: float
    model_status: str
    message: str
    anomalies: List[AnomalyOut]


# ----------------------------------------------------
# ALERT SCHEMAS
# ----------------------------------------------------
class AlertOut(BaseModel):
    id: int
    alert_id: str
    timestamp: str
    metric: Optional[str] = None
    value: Optional[float] = None
    unit: Optional[str] = None
    severity: str  # 'info', 'warning', 'critical'
    method: Optional[str] = None
    explanation: Optional[str] = None
    suggested_action: Optional[str] = None
    alert_type: str = "health_concern"  # "health_concern" | "data_quality"
    acknowledged: bool
    acknowledged_at: Optional[str] = None
    reviewer_notes: Optional[str] = None
    review_status: str = "pending"  # "pending", "reviewed", "dismissed", "escalated"
    reading_id: Optional[int] = None
    anomaly_run_id: Optional[str] = None
    created_at: Optional[str] = None


class AlertUpdate(BaseModel):
    acknowledged: Optional[bool] = None
    reviewer_notes: Optional[str] = None
    review_status: Optional[str] = None  # "pending", "reviewed", "dismissed", "escalated"


class AlertListResponse(BaseModel):
    total: int
    alerts: List[AlertOut]


# ----------------------------------------------------
# MISSION HEALTH REPORT SCHEMAS
# ----------------------------------------------------
class ReportGenerateRequest(BaseModel):
    astronaut_id: str = "ASTRO-01"
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    title: Optional[str] = None


class ReportOut(BaseModel):
    report_id: str
    astronaut_id: str
    title: str
    date_range_start: str
    date_range_end: str
    generated_at: str
    summary_text: str
    stats: Dict[str, Any]
    alerts_summary: Dict[str, Any]
    recommendations: List[str]
    created_at: Optional[str] = None


class ReportListResponse(BaseModel):
    total: int
    reports: List[ReportOut]


# ----------------------------------------------------
# AUTH SCHEMAS
# ----------------------------------------------------
class LoginRequest(BaseModel):
    username: str
    password: str


class UserOut(BaseModel):
    id: int
    username: str
    role: str
    full_name: str
    astronaut_id: Optional[str] = None


class LoginResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserOut


# ----------------------------------------------------
# SIMULATOR SCHEMAS
# ----------------------------------------------------
class SimulatorStepRequest(BaseModel):
    scenario: str = "normal"  # "normal", "tachycardia", "hypoxia", "hyperthermia", "sleep_deprivation", "radiation_spike", "sensor_dropout"
    astronaut_id: str = "ASTRO-01"


class SimulatorStatus(BaseModel):
    is_active: bool = True
    mode: str = "simulated"
    last_timestamp: Optional[str] = None
    total_records: int
    available_scenarios: List[str]


# ----------------------------------------------------
# METRICS & HEALTH
# ----------------------------------------------------
class MetricStats(BaseModel):
    metric: str
    label: str
    unit: str
    latest_value: Optional[float]
    latest_timestamp: Optional[str]
    mean: Optional[float]
    std: Optional[float]
    min_val: Optional[float]
    max_val: Optional[float]
    count: int
    missing: int
    sparkline: List[Optional[float]]
    change_from_prev: Optional[float]
    normal_range: Optional[dict]
    status: str = "simulated"  # "measured", "simulated", "unavailable"


class ImportSummary(BaseModel):
    event_id: str
    filename: str
    records_accepted: int
    records_rejected: int
    records_flagged: int
    issues: List[str]
    source: str


class DatasetInfo(BaseModel):
    name: str
    source: str
    documentation_url: str
    variables: List[dict]
    date_range: Optional[dict] = None
    total_records: int
    license: str
    known_limitations: List[str]
    is_simulated: bool


class HealthCheckResponse(BaseModel):
    status: str
    app: str
    version: str
    database: str
    total_readings: int
