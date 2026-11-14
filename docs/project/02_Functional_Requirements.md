# 02 — Functional Requirements Specification

---

## 1. Functional Requirements Matrix (FR-01 to FR-15)

The following formal functional requirements define the operational behavior of the AstroCare system.

### FR-01: Physiological Telemetry Ingestion & Display
- **FR-01.1:** The system shall ingest, parse, and display 7 core physiological metrics: Heart Rate (bpm), Arterial Oxygen Saturation (SpO2, %), Core Body Temperature (°C), Respiration Rate (br/min), Systolic Blood Pressure (mmHg), Diastolic Blood Pressure (mmHg), and Daily Radiation Dose (mSv/day).
- **FR-01.2:** Every displayed metric shall include its numerical reading, engineering unit, timestamp, nominal reference range, and a data provenance tag (`[MEASURED]` or `[SIMULATED]`).
- **FR-01.3:** Each metric shall render a dynamic sparkline displaying the trailing 10 observation trend.

### FR-02: Spacecraft Habitat Environmental Monitoring
- **FR-02.1:** The system shall monitor and display cabin oxygen concentration (vol %), cabin partial pressure of CO2 (PCO2, mmHg), total cabin atmospheric pressure (kPa), and current orbital trajectory regime.
- **FR-02.2:** Environmental metrics shall be displayed in an Orbital Glass status strip across the primary live monitoring console.

### FR-03: Astronaut Profile & Pre-Flight Baseline Management
- **FR-03.1:** The system shall maintain individualized profiles for all assigned mission astronauts, including full name, role, astronaut ID, avatar, and pre-flight resting baselines.
- **FR-03.2:** The system shall provide an interactive baseline editor allowing authorized medical officers to modify resting parameters and career radiation limits.
- **FR-03.3:** The active astronaut switcher shall dynamically filter telemetry, health analytics, and reports across all application views.

### FR-04: Unsupervised AI Anomaly Detection
- **FR-04.1:** The system shall provide an unsupervised Isolation Forest machine learning engine capable of analyzing multivariate telemetry vectors across at least 500 historical observations.
- **FR-04.2:** The system shall allow operators to configure the anomaly contamination sensitivity factor across at least four presets: 2% (Strict), 5% (Standard), 10% (High), and 15% (Ultra).
- **FR-04.3:** The system shall output continuous decision function anomaly scores, flagging observations where the score indicates statistical divergence (< 0).
- **FR-04.4:** The system shall generate natural-language feature attribution explanations identifying the deviating biometric parameter for each flagged anomaly.

### FR-05: Multi-Parameter Risk Assessment Engine
- **FR-05.1:** The system shall correlate concurrent multi-sensor anomalies into structured clinical spaceflight risk evaluations mapping to all five NASA Spaceflight Hazards.
- **FR-05.2:** Each risk assessment shall display: Risk Category, Risk Title, Description, Correlated Parameters (with values and nominal bounds), Detected Abnormalities, Severity Classification, Biomedical Evidence, Countermeasure Protocols, and Official Scientific Citations.
- **FR-05.3:** Operators shall be capable of updating the clinical review status of any identified risk across four states: `Pending Triage`, `Flight Surgeon Reviewed`, `Countermeasure Deployed`, and `Mitigated`.

### FR-06: Three-Tier Countermeasure Recommendation Engine
- **FR-06.1:** Every identified hazard and multi-parameter risk shall present a structured three-tier response protocol:
  1. *Immediate Response:* Point-of-care actions executable immediately by the astronaut or Crew Medical Officer.
  2. *Preventive Protocol:* Mid-to-long-term countermeasure adjustments (e.g. ARED resistance load calibration, circadian lighting shifting).
  3. *Flight Surgeon Escalation:* Specialized clinical diagnostic steps for ground medical controllers.

### FR-07: Operational Alert Management & Triage
- **FR-07.1:** The system shall automatically generate alerts when critical physiological or environmental boundaries are breached.
- **FR-07.2:** Alerts shall be classified into three severity levels: `Critical`, `Warning`, and `Info`, and two categories: `Health Concern` and `Data Quality`.
- **FR-07.3:** The system shall provide a search bar and multi-criteria filters for severity, alert type, and review status.
- **FR-07.4:** The system shall provide a triage modal allowing clinicians to record reviewer notes and update review statuses (`Reviewed`, `Dismissed`, `Escalated`).
- **FR-07.5:** The system shall support 1-click Quick Acknowledgment, marking the alert acknowledged and recording the timestamp.

### FR-08: Longitudinal Biometric Trend Analytics
- **FR-08.1:** The system shall plot time-series trend lines for all physiological parameters across selectable horizons: `24h`, `7d`, `30d`, and `all`.
- **FR-08.2:** Trend visualizers shall render personal baseline reference lines and standard deviation boundaries.
- **FR-08.3:** The system shall compute and display real-time summary statistics: Sample Count, Mean, Minimum, Maximum, and Standard Deviation.

### FR-09: Mission Health Evaluation Reporting
- **FR-09.1:** The system shall generate formal mission health reports incorporating date range parameters, astronaut identity, medical narrative summaries, parameter statistics tables, and alert totals.
- **FR-09.2:** The system shall provide a print-ready document view and trigger browser-native print/PDF export formatting.

### FR-10: Telemetry Data Simulator Studio
- **FR-10.1:** The system shall provide an interactive simulation studio with six inject-able clinical scenarios: `Circadian Normal`, `Tachycardia`, `Hypoxia`, `Hypothermia`, `Extreme Radiation`, and `Hypertension`.
- **FR-10.2:** The system shall provide an auto-streaming mode generating telemetry packets every 3 seconds for live demonstrations.
- **FR-10.3:** The system shall provide a database reset control to re-baseline the simulated telemetry database to 500 clean records.

### FR-11: Telemetry Archive & CSV Export
- **FR-11.1:** The system shall maintain a tabular archive of historical sensor readings supporting search and pagination.
- **FR-11.2:** The system shall provide dual-metric comparative charting and 1-click CSV data download.

### FR-12: Data Import Studio
- **FR-12.1:** The system shall support drag-and-drop CSV file uploads up to 10 MB.
- **FR-12.2:** The system shall validate CSV headers for mandatory `timestamp` columns and output an import summary report detailing accepted, rejected, and flagged records.

### FR-13: NASA & CSA Research Knowledge Base
- **FR-13.1:** The system shall provide an integrated research hub documenting the 5 Hazards of Spaceflight, 8 Human Health Risks, active HRP studies, and CSA radiation and microgravity experiments.
- **FR-13.2:** Direct official hyperlinks to NASA and CSA publications shall be embedded for external verification.

### FR-14: Platform Settings Configuration
- **FR-14.1:** The system shall allow users to configure anomaly contamination rates, auto-refresh polling intervals, table page size, and disclaimer visibility in browser local storage.

### FR-15: Unified Navigation & Layout System
- **FR-15.1:** All 15 modules shall share the identical top navigation bar (`Navbar.tsx`) with active link indicator highlighting.
- **FR-15.2:** All pages shall adhere to a 1400px maximum width container with matching vertical and horizontal padding.

