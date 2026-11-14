# 08 — Technology Stack & Implementation Details

---

## 1. Full-Stack Technology Matrix

AstroCare is engineered with a modern, high-performance technology stack selected for computational speed, type safety, deterministic reproducibility, and low resource overhead.

```
┌────────────────────────────────────────────────────────────────────────┐
│                        ASTROCARE TECHNOLOGY STACK                      │
├───────────────────┬────────────────────────────────────────────────────┤
│ Frontend Core     │ React 19, TypeScript 5.8, Vite 6.4, React Router 7 │
│ Data Visualization│ Recharts 2.15, HTML5 Canvas (Starfield Engine)     │
│ UI & Icons        │ Orbital Glass Design System (CSS3), Lucide React   │
│ Standalone Backend│ Node.js 22 (node:sqlite, node:http, zero deps)     │
│ Python ML Core    │ Python 3.11+, FastAPI 0.115, Scikit-learn 1.5      │
│ Data Science / ML │ Isolation Forest, StandardScaler, NumPy 2.0        │
│ Desktop Shell     │ Electron 34+, Linux .deb, Windows NSIS, macOS .app │
│ Storage & Relational│ SQLite 3 (WAL Mode, Schema DDL & Crew Seeds)     │
│ Tooling & Build   │ Rollup, npm monorepo, oxlint, Git Checkpointing    │
└───────────────────┴────────────────────────────────────────────────────┘
```

---

## 2. Frontend Technologies & Rationale

### React 19 & TypeScript 5.8
- **Why React 19:** Enhanced concurrent rendering, optimized hooks (`useCallback`, `useMemo`), and strict modularity.
- **Why TypeScript 5.8:** Enforces compile-time type safety across all biomedical models (`MetricStats`, `TrendPoint`, `MultiParameterRisk`, `Alert`, `MissionReport`) using `verbatimModuleSyntax`.

### Vite 6.4 & Rollup Chunk Splitting
- Fast Hot Module Replacement (HMR < 250ms).
- Rollup manual chunking isolates heavy vendor dependencies into standalone cached bundles:
  - `vendor-charts` (Recharts, lodash internals): `421 kB`
  - `vendor-icons` (Lucide React icons): `39 kB`
  - Core runtime bundle: `342 kB` (65.9% reduction from monolithic 1+ MB bundle).

### Recharts 2.15 Data Visualizations
- Fully responsive SVGs for telemetry time series, Isolation Forest decision function scatter plots, and anomaly distribution bar charts.
- Hardware-accelerated rendering capable of smoothly displaying hundreds of data points without dropping frames.

### Orbital Glass Design System
- Pure CSS3 custom properties (`--deep-space`, `--electric-cyan`, `--aurora-violet`, `--critical-coral`, `--stellar-white`).
- High-efficiency glassmorphism (`backdrop-filter: blur(12px)`) without external heavy CSS framework overhead.

---

## 3. Backend Technologies & Data Science Stack

### FastAPI & Pydantic v2
- High-throughput asynchronous REST API built on Starlette and OpenAPI standard.
- Pydantic v2 executes microsecond data validation for incoming telemetry packets, catching missing variables or invalid ranges before model ingestion.

### Scikit-Learn Isolation Forest
- Robust implementation of the Liu, Ting, and Zhou (2008) Isolation Forest algorithm.
- Standardized feature scaling using `StandardScaler` to ensure metrics with different physical units (e.g. Heart Rate ~70 bpm vs. Core Temp ~37 °C vs. Radiation ~0.4 mSv) are equally weighted in partition space.

### SQLite Database Architecture
- Zero-configuration, serverless, relational database storing historical sensor readings, generated mission reports, anomaly runs, and alert logs.
- ACID-compliant transactions ensure no telemetry packets are lost during high-frequency simulation steps.

---

## 4. Performance & Reliability Metrics

| Metric | Target | AstroCare Achieved Performance |
| :--- | :--- | :--- |
| **Initial JS Payload** | < 500 kB | **342.64 kB** (Gzip: 111.16 kB) |
| **Page Route Chunk Sizes** | < 50 kB | **2.2 kB – 41.5 kB** |
| **Production Build Time** | < 10.0s | **4.03s** (`tsc -b && vite build`) |
| **HMR Update Latency** | < 500ms | **< 200ms** |
| **Telemetry Polling Cycle**| 20s | **Real-time 20s interval** (with 1s mission clock) |
| **Simulation Step Generation**| < 100ms | **< 30ms** per 30-minute packet |

