# 05 — System Features & Module Walkthrough

---

## 1. Overview of AstroCare's 15 Integrated Modules

AstroCare unites 15 fully functional mission modules under a single cohesive architecture. Every module is connected to live or calibrated simulated telemetry, features rich loading, empty, and error states, and adheres to the site-wide **Orbital Glass** design system.

```
┌────────────────────────────────────────────────────────────────────────┐
│                        ASTROCARE 16 MISSION MODULES                    │
├───────────────────────────────────┬────────────────────────────────────┤
│ 1. Mission Overview               │ 9. Telemetry Historical Archive    │
│ 2. Live Monitoring Console        │ 10. Data Import Studio             │
│ 3. Clinical Health Analytics      │ 11. Mission Timeline Tracker       │
│ 4. AI Anomaly Intelligence        │ 12. Dataset Information Registry   │
│ 5. Alert & Triage Center          │ 13. NASA & CSA Research Hub        │
│ 6. Astronaut Profile & Baselines  │ 14. Project Story & Architecture   │
│ 7. Mission Shift Reports          │ 15. System Platform Settings       │
│ 8. Physiological Data Simulator   │ 16. Cross-Platform Desktop Client  │
└───────────────────────────────────┴────────────────────────────────────┘
```

---

## 2. Module Specifications

### Module 1: Mission Overview (`/`)
- Public landing page highlighting mission goals, real-time platform capabilities, technological stack, and interactive telemetry previews.
- Quick navigation to live console and external NASA/CSA research references.

### Module 2: Live Monitoring Console (`/dashboard`)
- Real-time astronaut health telemetry dashboard updated every 20 seconds.
- Space Station Environmental Telemetry Strip (Cabin ATM, O2 %, PCO2, Pressure, Orbital LEO regime).
- Active crew member profile card with flight day counter, mission elapsed timer (`DD:HH:MM:SS`), and cumulative radiation dose.
- 7 vital physiological indicator cards (`MetricCard`) with dynamic sparklines, nominal ranges, and status badges (`[MEASURED]`, `[SIMULATED]`).
- Active telemetry alert preview with 1-click **Acknowledge** button.
- Simulator Quick Triggers: `+30 Min Step`, `+ Inject Tachycardia`, `+ Inject SpO2 Dip`.
- 1-click Mission Operations quick access grid.

### Module 3: Clinical Health Analytics (`/dashboard/analytics`)
- Multi-temporal trend analysis across `24h`, `7d`, `30d`, and `all` mission horizons.
- Interactive Recharts line visualizers with personal resting baseline reference lines and physiological standard deviation bands.
- Statistical metrics summary card: Sample Count, Mean, Minimum, Maximum, and Standard Deviation.
- Anomaly marker overlays identifying historical excursions on the trend curve.
- Parameter selection across all 7 physiological indicators.

### Module 4: AI Anomaly Intelligence & Risk Engine (`/ai-insights`)
- Unsupervised **Isolation Forest** anomaly detection engine with adjustable contamination slider (`2%`, `5%`, `10%`, `15%`).
- Mathematical scatter plot displaying decision function anomaly scores versus observation index.
- Natural language clinical summary cards translating statistical deviations into plain English.
- **Intelligent Multi-Parameter Risk Assessment Engine:** Real-time correlation across all 5 NASA Spaceflight Hazards.
- Three-tier countermeasure response protocols (Immediate Response, Preventive Protocol, Flight Surgeon Escalation).
- Official scientific citations linking directly to NASA and CSA reports.
- Interactive review status updater (`Pending Triage`, `Flight Surgeon Reviewed`, `Countermeasure Deployed`, `Mitigated`).
- Flagged observations log table with feature attribution and score progress bars.

### Module 5: Alert & Triage Center (`/dashboard/alerts`)
- Full-spectrum alert management: Severity classification (`Critical`, `Warning`, `Info`) and Alert Type (`Health Concern`, `Data Quality`).
- Search and filtering by severity, type, and review status (`Pending`, `Reviewed`, `Dismissed`, `Escalated`).
- Interactive Triage Modal allowing flight surgeons to inspect anomalies, record clinical review notes, and update statuses.
- 1-click Quick Acknowledge workflow with local and backend persistence.

### Module 6: Astronaut Profile & Baselines (`/dashboard/profile`)
- Individual crew member profile management (Commander Alex Vance, Dr. Sarah Chen, Marcus Torres).
- Interactive baseline editor allowing adjustment of pre-flight resting norms (Resting Heart Rate, SpO2, Core Temp, BP, Sleep Target, Career Radiation Limit).
- Career radiation accumulation gauge and mission assignment parameters.

### Module 7: Mission Shift Reports (`/dashboard/reports`)
- Automated clinical mission health evaluation generator.
- Date range picker and custom evaluation title input.
- Detailed medical narrative summary, full statistical breakdown across all 7 vitals, and alerts summary breakdown.
- Browser-native print and PDF export styling for flight surgeon shift handovers.

### Module 8: Physiological Data Simulator Studio (`/dashboard/simulator`)
- Controlled medical scenario injector:
  - `Circadian Normal` (+30 min circadian diurnal step)
  - `Tachycardia` (cardiovascular exertion spike)
  - `Hypoxia` (arterial oxygen desaturation < 92%)
  - `Hypothermia` (core temperature drop)
  - `Extreme Radiation` (solar particle event surge)
  - `Hypertension` (blood pressure excursion)
- Real-time auto-streaming mode delivering packets every 3 seconds for live demonstrations.
- Telemetry database reset control to restore clean 500-record baseline.

### Module 9: Telemetry Historical Archive (`/mission-data`)
- Complete tabular sensor readings with search, pagination, and multi-metric comparison.
- Dual-metric comparative line charting (e.g. Heart Rate vs. SpO2).
- Client-side CSV export generating instant downloadable sensor logs.

### Module 10: Data Import Studio (`/dashboard/import`)
- Drag-and-drop CSV telemetry file uploader.
- Pre-upload validation checking file size, CSV schema, and mandatory `timestamp` headers.
- Downloadable official AstroCare CSV telemetry template.
- Instant import summary report detailing accepted, rejected, and flagged records.

### Module 11: Mission Timeline Tracker (`/dashboard/timeline`)
- Chronological mission event stream plotting system initialization, seed dataset loading, anomaly detection runs, and alert triage milestones.
- Filterable milestone timeline providing operational situational awareness.

### Module 12: Dataset Information Registry (`/dashboard/dataset`)
- Full documentation of the AstroCare telemetry schema.
- Data dictionary describing variables, units, nominal ranges, and physiological modeling principles.
- Prominent **Simulated Demonstration Data** advisory badge adhering to NASA Space Apps Challenge ethical standards.

### Module 13: NASA & CSA Research Hub (`/research`)
- Curated scientific knowledge base featuring the 5 Hazards of Spaceflight, 8 Human Health Risks, HRP ongoing experiments, CSA radiation bio-dosimetry, and CSA microgravity science.
- Interactive hazard deep-dives, clinical impact explanations, and direct links to NASA and CSA publications.

### Module 14: Project Story & Architecture (`/about`)
- Comprehensive background on the AstroCare project origin, architecture diagram, methodology, and scientific mission objectives.

### Module 15: System Platform Settings (`/dashboard/settings`)
- Configuration panel for anomaly contamination rate, auto-refresh intervals, table page size, and telemetry preferences stored in browser local storage.

