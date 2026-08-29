"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import type { CSSProperties, ReactNode } from "react";
import CookieConsent from "@/components/CookieConsent";
import LatestArticlesSlider from "@/components/LatestArticlesSlider";
import PwaInstallBanner from "@/components/PwaInstallBanner";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import { ToolIcon, TOOL_ACCENT } from "@/components/ToolIcons";
import { TOOL_NAV, listDownloaders } from "@/content/downloaders";
import type { DownloaderToolId } from "@/content/downloaders";

const HOME_FAQ = [
  {
    q: "What is JazzGhost?",
    a: "JazzGhost is a free browser-based toolkit for saving public Instagram media and reading public bio/caption text — without installing an app or creating an account on our site.",
  },
  {
    q: "Which Instagram formats are supported?",
    a: "Dedicated tools cover Reels, posts, carousels, stories, highlights, profile bios, and captions. Open the tool that matches what you need.",
  },
  {
    q: "Is JazzGhost free?",
    a: "Yes. Core downloaders are free to use, with fair-use rate limits to keep the service available for everyone.",
  },
  {
    q: "Do you need my Instagram password?",
    a: "Never. Paste public links or usernames only. We do not ask for your Instagram login on the website.",
  },
];

const FLOAT_LAYOUT: {
  id: DownloaderToolId;
  className: string;
  float: string;
  size: string;
}[] = [
  { id: "reel", className: "hidden sm:flex left-[8%] top-[22%]", float: "home-float-a", size: "h-6 w-6" },
  { id: "story", className: "hidden sm:flex right-[10%] top-[18%]", float: "home-float-b", size: "h-6 w-6" },
  { id: "post", className: "hidden sm:flex left-[12%] bottom-[26%]", float: "home-float-c", size: "h-6 w-6" },
  { id: "carousel", className: "hidden sm:flex right-[9%] bottom-[24%]", float: "home-float-a", size: "h-6 w-6" },
  { id: "highlight", className: "hidden sm:flex left-[42%] top-[8%]", float: "home-float-b", size: "h-5 w-5" },
  { id: "bio", className: "hidden md:flex right-[28%] top-[12%]", float: "home-float-c", size: "h-5 w-5" },
  { id: "caption", className: "hidden md:flex left-[22%] bottom-[12%]", float: "home-float-a", size: "h-5 w-5" },
];

const BENEFIT_ICONS: Record<string, ReactNode> = {
  focused: (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="4" /><path d="M12 3v2M12 19v2M3 12h2M19 12h2" />
    </svg>
  ),
  preview: (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" /><circle cx="12" cy="12" r="3" />
    </svg>
  ),
  private: (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="4" y="11" width="16" height="10" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" />
    </svg>
  ),
};

function FloatingChip({
  id,
  className,
  float,
  size,
}: {
  id: DownloaderToolId;
  className: string;
  float: string;
  size: string;
}) {
  const accent = TOOL_ACCENT[id];
  return (
    <div
      className={`pointer-events-none absolute ${className} ${float}`}
      style={
        {
          "--tool-glow": accent.glow,
          animationDelay: `${(id.length % 5) * 0.35}s`,
        } as CSSProperties
      }
    >
      <div
        className="home-hero-chip"
        style={{
          background: `linear-gradient(145deg, ${accent.soft}, rgba(255,255,255,0.04))`,
          boxShadow: `0 14px 36px -14px ${accent.glow}`,
        }}
      >
        <span style={{ color: accent.to }}>
          <ToolIcon id={id} className={size} />
        </span>
      </div>
    </div>
  );
}

export default function HomePage() {
  const { lang } = useParams<{ lang: string }>();
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME ?? "JazzGhost";
  const tools = listDownloaders();

  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden w-full">
      <SiteHeader active="home" />

      <main className="flex-1">
        {/* Hero */}
        <section className="relative min-h-[88vh] overflow-hidden px-4 pb-20 pt-16 sm:pb-28 sm:pt-20 flex flex-col justify-center">
          <div className="pointer-events-none absolute inset-0">
            <div
              className="absolute left-1/2 top-[-10%] h-[32rem] w-[32rem] -translate-x-1/2 rounded-full opacity-40 blur-[130px]"
              style={{ background: "radial-gradient(circle,#833ab4,transparent 70%)" }}
            />
            <div
              className="absolute right-[-10%] top-1/3 h-72 w-72 rounded-full opacity-25 blur-[100px]"
              style={{ background: "radial-gradient(circle,#e1306c,transparent 70%)" }}
            />
            <div
              className="absolute left-[-5%] bottom-1/4 h-64 w-64 rounded-full opacity-20 blur-[90px]"
              style={{ background: "radial-gradient(circle,#fcb045,transparent 70%)" }}
            />
            <div
              className="absolute inset-0 opacity-[0.07]"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)",
                backgroundSize: "48px 48px",
                maskImage: "radial-gradient(ellipse at center, black 20%, transparent 70%)",
              }}
            />
          </div>

          {FLOAT_LAYOUT.map((item) => (
            <FloatingChip key={item.id} {...item} />
          ))}

          <div className="relative z-10 mx-auto max-w-3xl text-center">
            <p
              className="anim-fade-in mb-6 inline-block text-sm font-semibold tracking-[0.28em] uppercase"
              style={{
                background: "linear-gradient(135deg,#c084fc,#e1306c,#fcb045)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundSize: "200% auto",
                animation: "home-shimmer-line 6s linear infinite",
              }}
            >
              {siteName}
            </p>

            <h1 className="anim-fade-up mb-5 text-4xl font-extrabold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-6xl">
              Instagram tools
              <span className="block mt-1 bg-gradient-to-r from-fuchsia-200 via-rose-200 to-amber-200 bg-clip-text text-transparent">
                with a clear purpose
              </span>
            </h1>

            <p className="anim-fade-up anim-delay-100 mx-auto mb-10 max-w-xl text-base text-slate-400 sm:text-lg">
              Save public Reels, posts, stories and more — or copy bios and captions —
              through focused tools, not one confusing catch-all page.
            </p>

            <div className="anim-fade-up anim-delay-200 flex flex-wrap items-center justify-center gap-3">
              <Link href={`/${lang}/instagram-reels-downloader`} className="btn-primary px-6 py-3 text-sm">
                Open Reels Downloader
              </Link>
              <a href="#tools" className="btn-secondary px-6 py-3 text-sm">
                Browse all tools
              </a>
            </div>

            {/* Icon strip under CTAs — quiet, non-interactive look */}
            <div className="anim-fade-in anim-delay-300 mt-14 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
              {tools.map((tool) => {
                const accent = TOOL_ACCENT[tool.id];
                return (
                  <div
                    key={tool.id}
                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10"
                    style={{
                      background: accent.soft,
                      color: accent.to,
                    }}
                    title={TOOL_NAV.find((t) => t.id === tool.id)?.shortLabel}
                  >
                    <ToolIcon id={tool.id} className="h-4.5 w-4.5 h-[18px] w-[18px]" />
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Mission */}
        <section className="relative border-t border-white/5 px-4 py-16 sm:py-20">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="mb-4 text-2xl font-bold text-white sm:text-3xl">Why JazzGhost exists</h2>
            <p className="text-sm leading-relaxed text-slate-400 sm:text-base">
              Creators, editors, and researchers need reliable ways to archive public Instagram media offline.
              JazzGhost is built around that job: fast previews, HD saves, and honest pages for each format.
            </p>
          </div>
        </section>

        {/* Tools */}
        <section id="tools" className="relative px-4 py-16 sm:py-24">
          <div className="mx-auto max-w-5xl">
            <div className="mb-12 text-center">
              <h2 className="mb-3 text-2xl font-bold text-white sm:text-3xl">Downloaders & utilities</h2>
              <p className="mx-auto max-w-lg text-sm text-slate-400">
                Each tool has its own URL, steps, and SEO — pick the one that matches your intent.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {tools.map((tool, i) => {
                const accent = TOOL_ACCENT[tool.id];
                const short =
                  TOOL_NAV.find((t) => t.id === tool.id)?.shortLabel ?? tool.id;
                return (
                  <Link
                    key={tool.slug}
                    href={`/${lang}/${tool.slug}`}
                    className="home-tool-card group anim-fade-up p-5 sm:p-6 text-left"
                    style={
                      {
                        "--tool-from": accent.from,
                        "--tool-to": accent.to,
                        "--tool-glow": accent.glow,
                        "--tool-soft": accent.soft,
                        animationDelay: `${i * 0.06}s`,
                      } as CSSProperties
                    }
                  >
                    <div className="relative z-[1] flex items-start gap-4">
                      <div className="home-tool-icon shrink-0">
                        <ToolIcon id={tool.id} className="h-6 w-6" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p
                          className="mb-1 text-[11px] font-semibold uppercase tracking-[0.16em]"
                          style={{ color: accent.to }}
                        >
                          {short}
                        </p>
                        <h3 className="mb-2 text-[15px] font-semibold leading-snug text-white group-hover:text-white">
                          {tool.h1}
                        </h3>
                        <p className="text-sm leading-relaxed text-slate-400 line-clamp-2 group-hover:text-slate-300">
                          {tool.subtitle}
                        </p>
                        <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 transition group-hover:text-white">
                          Open tool
                          <svg
                            className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            aria-hidden
                          >
                            <path d="M5 12h14M13 5l7 7-7 7" />
                          </svg>
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="border-t border-white/5 px-4 py-16 sm:py-20">
          <div className="mx-auto max-w-4xl">
            <h2 className="mb-10 text-center text-2xl font-bold text-white">What you can expect</h2>
            <div className="grid gap-6 sm:grid-cols-3">
              {[
                {
                  key: "focused",
                  title: "Focused pages",
                  desc: "Reels, stories, bios, and captions each get dedicated flows — less mismatch, clearer steps.",
                },
                {
                  key: "preview",
                  title: "Preview before save",
                  desc: "Confirm the media looks right before you use a download slot.",
                },
                {
                  key: "private",
                  title: "No JazzGhost account",
                  desc: "Use the tools in your browser. We never ask for your Instagram password on the site.",
                },
              ].map((b) => (
                <div
                  key={b.key}
                  className="rounded-2xl border border-white/8 bg-white/[0.02] p-5 text-left"
                >
                  <div
                    className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl text-fuchsia-200"
                    style={{
                      background: "linear-gradient(135deg, rgba(131,58,180,0.25), rgba(225,48,108,0.15))",
                    }}
                  >
                    {BENEFIT_ICONS[b.key]}
                  </div>
                  <h3 className="mb-2 font-semibold text-white">{b.title}</h3>
                  <p className="text-sm leading-relaxed text-slate-400">{b.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="px-4 py-16 sm:py-20">
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-10 text-center text-2xl font-bold text-white">How JazzGhost works</h2>
            <ol className="space-y-5">
              {[
                "Choose the tool that matches your content type.",
                "Paste a public Instagram URL or username and preview the result.",
                "Download the media or copy the text — then keep creating offline.",
              ].map((step, i) => (
                <li
                  key={step}
                  className="flex gap-4 rounded-2xl border border-white/8 bg-gradient-to-r from-white/[0.03] to-transparent px-4 py-4 text-left"
                >
                  <span
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-sm font-bold text-white"
                    style={{ background: "linear-gradient(135deg,#833ab4,#e1306c)" }}
                  >
                    {i + 1}
                  </span>
                  <p className="pt-1.5 text-sm text-slate-300 sm:text-base">{step}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Trust */}
        <section className="border-t border-white/5 px-4 py-14">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="mb-3 text-xl font-bold text-white">Built for public content only</h2>
            <p className="text-sm text-slate-400">
              JazzGhost respects private accounts and Instagram’s limits. Use downloads for personal archives
              and always credit creators when you republish.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              {TOOL_NAV.slice(0, 5).map((tNav) => {
                const accent = TOOL_ACCENT[tNav.id];
                return (
                  <Link
                    key={tNav.slug}
                    href={tNav.href(lang)}
                    className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-2 text-xs text-slate-300 transition hover:border-white/20 hover:text-white"
                  >
                    <span style={{ color: accent.to }}>
                      <ToolIcon id={tNav.id} className="h-3.5 w-3.5" />
                    </span>
                    {tNav.shortLabel}
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="px-4 py-16 sm:py-20">
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-8 text-center text-2xl font-bold text-white">FAQ</h2>
            <div className="space-y-3 text-left">
              {HOME_FAQ.map((item) => (
                <details
                  key={item.q}
                  className="group rounded-2xl border border-white/10 bg-white/[0.02] px-5 py-4 open:border-white/15 open:bg-white/[0.04]"
                >
                  <summary className="cursor-pointer list-none font-medium text-white marker:content-none flex items-center justify-between gap-3">
                    {item.q}
                    <svg
                      className="h-4 w-4 shrink-0 text-slate-500 transition group-open:rotate-45"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      aria-hidden
                    >
                      <path d="M12 5v14M5 12h14" strokeLinecap="round" />
                    </svg>
                  </summary>
                  <p className="mt-3 text-sm leading-relaxed text-slate-400">{item.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="relative overflow-hidden border-t border-white/5 px-4 py-16 text-center">
          <div
            className="pointer-events-none absolute inset-0 opacity-40"
            style={{
              background:
                "radial-gradient(ellipse at center, rgba(131,58,180,0.35), transparent 55%)",
            }}
          />
          <div className="relative">
            <h2 className="mb-3 text-2xl font-bold text-white">Ready when you are</h2>
            <p className="mb-7 text-sm text-slate-400">Jump into a dedicated downloader — no sign-up wall.</p>
            <Link
              href={`/${lang}/instagram-reels-downloader`}
              className="btn-primary inline-flex items-center gap-2 px-6 py-3 text-sm"
            >
              <ToolIcon id="reel" className="h-4 w-4" />
              Start with Reels
            </Link>
          </div>
        </section>

        <LatestArticlesSlider />
      </main>

      <PwaInstallBanner />
      <CookieConsent />
      <SiteFooter />
    </div>
  );
}
