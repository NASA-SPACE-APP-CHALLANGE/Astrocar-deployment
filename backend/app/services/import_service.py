"""CSV import processing service."""
import io
import uuid
import pandas as pd
from datetime import datetime, timezone
from app.core.database import get_connection

SUPPORTED_COLUMNS = {
    "timestamp", "heart_rate", "spo2", "body_temp",
    "resp_rate", "systolic_bp", "diastolic_bp",
    "source", "astronaut_id",
}

REQUIRED_COLUMNS = {"timestamp"}

NUMERIC_RANGES = {
    "heart_rate":   (10, 300),
    "spo2":         (50, 100),
    "body_temp":    (30.0, 45.0),
    "resp_rate":    (1, 60),
    "systolic_bp":  (50, 250),
    "diastolic_bp": (20, 150),
}


def process_csv_upload(stream: io.StringIO, filename: str) -> dict:
    event_id = str(uuid.uuid4())[:12]
    issues = []
    accepted = 0
    rejected = 0
    flagged = 0

    try:
        df = pd.read_csv(stream)
    except Exception as e:
        return {
            "event_id": event_id,
            "filename": filename,
            "records_accepted": 0,
            "records_rejected": 0,
            "records_flagged": 0,
            "issues": [f"Failed to parse CSV: {str(e)}"],
            "source": "import",
        }

    if "timestamp" not in df.columns:
        return {
            "event_id": event_id,
            "filename": filename,
            "records_accepted": 0,
            "records_rejected": 0,
            "records_flagged": 0,
            "issues": ["CSV is missing required 'timestamp' column."],
            "source": "import",
        }

    # Check for duplicates
    dupes = df.duplicated(subset=["timestamp"]).sum()
    if dupes > 0:
        df = df.drop_duplicates(subset=["timestamp"])
        issues.append(f"Removed {dupes} duplicate timestamp(s).")

    conn = get_connection()
    for _, row in df.iterrows():
        try:
            ts = str(row.get("timestamp", "")).strip()
            if not ts or ts.lower() == "nan":
                rejected += 1
                issues.append(f"Skipped row with empty timestamp.")
                continue

            # Parse timestamp
            try:
                pd.Timestamp(ts)
            except Exception:
                rejected += 1
                issues.append(f"Invalid timestamp: {ts[:30]}")
                continue

            row_flagged = False
            values = {}
            for col in ["heart_rate", "spo2", "body_temp", "resp_rate", "systolic_bp", "diastolic_bp"]:
                raw = row.get(col)
                if pd.isna(raw) or raw == "" or raw is None:
                    values[col] = None
                    continue
                try:
                    v = float(raw)
                    lo, hi = NUMERIC_RANGES.get(col, (None, None))
                    if lo is not None and (v < lo or v > hi):
                        row_flagged = True
                        issues.append(f"Value out of range: {col}={v} at {ts[:16]}")
                    values[col] = v
                except (ValueError, TypeError):
                    values[col] = None

            source = str(row.get("source", "import"))
            astronaut_id = str(row.get("astronaut_id", "A-01"))

            conn.execute(
                """INSERT INTO readings 
                   (timestamp, heart_rate, spo2, body_temp, resp_rate, systolic_bp, diastolic_bp, source, astronaut_id)
                   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)""",
                (ts, values.get("heart_rate"), values.get("spo2"), values.get("body_temp"),
                 values.get("resp_rate"), values.get("systolic_bp"), values.get("diastolic_bp"),
                 source, astronaut_id),
            )

            if row_flagged:
                flagged += 1
            else:
                accepted += 1

        except Exception as e:
            rejected += 1
            issues.append(f"Row error: {str(e)[:80]}")

    conn.commit()

    # Log import event
    conn.execute(
        """INSERT INTO import_events (event_id, filename, records_accepted, records_rejected, records_flagged, source)
           VALUES (?, ?, ?, ?, ?, ?)""",
        (event_id, filename, accepted, rejected, flagged, "import"),
    )
    conn.commit()
    conn.close()

    return {
        "event_id": event_id,
        "filename": filename,
        "records_accepted": accepted,
        "records_rejected": rejected,
        "records_flagged": flagged,
        "issues": issues[:20],  # cap issue list
        "source": "import",
    }
