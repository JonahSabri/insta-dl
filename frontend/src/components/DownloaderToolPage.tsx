"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import BioBox from "@/components/BioBox";
import CaptionBox from "@/components/CaptionBox";
import CookieConsent from "@/components/CookieConsent";
import DownloadBox from "@/components/DownloadBox";
import PwaInstallBanner from "@/components/PwaInstallBanner";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import type { DownloaderContent } from "@/content/downloaders";
import { TOOL_NAV } from "@/content/downloaders";
import type { ExtendedMediaTypeFilter } from "@/components/DownloadBox";

interface Props {
  content: DownloaderContent;
}

export default function DownloaderToolPage({ content }: Props) {
  const { lang } = useParams<{ lang: string }>();

  const mediaLocked =
    content.lockedType !== "bio" && content.lockedType !== "caption"
      ? (content.lockedType as ExtendedMediaTypeFilter)
      : undefined;

  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden w-full">
      <SiteHeader active="home" />

      <main className="flex-1">
        {/* Hero + tool */}
        <section className="relative overflow-hidden px-4 pb-12 pt-12 sm:pb-16 sm:pt-16 text-center">
          <div className="pointer-events-none absolute inset-0">
            <div
              className="absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 -translate-y-1/4 rounded-full opacity-30 blur-[120px]"
              style={{ background: "radial-gradient(circle,#833ab4,transparent)" }}
            />
          </div>

          <div className="relative mx-auto max-w-3xl">
            <nav className="mb-6 text-xs text-slate-500" aria-label="Breadcrumb">
              <Link href={`/${lang}`} className="hover:text-slate-300">
                Home
              </Link>
              <span className="mx-2">/</span>
              <span className="text-slate-400">{content.h1}</span>
            </nav>

            <h1 className="anim-fade-up mb-4 text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl lg:text-5xl text-white">
              {content.h1}
            </h1>
            <p className="anim-fade-up mx-auto mb-8 max-w-2xl text-base text-slate-400 sm:text-lg">
              {content.subtitle}
            </p>

            <div id="tool" className="anim-fade-up">
              {content.id === "bio" ? (
                <BioBox placeholder={content.placeholder} ctaLabel={content.ctaLabel} />
              ) : content.id === "caption" ? (
                <CaptionBox placeholder={content.placeholder} ctaLabel={content.ctaLabel} />
              ) : (
                <DownloadBox
                  lockedType={mediaLocked}
                  placeholder={content.placeholder}
                  ctaLabel={content.ctaLabel}
                />
              )}
            </div>

            {/* Related tools — non-interactive-looking list of real links */}
            <div className="mt-10 flex flex-wrap justify-center gap-2">
              {TOOL_NAV.filter((t) => t.slug !== content.slug).map((t) => (
                <Link
                  key={t.slug}
                  href={t.href(lang)}
                  className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs text-slate-400 transition hover:border-white/20 hover:text-white"
                >
                  {t.shortLabel}
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Steps */}
        <section className="px-4 py-14 sm:py-20" aria-labelledby="howto-heading">
          <div className="mx-auto max-w-3xl">
            <h2 id="howto-heading" className="mb-10 text-center text-2xl font-bold text-white sm:text-3xl">
              {content.howToTitle}
            </h2>
            <ol className="space-y-8">
              {[...content.steps]
                .sort((a, b) => a.order - b.order)
                .map((step) => (
                  <li
                    key={step.order}
                    className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-6"
                  >
                    <div
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-bold text-white"
                      style={{
                        background: "linear-gradient(135deg,#833ab4,#e1306c)",
                      }}
                    >
                      {step.order}
                    </div>
                    <div className="min-w-0 flex-1 text-left">
                      <h3 className="mb-1 text-lg font-semibold text-white">{step.title}</h3>
                      <p className="text-sm leading-relaxed text-slate-400">{step.description}</p>
                      {step.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={step.image}
                          alt={step.imageAlt || step.title}
                          className="mt-4 w-full max-w-md rounded-xl border border-white/10"
                          loading="lazy"
                        />
                      ) : null}
                    </div>
                  </li>
                ))}
            </ol>
          </div>
        </section>

        {/* About */}
        <section className="border-t border-white/5 px-4 py-14 sm:py-20">
          <div className="mx-auto max-w-3xl text-left">
            <h2 className="mb-6 text-2xl font-bold text-white">{content.aboutTitle}</h2>
            <div className="space-y-4 text-sm leading-relaxed text-slate-400 sm:text-base">
              {content.aboutBody.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="px-4 py-14 sm:py-16">
          <div className="mx-auto max-w-4xl">
            <h2 className="mb-8 text-center text-2xl font-bold text-white">{content.featuresTitle}</h2>
            <div className="grid gap-6 sm:grid-cols-2">
              {content.features.map((f) => (
                <div key={f.title} className="text-left">
                  <h3 className="mb-2 font-semibold text-white">{f.title}</h3>
                  <p className="text-sm text-slate-400">{f.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="border-t border-white/5 px-4 py-14 sm:py-20">
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-8 text-center text-2xl font-bold text-white">{content.faqTitle}</h2>
            <div className="space-y-4 text-left">
              {content.faqs.map((faq) => (
                <details
                  key={faq.question}
                  className="group rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3"
                >
                  <summary className="cursor-pointer list-none font-medium text-white marker:content-none">
                    {faq.question}
                  </summary>
                  <p className="mt-2 text-sm leading-relaxed text-slate-400">{faq.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      </main>

      <PwaInstallBanner />
      <CookieConsent />
      <SiteFooter />
    </div>
  );
}
