# 09 — Live Demonstration Workflow

---

## 1. Step-by-Step Presentation Demonstration Script

This workflow is verified to work 100% reliably in AstroCare. Presenters can follow this sequence during live judging or pitch presentations to demonstrate the full end-to-end capabilities of the platform.

```
       ┌────────────────────────────────────────────────────────┐
       │             ASTROCARE LIVE DEMO FLOW (6 MINS)          │
       └───────────────────────────┬────────────────────────────┘
                                   │
  Step 1: Open Application & Overview (/)
     │
     ▼
  Step 2: Launch Live Monitoring Console (/dashboard)
     │
     ▼
  Step 3: Trigger Medical Telemetry Injections (/dashboard)
     │
     ▼
  Step 4: Execute AI Anomaly & Risk Engine (/ai-insights)
     │
     ▼
  Step 5: Triage & Acknowledge Clinical Alerts (/dashboard/alerts)
     │
     ▼
  Step 6: Review Historical Trends & Analytics (/dashboard/analytics)
     │
     ▼
  Step 7: Generate & Print Official Mission Report (/dashboard/reports)
     │
     ▼
  Step 8: Explore NASA & CSA Research Hub (/research)
```

---

## 2. Detailed Demonstration Walkthrough

### Step 1: Open the Application (`http://127.0.0.1:5173/`)
- **Action:** Open browser to the AstroCare home page.
- **Talking Points:**
  - Introduce AstroCare as an integrated astronaut health monitoring and risk mitigation platform built for the NASA Space Apps Challenge.
  - Highlight the unified top navigation bar, animated starfield, and research badges.
- **Visual:** Smooth hero section with "Launch Mission Console" CTA button.

### Step 2: Launch Live Monitoring Console (`/dashboard`)
- **Action:** Click **"Launch Mission Console"** in the top navigation bar.
- **Talking Points:**
  - Notice the layout consistency: the previous left sidebar has been removed, unified under the clean horizontal top navbar with "Live Monitoring" highlighted.
  - Point out the **Space Station Environmental Telemetry Strip** (Cabin ATM, O2 21.2%, Total Pressure 101.3 kPa, Orbital regime 408 KM LEO).
  - Show the **Active Crew Member Profile Card** for Commander Alex Vance (Flight Day 142 of 180, live Mission Elapsed Timer ticking every second, cumulative radiation dose 42.6 mSv).
  - Point out the **7 Vital Physiological Indicators** (`MetricCard`s) with real-time sparklines and measured status badges.

### Step 3: Trigger Controlled Anomaly Injection (`/dashboard`)
- **Action:** On the **Simulator Quick Trigger** card:
  1. Click **"+30 Min Step (Circadian Normal)"** — observe updated timestamp.
  2. Click **"+ Inject Tachycardia"** — inject elevated heart rate.
  3. Click **"+ Inject SpO2 Dip"** — inject arterial desaturation.
- **Talking Points:**
  - AstroCare allows flight controllers and crew to simulate physiological stressors in real time.
  - The telemetry streams immediately update to reflect the injected cardiovascular excursion.

### Step 4: Execute AI Anomaly Detection & Risk Engine (`/ai-insights`)
- **Action:** Click **"AI Insights"** in the top navigation bar.
- **Talking Points:**
  - Point out the **Contamination Sensitivity** dropdown (set at 5% standard).
  - Click **"RUN ISOLATION FOREST"** — watch the spinner analyze telemetry.
  - Show the **Model Run Status Summary**, Anomaly Score Scatter Plot, and Metric Breakdown Bar Chart.
  - Scroll to the **Intelligent Multi-Parameter Risk Assessment Engine**:
    - Filter by NASA Hazards (`All`, `Radiation`, `Isolation`, `Distance`, `Gravity`, `Environment`).
    - Expand **"Acute Hypoxic Cardiovascular Strain & Deconditioning"**.
    - Review the **Correlated Parameters** (Heart Rate 114 bpm elevated + SpO2 91.2% critical + Respiration 22.4 elevated).
    - Review the **Three-Tier Countermeasure Recommendations** (Immediate, Preventive, Flight Surgeon Escalation).
    - Change review status from `Pending Triage` to `Flight Surgeon Reviewed`.

### Step 5: Triage & Acknowledge Clinical Alerts (`/dashboard/alerts`)
- **Action:** Navigate to **Alert Center** (via top console link or subsystem grid).
- **Talking Points:**
  - Show severity counters (Critical, Warning, Info, Unacknowledged).
  - Filter alerts by severity `Critical` and type `Health Concern`.
  - Click **"Acknowledge"** on an alert — observe real-time status update to green checked badge.
  - Click **"Review / Triage"** to open the modal, type review notes (`"Supplemental O2 administered. SpO2 recovered to 97%."`), and save.

### Step 6: Multi-Temporal Health Trend Analytics (`/dashboard/analytics`)
- **Action:** Open **Health Analytics**.
- **Talking Points:**
  - Switch time ranges between `24h`, `7d`, `30d`, and `all`.
  - Select different biometric parameters (Heart Rate, SpO2, Core Temp, Resp Rate).
  - Point out the personal resting baseline line and standard deviation bounds.
  - Hover over data points to inspect exact timestamps and anomaly tags.

### Step 7: Generate & Print Mission Health Report (`/dashboard/reports`)
- **Action:** Open **Mission Reports**.
- **Talking Points:**
  - In the "Generate New Report" form, enter a title: `"Artemis-VII Sol 142 Mid-Mission Clinical Review"`.
  - Click **"Generate Report"** — the report appears immediately in the left list and opens in the viewer.
  - Point out the clinical summary narrative, statistical metrics table (count, mean, std, min, max), and recommendations list.
  - Click **"Print Report"** to show browser print preview formatting.

### Step 8: Explore NASA & CSA Research Knowledge Base (`/research`)
- **Action:** Click **"Spaceflight Research"** in the top navigation bar.
- **Talking Points:**
  - Show the scientific grounding of AstroCare: all 5 NASA hazards and 8 clinical health risks.
  - Demonstrate Canadian Space Agency (CSA) bio-dosimetry and science in space integrations.
  - Point out official NASA links and disclaimers.

