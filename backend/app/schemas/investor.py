from typing import Literal

from pydantic import BaseModel, Field, model_validator


InvestorType = Literal[
    "angel",
    "venture_capital",
    "corporate_vc",
    "accelerator",
    "family_office",
    "other",
]


class InvestorProfileUpsert(BaseModel):
    investor_name: str = Field(
        min_length=2,
        max_length=150,
    )

    organization_name: str | None = Field(
        default=None,
        max_length=200,
    )

    investor_type: InvestorType

    bio: str | None = Field(
        default=None,
        max_length=2000,
    )

    preferred_stages: list[str] = Field(
        default_factory=list,
        max_length=10,
    )

    preferred_sectors: list[str] = Field(
        default_factory=list,
        max_length=20,
    )

    preferred_geographies: list[str] = Field(
        default_factory=list,
        max_length=20,
    )

    minimum_cheque_size: float | None = Field(
        default=None,
        ge=0,
    )

    maximum_cheque_size: float | None = Field(
        default=None,
        ge=0,
    )

    minimum_readiness_score: float = Field(
        default=0,
        ge=0,
        le=100,
    )

    requires_revenue: bool = False

    requires_traction: bool = False

    @model_validator(mode="after")
    def validate_cheque_range(self):
        if (
            self.minimum_cheque_size is not None
            and self.maximum_cheque_size is not None
            and self.minimum_cheque_size
            > self.maximum_cheque_size
        ):
            raise ValueError(
                "Minimum cheque size cannot exceed "
                "maximum cheque size."
            )

        return self


class InvestorProfileResponse(BaseModel):
    id: str
    user_id: str

    investor_name: str
    organization_name: str | None = None
    investor_type: InvestorType
    bio: str | None = None

    preferred_stages: list[str]
    preferred_sectors: list[str]
    preferred_geographies: list[str]

    minimum_cheque_size: float | None = None
    maximum_cheque_size: float | None = None

    minimum_readiness_score: float

    requires_revenue: bool
    requires_traction: bool

    is_profile_complete: bool

    created_at: str
    updated_at: str