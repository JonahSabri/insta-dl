import type { Metadata } from "next";
import { translations, LANGS, type Lang } from "@/i18n/translations";
import { notFound } from "next/navigation";

interface Props {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}

export async function generateStaticParams() {
  return LANGS.map((l) => ({ lang: l.code }));
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME ?? "JazzGhost";

  const meta: Record<string, { title: string; description: string }> = {
    en: {
      title: `${siteName} — Instagram Downloader`,
      description: "Free Instagram Reels, Posts, Images and Carousel downloader. Fast, no app needed.",
    },
    pt: {
      title: `${siteName} — Baixar do Instagram`,
      description: "Baixe Reels, Posts, Imagens e Carrosséis do Instagram gratuitamente. Rápido, sem instalação.",
    },
    fa: {
      title: `${siteName} — دانلود ریلز و پست اینستاگرام`,
      description: "دانلود رایگان ریلز، پست، تصویر و کاروسل اینستاگرام. سریع، بدون نیاز به نصب برنامه.",
    },
  };

  const m = meta[lang] ?? meta.en;
  const languages: Record<string, string> = { "x-default": "/en" };
  for (const l of LANGS) {
    languages[l.code === "pt" ? "pt-BR" : l.code] = `/${l.code}`;
  }
  return {
    title: m.title,
    description: m.description,
    alternates: {
      canonical: `/${lang}`,
      languages,
    },
  };
}

export default async function LangLayout({ children, params }: Props) {
  const { lang } = await params;

  // Validate lang
  if (!LANGS.some((l) => l.code === lang)) notFound();

  const langMeta = LANGS.find((l) => l.code === lang)!;
  const htmlLang = lang === "pt" ? "pt-BR" : lang;

  return (
    <div lang={htmlLang} dir={langMeta.dir}>
      {children}
    </div>
  );
}
