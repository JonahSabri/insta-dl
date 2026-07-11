"""In-memory cache for site settings, backed by the DB."""
from __future__ import annotations

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


async def save(key: str, value: str, db: AsyncSession) -> None:
    existing = await db.get(SiteSetting, key)
    if existing:
        existing.value = value
    else:
        db.add(SiteSetting(key=key, value=value))
    await db.commit()
    _cache[key] = value
