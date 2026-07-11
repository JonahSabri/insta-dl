#!/usr/bin/env python3
"""
insta_dl.py — دانلودر مستقل اینستاگرام با کوکی لاگین

هر نوع لینکی (Reel / Post / Carousel / IGTV / Story) را با استفاده از فایل کوکی
اینستاگرام باز می‌کند و همهٔ مدیا را — هم کاور و هم ویدیو — در پوشهٔ Downloads
ذخیره می‌کند.

روش کار: صفحهٔ پست را با TLS-fingerprint یک مرورگر واقعی (curl_cffi) و کوکی
لاگین می‌گیرد، دادهٔ مدیای امبدشده در HTML را پارس می‌کند و لینک‌های مستقیم CDN
را دانلود می‌کند. (yt-dlp/gallery-dl فعلاً روی این پست‌ها پاسخ خالی/۴۰۳ می‌گیرند.)

پیش‌نیاز:
    pip install --user curl_cffi

اجرا:
    python insta_dl.py "https://www.instagram.com/reel/XXXX/"
    python insta_dl.py "https://www.instagram.com/p/XXXX/"
    python insta_dl.py                       # لینک را تعاملی می‌پرسد

گزینه‌ها:
    --cookies PATH   مسیر فایل کوکی (پیش‌فرض: ~/Downloads/www.instagram.com_cookies.txt)
    --out DIR        پوشهٔ مقصد (پیش‌فرض: ~/Downloads)
    --flat           همه را مستقیم در --out بریز (بدون زیرپوشهٔ مخصوص هر پست)
"""
from __future__ import annotations

import argparse
import http.cookiejar
import json
import re
import sys
from pathlib import Path
from urllib.parse import urlparse

try:
    from curl_cffi import requests as creq
except ImportError:
    sys.exit("نیاز به curl_cffi داری:  pip install --user curl_cffi")

DEFAULT_COOKIES = Path.home() / "Downloads" / "www.instagram.com_cookies.txt"
IG_APP_ID = "936619743392459"
IMPERSONATE = "chrome124"
UA = (
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
    "(KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36"
)

# media_type: 1=photo, 2=video, 8=carousel


def log(msg: str) -> None:
    print(f"[insta] {msg}", flush=True)


# ─────────────────────────── URL helpers ───────────────────────────

def clean_url(url: str) -> str:
    url = url.strip().strip('"').strip("'")
    if not url.startswith("http"):
        raise SystemExit("لینک باید با http/https شروع شود.")
    if "instagram.com" not in urlparse(url).netloc.lower():
        raise SystemExit("فقط لینک‌های اینستاگرام پشتیبانی می‌شوند.")
    return url.split("?")[0].rstrip("/") + "/"


def shortcode(url: str) -> str | None:
    m = re.search(r"/(?:p|reel|reels|tv)/([A-Za-z0-9_-]+)", url)
    return m.group(1) if m else None


def is_story(url: str) -> bool:
    return "/stories/" in url


# ─────────────────────────── session ───────────────────────────

def load_cookies(path: Path) -> dict[str, str]:
    cj = http.cookiejar.MozillaCookieJar(str(path))
    cj.load(ignore_discard=True, ignore_expires=True)
    jar = {c.name: c.value for c in cj}
    if "sessionid" not in jar:
        raise SystemExit("فایل کوکی «sessionid» ندارد — دوباره از مرورگر لاگین‌شده اکسپورت کن.")
    return jar


def make_session(cookies: dict[str, str]) -> creq.Session:
    s = creq.Session(impersonate=IMPERSONATE)
    s.headers.update({
        "User-Agent": UA,
        "X-IG-App-ID": IG_APP_ID,
        "Referer": "https://www.instagram.com/",
    })
    for k, v in cookies.items():
        s.cookies.set(k, v, domain=".instagram.com")
    return s


# ─────────────────────────── media extraction ───────────────────────────

def _walk_find_media(obj, code: str, acc: list) -> None:
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
    """امتیاز کامل بودن آبجکت مدیا؛ برای انتخاب کامل‌ترین نسخه از چند آبجکت هم‌کد."""
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
    # کامل‌ترین آبجکت را انتخاب کن (بعضی نسخه‌ها فقط کاور دارند)
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


def collect_targets(media: dict) -> list[dict]:
    """خروجی: لیستی از {kind, video_url, cover_url} برای هر آیتم."""
    targets: list[dict] = []
    children = media.get("carousel_media") or [media]
    for child in children:
        video = _best_video(child)
        cover = _best_cover(child)
        targets.append({
            "kind": "video" if video else "image",
            "video_url": video,
            "cover_url": cover,
        })
    return targets


# ─────────────────────────── story extraction ───────────────────────────

def _user_id(session: creq.Session, username: str) -> str:
    r = session.get(
        f"https://www.instagram.com/api/v1/users/web_profile_info/?username={username}",
        headers={"X-Requested-With": "XMLHttpRequest"}, timeout=30,
    )
    try:
        return r.json()["data"]["user"]["id"]
    except Exception:
        raise SystemExit(f"نتونستم آیدی کاربر «{username}» رو بگیرم.")


def _item_to_target(item: dict) -> dict:
    video = _best_video(item)
    cover = _best_cover(item)
    return {"kind": "video" if video else "image",
            "video_url": video, "cover_url": cover, "pk": str(item.get("pk"))}


def fetch_story_media(session: creq.Session, url: str) -> list[dict]:
    m = re.search(r"/stories/([^/]+)/(\d+)", url)
    if not m:
        raise SystemExit("لینک استوری معتبر نیست.")
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
        raise SystemExit("نتونستم استوری‌ها رو بگیرم (شاید منقضی شده یا دسترسی نداری).")
    if not items:
        raise SystemExit("این کاربر الان استوری فعالی ندارد (یا منقضی شده).")

    # فقط همان استوری موجود در لینک؛ اگر پیدا نشد، همهٔ استوری‌های فعال
    match = [it for it in items if str(it.get("pk")) == story_id]
    chosen = match or items
    if not match:
        log(f"استوری دقیق پیدا نشد؛ همهٔ {len(items)} استوری فعال دانلود می‌شود.")
    return [_item_to_target(it) for it in chosen]


# ─────────────────────────── downloading ───────────────────────────

def download(session: creq.Session, url: str, dest: Path) -> bool:
    try:
        r = session.get(url, timeout=180)
    except Exception as exc:
        log(f"  ✗ خطا: {exc}")
        return False
    if r.status_code != 200 or not r.content:
        log(f"  ✗ HTTP {r.status_code}")
        return False
    dest.write_bytes(r.content)
    size = len(r.content)
    unit = f"{size/1024/1024:.1f} MB" if size > 1024 * 1024 else f"{size/1024:.0f} KB"
    log(f"  ✓ {dest.name}  ({unit})")
    return True


# ─────────────────────────── main ───────────────────────────

def main() -> None:
    ap = argparse.ArgumentParser(description="دانلودر اینستاگرام با کوکی")
    ap.add_argument("url", nargs="?", help="لینک اینستاگرام")
    ap.add_argument("--cookies", default=str(DEFAULT_COOKIES), help="فایل کوکی")
    ap.add_argument("--out", default=str(Path.home() / "Downloads"), help="پوشهٔ مقصد")
    ap.add_argument("--flat", action="store_true", help="بدون زیرپوشه")
    args = ap.parse_args()

    raw = args.url or input("لینک اینستاگرام را وارد کن: ").strip()
    url = clean_url(raw)

    cookies_path = Path(args.cookies).expanduser()
    if not cookies_path.exists():
        raise SystemExit(f"فایل کوکی پیدا نشد: {cookies_path}")

    session = make_session(load_cookies(cookies_path))

    # نام و پوشهٔ مقصد
    sc = shortcode(url)
    if sc:
        name = sc
    elif is_story(url):
        mm = re.search(r"/stories/([^/]+)/(\d+)", url)
        name = f"story_{mm.group(1)}_{mm.group(2)}" if mm else "story"
    else:
        name = "instagram"
    base_out = Path(args.out).expanduser()
    out = base_out if args.flat else base_out / name
    out.mkdir(parents=True, exist_ok=True)

    # استخراج مدیا
    if is_story(url):
        log("نوع: story")
        targets = fetch_story_media(session, url)
    else:
        if not sc:
            raise SystemExit("نتونستم shortcode رو از لینک تشخیص بدم.")
        log(f"در حال گرفتن صفحه (shortcode={sc}) ...")
        html = session.get(url, timeout=30).text
        media = find_primary_media(html, sc)
        if media is None:
            raise SystemExit(
                "دادهٔ مدیا پیدا نشد. ممکن است پست خصوصی باشد، کوکی منقضی شده، "
                "یا اینستاگرام موقتاً محدودت کرده باشد."
            )
        mt = media.get("media_type")
        kind = {1: "post/image", 2: "reel/video", 8: "carousel"}.get(mt, str(mt))
        log(f"نوع: {kind}")
        targets = collect_targets(media)

    log(f"{len(targets)} آیتم پیدا شد. مقصد: {out}")

    saved = 0
    multi = len(targets) > 1
    for i, t in enumerate(targets):
        base = t.get("pk") or (f"{name}_{i + 1}" if multi else name)
        if t["video_url"]:
            if download(session, t["video_url"], out / f"{base}.mp4"):
                saved += 1
            if t["cover_url"]:
                download(session, t["cover_url"], out / f"{base}_cover.jpg")
        elif t["cover_url"]:
            if download(session, t["cover_url"], out / f"{base}.jpg"):
                saved += 1

    if saved == 0:
        raise SystemExit("هیچ فایلی دانلود نشد.")
    log(f"تمام شد ✅  ({saved} مدیا در {out})")


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        sys.exit(130)
