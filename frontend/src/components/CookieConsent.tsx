"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

const KEY = "jg_cookie_consent";

type Consent = "accepted" | "necessary" | null;

export default function CookieConsent() {
  const { lang } = useParams<{ lang: string }>();
  const [choice, setChoice] = useState<Consent>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const v = localStorage.getItem(KEY) as Consent;
      setChoice(v === "accepted" || v === "necessary" ? v : null);
    } catch {
      setChoice(null);
    }
    setReady(true);
  }, []);

  function save(v: "accepted" | "necessary") {
    try {
      localStorage.setItem(KEY, v);
      document.cookie = `jg_cookie_consent=${v};path=/;max-age=31536000;SameSite=Lax`;
    } catch { /* ignore */ }
    setChoice(v);
  }

  if (!ready || choice) return null;

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-[80] p-4 sm:p-6"
      role="dialog"
      aria-label="Cookie consent"
    >
      <div
        className="mx-auto flex max-w-3xl flex-col gap-3 rounded-2xl border border-white/10 p-4 sm:flex-row sm:items-center sm:gap-5 sm:p-5"
        style={{
          background: "rgba(6,6,16,0.95)",
          backdropFilter: "blur(20px)",
          boxShadow: "0 20px 50px rgba(0,0,0,0.45)",
        }}
      >
        <div className="flex-1 text-start text-sm text-slate-300 leading-relaxed">
          We use necessary cookies to run JazzGhost, and optional cookies for analytics and ads.
          See our{" "}
          <Link href={`/${lang || "en"}/cookie-policy`} className="text-purple-300 underline hover:text-pink-300">
            Cookie Policy
          </Link>{" "}
          and{" "}
          <Link href={`/${lang || "en"}/privacy-policy`} className="text-purple-300 underline hover:text-pink-300">
            Privacy Policy
          </Link>.
        </div>
        <div className="flex shrink-0 flex-wrap gap-2">
          <button
            type="button"
            onClick={() => save("necessary")}
            className="rounded-xl border border-white/15 px-3 py-2 text-xs font-medium text-slate-300 hover:bg-white/5"
          >
            Necessary only
          </button>
          <button
            type="button"
            onClick={() => save("accepted")}
            className="btn-primary text-xs py-2 px-4"
          >
            Accept all
          </button>
        </div>
      </div>
    </div>
  );
}
