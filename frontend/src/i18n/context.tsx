"use client";

import {
  createContext,
  useContext,
  useEffect,
  type ReactNode,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import { LANGS, translations, type Lang, type Translations } from "./translations";
import { toHtmlLang } from "@/lib/htmlLang";

interface LangCtx {
  lang: Lang;
  t: Translations;
  setLang: (l: Lang) => void;
}

const LangContext = createContext<LangCtx>({
  lang: "en",
  t: translations.en,
  setLang: () => {},
});

function getLangFromPath(pathname: string): Lang {
  const segment = pathname.split("/")[1] as Lang;
  return translations[segment] ? segment : "en";
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  // Derive lang directly from the URL — no separate state needed.
  // This guarantees the UI is always in sync with the URL without
  // any state-vs-URL race conditions.
  const lang: Lang = getLangFromPath(pathname);

  // Keep <html lang> and dir up-to-date, and save preference cookie.
  useEffect(() => {
    const meta = LANGS.find((l) => l.code === lang);
    document.documentElement.lang = toHtmlLang(lang);
    document.documentElement.dir = meta?.dir ?? "ltr";
    document.cookie = `lang=${lang};path=/;max-age=31536000;SameSite=Lax`;
  }, [lang]);

  function setLang(l: Lang) {
    // Only navigate — the language is derived from the URL on the next render.
    const segments = pathname.split("/");
    segments[1] = l;
    const newPath = segments.join("/") || `/${l}`;
    router.push(newPath);
  }

  return (
    <LangContext.Provider value={{ lang, t: translations[lang], setLang }}>
      {children}
    </LangContext.Provider>
  );
}

export function useT(): Translations {
  return useContext(LangContext).t;
}

export function useLang(): { lang: Lang; setLang: (l: Lang) => void } {
  const { lang, setLang } = useContext(LangContext);
  return { lang, setLang };
}
