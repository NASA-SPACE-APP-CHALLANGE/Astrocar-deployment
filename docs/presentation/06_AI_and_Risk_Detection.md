# 06 — AI Anomaly Detection & Risk Assessment Engine

---

## 1. Machine Learning Methodology: Isolation Forest

AstroCare utilizes an **Isolation Forest** (iForest) algorithm for unsupervised multivariate anomaly detection. In spaceflight biomedical telemetry, labeled datasets of real in-flight human pathologies are exceptionally scarce. Supervised classifiers fail because abnormal spaceflight states are rare, diverse, and unpredictable.

### Why Isolation Forest?
1. **Unsupervised Operation:** Does not require labeled ground-truth training data of astronaut medical failures.
2. **Sub-linear Time Complexity:** $O(n \cdot t \cdot \psi)$ where $n$ is data volume, $t$ is number of trees, and $\psi$ is subsample size, enabling real-time execution on low-power exploration spacecraft computers.
3. **Partition Principle:** Normal observations require many recursive random hyperplane splits to isolate in feature space. In contrast, anomalies possess extreme or unusual attribute combinations and are isolated in very few splits (short average path length $h(x)$).

```
   Normal Observation (Deep Path)             Anomaly (Short Path)
           [ Root ]                                [ Root ]
           /      \                                /      \
        [ ]        [ ]                        [ ANOMALY ]  [ ]
       /   \      /   \
     [ ]   [ ]  [ ]   [ ]
```

---

## 2. Mathematical Foundation

The anomaly score $s(x, n)$ for an observation $x$ across an ensemble of $t$ isolation trees is given by:

$$s(x, n) = 2^{-\frac{E(h(x))}{c(n)}}$$

Where:
- $E(h(x))$ is the expected path length of observation $x$ across all isolation trees.
- $c(n)$ is the average path length of an unsuccessful search in a Binary Search Tree (BST) over $n$ points:

$$c(n) = 2 \ln(n - 1) + 0.5772156649\text{ (Euler-Mascheroni constant)} - \frac{2(n - 1)}{n}$$

### Interpretation of Scores:
- **Score $s \to 1$ (or decision function $< 0$):** High probability of an anomalous observation.
- **Score $s < 0.5$ (or decision function $> 0$):** Nominal physiological state.
- **Score $s \approx 0.5$:** Entire dataset lacks distinct anomalies.

---

## 3. The End-to-End AI Pipeline

```
┌───────────────────────┐
│ Raw Telemetry Packet  │ (Heart Rate, SpO2, Temp, Resp, BP, Radiation, Activity, Sleep)
└───────────┬───────────┘
            ▼
┌───────────────────────┐
│ Validation & Cleaning │ (Schema verification, timestamp ordering, null/NaN interpolation)
└───────────┬───────────┘
            ▼
┌───────────────────────┐
│ Feature Normalization │ (StandardScaler: z-score transformation against crew baseline)
└───────────┬───────────┘
            ▼
┌───────────────────────┐
│ Isolation Forest Run  │ (Ensemble of 100 trees, configurable contamination 2% – 15%)
└───────────┬───────────┘
            ▼
┌───────────────────────┐
│ Anomaly Scoring & Log │ (Calculation of path lengths, decision function score, feature attribution)
└───────────┬───────────┘
            ▼
┌───────────────────────┐
│ Multi-Parameter Risk  │ (Correlation of anomalies into clinical hazard syndromes)
│ Assessment Engine     │
└───────────┬───────────┘
            ▼
┌───────────────────────┐
│ Countermeasure Action │ (Immediate, preventive, and flight surgeon escalation protocols)
└───────────────────────┘
```

---

## 4. Multi-Parameter Risk Correlation Logic

AstroCare does not treat anomalies as isolated events. A high heart rate during countermeasure exercise is normal; a high heart rate during nocturnal sleep accompanied by low SpO2 is a critical emergency.

The **Risk Assessment Engine** evaluates multi-parameter physiological and environmental combinations:

```
[ Elevated Heart Rate (>100 bpm) ] ──┐
                                     ├─► [ Acute Hypoxic Cardiovascular Strain ]
[ Depressed SpO2 (<93%) ] ───────────┘   • Severity: CRITICAL
                                         • Action: Don O2 mask, halt exercise

[ Elevated Ambient PCO2 (>3.0 mmHg) ] ──┐
                                        ├─► [ Hypercapnic SANS Exacerbation ]
[ Astronaut Cephalic Congestion ] ──────┘   • Severity: HIGH
                                            • Action: Activate secondary CDRA beds

[ Radiation Surge (>0.75 mSv/day) ] ──┐
                                      ├─► [ Solar Particle Event (SPE) Hazard ]
[ Solar Proton Precursor Flux ] ──────┘   • Severity: HIGH
                                          • Action: Evacuate crew to storm shelter
```

---

## 5. Explainable AI & Scientific Distinction

### Ethical AI Guidelines Implemented in AstroCare:
1. **No False Clinical Claims:** Anomaly scores reflect *multivariate statistical divergence*, not a confirmed medical diagnosis.
2. **Feature Attribution:** Every flagged anomaly displays which specific metric drove the outlier decision (e.g., `heart_rate (+3.2 std dev) + spo2 (-2.8 std dev)`).
3. **Flight Surgeon Authority:** AstroCare provides decision support and evidence synthesis, explicitly keeping human clinical authority at the center of mission medicine.

