import json
import re
from typing import Any

from app.services.watsonx_service import (
    WatsonxServiceError,
    watsonx_service,
)


class InvestmentBriefServiceError(Exception):
    """Raised when AI investment brief generation fails."""


class InvestmentBriefService:
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

        raise InvestmentBriefServiceError(
            "The AI investment brief returned an invalid response."
        )

    async def generate_investment_brief(
        self,
        startup: dict[str, Any],
        match_data: dict[str, Any] | None = None,
    ) -> dict[str, Any]:
        context = {
            "startup": startup,
            "investor_startup_match": match_data,
        }

        system_prompt = """
You are the AI Investment Analyst inside Fundora AI.

Your job is to help an investor evaluate a startup using only
the evidence supplied in the Fundora context.

Fundora already uses deterministic algorithms for startup-investor
matching and funding readiness. Never replace, contradict, or
recalculate those deterministic scores.

Rules:
1. Use only information explicitly present in the supplied context.
2. Never invent revenue, traction, customers, funding, market size,
   team details, investor interest, or any other startup fact.
3. Treat missing information as unknown.
4. Clearly distinguish positive investment signals from risks.
5. Generate due-diligence questions based on real gaps, risks,
   weaknesses, or missing information.
6. Do not recommend that the investor definitely invest or reject.
7. Provide decision support, not financial advice.
8. Be concise, balanced, evidence-based, and professional.
9. Return valid JSON only.
10. Do not use Markdown code fences.
11. Do not include any text before or after the JSON object.

Return exactly this JSON structure:

{
  "investment_thesis": "string",
  "key_strengths": [
    {
      "title": "string",
      "explanation": "string"
    }
  ],
  "due_diligence_concerns": [
    {
      "title": "string",
      "explanation": "string"
    }
  ],
  "founder_questions": [
    {
      "question": "string",
      "reason": "string"
    }
  ],
  "investor_perspective": "string"
}

Requirements:
- Return exactly 3 key strengths.
- Return exactly 3 due-diligence concerns.
- Return exactly 3 founder questions.
"""

        user_prompt = (
            "Analyze this Fundora startup and match context and "
            "generate a balanced AI investment brief.\n\n"
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
            raise InvestmentBriefServiceError(
                "The AI investment brief is temporarily unavailable."
            ) from error

        parsed_response = self._extract_json(response)

        self._validate_response(parsed_response)

        return parsed_response

    @staticmethod
    def _validate_response(
        response: dict[str, Any],
    ) -> None:
        required_fields = {
            "investment_thesis",
            "key_strengths",
            "due_diligence_concerns",
            "founder_questions",
            "investor_perspective",
        }

        missing_fields = required_fields - response.keys()

        if missing_fields:
            raise InvestmentBriefServiceError(
                "The AI investment brief response is incomplete."
            )

        if (
            not isinstance(response.get("key_strengths"), list)
            or len(response["key_strengths"]) != 3
        ):
            raise InvestmentBriefServiceError(
                "The AI investment brief returned an invalid "
                "number of key strengths."
            )

        if (
            not isinstance(
                response.get("due_diligence_concerns"),
                list,
            )
            or len(response["due_diligence_concerns"]) != 3
        ):
            raise InvestmentBriefServiceError(
                "The AI investment brief returned an invalid "
                "number of due-diligence concerns."
            )

        if (
            not isinstance(response.get("founder_questions"), list)
            or len(response["founder_questions"]) != 3
        ):
            raise InvestmentBriefServiceError(
                "The AI investment brief returned an invalid "
                "number of founder questions."
            )


investment_brief_service = InvestmentBriefService()