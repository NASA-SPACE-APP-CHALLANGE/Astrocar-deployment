# 01 — Project Overview: AstroCare

**System Name:** AstroCare — Integrated Astronaut Health Monitoring and Risk Management System  
**Version:** 2.4.0 (Production-Ready Architecture)  
**Target Environment:** NASA Artemis Lunar Base, Deep Space Transit, Mars Habitat Analogs  
**Classification:** Biomedical Decision Support Software (Research & Demonstration Prototype)  

---

## 1. System Mission & Scope

AstroCare is an integrated, end-to-end aerospace telemedicine and autonomous biomedical decision-support platform designed for deep-space human exploration missions. Built in alignment with the scientific guidelines of the **NASA Human Research Program (HRP)** and the **Canadian Space Agency (CSA)**, AstroCare monitors continuous astronaut physiological telemetry, tracks closed-cabin life-support atmospheres, identifies multivariate health anomalies via machine learning, correlates multi-parameter spaceflight risks, and recommends evidence-based clinical countermeasures.

### Operational Scope:
- **Telemetry Ingestion:** Real-time ingestion of continuous 7-parameter physiological telemetry and 5-parameter spacecraft habitat environmental metrics.
- **AI Anomaly Detection:** Real-time and batch unsupervised anomaly detection utilizing an ensemble Isolation Forest model with feature attribution.
- **Risk Assessment:** Multi-hazard clinical risk evaluation mapping directly across all five NASA Spaceflight Hazard categories (Space Radiation, Isolation & Confinement, Distance from Earth, Gravity Fields, Hostile Environments).
- **Countermeasure Guidance:** Evidence-based, three-tiered clinical response protocols (Immediate Response, Preventive Protocol, Flight Surgeon Escalation).
- **Clinical Triage & Mission Reporting:** Centralized alert management, multi-temporal longitudinal analytics, and automated generation of formal mission health briefings.

---

## 2. Key System Capabilities

| Capability Category | System Feature | Operational Benefit |
| :--- | :--- | :--- |
| **Biomedical Monitoring** | 7 Vital Signs Stream (`MetricCard`) | Instant visibility into cardiovascular, respiratory, thermal, metabolic, and dosimetric trends with live sparklines. |
| **Environmental Telemetry** | ECLSS Cabin Atmosphere Strip | Continuous tracking of cabin O2, PCO2, total pressure, and LEO/Lunar orbital conditions. |
| **AI Outlier Scoring** | Unsupervised Isolation Forest Engine | Detects non-linear, multi-dimensional anomalies that evade univariate fixed-threshold alarm monitors. |
| **Multi-Parameter Risk Engine**| Correlated Risk Matrix | Synthesizes concurrent anomalies (e.g. Tachycardia + SpO2 drop) into structured clinical syndrome assessments. |
| **Evidence-Based Countermeasures**| Three-Tier Action Protocol | Delivers immediate point-of-care crew guidance, preventive timeline calibrations, and flight surgeon diagnostic steps. |
| **Operational Alert Center** | Severity-Rated Triage System | Enables search, filtering, clinical note annotation, and 1-click acknowledgment with duplicate alert suppression. |
| **Longitudinal Trend Analytics**| Multi-Temporal Trend Engine | Evaluates 24h, 7d, 30d, and full mission horizons against personalized pre-flight resting baselines. |
| **Mission Reporting** | Automated Report Generator | Generates formal, print-ready mission health evaluations with statistical distributions (mean, std dev, min, max). |
| **Simulation Studio** | Scenario Injection Engine | Injects normal steps, tachycardia, hypoxia, hypothermia, radiation storms, and hypertension for training and stress testing. |
| **Interoperability** | CSV Data Import & Export Studio | Validates and parses external CSV telemetry files, providing open-data research interoperability. |

---

## 3. System Design Principles

1. **Non-Alarmist Scientific Integrity:** Anomaly scores reflect *multivariate statistical divergence*, not automated medical diagnoses. The platform maintains strict scientific attribution and distinguishes established clinical findings from experimental frontiers.
2. **Autonomous Offline Resilience:** Designed to function completely on-board during 24-minute speed-of-light Martian communication blackouts, with local state persistence and automated API failover handling.
3. **Ergonomic Visual Hierarchy:** The **Orbital Glass** design system enforces consistent 1400px centered page layouts, high-contrast readable typography, subtle status glowing borders, and uncluttered cognitive loads.

