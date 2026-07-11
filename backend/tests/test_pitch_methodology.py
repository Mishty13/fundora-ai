from app.schemas.pitch import GranitePitchAnalysis
from app.services.pitch_methodology import (
    calculate_overall_pitch_score,
)


def create_analysis() -> GranitePitchAnalysis:
    return GranitePitchAnalysis(
        problem_clarity_score=80,
        solution_clarity_score=70,
        market_opportunity_score=90,
        traction_evidence_score=60,
        business_model_score=75,
        team_credibility_score=85,
        funding_ask_score=65,
        score_breakdown=[],
        strengths=[],
        weaknesses=[],
        recommendations=[],
    )


def test_calculates_weighted_pitch_score():
    analysis = create_analysis()

    score = calculate_overall_pitch_score(analysis)

    assert score == 74.25


def test_pitch_scores_remain_bounded():
    analysis = GranitePitchAnalysis(
        problem_clarity_score=100,
        solution_clarity_score=100,
        market_opportunity_score=100,
        traction_evidence_score=100,
        business_model_score=100,
        team_credibility_score=100,
        funding_ask_score=100,
        score_breakdown=[],
        strengths=[],
        weaknesses=[],
        recommendations=[],
    )

    assert calculate_overall_pitch_score(analysis) == 100.0