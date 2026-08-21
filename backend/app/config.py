"""
Centralized configuration. Every secret comes from environment variables —
nothing here is hardcoded. See .env.example for the full list.
"""
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    # Database
    database_url: str = "postgresql://yavi_user:yavi_pass@localhost:5432/yavi_db"

    # AI provider abstraction — swap provider without touching business logic
    ai_provider: str = "anthropic"
    anthropic_api_key: str = ""
    openai_api_key: str = ""
    ai_model: str = "claude-sonnet-4-6"

    # Auth
    jwt_secret: str = "dev-secret-change-me"
    jwt_algorithm: str = "HS256"
    jwt_expire_minutes: int = 480

    # Admin bootstrap
    admin_email: str = "admin@yavi.studio"
    admin_password: str = "change_me_now"

    # CORS
    frontend_origin: str = "http://localhost:3000"


settings = Settings()
