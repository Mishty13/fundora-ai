from typing import Annotated, Any

from fastapi import APIRouter, Depends, HTTPException, status

from app.api.dependencies.auth import get_current_user
from app.core.supabase import supabase_admin
from app.models.auth import AuthenticatedUser
from app.services.investment_brief_service import (
    InvestmentBriefServiceError,
    investment_brief_service,
)


router = APIRouter(
    prefix="/investment-brief",
    tags=["AI Investment Brief"],
)


def _load_authorized_match(
    match_id: str,
    investor_user_id: str,
) -> tuple[dict[str, Any], dict[str, Any]]:
    try:
        response = (
            supabase_admin
            .table("investor_startup_matches")
            .select("*, startups(*)")
            .eq("id", match_id)
            .eq("investor_user_id", investor_user_id)
            .limit(1)
            .execute()
        )
    except Exception as error:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="Unable to load the startup match.",
        ) from error

    if not response.data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=(
                "Startup match not found or you do not have "
                "permission to access it."
            ),
        )

    match = response.data[0]
    startup = match.get("startups") or {}

    if not startup:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="The startup for this match could not be found.",
        )

    return match, startup


@router.post("/{match_id}/generate")
async def generate_investment_brief(
    match_id: str,
    current_user: Annotated[
        AuthenticatedUser,
        Depends(get_current_user),
    ],
) -> dict[str, Any]:
    match, startup = _load_authorized_match(
        match_id=match_id,
        investor_user_id=current_user.id,
    )

    match_context = {
        "overall_score": match.get("overall_score"),
        "dimension_scores": match.get("dimension_scores"),
        "match_reasons": match.get("match_reasons"),
        "eligibility_status": match.get(
            "eligibility_status"
        ),
        "methodology_version": match.get(
            "methodology_version"
        ),
    }

    try:
        brief = (
            await investment_brief_service
            .generate_investment_brief(
                startup=startup,
                match_data=match_context,
            )
        )
    except InvestmentBriefServiceError as error:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=str(error),
        ) from error

    return {
        "status": "success",
        "advisor": "Fundora AI Investment Analyst",
        "match_id": match_id,
        "startup_id": startup.get("id"),
        "startup_name": startup.get("name"),
        "brief": brief,
    }
