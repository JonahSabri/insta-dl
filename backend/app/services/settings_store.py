"""In-memory cache for site settings, backed by the DB."""
from __future__ import annotations

import json
from pathlib import Path

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.site_setting import SiteSetting

# ─── In-memory cache ─────────────────────────────────────────────────────────
_cache: dict[str, str] = {}


def get(key: str, default: str = "") -> str:
    return _cache.get(key, default)


async def load_from_db(db: AsyncSession) -> None:
    """Called once at startup to populate the cache."""
    result = await db.execute(select(SiteSetting))
    for row in result.scalars().all():
        _cache[row.key] = row.value
    _write_gallery_dl_config()


async def save(key: str, value: str, db: AsyncSession) -> None:
    existing = await db.get(SiteSetting, key)
    if existing:
        existing.value = value
    else:
        db.add(SiteSetting(key=key, value=value))
    await db.commit()
    _cache[key] = value
    _write_gallery_dl_config()


# ─── gallery-dl config helper ─────────────────────────────────────────────────

GALLERY_DL_CFG_PATH = Path("downloads/.gallery_dl_config.json")


_IG_MOBILE_UA = (
    "Instagram 269.0.0.18.75 Android (26/8.0.0; 480dpi; 1080x1920; "
    "OnePlus; ONEPLUS A3010; OnePlus3T; qcom; en_US; 314665256)"
)


def _write_gallery_dl_config() -> None:
    """Write/update gallery-dl config file with current Instagram credentials."""
    username = _cache.get("instagram_username", "")
    password = _cache.get("instagram_password", "")

    GALLERY_DL_CFG_PATH.parent.mkdir(parents=True, exist_ok=True)

    config: dict = {
        "extractor": {
            "instagram": {
                # Mobile app UA bypasses the redirect-to-home-page issue
                "user-agent": _IG_MOBILE_UA,
                "sleep-request": [2, 5],
            }
        }
    }
    if username and password:
        config["extractor"]["instagram"]["username"] = username
        config["extractor"]["instagram"]["password"] = password

    GALLERY_DL_CFG_PATH.write_text(json.dumps(config, indent=2), encoding="utf-8")
