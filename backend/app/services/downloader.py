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
# Formats we want to deliver to the user (no webp/mkv/etc.)
PREFERRED_IMAGE_EXTS = {".jpg", ".jpeg", ".png"}
PREFERRED_VIDEO_EXT = ".mp4"


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
    if m:
        return m.group(1)
    m = re.search(r"/stories/[^/]+/(\d+)", url)
    if m:
        return m.group(1)
    return "media"


def _story_username(url: str) -> str:
    m = re.search(r"/stories/([^/?#]+)", url)
    return m.group(1) if m else "instagram"


# ─── Format conversion helpers ────────────────────────────────────────────────

def _convert_image_to_jpg(src: Path) -> Path:
    """Convert any image to JPG using FFmpeg. Returns new path (or original on failure)."""
    if src.suffix.lower() in PREFERRED_IMAGE_EXTS:
        return src
    dst = src.with_suffix(".jpg")
    try:
        result = subprocess.run(
            ["ffmpeg", "-y", "-i", str(src), "-q:v", "2", str(dst)],
            capture_output=True, timeout=60,
        )
        if result.returncode == 0 and dst.exists() and dst.stat().st_size > 0:
            src.unlink(missing_ok=True)
            return dst
    except Exception:
        pass
    return src


def _convert_video_to_mp4(src: Path) -> Path:
    """Convert any video to MP4 using FFmpeg. Returns new path (or original on failure)."""
    if src.suffix.lower() == PREFERRED_VIDEO_EXT:
        return src
    dst = src.with_suffix(".mp4")
    try:
        result = subprocess.run(
            ["ffmpeg", "-y", "-i", str(src), "-c:v", "copy", "-c:a", "aac", str(dst)],
            capture_output=True, timeout=300,
        )
        if result.returncode == 0 and dst.exists() and dst.stat().st_size > 0:
            src.unlink(missing_ok=True)
            return dst
    except Exception:
        pass
    return src


def _ensure_formats(files: list[Path]) -> list[Path]:
    """Convert all images to JPG and all videos to MP4."""
    converted: list[Path] = []
    for f in files:
        ext = f.suffix.lower()
        if ext in VIDEO_EXTS:
            converted.append(_convert_video_to_mp4(f))
        elif ext in IMAGE_EXTS:
            converted.append(_convert_image_to_jpg(f))
        else:
            converted.append(f)
    return converted


# ─── File helpers ─────────────────────────────────────────────────────────────

def _find_video_and_thumb(target_dir: Path) -> tuple[Path | None, Path | None]:
    """Search recursively for newest video and image files."""
    video: Path | None = None
    thumb: Path | None = None
    all_files = sorted(
        [p for p in target_dir.rglob("*") if p.is_file()],
        key=lambda f: f.stat().st_mtime,
        reverse=True,
    )
    for p in all_files:
        ext = p.suffix.lower()
        if ext in VIDEO_EXTS and video is None:
            video = p
        elif ext in IMAGE_EXTS and thumb is None:
            thumb = p
        if video and thumb:
            break
    return video, thumb


def _collect_images(target_dir: Path) -> list[Path]:
    return sorted(
        [f for f in target_dir.rglob("*") if f.is_file() and f.suffix.lower() in IMAGE_EXTS],
        key=lambda p: p.name,
    )


def _collect_all_media(target_dir: Path) -> list[Path]:
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
    if _cookies_file():
        return True
    u, p = _ig_credentials()
    return bool(u and p)


# ─── yt-dlp ──────────────────────────────────────────────────────────────────

def _ydl_opts(target_dir: Path, *, for_story: bool = False) -> dict[str, Any]:
    opts: dict[str, Any] = {
        # Always request MP4 video
        "format": "bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best",
        "merge_output_format": "mp4",
        "outtmpl": str(target_dir / "%(title).80B-%(id)s.%(ext)s"),
        "noplaylist": True,
        "quiet": True,
        "no_warnings": True,
        "restrictfilenames": True,
        "writethumbnail": True,
        "convert_thumbnails": "jpg",
        "http_headers": {
            "User-Agent": (
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                "AppleWebKit/537.36 (KHTML, like Gecko) "
                "Chrome/125.0.0.0 Safari/537.36"
            )
        },
    }

    if not for_story:
        opts["extractor_args"] = {"instagram": {"include_feed_video": True}}

    cookies = _cookies_file()
    if cookies:
        opts["cookiefile"] = cookies
    else:
        username, password = _ig_credentials()
        if username and password:
            opts["username"] = username
            opts["password"] = password

    proxy = settings_store.get("proxy") or settings.proxy
    if proxy:
        opts["proxy"] = proxy

    return opts


def _try_ytdlp(url: str, target_dir: Path, *, for_story: bool = False) -> dict[str, Any]:
    try:
        with YoutubeDL(_ydl_opts(target_dir, for_story=for_story)) as ydl:
            info = ydl.extract_info(url, download=True)
    except DownloadError as exc:
        msg = str(exc)
        if "login" in msg.lower() or "private" in msg.lower():
            raise RuntimeError("این محتوا خصوصی است یا نیاز به لاگین دارد.") from exc
        raise RuntimeError(msg[:300]) from exc

    video_path, thumb_path = _find_video_and_thumb(target_dir)

    # If we only found an image (no video — e.g. image post via yt-dlp), treat it as the file
    if not video_path:
        if thumb_path:
            video_path, thumb_path = thumb_path, None
        else:
            raise RuntimeError("yt-dlp: هیچ فایلی دانلود نشد.")

    # Convert video to MP4 and thumbnail to JPG
    video_path = _convert_video_to_mp4(video_path)
    if thumb_path:
        thumb_path = _convert_image_to_jpg(thumb_path)

    return {
        "file_path": str(video_path),
        "thumbnail_path": str(thumb_path) if thumb_path else None,
        "title": (info or {}).get("title") or "Instagram Media",
        "media_type": detect_media_type(url),
        "file_count": 1,
    }


# ─── gallery-dl ──────────────────────────────────────────────────────────────

def _try_gallery_dl(url: str, target_dir: Path) -> dict[str, Any]:
    abs_dir = target_dir.resolve()
    cookies = _cookies_file()
    cookies_abs = str(Path(cookies).resolve()) if cookies else None

    cmd = [
        sys.executable, "-m", "gallery_dl",
        "-D", str(abs_dir),
        "--no-skip",
        url,
    ]

    if cookies_abs:
        cmd.extend(["--cookies", cookies_abs])
    else:
        from app.services.settings_store import GALLERY_DL_CFG_PATH
        if GALLERY_DL_CFG_PATH.exists():
            cmd.extend(["--config", str(GALLERY_DL_CFG_PATH.resolve())])

    import os
    proxy = settings_store.get("proxy") or settings.proxy
    env = None
    if proxy:
        env = os.environ.copy()
        env["HTTP_PROXY"] = proxy
        env["HTTPS_PROXY"] = proxy
        env["http_proxy"] = proxy
        env["https_proxy"] = proxy

    proc = subprocess.run(cmd, capture_output=True, text=True, timeout=180, env=env)

    all_media = _collect_all_media(abs_dir)

    if not all_media:
        raw_err = (proc.stderr or proc.stdout or "").strip()
        clean_err = re.sub(r"\x1b\[[0-9;]*m", "", raw_err)
        raise RuntimeError(clean_err[:400] if clean_err else "gallery-dl: هیچ فایلی دانلود نشد.")

    # Convert all files to preferred formats (JPG for images, MP4 for videos)
    all_media = _ensure_formats(all_media)
    # Re-sort after potential rename
    all_media = sorted([f for f in all_media if f.exists()], key=lambda p: p.name)

    images = [f for f in all_media if f.suffix.lower() in PREFERRED_IMAGE_EXTS | {".webp"}]
    first_thumb = images[0] if images else None

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

    # Multiple files → ZIP
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


# ─── Fast preview (metadata only) ────────────────────────────────────────────

def _generic_preview(url: str, reason: str = "") -> dict[str, Any]:
    """Return a minimal preview placeholder when yt-dlp cannot fetch metadata."""
    media_type = detect_media_type(url)
    # Try to extract username from the URL for any media type
    m = re.search(r"instagram\.com/(?:stories/|reel/|p/|tv/)?([A-Za-z0-9_.]+)", url)
    uploader = f"@{m.group(1)}" if m else "Instagram"
    titles = {
        "reel": "Instagram Reel",
        "post": "Instagram Post",
        "story": "Instagram Story",
        "igtv": "Instagram TV",
    }
    return {
        "title": titles.get(media_type, "Instagram Media"),
        "thumbnail_url": None,
        "duration": None,
        "uploader": uploader,
        "media_type": media_type,
    }


def get_preview(url: str) -> dict[str, Any]:
    """Extract title + thumbnail without downloading the media file."""
    validate_url(url)

    opts: dict[str, Any] = {
        "quiet": True,
        "no_warnings": True,
        "skip_download": True,
        # Pass extractor args so Instagram feed reels are also recognised
        "extractor_args": {"instagram": {"include_feed_video": True}},
        "http_headers": {
            "User-Agent": (
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                "AppleWebKit/537.36 (KHTML, like Gecko) "
                "Chrome/125.0.0.0 Safari/537.36"
            )
        },
    }

    proxy = settings_store.get("proxy") or settings.proxy
    if proxy:
        opts["proxy"] = proxy

    cookies = _cookies_file()
    if cookies:
        opts["cookiefile"] = cookies
    else:
        username, password = _ig_credentials()
        if username and password:
            opts["username"] = username
            opts["password"] = password

    try:
        with YoutubeDL(opts) as ydl:
            info = ydl.extract_info(url, download=False) or {}
    except DownloadError as exc:
        # Instagram often requires auth for preview metadata — return a generic
        # placeholder so the user can still proceed to the download step
        # (which has gallery-dl as a fallback and may succeed without auth).
        return _generic_preview(url, reason=str(exc)[:200])

    # Pick highest-resolution thumbnail
    thumbnails = info.get("thumbnails") or []
    thumbnail_url: str | None = None
    if thumbnails:
        best = max(
            thumbnails,
            key=lambda t: (t.get("width") or 0) * (t.get("height") or 0),
        )
        thumbnail_url = best.get("url")
    thumbnail_url = thumbnail_url or info.get("thumbnail")

    media_type = detect_media_type(url)
    titles = {"reel": "Instagram Reel", "post": "Instagram Post",
              "story": "Instagram Story", "igtv": "Instagram TV"}
    title = info.get("title") or titles.get(media_type, "Instagram Media")

    return {
        "title": title,
        "thumbnail_url": thumbnail_url,
        "duration": info.get("duration"),
        "uploader": info.get("uploader") or info.get("channel"),
        "media_type": media_type,
    }


# ─── Public entry point ───────────────────────────────────────────────────────

def download_media(url: str, job_id: str) -> dict[str, Any]:
    """Synchronous download — must be called inside asyncio.to_thread."""
    validate_url(url)

    target_dir = Path(settings.DOWNLOADS_DIR) / job_id
    target_dir.mkdir(parents=True, exist_ok=True)

    is_post  = "/p/" in url
    is_reel  = "/reel/" in url
    is_story = "/stories/" in url

    ytdlp_err: str | None = None
    gdl_err:   str | None = None

    # ── Image / carousel posts: gallery-dl first (images), yt-dlp fallback ───
    if is_post:
        try:
            return _try_gallery_dl(url, target_dir)
        except RuntimeError as exc:
            gdl_err = str(exc)
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

    # ── Stories: yt-dlp first, gallery-dl fallback ────────────────────────────
    if is_story:
        try:
            return _try_ytdlp(url, target_dir, for_story=True)
        except RuntimeError as exc:
            ytdlp_err = str(exc)

        try:
            return _try_gallery_dl(url, target_dir)
        except RuntimeError as exc:
            gdl_err = str(exc)

        shutil.rmtree(target_dir, ignore_errors=True)
        auth_hint = (
            "" if _has_auth()
            else "\n\n💡 استوری‌ها نیاز به لاگین دارند. در پنل ادمین کوکی یا اطلاعات ورود اینستاگرام را تنظیم کنید."
        )
        raise RuntimeError(
            f"دانلود استوری ناموفق بود.{auth_hint}\n"
            f"• yt-dlp: {ytdlp_err}\n"
            f"• gallery-dl: {gdl_err}"
        )

    # ── Reels / videos: yt-dlp first, gallery-dl fallback ────────────────────
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
