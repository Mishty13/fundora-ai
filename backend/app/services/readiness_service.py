from typing import Any

from fastapi import HTTPException, status

from app.core.supabase import supabase_admin
from app.engines.readiness import calculate_readiness


class ReadinessService:
    @staticmethod
    def _load_founder_startup(
        founder_id: str,
    ) -> dict[str, Any]:
        try:
            response = (
                supabase_admin.table("startups")
                .select("*")
                .eq("founder_id", founder_id)
                .limit(1)
                .execute()
            )
        except Exception as error:
            raise HTTPException(
                status_code=status.HTTP_502_BAD_GATEWAY,
                detail="Unable to load startup data.",
            ) from error

        if not response.data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=(
                    "No startup profile was found for the "
                    "authenticated founder."
                ),
            )

        return response.data[0]

    @staticmethod
    def create_assessment(
        founder_id: str,
    ) -> dict[str, Any]:
        startup = ReadinessService._load_founder_startup(
            founder_id
        )

        result = calculate_readiness(startup)

        assessment_payload = {
            "startup_id": startup["id"],
            "founder_id": founder_id,
            "overall_score": result["overall_score"],
            "business_clarity_score": (
                result["business_clarity_score"]
            ),
            "market_readiness_score": (
                result["market_readiness_score"]
            ),
            "traction_score": result["traction_score"],
            "team_strength_score": (
                result["team_strength_score"]
            ),
            "funding_preparedness_score": (
                result["funding_preparedness_score"]
            ),
            "methodology_version": (
                result["methodology_version"]
            ),
            "input_snapshot": startup,
            "score_breakdown": result["score_breakdown"],
            "recommendations": result["recommendations"],
        }

        try:
            response = (
                supabase_admin.table("readiness_assessments")
                .insert(assessment_payload)
                .execute()
            )
        except Exception as error:
            raise HTTPException(
                status_code=status.HTTP_502_BAD_GATEWAY,
                detail="Unable to save readiness assessment.",
            ) from error

        if not response.data:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=(
                    "The readiness assessment was calculated "
                    "but could not be returned after saving."
                ),
            )

        return response.data[0]

    @staticmethod
    def get_latest_assessment(
        founder_id: str,
    ) -> dict[str, Any] | None:
        try:
            response = (
                supabase_admin.table("readiness_assessments")
                .select("*")
                .eq("founder_id", founder_id)
                .order("created_at", desc=True)
                .limit(1)
                .execute()
            )
        except Exception as error:
            raise HTTPException(
                status_code=status.HTTP_502_BAD_GATEWAY,
                detail="Unable to load the latest readiness assessment.",
            ) from error

        if not response.data:
            return None

        return response.data[0]


readiness_service = ReadinessService()