"""yt-dlp (primary) + gallery-dl (fallback) downloader for Instagram media."""
from __future__ import annotations

import re
import shutil
import subprocess
import sys
import zipfile
from pathlib import Path
from typing import Any
from urllib.parse import urlparse

from yt_dlp import YoutubeDL
from yt_dlp.utils import DownloadError

from app.config import settings
from app.services import settings_store

ALLOWED_HOSTS = {"instagram.com", "www.instagram.com", "m.instagram.com"}
IMAGE_EXTS = {".jpg", ".jpeg", ".webp", ".png"}
VIDEO_EXTS = {".mp4", ".mkv", ".mov", ".webm", ".m4v"}


# ─── URL helpers ─────────────────────────────────────────────────────────────

def validate_url(url: str) -> None:
    parsed = urlparse(url)
    if not parsed.scheme.startswith("http"):
        raise ValueError("لینک باید با http یا https شروع شود.")
    if parsed.netloc.lower() not in ALLOWED_HOSTS:
        raise ValueError("فقط لینک‌های اینستاگرام پشتیبانی می‌شوند.")


def detect_media_type(url: str) -> str:
    if "/reel/" in url:
        return "reel"
    if "/p/" in url:
        return "post"
    if "/stories/" in url:
        return "story"
    if "/tv/" in url:
        return "igtv"
    return "unknown"


def _shortcode(url: str) -> str:
    m = re.search(r"/(?:p|reel)/([A-Za-z0-9_-]+)", url)
    return m.group(1) if m else "media"


# ─── File helpers ─────────────────────────────────────────────────────────────

def _find_video_and_thumb(target_dir: Path) -> tuple[Path | None, Path | None]:
    video: Path | None = None
    thumb: Path | None = None
    for p in sorted(target_dir.iterdir(), key=lambda f: f.stat().st_mtime, reverse=True):
        if not p.is_file():
            continue
        ext = p.suffix.lower()
        if ext in VIDEO_EXTS and video is None:
            video = p
        elif ext in IMAGE_EXTS and thumb is None:
            thumb = p
    return video, thumb


def _collect_images(target_dir: Path) -> list[Path]:
    """Search recursively — gallery-dl creates subdirectories."""
    return sorted(
        [f for f in target_dir.rglob("*") if f.is_file() and f.suffix.lower() in IMAGE_EXTS],
        key=lambda p: p.name,
    )


def _collect_all_media(target_dir: Path) -> list[Path]:
    """Collect all images AND videos, sorted by filename (preserves carousel order)."""
    return sorted(
        [
            f for f in target_dir.rglob("*")
            if f.is_file() and f.suffix.lower() in IMAGE_EXTS | VIDEO_EXTS
        ],
        key=lambda p: p.name,
    )


# ─── Credential / cookie helpers ─────────────────────────────────────────────

_COOKIES_PATH = Path(settings.DOWNLOADS_DIR) / "instagram_cookies.txt"


def _cookies_file() -> str | None:
    """Return path to uploaded cookies file if it exists."""
    if settings.INSTAGRAM_COOKIES_FILE:
        p = Path(settings.INSTAGRAM_COOKIES_FILE)
        if p.exists():
            return str(p)
    if _COOKIES_PATH.exists():
        return str(_COOKIES_PATH)
    return None


def _ig_credentials() -> tuple[str | None, str | None]:
    """Return (username, password) from settings store."""
    username = settings_store.get("instagram_username") or None
    password = settings_store.get("instagram_password") or None
    return username, password


# ─── yt-dlp ──────────────────────────────────────────────────────────────────

def _ydl_opts(target_dir: Path) -> dict[str, Any]:
    opts: dict[str, Any] = {
        "format": "bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best",
        "merge_output_format": "mp4",
        "outtmpl": str(target_dir / "%(title).80B-%(id)s.%(ext)s"),
        "noplaylist": True,
        "quiet": True,
        "no_warnings": True,
        "restrictfilenames": True,
        "writethumbnail": True,
        "convert_thumbnails": "jpg",
        # Instagram-specific tweaks
        "extractor_args": {"instagram": {"include_feed_video": True}},
        "http_headers": {
            "User-Agent": (
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                "AppleWebKit/537.36 (KHTML, like Gecko) "
                "Chrome/125.0.0.0 Safari/537.36"
            )
        },
    }

    # Cookies file takes priority over username/password
    cookies = _cookies_file()
    if cookies:
        opts["cookiefile"] = cookies
    else:
        username, password = _ig_credentials()
        if username and password:
            opts["username"] = username
            opts["password"] = password

    return opts


def _try_ytdlp(url: str, target_dir: Path) -> dict[str, Any]:
    try:
        with YoutubeDL(_ydl_opts(target_dir)) as ydl:
            info = ydl.extract_info(url, download=True)
    except DownloadError as exc:
        msg = str(exc)
        if "login" in msg.lower() or "private" in msg.lower():
            raise RuntimeError("این محتوا خصوصی است یا نیاز به لاگین دارد.") from exc
        raise RuntimeError(msg[:300]) from exc

    video_path, thumb_path = _find_video_and_thumb(target_dir)

    if not video_path:
        if thumb_path:
            video_path, thumb_path = thumb_path, None
        else:
            raise RuntimeError("yt-dlp: هیچ فایلی دانلود نشد.")

    return {
        "file_path": str(video_path),
        "thumbnail_path": str(thumb_path) if thumb_path else None,
        "title": (info or {}).get("title") or "Instagram Media",
        "media_type": detect_media_type(url),
        "file_count": 1,
    }


# ─── gallery-dl (fallback for /p/ image & carousel posts) ────────────────────

def _try_gallery_dl(url: str, target_dir: Path) -> dict[str, Any]:
    # Use absolute path so the subprocess finds files correctly
    abs_dir = target_dir.resolve()
    cookies = _cookies_file()
    cookies_abs = str(Path(cookies).resolve()) if cookies else None

    cmd = [
        sys.executable, "-m", "gallery_dl",
        "-D", str(abs_dir),    # download directly into this dir (no extra subdirs)
        "--no-skip",
        url,
    ]

    if cookies_abs:
        cmd.extend(["--cookies", cookies_abs])
    else:
        from app.services.settings_store import GALLERY_DL_CFG_PATH
        if GALLERY_DL_CFG_PATH.exists():
            cmd.extend(["--config", str(GALLERY_DL_CFG_PATH.resolve())])

    proc = subprocess.run(cmd, capture_output=True, text=True, timeout=180)

    # gallery-dl creates subdirectory structure — search recursively
    all_media = _collect_all_media(abs_dir)

    if not all_media:
        raw_err = (proc.stderr or proc.stdout or "").strip()
        clean_err = re.sub(r"\x1b\[[0-9;]*m", "", raw_err)
        raise RuntimeError(clean_err[:400] if clean_err else "gallery-dl: هیچ فایلی دانلود نشد.")

    images = [f for f in all_media if f.suffix.lower() in IMAGE_EXTS]
    first_thumb = images[0] if images else None

    # Single file (image or video)
    if len(all_media) == 1:
        f = all_media[0]
        is_vid = f.suffix.lower() in VIDEO_EXTS
        return {
            "file_path": str(f),
            "thumbnail_path": str(f) if not is_vid else None,
            "title": "Instagram Media",
            "media_type": detect_media_type(url),
            "file_count": 1,
            "carousel_files": None,
        }

    # Carousel (mixed images & videos) → ZIP + individual file list
    sc = _shortcode(url)
    zip_path = target_dir / f"{sc}_carousel.zip"
    with zipfile.ZipFile(zip_path, "w", zipfile.ZIP_DEFLATED) as zf:
        for f in all_media:
            zf.write(f, f.name)

    carousel_files = [
        {
            "name": f.name,
            "path": str(f),
            "media_type": "video" if f.suffix.lower() in VIDEO_EXTS else "image",
        }
        for f in all_media
    ]

    return {
        "file_path": str(zip_path),
        "thumbnail_path": str(first_thumb) if first_thumb else None,
        "title": f"Instagram Carousel — {len(all_media)} فایل",
        "media_type": "carousel",
        "file_count": len(all_media),
        "carousel_files": carousel_files,
    }


# ─── Public entry point ───────────────────────────────────────────────────────

def download_media(url: str, job_id: str) -> dict[str, Any]:
    """Synchronous download — must be called inside asyncio.to_thread."""
    validate_url(url)

    target_dir = Path(settings.DOWNLOADS_DIR) / job_id
    target_dir.mkdir(parents=True, exist_ok=True)

    is_post = "/p/" in url          # image / carousel post
    is_reel = "/reel/" in url       # reel / video

    ytdlp_err: str | None = None
    gdl_err: str | None = None

    # ── For image posts: start with gallery-dl directly (yt-dlp can't handle images)
    if is_post:
        try:
            return _try_gallery_dl(url, target_dir)
        except RuntimeError as exc:
            gdl_err = str(exc)
        # gallery-dl failed → try yt-dlp as last resort (maybe it's a video post)
        try:
            return _try_ytdlp(url, target_dir)
        except RuntimeError as exc:
            ytdlp_err = str(exc)
        shutil.rmtree(target_dir, ignore_errors=True)
        raise RuntimeError(
            f"دانلود ناموفق بود.\n"
            f"• gallery-dl: {gdl_err}\n"
            f"• yt-dlp: {ytdlp_err}"
        )

    # ── For reels / videos: yt-dlp first, gallery-dl fallback
    try:
        return _try_ytdlp(url, target_dir)
    except RuntimeError as exc:
        ytdlp_err = str(exc)

    if is_reel:
        try:
            return _try_gallery_dl(url, target_dir)
        except RuntimeError as exc:
            gdl_err = str(exc)
            shutil.rmtree(target_dir, ignore_errors=True)
            raise RuntimeError(
                f"دانلود ناموفق بود.\n"
                f"• yt-dlp: {ytdlp_err}\n"
                f"• gallery-dl: {gdl_err}"
            ) from exc

    shutil.rmtree(target_dir, ignore_errors=True)
    raise RuntimeError(ytdlp_err or "دانلود ناموفق بود.")
