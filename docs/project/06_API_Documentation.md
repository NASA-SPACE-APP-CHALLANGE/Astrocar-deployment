# 06 — REST API Documentation & Endpoints

---

## 1. API Architecture Overview

The AstroCare backend exposes an asynchronous RESTful HTTP API built with **FastAPI**. All endpoints accept and return `application/json` (except CSV export and upload streams) and adhere to standard HTTP status codes.

- **Base Prefix:** `/api`
- **Interactive Documentation:** `/api/docs` (Swagger UI) / `/api/redoc` (ReDoc)

---

## 2. Comprehensive Endpoint Catalog

### System & Health Endpoints

#### `GET /api/health`
Returns system operational health, connected database status, and total recorded readings.
- **Response `200 OK`:**
```json
{
  "status": "healthy",
  "app": "AstroCare Spaceflight Health Core",
  "version": "2.4.0",
  "database": "sqlite:///./data/astrocare.db",
  "total_readings": 500
}
```

---

### Astronaut & Profile Endpoints

#### `GET /api/astronauts`
Retrieves a list of all assigned expedition astronauts and baselines.
- **Response `200 OK`:**
```json
{
  "total": 3,
  "astronauts": [
    {
      "astronaut_id": "ASTRO-01",
      "name": "CDR Alex Vance",
      "role": "Mission Commander",
      "mission_id": "ARTEMIS-VII",
      "current_mission_day": 142,
      "baseline_heart_rate": 62.0,
      "baseline_spo2": 98.2,
      "current_cumulative_radiation_msv": 42.6
    }
  ]
}
```

#### `PUT /api/astronauts/{astronaut_id}`
Updates an astronaut's resting baseline parameters.
- **Request Body:** Partial JSON of astronaut baseline fields.
- **Response `200 OK`:** Updated `Astronaut` object.

---

### Telemetry & Metrics Endpoints

#### `GET /api/metrics?astronaut_id={id}`
Returns the latest instantaneous readings, running statistical sparklines, and status badges across all 7 physiological vitals.
- **Response `200 OK`:** Array of `MetricStats` objects.

#### `GET /api/health-readings?page=1&page_size=20&search={query}&order=desc`
Returns paginated historical sensor records supporting search queries.
- **Response `200 OK`:**
```json
{
  "total": 500,
  "page": 1,
  "page_size": 20,
  "readings": [ ... ]
}
```

#### `GET /api/health-trends?range={24h|7d|30d|all}&astronaut_id={id}`
Returns downsampled multi-temporal time-series points with anomaly flags and clinical summary insights.

#### `GET /api/readings/timeseries?metric={key}&limit=200`
Returns raw timestamp-value pairs for targeted charting visualizers.

---

### AI Anomaly Detection Endpoints

#### `POST /api/analyze?contamination=0.05&limit=500`
Executes the unsupervised Isolation Forest model across the last $N$ telemetry records.
- **Query Parameters:**
  - `contamination` (float, default: `0.05`): Expected proportion of outliers.
  - `limit` (integer, default: `500`): Historical record window.
- **Response `200 OK`:**
```json
{
  "run_id": "RUN-9102",
  "method": "IsolationForest",
  "records_analyzed": 500,
  "anomalies_found": 25,
  "anomaly_rate": 0.05,
  "model_status": "success",
  "message": "Isolation Forest executed successfully across 500 multivariate telemetry records.",
  "anomalies": [ ... ]
}
```

#### `GET /api/anomalies?only_flagged=true&limit=100`
Retrieves stored historical anomaly detection logs.

---

### Alert Center Endpoints

#### `GET /api/alerts?severity={sev}&alert_type={type}&review_status={status}&limit=100`
Retrieves system alerts filtered by severity, alert type, and review status.

#### `PATCH /api/alerts/{alert_id}`
Updates an alert's acknowledgment status, reviewer notes, or triage review status.
- **Request Body:**
```json
{
  "acknowledged": true,
  "reviewer_notes": "Supplemental O2 administered. SpO2 stabilized to 98%.",
  "review_status": "reviewed"
}
```

#### `PATCH /api/alerts/{alert_id}/acknowledge`
1-click acknowledgment shortcut endpoint.

---

### Mission Reporting & Simulation Endpoints

#### `POST /api/reports/generate`
Generates a formal mission medical report with statistical distributions and narrative evaluation.

#### `GET /api/reports`
Lists all generated expedition health evaluation reports.

#### `POST /api/simulator/step`
Injects a single 30-minute operational telemetry packet under a specified scenario (`normal`, `tachycardia`, `hypoxia`, `hypothermia`, `extreme_radiation`, `hypertension`).

#### `POST /api/simulator/reset`
Restores the database to a clean, calibrated 500-record baseline.

#### `POST /api/readings/import`
Accepts `multipart/form-data` CSV uploads, executes schema validation, and ingests verified telemetry into the database.

