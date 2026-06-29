"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { LANGS, translations, type Lang, type Translations } from "./translations";

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

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  // Load saved preference on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("lang") as Lang | null;
      if (saved && translations[saved]) setLangState(saved);
    } catch {}
  }, []);

  // Update <html> lang + dir whenever language changes
  useEffect(() => {
    const meta = LANGS.find((l) => l.code === lang);
    document.documentElement.lang = lang === "pt" ? "pt-BR" : lang;
    document.documentElement.dir = meta?.dir ?? "ltr";
  }, [lang]);

  function setLang(l: Lang) {
    setLangState(l);
    try { localStorage.setItem("lang", l); } catch {}
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
