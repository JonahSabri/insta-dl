"use client";

import {
  createContext,
  useContext,
  useEffect,
  type ReactNode,
} from "react";
import { useRouter, usePathname } from "next/navigation";
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

interface LanguageProviderProps {
  lang: Lang;
  children: ReactNode;
}

/**
 * Must be rendered by a server component that already knows the lang
 * (i.e. [lang]/layout.tsx).  Receiving lang as a prop avoids any
 * usePathname() parsing on the client and eliminates hydration mismatches.
 */
export function LanguageProvider({ lang, children }: LanguageProviderProps) {
  const router = useRouter();
  const pathname = usePathname();

  // Keep <html lang>, dir, and the preference cookie in sync.
  useEffect(() => {
    const meta = LANGS.find((l) => l.code === lang);
    document.documentElement.lang = toHtmlLang(lang);
    document.documentElement.dir = meta?.dir ?? "ltr";
    document.cookie = `lang=${lang};path=/;max-age=31536000;SameSite=Lax`;
  }, [lang]);

  function setLang(l: Lang) {
    // Replace the lang segment in the current path and navigate.
    const segments = pathname.split("/");
    segments[1] = l;
    router.push(segments.join("/") || `/${l}`);
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
