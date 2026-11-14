# 08 — Risk Assessment Methodology & Correlated Evaluation

---

## 1. Multi-Parameter Risk Assessment Framework

AstroCare replaces single-metric limit checking with a multi-parameter risk correlation matrix. In spaceflight medicine, isolated departures rarely indicate a standalone pathology; physiological systems respond homeostatically across cardiovascular, neuro-vestibular, and thermal axes.

### The Assessment Pipeline:
```
[ Incoming Telemetry Stream ]
              │
              ▼
[ AI Anomaly Flagging ] ──► [ Feature Attribution Identification ]
              │
              ▼
[ Multi-Parameter Correlation Rules ] (NASA Hazard Matching Matrix)
              │
              ▼
[ Severity Scoring & Verification ] (Critical / High / Moderate / Low / Info)
              │
              ▼
[ Evidence & Action Dispatch ] (NASA HRP Pathophysiology + 3-Tier Countermeasures)
```

---

## 2. Clinical Risk Evaluation Categories

AstroCare continuously cross-evaluates six core multi-parameter spaceflight risk models:

### 1. Acute Hypoxic Cardiovascular Strain (Gravity Fields + Hostile Environment)
- **Parameters:** Heart Rate $> 100$ bpm + SpO2 $< 93\%$ + Respiration $> 20$ br/min.
- **Severity:** `Critical`.
- **Reasoning:** In microgravity, cephalad fluid redistribution decreases left ventricular end-diastolic volume. Compensatory sinus tachycardia failing to maintain tissue oxygenation during SpO2 desaturation poses acute syncopal risk.

### 2. Neurocognitive Fatigue & Circadian Misalignment (Isolation & Confinement)
- **Parameters:** Nocturnal Sleep $< 5.5$ hrs/sol + Resting HR $> 75$ bpm + Activity $> 6.5$ METs.
- **Severity:** `High`.
- **Reasoning:** Confinement stress combined with 90-minute orbital lighting disrupts melatonin secretion. Polysomnography studies prove chronic slow-wave sleep loss severely degrades reaction time and executive motor control.

### 3. Space Radiation & Solar Particle Event Threat (Space Radiation)
- **Parameters:** Ambient Dosimeter $> 0.75$ mSv/day + Cumulative Dose $> 50$ mSv + Sol $> 100$.
- **Severity:** `High`.
- **Reasoning:** Solar proton flux surges and galactic cosmic ray accumulation penetrate standard hull shielding, accelerating excess lifetime cancer mortality trajectories toward NASA-STD-3001 career caps.

### 4. Hypercapnic Cabin Enclosure Syndrome (Hostile Environments)
- **Parameters:** Cabin PCO2 $> 3.0$ mmHg + Cabin O2 Nominal + Astronaut Cephalic Congestion.
- **Severity:** `High`.
- **Reasoning:** In the absence of natural thermal convection, exhaled CO2 forms stagnant pockets around resting astronauts, inducing cerebral vasodilation, headaches, and exacerbating Spaceflight-Associated Neuro-ocular Syndrome (SANS) optic disc edema.

### 5. Calcaneal Bone Demineralization & Sarcopenia (Gravity Fields)
- **Parameters:** ARED Exercise Compliance $< 60$ min/sol + Flight Day $> 90$.
- **Severity:** `Moderate`.
- **Reasoning:** Absence of axial weight-bearing triggers rapid osteoclast bone resorption (1.0–1.5% bone density loss per month in lumbar spine and femoral neck) and type I muscle fiber atrophy.

### 6. Communication Latency Triage Blackout (Distance from Earth)
- **Parameters:** Signal Round-Trip Latency $> 10$ minutes + Active Medical Alert.
- **Severity:** `Moderate`.
- **Reasoning:** Mars transit distance prohibits real-time ground-directed clinical consultation, necessitating on-board Autonomous Medical Decision Support (AMDS) activation.

---

## 3. Severity Classification Matrix

| Severity Tier | Color Token | Clinical Impact Definition | Required Response Timeline |
| :--- | :--- | :--- | :--- |
| **Critical** | `var(--critical-coral)` | Immediate threat to crew life, consciousness, or mission continuation. | Point-of-care action within $< 5$ minutes. |
| **High** | `#FF8B53` (Orange) | Significant physiological compromise or rapid hazard accumulation. | Action within $< 60$ minutes. |
| **Moderate** | `var(--warning-amber)` | Progressive physiological deconditioning or environmental drift. | Review within active 12-hour mission shift. |
| **Low / Info**| `var(--electric-cyan)` | Minor statistical variation or operational milestone notice. | Document in daily flight surgeon report. |

