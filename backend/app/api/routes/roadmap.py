from typing import Annotated

from fastapi import APIRouter, Depends, status

from app.api.dependencies.auth import get_current_user
from app.models.auth import AuthenticatedUser
from app.schemas.roadmap import RoadmapResponse
from app.services.roadmap_service import roadmap_service


router = APIRouter(
    prefix="/roadmap",
    tags=["Improvement Roadmap"],
)


@router.get(
    "/latest",
    response_model=RoadmapResponse | None,
)
def get_latest_roadmap(
    current_user: Annotated[
        AuthenticatedUser,
        Depends(get_current_user),
    ],
) -> RoadmapResponse | None:
    roadmap = roadmap_service.get_latest_roadmap(
        founder_id=current_user.id,
    )

    if roadmap is None:
        return None

    return RoadmapResponse.model_validate(roadmap)


@router.post(
    "/generate",
    response_model=RoadmapResponse,
    status_code=status.HTTP_201_CREATED,
)
def generate_roadmap(
    current_user: Annotated[
        AuthenticatedUser,
        Depends(get_current_user),
    ],
) -> RoadmapResponse:
    roadmap = roadmap_service.generate_roadmap(
        founder_id=current_user.id,
    )

    return RoadmapResponse.model_validate(roadmap)