"use client";

import DownloadBox from "@/components/DownloadBox";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import PwaInstallBanner from "@/components/PwaInstallBanner";
import { useT } from "@/i18n/context";
import { useParams } from "next/navigation";

/* ── Inline SVG icon atoms ─────────────────────────────────────────────── */
function IconReel()     { return <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>; }
function IconPost()     { return <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>; }
function IconCarousel() { return <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="6" width="14" height="12" rx="2"/><path d="M18 8h2a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-2"/></svg>; }
function IconStory()    { return <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>; }

function FeatureIcon({ id }: { id: string }) {
  const cls = "w-5 h-5";
  if (id === "fast")    return <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>;
  if (id === "formats") return <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>;
  if (id === "private") return <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>;
  if (id === "free")    return <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>;
  return null;
}

export default function HomePage() {
  const t = useT();
  const { lang } = useParams<{ lang: string }>();
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME ?? "JazzGhost";

  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden w-full">

      {/* ══ HEADER ══════════════════════════════════════════════════════ */}
      <header
        className="sticky top-0 z-50 border-b"
        style={{
          background: "rgba(6,6,16,0.8)",
          backdropFilter: "blur(24px)",
          borderColor: "rgba(131,58,180,0.15)",
        }}
      >
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div
              className="flex h-8 w-8 items-center justify-center rounded-xl text-white"
              style={{
                background: "linear-gradient(135deg,#833ab4,#e1306c,#fcb045)",
                boxShadow: "0 0 16px rgba(131,58,180,0.5), 0 0 32px rgba(225,48,108,0.2)",
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
            </div>
            <span className="ig-gradient-text text-lg font-extrabold tracking-tight">
              {siteName}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <LanguageSwitcher />
          </div>
        </div>
      </header>

      <main className="flex-1">

        {/* ══ HERO ════════════════════════════════════════════════════════ */}
        <section className="relative overflow-hidden px-4 pb-16 pt-12 sm:pb-24 sm:pt-20 text-center">

          {/* Hero glow blobs */}
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 -translate-y-1/4 rounded-full opacity-30 blur-[120px]"
              style={{ background: "radial-gradient(circle,#833ab4,transparent)" }} />
            <div className="absolute left-1/2 top-32 h-64 w-64 -translate-x-1/2 rounded-full opacity-20 blur-[80px]"
              style={{ background: "radial-gradient(circle,#e1306c,transparent)" }} />
          </div>

          <div className="relative mx-auto max-w-2xl">

            {/* Floating badge */}
            <div
              className="anim-fade-in mb-6 inline-flex items-center gap-2.5 rounded-full px-4 py-1.5 text-xs font-medium"
              style={{
                background: "rgba(131,58,180,0.12)",
                border: "1px solid rgba(131,58,180,0.3)",
                color: "#d8b4fe",
                backdropFilter: "blur(8px)",
                animation: "fade-in 0.4s ease both, badge-float 3s ease-in-out infinite 0.5s",
              }}
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full opacity-80"
                  style={{ background: "#e1306c", animation: "ping-slow 1.8s ease-out infinite" }} />
                <span className="relative inline-flex h-2 w-2 rounded-full"
                  style={{ background: "linear-gradient(135deg,#833ab4,#e1306c)" }} />
              </span>
              {t.hero.badge}
            </div>

            {/* Main title */}
            <h1 className="anim-fade-up mb-4 text-3xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              <span className="block text-white/90">{t.hero.titleLine1}</span>
              <span
                className="block"
                style={{
                  background: "linear-gradient(135deg,#c084fc 0%,#e1306c 45%,#fcb045 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  lineHeight: 1.1,
                  paddingBottom: "0.1em",
                }}
              >
                {t.hero.titleHighlight}
              </span>
              <span className="block text-white/90">{t.hero.titleLine2}</span>
            </h1>

            <p className="anim-fade-up anim-delay-100 mb-4 text-base text-slate-400 sm:text-lg">
              {t.hero.subtitle}
            </p>

            {/* Supported badges — icon labels (no emojis) */}
            <div className="anim-fade-up anim-delay-200 mb-10 flex flex-wrap justify-center gap-2">
              {[
                { label: "Reel",     icon: <IconReel /> },
                { label: "Post",     icon: <IconPost /> },
                { label: "Carousel", icon: <IconCarousel /> },
                { label: "Story",    icon: <IconStory /> },
              ].map((s) => (
                <span
                  key={s.label}
                  className="flex items-center gap-1.5 rounded-full px-3 py-1 text-xs backdrop-blur-sm"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    color: "#94a3b8",
                  }}
                >
                  {s.icon} {s.label}
                </span>
              ))}
            </div>

              {/* Download box */}
            <div className="anim-fade-up anim-delay-300">
              <DownloadBox />
            </div>

            {/* Trust indicators */}
            <div className="anim-fade-in anim-delay-500 mt-6 flex flex-wrap justify-center gap-5 text-xs text-slate-600">
              {[
                { icon: <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>, label: "No login required" },
                { icon: <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>, label: "HD quality" },
                { icon: <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>, label: "Always free" },
              ].map((item) => (
                <span key={item.label} className="flex items-center gap-1.5">
                  {item.icon} {item.label}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* ══ HOW TO ══════════════════════════════════════════════════════ */}
        <section className="section-glow relative px-4 py-12 sm:py-20">
          {/* Section background */}
          <div className="pointer-events-none absolute inset-0"
            style={{
              background: "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(131,58,180,0.04) 0%, transparent 70%)",
            }} />

          <div className="relative mx-auto max-w-3xl">
            <div className="anim-fade-up mb-12 text-center">
              <p className="mb-2 text-xs font-semibold uppercase tracking-widest"
                style={{ color: "#e1306c" }}>
                How it works
              </p>
              <h2 className="text-2xl font-extrabold text-white sm:text-3xl">
                {t.howTo.heading}
              </h2>
              <p className="mt-2 text-sm text-slate-500">{t.howTo.subheading}</p>
            </div>

            <div className="grid gap-5 sm:grid-cols-3">
              {t.howTo.steps.map((item, i) => (
                <div
                  key={item.step}
                  className="glow-card anim-fade-up group p-6"
                  style={{ animationDelay: `${i * 0.12}s` }}
                >
                  {/* Connector line (desktop) */}
                  {/* Step number */}
                  <div className="step-num mb-4 text-base">
                    {item.step}
                  </div>
                  <h3 className="mb-2 font-bold text-slate-100">{item.label}</h3>
                  <p className="text-sm leading-relaxed text-slate-500">{item.desc}</p>

                  {/* Decorative corner */}
                  <div className="absolute right-3 top-3 opacity-10 transition-opacity group-hover:opacity-20 text-white">
                    {i === 0
                      ? <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
                      : i === 1
                      ? <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                      : <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                    }
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══ FEATURES ════════════════════════════════════════════════════ */}
        <section className="section-glow relative px-4 py-12 sm:py-20">
          <div className="pointer-events-none absolute inset-0"
            style={{
              background: "linear-gradient(180deg, rgba(6,6,16,0) 0%, rgba(131,58,180,0.04) 50%, rgba(6,6,16,0) 100%)",
            }} />

          {/* Decorative line */}
          <div className="mx-auto mb-16 max-w-3xl">
            <div className="mb-12 text-center">
              <p className="anim-fade-up mb-2 text-xs font-semibold uppercase tracking-widest"
                style={{ color: "#fcb045" }}>
                Features
              </p>
              <h2 className="anim-fade-up text-2xl font-extrabold text-white sm:text-3xl">
                {t.features.heading}
              </h2>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {t.features.items.map((f) => (
                <div
                  key={f.title}
                  className={`glass-card anim-fade-up group flex gap-4 p-6 ${f.delay}`}
                >
                  <div className="feature-icon">
                    <FeatureIcon id={f.icon} />
                  </div>
                  <div className="min-w-0">
                    <h3 className="mb-1.5 font-bold text-slate-100">{f.title}</h3>
                    <p className="text-sm leading-relaxed text-slate-500">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══ STATS STRIP ════════════════════════════════════════════════ */}
        <section className="relative px-4 py-10">
          <div
            className="mx-auto max-w-3xl rounded-2xl px-6 py-5"
            style={{
              background: "linear-gradient(135deg, rgba(131,58,180,0.08) 0%, rgba(225,48,108,0.06) 50%, rgba(252,176,69,0.04) 100%)",
              border: "1px solid rgba(131,58,180,0.15)",
            }}
          >
            <div className="grid grid-cols-3 divide-x divide-white/[0.06]">
              {[
                { num: "HD", label: "Max quality" },
                { num: "3s",  label: "Avg download" },
                { num: "∞",  label: "Free forever" },
              ].map((s) => (
                <div key={s.label} className="px-4 text-center">
                  <div
                    className="mb-1 text-2xl font-extrabold sm:text-3xl"
                    style={{
                      background: "linear-gradient(135deg,#c084fc,#e1306c,#fcb045)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    {s.num}
                  </div>
                  <div className="text-xs text-slate-600">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* ══ PWA INSTALL BANNER ══════════════════════════════════════════ */}
      <PwaInstallBanner />

      {/* ══ FOOTER ══════════════════════════════════════════════════════ */}
      <footer className="py-8 text-center text-xs text-slate-700">
        <div
          className="mx-auto mb-3 h-px max-w-xs"
          style={{ background: "linear-gradient(90deg,transparent,rgba(131,58,180,0.3),rgba(225,48,108,0.2),transparent)" }}
        />
        <span className="text-slate-600">© {new Date().getFullYear()} {siteName}</span>
        <span className="mx-2 text-slate-800">·</span>
        <span>{t.footer.madeWith}</span>
      </footer>
    </div>
  );
}
