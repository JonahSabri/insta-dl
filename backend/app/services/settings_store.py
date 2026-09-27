"""In-memory cache for site settings, backed by the DB."""
from __future__ import annotations

import json
import logging
from pathlib import Path

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import settings
from app.models.site_setting import SiteSetting

log = logging.getLogger(__name__)

# ─── In-memory cache ─────────────────────────────────────────────────────────
_cache: dict[str, str] = {}

# Keys that contain sensitive values and should be encrypted at rest.
_ENCRYPTED_KEYS = {"instagram_password"}


def _get_fernet():
    """Return a Fernet instance if a key is configured, else None."""
    key = settings.SETTINGS_ENCRYPTION_KEY
    if not key:
        return None
    try:
        from cryptography.fernet import Fernet
        return Fernet(key.encode())
    except Exception as exc:
        log.warning("Could not initialise Fernet: %s", exc)
        return None


def _encrypt(value: str) -> str:
    f = _get_fernet()
    if f is None:
        return value
    return f.encrypt(value.encode()).decode()


def _decrypt(value: str) -> str:
    f = _get_fernet()
    if f is None:
        return value
    try:
        return f.decrypt(value.encode()).decode()
    except Exception:
        # Value is likely plaintext (stored before encryption was enabled).
        return value


def get(key: str, default: str = "") -> str:
    raw = _cache.get(key, default)
    if key in _ENCRYPTED_KEYS:
        return _decrypt(raw)
    return raw


async def load_from_db(db: AsyncSession) -> None:
    """Called once at startup to populate the cache."""
    result = await db.execute(select(SiteSetting))
    for row in result.scalars().all():
        _cache[row.key] = row.value
    _write_gallery_dl_config()


async def save(key: str, value: str, db: AsyncSession) -> None:
    stored_value = _encrypt(value) if key in _ENCRYPTED_KEYS else value
    existing = await db.get(SiteSetting, key)
    if existing:
        existing.value = stored_value
    else:
        db.add(SiteSetting(key=key, value=stored_value))
    await db.commit()
    _cache[key] = stored_value
    _write_gallery_dl_config()


# ─── gallery-dl config helper ─────────────────────────────────────────────────

GALLERY_DL_CFG_PATH = Path("downloads/.gallery_dl_config.json")


def _write_gallery_dl_config() -> None:
    """Write/update gallery-dl config file with current Instagram credentials."""
    username = _cache.get("instagram_username", "")
    password = _cache.get("instagram_password", "")

    GALLERY_DL_CFG_PATH.parent.mkdir(parents=True, exist_ok=True)

    config: dict = {
        "extractor": {
            "instagram": {
                "sleep-request": [2, 5],
            }
        }
    }
    if username and password:
        config["extractor"]["instagram"]["username"] = username
        config["extractor"]["instagram"]["password"] = password

    GALLERY_DL_CFG_PATH.write_text(json.dumps(config, indent=2), encoding="utf-8")
