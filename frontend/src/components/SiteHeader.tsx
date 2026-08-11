"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useT } from "@/i18n/context";

export default function SiteHeader({ active }: { active?: "home" | "articles" | "legal" }) {
  const t = useT();
  const { lang } = useParams<{ lang: string }>();
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME ?? "JazzGhost";

  return (
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
          <Link
            href={`/${lang}`}
            className={active === "home" ? "rounded-lg px-2.5 py-1.5 text-xs sm:text-sm text-white bg-white/5" : "rounded-lg px-2.5 py-1.5 text-xs sm:text-sm text-slate-400 hover:text-white transition-colors"}
          >
            {t.nav.home}
          </Link>
          <Link
            href={`/${lang}/articles`}
            className={active === "articles" ? "rounded-lg px-2.5 py-1.5 text-xs sm:text-sm text-white bg-white/5" : "rounded-lg px-2.5 py-1.5 text-xs sm:text-sm text-slate-400 hover:text-white transition-colors"}
          >
            {t.nav.articles}
          </Link>
          <LanguageSwitcher />
        </nav>
      </div>
    </header>
  );
}
