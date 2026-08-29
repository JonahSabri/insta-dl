from __future__ import annotations

from datetime import datetime, timedelta, timezone

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


# ─── User-Agent parser (no external deps) ────────────────────────────────────

import re as _re

def _parse_ua(ua_string: str | None) -> dict:
    """Return browser, device, and OS info parsed from a User-Agent string."""
    if not ua_string:
        return {"browser": "—", "device": "—", "os": "—"}

    ua = ua_string

    # ── OS ───────────────────────────────────────────────────────────────────
    if "Windows NT" in ua:
        nt = _re.search(r"Windows NT ([\d.]+)", ua)
        nt_map = {"10.0": "Windows 11/10", "6.3": "Windows 8.1",
                  "6.2": "Windows 8", "6.1": "Windows 7"}
        ver = nt.group(1) if nt else ""
        os_name = nt_map.get(ver, f"Windows {ver}") if ver else "Windows"
    elif "Android" in ua:
        ver = _re.search(r"Android ([\d.]+)", ua)
        os_name = f"Android {ver.group(1)}" if ver else "Android"
    elif "iPhone OS" in ua or "iPhone" in ua:
        ver = _re.search(r"OS ([\d_]+)", ua)
        os_name = f"iOS {ver.group(1).replace('_', '.')}" if ver else "iOS"
    elif "iPad" in ua:
        ver = _re.search(r"OS ([\d_]+)", ua)
        os_name = f"iPadOS {ver.group(1).replace('_', '.')}" if ver else "iPadOS"
    elif "Mac OS X" in ua:
        ver = _re.search(r"Mac OS X ([\d_]+)", ua)
        os_name = f"macOS {ver.group(1).replace('_', '.')}" if ver else "macOS"
    elif "Linux" in ua:
        os_name = "Linux"
    elif "CrOS" in ua:
        os_name = "ChromeOS"
    else:
        os_name = "—"

    # ── Device type ───────────────────────────────────────────────────────────
    bot_keywords = ("bot", "spider", "crawl", "slurp", "facebookexternalhit",
                    "Googlebot", "bingbot", "Baiduspider", "YandexBot")
    if any(k.lower() in ua.lower() for k in bot_keywords):
        device_type = "🤖 Bot"
    elif "iPad" in ua:
        device_type = "📟 Tablet"
    elif "Mobile" in ua or "Android" in ua and "Mobile" in ua:
        device_type = "📱 Mobile"
    elif "Android" in ua:
        device_type = "📟 Tablet"
    elif "iPhone" in ua:
        device_type = "📱 Mobile"
    else:
        device_type = "💻 Desktop"

    # ── Browser ───────────────────────────────────────────────────────────────
    # Order matters: check specific browsers before generic ones
    if m := _re.search(r"Edg(?:e|A|iOS)?/([\d]+)", ua):
        browser = f"Edge {m.group(1)}"
    elif m := _re.search(r"OPR/([\d]+)", ua):
        browser = f"Opera {m.group(1)}"
    elif m := _re.search(r"Opera/([\d]+)", ua):
        browser = f"Opera {m.group(1)}"
    elif m := _re.search(r"SamsungBrowser/([\d]+)", ua):
        browser = f"Samsung {m.group(1)}"
    elif m := _re.search(r"UCBrowser/([\d]+)", ua):
        browser = f"UC Browser {m.group(1)}"
    elif m := _re.search(r"YaBrowser/([\d]+)", ua):
        browser = f"Yandex {m.group(1)}"
    elif m := _re.search(r"Firefox/([\d]+)", ua):
        browser = f"Firefox {m.group(1)}"
    elif m := _re.search(r"FxiOS/([\d]+)", ua):
        browser = f"Firefox {m.group(1)}"
    elif m := _re.search(r"CriOS/([\d]+)", ua):
        browser = f"Chrome {m.group(1)}"
    elif m := _re.search(r"Chrome/([\d]+)", ua):
        browser = f"Chrome {m.group(1)}"
    elif m := _re.search(r"Version/([\d]+).*Safari", ua):
        browser = f"Safari {m.group(1)}"
    elif "Safari" in ua:
        browser = "Safari"
    elif "MSIE" in ua or "Trident" in ua:
        browser = "Internet Explorer"
    else:
        browser = "—"

    return {"browser": browser, "device": device_type, "os": os_name}

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
        raise HTTPException(status_code=401, detail="Invalid username or password.")
    expire = datetime.now(timezone.utc) + timedelta(minutes=settings.JWT_EXPIRE_MINUTES)
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
    today_start = datetime.now(timezone.utc).replace(hour=0, minute=0, second=0, microsecond=0)
    today = await db.scalar(
        select(func.count(Download.id)).where(Download.created_at >= today_start)
    ) or 0

    async def _count_type(media_type: str, *, completed_only: bool = False) -> int:
        q = select(func.count(Download.id)).where(Download.media_type == media_type)
        if completed_only:
            q = q.where(Download.status == "completed")
        return await db.scalar(q) or 0

    bio_total = await _count_type("bio")
    bio_ok = await _count_type("bio", completed_only=True)
    caption_total = await _count_type("caption")
    caption_ok = await _count_type("caption", completed_only=True)
    highlight_total = await _count_type("highlight")
    highlight_ok = await _count_type("highlight", completed_only=True)

    # Media downloads exclude text tools (bio/caption)
    media_types_excl = ("bio", "caption")
    media_total = await db.scalar(
        select(func.count(Download.id)).where(Download.media_type.notin_(media_types_excl))
    ) or 0
    media_completed = await db.scalar(
        select(func.count(Download.id)).where(
            Download.media_type.notin_(media_types_excl),
            Download.status == "completed",
        )
    ) or 0

    return {
        "total": total,
        "completed": completed,
        "failed": failed,
        "today": today,
        "success_rate": round((completed / total * 100) if total else 0, 1),
        "bio_lookups": bio_total,
        "bio_success": bio_ok,
        "profile_lookups": bio_total,  # alias — bio tool = profile info
        "caption_lookups": caption_total,
        "caption_success": caption_ok,
        "highlight_downloads": highlight_total,
        "highlight_success": highlight_ok,
        "media_downloads": media_total,
        "media_completed": media_completed,
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
                **_parse_ua(d.user_agent),
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
        raise HTTPException(status_code=404, detail="Banner not found.")
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
        raise HTTPException(status_code=404, detail="Banner not found.")
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
        raise HTTPException(status_code=400, detail="No file selected.")

    content = await file.read()
    if len(content) > 5 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="File too large (max 5MB).")

    text = content.decode("utf-8", errors="replace")
    # Basic Netscape cookie file validation
    if "instagram.com" not in text:
        raise HTTPException(
            status_code=422,
            detail="Cookie file does not look valid. Make sure it was exported from Instagram.",
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


# ─── Rate limit settings ─────────────────────────────────────────────────────

class RateLimitUpdate(BaseModel):
    enabled: bool
    daily_limit: int


@router.get("/rate-limit")
async def get_rate_limit(
    _: str = Depends(verify_admin),
) -> dict:
    enabled_str = settings_store.get("rate_limit_enabled", "true")
    daily_str = settings_store.get("rate_limit_daily", "")
    return {
        "enabled": enabled_str.lower() != "false",
        "daily_limit": int(daily_str) if daily_str.isdigit() and int(daily_str) > 0 else settings.GUEST_DAILY_LIMIT,
    }


@router.post("/rate-limit")
async def save_rate_limit(
    body: RateLimitUpdate,
    db: AsyncSession = Depends(get_db),
    _: str = Depends(verify_admin),
) -> dict:
    if body.daily_limit < 1:
        raise HTTPException(status_code=400, detail="daily_limit must be at least 1.")
    await settings_store.save("rate_limit_enabled", "true" if body.enabled else "false", db)
    await settings_store.save("rate_limit_daily", str(body.daily_limit), db)
    return {"saved": True, "enabled": body.enabled, "daily_limit": body.daily_limit}


# ─── Public banners (no auth) ─────────────────────────────────────────────────

@router.get("/banners/public")
async def public_banners(
    position: str | None = None,
    db: AsyncSession = Depends(get_db),
) -> list[dict]:
    now = datetime.now(timezone.utc)
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
