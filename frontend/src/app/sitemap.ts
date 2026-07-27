import type { MetadataRoute } from "next";
import { LANGS } from "@/i18n/translations";
import { SITE_URL } from "@/lib/seo";

const API_URL = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000").replace(/\/$/, "");

interface SitemapArticle {
  slug: string;
  updated_at?: string | null;
  created_at?: string | null;
}

function langAlternates(pathSuffix: string): Record<string, string> {
  const map: Record<string, string> = { "x-default": `${SITE_URL}/en${pathSuffix}` };
  for (const l of LANGS) {
    const hreflang = l.code === "pt" ? "pt-BR" : l.code;
    map[hreflang] = `${SITE_URL}/${l.code}${pathSuffix}`;
  }
  return map;
}

async function fetchArticleSlugs(): Promise<SitemapArticle[]> {
  try {
    const res = await fetch(`${API_URL}/api/v1/sitemap`, {
      next: { revalidate: 3600 },
    });
    if (res.ok) {
      const data = (await res.json()) as { articles?: SitemapArticle[] };
      return data.articles ?? [];
    }
  } catch {
    /* fall through */
  }

  // Fallback: public articles list
  try {
    const res = await fetch(`${API_URL}/api/v1/articles?lang=en`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];
    const data = (await res.json()) as { items?: SitemapArticle[] };
    return data.items ?? [];
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const articles = await fetchArticleSlugs();
  const entries: MetadataRoute.Sitemap = [];

  // Home pages per language
  for (const l of LANGS) {
    entries.push({
      url: `${SITE_URL}/${l.code}`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1,
      alternates: { languages: langAlternates("") },
    });
  }

  // Articles index per language
  for (const l of LANGS) {
    entries.push({
      url: `${SITE_URL}/${l.code}/articles`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
      alternates: { languages: langAlternates("/articles") },
    });
  }

  // Individual articles × languages
  for (const article of articles) {
    if (!article.slug) continue;
    const lastMod = article.updated_at || article.created_at
      ? new Date(article.updated_at || article.created_at || now)
      : now;
    const suffix = `/articles/${article.slug}`;

    for (const l of LANGS) {
      entries.push({
        url: `${SITE_URL}/${l.code}${suffix}`,
        lastModified: lastMod,
        changeFrequency: "weekly",
        priority: 0.8,
        alternates: { languages: langAlternates(suffix) },
      });
    }
  }

  return entries;
}
