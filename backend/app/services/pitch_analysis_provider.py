import json
from abc import ABC, abstractmethod
from typing import Any

from app.schemas.pitch import GranitePitchAnalysis
from app.services.watsonx_service import (
    WatsonxServiceError,
    watsonx_service,
)


class PitchAnalysisProviderError(Exception):
    """Raised when AI pitch analysis cannot be completed."""


class PitchAnalysisProvider(ABC):
    @property
    @abstractmethod
    def provider_name(self) -> str:
        raise NotImplementedError

    @property
    @abstractmethod
    def model_name(self) -> str:
        raise NotImplementedError

    @abstractmethod
    async def analyze(
        self,
        extracted_text: str,
        startup_context: dict[str, Any],
    ) -> GranitePitchAnalysis:
        raise NotImplementedError


class WatsonxPitchAnalysisProvider(PitchAnalysisProvider):
    @property
    def provider_name(self) -> str:
        return "IBM watsonx.ai"

    @property
    def model_name(self) -> str:
        return "meta-llama/llama-3-3-70b-instruct"

    async def analyze(
        self,
        extracted_text: str,
        startup_context: dict[str, Any],
    ) -> GranitePitchAnalysis:
        system_prompt = """
You are the pitch intelligence engine for Fundora AI.

Analyze the supplied startup pitch across exactly seven dimensions:

1. problem_clarity
2. solution_clarity
3. market_opportunity
4. traction_evidence
5. business_model
6. team_credibility
7. funding_ask

STRICT FACTUAL RULES:
- Use only information explicitly present in the pitch or startup context.
- Never invent facts.
- Missing information must reduce the relevant score.
- All scores must be numbers between 0 and 100.
- Evidence must come from the supplied content.

STRICT OUTPUT RULES:
- Return valid JSON only.
- No Markdown.
- No code fences.
- No introductory or closing text.
- Keep all text concise.
- Each explanation: maximum 25 words.
- Each evidence item: maximum 20 words.
- Each missing-information item: maximum 15 words.
- Return exactly 7 score_breakdown entries.
- Return exactly 2 strengths.
- Return exactly 2 weaknesses.
- Return exactly 3 recommendations.
- Complete and close the entire JSON object.

Return exactly this structure:

{
  "problem_clarity_score": 0,
  "solution_clarity_score": 0,
  "market_opportunity_score": 0,
  "traction_evidence_score": 0,
  "business_model_score": 0,
  "team_credibility_score": 0,
  "funding_ask_score": 0,
  "score_breakdown": [
    {
      "dimension": "problem_clarity",
      "score": 0,
      "explanation": "Short explanation",
      "evidence": ["Short evidence"],
      "missing_information": ["Short missing item"]
    }
  ],
  "strengths": [
    {
      "dimension": "solution_clarity",
      "title": "Short title",
      "description": "Short description",
      "evidence": "Short evidence"
    }
  ],
  "weaknesses": [
    {
      "dimension": "traction_evidence",
      "title": "Short title",
      "description": "Short description",
      "impact": "Short investor impact"
    }
  ],
  "recommendations": [
    {
      "dimension": "traction_evidence",
      "priority": "high",
      "title": "Short title",
      "description": "Short recommendation",
      "action": "Short specific action"
    }
  ]
}

The seven score_breakdown entries must use these dimensions exactly once:

problem_clarity
solution_clarity
market_opportunity
traction_evidence
business_model
team_credibility
funding_ask

Prioritize valid, complete JSON over verbosity.
""".strip()

        user_prompt = f"""
STARTUP CONTEXT:
{json.dumps(
    startup_context,
    ensure_ascii=False,
    default=str,
)}

EXTRACTED PITCH CONTENT:
{extracted_text}

Return a concise, factual, complete JSON analysis now.
""".strip()

        try:
            raw_response = await watsonx_service.chat(
                messages=[
                    {
                        "role": "system",
                        "content": system_prompt,
                    },
                    {
                        "role": "user",
                        "content": user_prompt,
                    },
                ],
                max_tokens=6000,
                temperature=0.0,
            )

        except WatsonxServiceError as error:
            raise PitchAnalysisProviderError(
                f"IBM watsonx.ai pitch analysis failed: {error}"
            ) from error

        cleaned_response = raw_response.strip()

        if cleaned_response.startswith("```json"):
            cleaned_response = cleaned_response[7:]

        elif cleaned_response.startswith("```"):
            cleaned_response = cleaned_response[3:]

        if cleaned_response.endswith("```"):
            cleaned_response = cleaned_response[:-3]

        cleaned_response = cleaned_response.strip()

        try:
            parsed_response = json.loads(cleaned_response)

        except json.JSONDecodeError:
            first_brace = cleaned_response.find("{")
            last_brace = cleaned_response.rfind("}")

            if (
                first_brace == -1
                or last_brace == -1
                or last_brace <= first_brace
            ):
                print(
                    "RAW WATSONX PITCH RESPONSE:",
                    raw_response,
                )

                raise PitchAnalysisProviderError(
                    "The AI pitch analyzer did not return "
                    "a complete JSON object."
                )

            json_content = cleaned_response[
                first_brace:last_brace + 1
            ]

            try:
                parsed_response = json.loads(json_content)

            except json.JSONDecodeError as error:
                print(
                    "RAW WATSONX PITCH RESPONSE:",
                    raw_response,
                )

                raise PitchAnalysisProviderError(
                    "The AI pitch analyzer returned "
                    "incomplete or malformed JSON."
                ) from error

        try:
            return GranitePitchAnalysis.model_validate(
                parsed_response
            )

        except Exception as error:
            print(
                "PITCH SCHEMA VALIDATION ERROR:",
                error,
            )

            print(
                "PARSED WATSONX RESPONSE:",
                parsed_response,
            )

            raise PitchAnalysisProviderError(
                "The AI pitch analysis failed schema validation."
            ) from error


pitch_analysis_provider = WatsonxPitchAnalysisProvider()