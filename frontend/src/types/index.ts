// AstroCare & AstroVital AI frontend types

export interface Astronaut {
    astronaut_id: string;
    name: string;
    role: string;
    mission_id: string;
    mission_duration_days: number;
    current_mission_day: number;
    baseline_heart_rate: number;
    baseline_spo2: number;
    baseline_body_temp: number;
    baseline_systolic_bp: number;
    baseline_diastolic_bp: number;
    baseline_sleep_hours: number;
    baseline_activity_mets: number;
    max_radiation_limit_msv: number;
    current_cumulative_radiation_msv: number;
    monitoring_preferences?: string;
    avatar_url?: string;
    created_at?: string;
}

export interface MetricStats {
    metric: string;
    label: string;
    unit: string;
    latest_value: number | null;
    latest_timestamp: string | null;
    mean: number | null;
    std: number | null;
    min_val: number | null;
    max_val: number | null;
    count: number;
    missing: number;
    sparkline: (number | null)[];
    change_from_prev: number | null;
    normal_range: { min: number; max: number } | null;
    status?: string; // 'measured' | 'simulated' | 'unavailable'
}

export interface Reading {
    id: number;
    timestamp: string;
    heart_rate: number | null;
    spo2: number | null;
    body_temp: number | null;
    resp_rate: number | null;
    systolic_bp: number | null;
    diastolic_bp: number | null;
    sleep_hours: number | null;
    activity_level: number | null;
    radiation_exposure: number | null;
    cumulative_radiation: number | null;
    value_statuses?: string;
    source: string;
    astronaut_id: string;
    created_at: string | null;
}

export interface ReadingListResponse {
    total: number;
    page: number;
    page_size: number;
    readings: Reading[];
}

export interface TimeSeriesPoint {
    id?: number;
    timestamp: string;
    value: number;
    source?: string;
    astronaut_id?: string;
}

export interface TimeSeriesResponse {
    metric: string;
    total_points?: number;
    points?: TimeSeriesPoint[];
    data?: TimeSeriesPoint[];
}

export interface TrendPoint {
    timestamp: string;
    heart_rate: number | null;
    spo2: number | null;
    body_temp: number | null;
    resp_rate: number | null;
    systolic_bp: number | null;
    diastolic_bp: number | null;
    sleep_hours: number | null;
    activity_level: number | null;
    radiation_exposure: number | null;
    is_anomaly: boolean;
    anomaly_score?: number | null;
    anomaly_reason?: string | null;
}

export interface HealthTrendsResponse {
    astronaut_id: string;
    range_selected: string;
    point_count: number;
    points: TrendPoint[];
    summary_insights: string[];
}

export interface Anomaly {
    id: number;
    reading_id: number | null;
    timestamp: string;
    metric: string | null;
    value: number | null;
    unit: string | null;
    anomaly_score: number | null;
    is_anomaly: boolean;
    method: string | null;
    reason: string | null;
    run_id: string | null;
    created_at: string | null;
}

export interface AnomalyRunResult {
    run_id: string;
    method: string;
    records_analyzed: number;
    anomalies_found: number;
    anomaly_rate: number;
    model_status: string;
    message: string;
    anomalies: Anomaly[];
    total_analyzed?: number;
    anomalies_detected?: number;
    contamination_rate?: number;
}

export interface Alert {
    id: number;
    alert_id: string;
    timestamp: string;
    astronaut_id?: string;
    metric: string | null;
    metric_name?: string;
    value: number | null;
    unit: string | null;
    severity: 'info' | 'warning' | 'critical';
    method: string | null;
    explanation: string | null;
    message?: string;
    suggested_action?: string | null;
    triage_notes?: string;
    alert_type: 'health_concern' | 'data_quality';
    acknowledged: boolean;
    acknowledged_at: string | null;
    reviewer_notes?: string | null;
    review_status: 'pending' | 'reviewed' | 'dismissed' | 'escalated' | string;
    reading_id: number | null;
    anomaly_run_id: string | null;
    created_at: string | null;
}

export interface AlertListResponse {
    total: number;
    alerts: Alert[];
}

export interface MissionReport {
    report_id: string;
    astronaut_id: string;
    title: string;
    date_range_start: string;
    date_range_end: string;
    generated_at: string;
    summary_text: string;
    stats: Record<string, { count: number; mean: number; std: number; min: number; max: number }>;
    alerts_summary: {
        total_alerts: number;
        critical: number;
        warning: number;
        info: number;
        health_concerns: number;
        data_quality_issues: number;
    };
    recommendations: string[];
    created_at?: string;
}

export interface User {
    id: number;
    username: string;
    role: 'astronaut' | 'medical_team';
    full_name: string;
    astronaut_id?: string;
}

export interface LoginResponse {
    access_token: string;
    token_type: string;
    user: User;
}

export interface SimulatorStatus {
    is_active: boolean;
    mode: string;
    last_timestamp: string | null;
    total_records: number;
    available_scenarios: string[];
}

export interface ImportSummary {
    event_id: string;
    filename: string;
    records_accepted: number;
    records_rejected: number;
    records_flagged: number;
    issues: string[];
    source: string;
}

export interface DatasetVariable {
    name: string;
    unit: string;
    description: string;
}

export interface DatasetInfo {
    name: string;
    source: string;
    documentation_url: string;
    variables: DatasetVariable[];
    date_range: { start: string | null; end: string | null } | null;
    total_records: number;
    license: string;
    known_limitations: string[];
    is_simulated: boolean;
}

export interface HealthCheck {
    status: string;
    app?: string;
    system?: string;
    version?: string;
    database?: string;
    total_readings?: number;
    astronauts_registered?: number;
    timestamp?: string;
}
