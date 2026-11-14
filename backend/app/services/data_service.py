"""Data service — readings, metrics, trends, and seeding."""
import json
import pandas as pd
import numpy as np
from typing import Optional, List, Dict, Any
from datetime import datetime
from app.core.database import get_connection
from app.core.config import settings
from app.data.generate_dataset import save_dataset, generate_dataset


METRIC_COLS = [
    "heart_rate",
    "spo2",
    "body_temp",
    "resp_rate",
    "systolic_bp",
    "diastolic_bp",
    "sleep_hours",
    "activity_level",
    "radiation_exposure",
]

METRIC_LABELS = {
    "heart_rate": "Heart Rate",
    "spo2": "Blood Oxygen (SpO₂)",
    "body_temp": "Core Temperature",
    "resp_rate": "Respiration Rate",
    "systolic_bp": "Systolic BP",
    "diastolic_bp": "Diastolic BP",
    "sleep_hours": "Sleep Duration",
    "activity_level": "Physical Activity",
    "radiation_exposure": "Radiation Dose Rate",
}

METRIC_UNITS = {
    "heart_rate": "bpm",
    "spo2": "%",
    "body_temp": "°C",
    "resp_rate": "br/min",
    "systolic_bp": "mmHg",
    "diastolic_bp": "mmHg",
    "sleep_hours": "hrs",
    "activity_level": "METs",
    "radiation_exposure": "μSv/h",
}

NORMAL_RANGES = {
    "heart_rate": {"min": 50, "max": 100},
    "spo2": {"min": 94, "max": 100},
    "body_temp": {"min": 36.1, "max": 37.5},
    "resp_rate": {"min": 12, "max": 20},
    "systolic_bp": {"min": 90, "max": 140},
    "diastolic_bp": {"min": 60, "max": 90},
    "sleep_hours": {"min": 6.5, "max": 8.5},
    "activity_level": {"min": 1.5, "max": 8.0},
    "radiation_exposure": {"min": 0.5, "max": 5.0},
}


async def seed_simulated_data_if_empty():
    """Seed the database with rich simulated telemetry if it has no readings or missing columns."""
    conn = get_connection()
    count = conn.execute("SELECT COUNT(*) as c FROM readings").fetchone()["c"]
    
    # Check if existing readings have sleep_hours populated
    has_sleep = False
    if count > 0:
        row = conn.execute("SELECT sleep_hours, activity_level FROM readings WHERE sleep_hours IS NOT NULL LIMIT 1").fetchone()
        has_sleep = row is not None
        
    if count > 0 and has_sleep:
        conn.close()
        return

    # Seed fresh comprehensive dataset
    df = generate_dataset(n=500, astronaut_id="ASTRO-01")
    conn.execute("DELETE FROM readings WHERE astronaut_id = 'ASTRO-01' OR astronaut_id = 'A-01'")
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


def get_readings_df(limit: int = 1000, astronaut_id: Optional[str] = None) -> pd.DataFrame:
    conn = get_connection()
    if astronaut_id:
        rows = conn.execute(
            f"SELECT * FROM readings WHERE astronaut_id = ? ORDER BY timestamp ASC LIMIT {limit}",
            (astronaut_id,),
        ).fetchall()
    else:
        rows = conn.execute(
            f"SELECT * FROM readings ORDER BY timestamp ASC LIMIT {limit}"
        ).fetchall()
    conn.close()
    if not rows:
        return pd.DataFrame()
    return pd.DataFrame([dict(r) for r in rows])


def get_metric_stats(astronaut_id: Optional[str] = "ASTRO-01") -> dict:
    conn = get_connection()
    if astronaut_id:
        rows = conn.execute(
            "SELECT * FROM readings WHERE astronaut_id = ? ORDER BY timestamp ASC",
            (astronaut_id,),
        ).fetchall()
    else:
        rows = conn.execute("SELECT * FROM readings ORDER BY timestamp ASC").fetchall()
    conn.close()
    if not rows:
        return {}

    df = pd.DataFrame([dict(r) for r in rows])
    stats = {}

    for col in METRIC_COLS:
        if col not in df.columns:
            continue
        series = df[col].dropna()
        missing = int(df[col].isna().sum())
        count = len(series)

        sparkline_raw = df.tail(20)[col].tolist()
        sparkline = [float(v) if not pd.isna(v) else None for v in sparkline_raw]

        change = None
        if len(series) >= 2:
            change = round(float(series.iloc[-1]) - float(series.iloc[-2]), 2)

        stats[col] = {
            "metric": col,
            "label": METRIC_LABELS.get(col, col),
            "unit": METRIC_UNITS.get(col, ""),
            "latest_value": round(float(series.iloc[-1]), 2) if count > 0 else None,
            "latest_timestamp": str(df.loc[df[col].notna(), "timestamp"].iloc[-1]) if count > 0 else None,
            "mean": round(float(series.mean()), 2) if count > 0 else None,
            "std": round(float(series.std()), 2) if count > 0 else None,
            "min_val": round(float(series.min()), 2) if count > 0 else None,
            "max_val": round(float(series.max()), 2) if count > 0 else None,
            "count": count,
            "missing": missing,
            "sparkline": sparkline,
            "change_from_prev": change,
            "normal_range": NORMAL_RANGES.get(col),
            "status": "simulated",
        }

    return stats


def get_readings_page(page, page_size, metric, astronaut_id, start, end, sort, order, search):
    conn = get_connection()
    query = "SELECT * FROM readings WHERE 1=1"
    params = []

    if astronaut_id:
        query += " AND (astronaut_id = ? OR astronaut_id = 'A-01')"
        params.append(astronaut_id)
    if start:
        query += " AND timestamp >= ?"
        params.append(start)
    if end:
        query += " AND timestamp <= ?"
        params.append(end)
    if metric and metric in METRIC_COLS:
        query += f" AND {metric} IS NOT NULL"
    if search:
        query += " AND (timestamp LIKE ? OR source LIKE ?)"
        params.extend([f"%{search}%", f"%{search}%"])

    count_query = query.replace("SELECT *", "SELECT COUNT(*) as c")
    count_row = conn.execute(count_query, params).fetchone()
    total = count_row["c"] if count_row else 0

    sort_col = sort if sort in METRIC_COLS + ["timestamp", "id"] else "timestamp"
    sort_dir = "ASC" if str(order).lower() == "asc" else "DESC"
    query += f" ORDER BY {sort_col} {sort_dir} LIMIT ? OFFSET ?"
    params.extend([page_size, (page - 1) * page_size])

    rows = conn.execute(query, params).fetchall()
    conn.close()

    readings = []
    for r in rows:
        readings.append({
            "id": r["id"],
            "timestamp": r["timestamp"],
            "heart_rate": r["heart_rate"],
            "spo2": r["spo2"],
            "body_temp": r["body_temp"],
            "resp_rate": r["resp_rate"],
            "systolic_bp": r["systolic_bp"],
            "diastolic_bp": r["diastolic_bp"],
            "sleep_hours": r["sleep_hours"],
            "activity_level": r["activity_level"],
            "radiation_exposure": r["radiation_exposure"],
            "cumulative_radiation": r["cumulative_radiation"],
            "value_statuses": r["value_statuses"],
            "source": r["source"],
            "astronaut_id": r["astronaut_id"],
            "created_at": r["created_at"],
        })

    return {"total": total, "page": page, "page_size": page_size, "readings": readings}


def get_readings_time_series(metric: str = "heart_rate", start: Optional[str] = None, end: Optional[str] = None, limit: int = 200, astronaut_id: Optional[str] = None):
    conn = get_connection()
    query = f"SELECT id, timestamp, {metric}, source, astronaut_id FROM readings WHERE {metric} IS NOT NULL"
    params = []

    if astronaut_id:
        query += " AND (astronaut_id = ? OR astronaut_id = 'A-01')"
        params.append(astronaut_id)
    if start:
        query += " AND timestamp >= ?"
        params.append(start)
    if end:
        query += " AND timestamp <= ?"
        params.append(end)

    query += " ORDER BY timestamp ASC LIMIT ?"
    params.append(limit)

    rows = conn.execute(query, params).fetchall()
    conn.close()

    points = []
    for r in rows:
        points.append({
            "id": r["id"],
            "timestamp": r["timestamp"],
            "value": r[metric],
            "source": r["source"],
            "astronaut_id": r["astronaut_id"],
        })
    return {"metric": metric, "total_points": len(points), "points": points}


def get_health_trends(range_selected: str = "24h", astronaut_id: str = "ASTRO-01") -> Dict[str, Any]:
    """Return chart-ready trend points with anomaly flags and clinical insight summaries."""
    conn = get_connection()

    # Determine limit / rows based on range
    if range_selected == "24h":
        limit = 48  # 48 30-min intervals
    elif range_selected == "7d":
        limit = 336  # 7 days
    elif range_selected == "30d":
        limit = 500
    else:
        limit = 1000

    query = """
        SELECT r.*, a.is_anomaly, a.anomaly_score, a.reason as anomaly_reason
        FROM readings r
        LEFT JOIN anomalies a ON r.id = a.reading_id
        WHERE (r.astronaut_id = ? OR r.astronaut_id = 'A-01')
        ORDER BY r.timestamp DESC
        LIMIT ?
    """
    rows = conn.execute(query, (astronaut_id, limit)).fetchall()
    conn.close()

    # Reverse to chronological order (ASC)
    chronological_rows = list(reversed(rows))

    points = []
    anomalies_count = 0
    hr_values = []
    spo2_values = []
    sleep_values = []

    for r in chronological_rows:
        is_anom = bool(r["is_anomaly"] or 0)
        if is_anom:
            anomalies_count += 1
        if r["heart_rate"] is not None:
            hr_values.append(r["heart_rate"])
        if r["spo2"] is not None:
            spo2_values.append(r["spo2"])
        if r["sleep_hours"] is not None:
            sleep_values.append(r["sleep_hours"])

        points.append({
            "timestamp": r["timestamp"],
            "heart_rate": r["heart_rate"],
            "spo2": r["spo2"],
            "body_temp": r["body_temp"],
            "resp_rate": r["resp_rate"],
            "systolic_bp": r["systolic_bp"],
            "diastolic_bp": r["diastolic_bp"],
            "sleep_hours": r["sleep_hours"],
            "activity_level": r["activity_level"],
            "radiation_exposure": r["radiation_exposure"],
            "is_anomaly": is_anom,
            "anomaly_score": r["anomaly_score"],
            "anomaly_reason": r["anomaly_reason"],
        })

    # Generate data-driven plain-language insights
    insights = []
    if hr_values:
        avg_hr = np.mean(hr_values)
        std_hr = np.std(hr_values)
        if std_hr > 12:
            insights.append(f"Heart rate readings have varied more than usual during this monitoring period (mean: {avg_hr:.1f} bpm, std dev: ±{std_hr:.1f} bpm).")
        else:
            insights.append(f"Cardiovascular stability is nominal across the selected window with resting mean of {avg_hr:.1f} bpm.")

    if sleep_values:
        avg_sleep = np.mean(sleep_values)
        if avg_sleep < 6.0:
            insights.append(f"Sleep duration has decreased over recent logs (averaging {avg_sleep:.1f} hrs vs 7.5 hrs target baseline).")
        else:
            insights.append(f"Sleep duration is within expected recovery thresholds, averaging {avg_sleep:.1f} hrs per sleep window.")

    if anomalies_count > 0:
        insights.append(f"{anomalies_count} unusual reading(s) flagged by the AI engine requiring review against the astronaut's established baseline.")
    else:
        insights.append("Zero unreviewed anomalies detected; physiological parameters align with expected microgravity baselines.")

    return {
        "astronaut_id": astronaut_id,
        "range_selected": range_selected,
        "point_count": len(points),
        "points": points,
        "summary_insights": insights,
    }


def insert_reading(data: dict) -> dict:
    conn = get_connection()
    cursor = conn.execute(
        """INSERT INTO readings (
            timestamp, heart_rate, spo2, body_temp, resp_rate, systolic_bp, diastolic_bp,
            sleep_hours, activity_level, radiation_exposure, cumulative_radiation,
            value_statuses, source, astronaut_id
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""",
        (
            data.get("timestamp"),
            data.get("heart_rate"),
            data.get("spo2"),
            data.get("body_temp"),
            data.get("resp_rate"),
            data.get("systolic_bp"),
            data.get("diastolic_bp"),
            data.get("sleep_hours"),
            data.get("activity_level"),
            data.get("radiation_exposure"),
            data.get("cumulative_radiation"),
            data.get("value_statuses") or json.dumps({"source": data.get("source", "simulated")}),
            data.get("source", "simulated"),
            data.get("astronaut_id", "ASTRO-01"),
        ),
    )
    new_id = cursor.lastrowid
    conn.commit()
    conn.close()
    data["id"] = new_id
    return data


def get_dataset_info() -> dict:
    conn = get_connection()
    count_row = conn.execute("SELECT COUNT(*) as c FROM readings").fetchone()
    total = count_row["c"] if count_row else 0
    first_row = conn.execute("SELECT timestamp FROM readings ORDER BY timestamp ASC LIMIT 1").fetchone()
    last_row = conn.execute("SELECT timestamp FROM readings ORDER BY timestamp DESC LIMIT 1").fetchone()
    conn.close()

    variables = [
        {"name": "heart_rate", "type": "continuous", "unit": "bpm", "description": "Continuous ECG-derived heart rate"},
        {"name": "spo2", "type": "continuous", "unit": "%", "description": "Pulse oximetry arterial blood oxygen saturation"},
        {"name": "body_temp", "type": "continuous", "unit": "°C", "description": "Core body temperature via tympanic/skin sensor"},
        {"name": "resp_rate", "type": "continuous", "unit": "breaths/min", "description": "Respiratory cycle rate per minute"},
        {"name": "systolic_bp", "type": "continuous", "unit": "mmHg", "description": "Systolic arterial pressure"},
        {"name": "diastolic_bp", "type": "continuous", "unit": "mmHg", "description": "Diastolic arterial pressure"},
        {"name": "sleep_hours", "type": "continuous", "unit": "hrs", "description": "Total nocturnal restorative sleep duration"},
        {"name": "activity_level", "type": "continuous", "unit": "METs", "description": "Physical exertion and metabolic equivalent load"},
        {"name": "radiation_exposure", "type": "continuous", "unit": "μSv/h", "description": "Ambient cosmic ionizing radiation dose rate"},
    ]

    return {
        "name": "Artemis & ISS Simulated Astronaut Physiological Telemetry",
        "source": "AstroCare Synthetic Mission Telemetry Engine (AlgoX Space Health Lab)",
        "documentation_url": "https://github.com/NASA-SPACE-APP-CHALLANGE/Kino-Movie-Recommendation",
        "variables": variables,
        "date_range": {
            "start": first_row["timestamp"] if first_row else "2025-01-01 00:00:00",
            "end": last_row["timestamp"] if last_row else "2025-01-11 12:00:00",
        },
        "total_records": total,
        "license": "Creative Commons Attribution 4.0 / Open Space Research License",
        "known_limitations": [
            "Research prototype simulated data for Space Apps demonstration.",
            "Not certified for clinical diagnostics on actual astronauts.",
            "Synthetic anomalies are injected for algorithm validation.",
        ],
        "is_simulated": True,
    }

