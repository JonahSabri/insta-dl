from __future__ import annotations

from datetime import UTC, datetime, timedelta

from pathlib import Path

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile
from jose import jwt
from pydantic import BaseModel
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import verify_admin
from app.config import settings
from app.database import get_db
from app.models.banner import Banner
from app.models.download import Download
from app.services import settings_store

router = APIRouter(prefix="/admin", tags=["admin"])


# ─── Auth ────────────────────────────────────────────────────────────────────

class LoginRequest(BaseModel):
    username: str
    password: str


class LoginResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


@router.post("/auth/login", response_model=LoginResponse)
async def login(body: LoginRequest) -> LoginResponse:
    if body.username != settings.ADMIN_USERNAME or body.password != settings.ADMIN_PASSWORD:
        raise HTTPException(status_code=401, detail="نام کاربری یا رمز عبور اشتباه است.")
    expire = datetime.now(UTC) + timedelta(minutes=settings.JWT_EXPIRE_MINUTES)
    token = jwt.encode(
        {"sub": body.username, "exp": expire},
        settings.SECRET_KEY,
        algorithm="HS256",
    )
    return LoginResponse(access_token=token)


# ─── Stats ───────────────────────────────────────────────────────────────────

@router.get("/stats")
async def stats(
    db: AsyncSession = Depends(get_db),
    _: str = Depends(verify_admin),
) -> dict:
    total = await db.scalar(select(func.count(Download.id))) or 0
    completed = await db.scalar(
        select(func.count(Download.id)).where(Download.status == "completed")
    ) or 0
    failed = await db.scalar(
        select(func.count(Download.id)).where(Download.status == "failed")
    ) or 0
    today_start = datetime.now(UTC).replace(hour=0, minute=0, second=0, microsecond=0)
    today = await db.scalar(
        select(func.count(Download.id)).where(Download.created_at >= today_start)
    ) or 0
    return {
        "total": total,
        "completed": completed,
        "failed": failed,
        "today": today,
        "success_rate": round((completed / total * 100) if total else 0, 1),
    }


# ─── Downloads ───────────────────────────────────────────────────────────────

@router.get("/downloads")
async def list_downloads(
    page: int = 1,
    limit: int = 20,
    db: AsyncSession = Depends(get_db),
    _: str = Depends(verify_admin),
) -> dict:
    offset = (page - 1) * limit
    result = await db.execute(
        select(Download).order_by(Download.created_at.desc()).offset(offset).limit(limit)
    )
    downloads = result.scalars().all()
    total = await db.scalar(select(func.count(Download.id))) or 0
    return {
        "items": [
            {
                "job_id": d.job_id,
                "ip_address": d.ip_address,
                "status": d.status,
                "media_type": d.media_type,
                "title": d.title,
                "created_at": d.created_at.isoformat(),
            }
            for d in downloads
        ],
        "total": total,
        "page": page,
        "pages": max(1, -(-total // limit)),
    }


# ─── Banners ─────────────────────────────────────────────────────────────────

class BannerCreate(BaseModel):
    name: str
    position: str  # header | sidebar | footer | result
    image_url: str
    link_url: str
    priority: int = 0
    expires_at: datetime | None = None


class BannerOut(BaseModel):
    id: str
    name: str
    position: str
    image_url: str
    link_url: str
    is_active: bool
    priority: int
    expires_at: datetime | None
    created_at: datetime

    model_config = {"from_attributes": True}


@router.get("/banners", response_model=list[BannerOut])
async def list_banners(
    db: AsyncSession = Depends(get_db),
    _: str = Depends(verify_admin),
) -> list[BannerOut]:
    result = await db.execute(select(Banner).order_by(Banner.priority.desc()))
    return result.scalars().all()


@router.post("/banners", response_model=BannerOut)
async def create_banner(
    body: BannerCreate,
    db: AsyncSession = Depends(get_db),
    _: str = Depends(verify_admin),
) -> BannerOut:
    banner = Banner(**body.model_dump())
    db.add(banner)
    await db.commit()
    await db.refresh(banner)
    return banner


@router.patch("/banners/{banner_id}/toggle")
async def toggle_banner(
    banner_id: str,
    db: AsyncSession = Depends(get_db),
    _: str = Depends(verify_admin),
) -> dict:
    banner = await db.get(Banner, banner_id)
    if not banner:
        raise HTTPException(status_code=404, detail="بنر یافت نشد.")
    banner.is_active = not banner.is_active
    await db.commit()
    return {"id": banner_id, "is_active": banner.is_active}


@router.delete("/banners/{banner_id}")
async def delete_banner(
    banner_id: str,
    db: AsyncSession = Depends(get_db),
    _: str = Depends(verify_admin),
) -> dict:
    banner = await db.get(Banner, banner_id)
    if not banner:
        raise HTTPException(status_code=404, detail="بنر یافت نشد.")
    await db.delete(banner)
    await db.commit()
    return {"deleted": True}


# ─── Instagram credentials ───────────────────────────────────────────────────

class CredentialsUpdate(BaseModel):
    instagram_username: str = ""
    instagram_password: str = ""


@router.get("/credentials")
async def get_credentials(
    _: str = Depends(verify_admin),
) -> dict:
    username = settings_store.get("instagram_username")
    has_password = bool(settings_store.get("instagram_password"))
    return {
        "instagram_username": username,
        "instagram_password_set": has_password,
    }


@router.post("/credentials")
async def save_credentials(
    body: CredentialsUpdate,
    db: AsyncSession = Depends(get_db),
    _: str = Depends(verify_admin),
) -> dict:
    await settings_store.save("instagram_username", body.instagram_username.strip(), db)
    if body.instagram_password:
        await settings_store.save("instagram_password", body.instagram_password, db)
    return {"saved": True, "username": body.instagram_username.strip()}


@router.delete("/credentials")
async def clear_credentials(
    db: AsyncSession = Depends(get_db),
    _: str = Depends(verify_admin),
) -> dict:
    await settings_store.save("instagram_username", "", db)
    await settings_store.save("instagram_password", "", db)
    return {"cleared": True}


# ─── Proxy settings ──────────────────────────────────────────────────────────

class ProxyUpdate(BaseModel):
    proxy: str = ""


@router.get("/proxy")
async def get_proxy(
    _: str = Depends(verify_admin),
) -> dict:
    proxy = settings_store.get("proxy") or settings.proxy or ""
    return {"proxy": proxy}


@router.post("/proxy")
async def save_proxy(
    body: ProxyUpdate,
    db: AsyncSession = Depends(get_db),
    _: str = Depends(verify_admin),
) -> dict:
    await settings_store.save("proxy", body.proxy.strip(), db)
    return {"saved": True, "proxy": body.proxy.strip()}


# ─── Cookies file ─────────────────────────────────────────────────────────────

COOKIES_PATH = Path(settings.DOWNLOADS_DIR) / "instagram_cookies.txt"


@router.get("/cookies")
async def get_cookies_status(
    _: str = Depends(verify_admin),
) -> dict:
    exists = COOKIES_PATH.exists()
    size = COOKIES_PATH.stat().st_size if exists else 0
    return {
        "has_cookies": exists,
        "file_size": size,
        "path": str(COOKIES_PATH) if exists else None,
    }


@router.post("/cookies")
async def upload_cookies(
    file: UploadFile = File(...),
    _: str = Depends(verify_admin),
) -> dict:
    if not file.filename:
        raise HTTPException(status_code=400, detail="فایل انتخاب نشده.")

    content = await file.read()
    if len(content) > 5 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="فایل بیش از حد بزرگ است (حداکثر ۵ مگابایت).")

    text = content.decode("utf-8", errors="replace")
    # Basic Netscape cookie file validation
    if "instagram.com" not in text:
        raise HTTPException(
            status_code=422,
            detail="فایل cookies معتبر به نظر نمی‌رسد. مطمئن شوید از اینستاگرام export شده.",
        )

    COOKIES_PATH.parent.mkdir(parents=True, exist_ok=True)
    COOKIES_PATH.write_text(text, encoding="utf-8")
    return {"saved": True, "file_size": len(content)}


@router.delete("/cookies")
async def delete_cookies(
    _: str = Depends(verify_admin),
) -> dict:
    if COOKIES_PATH.exists():
        COOKIES_PATH.unlink()
    return {"deleted": True}


# ─── Public banners (no auth) ─────────────────────────────────────────────────

@router.get("/banners/public")
async def public_banners(
    position: str | None = None,
    db: AsyncSession = Depends(get_db),
) -> list[dict]:
    now = datetime.now(UTC)
    query = select(Banner).where(Banner.is_active.is_(True)).order_by(Banner.priority.desc())
    if position:
        query = query.where(Banner.position == position)
    result = await db.execute(query)
    banners = result.scalars().all()
    return [
        {"id": b.id, "position": b.position, "image_url": b.image_url, "link_url": b.link_url}
        for b in banners
        if not b.expires_at or b.expires_at > now
    ]
