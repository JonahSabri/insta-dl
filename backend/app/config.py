from __future__ import annotations

import json

from pydantic import model_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
        env_ignore_empty=True,
    )

    DATABASE_URL: str = "sqlite+aiosqlite:///./instadb.sqlite"
    SECRET_KEY: str = "dev-secret-key-please-change-in-production"
    DEBUG: bool = True

    # Stored as a raw string; use .allowed_origins property everywhere.
    # Accepts:  http://localhost:3000
    #           http://localhost:3000,https://example.com
    #           ["http://localhost:3000","https://example.com"]
    ALLOWED_ORIGINS: str = "http://localhost:3000"

    ADMIN_USERNAME: str = "admin"
    ADMIN_PASSWORD: str = "changeme"
    JWT_EXPIRE_MINUTES: int = 480

    GUEST_DAILY_LIMIT: int = 3

    DOWNLOADS_DIR: str = "downloads"
    FILE_CLEANUP_MINUTES: int = 30

    INSTAGRAM_COOKIES_FILE: str | None = None

    GAPGPT_API_KEY: str = ""

    # Fernet key for encrypting sensitive settings in the DB.
    # Generate with: python -c "from cryptography.fernet import Fernet; print(Fernet.generate_key().decode())"
    # Leave empty to disable encryption (plaintext fallback).
    SETTINGS_ENCRYPTION_KEY: str = ""

    # Proxy — supports http/https/socks5, e.g. http://127.0.0.1:10809
    HTTP_PROXY: str | None = None
    HTTPS_PROXY: str | None = None

    @model_validator(mode="after")
    def _reject_insecure_defaults(self) -> "Settings":
        if self.DEBUG:
            return self
        problems: list[str] = []
        if self.SECRET_KEY == "dev-secret-key-please-change-in-production":
            problems.append("SECRET_KEY is still the development default")
        if len(self.SECRET_KEY) < 32:
            problems.append("SECRET_KEY must be at least 32 characters")
        if self.ADMIN_PASSWORD == "changeme":
            problems.append("ADMIN_PASSWORD is still the development default")
        if len(self.ADMIN_PASSWORD) < 12:
            problems.append("ADMIN_PASSWORD must be at least 12 characters")
        if problems:
            raise ValueError(
                "Insecure configuration with DEBUG=false:\n  - " + "\n  - ".join(problems)
            )
        return self

    @property
    def proxy(self) -> str | None:
        """Return the effective proxy URL (HTTPS takes priority)."""
        return self.HTTPS_PROXY or self.HTTP_PROXY or None

    @property
    def allowed_origins(self) -> list[str]:
        raw = self.ALLOWED_ORIGINS.strip()
        if raw.startswith("["):
            return json.loads(raw)
        return [o.strip() for o in raw.split(",") if o.strip()]


settings = Settings()
