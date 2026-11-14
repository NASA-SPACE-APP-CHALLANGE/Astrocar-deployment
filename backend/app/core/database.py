"""SQLite database management with migration support and initial seed data."""
import sqlite3
import hashlib
import json
from pathlib import Path
from app.core.config import settings

def get_db_path() -> Path:
    settings.DATABASE_PATH.parent.mkdir(parents=True, exist_ok=True)
    return settings.DATABASE_PATH

def hash_password(password: str) -> str:
    """Hash password using SHA-256 with salt."""
    salt = "astrovital_salt_2025"
    return hashlib.sha256(f"{salt}_{password}".encode("utf-8")).hexdigest()

def init_db():
    """Initialize database tables and run lightweight migrations."""
    db_path = get_db_path()
    conn = sqlite3.connect(str(db_path))
    c = conn.cursor()

    # Readings table
    c.execute("""
        CREATE TABLE IF NOT EXISTS readings (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            timestamp TEXT NOT NULL,
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
            value_statuses TEXT,
            source TEXT DEFAULT 'simulated',
            astronaut_id TEXT DEFAULT 'ASTRO-01',
            created_at TEXT DEFAULT (datetime('now'))
        )
    """)

    # Check and add any missing columns in readings for existing tables
    c.execute("PRAGMA table_info(readings)")
    existing_reading_cols = [row[1] for row in c.fetchall()]
    new_cols = [
        ("sleep_hours", "REAL"),
        ("activity_level", "REAL"),
        ("radiation_exposure", "REAL"),
        ("cumulative_radiation", "REAL"),
        ("value_statuses", "TEXT"),
    ]
    for col_name, col_type in new_cols:
        if col_name not in existing_reading_cols:
            c.execute(f"ALTER TABLE readings ADD COLUMN {col_name} {col_type}")

    # Astronaut profiles table
    c.execute("""
        CREATE TABLE IF NOT EXISTS astronauts (
            astronaut_id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            role TEXT NOT NULL,
            mission_id TEXT NOT NULL,
            mission_duration_days INTEGER DEFAULT 180,
            current_mission_day INTEGER DEFAULT 142,
            baseline_heart_rate REAL DEFAULT 62.0,
            baseline_spo2 REAL DEFAULT 98.2,
            baseline_body_temp REAL DEFAULT 36.6,
            baseline_systolic_bp REAL DEFAULT 118.0,
            baseline_diastolic_bp REAL DEFAULT 76.0,
            baseline_sleep_hours REAL DEFAULT 7.5,
            baseline_activity_mets REAL DEFAULT 3.8,
            max_radiation_limit_msv REAL DEFAULT 200.0,
            current_cumulative_radiation_msv REAL DEFAULT 42.6,
            monitoring_preferences TEXT,
            avatar_url TEXT,
            created_at TEXT DEFAULT (datetime('now'))
        )
    """)

    # Seed default astronaut profiles if empty
    c.execute("SELECT COUNT(*) FROM astronauts")
    if c.fetchone()[0] == 0:
        default_astronauts = [
            (
                "ASTRO-01",
                "CDR Alex Vance",
                "Mission Commander / Systems Pilot",
                "ARTEMIS-VII",
                180,
                142,
                62.0,
                98.2,
                36.6,
                118.0,
                76.0,
                7.5,
                3.8,
                200.0,
                42.6,
                json.dumps({"alert_level": "standard", "quiet_hours": "22:00-06:00", "telemetry_rate_hz": 1, "auto_reporting": True}),
                "https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=150&auto=format&fit=crop&q=80",
            ),
            (
                "ASTRO-02",
                "Dr. Elena Rostova",
                "Flight Surgeon / Medical Officer",
                "ARTEMIS-VII",
                180,
                142,
                65.0,
                98.5,
                36.5,
                115.0,
                74.0,
                7.8,
                3.5,
                200.0,
                39.4,
                json.dumps({"alert_level": "high_sensitivity", "quiet_hours": "23:00-07:00", "telemetry_rate_hz": 1, "auto_reporting": True}),
                "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
            ),
            (
                "ASTRO-03",
                "Marcus Chen",
                "Payload Specialist / EVA Specialist",
                "ARTEMIS-VII",
                180,
                142,
                58.0,
                98.0,
                36.7,
                120.0,
                78.0,
                7.2,
                4.2,
                200.0,
                48.1,
                json.dumps({"alert_level": "standard", "quiet_hours": "22:30-06:30", "telemetry_rate_hz": 1, "auto_reporting": True}),
                "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
            ),
        ]
        c.executemany("""
            INSERT INTO astronauts (
                astronaut_id, name, role, mission_id, mission_duration_days,
                current_mission_day, baseline_heart_rate, baseline_spo2,
                baseline_body_temp, baseline_systolic_bp, baseline_diastolic_bp,
                baseline_sleep_hours, baseline_activity_mets, max_radiation_limit_msv,
                current_cumulative_radiation_msv, monitoring_preferences, avatar_url
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, default_astronauts)

    # Anomalies table
    c.execute("""
        CREATE TABLE IF NOT EXISTS anomalies (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            reading_id INTEGER,
            timestamp TEXT NOT NULL,
            metric TEXT,
            value REAL,
            unit TEXT,
            anomaly_score REAL,
            is_anomaly INTEGER DEFAULT 0,
            method TEXT,
            reason TEXT,
            run_id TEXT,
            created_at TEXT DEFAULT (datetime('now')),
            FOREIGN KEY(reading_id) REFERENCES readings(id)
        )
    """)

    # Alerts table
    c.execute("""
        CREATE TABLE IF NOT EXISTS alerts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            alert_id TEXT UNIQUE,
            timestamp TEXT NOT NULL,
            metric TEXT,
            value REAL,
            unit TEXT,
            severity TEXT DEFAULT 'info',
            method TEXT,
            explanation TEXT,
            suggested_action TEXT,
            alert_type TEXT DEFAULT 'health_concern',
            acknowledged INTEGER DEFAULT 0,
            acknowledged_at TEXT,
            reviewer_notes TEXT,
            review_status TEXT DEFAULT 'pending',
            reading_id INTEGER,
            anomaly_run_id TEXT,
            created_at TEXT DEFAULT (datetime('now'))
        )
    """)

    # Check and add missing columns in alerts
    c.execute("PRAGMA table_info(alerts)")
    existing_alert_cols = [row[1] for row in c.fetchall()]
    alert_cols = [
        ("suggested_action", "TEXT"),
        ("alert_type", "TEXT DEFAULT 'health_concern'"),
        ("reviewer_notes", "TEXT"),
        ("review_status", "TEXT DEFAULT 'pending'"),
    ]
    for col_name, col_def in alert_cols:
        if col_name not in existing_alert_cols:
            c.execute(f"ALTER TABLE alerts ADD COLUMN {col_name} {col_def}")

    # Mission Health Reports table
    c.execute("""
        CREATE TABLE IF NOT EXISTS reports (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            report_id TEXT UNIQUE NOT NULL,
            astronaut_id TEXT NOT NULL,
            title TEXT NOT NULL,
            date_range_start TEXT NOT NULL,
            date_range_end TEXT NOT NULL,
            generated_at TEXT DEFAULT (datetime('now')),
            summary_text TEXT,
            stats_json TEXT,
            alerts_summary_json TEXT,
            recommendations_json TEXT,
            created_at TEXT DEFAULT (datetime('now'))
        )
    """)

    # Users table for simple prototype authentication
    c.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            role TEXT NOT NULL,
            full_name TEXT NOT NULL,
            astronaut_id TEXT,
            created_at TEXT DEFAULT (datetime('now'))
        )
    """)

    # Seed default users if empty
    c.execute("SELECT COUNT(*) FROM users")
    if c.fetchone()[0] == 0:
        default_users = [
            ("astronaut", hash_password("astro2025"), "astronaut", "CDR Alex Vance", "ASTRO-01"),
            ("surgeon", hash_password("medical2025"), "medical_team", "Dr. Evelyn Reed", "ASTRO-02"),
            ("demo", hash_password("demo123"), "medical_team", "Flight Surgeon Guest", "ASTRO-01"),
        ]
        c.executemany("""
            INSERT INTO users (username, password_hash, role, full_name, astronaut_id)
            VALUES (?, ?, ?, ?, ?)
        """, default_users)

    # Import events table
    c.execute("""
        CREATE TABLE IF NOT EXISTS import_events (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            event_id TEXT UNIQUE,
            filename TEXT,
            records_accepted INTEGER DEFAULT 0,
            records_rejected INTEGER DEFAULT 0,
            records_flagged INTEGER DEFAULT 0,
            source TEXT,
            created_at TEXT DEFAULT (datetime('now'))
        )
    """)

    conn.commit()
    conn.close()

def get_connection():
    db_path = get_db_path()
    conn = sqlite3.connect(str(db_path))
    conn.row_factory = sqlite3.Row
    return conn
