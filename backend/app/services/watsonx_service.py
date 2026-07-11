import time
from typing import Any

import httpx

from app.core.config import settings


class WatsonxServiceError(Exception):
    """Raised when IBM watsonx.ai integration fails."""


class WatsonxService:
    def __init__(self) -> None:
        self._access_token: str | None = None
        self._token_expires_at: float = 0.0

    def _validate_configuration(self) -> None:
        missing = []

        if not settings.watsonx_api_key:
            missing.append("WATSONX_API_KEY")

        if not settings.watsonx_project_id:
            missing.append("WATSONX_PROJECT_ID")

        if not settings.watsonx_model_id:
            missing.append("WATSONX_MODEL_ID")

        if not settings.watsonx_base_url:
            missing.append("WATSONX_BASE_URL")

        if missing:
            raise WatsonxServiceError(
                "Missing watsonx configuration: "
                + ", ".join(missing)
            )

    async def _get_access_token(self) -> str:
        current_time = time.time()

        if (
            self._access_token
            and current_time < self._token_expires_at
        ):
            return self._access_token

        async with httpx.AsyncClient(timeout=30.0) as client:
            try:
                response = await client.post(
                    "https://iam.cloud.ibm.com/identity/token",
                    headers={
                        "Content-Type":
                            "application/x-www-form-urlencoded",
                    },
                    data={
                        "grant_type": (
                            "urn:ibm:params:oauth:"
                            "grant-type:apikey"
                        ),
                        "apikey": settings.watsonx_api_key,
                    },
                )

                response.raise_for_status()

            except httpx.HTTPStatusError as error:
                detail = error.response.text[:500]

                raise WatsonxServiceError(
                    "IBM Cloud authentication failed: "
                    f"{detail}"
                ) from error

            except httpx.HTTPError as error:
                raise WatsonxServiceError(
                    "Unable to connect to IBM Cloud IAM."
                ) from error

        data = response.json()

        access_token = data.get("access_token")
        expires_in = int(data.get("expires_in", 3600))

        if not access_token:
            raise WatsonxServiceError(
                "IBM Cloud did not return an access token."
            )

        self._access_token = access_token
        self._token_expires_at = (
            current_time + expires_in - 60
        )

        return access_token

    async def chat(
        self,
        messages: list[dict[str, str]],
        *,
        max_tokens: int = 700,
        temperature: float = 0.2,
    ) -> str:
        self._validate_configuration()

        access_token = await self._get_access_token()

        endpoint = (
            f"{settings.watsonx_base_url.rstrip('/')}"
            "/ml/v1/text/chat"
        )

        payload: dict[str, Any] = {
            "model_id": settings.watsonx_model_id,
            "project_id": settings.watsonx_project_id,
            "messages": messages,
            "parameters": {
                "max_tokens": max_tokens,
                "temperature": temperature,
            },
        }

        headers = {
            "Authorization": f"Bearer {access_token}",
            "Content-Type": "application/json",
            "Accept": "application/json",
        }

        params = {
            "version": "2023-05-29",
        }

        async with httpx.AsyncClient(timeout=90.0) as client:
            try:
                response = await client.post(
                    endpoint,
                    params=params,
                    headers=headers,
                    json=payload,
                )

                response.raise_for_status()

            except httpx.HTTPStatusError as error:
                detail = error.response.text[:500]

                raise WatsonxServiceError(
                    "watsonx.ai request failed: "
                    f"{detail}"
                ) from error

            except httpx.HTTPError as error:
                raise WatsonxServiceError(
                    "Unable to connect to watsonx.ai."
                ) from error

        data = response.json()
        choices = data.get("choices", [])

        if not choices:
            raise WatsonxServiceError(
                "watsonx.ai returned no generated response."
            )

        content = (
            choices[0]
            .get("message", {})
            .get("content")
        )

        if not content:
            raise WatsonxServiceError(
                "watsonx.ai returned an empty response."
            )

        return content.strip()


watsonx_service = WatsonxService()