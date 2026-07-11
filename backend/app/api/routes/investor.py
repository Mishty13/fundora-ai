from typing import Annotated

from fastapi import APIRouter, Depends, status

from app.api.dependencies.auth import get_current_user
from app.models.auth import AuthenticatedUser
from app.schemas.investor import (
    InvestorProfileResponse,
    InvestorProfileUpsert,
)
from app.services.investor_service import investor_service


router = APIRouter(
    prefix="/investor",
    tags=["Investor"],
)


@router.get(
    "/profile",
    response_model=InvestorProfileResponse | None,
)
def get_investor_profile(
    current_user: Annotated[
        AuthenticatedUser,
        Depends(get_current_user),
    ],
) -> InvestorProfileResponse | None:
    profile = investor_service.get_profile(
        user_id=current_user.id,
    )

    if profile is None:
        return None

    return InvestorProfileResponse.model_validate(profile)


@router.put(
    "/profile",
    response_model=InvestorProfileResponse,
    status_code=status.HTTP_200_OK,
)
def save_investor_profile(
    profile_data: InvestorProfileUpsert,
    current_user: Annotated[
        AuthenticatedUser,
        Depends(get_current_user),
    ],
) -> InvestorProfileResponse:
    profile = investor_service.upsert_profile(
        user_id=current_user.id,
        profile_data=profile_data,
    )

    return InvestorProfileResponse.model_validate(profile)