# 10 — Telemetry Data Dictionary & Parameter Registry

---

## 1. Physiological Telemetry Parameters

| Parameter Key | Variable Label | Unit | Nominal Operational Range | Clinical Hazard Mappings | Measurement Sensor Type |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `heart_rate` | Heart Rate | bpm | 50 – 100 bpm (resting: 55 – 70) | Cardiovascular deconditioning, acute hypoxia, physical strain | 3-Lead Chest Bio-impedance / Optical PPG |
| `spo2` | Pulse Oximetry Oxygen Saturation | % | 94.0 – 100.0% (Warning: <94%, Critical: <92%) | Acute hypoxic hypoxia, closed-cabin atmosphere failure | Dual-wavelength arterial pulse oximeter |
| `body_temp` | Core Body Temperature | °C | 36.1 – 37.5 °C (Spaceflight elevation ~1.0°C) | Hypothermia, hyperthermia, circadian thermal drift | In-ear infrared tympanic / non-invasive temporal scanner |
| `resp_rate` | Respiration Rate | br/min | 12.0 – 20.0 br/min | Hypercapnic tachypnea, exertion, metabolic acidosis | Thoracic impedance plethysmography band |
| `systolic_bp` | Systolic Blood Pressure | mmHg | 90.0 – 140.0 mmHg | Cephalad fluid shift, hypertension, orthostatic intolerance | Automated oscillometric arm cuff |
| `diastolic_bp`| Diastolic Blood Pressure | mmHg | 60.0 – 90.0 mmHg | Vascular resistance changes, microgravity remodeling | Automated oscillometric arm cuff |
| `sleep_hours` | Restorative Sleep Duration | hrs/sol | 6.5 – 8.5 hrs (Warning: <6.0, Critical: <5.0) | Circadian rhythm disruption, neurocognitive fatigue | Multi-axial wrist actigraphy + polysomnography |
| `activity_level`| Physical Activity & Exercise | METs | 1.0 – 8.5 METs (Exercise target: >6.0 METs) | Muscle atrophy, bone mineral resorption, lack of exercise | Triaxial accelerometry + ergometer power meter |
| `radiation_exposure`| Ambient Ionizing Radiation Rate | mSv/day | 0.20 – 0.50 mSv/day (LEO: ~0.4, Deep space: 1.0+) | Galactic cosmic ray exposure, solar particle events | Active silicon semiconductor dosimeter |
| `cumulative_dose` | Mission Cumulative Dose | mSv | NASA Career Limit: 600 mSv (Age/sex dependent) | Long-term carcinogenesis, tissue degeneration | Bio-dosimetry + physical dosimeter integrator |

---

## 2. Spacecraft Habitat Environmental Parameters

| Environmental Key | Variable Label | Unit | Nominal Operational Range | Spacecraft Hazard Significance | Measurement Sensor Type |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `cabin_o2` | Cabin Oxygen Concentration | vol % | 20.5 – 21.5% (Terrestrial: 20.95%) | Hypoxia (<19.5%), fire hazard (>24.0%) | Electrochemical paramagnetic O2 sensor |
| `cabin_co2` | Cabin Carbon Dioxide Pressure | mmHg | $< 2.0$ mmHg (Warning: >3.0, Critical: >5.0) | Hypercapnia, headaches, cognitive slowing, SANS worsening | Nondispersive infrared (NDIR) CO2 sensor |
| `cabin_pressure` | Total Atmospheric Pressure | kPa | $100.0 – 102.5$ kPa (Nominal: 101.3 kPa / 1 atm) | Depressurization, ebullism, barotrauma | Piezo-resistive diaphragm pressure transducer |
| `cabin_temp` | Habitat Air Temperature | °C | 18.0 – 24.0 °C (Crew selectable) | Thermal regulation, sweat condensation | Calibrated platinum resistance thermometer (RTD) |
| `cabin_humidity` | Relative Humidity | % | 30.0 – 60.0% | Microbial growth (>70%), static discharge (<25%) | Capacitive thin-film humidity sensor |
| `orbital_regime` | Orbital Flight Regime | text | LEO (400 km), Lunar Transit, Mars Cruise | Radiation shielding and latency calculations | Flight computer ephemeris state vector |

---

## 3. Data Integrity & Validation Rules

- **Timestamp Format:** Strict ISO 8601 (`YYYY-MM-DDTHH:MM:SSZ` or UTC SQLite string).
- **Out-of-Bounds Rejection Limits:**
  - Heart Rate: $< 20$ or $> 240$ bpm (Sensor artifact flag).
  - SpO2: $< 50$ or $> 100\%$ (Sensor detachment flag).
  - Core Temp: $< 30$ or $> 43$ °C (Probe disconnection flag).
- **Missing Telemetry Rule:** Marked as `null` with status `[UNAVAILABLE]`; never filled with fabricated zero values.

