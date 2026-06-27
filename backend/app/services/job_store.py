"""In-memory job store for tracking download task states."""
from __future__ import annotations

import asyncio
from dataclasses import dataclass, field
from datetime import UTC, datetime
from typing import Any


@dataclass
class JobInfo:
    job_id: str
    status: str = "pending"  # pending | processing | completed | failed
    progress: int = 0
    result: dict[str, Any] | None = None
    error: str | None = None
    created_at: datetime = field(default_factory=lambda: datetime.now(UTC))


_store: dict[str, JobInfo] = {}
_lock = asyncio.Lock()


async def create_job(job_id: str) -> JobInfo:
    async with _lock:
        job = JobInfo(job_id=job_id)
        _store[job_id] = job
        return job


async def get_job(job_id: str) -> JobInfo | None:
    return _store.get(job_id)


async def update_job(job_id: str, **kwargs: Any) -> None:
    async with _lock:
        if job_id in _store:
            for key, value in kwargs.items():
                setattr(_store[job_id], key, value)


async def cleanup_old_jobs(max_age_seconds: int = 3600) -> None:
    async with _lock:
        now = datetime.now(UTC)
        stale = [
            jid
            for jid, job in _store.items()
            if (now - job.created_at).total_seconds() > max_age_seconds
        ]
        for jid in stale:
            del _store[jid]
