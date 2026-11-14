# 11 — Limitations & Future Scope

---

## 1. Prototype Limitations & Transparent Disclosures

In accordance with ethical scientific engineering and NASA Space Apps Challenge standards, AstroCare transparently documents its current prototype limitations:

### 1. Simulated Telemetry Grounding
- **Current State:** Because live, real-time astronaut medical records are strictly protected under federal medical privacy laws (HIPAA and NASA Crew Privacy Directives), AstroCare’s current telemetry stream is mathematically synthesized based on published NASA HRP baseline distributions and circadian models.
- **Scientific Implication:** While the simulated values accurately mimic real microgravity physiological norms, they do not replace formal clinical trials on human subjects in space analogs.

### 2. Decision Support vs. Clinical Diagnosis
- **Boundary:** AstroCare is explicitly an **intelligent decision-support prototype**, not an autonomous medical device or automated prescribing engine.
- **Protocol:** The system provides evidence synthesis and recommended countermeasures, but all medical diagnoses and pharmaceutical decisions remain the sole responsibility of licensed flight surgeons and designated Crew Medical Officers.

### 3. Sampling Frequency & High-Frequency Arrhythmias
- **Temporal Resolution:** Current telemetry points represent 30-minute operational intervals. Transient micro-events (such as premature ventricular contractions, episodic sleep apnea desaturations, or single-beat arrhythmias) require 250–1000 Hz waveform ingestion.

---

## 2. Future Development Roadmap

```
┌────────────────────────────────────────────────────────────────────────┐
│                     ASTROCARE FUTURE RESEARCH ROADMAP                  │
├──────────────────────┬────────────────────────┬────────────────────────┤
│ PHASE 1 (Short-Term) │ PHASE 2 (Medium-Term)  │ PHASE 3 (Exploration)  │
│ Hardware Wearables & │ Analog Habitat Field   │ Deep Space Autonomous  │
│ High-Frequency ECG   │ Trials (HERA & CHAPEA) │ Medical Co-Pilot (Mars)│
└──────────────────────┴────────────────────────┴────────────────────────┘
```

### Phase 1: Direct Wearable & Bio-Sensor Integration (6–12 Months)
- Integrate direct Bluetooth Low Energy (BLE) and ANT+ ingestion from space-qualified medical wearables (e.g. Bio-Monitor smart shirt developed by CSA, NASA Astroskin, pulse oximeters, continuous optical core temp sensors).
- Implement raw 250 Hz ECG waveform streaming with client-side Pan-Tompkins QRS wave detection for real-time arrhythmia classification.

### Phase 2: NASA Analog Habitat Field Validation (1–2 Years)
- Deploy AstroCare in controlled NASA isolation analogs such as **HERA (Human Exploration Research Analog)** at Johnson Space Center and **CHAPEA (Crew Health and Performance Exploration Analog)**.
- Test AstroCare under simulated communication latencies (5 to 20 minutes) with analog astronaut crews managing simulated emergencies.
- Refine Isolation Forest contamination hyper-parameters using real analog crew actigraphy, polysomnography, and immune salivary cortisol logs.

### Phase 3: Exploration-Class Autonomous Medical Co-Pilot (Mars Transit)
- **Edge AI Deployment:** Quantize machine learning models (TensorFlow Lite / ONNX) to execute directly on radiation-hardened spacecraft microcontrollers (e.g. BAE RAD750 or Vorago ARM Cortex).
- **Computer Vision Integration:** Incorporate ultrasound AI image-guidance to assist the Crew Medical Officer in performing optic nerve sheath diameter (SANS) and cardiac echocardiography sweeps.
- **Pharmacokinetic Shelf-Life Modeling:** Model radiation-induced degradation of spacecraft medical supplies to optimize on-board pharmaceutical inventories for 3-year Mars missions.

