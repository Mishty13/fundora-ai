from typing import Any

from pydantic import BaseModel


class ReadinessAssessmentResponse(BaseModel):
    id: str
    startup_id: str
    founder_id: str

    overall_score: float
    business_clarity_score: float
    market_readiness_score: float
    traction_score: float
    team_strength_score: float
    funding_preparedness_score: float

    methodology_version: str
    input_snapshot: dict[str, Any]
    score_breakdown: dict[str, Any]
    recommendations: list[dict[str, Any]]

    created_at: str