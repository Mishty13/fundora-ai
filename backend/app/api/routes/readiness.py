from typing import Annotated

from fastapi import APIRouter, Depends, Response, status

from app.api.dependencies.auth import get_current_user
from app.models.auth import AuthenticatedUser
from app.schemas.readiness import ReadinessAssessmentResponse
from app.services.readiness_service import readiness_service


router = APIRouter(
    prefix="/readiness",
    tags=["Funding Readiness"],
)


@router.post(
    "/assess",
    response_model=ReadinessAssessmentResponse,
    status_code=status.HTTP_201_CREATED,
)
async def create_readiness_assessment(
    current_user: Annotated[
        AuthenticatedUser,
        Depends(get_current_user),
    ],
) -> ReadinessAssessmentResponse:
    assessment = readiness_service.create_assessment(
        founder_id=current_user.id,
    )

    return ReadinessAssessmentResponse.model_validate(
        assessment
    )


@router.get(
    "/latest",
    response_model=ReadinessAssessmentResponse | None,
)
async def get_latest_readiness_assessment(
    current_user: Annotated[
        AuthenticatedUser,
        Depends(get_current_user),
    ],
    response: Response,
) -> ReadinessAssessmentResponse | None:
    assessment = readiness_service.get_latest_assessment(
        founder_id=current_user.id,
    )

    if assessment is None:
        response.status_code = status.HTTP_204_NO_CONTENT
        return None

    return ReadinessAssessmentResponse.model_validate(
        assessment
    )