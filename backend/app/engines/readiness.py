from dataclasses import dataclass
from typing import Any


METHODOLOGY_VERSION = "1.0.0"

DIMENSION_WEIGHTS = {
    "business_clarity": 0.20,
    "market_readiness": 0.20,
    "traction": 0.25,
    "team_strength": 0.15,
    "funding_preparedness": 0.20,
}


@dataclass(frozen=True)
class CriterionResult:
    criterion: str
    score: float
    maximum_score: float
    explanation: str


def _text_quality_score(
    value: str | None,
    minimum_meaningful_length: int,
    strong_length: int,
    maximum_score: float,
) -> float:
    text = (value or "").strip()

    if not text:
        return 0.0

    length = len(text)

    if length < minimum_meaningful_length:
        return round(maximum_score * 0.25, 2)

    if length < strong_length:
        return round(maximum_score * 0.60, 2)

    return round(maximum_score, 2)


def _criterion(
    name: str,
    score: float,
    maximum_score: float,
    explanation: str,
) -> CriterionResult:
    return CriterionResult(
        criterion=name,
        score=round(min(score, maximum_score), 2),
        maximum_score=maximum_score,
        explanation=explanation,
    )


def _score_business_clarity(
    startup: dict[str, Any],
) -> tuple[float, list[CriterionResult]]:
    criteria = [
        _criterion(
            "problem_definition",
            _text_quality_score(
                startup.get("problem_statement"),
                minimum_meaningful_length=40,
                strong_length=150,
                maximum_score=25,
            ),
            25,
            "Evaluates whether the startup has meaningfully described the problem.",
        ),
        _criterion(
            "solution_definition",
            _text_quality_score(
                startup.get("solution_statement"),
                minimum_meaningful_length=40,
                strong_length=150,
                maximum_score=25,
            ),
            25,
            "Evaluates whether the proposed solution is sufficiently described.",
        ),
        _criterion(
            "business_model_definition",
            _text_quality_score(
                startup.get("business_model"),
                minimum_meaningful_length=30,
                strong_length=120,
                maximum_score=25,
            ),
            25,
            "Evaluates whether the startup explains how it creates and captures value.",
        ),
        _criterion(
            "competitive_advantage_definition",
            _text_quality_score(
                startup.get("competitive_advantage"),
                minimum_meaningful_length=30,
                strong_length=120,
                maximum_score=25,
            ),
            25,
            "Evaluates whether the startup describes a meaningful competitive advantage.",
        ),
    ]

    score = sum(item.score for item in criteria)

    return round(score, 2), criteria


def _score_market_readiness(
    startup: dict[str, Any],
) -> tuple[float, list[CriterionResult]]:
    target_market_score = _text_quality_score(
        startup.get("target_market"),
        minimum_meaningful_length=40,
        strong_length=150,
        maximum_score=50,
    )

    positioning_fields = [
        startup.get("industry"),
        startup.get("sub_industry"),
        startup.get("headquarters_country"),
    ]

    completed_positioning_fields = sum(
        1
        for value in positioning_fields
        if value is not None and str(value).strip()
    )

    positioning_score = (
        completed_positioning_fields / len(positioning_fields)
    ) * 25

    customer_count = startup.get("customer_count")

    if customer_count is None:
        customer_evidence_score = 0
        customer_explanation = (
            "No customer count has been reported."
        )
    elif customer_count > 0:
        customer_evidence_score = 25
        customer_explanation = (
            "The startup reports existing customers."
        )
    else:
        customer_evidence_score = 5
        customer_explanation = (
            "Customer count is reported as zero."
        )

    criteria = [
        _criterion(
            "target_market_definition",
            target_market_score,
            50,
            "Evaluates the completeness of the stated target market.",
        ),
        _criterion(
            "market_positioning_context",
            positioning_score,
            25,
            "Evaluates available industry, sub-industry, and geographic context.",
        ),
        _criterion(
            "customer_evidence",
            customer_evidence_score,
            25,
            customer_explanation,
        ),
    ]

    return round(sum(item.score for item in criteria), 2), criteria


def _score_traction(
    startup: dict[str, Any],
) -> tuple[float, list[CriterionResult]]:
    revenue_status = startup.get("revenue_status")
    annual_revenue = float(startup.get("annual_revenue_usd") or 0)
    customer_count = startup.get("customer_count")
    traction_summary = startup.get("traction_summary")

    if revenue_status == "revenue_generating" and annual_revenue > 0:
        revenue_score = 35
        revenue_explanation = (
            "The startup reports positive annual revenue."
        )
    elif revenue_status == "revenue_generating":
        revenue_score = 15
        revenue_explanation = (
            "The startup is marked as revenue-generating but reports no positive annual revenue."
        )
    else:
        revenue_score = 0
        revenue_explanation = (
            "The startup is currently pre-revenue."
        )

    if customer_count is None:
        customer_score = 0
        customer_explanation = (
            "No customer count has been provided."
        )
    elif customer_count >= 1000:
        customer_score = 35
        customer_explanation = (
            "The startup reports at least 1,000 customers."
        )
    elif customer_count >= 100:
        customer_score = 28
        customer_explanation = (
            "The startup reports at least 100 customers."
        )
    elif customer_count >= 10:
        customer_score = 20
        customer_explanation = (
            "The startup reports at least 10 customers."
        )
    elif customer_count > 0:
        customer_score = 10
        customer_explanation = (
            "The startup reports early customer adoption."
        )
    else:
        customer_score = 0
        customer_explanation = (
            "The startup reports zero customers."
        )

    traction_evidence_score = _text_quality_score(
        traction_summary,
        minimum_meaningful_length=40,
        strong_length=180,
        maximum_score=30,
    )

    criteria = [
        _criterion(
            "revenue_evidence",
            revenue_score,
            35,
            revenue_explanation,
        ),
        _criterion(
            "customer_evidence",
            customer_score,
            35,
            customer_explanation,
        ),
        _criterion(
            "traction_evidence",
            traction_evidence_score,
            30,
            "Evaluates the completeness of reported traction evidence.",
        ),
    ]

    return round(sum(item.score for item in criteria), 2), criteria


def _score_team_strength(
    startup: dict[str, Any],
) -> tuple[float, list[CriterionResult]]:
    team_size = int(startup.get("team_size") or 0)
    full_time_founders = int(
        startup.get("full_time_founders") or 0
    )

    if full_time_founders >= 2:
        founder_commitment_score = 50
        founder_explanation = (
            "The startup has at least two full-time founders."
        )
    elif full_time_founders == 1:
        founder_commitment_score = 35
        founder_explanation = (
            "The startup has one full-time founder."
        )
    else:
        founder_commitment_score = 0
        founder_explanation = (
            "No full-time founder commitment is reported."
        )

    if team_size >= 10:
        team_capacity_score = 50
        team_explanation = (
            "The startup reports a team of at least 10 people."
        )
    elif team_size >= 5:
        team_capacity_score = 40
        team_explanation = (
            "The startup reports a team of at least 5 people."
        )
    elif team_size >= 2:
        team_capacity_score = 25
        team_explanation = (
            "The startup reports a small multi-person team."
        )
    elif team_size == 1:
        team_capacity_score = 10
        team_explanation = (
            "The startup currently reports a solo team."
        )
    else:
        team_capacity_score = 0
        team_explanation = (
            "No valid team size is reported."
        )

    criteria = [
        _criterion(
            "full_time_founder_commitment",
            founder_commitment_score,
            50,
            founder_explanation,
        ),
        _criterion(
            "team_capacity",
            team_capacity_score,
            50,
            team_explanation,
        ),
    ]

    return round(sum(item.score for item in criteria), 2), criteria


def _score_funding_preparedness(
    startup: dict[str, Any],
) -> tuple[float, list[CriterionResult]]:
    target_raise = startup.get("target_raise_usd")
    minimum_investment = startup.get("minimum_investment_usd")
    funding_status = startup.get("funding_status")
    total_raised = float(
        startup.get("total_funding_raised_usd") or 0
    )

    target_raise_score = (
        35
        if target_raise is not None and float(target_raise) > 0
        else 0
    )

    minimum_investment_score = (
        20
        if minimum_investment is not None
        and float(minimum_investment) > 0
        else 0
    )

    if total_raised > 0:
        funding_history_score = 25
        funding_history_explanation = (
            "The startup reports previous funding raised."
        )
    elif funding_status == "bootstrapped":
        funding_history_score = 10
        funding_history_explanation = (
            "The startup is explicitly identified as bootstrapped."
        )
    else:
        funding_history_score = 5
        funding_history_explanation = (
            "No previous funding amount is reported."
        )

    valid_funding_statuses = {
        "bootstrapped",
        "grant_funded",
        "angel_funded",
        "vc_funded",
        "other",
    }

    funding_status_score = (
        20 if funding_status in valid_funding_statuses else 0
    )

    criteria = [
        _criterion(
            "target_raise_definition",
            target_raise_score,
            35,
            "Evaluates whether a positive target raise has been specified.",
        ),
        _criterion(
            "minimum_investment_definition",
            minimum_investment_score,
            20,
            "Evaluates whether a positive minimum investment has been specified.",
        ),
        _criterion(
            "funding_history",
            funding_history_score,
            25,
            funding_history_explanation,
        ),
        _criterion(
            "funding_status_definition",
            funding_status_score,
            20,
            "Evaluates whether the current funding status is defined.",
        ),
    ]

    return round(sum(item.score for item in criteria), 2), criteria


def _build_recommendations(
    dimension_scores: dict[str, float],
) -> list[dict[str, Any]]:
    recommendation_map = {
        "business_clarity": {
            "title": "Strengthen business clarity",
            "description": (
                "Improve the specificity of the problem, solution, "
                "business model, and competitive advantage."
            ),
        },
        "market_readiness": {
            "title": "Strengthen market evidence",
            "description": (
                "Define the target market more precisely and add "
                "genuine evidence of customer demand where available."
            ),
        },
        "traction": {
            "title": "Build measurable traction",
            "description": (
                "Prioritize genuine evidence such as customers, "
                "revenue, pilots, partnerships, retention, or growth."
            ),
        },
        "team_strength": {
            "title": "Strengthen execution capacity",
            "description": (
                "Increase committed founder involvement or team "
                "capacity where genuinely required by the business."
            ),
        },
        "funding_preparedness": {
            "title": "Clarify the funding strategy",
            "description": (
                "Define the target raise, investment expectations, "
                "and current funding position more precisely."
            ),
        },
    }

    ranked_dimensions = sorted(
        dimension_scores.items(),
        key=lambda item: item[1],
    )

    recommendations = []

    for dimension, score in ranked_dimensions:
        if score >= 80:
            continue

        recommendation = recommendation_map[dimension]

        recommendations.append(
            {
                "dimension": dimension,
                "score": score,
                "priority": (
                    "high"
                    if score < 50
                    else "medium"
                    if score < 70
                    else "low"
                ),
                "title": recommendation["title"],
                "description": recommendation["description"],
            }
        )

    return recommendations


def calculate_readiness(
    startup: dict[str, Any],
) -> dict[str, Any]:
    business_score, business_breakdown = (
        _score_business_clarity(startup)
    )
    market_score, market_breakdown = (
        _score_market_readiness(startup)
    )
    traction_score, traction_breakdown = (
        _score_traction(startup)
    )
    team_score, team_breakdown = (
        _score_team_strength(startup)
    )
    funding_score, funding_breakdown = (
        _score_funding_preparedness(startup)
    )

    dimension_scores = {
        "business_clarity": business_score,
        "market_readiness": market_score,
        "traction": traction_score,
        "team_strength": team_score,
        "funding_preparedness": funding_score,
    }

    overall_score = round(
        sum(
            dimension_scores[dimension] * weight
            for dimension, weight in DIMENSION_WEIGHTS.items()
        ),
        2,
    )

    score_breakdown = {
        "business_clarity": [
            item.__dict__ for item in business_breakdown
        ],
        "market_readiness": [
            item.__dict__ for item in market_breakdown
        ],
        "traction": [
            item.__dict__ for item in traction_breakdown
        ],
        "team_strength": [
            item.__dict__ for item in team_breakdown
        ],
        "funding_preparedness": [
            item.__dict__ for item in funding_breakdown
        ],
    }

    return {
        "overall_score": overall_score,
        "business_clarity_score": business_score,
        "market_readiness_score": market_score,
        "traction_score": traction_score,
        "team_strength_score": team_score,
        "funding_preparedness_score": funding_score,
        "methodology_version": METHODOLOGY_VERSION,
        "score_breakdown": score_breakdown,
        "recommendations": _build_recommendations(
            dimension_scores
        ),
    }