from typing import Any, Literal

from pydantic import BaseModel, Field


PitchDimensionName = Literal[
    "problem_clarity",
    "solution_clarity",
    "market_opportunity",
    "traction_evidence",
    "business_model",
    "team_credibility",
    "funding_ask",
]

PriorityLevel = Literal["high", "medium", "low"]


class PitchDimensionAnalysis(BaseModel):
    dimension: PitchDimensionName

    score: float = Field(
        ge=0,
        le=100,
    )

    explanation: str = Field(
        min_length=10,
        max_length=1000,
    )

    evidence: list[str] = Field(
        default_factory=list,
        max_length=10,
    )

    missing_information: list[str] = Field(
        default_factory=list,
        max_length=10,
    )


class PitchStrength(BaseModel):
    dimension: PitchDimensionName

    title: str = Field(
        min_length=3,
        max_length=150,
    )

    description: str = Field(
        min_length=10,
        max_length=1000,
    )

    evidence: str | None = Field(
        default=None,
        max_length=1000,
    )


class PitchWeakness(BaseModel):
    dimension: PitchDimensionName

    title: str = Field(
        min_length=3,
        max_length=150,
    )

    description: str = Field(
        min_length=10,
        max_length=1000,
    )

    impact: str = Field(
        min_length=10,
        max_length=1000,
    )


class PitchRecommendation(BaseModel):
    dimension: PitchDimensionName

    priority: PriorityLevel

    title: str = Field(
        min_length=3,
        max_length=150,
    )

    description: str = Field(
        min_length=10,
        max_length=1000,
    )

    action: str = Field(
        min_length=10,
        max_length=1000,
    )


class GranitePitchAnalysis(BaseModel):
    problem_clarity_score: float = Field(ge=0, le=100)
    solution_clarity_score: float = Field(ge=0, le=100)
    market_opportunity_score: float = Field(ge=0, le=100)
    traction_evidence_score: float = Field(ge=0, le=100)
    business_model_score: float = Field(ge=0, le=100)
    team_credibility_score: float = Field(ge=0, le=100)
    funding_ask_score: float = Field(ge=0, le=100)

    score_breakdown: list[PitchDimensionAnalysis]

    strengths: list[PitchStrength] = Field(
        default_factory=list,
        max_length=10,
    )

    weaknesses: list[PitchWeakness] = Field(
        default_factory=list,
        max_length=10,
    )

    recommendations: list[PitchRecommendation] = Field(
        default_factory=list,
        max_length=15,
    )


class PitchAnalysisResponse(BaseModel):
    id: str
    startup_id: str
    founder_id: str

    file_name: str
    file_path: str
    file_type: str
    file_size_bytes: int

    extraction_status: str
    analysis_status: str

    overall_score: float | None = None
    problem_clarity_score: float | None = None
    solution_clarity_score: float | None = None
    market_opportunity_score: float | None = None
    traction_evidence_score: float | None = None
    business_model_score: float | None = None
    team_credibility_score: float | None = None
    funding_ask_score: float | None = None

    strengths: list[Any]
    weaknesses: list[Any]
    recommendations: list[Any]
    score_breakdown: Any

    analysis_provider: str | None = None
    model_name: str | None = None
    methodology_version: str

    failure_reason: str | None = None

    created_at: str
    updated_at: str