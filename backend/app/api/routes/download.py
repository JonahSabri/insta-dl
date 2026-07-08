from __future__ import annotations

import asyncio
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
from app.services.downloader import detect_media_type, download_media, get_preview, validate_url
from app.services.job_store import create_job, get_job, update_job
from app.services.rate_limiter import check_rate_limit, record_download

router = APIRouter(prefix="/download", tags=["download"])


def _real_ip(request: Request) -> str:
    """Extract the real client IP, handling reverse-proxy forwarded headers."""
    # Next.js rewrite passes X-Forwarded-For; also respect X-Real-IP
    forwarded = (
        request.headers.get("x-forwarded-for")
        or request.headers.get("x-real-ip")
        or ""
    )
    if forwarded:
        # X-Forwarded-For can be a comma-separated list; take the first (real client)
        return forwarded.split(",")[0].strip()
    return request.client.host if request.client else "unknown"


class AnalyzeRequest(BaseModel):
    url: str


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

    return PreviewResponse(**data)


@router.get("/thumbnail-proxy")
async def thumbnail_proxy(url: str = Query(..., description="Instagram CDN URL to proxy")) -> Response:
    """Proxy an Instagram CDN thumbnail so the browser never hits the CDN directly."""

    def _fetch(target: str) -> tuple[bytes, str]:
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
            data = resp.read()
            ct = resp.headers.get("Content-Type", "image/jpeg").split(";")[0].strip()
            return data, ct

    try:
        data, content_type = await asyncio.to_thread(_fetch, url)
    except Exception as exc:
        raise HTTPException(status_code=502, detail=f"Could not fetch thumbnail: {exc}") from exc

    return Response(
        content=data,
        media_type=content_type,
        headers={
            "Cache-Control": "public, max-age=600",
            "X-Content-Type-Options": "nosniff",
        },
    )


async def _run_download(job_id: str, url: str, db: AsyncSession) -> None:
    await update_job(job_id, status="processing", progress=30)
    try:
        result = await asyncio.to_thread(download_media, url, job_id)
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

    allowed, remaining = check_rate_limit(ip, settings.GUEST_DAILY_LIMIT)
    if not allowed:
        raise HTTPException(
            status_code=429,
            detail="سهمیه روزانه شما تمام شده است. فردا دوباره تلاش کنید.",
        )

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
    background_tasks.add_task(_run_download, job_id, body.url, session_factory)

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

    # Point thumbnail to our own endpoint so the browser doesn't hit Instagram CDN
    thumbnail_url: str | None = None
    if result.get("thumbnail_path") and job.status == "completed":
        thumbnail_url = f"/api/v1/download/{job_id}/thumbnail"

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
