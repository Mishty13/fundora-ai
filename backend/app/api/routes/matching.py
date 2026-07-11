from typing import Annotated

from fastapi import APIRouter, Depends

from app.api.dependencies.auth import get_current_user
from app.models.auth import AuthenticatedUser
from app.schemas.matching import (
    InvestorMatchResponse,
    MatchGenerationResponse,
    StartupMatchResponse,
)
from app.services.matching_service import matching_service


router = APIRouter(
    prefix="/matching",
    tags=["Matching"],
)


@router.post(
    "/generate",
    response_model=MatchGenerationResponse,
)
def generate_matches(
    current_user: Annotated[
        AuthenticatedUser,
        Depends(get_current_user),
    ],
) -> MatchGenerationResponse:
    result = matching_service.generate_matches(
        user_id=current_user.id,
    )

    return MatchGenerationResponse.model_validate(result)


@router.get(
    "/investor/startups",
    response_model=list[StartupMatchResponse],
)
def get_investor_startup_matches(
    current_user: Annotated[
        AuthenticatedUser,
        Depends(get_current_user),
    ],
) -> list[StartupMatchResponse]:
    matches = matching_service.get_startup_matches(
        user_id=current_user.id,
    )

    return [
        StartupMatchResponse.model_validate(match)
        for match in matches
    ]


@router.get(
    "/founder/investors",
    response_model=list[InvestorMatchResponse],
)
def get_founder_investor_matches(
    current_user: Annotated[
        AuthenticatedUser,
        Depends(get_current_user),
    ],
) -> list[InvestorMatchResponse]:
    matches = (
        matching_service.get_founder_investor_matches(
            founder_id=current_user.id,
        )
    )

    return [
        InvestorMatchResponse.model_validate(match)
        for match in matches
    ]