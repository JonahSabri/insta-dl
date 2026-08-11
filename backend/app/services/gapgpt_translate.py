"""GapGPT (OpenAI-compatible) article translation."""

from __future__ import annotations

import json
import logging
import re

import httpx

from app.config import settings

logger = logging.getLogger(__name__)

LANG_NAMES: dict[str, str] = {
    "en": "English",
    "pt": "Portuguese (Brazil)",
    "de": "German",
    "fr": "French",
    "ja": "Japanese",
    "nl": "Dutch",
    "sv": "Swedish",
    "no": "Norwegian",
    "da": "Danish",
    "it": "Italian",
    "es": "Spanish",
    "tr": "Turkish",
    "ar": "Arabic",
}

SYSTEM_PROMPT = """You are a professional translator for JazzGhost, an Instagram downloader website.
Translate article fields into the target language for SEO and readers.

Return ONLY valid JSON with these keys:
title, excerpt, content, keywords, meta_title, meta_description, cover_alt

STRICT rules:
1) Translate visible human text only.
2) NEVER change URLs, href, src, srcset, data-* values, file paths, query strings, or HTML tag/attribute names.
3) Keep brand / product tokens unchanged: JazzGhost, Instagram, Reels, Stories, IGTV, Facebook, WhatsApp, TikTok.
4) Preserve all HTML structure, tags, classes, and figure/figcaption markup.
5) DO translate img alt, title, and figcaption text (SEO).
6) keywords: translate each keyword naturally for the target locale (comma-separated). Do not invent unrelated spam terms.
7) meta_title / meta_description / cover_alt: translate for SEO; if source is empty, invent a good short SEO version from the title/excerpt.
8) Natural, native-sounding wording — not literal word-for-word.
9) No markdown fences. JSON only.
"""


def _extract_json(raw: str) -> dict:
    text = (raw or "").strip()
    if text.startswith("```"):
        text = re.sub(r"^```(?:json)?\s*", "", text)
        text = re.sub(r"\s*```$", "", text)
    data = json.loads(text)
    if not isinstance(data, dict):
        raise ValueError("Translation response is not a JSON object")
    return data


def merge_keywords(original: str, translated: str) -> str:
    """Keep original keywords and append unique translated ones."""
    seen: set[str] = set()
    out: list[str] = []
    for part in f"{original},{translated}".split(","):
        k = part.strip()
        if not k:
            continue
        key = k.casefold()
        if key in seen:
            continue
        seen.add(key)
        out.append(k)
    return ", ".join(out)


async def translate_article_fields(
    *,
    title: str,
    excerpt: str,
    content: str,
    keywords: str = "",
    meta_title: str = "",
    meta_description: str = "",
    cover_alt: str = "",
    source_lang: str,
    target_lang: str,
) -> dict[str, str]:
    """Translate SEO + content fields from source_lang → target_lang via GapGPT."""
    if target_lang == source_lang:
        return {
            "title": title,
            "excerpt": excerpt,
            "content": content,
            "keywords": keywords,
            "meta_title": meta_title,
            "meta_description": meta_description,
            "cover_alt": cover_alt,
        }

    api_key = (settings.GAPGPT_API_KEY or "").strip()
    if not api_key:
        raise RuntimeError("GAPGPT_API_KEY is not configured")

    base = (settings.GAPGPT_BASE_URL or "https://api.gapgpt.app/v1").rstrip("/")
    model = (settings.GAPGPT_MODEL or "gpt-5.2").strip() or "gpt-5.2"
    src = LANG_NAMES.get(source_lang, source_lang)
    tgt = LANG_NAMES.get(target_lang, target_lang)

    user_payload = {
        "source_language": src,
        "target_language": tgt,
        "title": title or "",
        "excerpt": excerpt or "",
        "content": content or "",
        "keywords": keywords or "",
        "meta_title": meta_title or "",
        "meta_description": meta_description or "",
        "cover_alt": cover_alt or "",
    }

    async with httpx.AsyncClient(timeout=httpx.Timeout(180.0, connect=30.0)) as client:
        resp = await client.post(
            f"{base}/chat/completions",
            headers={
                "Authorization": f"Bearer {api_key}",
                "Content-Type": "application/json",
            },
            json={
                "model": model,
                "temperature": 0.25,
                "response_format": {"type": "json_object"},
                "messages": [
                    {"role": "system", "content": SYSTEM_PROMPT},
                    {
                        "role": "user",
                        "content": (
                            f"Translate this article JSON from {src} to {tgt}. "
                            "Keep all URLs and static brand names unchanged:\n"
                            + json.dumps(user_payload, ensure_ascii=False)
                        ),
                    },
                ],
            },
        )
        if resp.status_code >= 400:
            detail = resp.text[:500]
            logger.error("GapGPT translate failed %s: %s", resp.status_code, detail)
            raise RuntimeError(f"GapGPT error {resp.status_code}: {detail}")

        body = resp.json()
        raw = (
            ((body.get("choices") or [{}])[0].get("message") or {}).get("content") or ""
        ).strip()
        if not raw:
            raise RuntimeError("GapGPT returned empty translation")

        data = _extract_json(raw)
        translated_keywords = str(data.get("keywords") or "").strip()
        return {
            "title": str(data.get("title") or title).strip(),
            "excerpt": str(data.get("excerpt") or excerpt).strip(),
            "content": str(data.get("content") or content).strip(),
            "keywords": merge_keywords(keywords, translated_keywords),
            "meta_title": str(data.get("meta_title") or data.get("title") or title).strip(),
            "meta_description": str(
                data.get("meta_description") or data.get("excerpt") or excerpt
            ).strip(),
            "cover_alt": str(data.get("cover_alt") or data.get("title") or title).strip(),
        }
