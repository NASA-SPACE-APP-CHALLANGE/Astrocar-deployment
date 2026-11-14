"""AstroCare application configuration."""
import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent.parent

class Settings:
    APP_NAME: str = "AstroCare"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = True
    
    # CORS
    CORS_ORIGINS: list = [
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
    ]
    
    # Database
    DATABASE_PATH: Path = BASE_DIR / "data" / "astrocare.db"
    
    # Dataset
    DATASETS_DIR: Path = BASE_DIR.parent / "datasets"
    SIMULATED_DATA_PATH: Path = BASE_DIR.parent / "datasets" / "simulated_telemetry.csv"
    
    # Upload limits
    MAX_UPLOAD_SIZE_MB: int = 10
    
    # ML
    ANOMALY_CONTAMINATION: float = 0.05
    RANDOM_SEED: int = 42
    
    # Auth
    SECRET_KEY: str = os.getenv("SECRET_KEY", "astrovital-ai-space-secret-key-2025")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24 hours



settings = Settings()
