import type { Metadata } from "next";
import { LANGS } from "@/i18n/translations";

interface Props {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME ?? "JazzGhost";

  const titles: Record<string, string> = {
    en: `${siteName} — Articles & Guides`,
    fa: `${siteName} — مقالات و راهنماها`,
    pt: `${siteName} — Artigos e Guias`,
    es: `${siteName} — Artículos y guías`,
    tr: `${siteName} — Makaleler ve rehberler`,
    ar: `${siteName} — مقالات وأدلة`,
    de: `${siteName} — Artikel & Guides`,
    fr: `${siteName} — Articles et guides`,
  };

  const languages: Record<string, string> = { "x-default": "/en/articles" };
  for (const l of LANGS) {
    languages[l.code === "pt" ? "pt-BR" : l.code] = `/${l.code}/articles`;
  }

  return {
    title: titles[lang] ?? titles.en,
    description: "Guides for downloading Instagram Reels, posts, stories, and carousels.",
    alternates: {
      canonical: `/${lang}/articles`,
      languages,
    },
  };
}

export default function ArticlesLayout({ children }: Props) {
  return children;
}
