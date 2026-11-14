# AstroCare – Known Limitations and Boundary Conditions

## 1. Executive Summary

AstroCare has been engineered to provide cutting-edge biomedical telemetry monitoring, multi-parameter risk detection, and scientific countermeasure recommendations for human spaceflight. However, in accordance with aerospace safety guidelines, medical device regulatory standards, and scientific integrity, this document explicitly outlines the technical, biomedical, and algorithmic limitations of the current prototype.

AstroCare is a **Clinical Decision Support System (CDSS)** designed to augment astronaut self-care and flight surgeon situational awareness. It is **not** an autonomous diagnostic device, prescribing engine, or robotic medical intervention system.

---

## 2. Physiological and Sensor Measurement Limitations

### 2.1. Electrocardiographic (ECG) Signal Fidelity
- **Single-Lead Simulation**: The current system monitors single-channel heart rate, pulse rate variability, and synthetic rhythm waveform.
- **Diagnostic Boundary**: It does not replace a clinical 12-lead diagnostic ECG. Complex conduction blocks, subtle ST-segment ischemic changes, and localized ventricular repolarization abnormalities require multi-lead diagnostic hardware and specialized physician interpretation.

### 2.2. Continuous Blood Pressure Monitoring
- **Arterial Line vs. Photoplethysmography (PPG)**: In microgravity, cephalad fluid shift alters venous compliance and pulse wave velocity in the extremities. AstroCare's blood pressure values reflect simulated cuff-less optical estimations and periodic oscillometric measurements.
- **Limitation**: Hemodynamic surges during strenuous Extravehicular Activity (EVA) or extreme hypercapnia may experience sensor motion artifacts requiring secondary calibration.

### 2.3. Radiation Dosimetry Granularity
- **Dose Rate vs. Biological Damage**: AstroCare tracks cumulative ionizing radiation (mSv/day) based on active silicon pixel detectors and active area dosimeters.
- **Limitation**: The current system estimates Linear Energy Transfer (LET) and Galactic Cosmic Ray (GCR) heavy ion biological effectiveness (RBE) using standard weighting factors ($Q$), but cannot directly measure real-time DNA double-strand breaks or cytogenetic chromosomal aberrations without biological assays.

---

## 3. Algorithmic and Machine Learning Limitations

### 3.1. Training on Synthetic Datasets
- **Ground Truth Constraints**: Due to the proprietary, classified, and protected nature of actual astronaut medical records (NASA Life Sciences Data Archive / LSDA), AstroCare's Isolation Forest and statistical models are calibrated against synthetic data generated to reflect NASA-STD-3001 physiological distributions.
- **Edge-Case Drift**: While the model demonstrates >94% precision on synthetic anomalies, rare idiopathic physiological reactions to deep-space microgravity may produce false positives or sub-optimal anomaly scores until the models are fine-tuned on real analog mission datasets (e.g., NASA HERA, CHAPEA, or ESA Concordia).

### 3.2. Explainability and Heuristic Overlap
- **Multivariate Correlation Bounds**: The Multi-Parameter Risk Engine relies on deterministic, rule-based clinical scoring combined with machine learning anomaly detection. In highly complex, ambiguous scenarios involving multiple simultaneous organ system breakdowns, the engine presents the highest-probability hazard syndromes, but requires clinical review by a trained Medical Officer.

---

## 4. Hardware, Environmental, and Operational Constraints

### 4.1. Telecommunications Latency
- **Light-Time Communication Delays**: On low Earth orbit (ISS) missions, telemetry latency is sub-second. On lunar missions (Artemis), delay is ~1.3 seconds. On Mars transit missions, delay spans 4 to 22 minutes each way.
- **Limitation**: Real-time interactive two-way consultation with terrestrial flight surgeons is physically impossible during Mars transit. While AstroCare provides autonomous tier-1 and tier-2 countermeasure protocols onboard, tier-3 flight surgeon escalation messages must be handled asynchronously via store-and-forward telemetry.

### 4.2. Compute and Storage Footprint
- **Edge Deployment Constraints**: The current prototype runs on standard modern x86_64 / ARM64 web runtimes. On actual flight avionics (such as radiation-hardened RAD750 or BAE RAD5545 processors), JavaScript browser rendering and Python machine learning stacks must be ported to C/C++ or Rust to comply with strict embedded power and thermal budgets.

---

## 5. Summary Boundary Statement

| Capability | Supported by AstroCare | Explicitly Not Supported |
| :--- | :---: | :---: |
| Continuous multi-parameter vital signs tracking | Yes | Invasive intracranial pressure catheterization |
| Early warning anomaly detection (Isolation Forest) | Yes | Autonomous pharmaceutical prescription execution |
| Three-tier countermeasure protocol recommendations | Yes | Automated robotic surgery or invasive therapeutics |
| Real-time habitat environmental correlation | Yes | Closed-loop ECLSS life support hardware actuation |
| Offline client-side resilient mission simulation | Yes | Replacement for a certified aerospace flight surgeon |

