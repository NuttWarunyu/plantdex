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
    
    # CORS - handled manually via cors_origins property
    # No Pydantic field for BACKEND_CORS_ORIGINS to avoid parsing errors

    @property
    def cors_origins(self) -> List[str]:
        """Parse CORS origins from environment variable or use default"""
        if hasattr(self, '_cors_origins'):
            return self._cors_origins
        
        # Get from environment variable directly (not through Pydantic)
        cors_env = os.getenv("BACKEND_CORS_ORIGINS")
        print(f"DEBUG: BACKEND_CORS_ORIGINS env var: {repr(cors_env)}")
        
        if cors_env and cors_env.strip():
            try:
                # Handle comma-separated string
                if "," in cors_env:
                    origins = [origin.strip() for origin in cors_env.split(",") if origin.strip()]
                else:
                    # Single origin
                    origins = [cors_env.strip()] if cors_env.strip() else []
                
                print(f"DEBUG: Parsed origins: {origins}")
                
                # Validate origins are not empty
                if origins:
                    self._cors_origins = origins
                    print(f"DEBUG: Using parsed origins: {origins}")
                    return origins
            except Exception as e:
                print(f"Warning: Failed to parse BACKEND_CORS_ORIGINS: {e}")
                print(f"Using default CORS origins")
        
        # Fallback to default hardcoded origins
        default_origins = [
            "http://localhost:3000", 
            "http://localhost:8000",
            "https://plantdex-frontend.vercel.app",
            "https://plantdex-frontend-git-main-nuttwarunyus-projects.vercel.app",
            "https://plantdex-frontend-mapoh682q-nuttwarunyus-projects.vercel.app"
        ]
        self._cors_origins = default_origins
        print(f"DEBUG: Using default origins: {self._cors_origins}")
        return self._cors_origins
    
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