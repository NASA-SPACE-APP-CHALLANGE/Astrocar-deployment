"""Alert service — create, triage, and manage astronaut health alerts."""
import uuid
from datetime import datetime, timezone
from typing import Optional, List, Dict, Any
from app.core.database import get_connection

SEVERITY_THRESHOLDS = {
    "heart_rate":         {"warning": (50, 100), "critical": (40, 140)},
    "spo2":               {"warning": (93, 100), "critical": (88, 100)},
    "body_temp":          {"warning": (36.1, 37.5), "critical": (35.0, 38.5)},
    "resp_rate":          {"warning": (12, 20), "critical": (8, 28)},
    "systolic_bp":        {"warning": (90, 140), "critical": (75, 165)},
    "diastolic_bp":       {"warning": (60, 90), "critical": (50, 105)},
    "activity_level":     {"warning": (0.5, 8.5), "critical": (0.0, 12.0)},
    "radiation_exposure": {"warning": (0.5, 10.0), "critical": (0.0, 30.0)},
}

SUGGESTED_ACTIONS = {
    "heart_rate": "Check ECG lead contacts; assess resting state vs physical exertion; hydrate with electrolyte solution.",
    "spo2": "Verify pulse oximeter probe placement; check cabin environmental O₂ levels; rest in seated position.",
    "body_temp": "Re-measure with secondary thermometer; check personal ventilation garment; monitor for spaceflight heat accumulation.",
    "resp_rate": "Confirm respiratory band tension; practice guided relaxed breathing; check cabin CO₂ scrubber status.",
    "systolic_bp": "Repeat manual or cuff measurement after 5 minutes of quiet rest; review fluid loading regimen.",
    "diastolic_bp": "Repeat measurement in 5 minutes; log salt and hydration intake; flag for flight surgeon review.",
    "radiation_exposure": "Alert mission control; monitor Space Weather Action Center advisory; retreat to shielded sleep module if dose rate persists.",
    "activity_level": "Verify accelerometer sync; log whether resistive exercise protocol (ARED) was performed.",
}


def _determine_severity(metric: Optional[str], value: Optional[float]) -> str:
    if not metric or value is None:
        return "info"
    thresholds = SEVERITY_THRESHOLDS.get(metric)
    if not thresholds:
        return "info"
    lo_c, hi_c = thresholds["critical"]
    lo_w, hi_w = thresholds["warning"]
    if value < lo_c or value > hi_c:
        return "critical"
    if value < lo_w or value > hi_w:
        return "warning"
    return "info"


def _determine_alert_type(metric: Optional[str], value: Optional[float]) -> str:
    if metric == "spo2" and (value is None or value < 70):
        return "data_quality"
    if metric == "heart_rate" and (value is None or value < 30 or value > 220):
        return "data_quality"
    return "health_concern"


def create_alerts_from_anomalies(anomalies: List[dict], run_id: str):
    """Create alert records for flagged anomalies with suggested actions and type distinction."""
    conn = get_connection()
    for a in anomalies:
        metric = a.get("metric")
        value = a.get("value")
        severity = _determine_severity(metric, value)
        alert_type = _determine_alert_type(metric, value)
        alert_id = str(uuid.uuid4())[:12]
        explanation = a.get("reason") or "This reading was flagged as unusual by the anomaly detection model. Research prototype alert — requires clinical review."
        suggested = SUGGESTED_ACTIONS.get(metric, "Perform routine biometric re-measurement and log mission notes.")

        conn.execute(
            """INSERT OR IGNORE INTO alerts 
               (alert_id, timestamp, metric, value, unit, severity, method, explanation, 
                suggested_action, alert_type, acknowledged, review_status, reading_id, anomaly_run_id)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, 'pending', ?, ?)""",
            (
                alert_id,
                a.get("timestamp", ""),
                metric,
                value,
                a.get("unit"),
                severity,
                a.get("method"),
                explanation,
                suggested,
                alert_type,
                a.get("reading_id"),
                run_id,
            ),
        )
    conn.commit()
    conn.close()


def get_alerts(
    severity: Optional[str] = None,
    metric: Optional[str] = None,
    acknowledged: Optional[bool] = None,
    alert_type: Optional[str] = None,
    review_status: Optional[str] = None,
    search: Optional[str] = None,
    limit: int = 100,
    offset: int = 0,
) -> dict:
    conn = get_connection()
    query = "SELECT * FROM alerts WHERE 1=1"
    params = []

    if severity:
        query += " AND severity = ?"
        params.append(severity)
    if metric:
        query += " AND metric = ?"
        params.append(metric)
    if acknowledged is not None:
        query += " AND acknowledged = ?"
        params.append(1 if acknowledged else 0)
    if alert_type:
        query += " AND alert_type = ?"
        params.append(alert_type)
    if review_status:
        query += " AND review_status = ?"
        params.append(review_status)
    if search:
        query += " AND (explanation LIKE ? OR metric LIKE ? OR suggested_action LIKE ?)"
        params.extend([f"%{search}%", f"%{search}%", f"%{search}%"])

    count_row = conn.execute(
        query.replace("SELECT *", "SELECT COUNT(*) as c"), params
    ).fetchone()
    total = count_row["c"] if count_row else 0

    query += " ORDER BY created_at DESC LIMIT ? OFFSET ?"
    params.extend([limit, offset])

    rows = conn.execute(query, params).fetchall()
    conn.close()

    alerts = []
    for r in rows:
        alerts.append({
            "id": r["id"],
            "alert_id": r["alert_id"],
            "timestamp": r["timestamp"],
            "metric": r["metric"],
            "value": r["value"],
            "unit": r["unit"],
            "severity": r["severity"],
            "method": r["method"],
            "explanation": r["explanation"],
            "suggested_action": r["suggested_action"],
            "alert_type": r["alert_type"] or "health_concern",
            "acknowledged": bool(r["acknowledged"]),
            "acknowledged_at": r["acknowledged_at"],
            "reviewer_notes": r["reviewer_notes"],
            "review_status": r["review_status"] or "pending",
            "reading_id": r["reading_id"],
            "anomaly_run_id": r["anomaly_run_id"],
            "created_at": r["created_at"],
        })

    return {"total": total, "alerts": alerts}


def update_alert(alert_id: str, updates: dict) -> Optional[dict]:
    """Update alert review status, notes, or acknowledgment."""
    conn = get_connection()
    fields = []
    params = []

    if "acknowledged" in updates and updates["acknowledged"] is not None:
        fields.append("acknowledged = ?")
        params.append(1 if updates["acknowledged"] else 0)
        if updates["acknowledged"]:
            fields.append("acknowledged_at = ?")
            params.append(datetime.now(timezone.utc).isoformat())

    if "reviewer_notes" in updates and updates["reviewer_notes"] is not None:
        fields.append("reviewer_notes = ?")
        params.append(updates["reviewer_notes"])

    if "review_status" in updates and updates["review_status"] is not None:
        fields.append("review_status = ?")
        params.append(updates["review_status"])

    if not fields:
        conn.close()
        return None

    query = f"UPDATE alerts SET {', '.join(fields)} WHERE alert_id = ?"
    params.append(alert_id)
    cursor = conn.execute(query, params)
    conn.commit()

    if cursor.rowcount == 0:
        conn.close()
        return None

    row = conn.execute("SELECT * FROM alerts WHERE alert_id = ?", (alert_id,)).fetchone()
    conn.close()

    return {
        "id": row["id"],
        "alert_id": row["alert_id"],
        "timestamp": row["timestamp"],
        "metric": row["metric"],
        "value": row["value"],
        "unit": row["unit"],
        "severity": row["severity"],
        "method": row["method"],
        "explanation": row["explanation"],
        "suggested_action": row["suggested_action"],
        "alert_type": row["alert_type"],
        "acknowledged": bool(row["acknowledged"]),
        "acknowledged_at": row["acknowledged_at"],
        "reviewer_notes": row["reviewer_notes"],
        "review_status": row["review_status"],
        "reading_id": row["reading_id"],
        "anomaly_run_id": row["anomaly_run_id"],
        "created_at": row["created_at"],
    }


def acknowledge_alert(alert_id: str) -> bool:
    res = update_alert(alert_id, {"acknowledged": True, "review_status": "reviewed"})
    return res is not None
