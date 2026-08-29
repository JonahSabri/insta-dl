import type { MetadataRoute } from "next";
import { LANGS } from "@/i18n/translations";
import { DOWNLOADER_SLUGS } from "@/content/downloaders";
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

  for (const l of LANGS) {
    entries.push({
      url: `${SITE_URL}/${l.code}`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1,
      alternates: { languages: langAlternates("") },
    });
  }

  for (const slug of DOWNLOADER_SLUGS) {
    const suffix = `/${slug}`;
    for (const l of LANGS) {
      entries.push({
        url: `${SITE_URL}/${l.code}${suffix}`,
        lastModified: now,
        changeFrequency: "weekly",
        priority: 0.95,
        alternates: { languages: langAlternates(suffix) },
      });
    }
  }

  for (const l of LANGS) {
    entries.push({
      url: `${SITE_URL}/${l.code}/blogs`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
      alternates: { languages: langAlternates("/blogs") },
    });
  }

  const legalPaths = [
    "/about",
    "/contact",
    "/terms",
    "/privacy-policy",
    "/cookie-policy",
    "/disclaimer",
    "/faq",
  ];
  for (const path of legalPaths) {
    for (const l of LANGS) {
      entries.push({
        url: `${SITE_URL}/${l.code}${path}`,
        lastModified: now,
        changeFrequency: "monthly",
        priority: 0.5,
        alternates: { languages: langAlternates(path) },
      });
    }
  }

  for (const article of articles) {
    if (!article.slug) continue;
    const lastMod = article.updated_at || article.created_at
      ? new Date(article.updated_at || article.created_at || now)
      : now;
    const suffix = `/blogs/${article.slug}`;

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
