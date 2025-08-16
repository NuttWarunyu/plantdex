from fastapi import APIRouter
from app.api.v1.endpoints import plants, market, auth, sell_to_us
from app.api.v1 import admin
from app.api.v1 import shopee
from app.api.v1 import market_intelligence
from app.api.v1 import instantbuy

api_router = APIRouter()

# Include all endpoint routers
api_router.include_router(auth.router, prefix="/auth", tags=["authentication"])
api_router.include_router(plants.router, prefix="/plants", tags=["plants"])
api_router.include_router(market.router, prefix="/market", tags=["market intelligence"])
api_router.include_router(sell_to_us.router, prefix="/sell-to-us", tags=["sell to us"])
api_router.include_router(admin.router, prefix="/admin", tags=["admin"])
api_router.include_router(shopee.router, prefix="/shopee", tags=["shopee data"])
api_router.include_router(market_intelligence.router, prefix="/market-intelligence", tags=["market intelligence"])
api_router.include_router(instantbuy.router, prefix="/instantbuy", tags=["instantbuy service"]) 