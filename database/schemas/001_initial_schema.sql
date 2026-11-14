-- AstroCare SQLite Database Schema
-- Version: 2.0.0
-- Standard: NASA Human Research Program (HRP) & NASA-STD-3001

PRAGMA foreign_keys = ON;

-- 1. Astronauts Table
CREATE TABLE IF NOT EXISTS astronauts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    astronaut_id TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    mission_id TEXT NOT NULL DEFAULT 'ARTEMIS-VII',
    current_mission_day INTEGER NOT NULL DEFAULT 142,
    mission_duration_days INTEGER NOT NULL DEFAULT 180,
    age INTEGER NOT NULL,
    gender TEXT NOT NULL,
    nationality TEXT NOT NULL DEFAULT 'NASA / International Partner',
    avatar_url TEXT,
    eva_certified BOOLEAN NOT NULL DEFAULT 1,
    blood_type TEXT DEFAULT 'O+',
    current_cumulative_radiation_msv REAL NOT NULL DEFAULT 42.6,
    career_limit_radiation_msv REAL NOT NULL DEFAULT 600.0,
    baseline_heart_rate REAL NOT NULL DEFAULT 62.0,
    baseline_spo2 REAL NOT NULL DEFAULT 98.2,
    baseline_body_temp REAL NOT NULL DEFAULT 36.6,
    baseline_systolic_bp REAL NOT NULL DEFAULT 118.0,
    baseline_diastolic_bp REAL NOT NULL DEFAULT 76.0,
    baseline_sleep_hours REAL NOT NULL DEFAULT 7.5,
    baseline_activity_mets REAL NOT NULL DEFAULT 3.8,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index on astronaut_id for fast lookups
CREATE INDEX IF NOT EXISTS idx_astronauts_id ON astronauts(astronaut_id);

-- 2. Telemetry Readings Table
CREATE TABLE IF NOT EXISTS readings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    astronaut_id TEXT NOT NULL,
    heart_rate REAL,
    spo2 REAL,
    body_temp REAL,
    resp_rate REAL,
    systolic_bp REAL,
    diastolic_bp REAL,
    sleep_hours REAL,
    activity_level REAL,
    radiation_exposure REAL,
    cumulative_radiation REAL,
    cabin_co2 REAL DEFAULT 3.2,
    cabin_o2 REAL DEFAULT 21.2,
    cabin_pressure REAL DEFAULT 101.3,
    value_statuses TEXT,
    source TEXT NOT NULL DEFAULT 'measured',
    FOREIGN KEY (astronaut_id) REFERENCES astronauts(astronaut_id) ON DELETE CASCADE
);

-- Indices for high-frequency timeseries querying
CREATE INDEX IF NOT EXISTS idx_readings_astro_time ON readings(astronaut_id, timestamp);
CREATE INDEX IF NOT EXISTS idx_readings_timestamp ON readings(timestamp);

-- 3. Alerts Table
CREATE TABLE IF NOT EXISTS alerts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    alert_id TEXT UNIQUE NOT NULL,
    timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    reading_id INTEGER,
    astronaut_id TEXT NOT NULL,
    metric_name TEXT NOT NULL,
    metric_value REAL NOT NULL,
    threshold_min REAL,
    threshold_max REAL,
    severity TEXT NOT NULL CHECK(severity IN ('info', 'warning', 'critical')),
    message TEXT NOT NULL,
    acknowledged BOOLEAN NOT NULL DEFAULT 0,
    acknowledged_at TIMESTAMP,
    acknowledged_by TEXT,
    review_status TEXT NOT NULL DEFAULT 'New',
    triage_notes TEXT,
    alert_type TEXT DEFAULT 'health_concern',
    suggested_action TEXT,
    FOREIGN KEY (astronaut_id) REFERENCES astronauts(astronaut_id) ON DELETE CASCADE,
    FOREIGN KEY (reading_id) REFERENCES readings(id) ON DELETE SET NULL
);

-- Indices for alerts center and triage lookups
CREATE INDEX IF NOT EXISTS idx_alerts_astro ON alerts(astronaut_id);
CREATE INDEX IF NOT EXISTS idx_alerts_unack ON alerts(acknowledged, severity);

-- 4. Mission Reports Table
CREATE TABLE IF NOT EXISTS mission_reports (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    report_id TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    astronaut_id TEXT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    total_records INTEGER NOT NULL DEFAULT 0,
    anomaly_count INTEGER NOT NULL DEFAULT 0,
    alert_count INTEGER NOT NULL DEFAULT 0,
    summary_text TEXT NOT NULL,
    recommendations TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (astronaut_id) REFERENCES astronauts(astronaut_id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_reports_astro ON mission_reports(astronaut_id);

