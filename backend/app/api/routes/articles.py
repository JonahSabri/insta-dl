from __future__ import annotations

import json
import re
from datetime import UTC, datetime

from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import verify_admin
from app.database import get_db
from app.models.article import Article

router = APIRouter(tags=["articles"])

SUPPORTED_LANGS = {
    "en", "pt", "fa", "de", "fr", "ja", "nl", "sv", "no", "da", "it", "es", "tr", "ar",
}


def _slugify(value: str) -> str:
    s = value.strip().lower()
    s = re.sub(r"[^\w\s-]", "", s, flags=re.UNICODE)
    s = re.sub(r"[-\s]+", "-", s).strip("-")
    return s[:200] or "article"


def _parse_translations(raw: str) -> dict:
    try:
        data = json.loads(raw or "{}")
        return data if isinstance(data, dict) else {}
    except json.JSONDecodeError:
        return {}


def _pick_lang(translations: dict, lang: str) -> dict:
    block = translations.get(lang) or translations.get("en") or {}
    if not block and translations:
        block = next(iter(translations.values()), {})
    return {
        "title": (block or {}).get("title") or "",
        "excerpt": (block or {}).get("excerpt") or "",
        "content": (block or {}).get("content") or "",
    }


def _public_item(article: Article, lang: str) -> dict:
    tr = _parse_translations(article.translations)
    picked = _pick_lang(tr, lang)
    return {
        "id": article.id,
        "slug": article.slug,
        "category": article.category or "guide",
        "cover_image": article.cover_image or "",
        "keywords": article.keywords,
        "lang": lang if lang in tr else ("en" if "en" in tr else next(iter(tr), lang)),
        "title": picked["title"],
        "excerpt": picked["excerpt"],
        "content": picked["content"],
        "available_langs": sorted(tr.keys()),
        "created_at": article.created_at.isoformat() if article.created_at else None,
        "updated_at": article.updated_at.isoformat() if article.updated_at else None,
    }


def _admin_item(article: Article) -> dict:
    return {
        "id": article.id,
        "slug": article.slug,
        "category": article.category or "guide",
        "cover_image": article.cover_image or "",
        "keywords": article.keywords,
        "is_published": article.is_published,
        "translations": _parse_translations(article.translations),
        "created_at": article.created_at.isoformat() if article.created_at else None,
        "updated_at": article.updated_at.isoformat() if article.updated_at else None,
    }


# ─── Public ──────────────────────────────────────────────────────────────────

@router.get("/v1/sitemap")
async def sitemap_data(db: AsyncSession = Depends(get_db)) -> dict:
    """Lightweight payload for Next.js sitemap generation."""
    result = await db.execute(
        select(Article)
        .where(Article.is_published.is_(True))
        .order_by(Article.updated_at.desc())
    )
    articles = result.scalars().all()
    return {
        "langs": sorted(SUPPORTED_LANGS),
        "articles": [
            {
                "slug": a.slug,
                "updated_at": a.updated_at.isoformat() if a.updated_at else None,
                "created_at": a.created_at.isoformat() if a.created_at else None,
            }
            for a in articles
        ],
    }


@router.get("/v1/articles")
async def list_public_articles(
    lang: str = Query("en"),
    db: AsyncSession = Depends(get_db),
) -> dict:
    lang = lang if lang in SUPPORTED_LANGS else "en"
    result = await db.execute(
        select(Article)
        .where(Article.is_published.is_(True))
        .order_by(Article.created_at.desc())
    )
    items = result.scalars().all()
    return {
        "items": [
            {
                "id": a.id,
                "slug": a.slug,
                "category": a.category or "guide",
                "cover_image": a.cover_image or "",
                "keywords": a.keywords,
                **_pick_lang(_parse_translations(a.translations), lang),
                "created_at": a.created_at.isoformat() if a.created_at else None,
            }
            for a in items
        ],
        "lang": lang,
    }


@router.get("/v1/articles/{slug}")
async def get_public_article(
    slug: str,
    lang: str = Query("en"),
    db: AsyncSession = Depends(get_db),
) -> dict:
    lang = lang if lang in SUPPORTED_LANGS else "en"
    result = await db.execute(
        select(Article).where(Article.slug == slug, Article.is_published.is_(True))
    )
    article = result.scalar_one_or_none()
    if not article:
        raise HTTPException(status_code=404, detail="Article not found.")
    return _public_item(article, lang)


# ─── Admin schemas ───────────────────────────────────────────────────────────

class ArticleTranslation(BaseModel):
    title: str = ""
    excerpt: str = ""
    content: str = ""


ARTICLE_CATEGORIES = {"guide", "tips", "tutorial", "news", "faq", "seo"}


class ArticleCreate(BaseModel):
    slug: str = ""
    category: str = "guide"
    cover_image: str = ""
    keywords: str = ""
    is_published: bool = True
    lang: str = "en"
    title: str
    excerpt: str = ""
    content: str = ""
    translations: dict[str, ArticleTranslation] | None = None


class ArticleUpdate(BaseModel):
    slug: str | None = None
    category: str | None = None
    cover_image: str | None = None
    keywords: str | None = None
    is_published: bool | None = None
    translations: dict[str, ArticleTranslation] | None = None
    # Convenience: update a single language block
    lang: str | None = None
    title: str | None = None
    excerpt: str | None = None
    content: str | None = None


# ─── Admin ───────────────────────────────────────────────────────────────────

@router.get("/admin/articles")
async def admin_list_articles(
    db: AsyncSession = Depends(get_db),
    _: str = Depends(verify_admin),
) -> dict:
    result = await db.execute(select(Article).order_by(Article.created_at.desc()))
    articles = result.scalars().all()
    return {"items": [_admin_item(a) for a in articles]}


@router.post("/admin/articles")
async def admin_create_article(
    body: ArticleCreate,
    db: AsyncSession = Depends(get_db),
    _: str = Depends(verify_admin),
) -> dict:
    slug = _slugify(body.slug or body.title)
    existing = await db.execute(select(Article).where(Article.slug == slug))
    if existing.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="این slug قبلاً استفاده شده است.")

    translations: dict = {}
    if body.translations:
        for code, block in body.translations.items():
            if code in SUPPORTED_LANGS:
                translations[code] = block.model_dump()
    lang = body.lang if body.lang in SUPPORTED_LANGS else "en"
    translations[lang] = {
        "title": body.title,
        "excerpt": body.excerpt,
        "content": body.content,
    }

    category = body.category if body.category in ARTICLE_CATEGORIES else "guide"
    article = Article(
        slug=slug,
        category=category,
        cover_image=body.cover_image or "",
        keywords=body.keywords,
        translations=json.dumps(translations, ensure_ascii=False),
        is_published=body.is_published,
    )
    db.add(article)
    await db.commit()
    await db.refresh(article)
    return _admin_item(article)


@router.put("/admin/articles/{article_id}")
async def admin_update_article(
    article_id: str,
    body: ArticleUpdate,
    db: AsyncSession = Depends(get_db),
    _: str = Depends(verify_admin),
) -> dict:
    article = await db.get(Article, article_id)
    if not article:
        raise HTTPException(status_code=404, detail="مقاله یافت نشد.")

    if body.slug is not None:
        new_slug = _slugify(body.slug)
        if new_slug != article.slug:
            clash = await db.execute(select(Article).where(Article.slug == new_slug))
            if clash.scalar_one_or_none():
                raise HTTPException(status_code=400, detail="این slug قبلاً استفاده شده است.")
            article.slug = new_slug

    if body.keywords is not None:
        article.keywords = body.keywords
    if body.category is not None:
        article.category = body.category if body.category in ARTICLE_CATEGORIES else "guide"
    if body.cover_image is not None:
        article.cover_image = body.cover_image
    if body.is_published is not None:
        article.is_published = body.is_published

    translations = _parse_translations(article.translations)

    if body.translations is not None:
        for code, block in body.translations.items():
            if code in SUPPORTED_LANGS:
                translations[code] = block.model_dump()

    if body.lang and body.lang in SUPPORTED_LANGS:
        current = translations.get(body.lang, {"title": "", "excerpt": "", "content": ""})
        if body.title is not None:
            current["title"] = body.title
        if body.excerpt is not None:
            current["excerpt"] = body.excerpt
        if body.content is not None:
            current["content"] = body.content
        translations[body.lang] = current

    article.translations = json.dumps(translations, ensure_ascii=False)
    article.updated_at = datetime.now(UTC)
    await db.commit()
    await db.refresh(article)
    return _admin_item(article)


@router.patch("/admin/articles/{article_id}/toggle")
async def admin_toggle_article(
    article_id: str,
    db: AsyncSession = Depends(get_db),
    _: str = Depends(verify_admin),
) -> dict:
    article = await db.get(Article, article_id)
    if not article:
        raise HTTPException(status_code=404, detail="مقاله یافت نشد.")
    article.is_published = not article.is_published
    article.updated_at = datetime.now(UTC)
    await db.commit()
    return {"id": article_id, "is_published": article.is_published}


@router.delete("/admin/articles/{article_id}")
async def admin_delete_article(
    article_id: str,
    db: AsyncSession = Depends(get_db),
    _: str = Depends(verify_admin),
) -> dict:
    article = await db.get(Article, article_id)
    if not article:
        raise HTTPException(status_code=404, detail="مقاله یافت نشد.")
    await db.delete(article)
    await db.commit()
    return {"deleted": True}
