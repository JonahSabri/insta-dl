"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import CookieConsent from "@/components/CookieConsent";
import LatestArticlesSlider from "@/components/LatestArticlesSlider";
import PwaInstallBanner from "@/components/PwaInstallBanner";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import { TOOL_NAV, listDownloaders } from "@/content/downloaders";

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

export default function HomePage() {
  const { lang } = useParams<{ lang: string }>();
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME ?? "JazzGhost";
  const tools = listDownloaders();

  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden w-full">
      <SiteHeader active="home" />

      <main className="flex-1">
        {/* Brand hero — no downloader as primary */}
        <section className="relative overflow-hidden px-4 pb-16 pt-16 sm:pb-24 sm:pt-24">
          <div className="pointer-events-none absolute inset-0">
            <div
              className="absolute left-1/2 top-0 h-[28rem] w-[28rem] -translate-x-1/2 -translate-y-1/4 rounded-full opacity-35 blur-[120px]"
              style={{ background: "radial-gradient(circle,#833ab4,transparent)" }}
            />
            <div
              className="absolute right-0 top-40 h-64 w-64 rounded-full opacity-20 blur-[90px]"
              style={{ background: "radial-gradient(circle,#e1306c,transparent)" }}
            />
          </div>

          <div className="relative mx-auto max-w-3xl text-center">
            <p
              className="anim-fade-in mb-5 text-sm font-semibold tracking-[0.2em] uppercase"
              style={{
                background: "linear-gradient(135deg,#c084fc,#e1306c,#fcb045)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              {siteName}
            </p>
            <h1 className="anim-fade-up mb-5 text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
              Instagram tools with a clear purpose
            </h1>
            <p className="anim-fade-up mx-auto mb-10 max-w-2xl text-base text-slate-400 sm:text-lg">
              JazzGhost helps you save public Reels, posts, stories, and more — and copy bios or captions —
              through focused tools instead of one confusing catch-all page.
            </p>
            <div className="anim-fade-up flex flex-wrap items-center justify-center gap-3">
              <Link
                href={`/${lang}/instagram-reels-downloader`}
                className="btn-primary px-6 py-3 text-sm"
              >
                Open Reels Downloader
              </Link>
              <a
                href="#tools"
                className="btn-secondary px-6 py-3 text-sm"
              >
                Browse all tools
              </a>
            </div>
          </div>
        </section>

        {/* Mission */}
        <section className="border-t border-white/5 px-4 py-14 sm:py-20">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-4 text-2xl font-bold text-white sm:text-3xl">Why JazzGhost exists</h2>
            <p className="text-sm leading-relaxed text-slate-400 sm:text-base">
              Creators, editors, and researchers need reliable ways to archive public Instagram media offline.
              JazzGhost is built around that job: fast previews, HD saves, and honest pages for each format —
              not dark patterns or fake “download” tabs.
            </p>
          </div>
        </section>

        {/* Tools grid */}
        <section id="tools" className="px-4 py-14 sm:py-20">
          <div className="mx-auto max-w-4xl">
            <h2 className="mb-3 text-center text-2xl font-bold text-white sm:text-3xl">
              Downloaders & utilities
            </h2>
            <p className="mx-auto mb-10 max-w-xl text-center text-sm text-slate-400">
              Each capability has its own URL, instructions, and SEO — pick the tool that matches your intent.
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              {tools.map((tool) => (
                <Link
                  key={tool.slug}
                  href={`/${lang}/${tool.slug}`}
                  className="group rounded-2xl border border-white/10 bg-white/[0.02] p-5 text-left transition hover:border-white/25 hover:bg-white/[0.04]"
                >
                  <h3 className="mb-2 text-base font-semibold text-white group-hover:text-fuchsia-200">
                    {tool.h1}
                  </h3>
                  <p className="text-sm text-slate-400 line-clamp-2">{tool.subtitle}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="border-t border-white/5 px-4 py-14 sm:py-16">
          <div className="mx-auto max-w-4xl">
            <h2 className="mb-8 text-center text-2xl font-bold text-white">What you can expect</h2>
            <div className="grid gap-8 sm:grid-cols-3 text-left">
              {[
                {
                  title: "Focused pages",
                  desc: "Reels, stories, bios, and captions each get dedicated flows — less mismatch, clearer steps.",
                },
                {
                  title: "Preview before save",
                  desc: "Confirm the media looks right before you use a download slot.",
                },
                {
                  title: "No JazzGhost account",
                  desc: "Use the tools in your browser. We never ask for your Instagram password on the site.",
                },
              ].map((b) => (
                <div key={b.title}>
                  <h3 className="mb-2 font-semibold text-white">{b.title}</h3>
                  <p className="text-sm text-slate-400">{b.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How it works (brand level) */}
        <section className="px-4 py-14 sm:py-16">
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-8 text-center text-2xl font-bold text-white">How JazzGhost works</h2>
            <ol className="space-y-6">
              {[
                "Choose the tool that matches your content type (Reel, Story, Bio, …).",
                "Paste a public Instagram URL or username and preview the result.",
                "Download the media or copy the text — then keep creating offline.",
              ].map((step, i) => (
                <li key={step} className="flex gap-4 text-left">
                  <span
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm font-bold text-white"
                    style={{ background: "linear-gradient(135deg,#833ab4,#e1306c)" }}
                  >
                    {i + 1}
                  </span>
                  <p className="pt-1 text-sm text-slate-300 sm:text-base">{step}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Trust */}
        <section className="border-t border-white/5 px-4 py-12">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="mb-3 text-xl font-bold text-white">Built for public content only</h2>
            <p className="text-sm text-slate-400">
              JazzGhost respects private accounts and Instagram’s limits. Use downloads for personal archives
              and always credit creators when you republish.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              {TOOL_NAV.slice(0, 4).map((tNav) => (
                <Link
                  key={tNav.slug}
                  href={tNav.href(lang)}
                  className="rounded-lg border border-white/10 px-3 py-1.5 text-xs text-slate-400 hover:text-white"
                >
                  {tNav.shortLabel}
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="px-4 py-14 sm:py-20">
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-8 text-center text-2xl font-bold text-white">FAQ</h2>
            <div className="space-y-3 text-left">
              {HOME_FAQ.map((item) => (
                <details
                  key={item.q}
                  className="rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3"
                >
                  <summary className="cursor-pointer font-medium text-white">{item.q}</summary>
                  <p className="mt-2 text-sm text-slate-400">{item.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="border-t border-white/5 px-4 py-14 text-center">
          <h2 className="mb-3 text-2xl font-bold text-white">Ready when you are</h2>
          <p className="mb-6 text-sm text-slate-400">Jump into a dedicated downloader — no sign-up wall.</p>
          <Link href={`/${lang}/instagram-reels-downloader`} className="btn-primary inline-block px-6 py-3 text-sm">
            Start with Reels
          </Link>
        </section>

        <LatestArticlesSlider />
      </main>

      <PwaInstallBanner />
      <CookieConsent />
      <SiteFooter />
    </div>
  );
}
