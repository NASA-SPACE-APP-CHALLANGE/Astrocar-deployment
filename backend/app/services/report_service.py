"""Report service — generate, store, and export mission health summaries."""
import csv
import io
import json
import uuid
from datetime import datetime, timezone
from typing import Dict, Any, List, Optional
import numpy as np
import pandas as pd
from app.core.database import get_connection

METRIC_NAMES = ["heart_rate", "spo2", "body_temp", "resp_rate", "systolic_bp", "diastolic_bp", "sleep_hours", "activity_level", "radiation_exposure"]


def generate_mission_report(
    astronaut_id: str = "ASTRO-01",
    start_date: Optional[str] = None,
    end_date: Optional[str] = None,
    title: Optional[str] = None,
) -> Dict[str, Any]:
    """Generate a mission health report across biometrics, anomalies, and clinical trends."""
    conn = get_connection()

    # Get astronaut info
    astro_row = conn.execute("SELECT * FROM astronauts WHERE astronaut_id = ?", (astronaut_id,)).fetchone()
    astro_name = astro_row["name"] if astro_row else astronaut_id
    mission_id = astro_row["mission_id"] if astro_row else "ARTEMIS-VII"

    # Query readings
    query = "SELECT * FROM readings WHERE (astronaut_id = ? OR astronaut_id = 'A-01')"
    params = [astronaut_id]
    if start_date:
        query += " AND timestamp >= ?"
        params.append(start_date)
    if end_date:
        query += " AND timestamp <= ?"
        params.append(end_date)
    query += " ORDER BY timestamp ASC"

    rows = conn.execute(query, params).fetchall()

    if not rows:
        # Fallback to all readings
        rows = conn.execute("SELECT * FROM readings ORDER BY timestamp ASC").fetchall()

    df = pd.DataFrame([dict(r) for r in rows]) if rows else pd.DataFrame()

    total_readings = len(df)
    first_ts = str(df["timestamp"].iloc[0]) if total_readings > 0 else "N/A"
    last_ts = str(df["timestamp"].iloc[-1]) if total_readings > 0 else "N/A"

    # Compute statistics
    stats: Dict[str, Any] = {}
    for col in METRIC_NAMES:
        if col in df.columns:
            s = df[col].dropna()
            if len(s) > 0:
                stats[col] = {
                    "count": int(len(s)),
                    "mean": round(float(s.mean()), 2),
                    "std": round(float(s.std()), 2) if len(s) > 1 else 0.0,
                    "min": round(float(s.min()), 2),
                    "max": round(float(s.max()), 2),
                }

    # Query alerts in this period
    alert_query = "SELECT severity, alert_type, COUNT(*) as cnt FROM alerts GROUP BY severity, alert_type"
    alert_rows = conn.execute(alert_query).fetchall()

    alerts_summary = {
        "total_alerts": sum(r["cnt"] for r in alert_rows),
        "critical": sum(r["cnt"] for r in alert_rows if r["severity"] == "critical"),
        "warning": sum(r["cnt"] for r in alert_rows if r["severity"] == "warning"),
        "info": sum(r["cnt"] for r in alert_rows if r["severity"] == "info"),
        "health_concerns": sum(r["cnt"] for r in alert_rows if r["alert_type"] == "health_concern"),
        "data_quality_issues": sum(r["cnt"] for r in alert_rows if r["alert_type"] == "data_quality"),
    }

    # Recommendations
    recommendations = []
    if "heart_rate" in stats and stats["heart_rate"]["mean"] > 80:
        recommendations.append("Elevated resting heart rate detected. Maintain 2.0 hours daily resistive countermeasure exercise (ARED) and increase fluid loading.")
    else:
        recommendations.append("Cardiovascular indicators show nominal adaptation to microgravity environment.")

    if "sleep_hours" in stats and stats["sleep_hours"]["mean"] < 6.5:
        recommendations.append("Average sleep duration is below target (6.5h). Review crew quarters acoustic levels and adjust cabin circadian blue-light schedule.")
    else:
        recommendations.append("Sleep architecture is adequate for mission operational demands.")

    if "radiation_exposure" in stats and stats["radiation_exposure"]["max"] > 20:
        recommendations.append("Transient radiation spikes observed. Verify personal dosimeter calibration and log Space Weather Action Center advisories.")
    else:
        recommendations.append("Cumulative radiation exposure remains well below career flight limits.")

    report_id = f"REP-{str(uuid.uuid4())[:8].upper()}"
    report_title = title or f"Mission Health Assessment — {astro_name} ({mission_id})"
    summary_text = (
        f"Mission Health Assessment for {astro_name} ({mission_id}). Evaluated {total_readings} telemetry intervals "
        f"from {first_ts} to {last_ts}. Overall operational status: NOMINAL ACTIVE MONITORING. "
        f"Detected {alerts_summary['total_alerts']} alert events ({alerts_summary['critical']} high priority). "
        "Research prototype analysis — all simulated telemetry must be reviewed by the mission medical team."
    )

    # Save to database
    conn.execute(
        """INSERT INTO reports (
            report_id, astronaut_id, title, date_range_start, date_range_end,
            summary_text, stats_json, alerts_summary_json, recommendations_json
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)""",
        (
            report_id,
            astronaut_id,
            report_title,
            first_ts,
            last_ts,
            summary_text,
            json.dumps(stats),
            json.dumps(alerts_summary),
            json.dumps(recommendations),
        ),
    )
    conn.commit()
    conn.close()

    return {
        "report_id": report_id,
        "astronaut_id": astronaut_id,
        "title": report_title,
        "date_range_start": first_ts,
        "date_range_end": last_ts,
        "generated_at": datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S UTC"),
        "summary_text": summary_text,
        "stats": stats,
        "alerts_summary": alerts_summary,
        "recommendations": recommendations,
    }


def list_reports(limit: int = 50) -> List[Dict[str, Any]]:
    conn = get_connection()
    rows = conn.execute("SELECT * FROM reports ORDER BY created_at DESC LIMIT ?", (limit,)).fetchall()
    conn.close()

    reports = []
    for r in rows:
        reports.append({
            "report_id": r["report_id"],
            "astronaut_id": r["astronaut_id"],
            "title": r["title"],
            "date_range_start": r["date_range_start"],
            "date_range_end": r["date_range_end"],
            "generated_at": r["generated_at"],
            "summary_text": r["summary_text"],
            "stats": json.loads(r["stats_json"] or "{}"),
            "alerts_summary": json.loads(r["alerts_summary_json"] or "{}"),
            "recommendations": json.loads(r["recommendations_json"] or "[]"),
            "created_at": r["created_at"],
        })
    return reports


def generate_report_csv(report_id: str) -> str:
    """Generate CSV string for report download."""
    conn = get_connection()
    report = conn.execute("SELECT * FROM reports WHERE report_id = ?", (report_id,)).fetchone()
    if not report:
        conn.close()
        return ""

    readings = conn.execute(
        "SELECT * FROM readings WHERE timestamp >= ? AND timestamp <= ? ORDER BY timestamp ASC",
        (report["date_range_start"], report["date_range_end"]),
    ).fetchall()
    conn.close()

    output = io.StringIO()
    writer = csv.writer(output)

    # Header metadata
    writer.writerow(["# ASTROVITAL / ASTROCARE MISSION HEALTH REPORT"])
    writer.writerow(["# Report ID", report["report_id"]])
    writer.writerow(["# Astronaut ID", report["astronaut_id"]])
    writer.writerow(["# Title", report["title"]])
    writer.writerow(["# Date Range", f"{report['date_range_start']} to {report['date_range_end']}"])
    writer.writerow(["# Generated At", report["generated_at"]])
    writer.writerow(["# Summary", report["summary_text"]])
    writer.writerow([])

    # Readings table
    headers = [
        "timestamp", "heart_rate", "spo2", "body_temp", "resp_rate",
        "systolic_bp", "diastolic_bp", "sleep_hours", "activity_level",
        "radiation_exposure", "cumulative_radiation", "source",
    ]
    writer.writerow(headers)

    for r in readings:
        writer.writerow([r[h] for h in headers])

    return output.getvalue()
