# AstroCare – Project Change Log and Version History

## Semantic Versioning Summary
All notable changes to the AstroCare system are documented in this file in reverse chronological order, adhering to [Semantic Versioning (SemVer)](https://semver.org/).

---

## [v2.0.0] – 2026-11-13 (Major Scientific & Architectural Overhaul)

### Architectural & UI Unification
- **Top Navigation Integration**: Completely removed the isolated left sidebar from `/dashboard` (`DashboardLayout.tsx`). Integrated the Live Monitoring view into the unified site-wide top horizontal `Navbar.tsx` with active cyan status indicator and mobile hamburger drawer.
- **Unified 1400px Centered Layout**: Aligned the `/dashboard` container width, margins, header styles, and card padding with `/ai-insights` and the rest of the application, eliminating visual fragmentation.
- **Design System Consistency**: Standardized the "Orbital Glass" visual design language across all 15 modules (glassmorphic dark theme, `#0B0F19` void background, `#00E5FF` electric cyan accents, `#9D4EDD` deep cosmic purple highlights, and `#00E676` telemetry normal indicators).

### Scientific & Research Grounding
- **Official NASA HRP Integration**: Integrated official NASA Human Research Program taxonomies:
  - 5 Major Hazards of Human Spaceflight (Space Radiation, Isolation & Confinement, Distance from Earth, Gravity Fields, Hostile/Closed Environments).
  - NASA HRP Risks & Evidence taxonomies.
  - NASA Ongoing Research links and operational frameworks.
- **CSA Research Grounding**: Integrated Canadian Space Agency scientific publications on cosmic radiation monitoring, active dosimeters, and why microgravity science experiments are conducted aboard the ISS.
- **Three-Tier Countermeasure Recommendation Engine**: Formulated evidence-based protocols categorized into:
  1. *Immediate Actions* (autonomous, crew-executable within seconds to minutes).
  2. *Preventive Protocols* (scheduled physical exercise, pharmacological prophylaxis, nutrition, shielding).
  3. *Flight Surgeon Escalation* (telemedical advisory, ground clinical consultation, emergency abort staging).

### Risk Assessment & Anomaly Detection Engine
- **Multi-Parameter Clinical Risk Engine**: Created `riskAssessmentService.ts` capable of cross-correlating 7 physiological vitals and 5 spacecraft environmental metrics into 6 recognized spaceflight syndromes:
  - `RSK-RAD-001`: Acute Solar Particle Event & Radiation Syndrome
  - `RSK-EVA-002`: Acute Hypoxic Hypothermia & Suit Depressurization Indicator
  - `RSK-ENV-003`: Spacecraft Hypercapnia & Cabin Air Recirculation Toxicity
  - `RSK-GRAV-004`: Severe Orthostatic Intolerance & Cardiovascular Deconditioning
  - `RSK-ISO-005`: Neurocognitive Exhaustion, SANS & Chronic Confinement Strain
  - `RSK-DIST-006`: Autonomous Deep-Space Anomaly with Comm-Delay Latency
- **Dynamic AI Sensitivity Slider**: Added dynamic decision threshold controls (`0.01` to `0.20`) with instant multivariate Isolation Forest scoring in `/ai-insights`.

### Resilient Client-Side Architecture & Fallbacks
- **Zero-Failure Offline Capability**: Implemented robust client-side fallback engines across all 15 pages:
  - Synthetic biometric trend generator in `/analytics` spanning 24h, 7d, 30d, and mission-to-date intervals.
  - Multi-hazard triage catalog with status transitions and local notes in `/alerts`.
  - Multi-scenario streaming telemetry simulation in `/simulator`.
  - Sensor time-series tables and CSV export in `/mission-data`.
  - Interactive CSV parser and data validator in `/import`.
  - Full-featured mission health report generator with PDF/print view in `/reports`.
  - Editable astronaut baseline updates with localStorage persistence in `/profile`.

### Comprehensive Documentation Suite
- **Presentation Deck (`PPT_CONTENT/`)**: Created 13 exhaustive markdown slide files covering problem statements, solution architecture, NASA alignment, demo workflows, and presentation speaker notes.
- **System Documentation (`PROJECT_DOCUMENTATION/`)**: Created 20 comprehensive technical reference documents detailing functional specs, architecture, database schemas, APIs, AI models, safety protocols, testing results, and deployment.

---

## [v1.1.0] – 2026-11-12 (Codebase Audit & Safe Cleanup)

### Cleaned & Refactored
- Removed obsolete and duplicate CSS style sheets, consolidating styling under Tailwind CSS and centralized CSS variable definitions.
- Pruned dead components, unreferenced imports, and orphan mockup files.
- Resolved circular type dependencies in `src/types/index.ts`.
- Optimized Vite build configuration with manual Rollup chunk splitting (`react-vendor`, `chart-vendor`, `lucide-vendor`), reducing main chunk footprint to ~342 kB.

---

## [v1.0.0] – 2026-10-15 (NASA Space Apps Challenge Initial Submission)

### Initial Features
- Real-time physiological telemetry stream for astronauts (Heart Rate, SpO2, Blood Pressure, Respiration Rate, Core Temp, ECG, Cumulative Radiation).
- Basic environmental indicators (Cabin Temp, Humidity, O2, CO2, Pressure).
- Prototype machine learning anomaly detection using scikit-learn Isolation Forest on synthetic datasets.
- Initial dashboard views for mission overview, telemetry, and alerts.

