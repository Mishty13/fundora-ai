from typing import Any, Literal

from pydantic import BaseModel, Field


EligibilityStatus = Literal[
    "eligible",
    "partial_fit",
    "ineligible",
]


class DimensionScores(BaseModel):
    sector: float = Field(ge=0, le=100)
    stage: float = Field(ge=0, le=100)
    geography: float = Field(ge=0, le=100)
    cheque: float = Field(ge=0, le=100)
    readiness: float = Field(ge=0, le=100)
    revenue: float = Field(ge=0, le=100)
    traction: float = Field(ge=0, le=100)


class MatchReason(BaseModel):
    dimension: str
    status: Literal["strong", "moderate", "weak"]
    message: str


class StartupMatchResponse(BaseModel):
    id: str
    startup_id: str
    startup_name: str
    tagline: str | None = None

    industry: str
    sub_industry: str | None = None
    stage: str

    headquarters_country: str
    headquarters_city: str | None = None

    target_raise_usd: float | None = None
    minimum_investment_usd: float | None = None

    overall_score: float
    dimension_scores: DimensionScores
    match_reasons: list[MatchReason]

    eligibility_status: EligibilityStatus
    methodology_version: str


class InvestorMatchResponse(BaseModel):
    id: str
    investor_id: str

    investor_name: str
    organization_name: str | None = None
    investor_type: str

    preferred_stages: list[str]
    preferred_sectors: list[str]
    preferred_geographies: list[str]

    minimum_cheque_size: float | None = None
    maximum_cheque_size: float | None = None

    overall_score: float
    dimension_scores: DimensionScores
    match_reasons: list[MatchReason]

    eligibility_status: EligibilityStatus
    methodology_version: str


class MatchGenerationResponse(BaseModel):
    generated_count: int
    eligible_count: int
    partial_fit_count: int
    ineligible_count: int
    matches: list[dict[str, Any]]