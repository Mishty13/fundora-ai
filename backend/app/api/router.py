from fastapi import APIRouter

from app.api.routes.auth import router as auth_router
from app.api.routes.health import router as health_router
from app.api.routes.pitch import router as pitch_router
from app.api.routes.readiness import router as readiness_router
from app.api.routes.roadmap import router as roadmap_router
from app.api.routes.investor import router as investor_router
from app.api.routes.matching import router as matching_router

from app.api.routes.ai_advisor import router as ai_advisor_router
from app.api.routes.investment_brief import (
    router as investment_brief_router,
)
api_router = APIRouter()

api_router.include_router(health_router)
api_router.include_router(auth_router)
api_router.include_router(readiness_router)
api_router.include_router(pitch_router)
api_router.include_router(roadmap_router)
api_router.include_router(investor_router)
api_router.include_router(matching_router)


api_router.include_router(ai_advisor_router)
api_router.include_router(investment_brief_router)