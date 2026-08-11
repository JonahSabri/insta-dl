"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import CookieConsent from "@/components/CookieConsent";
import { useT } from "@/i18n/context";
import { fetchArticle } from "@/lib/api";
import type { ArticleDetail } from "@/types";

export default function ArticleDetailPage() {
  const t = useT();
  const { lang, slug } = useParams<{ lang: string; slug: string }>();
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME ?? "JazzGhost";
  const [article, setArticle] = useState<ArticleDetail | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");
    fetchArticle(slug, lang)
      .then((data) => { if (!cancelled) setArticle(data); })
      .catch((err: unknown) => {
        if (!cancelled) setError(err instanceof Error ? err.message : "Not found");
      })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [lang, slug]);

  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden w-full">
      <SiteHeader active="articles" />

      <main className="flex-1 px-4 py-10 sm:py-14">
        <article className="mx-auto max-w-2xl">
          <Link href={`/${lang}/articles`} className="mb-6 inline-block text-sm text-slate-500 hover:text-purple-400">
            {t.articles.backToList}
          </Link>

          {loading && <div className="glass-card h-64 animate-pulse" />}

          {!loading && error && (
            <p className="text-center text-red-400">{error}</p>
          )}

          {!loading && article && (
            <>
              <h1 className="mb-4 text-2xl font-extrabold leading-tight text-white sm:text-4xl">
                {article.title}
              </h1>
              {article.created_at && (
                <p className="mb-8 text-xs text-slate-600">
                  {t.articles.publishedAt} · {new Date(article.created_at).toLocaleDateString(lang)}
                </p>
              )}
              {article.cover_image && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={article.cover_image}
                  alt={article.cover_alt || article.title}
                  title={article.cover_alt || article.title}
                  className="mb-8 w-full rounded-2xl border border-white/10 object-cover max-h-80"
                />
              )}
              {article.excerpt && (
                <p className="mb-8 text-base leading-relaxed text-slate-400 border-l-2 border-purple-500/40 pl-4">
                  {article.excerpt}
                </p>
              )}
              {article.content?.includes("<") ? (
                <div
                  className="article-body"
                  dangerouslySetInnerHTML={{ __html: article.content }}
                />
              ) : (
                <div className="article-body whitespace-pre-wrap">{article.content}</div>
              )}
              {article.keywords && (
                <div className="mt-10 flex flex-wrap gap-2">
                  {article.keywords.split(",").map((k) => (
                    <span
                      key={k.trim()}
                      className="rounded-full px-3 py-1 text-xs text-slate-500"
                      style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}
                    >
                      {k.trim()}
                    </span>
                  ))}
                </div>
              )}
              <div className="mt-12 text-center">
                <Link
                  href={`/${lang}`}
                  className="btn-primary inline-flex"
                >
                  {siteName} — Download
                </Link>
              </div>
            </>
          )}
        </article>
      </main>

      <CookieConsent />
      <SiteFooter />
    </div>
  );
}
