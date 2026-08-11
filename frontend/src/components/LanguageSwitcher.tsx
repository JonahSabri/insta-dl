"use client";

import { useState, useRef, useEffect } from "react";
import { LANGS } from "@/i18n/translations";
import { useLang } from "@/i18n/context";
import FlagIcon from "@/components/FlagIcon";
import { cn } from "@/lib/cn";

export default function LanguageSwitcher() {
  const { lang, setLang } = useLang();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const current = LANGS.find((l) => l.code === lang) ?? LANGS[0];

  useEffect(() => {
    function handle(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-slate-400 backdrop-blur-sm transition-all hover:border-white/20 hover:text-white"
        aria-label="Change language"
        aria-expanded={open}
      >
        <FlagIcon lang={current.code} size={16} />
        <span className="text-xs font-semibold uppercase tracking-wide">{current.code}</span>
        <svg
          className={cn("h-3 w-3 transition-transform", open && "rotate-180")}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2.5}
          aria-hidden
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open ? (
        <div
          className="absolute end-0 top-full mt-1.5 w-48 overflow-hidden rounded-xl border border-white/10 bg-slate-900/95 shadow-2xl backdrop-blur-xl"
          style={{ zIndex: 100, maxHeight: "320px", overflowY: "auto" }}
        >
          {LANGS.map((l) => (
            <button
              key={l.code}
              type="button"
              onClick={() => {
                document.cookie = `lang=${l.code};path=/;max-age=31536000;SameSite=Lax`;
                document.cookie = `lang_manual=1;path=/;max-age=31536000;SameSite=Lax`;
                setLang(l.code);
                setOpen(false);
              }}
              className={cn(
                "flex w-full items-center gap-2.5 px-3 py-2 text-sm transition-colors hover:bg-white/5",
                lang === l.code ? "text-brand-300 bg-white/[0.03]" : "text-slate-400 hover:text-white"
              )}
            >
              <FlagIcon lang={l.code} size={16} />
              <span className="flex-1 text-left text-xs" dir={l.dir}>{l.label}</span>
              {lang === l.code ? (
                <svg className="ms-auto h-3.5 w-3.5 text-brand-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              ) : null}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
