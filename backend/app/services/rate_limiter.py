"""Simple in-memory rate limiter based on IP + UTC day window."""
from __future__ import annotations

from collections import defaultdict
from datetime import UTC, datetime

_counters: dict[str, list[datetime]] = defaultdict(list)


def _today_counts(ip: str) -> list[datetime]:
    now = datetime.now(UTC)
    today_start = now.replace(hour=0, minute=0, second=0, microsecond=0)
    _counters[ip] = [ts for ts in _counters[ip] if ts >= today_start]
    return _counters[ip]


def check_rate_limit(ip: str, daily_limit: int) -> tuple[bool, int]:
    """Returns (is_allowed, remaining_after_this_request)."""
    counts = _today_counts(ip)
    if len(counts) >= daily_limit:
        return False, 0
    return True, daily_limit - len(counts) - 1


def record_download(ip: str) -> None:
    _today_counts(ip)
    _counters[ip].append(datetime.now(UTC))


def get_remaining(ip: str, daily_limit: int) -> int:
    return max(0, daily_limit - len(_today_counts(ip)))
