from pydantic_settings import BaseSettings
from typing import Optional, List
import os

class Settings(BaseSettings):
    # Application
    APP_NAME: str = "PlantDex"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = True
    ENVIRONMENT: str = "development"
    
    # Database
    DATABASE_URL: Optional[str] = None  # จะถูก set จาก environment
    
    # Redis (สำหรับ caching)
    REDIS_URL: Optional[str] = None
    
    # Security
    SECRET_KEY: str = "your-secret-key-here"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # API
    API_V1_STR: str = "/api/v1"
    
    # CORS
    BACKEND_CORS_ORIGINS: List[str] = [
        "http://localhost:3000", 
        "http://localhost:8000",
        "https://plantdex-frontend-mapoh682q-nuttwarunyus-projects.vercel.app",
        "https://plantdex-frontend-git-main-nuttwarunyus-projects.vercel.app",
        "https://plantdex-frontend-chbf9j6n4-nuttwarunyus-projects.vercel.app"
    ]
    
    # Production settings
    @property
    def is_production(self) -> bool:
        return self.ENVIRONMENT.lower() == "production"
    
    @property
    def is_development(self) -> bool:
        return self.ENVIRONMENT.lower() == "development"
    
    class Config:
        env_file = ".env"

settings = Settings() 