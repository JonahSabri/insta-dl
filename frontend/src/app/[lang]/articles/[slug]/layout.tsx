import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import {
  absoluteUrl,
  articleJsonLd,
  breadcrumbJsonLd,
  buildArticleMetadata,
  SITE_NAME,
} from "@/lib/seo";

interface Props {
  children: React.ReactNode;
  params: Promise<{ lang: string; slug: string }>;
}

async function loadArticle(slug: string, lang: string) {
  const api = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000").replace(/\/$/, "");
  try {
    const res = await fetch(
      `${api}/api/v1/articles/${encodeURIComponent(slug)}?lang=${lang}`,
      { next: { revalidate: 600 } }
    );
    if (!res.ok) return null;
    return (await res.json()) as {
      title: string;
      excerpt: string;
      content?: string;
      keywords?: string;
      cover_image?: string;
      created_at?: string | null;
      updated_at?: string | null;
      slug: string;
    };
  } catch {
    return null;
  }
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}): Promise<Metadata> {
  const { lang, slug } = await params;
  const article = await loadArticle(slug, lang);
  if (!article) {
    return {
      title: "Article not found",
      robots: { index: false, follow: false },
    };
  }

  const description =
    article.excerpt?.trim() ||
    stripHtml(article.content || "").slice(0, 160);

  return buildArticleMetadata({
    lang,
    slug: article.slug || slug,
    title: article.title,
    description,
    image: article.cover_image,
    publishedAt: article.created_at,
    updatedAt: article.updated_at,
    keywords: article.keywords,
  });
}

export default async function ArticleSlugLayout({ children, params }: Props) {
  const { lang, slug } = await params;
  const article = await loadArticle(slug, lang);

  if (!article) return children;

  const url = absoluteUrl(`/${lang}/articles/${slug}`);
  const description =
    article.excerpt?.trim() ||
    stripHtml(article.content || "").slice(0, 160);

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: SITE_NAME, url: absoluteUrl(`/${lang}`) },
          { name: "Articles", url: absoluteUrl(`/${lang}/articles`) },
          { name: article.title, url },
        ])}
      />
      <JsonLd
        data={articleJsonLd({
          title: article.title,
          description,
          url,
          image: article.cover_image,
          publishedAt: article.created_at,
          updatedAt: article.updated_at,
          lang,
        })}
      />
      {children}
    </>
  );
}
