"""Simulator service for generating and streaming realistic astronaut telemetry."""
import json
import math
import random
from datetime import datetime, timedelta, timezone
from typing import Dict, Any, Optional
import numpy as np
import pandas as pd
from app.core.database import get_connection
from app.data.generate_dataset import generate_dataset


AVAILABLE_SCENARIOS = [
    "normal",
    "tachycardia",
    "hypoxia",
    "hyperthermia",
    "hypertension_spike",
    "radiation_spike",
    "sensor_dropout",
]


def get_simulator_status() -> Dict[str, Any]:
    conn = get_connection()
    row = conn.execute("SELECT timestamp, cumulative_radiation FROM readings ORDER BY timestamp DESC LIMIT 1").fetchone()
    count_row = conn.execute("SELECT COUNT(*) as cnt FROM readings").fetchone()
    conn.close()

    last_ts = row["timestamp"] if row else None
    total = count_row["cnt"] if count_row else 0

    return {
        "is_active": True,
        "mode": "simulated",
        "last_timestamp": last_ts,
        "total_records": total,
        "available_scenarios": AVAILABLE_SCENARIOS,
    }


def step_simulator(scenario: str = "normal", astronaut_id: str = "ASTRO-01") -> Dict[str, Any]:
    """Generate and insert the next chronological simulated reading."""
    conn = get_connection()
    last_row = conn.execute(
        "SELECT timestamp, cumulative_radiation FROM readings WHERE astronaut_id = ? ORDER BY timestamp DESC LIMIT 1",
        (astronaut_id,),
    ).fetchone()

    if last_row and last_row["timestamp"]:
        try:
            last_dt = datetime.strptime(last_row["timestamp"], "%Y-%m-%d %H:%M:%S")
            next_dt = last_dt + timedelta(minutes=30)
        except ValueError:
            next_dt = datetime.now()
        cum_rad = float(last_row["cumulative_radiation"] or 42.6)
    else:
        next_dt = datetime.now()
        cum_rad = 42.6

    hour = next_dt.hour + next_dt.minute / 60.0

    # Normal circadian variation
    circadian_hr = -6.0 * math.cos(2 * math.pi * (hour - 3) / 24.0)
    circadian_temp = -0.35 * math.cos(2 * math.pi * (hour - 4) / 24.0)
    circadian_bp = -4.0 * math.cos(2 * math.pi * (hour - 3) / 24.0)

    # Daily exercise window
    is_exercise = 14.0 <= hour <= 15.5
    exercise_hr = random.uniform(45, 65) if is_exercise else 0.0
    activity = random.uniform(6.5, 8.5) if is_exercise else (0.9 if 23 <= hour or hour <= 6 else random.uniform(1.8, 3.2))

    hr = 64.0 + circadian_hr + exercise_hr + random.gauss(0, 2.5)
    spo2 = 98.2 - (0.4 if is_exercise else 0.0) + random.gauss(0, 0.4)
    temp = 36.6 + circadian_temp + (0.5 if is_exercise else 0.0) + random.gauss(0, 0.1)
    resp = 14.0 + (8.0 if is_exercise else 0.0) + random.gauss(0, 1.0)
    sys_bp = 116.0 + circadian_bp + (18.0 if is_exercise else 0.0) + random.gauss(0, 3.0)
    dia_bp = 75.0 + (circadian_bp * 0.6) + (6.0 if is_exercise else 0.0) + random.gauss(0, 2.0)
    rad_rate = 1.8 + random.gauss(0, 0.2)
    cum_rad += (rad_rate * 0.5) / 1000.0

    sleep_hours = None
    if next_dt.hour == 7 and next_dt.minute <= 30:
        sleep_hours = round(random.gauss(7.2, 0.6), 1)

    statuses = {
        "heart_rate": "simulated",
        "spo2": "simulated",
        "body_temp": "simulated",
        "resp_rate": "simulated",
        "blood_pressure": "simulated",
        "sleep": "simulated" if sleep_hours is not None else "unavailable",
        "activity": "simulated",
        "radiation": "simulated",
    }

    # Inject chosen scenario anomaly
    if scenario == "tachycardia":
        hr = round(random.uniform(138, 160), 1)
        activity = 1.2  # resting tachycardia
    elif scenario == "hypoxia":
        spo2 = round(random.uniform(84.0, 89.5), 1)
    elif scenario == "hyperthermia":
        temp = round(random.uniform(38.5, 39.3), 2)
    elif scenario == "hypertension_spike":
        sys_bp = round(random.uniform(160, 180), 1)
        dia_bp = round(random.uniform(102, 115), 1)
    elif scenario == "radiation_spike":
        rad_rate = round(random.uniform(45.0, 75.0), 2)
        cum_rad += (rad_rate * 0.5) / 1000.0
    elif scenario == "sensor_dropout":
        spo2 = None
        statuses["spo2"] = "unavailable"

    ts_str = next_dt.strftime("%Y-%m-%d %H:%M:%S")

    cursor = conn.execute(
        """INSERT INTO readings (
            timestamp, heart_rate, spo2, body_temp, resp_rate, systolic_bp, diastolic_bp,
            sleep_hours, activity_level, radiation_exposure, cumulative_radiation,
            value_statuses, source, astronaut_id
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'simulated', ?)""",
        (
            ts_str,
            round(hr, 1) if hr is not None else None,
            round(spo2, 1) if spo2 is not None else None,
            round(temp, 2) if temp is not None else None,
            round(resp, 1) if resp is not None else None,
            round(sys_bp, 1) if sys_bp is not None else None,
            round(dia_bp, 1) if dia_bp is not None else None,
            sleep_hours,
            round(activity, 1) if activity is not None else None,
            round(rad_rate, 2),
            round(cum_rad, 3),
            json.dumps(statuses),
            astronaut_id,
        ),
    )
    new_id = cursor.lastrowid
    conn.commit()
    conn.close()

    reading = {
        "id": new_id,
        "timestamp": ts_str,
        "heart_rate": round(hr, 1) if hr is not None else None,
        "spo2": round(spo2, 1) if spo2 is not None else None,
        "body_temp": round(temp, 2) if temp is not None else None,
        "resp_rate": round(resp, 1) if resp is not None else None,
        "systolic_bp": round(sys_bp, 1) if sys_bp is not None else None,
        "diastolic_bp": round(dia_bp, 1) if dia_bp is not None else None,
        "sleep_hours": sleep_hours,
        "activity_level": round(activity, 1) if activity is not None else None,
        "radiation_exposure": round(rad_rate, 2),
        "cumulative_radiation": round(cum_rad, 3),
        "value_statuses": json.dumps(statuses),
        "source": "simulated",
        "astronaut_id": astronaut_id,
        "scenario_injected": scenario,
    }

    return reading


def reset_simulator(n_records: int = 500, astronaut_id: str = "ASTRO-01") -> Dict[str, Any]:
    """Reset the database readings with a fresh simulated dataset."""
    df = generate_dataset(n=n_records, astronaut_id=astronaut_id)
    conn = get_connection()
    conn.execute("DELETE FROM readings WHERE astronaut_id = ?", (astronaut_id,))
    conn.execute("DELETE FROM anomalies")
    conn.execute("DELETE FROM alerts")

    for _, row in df.iterrows():
        conn.execute(
            """INSERT INTO readings (
                timestamp, heart_rate, spo2, body_temp, resp_rate, systolic_bp, diastolic_bp,
                sleep_hours, activity_level, radiation_exposure, cumulative_radiation,
                value_statuses, source, astronaut_id
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""",
            (
                row["timestamp"], row["heart_rate"], row["spo2"], row["body_temp"],
                row["resp_rate"], row["systolic_bp"], row["diastolic_bp"],
                row["sleep_hours"], row["activity_level"], row["radiation_exposure"],
                row["cumulative_radiation"], row["value_statuses"], row["source"],
                row["astronaut_id"],
            ),
        )
    conn.commit()
    conn.close()

    return {
        "status": "reset_complete",
        "records_generated": len(df),
        "astronaut_id": astronaut_id,
        "message": f"Successfully reset telemetry database with {len(df)} simulated astronaut records.",
    }
