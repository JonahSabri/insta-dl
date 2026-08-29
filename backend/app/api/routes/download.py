from __future__ import annotations

import asyncio
import hashlib
import urllib.request
import uuid
from pathlib import Path

import mimetypes

from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException, Query, Request
from fastapi.responses import FileResponse, Response
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import settings
from app.database import get_db
from app.models.download import Download
from app.services.downloader import (
    detect_media_type,
    download_media,
    fetch_caption,
    fetch_profile_bio,
    get_preview,
    validate_url,
)
from app.services.job_store import create_job, get_job, update_job
from app.services.rate_limiter import check_rate_limit, record_download

router = APIRouter(prefix="/download", tags=["download"])

# Directory for locally cached preview thumbnails (so CDN URLs don't expire)
_THUMB_CACHE_DIR = Path(settings.DOWNLOADS_DIR) / "thumb_cache"


def _real_ip(request: Request) -> str:
    """Extract the real client IP, handling reverse-proxy forwarded headers."""
    forwarded = (
        request.headers.get("x-forwarded-for")
        or request.headers.get("x-real-ip")
        or ""
    )
    if forwarded:
        return forwarded.split(",")[0].strip()
    return request.client.host if request.client else "unknown"


class AnalyzeRequest(BaseModel):
    url: str
    # Frontend passes the already-proxied preview thumbnail URL so we can
    # store it as a guaranteed fallback if yt-dlp doesn't write a thumbnail.
    preview_thumbnail_url: str | None = None


class AnalyzeResponse(BaseModel):
    job_id: str
    status: str
    media_type: str
    remaining: int


class CarouselFile(BaseModel):
    index: int
    name: str
    media_type: str   # "image" | "video"
    url: str


class StatusResponse(BaseModel):
    job_id: str
    status: str
    progress: int
    title: str | None = None
    thumbnail_url: str | None = None
    media_type: str | None = None
    file_count: int = 1
    carousel_files: list[CarouselFile] | None = None
    error: str | None = None


class PreviewResponse(BaseModel):
    title: str
    thumbnail_url: str | None = None
    duration: float | None = None
    uploader: str | None = None
    media_type: str


class BioRequest(BaseModel):
    username: str


class BioResponse(BaseModel):
    username: str
    full_name: str = ""
    biography: str = ""
    followers: int | None = None
    following: int | None = None
    posts: int | None = None
    profile_pic_url: str | None = None
    is_verified: bool = False
    external_url: str = ""


class CaptionRequest(BaseModel):
    url: str


class CaptionResponse(BaseModel):
    caption: str
    uploader: str | None = None
    media_type: str
    shortcode: str | None = None
    title: str = ""


# ─── Thumbnail proxy helpers ─────────────────────────────────────────────────

def _thumb_cache_path(url: str) -> Path:
    key = hashlib.sha256(url.encode()).hexdigest()[:24]
    return _THUMB_CACHE_DIR / f"{key}.jpg"


def _fetch_thumbnail_sync(target: str) -> bytes:
    req = urllib.request.Request(
        target,
        headers={
            "User-Agent": (
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                "AppleWebKit/537.36 (KHTML, like Gecko) "
                "Chrome/125.0.0.0 Safari/537.36"
            ),
            "Referer": "https://www.instagram.com/",
            "Accept": "image/avif,image/webp,image/apng,image/*,*/*;q=0.8",
        },
    )
    with urllib.request.urlopen(req, timeout=12) as resp:  # noqa: S310
        return resp.read()


# ─── Routes ──────────────────────────────────────────────────────────────────

@router.post("/preview", response_model=PreviewResponse)
async def preview(
    body: AnalyzeRequest,
    request: Request,
) -> PreviewResponse:
    """Fast metadata extraction — no file download, no rate-limit consumption."""
    try:
        validate_url(body.url)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc))

    try:
        data = await asyncio.to_thread(get_preview, body.url)
    except RuntimeError as exc:
        raise HTTPException(status_code=422, detail=str(exc))

    # Pre-fetch and cache the thumbnail locally so the CDN URL never expires
    if data.get("thumbnail_url"):
        _THUMB_CACHE_DIR.mkdir(parents=True, exist_ok=True)
        cache_path = _thumb_cache_path(data["thumbnail_url"])
        if not cache_path.exists():
            try:
                raw = await asyncio.to_thread(_fetch_thumbnail_sync, data["thumbnail_url"])
                cache_path.write_bytes(raw)
            except Exception:
                pass  # leave thumbnail_url as-is; proxy will handle it

    return PreviewResponse(**data)


@router.get("/thumbnail-proxy")
async def thumbnail_proxy(url: str = Query(..., description="Instagram CDN URL to proxy")) -> Response:
    """Proxy an Instagram CDN thumbnail. Caches locally so the URL never expires."""
    _THUMB_CACHE_DIR.mkdir(parents=True, exist_ok=True)
    cache_path = _thumb_cache_path(url)

    # Serve from local cache if already downloaded
    if cache_path.exists():
        return FileResponse(
            path=cache_path,
            media_type="image/jpeg",
            headers={"Cache-Control": "public, max-age=86400"},
        )

    # Fetch from Instagram CDN and cache
    try:
        data = await asyncio.to_thread(_fetch_thumbnail_sync, url)
        cache_path.write_bytes(data)
    except Exception as exc:
        raise HTTPException(status_code=502, detail=f"Could not fetch thumbnail: {exc}") from exc

    return Response(
        content=data,
        media_type="image/jpeg",
        headers={"Cache-Control": "public, max-age=86400"},
    )


async def _run_download(job_id: str, url: str, preview_thumbnail_url: str | None, db: AsyncSession) -> None:
    await update_job(job_id, status="processing", progress=30)
    try:
        result = await asyncio.to_thread(download_media, url, job_id)

        # Always store the preview thumbnail URL so we can fall back to it if
        # the downloaded thumbnail file is unavailable for any reason.
        if preview_thumbnail_url:
            result["preview_thumbnail_url"] = preview_thumbnail_url

        await update_job(job_id, status="completed", progress=100, result=result)

        async with db as session:
            record = await session.get(Download, job_id)
            if record:
                record.status = "completed"
                record.title = result.get("title")
                record.media_type = result.get("media_type", "unknown")
                await session.commit()

    except Exception as exc:
        await update_job(job_id, status="failed", error=str(exc))
        async with db as session:
            record = await session.get(Download, job_id)
            if record:
                record.status = "failed"
                record.error_message = str(exc)
                await session.commit()


@router.post("/bio", response_model=BioResponse)
async def bio_lookup(body: BioRequest) -> BioResponse:
    """Public Instagram profile bio / info (no media download)."""
    try:
        data = await asyncio.to_thread(fetch_profile_bio, body.username)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    except RuntimeError as exc:
        raise HTTPException(status_code=422, detail=str(exc)) from exc
    return BioResponse(**data)


@router.post("/caption", response_model=CaptionResponse)
async def caption_lookup(body: CaptionRequest) -> CaptionResponse:
    """Extract caption text from a public post/reel URL."""
    try:
        validate_url(body.url)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    try:
        data = await asyncio.to_thread(fetch_caption, body.url)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    except RuntimeError as exc:
        raise HTTPException(status_code=422, detail=str(exc)) from exc
    return CaptionResponse(**data)


@router.post("/analyze", response_model=AnalyzeResponse)
async def analyze(
    body: AnalyzeRequest,
    request: Request,
    background_tasks: BackgroundTasks,
    db: AsyncSession = Depends(get_db),
) -> AnalyzeResponse:
    ip = _real_ip(request)

    try:
        validate_url(body.url)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc))

    from app.services import settings_store as _ss
    _rl_enabled = _ss.get("rate_limit_enabled", "true").lower() != "false"
    _rl_limit_str = _ss.get("rate_limit_daily", "")
    _daily_limit = int(_rl_limit_str) if _rl_limit_str.isdigit() and int(_rl_limit_str) > 0 else settings.GUEST_DAILY_LIMIT

    if _rl_enabled:
        allowed, remaining = check_rate_limit(ip, _daily_limit)
        if not allowed:
            raise HTTPException(
                status_code=429,
                detail={"code": "RATE_LIMIT_EXCEEDED", "limit": _daily_limit},
            )
    else:
        remaining = _daily_limit

    job_id = str(uuid.uuid4())
    await create_job(job_id)
    record_download(ip)

    record = Download(
        id=job_id,
        job_id=job_id,
        ip_address=ip,
        user_agent=request.headers.get("user-agent"),
        instagram_url=body.url,
        status="pending",
        media_type=detect_media_type(body.url),
    )
    db.add(record)
    await db.commit()

    from app.database import AsyncSessionLocal
    session_factory = AsyncSessionLocal()
    background_tasks.add_task(
        _run_download, job_id, body.url, body.preview_thumbnail_url, session_factory
    )

    return AnalyzeResponse(
        job_id=job_id,
        status="pending",
        media_type=detect_media_type(body.url),
        remaining=remaining,
    )


@router.get("/{job_id}/status", response_model=StatusResponse)
async def status(job_id: str) -> StatusResponse:
    job = await get_job(job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    result = job.result or {}

    # Choose the best thumbnail URL available
    thumbnail_url: str | None = None
    thumb_path_str = result.get("thumbnail_path")
    if thumb_path_str and job.status == "completed":
        # Verify the file actually exists before advertising the URL
        if Path(thumb_path_str).exists():
            thumbnail_url = f"/api/v1/download/{job_id}/thumbnail"

    # Fall back to the pre-cached preview thumbnail (always reliable)
    if not thumbnail_url and result.get("preview_thumbnail_url"):
        thumbnail_url = result["preview_thumbnail_url"]

    # Build carousel_files list if available
    carousel_files: list[CarouselFile] | None = None
    raw_carousel = result.get("carousel_files")
    if raw_carousel and job.status == "completed":
        carousel_files = [
            CarouselFile(
                index=i,
                name=item["name"],
                media_type=item["media_type"],
                url=f"/api/v1/download/{job_id}/file/{i}",
            )
            for i, item in enumerate(raw_carousel)
        ]

    return StatusResponse(
        job_id=job_id,
        status=job.status,
        progress=job.progress,
        title=result.get("title"),
        thumbnail_url=thumbnail_url,
        media_type=result.get("media_type"),
        file_count=result.get("file_count", 1),
        carousel_files=carousel_files,
        error=job.error,
    )


@router.get("/{job_id}/thumbnail")
async def get_thumbnail(job_id: str) -> FileResponse:
    job = await get_job(job_id)
    if not job or job.status != "completed" or not job.result:
        raise HTTPException(status_code=404, detail="Thumbnail not available")

    thumb_path_str = job.result.get("thumbnail_path")
    if not thumb_path_str:
        raise HTTPException(status_code=404, detail="No thumbnail for this job")

    thumb_path = Path(thumb_path_str)
    if not thumb_path.exists():
        raise HTTPException(status_code=410, detail="Thumbnail file has been cleaned up")

    media_type, _ = mimetypes.guess_type(str(thumb_path))
    return FileResponse(
        path=thumb_path,
        media_type=media_type or "image/jpeg",
        headers={"Cache-Control": "public, max-age=3600"},
    )


@router.get("/{job_id}/file/{index}")
async def download_carousel_file(job_id: str, index: int) -> FileResponse:
    """Serve a single slide from a carousel by index."""
    job = await get_job(job_id)
    if not job or job.status != "completed":
        raise HTTPException(status_code=404, detail="فایل آماده نیست یا منقضی شده.")
    if not job.result:
        raise HTTPException(status_code=500, detail="نتیجه job یافت نشد.")

    carousel = job.result.get("carousel_files")
    if not carousel or index < 0 or index >= len(carousel):
        raise HTTPException(status_code=404, detail="فایل در این ایندکس وجود ندارد.")

    file_path = Path(carousel[index]["path"])
    if not file_path.exists():
        raise HTTPException(status_code=410, detail="فایل حذف شده است.")

    ext = file_path.suffix.lower()
    media_type_map = {
        ".mp4": "video/mp4", ".mkv": "video/x-matroska", ".mov": "video/quicktime",
        ".webm": "video/webm", ".m4v": "video/mp4",
        ".jpg": "image/jpeg", ".jpeg": "image/jpeg",
        ".png": "image/png", ".webp": "image/webp",
    }
    mime = media_type_map.get(ext, "application/octet-stream")
    return FileResponse(path=file_path, filename=file_path.name, media_type=mime)


@router.get("/{job_id}/file")
async def download_file(job_id: str) -> FileResponse:
    job = await get_job(job_id)
    if not job or job.status != "completed":
        raise HTTPException(status_code=404, detail="فایل آماده نیست یا منقضی شده.")
    if not job.result:
        raise HTTPException(status_code=500, detail="نتیجه job یافت نشد.")

    file_path = Path(job.result["file_path"])
    if not file_path.exists():
        raise HTTPException(status_code=410, detail="فایل حذف شده است.")

    ext = file_path.suffix.lower()
    media_type_map = {
        ".mp4": "video/mp4", ".mkv": "video/x-matroska", ".mov": "video/quicktime",
        ".webm": "video/webm", ".m4v": "video/mp4",
        ".jpg": "image/jpeg", ".jpeg": "image/jpeg",
        ".png": "image/png", ".webp": "image/webp",
        ".zip": "application/zip",
    }
    mime = media_type_map.get(ext, "application/octet-stream")

    return FileResponse(path=file_path, filename=file_path.name, media_type=mime)
