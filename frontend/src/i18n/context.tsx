"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { usePathname, useRouter } from "next/navigation";
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

function getLangFromPath(pathname: string): Lang {
  const segment = pathname.split("/")[1] as Lang;
  return translations[segment] ? segment : "en";
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const [lang, setLangState] = useState<Lang>(() => getLangFromPath(pathname));

  // Sync when URL changes (e.g. user navigates back/forward)
  useEffect(() => {
    const urlLang = getLangFromPath(pathname);
    if (urlLang !== lang) setLangState(urlLang);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // Update <html> lang + dir
  useEffect(() => {
    const meta = LANGS.find((l) => l.code === lang);
    document.documentElement.lang = lang === "pt" ? "pt-BR" : lang;
    document.documentElement.dir = meta?.dir ?? "ltr";
    // Save preference as cookie for middleware detection
    document.cookie = `lang=${lang};path=/;max-age=31536000;SameSite=Lax`;
  }, [lang]);

  function setLang(l: Lang) {
    // Replace the lang segment in the current path
    const segments = pathname.split("/");
    segments[1] = l;
    const newPath = segments.join("/") || `/${l}`;
    setLangState(l);
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
