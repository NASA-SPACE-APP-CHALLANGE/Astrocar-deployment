-- AstroCare Initial Crew Seed Data
-- 4 International Crew Members: Artemis Expedition VII

INSERT OR IGNORE INTO astronauts (
    astronaut_id, name, role, mission_id, current_mission_day, mission_duration_days,
    age, gender, nationality, blood_type, current_cumulative_radiation_msv,
    career_limit_radiation_msv, baseline_heart_rate, baseline_spo2, baseline_body_temp,
    baseline_systolic_bp, baseline_diastolic_bp, baseline_sleep_hours, baseline_activity_mets
) VALUES
(
    'ASTRO-01', 'CDR Alex Vance', 'Mission Commander', 'ARTEMIS-VII', 142, 180,
    42, 'Male', 'NASA / United States', 'A+', 42.6,
    600.0, 62.0, 98.2, 36.6,
    118.0, 76.0, 7.5, 3.8
),
(
    'ASTRO-02', 'Dr. Sarah Chen', 'Science Specialist & Medical Officer', 'ARTEMIS-VII', 120, 180,
    38, 'Female', 'CSA / Canada', 'O+', 31.4,
    550.0, 58.0, 98.6, 36.5,
    114.0, 72.0, 7.8, 3.5
),
(
    'ASTRO-03', 'Marcus Thorne', 'Flight Engineer & Robotics Lead', 'ARTEMIS-VII', 95, 180,
    45, 'Male', 'ESA / United Kingdom', 'B+', 48.2,
    600.0, 66.0, 97.9, 36.7,
    122.0, 80.0, 7.2, 4.1
),
(
    'ASTRO-04', 'Elena Rostova', 'Systems Specialist & ECLSS Lead', 'ARTEMIS-VII', 78, 180,
    35, 'Female', 'ESA / International Partner', 'AB+', 24.8,
    550.0, 64.0, 98.4, 36.6,
    116.0, 74.0, 7.4, 3.6
);

-- Seed Initial Baseline Telemetry Alerts
INSERT OR IGNORE INTO alerts (
    alert_id, timestamp, reading_id, astronaut_id, metric_name,
    metric_value, threshold_min, threshold_max, severity, message,
    acknowledged, review_status, triage_notes, alert_type, suggested_action
) VALUES
(
    'ALT-1001', datetime('now', '-1 hour'), NULL, 'ASTRO-01', 'heart_rate',
    108.5, 50, 100, 'warning', 'Tachycardia spike during high-exertion pre-EVA preparation',
    0, 'New', 'Monitor fluid hydration and autonomic stabilization', 'health_concern', 'Prescribe 15-min rest and oral fluid replenishment.'
),
(
    'ALT-1002', datetime('now', '-2 hours'), NULL, 'ASTRO-01', 'cabin_co2',
    4.8, 0, 4.0, 'warning', 'Elevated cabin ambient CO2 concentration detected near sleep quarters',
    1, 'Acknowledged', 'ECLSS lithium hydroxide scrubbed air loop 2 activated', 'data_concern', 'Check cabin airloop 2 IMV circulation fans.'
),
(
    'ALT-2001', datetime('now', '-3 hours'), NULL, 'ASTRO-02', 'systolic_bp',
    138.0, 90, 135, 'warning', 'Transient post-EVA orthostatic elevation following 6-hour spacewalk suit egress',
    0, 'New', 'Prescribe fluid-loading salt tablets and 30-min horizontal rest', 'health_concern', 'Fluid load with salt tablets and 500 mL water.'
),
(
    'ALT-3001', datetime('now', '-30 minutes'), NULL, 'ASTRO-03', 'heart_rate',
    116.0, 50, 100, 'critical', 'Sustained cardiovascular rate excursion during high-torque robotic arm maintenance',
    0, 'New', 'Immediate workload reduction instructed; vagal breathing initiated', 'health_concern', 'Initiate 4-4-4-4 autonomic box breathing protocol.'
),
(
    'ALT-4001', datetime('now', '-4 hours'), NULL, 'ASTRO-04', 'sleep_hours',
    5.2, 6.5, 9.0, 'warning', 'Circadian rhythm phase delay; total restorative rest below 6.0h threshold',
    0, 'New', 'Circadian blue-light spectrum scheduling shifted forward 45 minutes', 'health_concern', 'Enforce 45-min pre-sleep blue-depleted lighting.'
);
