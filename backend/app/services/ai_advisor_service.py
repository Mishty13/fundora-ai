import json
import re
from typing import Any

from app.services.watsonx_service import (
    WatsonxServiceError,
    watsonx_service,
)


class AIAdvisorServiceError(Exception):
    """Raised when Fundora AI Advisor generation fails."""


class AIAdvisorService:
    @staticmethod
    def _extract_json(response: str) -> dict[str, Any]:
        cleaned = response.strip()

        cleaned = re.sub(
            r"^```(?:json)?\s*",
            "",
            cleaned,
            flags=re.IGNORECASE,
        )

        cleaned = re.sub(
            r"\s*```$",
            "",
            cleaned,
        )

        try:
            parsed = json.loads(cleaned)

            if isinstance(parsed, dict):
                return parsed

        except json.JSONDecodeError:
            pass

        start = cleaned.find("{")
        end = cleaned.rfind("}")

        if start != -1 and end != -1 and end > start:
            json_candidate = cleaned[start : end + 1]

            try:
                parsed = json.loads(json_candidate)

                if isinstance(parsed, dict):
                    return parsed

            except json.JSONDecodeError:
                pass

        raise AIAdvisorServiceError(
            "The AI funding advisor returned an invalid response."
        )

    async def generate_founder_advice(
        self,
        startup: dict[str, Any],
        readiness: dict[str, Any] | None = None,
        pitch: dict[str, Any] | None = None,
        roadmap: dict[str, Any] | None = None,
    ) -> dict[str, Any]:
        context = {
            "startup": startup,
            "readiness_assessment": readiness,
            "pitch_analysis": pitch,
            "roadmap": roadmap,
        }

        system_prompt = """
You are the Founder AI Funding Advisor inside Fundora AI.

Your job is to help startup founders improve their investment readiness
using only the evidence provided in the startup context.

Fundora AI already uses deterministic algorithms for readiness scoring,
pitch scoring, roadmap generation, and investor-startup matching.
Never replace, contradict, or recalculate those deterministic scores.

Rules:
1. Use only information explicitly present in the supplied context.
2. Never invent revenue, traction, customers, funding, team details,
   market size, investor interest, or other startup facts.
3. Treat missing information as unknown.
4. Give specific and actionable funding guidance.
5. Prioritize the highest-impact actions.
6. Be concise and professional.
7. Return valid JSON only.
8. Do not use Markdown code fences.
9. Do not include any text before or after the JSON object.

Return exactly this JSON structure:

{
  "executive_summary": "string",
  "funding_strengths": [
    {
      "title": "string",
      "explanation": "string"
    }
  ],
  "critical_risks": [
    {
      "title": "string",
      "explanation": "string"
    }
  ],
  "priority_actions": [
    {
      "priority": 1,
      "title": "string",
      "action": "string",
      "expected_impact": "string"
    }
  ],
  "investor_positioning": "string"
}

Requirements:
- Return exactly 3 funding strengths.
- Return exactly 3 critical risks.
- Return exactly 3 priority actions.
- Priority actions must be numbered 1, 2, and 3.
"""

        user_prompt = (
            "Analyze this Fundora startup context and generate "
            "personalized founder funding advice.\n\n"
            + json.dumps(
                context,
                indent=2,
                default=str,
            )
        )

        try:
            response = await watsonx_service.chat(
                messages=[
                    {
                        "role": "system",
                        "content": system_prompt.strip(),
                    },
                    {
                        "role": "user",
                        "content": user_prompt,
                    },
                ],
                max_tokens=1600,
                temperature=0.1,
            )

        except WatsonxServiceError as error:
            raise AIAdvisorServiceError(
                "The AI funding advisor is temporarily unavailable."
            ) from error

        parsed_response = self._extract_json(response)

        self._validate_response(parsed_response)

        return parsed_response

    @staticmethod
    def _validate_response(
        response: dict[str, Any],
    ) -> None:
        required_fields = {
            "executive_summary",
            "funding_strengths",
            "critical_risks",
            "priority_actions",
            "investor_positioning",
        }

        missing_fields = required_fields - response.keys()

        if missing_fields:
            raise AIAdvisorServiceError(
                "The AI funding advisor response is incomplete."
            )

        funding_strengths = response.get("funding_strengths")
        critical_risks = response.get("critical_risks")
        priority_actions = response.get("priority_actions")

        if (
            not isinstance(funding_strengths, list)
            or len(funding_strengths) != 3
        ):
            raise AIAdvisorServiceError(
                "The AI funding advisor returned an invalid "
                "number of funding strengths."
            )

        if (
            not isinstance(critical_risks, list)
            or len(critical_risks) != 3
        ):
            raise AIAdvisorServiceError(
                "The AI funding advisor returned an invalid "
                "number of critical risks."
            )

        if (
            not isinstance(priority_actions, list)
            or len(priority_actions) != 3
        ):
            raise AIAdvisorServiceError(
                "The AI funding advisor returned an invalid "
                "number of priority actions."
            )

        priorities = [
            action.get("priority")
            for action in priority_actions
            if isinstance(action, dict)
        ]

        if priorities != [1, 2, 3]:
            raise AIAdvisorServiceError(
                "The AI funding advisor returned invalid "
                "priority numbering."
            )


ai_advisor_service = AIAdvisorService()