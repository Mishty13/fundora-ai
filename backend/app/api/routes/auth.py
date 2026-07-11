from typing import Annotated

from fastapi import APIRouter, Depends

from app.api.dependencies.auth import get_current_user
from app.models.auth import AuthenticatedUser


router = APIRouter(
    prefix="/auth",
    tags=["Authentication"],
)


@router.get("/me", response_model=AuthenticatedUser)
async def get_authenticated_user(
    current_user: Annotated[
        AuthenticatedUser,
        Depends(get_current_user),
    ],
) -> AuthenticatedUser:
    return current_user