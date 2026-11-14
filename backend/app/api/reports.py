"""Mission health reports generation and export endpoints."""
from fastapi import APIRouter, HTTPException, Response
from typing import List
from app.schemas.schemas import ReportGenerateRequest, ReportOut, ReportListResponse
from app.services.report_service import generate_mission_report, list_reports, generate_report_csv
from app.core.database import get_connection
import json

router = APIRouter()


@router.post("/reports/generate", response_model=ReportOut)
def generate_report(payload: ReportGenerateRequest):
    return generate_mission_report(
        astronaut_id=payload.astronaut_id,
        start_date=payload.start_date,
        end_date=payload.end_date,
        title=payload.title,
    )


@router.get("/reports", response_model=ReportListResponse)
def get_reports(limit: int = 50):
    reports = list_reports(limit=limit)
    return ReportListResponse(total=len(reports), reports=reports)


@router.get("/reports/{report_id}", response_model=ReportOut)
def get_single_report(report_id: str):
    conn = get_connection()
    r = conn.execute("SELECT * FROM reports WHERE report_id = ?", (report_id,)).fetchone()
    conn.close()

    if not r:
        raise HTTPException(status_code=404, detail="Report not found")

    return ReportOut(
        report_id=r["report_id"],
        astronaut_id=r["astronaut_id"],
        title=r["title"],
        date_range_start=r["date_range_start"],
        date_range_end=r["date_range_end"],
        generated_at=r["generated_at"],
        summary_text=r["summary_text"],
        stats=json.loads(r["stats_json"] or "{}"),
        alerts_summary=json.loads(r["alerts_summary_json"] or "{}"),
        recommendations=json.loads(r["recommendations_json"] or "[]"),
        created_at=r["created_at"],
    )


@router.get("/reports/{report_id}/export/csv")
def export_csv(report_id: str):
    csv_content = generate_report_csv(report_id)
    if not csv_content:
        raise HTTPException(status_code=404, detail="Report not found")

    return Response(
        content=csv_content,
        media_type="text/csv",
        headers={"Content-Disposition": f'attachment; filename="{report_id}_health_report.csv"'},
    )
