"""Anomaly service — runs detection and persists results."""
import uuid
from datetime import datetime
from typing import Optional
from app.core.database import get_connection
from app.services.data_service import get_readings_df
from app.ml.anomaly_detector import run_isolation_forest
from app.services.alert_service import create_alerts_from_anomalies


def run_analysis(contamination: float = 0.05, limit: int = 500) -> dict:
    df = get_readings_df(limit=limit)
    if df.empty:
        return {
            "run_id": "no-data",
            "method": "IsolationForest",
            "model_status": "no_data",
            "message": "No readings found in database.",
            "records_analyzed": 0,
            "anomalies_found": 0,
            "anomaly_rate": 0.0,
            "anomalies": [],
        }

    result = run_isolation_forest(df, contamination=contamination)

    # Persist anomalies to DB
    conn = get_connection()
    run_id = result["run_id"]
    
    # Clear previous results from same run
    conn.execute("DELETE FROM anomalies WHERE run_id = ?", (run_id,))

    flagged = []
    for a in result.get("anomalies", []):
        conn.execute(
            """INSERT INTO anomalies 
               (reading_id, timestamp, metric, value, unit, anomaly_score, is_anomaly, method, reason, run_id)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""",
            (
                a.get("reading_id"),
                a["timestamp"],
                a.get("metric"),
                a.get("value"),
                a.get("unit"),
                a.get("anomaly_score"),
                1 if a["is_anomaly"] else 0,
                a.get("method"),
                a.get("reason"),
                run_id,
            ),
        )
        if a["is_anomaly"]:
            row_id = conn.execute("SELECT last_insert_rowid() as id").fetchone()["id"]
            a["id"] = row_id
            flagged.append(a)

    conn.commit()
    conn.close()

    # Create alerts from flagged anomalies
    create_alerts_from_anomalies(flagged, run_id)

    # Build response anomaly list with IDs
    anomalies_out = []
    conn = get_connection()
    rows = conn.execute(
        "SELECT * FROM anomalies WHERE run_id = ? AND is_anomaly = 1 LIMIT 100", (run_id,)
    ).fetchall()
    conn.close()

    for r in rows:
        anomalies_out.append({
            "id": r["id"],
            "reading_id": r["reading_id"],
            "timestamp": r["timestamp"],
            "metric": r["metric"],
            "value": r["value"],
            "unit": r["unit"],
            "anomaly_score": r["anomaly_score"],
            "is_anomaly": bool(r["is_anomaly"]),
            "method": r["method"],
            "reason": r["reason"],
            "run_id": r["run_id"],
            "created_at": r["created_at"],
        })

    result["anomalies"] = anomalies_out
    return result


def get_anomalies_list(run_id: Optional[str], only_flagged: bool, limit: int) -> list:
    conn = get_connection()
    query = "SELECT * FROM anomalies WHERE 1=1"
    params = []
    if run_id:
        query += " AND run_id = ?"
        params.append(run_id)
    if only_flagged:
        query += " AND is_anomaly = 1"
    query += " ORDER BY created_at DESC LIMIT ?"
    params.append(limit)

    rows = conn.execute(query, params).fetchall()
    conn.close()

    return [
        {
            "id": r["id"],
            "reading_id": r["reading_id"],
            "timestamp": r["timestamp"],
            "metric": r["metric"],
            "value": r["value"],
            "unit": r["unit"],
            "anomaly_score": r["anomaly_score"],
            "is_anomaly": bool(r["is_anomaly"]),
            "method": r["method"],
            "reason": r["reason"],
            "run_id": r["run_id"],
            "created_at": r["created_at"],
        }
        for r in rows
    ]
