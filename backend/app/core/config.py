from typing import Annotated, Any

from pydantic import AnyUrl, BeforeValidator
from pydantic_settings import BaseSettings, SettingsConfigDict


def parse_cors(v: Any) -> list[str] | str:
    if isinstance(v, str) and not v.startswith("["):
        return [i.strip() for i in v.split(",")]
    elif isinstance(v, list | str):
        return v
    raise ValueError(v)


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env", env_ignore_empty=True, extra="ignore"
    )
    
    PROJECT_NAME: str = "StackLab"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    
    FRONTEND_HOST: str = "http://localhost:5173"
    
    BACKEND_CORS_ORIGINS: Annotated[
        list[AnyUrl] | str, BeforeValidator(parse_cors)
    ] = []

settings = Settings()
