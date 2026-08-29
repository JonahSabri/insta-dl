"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import CookieConsent from "@/components/CookieConsent";
import { useT } from "@/i18n/context";
import { fetchArticles } from "@/lib/api";
import type { ArticleListItem } from "@/types";

export default function ArticlesPage() {
  const t = useT();
  const { lang } = useParams<{ lang: string }>();
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
      <SiteHeader active="blogs" />

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
                  href={`/${lang}/blogs/${a.slug}`}
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

      <CookieConsent />
      <SiteFooter />
    </div>
  );
}
