"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useT } from "@/i18n/context";
import { LANGS } from "@/i18n/translations";
import { fetchArticles } from "@/lib/api";
import type { ArticleListItem } from "@/types";

const MAX_ITEMS = 6;
const AUTOPLAY_MS = 5000;

function chunk<T>(arr: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

export default function LatestArticlesSlider() {
  const t = useT();
  const { lang } = useParams<{ lang: string }>();
  const isRtl = (LANGS.find((l) => l.code === lang)?.dir ?? "ltr") === "rtl";

  const [items, setItems] = useState<ArticleListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [perView, setPerView] = useState(3);
  const [paused, setPaused] = useState(false);

  const touchStartX = useRef<number | null>(null);
  const touchDeltaX = useRef(0);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchArticles(lang)
      .then((data) => {
        if (!cancelled) setItems(data.slice(0, MAX_ITEMS));
      })
      .catch(() => {
        if (!cancelled) setItems([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [lang]);

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      setPerView(w < 640 ? 1 : w < 900 ? 2 : 3);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const pages = useMemo(() => chunk(items, perView), [items, perView]);
  const pageCount = Math.max(1, pages.length);
  const maxPage = pageCount - 1;

  useEffect(() => {
    setPage(0);
  }, [lang, items.length, perView]);

  const goPrev = useCallback(() => {
    setPage((p) => (p <= 0 ? maxPage : p - 1));
  }, [maxPage]);

  const goNext = useCallback(() => {
    setPage((p) => (p >= maxPage ? 0 : p + 1));
  }, [maxPage]);

  useEffect(() => {
    if (loading || pages.length <= 1 || paused) return;
    const id = window.setInterval(() => {
      setPage((p) => (p >= maxPage ? 0 : p + 1));
    }, AUTOPLAY_MS);
    return () => window.clearInterval(id);
  }, [loading, pages.length, paused, maxPage]);

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchDeltaX.current = 0;
    setPaused(true);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (touchStartX.current == null) return;
    touchDeltaX.current = e.touches[0].clientX - touchStartX.current;
  };

  const onTouchEnd = () => {
    const delta = touchDeltaX.current;
    touchStartX.current = null;
    touchDeltaX.current = 0;
    setPaused(false);
    if (Math.abs(delta) < 40) return;
    // Track is always LTR mechanically
    if (delta < 0) goNext();
    else goPrev();
  };

  if (!loading && items.length === 0) return null;

  // Track always slides LTR mechanically; card text keeps page language direction.
  const transform = `translateX(-${page * 100}%)`;
  const textDir = isRtl ? "rtl" : "ltr";

  return (
    <section className="section-glow relative px-4 py-12 sm:py-16">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 50% 80%, rgba(225,48,108,0.05) 0%, transparent 70%)",
        }}
      />

      <div className="relative mx-auto max-w-5xl">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p
              className="mb-2 text-xs font-semibold uppercase tracking-widest"
              style={{ color: "#e1306c" }}
            >
              Blog
            </p>
            <h2 className="text-2xl font-extrabold text-white sm:text-3xl">
              {t.articles.heading}
            </h2>
            <p className="mt-1 text-sm text-slate-500">{t.articles.subheading}</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label="Previous"
              onClick={goPrev}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-300 transition hover:bg-white/10 hover:text-white"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className={isRtl ? "rotate-180" : ""}>
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
            <button
              type="button"
              aria-label="Next"
              onClick={goNext}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-300 transition hover:bg-white/10 hover:text-white"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className={isRtl ? "rotate-180" : ""}>
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
            <Link
              href={`/${lang}/blogs`}
              className="ms-1 rounded-xl px-3 py-2 text-xs font-medium text-purple-300 transition hover:text-pink-300"
              style={{ background: "rgba(131,58,180,0.12)", border: "1px solid rgba(131,58,180,0.25)" }}
            >
              {t.nav.blog} →
            </Link>
          </div>
        </div>

        {loading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="glass-card h-44 animate-pulse" />
            ))}
          </div>
        ) : (
          <>
            <div
              className="overflow-hidden"
              dir="ltr"
              onMouseEnter={() => setPaused(true)}
              onMouseLeave={() => setPaused(false)}
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
              onTouchEnd={onTouchEnd}
            >
              <div
                className="flex transition-transform duration-500 ease-out"
                style={{ transform }}
              >
                {pages.map((group, gi) => (
                  <div
                    key={gi}
                    className="grid w-full shrink-0 gap-4"
                    style={{
                      gridTemplateColumns: `repeat(${perView}, minmax(0, 1fr))`,
                    }}
                  >
                    {group.map((a) => (
                      <Link
                        key={a.id}
                        href={`/${lang}/blogs/${a.slug}`}
                        dir={textDir}
                        className="glass-card group flex h-full flex-col p-5 transition-colors hover:border-purple-500/30"
                      >
                        <div
                          className="mb-4 flex h-9 w-9 items-center justify-center rounded-xl"
                          style={{
                            background:
                              "linear-gradient(135deg, rgba(131,58,180,0.25), rgba(225,48,108,0.2))",
                            color: "#e9d5ff",
                          }}
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                          </svg>
                        </div>
                        <h3 className="mb-2 line-clamp-2 text-base font-bold text-slate-100 group-hover:text-white">
                          {a.title}
                        </h3>
                        <p className="mb-4 flex-1 text-sm leading-relaxed text-slate-500 line-clamp-3">
                          {a.excerpt}
                        </p>
                        <div className="mt-auto flex items-center justify-between text-xs text-slate-600">
                          <span>
                            {a.created_at
                              ? new Date(a.created_at).toLocaleDateString(lang)
                              : ""}
                          </span>
                          <span className="text-purple-400 group-hover:text-pink-400">
                            {t.articles.readMore} →
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                ))}
              </div>
            </div>

            {pageCount > 1 && (
              <div className="mt-6 flex justify-center gap-2">
                {Array.from({ length: pageCount }).map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    aria-label={`Page ${i + 1}`}
                    onClick={() => setPage(i)}
                    className="h-2 rounded-full transition-all"
                    style={{
                      width: page === i ? 22 : 8,
                      background:
                        page === i
                          ? "linear-gradient(135deg,#833ab4,#e1306c)"
                          : "rgba(255,255,255,0.15)",
                    }}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
