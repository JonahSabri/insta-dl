"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import CookieConsent from "@/components/CookieConsent";
import { FAQ_CATEGORIES, FAQ_TOTAL } from "@/content/faq";
import { useT } from "@/i18n/context";
import { cn } from "@/lib/cn";

export default function FaqPageClient() {
  const t = useT();
  const { lang } = useParams<{ lang: string }>();
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState(FAQ_CATEGORIES[0].id);
  const [openKey, setOpenKey] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return FAQ_CATEGORIES;
    return FAQ_CATEGORIES.map((cat) => ({
      ...cat,
      items: cat.items.filter(
        (item) => item.q.toLowerCase().includes(q) || item.a.toLowerCase().includes(q)
      ),
    })).filter((cat) => cat.items.length > 0);
  }, [search]);

  const visible = search
    ? filtered
    : FAQ_CATEGORIES.filter((c) => c.id === activeCategory);

  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden w-full">
      <SiteHeader active="faq" />

      <main className="flex-1 px-4 py-10 sm:py-14">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 text-center">
            <p
              className="mb-3 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium"
              style={{
                background: "rgba(168,85,247,0.1)",
                border: "1px solid rgba(168,85,247,0.25)",
                color: "#c084fc",
              }}
            >
              JazzGhost.com
            </p>
            <h1 className="ig-gradient-text text-3xl font-extrabold tracking-tight sm:text-4xl">
              {t.faq.heading}
            </h1>
            <p className="mx-auto mt-3 max-w-xl text-sm text-slate-500 sm:text-base">
              {t.faq.subheading.replace("{count}", String(FAQ_TOTAL))}
            </p>
          </div>

          <div className="relative mx-auto mb-10 max-w-xl">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t.faq.searchPlaceholder}
              className="input-field w-full py-3 pl-4 pr-4 text-sm"
              aria-label={t.faq.searchPlaceholder}
            />
          </div>

          <div className="flex flex-col gap-8 lg:flex-row">
            {!search && (
              <aside className="lg:w-64 shrink-0">
                <div className="glass-card sticky top-20 space-y-1 p-3">
                  <p className="px-2 pb-2 text-[10px] uppercase tracking-widest text-slate-600">
                    {t.faq.categories}
                  </p>
                  {FAQ_CATEGORIES.map((cat) => {
                    const isActive = activeCategory === cat.id;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setActiveCategory(cat.id)}
                        className={cn(
                          "flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left text-sm transition-colors",
                          isActive ? "text-white" : "text-slate-400 hover:text-white hover:bg-white/5"
                        )}
                        style={
                          isActive
                            ? {
                                background: `${cat.color}18`,
                                border: `1px solid ${cat.color}40`,
                                color: cat.color,
                              }
                            : { border: "1px solid transparent" }
                        }
                      >
                        <span className="flex-1">{cat.label}</span>
                        <span className="rounded-full bg-white/5 px-2 py-0.5 text-[10px] text-slate-500">
                          {cat.items.length}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </aside>
            )}

            <div className="min-w-0 flex-1 space-y-8">
              {visible.length === 0 ? (
                <p className="py-16 text-center text-slate-500">
                  {t.faq.noResults.replace("{query}", search)}
                </p>
              ) : (
                visible.map((cat) => (
                  <section key={cat.id}>
                    <div className="mb-3 flex items-center gap-3">
                      <div
                        className="flex h-9 w-9 items-center justify-center rounded-xl text-sm font-bold"
                        style={{
                          background: `${cat.color}18`,
                          border: `1px solid ${cat.color}30`,
                          color: cat.color,
                        }}
                      >
                        ?
                      </div>
                      <h2 className="text-lg font-bold text-white">{cat.label}</h2>
                      <span
                        className="ms-auto rounded-full px-2.5 py-0.5 text-[10px]"
                        style={{ background: `${cat.color}15`, color: cat.color }}
                      >
                        {cat.items.length} {t.faq.questions}
                      </span>
                    </div>
                    <div className="space-y-2">
                      {cat.items.map((item, i) => {
                        const key = `${cat.id}-${i}`;
                        const open = openKey === key;
                        return (
                          <div
                            key={key}
                            className="overflow-hidden rounded-xl border border-white/10 bg-white/[0.03]"
                          >
                            <button
                              type="button"
                              className="flex w-full items-center gap-3 px-4 py-3.5 text-left"
                              onClick={() => setOpenKey(open ? null : key)}
                              aria-expanded={open}
                            >
                              <span className="flex-1 text-sm font-medium text-slate-100 leading-relaxed">
                                {item.q}
                              </span>
                              <span
                                className={cn(
                                  "flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-white/5 text-slate-400 transition-transform",
                                  open && "rotate-180"
                                )}
                              >
                                ▾
                              </span>
                            </button>
                            {open && (
                              <div
                                className="space-y-1.5 border-t px-4 pb-4 pt-3 text-sm leading-relaxed text-slate-400"
                                style={{ borderColor: `${cat.color}22` }}
                              >
                                {item.a.split("\n").map((line, li) => (
                                  <p key={li}>{line}</p>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </section>
                ))
              )}
            </div>
          </div>

          <div className="mt-16 text-center">
            <div
              className="inline-block rounded-2xl px-8 py-8"
              style={{
                background: "linear-gradient(135deg, rgba(168,85,247,0.1) 0%, rgba(236,72,153,0.08) 100%)",
                border: "1px solid rgba(168,85,247,0.2)",
              }}
            >
              <p className="mb-1 text-sm text-slate-500">{t.faq.ctaEyebrow}</p>
              <h3 className="mb-5 text-xl font-bold text-white">{t.faq.ctaTitle}</h3>
              <Link href={`/${lang}`} className="btn-primary inline-flex">
                {t.faq.ctaButton}
              </Link>
            </div>
          </div>
        </div>
      </main>

      <CookieConsent />
      <SiteFooter />
    </div>
  );
}
