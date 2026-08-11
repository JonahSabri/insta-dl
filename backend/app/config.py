from __future__ import annotations

import json

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

    # Proxy — supports http/https/socks5, e.g. http://127.0.0.1:10809
    HTTP_PROXY: str | None = None
    HTTPS_PROXY: str | None = None

    # GapGPT (OpenAI-compatible) — article auto-translate
    GAPGPT_API_KEY: str = "sk-Xybap9XYzUlOb8T44v6tR9MdEcNxUf2kZyz1wysJe9YvnG8y"
    GAPGPT_BASE_URL: str = "https://api.gapgpt.app/v1"
    GAPGPT_MODEL: str = "gpt-5.2"

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
