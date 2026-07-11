from typing import Any

from fastapi import HTTPException, status

from app.core.supabase import supabase_admin


ROADMAP_METHODOLOGY_VERSION = "1.0.0"


READINESS_DIMENSIONS = {
    "team_score": "Team strength",
    "market_score": "Market opportunity",
    "traction_score": "Traction",
    "business_model_score": "Business model",
    "funding_preparedness_score": "Funding preparedness",
}


def _priority_from_score(score: float) -> str:
    if score < 50:
        return "high"

    if score < 70:
        return "medium"

    return "low"


def _build_readiness_action(
    score_key: str,
    label: str,
    score: float,
) -> dict[str, Any]:
    priority = _priority_from_score(score)

    return {
        "source": "readiness",
        "dimension": score_key.removesuffix("_score"),
        "priority": priority,
        "title": f"Strengthen {label.lower()}",
        "description": (
            f"Your current {label.lower()} score is "
            f"{round(score, 1)}/100, indicating room for "
            "measurable improvement before fundraising."
        ),
        "action": (
            f"Review the evidence supporting {label.lower()}, "
            "identify the weakest measurable gaps, and improve "
            "the underlying startup data before reassessment."
        ),
    }


class RoadmapService:
    @staticmethod
    def _load_startup(
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
                detail="No startup profile was found.",
            )

        return response.data[0]

    @staticmethod
    def _load_latest_readiness(
        founder_id: str,
    ) -> dict[str, Any] | None:
        try:
            response = (
                supabase_admin
                .table("readiness_assessments")
                .select("*")
                .eq("founder_id", founder_id)
                .order("created_at", desc=True)
                .limit(1)
                .execute()
            )
        except Exception as error:
            raise HTTPException(
                status_code=status.HTTP_502_BAD_GATEWAY,
                detail=(
                    "Unable to load the latest readiness "
                    "assessment."
                ),
            ) from error

        return response.data[0] if response.data else None

    @staticmethod
    def _load_latest_completed_pitch(
        founder_id: str,
    ) -> dict[str, Any] | None:
        try:
            response = (
                supabase_admin
                .table("pitch_analyses")
                .select("*")
                .eq("founder_id", founder_id)
                .eq("analysis_status", "completed")
                .order("created_at", desc=True)
                .limit(1)
                .execute()
            )
        except Exception as error:
            raise HTTPException(
                status_code=status.HTTP_502_BAD_GATEWAY,
                detail=(
                    "Unable to load the latest completed "
                    "pitch analysis."
                ),
            ) from error

        return response.data[0] if response.data else None

    @staticmethod
    def generate_roadmap(
        founder_id: str,
    ) -> dict[str, Any]:
        startup = RoadmapService._load_startup(founder_id)

        readiness = RoadmapService._load_latest_readiness(
            founder_id
        )

        pitch = RoadmapService._load_latest_completed_pitch(
            founder_id
        )

        if readiness is None and pitch is None:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=(
                    "Complete a funding readiness assessment "
                    "or pitch analysis before generating a roadmap."
                ),
            )

        actions: list[dict[str, Any]] = []

        if readiness:
            for score_key, label in READINESS_DIMENSIONS.items():
                raw_score = readiness.get(score_key)

                if raw_score is None:
                    continue

                score = float(raw_score)

                if score < 80:
                    actions.append(
                        _build_readiness_action(
                            score_key=score_key,
                            label=label,
                            score=score,
                        )
                    )

        if pitch:
            for recommendation in (
                pitch.get("recommendations") or []
            ):
                if not isinstance(recommendation, dict):
                    continue

                actions.append(
                    {
                        "source": "pitch",
                        "dimension": recommendation.get(
                            "dimension",
                            "pitch",
                        ),
                        "priority": recommendation.get(
                            "priority",
                            "medium",
                        ),
                        "title": recommendation.get(
                            "title",
                            "Improve pitch deck",
                        ),
                        "description": recommendation.get(
                            "description",
                            "A pitch improvement was identified.",
                        ),
                        "action": recommendation.get(
                            "action",
                            "Update the relevant pitch section.",
                        ),
                    }
                )

        priority_order = {
            "high": 0,
            "medium": 1,
            "low": 2,
        }

        actions.sort(
            key=lambda item: priority_order.get(
                item["priority"],
                1,
            )
        )

        if readiness and pitch:
            roadmap_status = "generated"
            overall_summary = (
                "This roadmap combines your latest funding "
                "readiness assessment with validated pitch "
                "intelligence findings."
            )
        else:
            roadmap_status = "partial"
            overall_summary = (
                "This roadmap currently uses the available "
                "startup intelligence. Complete the remaining "
                "analysis modules for a more comprehensive plan."
            )

        source_snapshot = {
            "readiness_overall_score": (
                readiness.get("overall_score")
                if readiness
                else None
            ),
            "pitch_overall_score": (
                pitch.get("overall_score")
                if pitch
                else None
            ),
        }

        payload = {
            "startup_id": startup["id"],
            "founder_id": founder_id,
            "readiness_assessment_id": (
                readiness["id"] if readiness else None
            ),
            "pitch_analysis_id": (
                pitch["id"] if pitch else None
            ),
            "status": roadmap_status,
            "overall_summary": overall_summary,
            "actions": actions,
            "source_snapshot": source_snapshot,
            "methodology_version": (
                ROADMAP_METHODOLOGY_VERSION
            ),
        }

        try:
            response = (
                supabase_admin
                .table("improvement_roadmaps")
                .insert(payload)
                .execute()
            )
        except Exception as error:
            raise HTTPException(
                status_code=status.HTTP_502_BAD_GATEWAY,
                detail="Unable to save the improvement roadmap.",
            ) from error

        if not response.data:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="The generated roadmap could not be returned.",
            )

        return response.data[0]

    @staticmethod
    def get_latest_roadmap(
        founder_id: str,
    ) -> dict[str, Any] | None:
        try:
            response = (
                supabase_admin
                .table("improvement_roadmaps")
                .select("*")
                .eq("founder_id", founder_id)
                .order("created_at", desc=True)
                .limit(1)
                .execute()
            )
        except Exception as error:
            raise HTTPException(
                status_code=status.HTTP_502_BAD_GATEWAY,
                detail="Unable to load the latest roadmap.",
            ) from error

        return response.data[0] if response.data else None


roadmap_service = RoadmapService()