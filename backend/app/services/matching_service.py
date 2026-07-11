from typing import Any

from fastapi import HTTPException, status

from app.core.supabase import supabase_admin


MATCHING_METHODOLOGY_VERSION = "1.0.0"

MATCHING_WEIGHTS = {
    "sector": 0.25,
    "stage": 0.20,
    "geography": 0.15,
    "cheque": 0.15,
    "readiness": 0.15,
    "revenue": 0.05,
    "traction": 0.05,
}


REGIONAL_GEOGRAPHIES = {
    "south asia": {
        "india",
        "pakistan",
        "bangladesh",
        "sri lanka",
        "nepal",
        "bhutan",
        "maldives",
    },
    "southeast asia": {
        "singapore",
        "indonesia",
        "malaysia",
        "thailand",
        "vietnam",
        "philippines",
        "brunei",
        "cambodia",
        "laos",
        "myanmar",
        "timor-leste",
    },
    "europe": {
        "united kingdom",
        "france",
        "germany",
        "italy",
        "spain",
        "netherlands",
        "belgium",
        "sweden",
        "norway",
        "denmark",
        "finland",
        "ireland",
        "portugal",
        "austria",
        "switzerland",
        "poland",
        "czech republic",
        "greece",
        "romania",
    },
    "middle east": {
        "united arab emirates",
        "saudi arabia",
        "qatar",
        "bahrain",
        "kuwait",
        "oman",
        "jordan",
        "israel",
        "lebanon",
    },
}


def _normalize(value: Any) -> str:
    if value is None:
        return ""

    return " ".join(
        str(value)
        .strip()
        .lower()
        .replace("&", "and")
        .replace("_", " ")
        .replace("-", " ")
        .split()
    )


def _normalized_set(values: list[Any] | None) -> set[str]:
    return {
        normalized
        for value in (values or [])
        if (normalized := _normalize(value))
    }


def _reason_status(score: float) -> str:
    if score >= 75:
        return "strong"

    if score >= 50:
        return "moderate"

    return "weak"


def _calculate_sector_score(
    investor: dict[str, Any],
    startup: dict[str, Any],
) -> tuple[float, str]:
    preferred = _normalized_set(
        investor.get("preferred_sectors")
    )

    startup_values = {
        _normalize(startup.get("industry")),
        _normalize(startup.get("sub_industry")),
    }
    startup_values.discard("")

    if preferred.intersection(startup_values):
        return (
            100.0,
            "The startup's sector directly matches your "
            "preferred investment sectors.",
        )

    for preference in preferred:
        for startup_value in startup_values:
            if (
                preference in startup_value
                or startup_value in preference
            ):
                return (
                    75.0,
                    "The startup's sector is closely aligned "
                    "with one of your preferred sectors.",
                )

    return (
        0.0,
        "The startup's sector does not currently match your "
        "selected sector preferences.",
    )


def _calculate_stage_score(
    investor: dict[str, Any],
    startup: dict[str, Any],
) -> tuple[float, str]:
    preferred = _normalized_set(
        investor.get("preferred_stages")
    )
    startup_stage = _normalize(startup.get("stage"))

    if startup_stage in preferred:
        return (
            100.0,
            "The startup's funding stage directly matches "
            "your preferred stages.",
        )

    return (
        0.0,
        "The startup's funding stage is outside your selected "
        "stage preferences.",
    )


def _calculate_geography_score(
    investor: dict[str, Any],
    startup: dict[str, Any],
) -> tuple[float, str]:
    preferred = _normalized_set(
        investor.get("preferred_geographies")
    )
    startup_country = _normalize(
        startup.get("headquarters_country")
    )

    if "global" in preferred:
        return (
            100.0,
            "Your global investment preference includes the "
            "startup's headquarters location.",
        )

    if startup_country in preferred:
        return (
            100.0,
            "The startup's headquarters country directly "
            "matches your geographic preferences.",
        )

    for geography in preferred:
        countries = REGIONAL_GEOGRAPHIES.get(geography)

        if countries and startup_country in countries:
            return (
                85.0,
                "The startup is headquartered within one of "
                "your preferred investment regions.",
            )

    return (
        0.0,
        "The startup's headquarters location is outside your "
        "selected geographic preferences.",
    )


def _calculate_cheque_score(
    investor: dict[str, Any],
    startup: dict[str, Any],
) -> tuple[float, str]:
    investor_minimum = investor.get("minimum_cheque_size")
    investor_maximum = investor.get("maximum_cheque_size")

    startup_minimum = startup.get("minimum_investment_usd")
    startup_target = startup.get("target_raise_usd")

    if (
        investor_minimum is None
        or investor_maximum is None
    ):
        return (
            50.0,
            "Your cheque-size range is incomplete, so funding "
            "fit cannot be fully evaluated.",
        )

    investor_minimum = float(investor_minimum)
    investor_maximum = float(investor_maximum)

    if startup_minimum is not None:
        startup_minimum = float(startup_minimum)

    if startup_target is not None:
        startup_target = float(startup_target)

    if startup_minimum is None and startup_target is None:
        return (
            50.0,
            "The startup has not provided enough funding-range "
            "data for a complete cheque-size comparison.",
        )

    startup_range_min = (
        startup_minimum
        if startup_minimum is not None
        else 0.0
    )

    startup_range_max = (
        startup_target
        if startup_target is not None
        else startup_range_min
    )

    overlap_start = max(
        investor_minimum,
        startup_range_min,
    )
    overlap_end = min(
        investor_maximum,
        startup_range_max,
    )

    if overlap_start <= overlap_end:
        if (
            investor_minimum <= startup_range_min
            and investor_maximum >= startup_range_max
        ):
            return (
                100.0,
                "Your cheque-size range fully covers the "
                "startup's stated funding range.",
            )

        return (
            75.0,
            "Your cheque-size range overlaps with the startup's "
            "stated funding requirements.",
        )

    return (
        0.0,
        "Your cheque-size range does not overlap with the "
        "startup's stated funding requirements.",
    )


def _calculate_readiness_score(
    investor: dict[str, Any],
    readiness: dict[str, Any] | None,
) -> tuple[float, str]:
    if readiness is None:
        return (
            50.0,
            "The startup has not completed a funding readiness "
            "assessment, so this dimension is neutral.",
        )

    startup_score = float(
        readiness.get("overall_score") or 0
    )

    required_score = float(
        investor.get("minimum_readiness_score") or 0
    )

    if startup_score >= required_score:
        return (
            100.0,
            f"The startup's readiness score of "
            f"{round(startup_score, 1)}/100 meets your minimum "
            f"requirement of {round(required_score, 1)}/100.",
        )

    gap = required_score - startup_score

    if gap <= 10:
        return (
            60.0,
            f"The startup's readiness score is "
            f"{round(gap, 1)} points below your minimum "
            "requirement.",
        )

    return (
        0.0,
        f"The startup's readiness score is substantially below "
        f"your minimum requirement by {round(gap, 1)} points.",
    )


def _calculate_revenue_score(
    investor: dict[str, Any],
    startup: dict[str, Any],
) -> tuple[float, str]:
    if not investor.get("requires_revenue"):
        return (
            100.0,
            "You do not require startups to be revenue-generating.",
        )

    revenue_status = _normalize(
        startup.get("revenue_status")
    )

    annual_revenue = float(
        startup.get("annual_revenue_usd") or 0
    )

    revenue_signals = {
        "revenue generating",
        "generating revenue",
        "profitable",
        "revenue",
    }

    has_revenue = (
        annual_revenue > 0
        or revenue_status in revenue_signals
    )

    if has_revenue:
        return (
            100.0,
            "The startup satisfies your revenue requirement.",
        )

    return (
        0.0,
        "The startup does not currently satisfy your revenue "
        "requirement.",
    )


def _calculate_traction_score(
    investor: dict[str, Any],
    startup: dict[str, Any],
) -> tuple[float, str]:
    if not investor.get("requires_traction"):
        return (
            100.0,
            "You do not require measurable traction as a "
            "mandatory preference.",
        )

    traction_summary = str(
        startup.get("traction_summary") or ""
    ).strip()

    customer_count = int(
        startup.get("customer_count") or 0
    )

    if customer_count > 0:
        return (
            100.0,
            "The startup reports measurable customer traction.",
        )

    if traction_summary:
        return (
            75.0,
            "The startup reports traction evidence, although "
            "no positive customer count is currently available.",
        )

    return (
        0.0,
        "The startup does not currently provide measurable "
        "traction evidence.",
    )


def _eligibility_from_score(score: float) -> str:
    if score >= 75:
        return "eligible"

    if score >= 50:
        return "partial_fit"

    return "ineligible"


def _calculate_match(
    investor: dict[str, Any],
    startup: dict[str, Any],
    readiness: dict[str, Any] | None,
) -> dict[str, Any]:
    calculators = {
        "sector": _calculate_sector_score,
        "stage": _calculate_stage_score,
        "geography": _calculate_geography_score,
        "cheque": _calculate_cheque_score,
        "revenue": _calculate_revenue_score,
        "traction": _calculate_traction_score,
    }

    dimension_scores: dict[str, float] = {}
    match_reasons: list[dict[str, str]] = []

    for dimension, calculator in calculators.items():
        score, message = calculator(investor, startup)

        dimension_scores[dimension] = round(score, 2)

        match_reasons.append(
            {
                "dimension": dimension,
                "status": _reason_status(score),
                "message": message,
            }
        )

    readiness_score, readiness_message = (
        _calculate_readiness_score(
            investor,
            readiness,
        )
    )

    dimension_scores["readiness"] = round(
        readiness_score,
        2,
    )

    match_reasons.append(
        {
            "dimension": "readiness",
            "status": _reason_status(readiness_score),
            "message": readiness_message,
        }
    )

    overall_score = sum(
        dimension_scores[dimension]
        * MATCHING_WEIGHTS[dimension]
        for dimension in MATCHING_WEIGHTS
    )

    overall_score = round(overall_score, 2)

    return {
        "overall_score": overall_score,
        "dimension_scores": dimension_scores,
        "match_reasons": match_reasons,
        "eligibility_status": _eligibility_from_score(
            overall_score
        ),
    }


class MatchingService:
    @staticmethod
    def _get_investor_profile(
        user_id: str,
    ) -> dict[str, Any]:
        try:
            response = (
                supabase_admin
                .table("investor_profiles")
                .select("*")
                .eq("user_id", user_id)
                .limit(1)
                .execute()
            )
        except Exception as error:
            raise HTTPException(
                status_code=status.HTTP_502_BAD_GATEWAY,
                detail="Unable to load the investor profile.",
            ) from error

        if not response.data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=(
                    "Complete your investor profile before "
                    "generating startup matches."
                ),
            )

        return response.data[0]

    @staticmethod
    def _get_startups() -> list[dict[str, Any]]:
        try:
            response = (
                supabase_admin
                .table("startups")
                .select("*")
                .eq("onboarding_completed", True)
                .execute()
            )
        except Exception as error:
            raise HTTPException(
                status_code=status.HTTP_502_BAD_GATEWAY,
                detail="Unable to load eligible startups.",
            ) from error

        return response.data or []

    @staticmethod
    def _get_latest_readiness_by_startup(
        startup_ids: list[str],
    ) -> dict[str, dict[str, Any]]:
        if not startup_ids:
            return {}

        try:
            response = (
                supabase_admin
                .table("readiness_assessments")
                .select("*")
                .in_("startup_id", startup_ids)
                .order("created_at", desc=True)
                .execute()
            )
        except Exception as error:
            raise HTTPException(
                status_code=status.HTTP_502_BAD_GATEWAY,
                detail=(
                    "Unable to load startup readiness results."
                ),
            ) from error

        latest_by_startup: dict[str, dict[str, Any]] = {}

        for assessment in response.data or []:
            startup_id = assessment.get("startup_id")

            if (
                startup_id
                and startup_id not in latest_by_startup
            ):
                latest_by_startup[startup_id] = assessment

        return latest_by_startup

    @staticmethod
    def generate_matches(
        user_id: str,
    ) -> dict[str, Any]:
        investor = MatchingService._get_investor_profile(
            user_id
        )

        if not investor.get("is_profile_complete"):
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=(
                    "Complete your investor profile before "
                    "generating startup matches."
                ),
            )

        startups = MatchingService._get_startups()

        startup_ids = [
            startup["id"]
            for startup in startups
        ]

        readiness_by_startup = (
            MatchingService
            ._get_latest_readiness_by_startup(
                startup_ids
            )
        )

        generated_matches: list[dict[str, Any]] = []

        for startup in startups:
            match_result = _calculate_match(
                investor=investor,
                startup=startup,
                readiness=readiness_by_startup.get(
                    startup["id"]
                ),
            )

            payload = {
                "investor_id": investor["id"],
                "startup_id": startup["id"],
                "investor_user_id": user_id,
                "founder_id": startup["founder_id"],
                **match_result,
                "methodology_version": (
                    MATCHING_METHODOLOGY_VERSION
                ),
            }

            try:
                response = (
                    supabase_admin
                    .table("investor_startup_matches")
                    .upsert(
                        payload,
                        on_conflict=(
                            "investor_id,startup_id"
                        ),
                    )
                    .execute()
                )
            except Exception as error:
                raise HTTPException(
                    status_code=(
                        status.HTTP_502_BAD_GATEWAY
                    ),
                    detail=(
                        "Unable to save generated startup "
                        "matches."
                    ),
                ) from error

            if response.data:
                generated_matches.append(
                    response.data[0]
                )

        generated_matches.sort(
            key=lambda item: float(
                item["overall_score"]
            ),
            reverse=True,
        )

        return {
            "generated_count": len(generated_matches),
            "eligible_count": sum(
                1
                for item in generated_matches
                if item["eligibility_status"]
                == "eligible"
            ),
            "partial_fit_count": sum(
                1
                for item in generated_matches
                if item["eligibility_status"]
                == "partial_fit"
            ),
            "ineligible_count": sum(
                1
                for item in generated_matches
                if item["eligibility_status"]
                == "ineligible"
            ),
            "matches": generated_matches,
        }

    @staticmethod
    def get_startup_matches(
        user_id: str,
    ) -> list[dict[str, Any]]:
        investor = MatchingService._get_investor_profile(
            user_id
        )

        try:
            response = (
                supabase_admin
                .table("investor_startup_matches")
                .select(
                    "*, startups(*)"
                )
                .eq("investor_id", investor["id"])
                .order("overall_score", desc=True)
                .execute()
            )
        except Exception as error:
            raise HTTPException(
                status_code=status.HTTP_502_BAD_GATEWAY,
                detail="Unable to load startup matches.",
            ) from error

        results: list[dict[str, Any]] = []

        for match in response.data or []:
            startup = match.get("startups") or {}

            results.append(
                {
                    "id": match["id"],
                    "startup_id": startup.get("id"),
                    "startup_name": startup.get("name"),
                    "tagline": startup.get("tagline"),
                    "industry": startup.get("industry"),
                    "sub_industry": startup.get(
                        "sub_industry"
                    ),
                    "stage": str(
                        startup.get("stage") or ""
                    ),
                    "headquarters_country": startup.get(
                        "headquarters_country"
                    ),
                    "headquarters_city": startup.get(
                        "headquarters_city"
                    ),
                    "target_raise_usd": startup.get(
                        "target_raise_usd"
                    ),
                    "minimum_investment_usd": startup.get(
                        "minimum_investment_usd"
                    ),
                    "overall_score": match[
                        "overall_score"
                    ],
                    "dimension_scores": match[
                        "dimension_scores"
                    ],
                    "match_reasons": match[
                        "match_reasons"
                    ],
                    "eligibility_status": match[
                        "eligibility_status"
                    ],
                    "methodology_version": match[
                        "methodology_version"
                    ],
                }
            )

        return results

    @staticmethod
    def get_founder_investor_matches(
        founder_id: str,
    ) -> list[dict[str, Any]]:
        try:
            response = (
                supabase_admin
                .table("investor_startup_matches")
                .select(
                    "*, investor_profiles(*)"
                )
                .eq("founder_id", founder_id)
                .order("overall_score", desc=True)
                .execute()
            )
        except Exception as error:
            raise HTTPException(
                status_code=status.HTTP_502_BAD_GATEWAY,
                detail="Unable to load investor matches.",
            ) from error

        results: list[dict[str, Any]] = []

        for match in response.data or []:
            investor = (
                match.get("investor_profiles") or {}
            )

            results.append(
                {
                    "id": match["id"],
                    "investor_id": investor.get("id"),
                    "investor_name": investor.get(
                        "investor_name"
                    ),
                    "organization_name": investor.get(
                        "organization_name"
                    ),
                    "investor_type": investor.get(
                        "investor_type"
                    ),
                    "preferred_stages": investor.get(
                        "preferred_stages"
                    )
                    or [],
                    "preferred_sectors": investor.get(
                        "preferred_sectors"
                    )
                    or [],
                    "preferred_geographies": investor.get(
                        "preferred_geographies"
                    )
                    or [],
                    "minimum_cheque_size": investor.get(
                        "minimum_cheque_size"
                    ),
                    "maximum_cheque_size": investor.get(
                        "maximum_cheque_size"
                    ),
                    "overall_score": match[
                        "overall_score"
                    ],
                    "dimension_scores": match[
                        "dimension_scores"
                    ],
                    "match_reasons": match[
                        "match_reasons"
                    ],
                    "eligibility_status": match[
                        "eligibility_status"
                    ],
                    "methodology_version": match[
                        "methodology_version"
                    ],
                }
            )

        return results


matching_service = MatchingService()