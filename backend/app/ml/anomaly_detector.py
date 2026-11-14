"""Anomaly detection engine using Isolation Forest and Rule-Based Explainability."""
import uuid
import numpy as np
import pandas as pd
from typing import List, Dict, Any, Optional
from sklearn.ensemble import IsolationForest
from sklearn.preprocessing import StandardScaler

FEATURE_COLS = [
    "heart_rate",
    "spo2",
    "body_temp",
    "resp_rate",
    "systolic_bp",
    "diastolic_bp",
    "activity_level",
    "radiation_exposure",
]

UNITS = {
    "heart_rate": "bpm",
    "spo2": "%",
    "body_temp": "°C",
    "resp_rate": "breaths/min",
    "systolic_bp": "mmHg",
    "diastolic_bp": "mmHg",
    "activity_level": "METs",
    "radiation_exposure": "μSv/h",
    "sleep_hours": "hrs",
}

NORMAL_RANGES = {
    "heart_rate": (50, 100),
    "spo2": (94, 100),
    "body_temp": (36.1, 37.5),
    "resp_rate": (12, 20),
    "systolic_bp": (90, 140),
    "diastolic_bp": (60, 90),
    "activity_level": (0.8, 8.5),
    "radiation_exposure": (0.5, 5.0),
    "sleep_hours": (6.0, 9.0),
}

REASON_TEMPLATES = {
    "heart_rate": "Heart rate ({val} bpm) deviates from standard range [{low}–{high} bpm] — flagged by Isolation Forest.",
    "spo2": "SpO₂ ({val}%) is below nominal threshold [{low}–{high}%] — potential hypoxia or sensor displacement.",
    "body_temp": "Core body temperature ({val}°C) deviates from expected range [{low}–{high}°C] — potential spaceflight-related thermoregulation shift.",
    "resp_rate": "Respiratory rate ({val} br/min) falls outside typical range [{low}–{high} br/min].",
    "systolic_bp": "Systolic BP ({val} mmHg) deviates from expected range [{low}–{high} mmHg].",
    "diastolic_bp": "Diastolic BP ({val} mmHg) deviates from expected range [{low}–{high} mmHg].",
    "activity_level": "Activity level ({val} METs) is unusually high or low for current mission schedule.",
    "radiation_exposure": "Radiation dose rate ({val} μSv/h) exceeds typical space environment background [{low}–{high} μSv/h] — possible solar energetic particle event.",
    "sleep_hours": "Sleep duration ({val} hrs) deviates from restorative minimum [{low}–{high} hrs].",
}


def _build_reason(metric: str, value: float) -> str:
    tmpl = REASON_TEMPLATES.get(metric, "Value {val} flagged as unusual by anomaly model.")
    lo, hi = NORMAL_RANGES.get(metric, (None, None))
    return tmpl.format(val=round(value, 2), low=lo, high=hi)


def _detect_primary_metric(row: pd.Series, available_cols: List[str]) -> Optional[str]:
    """Find which metric deviates most from normal baseline for a flagged observation."""
    max_deviation = -1
    primary = None
    for col in available_cols:
        if col not in NORMAL_RANGES:
            continue
        val = row.get(col)
        if val is None or pd.isna(val):
            continue
        lo, hi = NORMAL_RANGES[col]
        mid = (lo + hi) / 2
        span = (hi - lo) / 2
        deviation = abs(val - mid) / span if span > 0 else 0
        if deviation > max_deviation:
            max_deviation = deviation
            primary = col
    return primary


def run_isolation_forest(
    df: pd.DataFrame,
    contamination: float = 0.05,
    random_seed: int = 42,
) -> Dict[str, Any]:
    """
    Run Isolation Forest anomaly detection on physiological readings.
    Returns a dict with detection results and explainable feature attribution.
    NOTE: Research prototype for demonstration. Results are not medically certified.
    """
    run_id = str(uuid.uuid4())[:8]

    # Select available feature columns with at least some non-null data
    available = [c for c in FEATURE_COLS if c in df.columns and df[c].notna().sum() > 0]

    if len(available) < 1:
        return {
            "run_id": run_id,
            "method": "IsolationForest",
            "model_status": "insufficient_features",
            "message": "No supported feature columns found in the dataset.",
            "records_analyzed": 0,
            "anomalies_found": 0,
            "anomaly_rate": 0.0,
            "anomalies": [],
        }

    # Extract feature matrix and drop rows with all NaNs
    X_raw = df[available].copy()
    mask_valid = X_raw.notna().any(axis=1)

    # Impute missing values with column median or reference midpoint
    fill_values = {}
    for col in available:
        med = X_raw[col].median()
        if pd.isna(med):
            lo, hi = NORMAL_RANGES.get(col, (0, 1))
            med = (lo + hi) / 2.0
        fill_values[col] = float(med)

    X_valid = X_raw[mask_valid].fillna(value=fill_values).astype(float)

    n_valid = len(X_valid)

    if n_valid < 10:
        return {
            "run_id": run_id,
            "method": "StatisticalBaseline",
            "model_status": "dataset_too_small",
            "message": f"Only {n_valid} valid records found. Using rule-based threshold fallback.",
            "records_analyzed": n_valid,
            "anomalies_found": 0,
            "anomaly_rate": 0.0,
            "anomalies": _zscore_fallback(df, available, run_id),
        }

    # Standardize features
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X_valid)

    # Fit Isolation Forest
    contamination_clamped = max(0.01, min(0.20, float(contamination)))
    clf = IsolationForest(
        contamination=contamination_clamped,
        random_state=random_seed,
        n_estimators=100,
    )
    clf.fit(X_scaled)

    preds = clf.predict(X_scaled)             # 1 = normal, -1 = anomaly
    scores = clf.decision_function(X_scaled)  # higher = normal, lower (< 0) = anomalous

    # Build results for all rows
    valid_indices = df.index[mask_valid]
    anomaly_results = []

    for i, orig_idx in enumerate(valid_indices):
        is_anom = bool(preds[i] == -1)
        score = float(scores[i])
        row = df.loc[orig_idx]

        metric = _detect_primary_metric(row, available) if is_anom else None
        value = float(row[metric]) if metric and not pd.isna(row.get(metric)) else None
        reason = _build_reason(metric, value) if metric and value is not None else None

        anomaly_results.append({
            "row_index": int(orig_idx),
            "reading_id": int(row.get("id", 0)) if "id" in row.index else None,
            "timestamp": str(row.get("timestamp", "")),
            "metric": metric,
            "value": value,
            "unit": UNITS.get(metric) if metric else None,
            "anomaly_score": round(score, 4),
            "is_anomaly": is_anom,
            "method": "IsolationForest",
            "reason": reason,
            "run_id": run_id,
        })

    anomalies_found = sum(1 for r in anomaly_results if r["is_anomaly"])
    anomaly_rate = anomalies_found / n_valid if n_valid > 0 else 0.0

    return {
        "run_id": run_id,
        "method": "IsolationForest",
        "model_status": "success",
        "message": f"Analyzed {n_valid} records. Detected {anomalies_found} unusual observations ({anomaly_rate:.1%} anomaly rate). Prototype research system — not certified medical diagnosis.",
        "records_analyzed": n_valid,
        "anomalies_found": anomalies_found,
        "anomaly_rate": round(anomaly_rate, 4),
        "anomalies": anomaly_results,
    }


def _zscore_fallback(df: pd.DataFrame, available: List[str], run_id: str) -> List[Dict]:
    """Rule-based fallback for small datasets."""
    results = []
    for _, row in df.iterrows():
        is_anom = False
        primary_col = None
        for col in available:
            val = row.get(col)
            if val is None or pd.isna(val):
                continue
            lo, hi = NORMAL_RANGES.get(col, (None, None))
            if lo is not None and (val < lo or val > hi):
                is_anom = True
                primary_col = col
                break

        val = float(row[primary_col]) if primary_col and not pd.isna(row.get(primary_col)) else None
        results.append({
            "row_index": int(row.name),
            "reading_id": int(row.get("id", 0)) if "id" in row.index else None,
            "timestamp": str(row.get("timestamp", "")),
            "metric": primary_col,
            "value": val,
            "unit": UNITS.get(primary_col) if primary_col else None,
            "anomaly_score": -1.0 if is_anom else 0.5,
            "is_anomaly": is_anom,
            "method": "RuleBasedFallback",
            "reason": _build_reason(primary_col, val) if primary_col and val is not None else None,
            "run_id": run_id,
        })
    return results
