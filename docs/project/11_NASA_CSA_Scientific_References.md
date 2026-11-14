# 11 — NASA & CSA Scientific Reference Mapping

---

## 1. Overview of Scientific Literature Integration

Every medical threshold, anomaly description, and countermeasure protocol in AstroCare is cross-referenced against official publications from the **NASA Human Research Program (HRP)** and the **Canadian Space Agency (CSA)**.

---

## 2. Comprehensive Scientific Citation Registry

### 1. NASA Five Hazards of Human Spaceflight
- **Source Citation:** National Aeronautics and Space Administration. (2026). *The Hazards of Human Spaceflight*. NASA Human Research Program.
- **Official URL:** https://www.nasa.gov/hrp/hazards/
- **AstroCare Mapping:**
  - *Hazard 1 (Radiation):* Implemented in `/ai-insights` (Risk-03), `/research`, and `/dashboard` (dosimeter widget).
  - *Hazard 2 (Isolation):* Implemented in `/ai-insights` (Risk-02) and `/dashboard/analytics` (sleep tracking).
  - *Hazard 3 (Distance):* Implemented in `/ai-insights` (Risk-06) and Autonomous Medical Decision Support protocols.
  - *Hazard 4 (Gravity Fields):* Implemented in `/dashboard` (Cardiovascular MetricCards) and `/dashboard/profile` (baselines).
  - *Hazard 5 (Hostile Environments):* Implemented in `/dashboard` (Habitat Environmental Strip) and `/ai-insights` (Risk-04).

### 2. NASA Risks of Human Spaceflight
- **Source Citation:** National Aeronautics and Space Administration. (2026). *Human Research Program Risks*. NASA HRP Human Health Countermeasures Element.
- **Official URL:** https://www.nasa.gov/hrp/risks/
- **AstroCare Mapping:**
  - *Risk of Bone Fracture & Sarcopenia:* ARED exercise compliance tracking ($150\text{ kg}$ axial load).
  - *Risk of SANS:* Correlation of high ambient PCO2 ($> 3.0\text{ mmHg}$) with cephalic fluid redistribution.
  - *Risk of Adverse Cognitive Outcomes:* Sleep duration actigraphy ($< 6.0\text{ hrs/sol}$ warning threshold).
  - *Risk of Cardiovascular Alterations:* Resting heart rate and blood pressure monitoring.

### 3. NASA Ongoing Human Research Program (HRP) Studies
- **Source Citation:** National Aeronautics and Space Administration. (2026). *Ongoing HRP Research and Human Exploration Milestones*.
- **Official URL:** https://www.nasa.gov/hrp/ongoing-hrp-research/
- **AstroCare Mapping:**
  - *CIPHER Protocol:* Multi-system physiological integration displayed in the Research Hub.
  - *Exploration Medical Capability (ExMC):* Autonomous medical software guidance during Mars communication latency.

### 4. CSA: Monitoring Radiation for Astronaut Health
- **Source Citation:** Canadian Space Agency. (2026). *Monitoring Radiation for Astronaut Health*. ASC-CSA Science and Technology Directorate.
- **Official URL:** https://www.asc-csa.gc.ca/eng/news/articles/2026/2026-02-26-monitoring-radiation-astronaut-health.asp
- **AstroCare Mapping:**
  - Cumulative bio-dosimetry tracking, galactic cosmic ray (HZE) tissue scoring, and storm-shelter protocols.

### 5. CSA: Why Do We Conduct Science Experiments in Space?
- **Source Citation:** Canadian Space Agency. (2026). *Why Do We Conduct Science Experiments in Space? International Space Station Science Payloads*.
- **Official URL:** https://www.asc-csa.gc.ca/eng/iss/science/why-do-we-conduct-science-experiments-in-space.asp
- **AstroCare Mapping:**
  - Dual space-and-Earth spin-off clinical benefits (osteoporosis, ICU false-alarm mitigation, remote telemedicine).

### 6. NASA Space Flight Human-System Standard (NASA-STD-3001)
- **Source Citation:** NASA. (2023). *NASA-STD-3001, Space Flight Human-System Standard, Volume 1, Revision B: Crew Health*.
- **AstroCare Mapping:**
  - Permissible occupational career radiation limits ($600\text{ mSv}$ lifetime cap).
  - Spacecraft Maximum Allowable Concentrations (SMAC) for cabin atmospheric CO2 and O2.

