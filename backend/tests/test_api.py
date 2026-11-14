"""Automated tests for AstroVital / AstroCare backend API."""
import pytest
from fastapi.testclient import TestClient
from main import app
from app.core.database import init_db

client = TestClient(app)


@pytest.fixture(scope="session", autouse=True)
def setup_test_db():
    init_db()


def test_health_check():
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
    assert "total_readings" in data


def test_astronauts_list_and_get():
    # List astronauts
    res = client.get("/api/astronauts")
    assert res.status_code == 200
    data = res.json()
    assert data["total"] >= 1
    assert any(a["astronaut_id"] == "ASTRO-01" for a in data["astronauts"])

    # Get single astronaut
    res_single = client.get("/api/astronauts/ASTRO-01")
    assert res_single.status_code == 200
    astro = res_single.json()
    assert astro["astronaut_id"] == "ASTRO-01"
    assert "baseline_heart_rate" in astro


def test_astronaut_update():
    update_payload = {"baseline_heart_rate": 63.5}
    res = client.put("/api/astronauts/ASTRO-01", json=update_payload)
    assert res.status_code == 200
    data = res.json()
    assert data["baseline_heart_rate"] == 63.5


def test_readings_endpoints():
    # Test /api/health-readings
    res = client.get("/api/health-readings?page=1&page_size=10")
    assert res.status_code == 200
    data = res.json()
    assert "readings" in data
    assert data["total"] >= 0

    # Test /api/readings
    res2 = client.get("/api/readings?page=1&page_size=5")
    assert res2.status_code == 200


def test_health_trends():
    res = client.get("/api/health-trends?range=24h&astronaut_id=ASTRO-01")
    assert res.status_code == 200
    data = res.json()
    assert "points" in data
    assert "summary_insights" in data
    assert data["range_selected"] == "24h"


def test_anomaly_analysis():
    res = client.post("/api/analyze?contamination=0.05&limit=100")
    assert res.status_code == 200
    data = res.json()
    assert data["method"] == "IsolationForest"
    assert "anomalies_found" in data
    assert "anomaly_rate" in data


def test_alerts_and_patch():
    # List alerts
    res = client.get("/api/alerts?limit=10")
    assert res.status_code == 200
    data = res.json()
    assert "alerts" in data

    if data["total"] > 0:
        alert_id = data["alerts"][0]["alert_id"]
        patch_res = client.patch(
            f"/api/alerts/{alert_id}",
            json={"review_status": "reviewed", "reviewer_notes": "Checked sensor and nominal status confirmed."},
        )
        assert patch_res.status_code == 200
        patched = patch_res.json()
        assert patched["review_status"] == "reviewed"


def test_simulator_status_and_step():
    # Status
    res = client.get("/api/simulator/status")
    assert res.status_code == 200
    data = res.json()
    assert data["is_active"] is True
    assert "available_scenarios" in data

    # Step simulation
    step_res = client.post("/api/simulator/step", json={"scenario": "normal", "astronaut_id": "ASTRO-01"})
    assert step_res.status_code == 200
    step_data = step_res.json()
    assert step_data["source"] == "simulated"
    assert "heart_rate" in step_data


def test_report_generation_and_csv_export():
    # Generate report
    res = client.post(
        "/api/reports/generate",
        json={"astronaut_id": "ASTRO-01", "title": "Test Mission Evaluation"},
    )
    assert res.status_code == 200
    report = res.json()
    assert "report_id" in report
    report_id = report["report_id"]

    # Export CSV
    csv_res = client.get(f"/api/reports/{report_id}/export/csv")
    assert csv_res.status_code == 200
    assert "text/csv" in csv_res.headers["content-type"]
    assert "heart_rate" in csv_res.text


def test_auth_login():
    res = client.post(
        "/api/auth/login",
        json={"username": "astronaut", "password": "astro2025"},
    )
    assert res.status_code == 200
    data = res.json()
    assert "access_token" in data
    assert data["user"]["role"] == "astronaut"

    res_surgeon = client.post(
        "/api/auth/login",
        json={"username": "surgeon", "password": "medical2025"},
    )
    assert res_surgeon.status_code == 200
    assert res_surgeon.json()["user"]["role"] == "medical_team"
