import type { Metadata } from "next";
import { translations, LANGS, type Lang } from "@/i18n/translations";
import { notFound } from "next/navigation";
import { toHtmlLang } from "@/lib/htmlLang";

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
      title: "Instagram Reels, Posts & Stories Downloader — Free, No Login",
      description: "Download Instagram Reels, posts, stories, highlights, bios and captions in HD. No watermark, no login, no app. Free and instant.",
    },
    pt: {
      title: `${siteName} — Baixar Reels, Posts e Stories do Instagram`,
      description: "Baixe Reels, Posts, Stories e Destaques do Instagram em HD. Sem marca d'água, sem login. Grátis e instantâneo.",
    },
    fa: {
      title: `${siteName} — دانلود ریلز، پست و استوری اینستاگرام`,
      description: "دانلود رایگان ریلز، پست، استوری و هایلایت اینستاگرام با کیفیت بالا. بدون واترمارک، بدون ورود.",
    },
    de: {
      title: `${siteName} — Instagram Reels, Posts & Stories herunterladen`,
      description: "Lade Instagram Reels, Posts, Stories und Highlights in HD herunter. Kein Wasserzeichen, kein Login, kostenlos.",
    },
    fr: {
      title: `${siteName} — Télécharger Reels, Posts et Stories Instagram`,
      description: "Téléchargez des Reels, Posts, Stories et Highlights Instagram en HD. Sans filigrane, sans connexion. Gratuit et instantané.",
    },
    ja: {
      title: `${siteName} — Instagram リール・投稿・ストーリー ダウンロード`,
      description: "InstagramのリールP、投稿、ストーリー、ハイライトをHDでダウンロード。透かしなし、ログイン不要、無料。",
    },
    nl: {
      title: `${siteName} — Instagram Reels, Posts en Stories downloaden`,
      description: "Download Instagram Reels, Posts, Stories en Highlights in HD. Geen watermerk, geen login, gratis.",
    },
    sv: {
      title: `${siteName} — Ladda ner Instagram Reels, Inlägg och Stories`,
      description: "Ladda ner Instagram Reels, inlägg, stories och höjdpunkter i HD. Inget vattenstämpel, ingen inloggning, gratis.",
    },
    no: {
      title: `${siteName} — Last ned Instagram Reels, Innlegg og Stories`,
      description: "Last ned Instagram Reels, innlegg, stories og høydepunkter i HD. Inget vannmerke, ingen innlogging, gratis.",
    },
    da: {
      title: `${siteName} — Download Instagram Reels, Opslag og Stories`,
      description: "Download Instagram Reels, opslag, stories og højdepunkter i HD. Intet vandmærke, intet login, gratis.",
    },
    it: {
      title: `${siteName} — Scarica Reels, Post e Storie di Instagram`,
      description: "Scarica Reels, post, storie ed evidenziazioni di Instagram in HD. Senza filigrana, senza login, gratis.",
    },
    es: {
      title: `${siteName} — Descargar Reels, Publicaciones e Historias de Instagram`,
      description: "Descarga Reels, publicaciones, historias y destacados de Instagram en HD. Sin marca de agua, sin inicio de sesión. Gratis.",
    },
    tr: {
      title: `${siteName} — Instagram Reels, Gönderi ve Hikayeler İndir`,
      description: "Instagram Reels, gönderiler, hikayeler ve öne çıkanları HD kalitede indirin. Filigran yok, giriş yok, ücretsiz.",
    },
    ar: {
      title: `${siteName} — تحميل ريلز ومنشورات وقصص إنستاغرام`,
      description: "حمّل ريلز ومنشورات وقصصًا وأبرزات إنستاغرام بجودة HD. بدون علامة مائية، بدون تسجيل دخول، مجاناً.",
    },
  };

  // Build hreflang alternates for all supported languages
  const hreflangAlternates = Object.fromEntries(
    LANGS.map((l) => [toHtmlLang(l.code), `/${l.code}`])
  );

  const m = meta[lang] ?? meta.en;
  return {
    title: { absolute: m.title },
    description: m.description,
    alternates: {
      languages: hreflangAlternates,
    },
  };
}

export default async function LangLayout({ children, params }: Props) {
  const { lang } = await params;

  // Validate lang
  if (!LANGS.some((l) => l.code === lang)) notFound();

  const langMeta = LANGS.find((l) => l.code === lang)!;

  return (
    <div lang={toHtmlLang(lang)} dir={langMeta.dir}>
      {children}
    </div>
  );
}
