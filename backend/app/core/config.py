from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "Fundora AI API"
    app_version: str = "1.0.0"
    api_v1_prefix: str = "/api/v1"

    frontend_url: str = "http://localhost:5173"

    supabase_url: str
    supabase_publishable_key: str
    supabase_secret_key: str
    watsonx_api_key: str = ""
    watsonx_project_id: str = ""
    watsonx_model_id: str = ""
    watsonx_base_url: str = "https://au-syd.ml.cloud.ibm.com"
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()