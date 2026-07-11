from typing import Annotated

from fastapi import APIRouter, Depends, File, UploadFile, status

from app.api.dependencies.auth import get_current_user
from app.models.auth import AuthenticatedUser
from app.schemas.pitch import PitchAnalysisResponse
from app.services.pitch_service import pitch_service


router = APIRouter(
    prefix="/pitch",
    tags=["Pitch Intelligence"],
)


@router.get(
    "/latest",
    response_model=PitchAnalysisResponse | None,
)
def get_latest_pitch_analysis(
    current_user: Annotated[
        AuthenticatedUser,
        Depends(get_current_user),
    ],
) -> PitchAnalysisResponse | None:
    analysis = pitch_service.get_latest_analysis(
        founder_id=current_user.id,
    )

    if analysis is None:
        return None

    return PitchAnalysisResponse.model_validate(analysis)


@router.post(
    "/upload",
    response_model=PitchAnalysisResponse,
    status_code=status.HTTP_201_CREATED,
)
async def upload_pitch_deck(
    current_user: Annotated[
        AuthenticatedUser,
        Depends(get_current_user),
    ],
    file: Annotated[
        UploadFile,
        File(description="PDF or PPTX pitch deck"),
    ],
) -> PitchAnalysisResponse:
    analysis = await pitch_service.create_upload(
        founder_id=current_user.id,
        file=file,
    )

    return PitchAnalysisResponse.model_validate(analysis)