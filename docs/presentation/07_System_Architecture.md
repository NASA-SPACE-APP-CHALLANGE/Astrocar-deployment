# 07 — System Architecture & Component Design

---

## 1. High-Level Architectural Diagram

AstroCare utilizes a modern, modular, dual-core architecture engineered for both autonomous spacecraft operations (edge computing) and ground mission control stations. The frontend is built on **React 19** and **TypeScript** with Vite, while the backend leverages a **Node.js 22 Native Telemetry Core** (zero external dependencies, built-in SQLite WAL mode) paired with an optional **FastAPI** Python service for Scikit-learn ML modeling, packaged across native desktop shells (**Electron 34+**, Linux `.deb`, Windows NSIS, macOS `.app`).

```mermaid
graph TD
    subgraph Data Sources & Ingestion
        S1["Simulated Telemetry Studio<br/>(30-min physiological packets)"] --> INGEST["Ingestion API & Validator"]
        S2["Environmental ECLSS Sensors<br/>(O2, CO2, Pressure)"] --> INGEST
        S3["CSV Historical Datasets<br/>(NASA HRP Baselines)"] --> INGEST
    end

    subgraph Backend Core (Dual-Core Engine)
        INGEST --> DB[("SQLite Database<br/>(Readings, Alerts, Reports, Baselines)")]
        DB --> NODE_CORE["Node.js 22 Standalone Telemetry Core<br/>(Sub-ms REST, Built-in SQLite, Port 8000)"]
        DB --> ML["FastAPI AI Anomaly Engine<br/>(Isolation Forest Model)"]
        ML --> RISK["Intelligent Risk Correlator<br/>(NASA 5 Hazards Matrix)"]
        NODE_CORE --> ALERT_SVC["Alert & Notification Service"]
        NODE_CORE --> REP_SVC["Mission Report Generator"]
    end

    subgraph Client & Distribution Layer
        API_LAYER["API Gateway & Resilience Layer"]
        ELECTRON["Cross-Platform Desktop Shell<br/>(Linux .deb, Windows NSIS, macOS .app)"]
        BROWSER["Web Browser Console<br/>(React 19 + TypeScript)"]
        
        ELECTRON --> BROWSER
        BROWSER --> API_LAYER
        API_LAYER --> DASH["Live Monitoring Console (/dashboard)"]
        API_LAYER --> ANALYTICS["Health Analytics (/dashboard/analytics)"]
        API_LAYER --> AI_PAGE["AI Insights & Risk Engine (/ai-insights)"]
        API_LAYER --> ALERTS["Alert & Triage Center (/dashboard/alerts)"]
        API_LAYER --> REPORTS["Mission Reports (/dashboard/reports)"]
        API_LAYER --> RES_HUB["NASA & CSA Research Hub (/research)"]
    end

    ALERT_SVC -.-> API_LAYER
    RISK -.-> API_LAYER
    NODE_CORE -.-> API_LAYER
```

---

## 2. Frontend Subsystem Architecture

### Component Hierarchy & Layout Uniformity
The entire application adheres to a unified layout structure:
- **Global Navbar (`Navbar.tsx`):** Fixed frosted-glass navigation (`height: 64px`) with dynamic route indicator, active crew badge, and Launch Console CTA.
- **Top Spacing & Container:** Every page is enclosed within a responsive `.container` with `max-width: 1400px`, centered alignment, and `paddingTop: 80px`.
- **Global Error Boundary (`ErrorBoundary.tsx`):** Wraps all dynamic route segments to isolate rendering exceptions and prevent white-screen crashes.
- **Dynamic Code-Splitting (`React.lazy`):** All 15 page views are loaded on demand, cutting the initial bundle size from `1,015 kB` to `342 kB`.
- **Global Footer (`Footer.tsx`):** Displays telemetry status and mandatory NASA Space Apps Challenge research disclaimers.

```
App.tsx
├── AuthProvider (AuthContext.tsx & useAuth.ts)
└── StarfieldBackground (Animated canvas)
    └── ErrorBoundary
        └── Suspense (PageLoadingFallback)
            ├── Navbar (Site-wide top navigation)
            ├── Routes (15 Code-split views)
            │   ├── LandingPage (/)
            │   ├── DashboardLayout (/dashboard)
            │   │   ├── DashboardOverview (index)
            │   │   ├── HealthAnalyticsPage (analytics)
            │   │   ├── AlertCenterPage (alerts)
            │   │   ├── AstronautProfilePage (profile)
            │   │   ├── MissionReportsPage (reports)
            │   │   ├── DataSimulatorPage (simulator)
            │   │   └── SettingsPage (settings)
            │   ├── AIInsightsPage (/ai-insights)
            │   ├── MissionDataPage (/mission-data)
            │   ├── ResearchHubPage (/research)
            │   └── AboutPage (/about)
            └── Footer (Site-wide research footer)
```

---

## 3. Backend Subsystem Architecture

### FastAPI Clean REST API Structure
The backend is organized into clear domain layers:
- **`app/api/`:** Clean API endpoints (`metrics.py`, `anomalies.py`, `alerts.py`, `reports.py`, `simulator.py`, `astronauts.py`, `readings.py`, `datasets.py`).
- **`app/services/`:** Business logic separation (`anomaly_service.py`, `alert_service.py`, `report_service.py`, `simulator_service.py`).
- **`app/ml/`:** Scikit-learn machine learning pipeline (`anomaly_detector.py`).
- **`app/core/`:** Database session management, SQLite engine initialization, configuration settings (`config.py`, `database.py`).
- **`app/schemas/`:** Strict Pydantic v2 data validation schemas (`schemas.py`).

---

## 4. Resilience & Offline Architectural Pattern

For spaceflight and analog missions where the backend server may be starting up, unreachable, or in sandbox isolation:
1. **API Resilience Layer:** The frontend features automated failover handlers in `loadData`, `runAnalysis`, and `fetchTrends`.
2. **Deterministic Spaceflight Fallback:** When the backend API is offline, client-side algorithms compute calibrated physiological telemetry, Isolation Forest scores, and spaceflight alert catalogs.
3. **Seamless State Persistence:** Local updates (e.g. alert triage notes, astronaut baselines, simulator steps) persist reliably in memory and browser local storage.

