from fastapi import APIRouter
from app.api.v1.endpoints import plants, market, auth

api_router = APIRouter()

# Include all endpoint routers
api_router.include_router(auth.router, prefix="/auth", tags=["authentication"])
api_router.include_router(plants.router, prefix="/plants", tags=["plants"])
api_router.include_router(market.router, prefix="/market", tags=["market intelligence"]) 