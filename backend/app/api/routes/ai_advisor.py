from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status

from app.api.dependencies.auth import get_current_user
from app.models.auth import AuthenticatedUser
from app.services.ai_advisor_service import (
    AIAdvisorServiceError,
    ai_advisor_service,
)
from app.services.pitch_service import pitch_service
from app.services.readiness_service import readiness_service
from app.services.roadmap_service import roadmap_service


router = APIRouter(
    prefix="/ai-advisor",
    tags=["AI Funding Advisor"],
)


@router.post("/generate")
async def generate_ai_advice(
    current_user: Annotated[
        AuthenticatedUser,
        Depends(get_current_user),
    ],
) -> dict:
    try:
        startup = readiness_service._load_founder_startup(
            founder_id=current_user.id,
        )

        readiness = readiness_service.get_latest_assessment(
            founder_id=current_user.id,
        )

        pitch = pitch_service.get_latest_analysis(
            founder_id=current_user.id,
        )

        roadmap = roadmap_service.get_latest_roadmap(
            founder_id=current_user.id,
        )

        advice = await ai_advisor_service.generate_founder_advice(
            startup=startup,
            readiness=readiness,
            pitch=pitch,
            roadmap=roadmap,
        )

        return {
            "status": "success",
            "advisor": "Fundora AI Funding Advisor",
            "advice": advice,
        }

    except AIAdvisorServiceError as error:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=str(error),
        ) from error