# 07 — AI Anomaly Detection Model Documentation

---

## 1. Algorithm Overview & Selection

AstroCare deploys an **Isolation Forest** (iForest) algorithm implemented via `scikit-learn` in `backend/app/ml/anomaly_detector.py` and supported by client-side fallback computation. 

```mermaid
graph TD
    A[Multivariate Observation Vector] --> B[StandardScaler Z-Score Normalization]
    B --> C[Ensemble of 100 Isolation Trees]
    C --> D[Average Partition Path Length Calculation]
    D --> E[Decision Function Anomaly Score: s(x, n)]
    E --> F{Score < 0 ?}
    F -- Yes --> G[Flagged Anomaly Observation]
    F -- No --> H[Nominal Spaceflight State]
    G --> I[Feature Attribution Decomposition]
```

### Justification Over Alternative Models:
- **vs. Deep Autoencoders:** Neural autoencoders require extensive graphics hardware and large training datasets that risk severe overfitting on small crew samples.
- **vs. One-Class SVM:** One-Class SVM has quadratic time complexity $O(n^2)$, making it sluggish on low-power exploration computer architectures.
- **vs. Univariate Thresholds:** Fails to detect complex multi-dimensional correlations (e.g. slight elevated HR combined with slight SpO2 drop).

---

## 2. Model Hyperparameters & Configuration

| Hyperparameter | Value | Description & Operational Justification |
| :--- | :--- | :--- |
| `n_estimators` | `100` | Number of isolation trees in the ensemble. Balances variance reduction with real-time inference speed (< 30ms). |
| `max_samples` | `min(256, n)` | Sub-sampling size per tree. Preserves isolation efficiency while avoiding masking effects in dense clusters. |
| `contamination` | `0.02 – 0.15` | Expected proportion of anomalies. Configurable via UI presets (`0.02` Strict, `0.05` Standard, `0.10` High, `0.15` Ultra). |
| `random_state` | `42` | Deterministic random seed guaranteeing scientific reproducibility across identical telemetry runs. |
| `bootstrap` | `False` | Trees are sampled without replacement. |

---

## 3. Feature Engineering & Preprocessing

The input feature vector $\vec{x}$ comprises 7 continuous normalized physiological dimensions:

$$\vec{x} = [\text{HR}, \text{SpO}_2, T_{\text{body}}, \text{RR}, \text{BP}_{\text{sys}}, \text{Act}, \text{Rad}]$$

### Preprocessing Protocol:
1. **Missing Value Handling:** Forward-fill (LOCF) for short gaps (< 2 intervals) followed by population median imputation.
2. **StandardScaler Z-Score Normalization:**
   $$z_i = \frac{x_i - \mu_i}{\sigma_i}$$
   Where $\mu_i$ and $\sigma_i$ are the historical baseline mean and standard deviation for the active crew member. This ensures a 1 °C body temperature shift is weighted proportionally to a 10 bpm heart rate variation.

---

## 4. Feature Attribution & Explanation Generation

When an observation is flagged as an outlier, AstroCare computes the absolute z-score deviation for each feature:

$$\text{Attribution}(i) = |z_i| = \left|\frac{x_i - \mu_{\text{baseline}, i}}{\sigma_{\text{baseline}, i}}\right|$$

The parameter exhibiting the highest $|z_i|$ is identified as the **primary deviating indicator**, generating an explainable clinical summary:
> *"Acute sinus tachycardia (114.2 bpm) exceeding personal resting baseline by +3.2 standard deviations during microgravity transition."*

