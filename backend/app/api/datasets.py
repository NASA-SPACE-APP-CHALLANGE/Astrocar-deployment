"""Dataset information endpoint."""
from fastapi import APIRouter
from app.schemas.schemas import DatasetInfo
from app.services.data_service import get_dataset_info

router = APIRouter()

@router.get("/datasets/info", response_model=DatasetInfo)
def dataset_info():
    return get_dataset_info()
