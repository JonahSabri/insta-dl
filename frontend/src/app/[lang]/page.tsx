"use client";

import DownloadBox from "@/components/DownloadBox";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useT } from "@/i18n/context";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function HomePage() {
  const t = useT();
  const { lang } = useParams<{ lang: string }>();
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME ?? "InstaGet";

  return (
    <div className="flex min-h-screen flex-col">

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
          <div className="flex items-center gap-3">
            <div
              className="flex h-8 w-8 items-center justify-center rounded-xl text-sm font-bold text-white"
              style={{
                background: "linear-gradient(135deg,#833ab4,#e1306c,#fcb045)",
                boxShadow: "0 0 16px rgba(131,58,180,0.5), 0 0 32px rgba(225,48,108,0.2)",
              }}
            >
              ↓
            </div>
            <span className="ig-gradient-text text-lg font-extrabold tracking-tight">
              {siteName}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <Link
              href={`/${lang}/admin`}
              className="rounded-lg border px-3 py-1.5 text-xs text-slate-400 transition-all
                hover:text-white"
              style={{
                background: "rgba(131,58,180,0.06)",
                borderColor: "rgba(131,58,180,0.18)",
                backdropFilter: "blur(8px)",
              }}
            >
              {t.header.admin}
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">

        {/* ══ HERO ════════════════════════════════════════════════════════ */}
        <section className="relative overflow-hidden px-4 pb-24 pt-20 text-center">

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
            <h1 className="anim-fade-up mb-5 text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
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

            {/* Supported badges */}
            <div className="anim-fade-up anim-delay-200 mb-10 flex flex-wrap justify-center gap-2">
              {t.hero.supported.map((s, i) => (
                <span
                  key={s.label}
                  className="flex items-center gap-1.5 rounded-full px-3 py-1 text-xs backdrop-blur-sm"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    color: "#94a3b8",
                    animationDelay: `${0.2 + i * 0.06}s`,
                  }}
                >
                  {s.icon} {s.label}
                </span>
              ))}
            </div>

            {/* Download box with Instagram ring */}
            <div className="anim-fade-up anim-delay-300">
              <div className="ig-ring-wrap">
                <div className="ig-ring-inner">
                  <DownloadBox />
                </div>
              </div>
            </div>

            {/* Trust indicators */}
            <div className="anim-fade-in anim-delay-500 mt-6 flex flex-wrap justify-center gap-5 text-xs text-slate-600">
              {["🔒 No login required", "⚡ HD quality", "🆓 Always free"].map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>
          </div>
        </section>

        {/* ══ HOW TO ══════════════════════════════════════════════════════ */}
        <section className="section-glow relative px-4 py-20">
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
                  <div className="absolute right-3 top-3 text-2xl opacity-10 transition-opacity group-hover:opacity-20">
                    {i === 0 ? "🔗" : i === 1 ? "📋" : "🎯"}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══ FEATURES ════════════════════════════════════════════════════ */}
        <section className="section-glow relative px-4 py-20">
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
                {t.features.heading.replace("InstaGet", siteName)}
              </h2>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {t.features.items.map((f, i) => (
                <div
                  key={f.title}
                  className={`glass-card anim-fade-up group flex gap-4 p-6 ${f.delay}`}
                >
                  <div className="feature-icon">{f.icon}</div>
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
