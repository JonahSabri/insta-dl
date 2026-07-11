"""Instagram media downloader — curl_cffi + login cookies (from the admin panel).

Handles Reels, Posts, Carousels, IGTV and Stories by requesting the page with a
real browser TLS fingerprint (curl_cffi impersonate) plus the login cookies that
were uploaded in the admin panel, parsing the embedded media JSON, and
downloading the direct CDN URLs (both the video and its cover).

This replaces the previous yt-dlp / gallery-dl / instaloader stack, which
Instagram now answers with empty/403 responses.
"""
from __future__ import annotations

import json
import re
import shutil
import zipfile
from pathlib import Path
from typing import Any
from urllib.parse import urlparse

from curl_cffi import requests as creq

from app.config import settings
from app.services import settings_store

ALLOWED_HOSTS = {"instagram.com", "www.instagram.com", "m.instagram.com"}
IMAGE_EXTS = {".jpg", ".jpeg", ".webp", ".png"}
VIDEO_EXTS = {".mp4", ".mkv", ".mov", ".webm", ".m4v"}

IG_APP_ID = "936619743392459"
IMPERSONATE = "chrome124"
_BROWSER_UA = (
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
    "(KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36"
)

# media_type in Instagram JSON: 1=photo, 2=video, 8=carousel


# ─── URL helpers ─────────────────────────────────────────────────────────────

def validate_url(url: str) -> None:
    parsed = urlparse(url)
    if not parsed.scheme.startswith("http"):
        raise ValueError("لینک باید با http یا https شروع شود.")
    if parsed.netloc.lower() not in ALLOWED_HOSTS:
        raise ValueError("فقط لینک‌های اینستاگرام پشتیبانی می‌شوند.")


def detect_media_type(url: str) -> str:
    if "/reel" in url:
        return "reel"
    if "/stories/" in url:
        return "story"
    if "/tv/" in url:
        return "igtv"
    if "/p/" in url:
        return "post"
    return "unknown"


def _shortcode(url: str) -> str | None:
    m = re.search(r"/(?:p|reel|reels|tv)/([A-Za-z0-9_-]+)", url)
    return m.group(1) if m else None


def _story_username(url: str) -> str:
    m = re.search(r"/stories/([^/?#]+)", url)
    return m.group(1) if m else "instagram"


def _clean_url(url: str) -> str:
    return url.split("?")[0].rstrip("/") + "/"


# ─── Credential / cookie helpers ─────────────────────────────────────────────

_COOKIES_PATH = Path(settings.DOWNLOADS_DIR) / "instagram_cookies.txt"


def _cookies_file() -> str | None:
    """Path to the login-cookie file, preferring .env then the admin upload."""
    if settings.INSTAGRAM_COOKIES_FILE:
        p = Path(settings.INSTAGRAM_COOKIES_FILE)
        if p.exists():
            return str(p)
    if _COOKIES_PATH.exists():
        return str(_COOKIES_PATH)
    return None


def _ig_credentials() -> tuple[str | None, str | None]:
    username = settings_store.get("instagram_username") or None
    password = settings_store.get("instagram_password") or None
    return username, password


def _has_auth() -> bool:
    return bool(_cookies_file())


def _load_cookies(path: str) -> dict[str, str]:
    """Parse a cookie file robustly — Netscape (with/without header, #HttpOnly_
    lines) or a JSON array export from a browser extension."""
    raw = Path(path).read_text(encoding="utf-8", errors="ignore").strip()
    jar: dict[str, str] = {}

    # JSON export: [{"name": "...", "value": "..."}, ...]
    if raw.startswith("[") or raw.startswith("{"):
        try:
            data = json.loads(raw)
            items = data if isinstance(data, list) else data.get("cookies", [])
            for c in items:
                if isinstance(c, dict) and c.get("name"):
                    jar[c["name"]] = c.get("value", "")
            if jar:
                return jar
        except Exception:
            pass

    # Netscape / tab-separated format
    for line in raw.splitlines():
        line = line.rstrip("\n")
        if not line.strip():
            continue
        # Keep #HttpOnly_ lines (strip the marker); skip real comments
        if line.startswith("#HttpOnly_"):
            line = line[len("#HttpOnly_"):]
        elif line.lstrip().startswith("#"):
            continue
        parts = line.split("\t")
        if len(parts) >= 7:
            name, value = parts[5], parts[6]
            if name:
                jar[name] = value

    return jar


def _build_session() -> tuple[creq.Session, bool]:
    """Create a curl_cffi session with browser fingerprint, cookies and proxy."""
    s = creq.Session(impersonate=IMPERSONATE)
    s.headers.update({
        "User-Agent": _BROWSER_UA,
        "X-IG-App-ID": IG_APP_ID,
        "Referer": "https://www.instagram.com/",
    })

    proxy = settings_store.get("proxy") or settings.proxy
    if proxy:
        s.proxies = {"http": proxy, "https": proxy}

    has_cookies = False
    cookies_path = _cookies_file()
    if cookies_path:
        try:
            jar = _load_cookies(cookies_path)
            for k, v in jar.items():
                s.cookies.set(k, v, domain=".instagram.com")
            has_cookies = "sessionid" in jar
        except Exception:
            has_cookies = False

    return s, has_cookies


# ─── Media extraction (posts / reels / carousels) ────────────────────────────

def _walk_find_media(obj: Any, code: str, acc: list) -> None:
    if isinstance(obj, dict):
        if obj.get("code") == code and (
            "video_versions" in obj or "image_versions2" in obj or "carousel_media" in obj
        ):
            acc.append(obj)
        for v in obj.values():
            _walk_find_media(v, code, acc)
    elif isinstance(obj, list):
        for v in obj:
            _walk_find_media(v, code, acc)


def _completeness(m: dict) -> int:
    score = 0
    if m.get("carousel_media"):
        score += 100 + len(m["carousel_media"])
    if m.get("video_versions"):
        score += 50
    cands = (m.get("image_versions2") or {}).get("candidates") or []
    score += len(cands)
    return score


def find_primary_media(html: str, code: str) -> dict | None:
    blocks = re.findall(
        r'<script type="application/json"[^>]*>(.*?)</script>', html, re.S
    )
    candidates: list[dict] = []
    for b in blocks:
        if code not in b or ("video_versions" not in b and "image_versions2" not in b):
            continue
        try:
            data = json.loads(b)
        except json.JSONDecodeError:
            continue
        _walk_find_media(data, code, candidates)
    if not candidates:
        return None
    return max(candidates, key=_completeness)


def _best_video(item: dict) -> str | None:
    vv = item.get("video_versions") or []
    return vv[0]["url"] if vv else None


def _best_cover(item: dict) -> str | None:
    cands = (item.get("image_versions2") or {}).get("candidates") or []
    if not cands:
        return None
    best = max(cands, key=lambda c: (c.get("width") or 0) * (c.get("height") or 0))
    return best.get("url")


def _media_owner(media: dict) -> str | None:
    for key in ("owner", "user"):
        u = media.get(key)
        if isinstance(u, dict) and u.get("username"):
            return u["username"]
    return None


def _media_caption(media: dict) -> str | None:
    cap = media.get("caption")
    if isinstance(cap, dict) and cap.get("text"):
        return cap["text"]
    if isinstance(cap, str) and cap:
        return cap
    edges = (media.get("edge_media_to_caption") or {}).get("edges") or []
    if edges:
        return edges[0].get("node", {}).get("text")
    return None


def _collect_targets(media: dict) -> list[dict]:
    targets: list[dict] = []
    children = media.get("carousel_media") or [media]
    for child in children:
        video = _best_video(child)
        cover = _best_cover(child)
        targets.append({
            "kind": "video" if video else "image",
            "video_url": video,
            "cover_url": cover,
            "pk": str(child.get("pk")) if child.get("pk") else None,
        })
    return targets


# ─── Story extraction ─────────────────────────────────────────────────────────

def _user_id(session: creq.Session, username: str) -> str:
    r = session.get(
        f"https://www.instagram.com/api/v1/users/web_profile_info/?username={username}",
        headers={"X-Requested-With": "XMLHttpRequest"}, timeout=30,
    )
    try:
        return r.json()["data"]["user"]["id"]
    except Exception:
        raise RuntimeError(f"نتونستم آیدی کاربر «{username}» را بگیرم.")


def _item_to_target(item: dict) -> dict:
    video = _best_video(item)
    cover = _best_cover(item)
    return {
        "kind": "video" if video else "image",
        "video_url": video,
        "cover_url": cover,
        "pk": str(item.get("pk")) if item.get("pk") else None,
    }


def _fetch_story_targets(session: creq.Session, url: str) -> list[dict]:
    m = re.search(r"/stories/([^/]+)/(\d+)", url)
    if not m:
        raise RuntimeError("لینک استوری معتبر نیست.")
    username, story_id = m.group(1), m.group(2)

    uid = _user_id(session, username)
    r = session.get(
        f"https://www.instagram.com/api/v1/feed/reels_media/?reel_ids={uid}",
        headers={"X-Requested-With": "XMLHttpRequest"}, timeout=30,
    )
    try:
        reel = r.json()["reels"][uid]
        items = reel.get("items", [])
    except Exception:
        raise RuntimeError("نتونستم استوری‌ها را بگیرم (شاید منقضی شده یا دسترسی نداری).")
    if not items:
        raise RuntimeError("این کاربر الان استوری فعالی ندارد (یا منقضی شده).")

    match = [it for it in items if str(it.get("pk")) == story_id]
    chosen = match or items
    return [_item_to_target(it) for it in chosen]


# ─── Unified extraction ────────────────────────────────────────────────────────

def _clean_title(caption: str | None, media_type: str) -> str:
    defaults = {
        "reel": "Instagram Reel", "post": "Instagram Post",
        "carousel": "Instagram Carousel", "story": "Instagram Story",
        "igtv": "Instagram TV",
    }
    if not caption:
        return defaults.get(media_type, "Instagram Media")
    first_line = caption.strip().splitlines()[0] if caption.strip() else ""
    if not first_line:
        return defaults.get(media_type, "Instagram Media")
    return first_line[:97] + "…" if len(first_line) > 100 else first_line


def _extract(session: creq.Session, url: str) -> dict[str, Any]:
    """Return {media_type, title, uploader, duration, targets}."""
    url = _clean_url(url)

    if "/stories/" in url:
        targets = _fetch_story_targets(session, url)
        return {
            "media_type": "story",
            "title": "Instagram Story",
            "uploader": _story_username(url),
            "duration": None,
            "targets": targets,
        }

    sc = _shortcode(url)
    if not sc:
        raise RuntimeError("نتونستم shortcode را از لینک تشخیص بدم.")

    resp = session.get(url, timeout=30)
    if resp.status_code != 200:
        raise RuntimeError(f"HTTP {resp.status_code} هنگام گرفتن صفحه.")
    media = find_primary_media(resp.text, sc)
    if media is None:
        raise RuntimeError(
            "دادهٔ مدیا پیدا نشد. ممکن است پست خصوصی باشد، کوکی منقضی شده "
            "باشد، یا اینستاگرام موقتاً محدودت کرده باشد."
        )

    targets = _collect_targets(media)
    mt = media.get("media_type")
    resolved = {1: "post", 2: "reel", 8: "carousel"}.get(mt, detect_media_type(url))
    if len(targets) > 1:
        resolved = "carousel"

    return {
        "media_type": resolved,
        "title": _clean_title(_media_caption(media), resolved),
        "uploader": _media_owner(media),
        "duration": media.get("video_duration"),
        "targets": targets,
    }


# ─── Downloading ───────────────────────────────────────────────────────────────

def _save(session: creq.Session, url: str, dest: Path) -> bool:
    try:
        r = session.get(url, timeout=180)
    except Exception:
        return False
    if r.status_code != 200 or not r.content:
        return False
    dest.write_bytes(r.content)
    return True


def _uploader_handle(name: str | None) -> str | None:
    if not name:
        return None
    return name if name.startswith("@") else f"@{name}"


# ─── Fast preview (metadata + real cover) ────────────────────────────────────

def _generic_preview(url: str) -> dict[str, Any]:
    """Minimal placeholder when extraction fails — never blocks the download."""
    media_type = detect_media_type(url)
    m = re.search(r"instagram\.com/(?:stories/|reel/|reels/|p/|tv/)?([A-Za-z0-9_.]+)", url)
    uploader = f"@{m.group(1)}" if m else "Instagram"
    return {
        "title": _clean_title(None, media_type),
        "thumbnail_url": None,
        "duration": None,
        "uploader": uploader,
        "media_type": media_type,
    }


def get_preview(url: str) -> dict[str, Any]:
    """Extract title + cover thumbnail without downloading the media file."""
    validate_url(url)
    try:
        session, _ = _build_session()
        info = _extract(session, url)
        cover = next(
            (t["cover_url"] for t in info["targets"] if t.get("cover_url")), None
        )
        return {
            "title": info["title"],
            "thumbnail_url": cover,
            "duration": info.get("duration"),
            "uploader": _uploader_handle(info.get("uploader")),
            "media_type": info["media_type"],
        }
    except Exception:
        # Preview is best-effort; fall back so the user can still download.
        return _generic_preview(url)


# ─── Public entry point ───────────────────────────────────────────────────────

def download_media(url: str, job_id: str) -> dict[str, Any]:
    """Synchronous download — must be called inside asyncio.to_thread."""
    validate_url(url)

    target_dir = Path(settings.DOWNLOADS_DIR) / job_id
    target_dir.mkdir(parents=True, exist_ok=True)

    session, has_cookies = _build_session()

    try:
        info = _extract(session, url)
    except RuntimeError as exc:
        shutil.rmtree(target_dir, ignore_errors=True)
        hint = (
            "" if has_cookies
            else "\n\n💡 برای دانلود باید در پنل ادمین فایل کوکی اینستاگرام (لاگین‌شده) را آپلود کنی."
        )
        raise RuntimeError(f"{exc}{hint}")

    targets = info["targets"]
    media_type = info["media_type"]
    name = _shortcode(url) or _story_username(url) or "instagram"
    multi = len(targets) > 1

    saved: list[tuple[Path, str]] = []   # (path, "video"|"image")
    covers: list[Path] = []

    for i, t in enumerate(targets):
        base = t.get("pk") or (f"{name}_{i + 1}" if multi else name)
        if t.get("video_url"):
            vp = target_dir / f"{base}.mp4"
            if _save(session, t["video_url"], vp):
                saved.append((vp, "video"))
                if t.get("cover_url"):
                    cp = target_dir / f"{base}_cover.jpg"
                    if _save(session, t["cover_url"], cp):
                        covers.append(cp)
        elif t.get("cover_url"):
            ip = target_dir / f"{base}.jpg"
            if _save(session, t["cover_url"], ip):
                saved.append((ip, "image"))
                covers.append(ip)

    if not saved:
        shutil.rmtree(target_dir, ignore_errors=True)
        raise RuntimeError("هیچ فایلی دانلود نشد (لینک‌های CDN پاسخ ندادند).")

    # Thumbnail: prefer a downloaded cover, else the first image file
    thumb: Path | None = covers[0] if covers else next(
        (p for p, k in saved if k == "image"), None
    )

    # Single media → return directly
    if len(saved) == 1:
        path, kind = saved[0]
        return {
            "file_path": str(path),
            "thumbnail_path": str(thumb) if thumb else (str(path) if kind == "image" else None),
            "title": info["title"],
            "media_type": media_type,
            "file_count": 1,
            "carousel_files": None,
        }

    # Multiple media → ZIP + per-slide list
    zip_path = target_dir / f"{name}_carousel.zip"
    with zipfile.ZipFile(zip_path, "w", zipfile.ZIP_DEFLATED) as zf:
        for path, _kind in saved:
            zf.write(path, path.name)

    carousel_files = [
        {"name": path.name, "path": str(path), "media_type": kind}
        for path, kind in saved
    ]

    return {
        "file_path": str(zip_path),
        "thumbnail_path": str(thumb) if thumb else None,
        "title": info["title"],
        "media_type": "carousel",
        "file_count": len(saved),
        "carousel_files": carousel_files,
    }
