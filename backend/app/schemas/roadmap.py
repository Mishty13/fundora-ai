from typing import Any, Literal

from pydantic import BaseModel, Field


RoadmapPriority = Literal["high", "medium", "low"]

RoadmapSource = Literal[
    "readiness",
    "pitch",
]


class RoadmapAction(BaseModel):
    source: RoadmapSource

    dimension: str = Field(
        min_length=1,
        max_length=100,
    )

    priority: RoadmapPriority

    title: str = Field(
        min_length=3,
        max_length=200,
    )

    description: str = Field(
        min_length=10,
        max_length=1500,
    )

    action: str = Field(
        min_length=10,
        max_length=1500,
    )


class RoadmapResponse(BaseModel):
    id: str
    startup_id: str
    founder_id: str

    readiness_assessment_id: str | None = None
    pitch_analysis_id: str | None = None

    status: str
    overall_summary: str

    actions: list[RoadmapAction]
    source_snapshot: dict[str, Any]

    methodology_version: str

    created_at: str
    updated_at: str