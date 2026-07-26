"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useT } from "@/i18n/context";
import { fetchArticles } from "@/lib/api";
import type { ArticleListItem } from "@/types";

export default function ArticlesPage() {
  const t = useT();
  const { lang } = useParams<{ lang: string }>();
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME ?? "JazzGhost";
  const [items, setItems] = useState<ArticleListItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchArticles(lang)
      .then((data) => { if (!cancelled) setItems(data); })
      .catch(() => { if (!cancelled) setItems([]); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [lang]);

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
              style={{
                background: "linear-gradient(135deg,#833ab4,#e1306c,#fcb045)",
                boxShadow: "0 0 16px rgba(131,58,180,0.5)",
              }}
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
            <Link href={`/${lang}/articles`} className="rounded-lg px-2.5 py-1.5 text-xs sm:text-sm text-white bg-white/5">
              {t.nav.articles}
            </Link>
            <LanguageSwitcher />
          </nav>
        </div>
      </header>

      <main className="flex-1 px-4 py-10 sm:py-14">
        <div className="mx-auto max-w-3xl">
          <div className="mb-10 text-center">
            <p className="mb-2 text-xs font-semibold uppercase tracking-widest" style={{ color: "#e1306c" }}>
              Blog
            </p>
            <h1 className="text-2xl font-extrabold text-white sm:text-4xl">{t.articles.heading}</h1>
            <p className="mt-3 text-sm text-slate-500 sm:text-base">{t.articles.subheading}</p>
          </div>

          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="glass-card h-28 animate-pulse" />
              ))}
            </div>
          ) : items.length === 0 ? (
            <p className="text-center text-slate-500">{t.articles.empty}</p>
          ) : (
            <div className="space-y-4">
              {items.map((a) => (
                <Link
                  key={a.id}
                  href={`/${lang}/articles/${a.slug}`}
                  className="glass-card group block p-5 transition-colors hover:border-purple-500/30"
                >
                  <h2 className="mb-2 text-lg font-bold text-slate-100 group-hover:text-white">{a.title}</h2>
                  <p className="mb-3 text-sm leading-relaxed text-slate-500 line-clamp-2">{a.excerpt}</p>
                  <div className="flex items-center justify-between text-xs text-slate-600">
                    <span>
                      {a.created_at
                        ? `${t.articles.publishedAt} · ${new Date(a.created_at).toLocaleDateString(lang)}`
                        : ""}
                    </span>
                    <span className="text-purple-400 group-hover:text-pink-400">{t.articles.readMore} →</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>

      <footer className="py-8 text-center text-xs text-slate-700">
        <span className="text-slate-600">© {new Date().getFullYear()} {siteName}</span>
        <span className="mx-2 text-slate-800">·</span>
        <span>{t.footer.madeWith}</span>
      </footer>
    </div>
  );
}
