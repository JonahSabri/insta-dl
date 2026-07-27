from __future__ import annotations

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
from app.api.routes.articles import router as articles_router
from app.api.routes.geo import router as geo_router
from app.api.routes.uploads import router as uploads_router


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    await init_db()
    # Load site settings (Instagram credentials etc.) into memory cache
    from app.database import AsyncSessionLocal
    from app.services import settings_store
    from app.services.article_seed import seed_articles_if_empty
    async with AsyncSessionLocal() as db:
        await settings_store.load_from_db(db)
        await seed_articles_if_empty(db)
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
    allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

# Trust X-Forwarded-For from local proxies (Next.js dev server / nginx)
class ForwardedForMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request, call_next):
        xff = request.headers.get("x-forwarded-for")
        if xff:
            real_ip = xff.split(",")[0].strip()
            # Patch scope so request.client.host also returns the real IP
            request.scope["client"] = (real_ip, 0)
        return await call_next(request)

app.add_middleware(ForwardedForMiddleware)

app.include_router(download_router, prefix="/api/v1")
app.include_router(admin_router, prefix="/api")
app.include_router(articles_router, prefix="/api")
app.include_router(geo_router, prefix="/api")
app.include_router(uploads_router, prefix="/api")


@app.get("/api/health")
async def health() -> dict:
    return {"status": "ok", "version": "1.0.0"}
