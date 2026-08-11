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
Translate the article fields into the target language.

Rules:
1) Return ONLY valid JSON with keys: title, excerpt, content
2) Preserve all HTML tags, attributes, links, and structure in content — translate visible text only
3) Keep brand names unchanged: JazzGhost, Instagram, Reels, Stories, IGTV
4) Keep URLs, slug-like tokens, and code unchanged
5) Natural, SEO-friendly wording for the target locale
6) Do not wrap the JSON in markdown fences
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


async def translate_article_fields(
    *,
    title: str,
    excerpt: str,
    content: str,
    source_lang: str,
    target_lang: str,
) -> dict[str, str]:
    """Translate title/excerpt/content from source_lang → target_lang via GapGPT."""
    if target_lang == source_lang:
        return {"title": title, "excerpt": excerpt, "content": content}

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
                            f"Translate this article JSON from {src} to {tgt}:\n"
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
        return {
            "title": str(data.get("title") or title).strip(),
            "excerpt": str(data.get("excerpt") or excerpt).strip(),
            "content": str(data.get("content") or content).strip(),
        }
