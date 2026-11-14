"""Generate a reproducible simulated astronaut telemetry dataset with full indicator coverage."""
import json
import math
import numpy as np
import pandas as pd
from pathlib import Path

SEED = 42
N_RECORDS = 500
START_DATE = "2025-01-01 00:00:00"

def generate_dataset(seed: int = SEED, n: int = N_RECORDS, astronaut_id: str = "ASTRO-01") -> pd.DataFrame:
    rng = np.random.default_rng(seed)
    timestamps = pd.date_range(start=START_DATE, periods=n, freq="30min")
    
    records = []
    cum_radiation = 40.0  # initial baseline cumulative mSv for mission day 140
    
    for i, ts in enumerate(timestamps):
        hour = ts.hour + ts.minute / 60.0
        
        # Circadian cycle: nadir during sleep (02:00-05:00), peak during daytime
        # In microgravity, sleep is slightly disrupted and resting HR is slightly elevated
        circadian_hr = -6.0 * math.cos(2 * math.pi * (hour - 3) / 24.0)
        circadian_temp = -0.35 * math.cos(2 * math.pi * (hour - 4) / 24.0)
        circadian_bp = -4.0 * math.cos(2 * math.pi * (hour - 3) / 24.0)
        
        # Exercise window: astronauts on ISS/Artemis do 2 hours daily workout (e.g., 14:00 - 16:00)
        is_exercise = 14.0 <= hour <= 15.5
        exercise_hr_boost = rng.uniform(45, 65) if is_exercise else 0.0
        exercise_activity = rng.uniform(6.5, 8.5) if is_exercise else (0.9 if 23 <= hour or hour <= 6 else rng.uniform(1.8, 3.2))
        
        # Base values
        hr = 64.0 + circadian_hr + exercise_hr_boost + rng.normal(0, 2.5)
        spo2 = 98.2 - (0.4 if is_exercise else 0.0) + rng.normal(0, 0.4)
        temp = 36.6 + circadian_temp + (0.5 if is_exercise else 0.0) + rng.normal(0, 0.12)
        resp = 14.0 + (8.0 if is_exercise else 0.0) + rng.normal(0, 1.0)
        sys_bp = 116.0 + circadian_bp + (18.0 if is_exercise else 0.0) + rng.normal(0, 3.0)
        dia_bp = 75.0 + (circadian_bp * 0.6) + (6.0 if is_exercise else 0.0) + rng.normal(0, 2.0)
        
        # Sleep duration logged around 07:00 each morning (representing the night's sleep)
        # Normal average ~ 7.2h, with occasional disrupted nights in microgravity
        sleep_dur = None
        if ts.hour == 7 and ts.minute == 0:
            sleep_dur = round(rng.normal(7.2, 0.8), 1)
            sleep_dur = max(4.0, min(9.5, sleep_dur))
        
        # Radiation exposure: space environment background ~ 1.5 - 2.5 μSv/h
        # 1 mSv = 1000 μSv. In 30 min, dose in μSv = dose_rate_uSv_h * 0.5
        rad_dose_rate = 1.8 + rng.normal(0, 0.25)  # μSv/h
        cum_radiation += (rad_dose_rate * 0.5) / 1000.0  # accumulate in mSv
        
        # Value statuses map (default: all simulated)
        statuses = {
            "heart_rate": "simulated",
            "spo2": "simulated",
            "body_temp": "simulated",
            "resp_rate": "simulated",
            "blood_pressure": "simulated",
            "sleep": "simulated" if sleep_dur is not None else "unavailable",
            "activity": "simulated",
            "radiation": "simulated",
        }
        
        records.append({
            "timestamp": ts.strftime("%Y-%m-%d %H:%M:%S"),
            "heart_rate": round(float(hr), 1),
            "spo2": round(float(spo2), 1),
            "body_temp": round(float(temp), 2),
            "resp_rate": round(float(resp), 1),
            "systolic_bp": round(float(sys_bp), 1),
            "diastolic_bp": round(float(dia_bp), 1),
            "sleep_hours": sleep_dur,
            "activity_level": round(float(exercise_activity), 1),
            "radiation_exposure": round(float(rad_dose_rate), 2),
            "cumulative_radiation": round(float(cum_radiation), 3),
            "value_statuses": json.dumps(statuses),
            "source": "simulated",
            "astronaut_id": astronaut_id,
        })
        
    df = pd.DataFrame(records)
    
    # Inject deliberate synthetic anomalies (~5%) for demonstration
    anomaly_indices = rng.choice(len(df), size=int(len(df) * 0.05), replace=False)
    for idx in anomaly_indices:
        choice = rng.integers(0, 6)
        statuses = json.loads(df.at[idx, "value_statuses"])
        
        if choice == 0:
            # Tachycardia episode during rest
            df.at[idx, "heart_rate"] = round(float(rng.uniform(130, 155)), 1)
        elif choice == 1:
            # SpO2 hypoxia desaturation
            df.at[idx, "spo2"] = round(float(rng.uniform(86.0, 91.0)), 1)
        elif choice == 2:
            # Body temp elevation (space fever / inflammation)
            df.at[idx, "body_temp"] = round(float(rng.uniform(38.2, 39.1)), 2)
        elif choice == 3:
            # Hypertensive reading
            df.at[idx, "systolic_bp"] = round(float(rng.uniform(155, 175)), 1)
            df.at[idx, "diastolic_bp"] = round(float(rng.uniform(98, 112)), 1)
        elif choice == 4:
            # Sensor dropout (unavailable sensor reading)
            df.at[idx, "spo2"] = None
            statuses["spo2"] = "unavailable"
        elif choice == 5:
            # Solar particle radiation spike
            df.at[idx, "radiation_exposure"] = round(float(rng.uniform(35.0, 65.0)), 2)
            
        df.at[idx, "value_statuses"] = json.dumps(statuses)
        
    return df


def save_dataset(path: Path, seed: int = SEED):
    path.parent.mkdir(parents=True, exist_ok=True)
    df = generate_dataset(seed=seed)
    df.to_csv(path, index=False)
    return df


if __name__ == "__main__":
    out = Path(__file__).resolve().parents[3] / "datasets" / "simulated_telemetry.csv"
    df = save_dataset(out)
    print(f"Generated {len(df)} simulated astronaut telemetry records to {out}")
