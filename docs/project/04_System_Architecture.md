# 04 — Detailed System Architecture & Component Interactions

---

## 1. Architectural Style & Paradigms

AstroCare implements an event-driven, decoupled client-server architecture designed for high-availability aerospace telemetry monitoring.

```mermaid
graph LR
    subgraph Client Application (Browser / Spacecraft Display)
        UI[React 19 View Layer]
        ROUTER[React Router DOM v7]
        STATE[AuthContext & Custom Hooks]
        RES_ENGINE[Client-Side Resilience & Sim Engine]
        UI <--> ROUTER
        UI <--> STATE
        STATE <--> RES_ENGINE
    end

    subgraph Transport Layer
        HTTP[Vite Reverse Proxy / REST HTTP JSON]
    end

    subgraph Server Subsystem (FastAPI / Linux Core)
        API[FastAPI Routers]
        SVC[Business Service Layer]
        ML_PIPE[Scikit-learn Anomaly Detector]
        ORM[SQLAlchemy Session Engine]
        DB[(SQLite Relational Database)]
        
        API --> SVC
        SVC --> ML_PIPE
        SVC --> ORM
        ORM --> DB
    end

    RES_ENGINE <--> HTTP
    HTTP <--> API
```

---

## 2. Component Structure Breakdown

### Frontend Component Directory (`frontend/src/`)
```
frontend/src/
├── assets/                  # Static aerospace emblems and logo assets
├── components/              # Reusable presentation and layout components
│   ├── ErrorBoundary.tsx    # Subsystem isolation boundary catching rendering errors
│   ├── Navbar.tsx           # Global top navigation bar with active cyan indicators
│   ├── Footer.tsx           # NASA Space Apps Challenge research disclaimer
│   ├── MetricCard.tsx       # Live sparkline telemetry card for 7 physiological vitals
│   ├── Logo.tsx             # Vector orbital AstroCare emblem
│   └── StarfieldBackground.tsx # HTML5 canvas hardware-accelerated animated starfield
├── context/
│   ├── auth-types.ts        # User, Astronaut, and Auth context TypeScript contracts
│   └── AuthContext.tsx      # Memoized authentication and astronaut profile provider
├── hooks/
│   └── useAuth.ts           # Decoupled custom hook for consuming auth context
├── layouts/
│   └── DashboardLayout.tsx  # Unified layout wrapper (Navbar + container + Footer)
├── pages/                   # 15 dynamically code-split route views
│   ├── LandingPage.tsx      # Public mission presentation landing page
│   ├── DashboardOverview.tsx# Live monitoring console & environmental telemetry
│   ├── HealthAnalyticsPage.tsx # Multi-temporal trend analysis & baseline overlays
│   ├── AIInsightsPage.tsx   # Isolation Forest anomaly scoring & Risk Assessment Engine
│   ├── AlertCenterPage.tsx  # Clinical alert triage, filtering, and acknowledgment
│   ├── AstronautProfilePage.tsx # Astronaut pre-flight baseline parameter editor
│   ├── MissionReportsPage.tsx   # Clinical report generator and print preview
│   ├── DataSimulatorPage.tsx    # Controlled scenario injector and auto-streamer
│   ├── MissionDataPage.tsx  # Tabular sensor readings archive and CSV exporter
│   ├── DataImportPage.tsx   # Drag-and-drop CSV validation and uploader
│   ├── DatasetInfoPage.tsx  # Data dictionary and variable registry
│   ├── MissionTimelinePage.tsx  # Chronological milestone event tracker
│   ├── ResearchHubPage.tsx  # NASA HRP and CSA official scientific research portal
│   ├── AboutPage.tsx        # Project story, technology stack, and architecture
│   ├── SettingsPage.tsx     # Local preferences and contamination rate configurations
│   ├── LoginPage.tsx        # Role-based credential switcher (Flight Surgeon vs Crew)
│   └── NotFoundPage.tsx     # 404 orbital deep-space fallback view
├── services/
│   ├── api.ts               # Centralized REST HTTP API service layer
│   └── riskAssessmentService.ts # Multi-parameter risk correlation & countermeasure engine
├── types/
│   └── index.ts             # Global TypeScript domain data contracts
├── index.css                # Orbital Glass design tokens and keyframe animations
└── main.tsx                 # Application mount entrypoint
```

---

## 3. Data Flow Pathways

### Pathway A: Live Telemetry Polling & Auto-Refresh
1. `DashboardOverview.tsx` registers a 20-second polling interval using `useCallback`.
2. Telemetry request invokes `api.metrics(activeAstronautId)`.
3. If the backend is active, FastAPI queries SQLite for the latest observations and computes running statistical sparklines.
4. If the backend is unreachable, the client resilience layer returns calibrated spaceflight baseline telemetry.
5. React updates the 7 `MetricCard` components and the Spacecraft Environmental Strip.

### Pathway B: Machine Learning Anomaly Detection Execution
1. In `AIInsightsPage.tsx`, the operator selects a contamination factor (e.g. 5%) and clicks "RUN ISOLATION FOREST".
2. The request triggers `api.runAnomalyAnalysis(contamination, 500)`.
3. In the backend, `anomaly_service.py` fetches the last 500 records, scales features with `StandardScaler`, and trains an `IsolationForest(n_estimators=100)`.
4. Observations yielding decision function scores $< 0$ are flagged as anomalies, attributed to deviating metrics, and recorded in the database.
5. The frontend displays the decision function scatter plot, metric distribution bar chart, and flagged observations log.

### Pathway C: Multi-Parameter Risk Correlation & Countermeasure Dispatch
1. The **Risk Assessment Engine** (`riskAssessmentService.ts`) inspects concurrent telemetry variables.
2. Cross-correlations are evaluated (e.g. Heart Rate $> 100$ + SpO2 $< 93\%$ -> Acute Hypoxic Cardiovascular Strain).
3. The assessment matches official NASA HRP pathophysiological evidence and outputs three-tiered countermeasure protocols.
4. Clinicians review or update the review state (`Pending Triage` -> `Flight Surgeon Reviewed` -> `Countermeasure Deployed` -> `Mitigated`).

