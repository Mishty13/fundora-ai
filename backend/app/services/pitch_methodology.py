from typing import Final

from app.schemas.pitch import GranitePitchAnalysis


PITCH_METHODOLOGY_VERSION: Final = "1.0.0"

DIMENSION_WEIGHTS: Final = {
    "problem_clarity_score": 0.15,
    "solution_clarity_score": 0.15,
    "market_opportunity_score": 0.15,
    "traction_evidence_score": 0.20,
    "business_model_score": 0.15,
    "team_credibility_score": 0.10,
    "funding_ask_score": 0.10,
}


def calculate_overall_pitch_score(
    analysis: GranitePitchAnalysis,
) -> float:
    weighted_score = sum(
        getattr(analysis, score_name) * weight
        for score_name, weight in DIMENSION_WEIGHTS.items()
    )

    return round(weighted_score, 2)