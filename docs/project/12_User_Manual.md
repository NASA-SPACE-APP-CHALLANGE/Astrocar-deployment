# 12 — AstroCare User Manual & Operations Guide

---

## 1. System Navigation & Common Controls

### Global Top Navigation Bar (`Navbar.tsx`)
The top navigation bar is fixed at the top of every page (`height: 64px`) and provides:
1. **AstroCare Emblem:** Click anywhere to return to the Home Landing Page (`/`).
2. **Nav Links:**
   - **Overview (`/`):** Public introduction and mission overview.
   - **Live Monitoring (`/dashboard`):** Real-time flight console.
   - **AI Insights (`/ai-insights`):** Isolation Forest and Multi-Parameter Risk Engine.
   - **Mission Data (`/mission-data`):** Historical sensor archive and CSV export.
   - **Spaceflight Research (`/research`):** NASA HRP & CSA scientific knowledge base.
   - **About Project (`/about`):** Architecture and technology details.
3. **Crew Role Status Pill:** Displays active logged-in role (`FLIGHT SURGEON` in violet or `ASTRONAUT` in cyan).
4. **Launch Mission Console CTA:** Immediate jump to `/dashboard`.
5. **Active Route Underline:** The active page features an electric cyan underline (`2px solid var(--electric-cyan)`) and subtle glow.

---

## 2. Module Operation Instructions

### Live Monitoring Console (`/dashboard`)
1. **Selecting an Astronaut:** Use the **ASTRONAUT** dropdown in the header to switch between crew members (e.g., Commander Alex Vance, Dr. Sarah Chen, Marcus Torres). All vitals and flight day stats update immediately.
2. **Pausing / Resuming Telemetry:** Click **Pause** to freeze real-time 20-second polling for close clinical inspection; click **Resume** to restart live stream polling.
3. **Triggering Medical Scenarios:** Under **Simulator Quick Trigger**:
   - Click `+30 Min Step` to advance nominal time.
   - Click `+ Inject Tachycardia` to simulate acute heart rate elevation.
   - Click `+ Inject SpO2 Dip` to simulate arterial oxygen desaturation.
4. **Acknowledging Alerts:** In the **Active Telemetry Alerts** card, click the green **Acknowledge** button to immediately triage an alert.

### AI Anomaly & Risk Engine (`/ai-insights`)
1. **Running Isolation Forest:**
   - Select contamination sensitivity (`2%`, `5%`, `10%`, or `15%`).
   - Click **"RUN ISOLATION FOREST"**.
   - Review the Model Status, Anomaly Score Distribution scatter plot, and Anomaly by Metric bar chart.
2. **Evaluating Multi-Parameter Spaceflight Risks:**
   - Click the hazard filter buttons (`All`, `Radiation`, `Isolation`, `Distance`, `Gravity`, `Environment`).
   - Click **"View Clinical Assessment"** on any risk card to inspect the correlated parameters, detected abnormalities, and pathophysiological evidence.
   - Review the three-tier countermeasure response (Immediate, Preventive, Flight Surgeon Escalation).
   - Change the review status dropdown to update clinical triage (`Pending Triage` -> `Flight Surgeon Reviewed` -> `Countermeasure Deployed` -> `Mitigated`).

### Alert & Triage Center (`/dashboard/alerts`)
1. **Filtering Alerts:** Click `Critical`, `Warning`, or `Info` chips, or filter by alert type (`Health Concern` vs. `Data Quality`).
2. **Clinical Review Modal:** Click **"Review / Triage"** on an alert card to open the modal. Enter flight surgeon clinical review notes, select a status (`Reviewed`, `Dismissed`, `Escalated`), and click **"Save Triage Record"**.

### Health Trend Analytics (`/dashboard/analytics`)
1. **Time Range Selection:** Click `24H`, `7D`, `30D`, or `ALL` to adjust the observation window.
2. **Metric Switching:** Click any parameter tab (Heart Rate, SpO2, Core Temp, Resp Rate, Systolic BP, Sleep, Activity, Radiation).
3. **Chart Inspection:** Hover over any point on the trend line to view exact timestamps and anomaly tags; compare against the dashed personal resting baseline line.

### Generating Mission Reports (`/dashboard/reports`)
1. In the **"Generate New Report"** card, select a start and end date.
2. Enter an optional custom evaluation title (e.g. `"Artemis-VII Sol 142 Clinical Debrief"`).
3. Click **"Generate Report"**.
4. Review the report summary and statistical table in the right pane; click **"Print Report"** to open browser print/PDF export formatting.

### Telemetry Simulator Studio (`/dashboard/simulator`)
1. In the **Scenario Selector**, choose `Circadian Normal`, `Tachycardia`, `Hypoxia`, `Hypothermia`, `Extreme Radiation`, or `Hypertension`.
2. Click **"Generate Next 30-Min Step"** to execute one packet.
3. Toggle **"Auto-Stream (4s)"** to continuously generate packets for live demonstrations.
4. Click **"Reset Database to Clean Seed"** to restore the default baseline.

