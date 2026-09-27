from __future__ import annotations

import ipaddress
import os
from contextlib import asynccontextmanager
from typing import AsyncGenerator

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from starlette.middleware.base import BaseHTTPMiddleware

from app.config import settings
from app.database import init_db
# Import all models so Base.metadata knows about them before init_db()
import app.models  # noqa: F401
from app.api.routes.download import router as download_router
from app.api.routes.admin import router as admin_router

_DEFAULT_TRUSTED = "127.0.0.0/8,::1/128,10.0.0.0/8,172.16.0.0/12,192.168.0.0/16"
TRUSTED_PROXY_NETS = [
    ipaddress.ip_network(c.strip())
    for c in os.getenv("TRUSTED_PROXY_CIDRS", _DEFAULT_TRUSTED).split(",")
    if c.strip()
]


def _is_trusted(host: str) -> bool:
    try:
        addr = ipaddress.ip_address(host)
    except ValueError:
        return False
    return any(addr in net for net in TRUSTED_PROXY_NETS)


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    await init_db()
    # Load site settings (Instagram credentials etc.) into memory cache
    from app.database import AsyncSessionLocal
    from app.services import settings_store
    async with AsyncSessionLocal() as db:
        await settings_store.load_from_db(db)
    yield


app = FastAPI(
    title="Insta Downloader API",
    version="1.0.0",
    docs_url="/api/docs" if settings.DEBUG else None,
    redoc_url=None,
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

class ForwardedForMiddleware(BaseHTTPMiddleware):
    """Trust X-Forwarded-For only from known private/proxy CIDRs.

    Takes the right-most untrusted hop so a spoofed header in the
    leftmost position cannot bypass the per-IP download cap.
    """
    async def dispatch(self, request, call_next):
        client = request.scope.get("client")
        peer = client[0] if client else ""
        if _is_trusted(peer):
            xff = request.headers.get("x-forwarded-for")
            if xff:
                for candidate in reversed([p.strip() for p in xff.split(",")]):
                    if candidate and not _is_trusted(candidate):
                        request.scope["client"] = (candidate, 0)
                        break
        return await call_next(request)

app.add_middleware(ForwardedForMiddleware)

app.include_router(download_router, prefix="/api/v1")
app.include_router(admin_router, prefix="/api")


@app.get("/api/health")
async def health() -> dict:
    return {"status": "ok", "version": "1.0.0"}
