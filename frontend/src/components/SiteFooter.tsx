"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useT } from "@/i18n/context";
import { TOOL_NAV } from "@/content/downloaders";
import { LEGAL_NAV } from "@/lib/legal-nav";

export default function SiteFooter() {
  const t = useT();
  const { lang } = useParams<{ lang: string }>();
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME ?? "JazzGhost";

  return (
    <footer className="py-8 text-center text-xs text-slate-700">
      <div
        className="mx-auto mb-4 h-px max-w-xs"
        style={{ background: "linear-gradient(90deg,transparent,rgba(131,58,180,0.3),rgba(225,48,108,0.2),transparent)" }}
      />
      <div className="mb-3 flex flex-wrap justify-center gap-x-4 gap-y-2 px-4">
        <Link href={`/${lang}`} className="text-slate-500 hover:text-slate-300 transition-colors">{t.nav.home}</Link>
        <Link href={`/${lang}/articles`} className="text-slate-500 hover:text-slate-300 transition-colors">{t.nav.blog}</Link>
        <Link href={`/${lang}/faq`} className="text-slate-500 hover:text-slate-300 transition-colors">{t.nav.faq}</Link>
        {LEGAL_NAV.map((item) => (
          <Link
            key={item.slug}
            href={`/${lang}/${item.slug}`}
            className="text-slate-500 hover:text-slate-300 transition-colors"
          >
            {item.label}
          </Link>
        ))}
      </div>
      <div className="mb-4 flex flex-wrap justify-center gap-x-3 gap-y-2 px-4">
        {TOOL_NAV.map((tool) => (
          <Link
            key={tool.slug}
            href={tool.href(lang)}
            className="text-slate-600 hover:text-slate-300 transition-colors"
          >
            {tool.shortLabel}
          </Link>
        ))}
      </div>
      <span className="text-slate-600">© {new Date().getFullYear()} {siteName}</span>
      <span className="mx-2 text-slate-800">·</span>
      <span>{t.footer.madeWith}</span>
    </footer>
  );
}
