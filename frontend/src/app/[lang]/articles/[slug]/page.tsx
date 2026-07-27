"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import LanguageSwitcher from "@/components/LanguageSwitcher";
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
      <header
        className="sticky top-0 z-50 border-b"
        style={{
          background: "rgba(6,6,16,0.8)",
          backdropFilter: "blur(24px)",
          borderColor: "rgba(131,58,180,0.15)",
        }}
      >
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 gap-3">
          <Link href={`/${lang}`} className="flex items-center gap-2.5 min-w-0">
            <div
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-white"
              style={{ background: "linear-gradient(135deg,#833ab4,#e1306c,#fcb045)" }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
            </div>
            <span className="ig-gradient-text text-lg font-extrabold tracking-tight truncate">{siteName}</span>
          </Link>
          <nav className="flex items-center gap-1 sm:gap-2">
            <Link href={`/${lang}`} className="rounded-lg px-2.5 py-1.5 text-xs sm:text-sm text-slate-400 hover:text-white transition-colors">
              {t.nav.home}
            </Link>
            <Link href={`/${lang}/articles`} className="rounded-lg px-2.5 py-1.5 text-xs sm:text-sm text-slate-400 hover:text-white transition-colors">
              {t.nav.articles}
            </Link>
            <LanguageSwitcher />
          </nav>
        </div>
      </header>

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
                  alt={article.title}
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

      <footer className="py-8 text-center text-xs text-slate-700">
        <span className="text-slate-600">© {new Date().getFullYear()} {siteName}</span>
        <span className="mx-2 text-slate-800">·</span>
        <span>{t.footer.madeWith}</span>
      </footer>
    </div>
  );
}
