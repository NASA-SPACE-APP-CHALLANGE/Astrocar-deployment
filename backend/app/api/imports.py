"""CSV import endpoint."""
import io
import uuid
from fastapi import APIRouter, UploadFile, File, HTTPException
from app.schemas.schemas import ImportSummary
from app.services.import_service import process_csv_upload

router = APIRouter()

MAX_SIZE = 10 * 1024 * 1024  # 10 MB

@router.post("/readings/import", response_model=ImportSummary)
async def import_csv(file: UploadFile = File(...)):
    if not file.filename or not file.filename.lower().endswith(".csv"):
        raise HTTPException(status_code=400, detail="Only CSV files are accepted.")
    
    content = await file.read()
    if len(content) > MAX_SIZE:
        raise HTTPException(status_code=413, detail="File exceeds 10 MB limit.")
    
    return process_csv_upload(io.StringIO(content.decode("utf-8", errors="replace")), file.filename)
