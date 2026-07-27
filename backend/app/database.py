from __future__ import annotations

from collections.abc import AsyncGenerator

from sqlalchemy.ext.asyncio import (
    AsyncSession,
    async_sessionmaker,
    create_async_engine,
)
from sqlalchemy.orm import DeclarativeBase

from app.config import settings

engine = create_async_engine(settings.DATABASE_URL, echo=settings.DEBUG)
AsyncSessionLocal = async_sessionmaker(engine, expire_on_commit=False)


class Base(DeclarativeBase):
    pass


async def get_db() -> AsyncGenerator[AsyncSession, None]:
    async with AsyncSessionLocal() as session:
        yield session


async def init_db() -> None:
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
        await conn.run_sync(_migrate_articles)


def _migrate_articles(sync_conn) -> None:
    """Add new article columns on existing SQLite DBs."""
    from sqlalchemy import inspect, text

    insp = inspect(sync_conn)
    if "articles" not in insp.get_table_names():
        return
    cols = {c["name"] for c in insp.get_columns("articles")}
    if "category" not in cols:
        sync_conn.execute(text("ALTER TABLE articles ADD COLUMN category VARCHAR(50) DEFAULT 'guide'"))
    if "cover_image" not in cols:
        sync_conn.execute(text("ALTER TABLE articles ADD COLUMN cover_image TEXT DEFAULT ''"))
