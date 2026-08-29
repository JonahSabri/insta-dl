import type { Metadata } from "next";
import { LANGS, type Lang } from "@/i18n/translations";

export const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME ?? "JazzGhost";
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://jazzghost.com").replace(/\/$/, "");
export const SITE_TWITTER = process.env.NEXT_PUBLIC_TWITTER_HANDLE || "@JazzGhost";
export const DEFAULT_OG_IMAGE = `${SITE_URL}/opengraph-image`;

export const SITE_DESCRIPTION =
  "JazzGhost is a free Instagram toolkit — dedicated downloaders for Reels, posts, carousels, stories and highlights, plus bio and caption tools. No sign-up required.";

export const GLOBAL_KEYWORDS = [
  "JazzGhost",
  "Instagram downloader",
  "download Instagram Reels",
  "Instagram post downloader",
  "Instagram story saver",
  "Instagram bio copy",
  "Instagram caption extractor",
  "free Instagram tools",
];

type PageKey = "home" | "blogs";

interface LocaleCopy {
  title: string;
  description: string;
  ogLocale: string;
  keywords?: string[];
}

const HOME: Record<string, LocaleCopy> = {
  en: {
    title: `${SITE_NAME} — Instagram Tools & Downloaders`,
    description:
      "JazzGhost: focused Instagram tools for Reels, posts, stories, highlights, bios and captions. Free, private, no app install.",
    ogLocale: "en_US",
    keywords: ["JazzGhost Instagram", "Instagram tools", "Reels downloader"],
  },
  pt: {
    title: `${SITE_NAME} — Baixar Reels e Posts do Instagram Grátis`,
    description:
      "Baixe Reels, posts, carrosséis e stories do Instagram em HD gratuitamente. Sem cadastro, sem app — cole o link e salve em segundos.",
    ogLocale: "pt_BR",
  },
  de: {
    title: `${SITE_NAME} — Instagram Reels & Posts kostenlos herunterladen`,
    description:
      "Lade Instagram Reels, Posts, Karussells und Stories kostenlos in HD herunter. Keine Anmeldung, keine App — Link einfügen und speichern.",
    ogLocale: "de_DE",
  },
  fr: {
    title: `${SITE_NAME} — Télécharger Reels & Posts Instagram gratuitement`,
    description:
      "Téléchargez gratuitement les Reels, posts, carrousels et stories Instagram en HD. Sans inscription, sans application — collez le lien et enregistrez.",
    ogLocale: "fr_FR",
  },
  es: {
    title: `${SITE_NAME} — Descargar Reels y Posts de Instagram gratis`,
    description:
      "Descarga Reels, posts, carruseles e historias de Instagram en HD gratis. Sin registro, sin app — pega el enlace y guarda en segundos.",
    ogLocale: "es_ES",
  },
  tr: {
    title: `${SITE_NAME} — Ücretsiz Instagram Reels & Gönderi İndirici`,
    description:
      "Instagram Reels, gönderi, kaydırma ve hikayeleri ücretsiz HD indirin. Kayıt yok, uygulama yok — bağlantıyı yapıştırın ve saniyeler içinde kaydedin.",
    ogLocale: "tr_TR",
  },
  ar: {
    title: `${SITE_NAME} — تحميل ريلز ومنشورات إنستغرام مجانًا`,
    description:
      "حمّل ريلز ومنشورات وكاروسيل وقصص إنستغرام بجودة HD مجانًا. بدون تسجيل وبدون تطبيق — الصق الرابط واحفظ خلال ثوانٍ.",
    ogLocale: "ar_AR",
  },
  ja: {
    title: `${SITE_NAME} — Instagramリール・投稿を無料ダウンロード`,
    description:
      "Instagramのリール、投稿、カルーセル、ストーリーをHDで無料ダウンロード。登録不要・アプリ不要。リンクを貼って数秒で保存。",
    ogLocale: "ja_JP",
  },
  nl: {
    title: `${SITE_NAME} — Gratis Instagram Reels & Posts downloaden`,
    description:
      "Download Instagram Reels, posts, carrousels en stories gratis in HD. Geen account, geen app — plak de link en sla binnen seconden op.",
    ogLocale: "nl_NL",
  },
  it: {
    title: `${SITE_NAME} — Scarica Reels e Post di Instagram gratis`,
    description:
      "Scarica Reels, post, caroselli e storie di Instagram in HD gratis. Nessuna registrazione, nessuna app — incolla il link e salva in pochi secondi.",
    ogLocale: "it_IT",
  },
  sv: {
    title: `${SITE_NAME} — Ladda ner Instagram Reels & inlägg gratis`,
    description:
      "Ladda ner Instagram Reels, inlägg, karuseller och stories gratis i HD. Ingen registrering, ingen app — klistra in länken och spara på sekunder.",
    ogLocale: "sv_SE",
  },
  no: {
    title: `${SITE_NAME} — Last ned Instagram Reels & innlegg gratis`,
    description:
      "Last ned Instagram Reels, innlegg, karuseller og stories gratis i HD. Ingen registrering, ingen app — lim inn lenken og lagre på sekunder.",
    ogLocale: "nb_NO",
  },
  da: {
    title: `${SITE_NAME} — Download Instagram Reels & opslag gratis`,
    description:
      "Download Instagram Reels, opslag, karruseller og stories gratis i HD. Ingen tilmelding, ingen app — indsæt linket og gem på få sekunder.",
    ogLocale: "da_DK",
  },
};

const ARTICLES: Record<string, LocaleCopy> = {
  en: {
    title: `${SITE_NAME} — Blog & Guides`,
    description:
      "Guides and tips for downloading Instagram Reels, posts, stories and carousels with JazzGhost — free, fast, and private.",
    ogLocale: "en_US",
  },
  pt: {
    title: `${SITE_NAME} — Artigos e Guias`,
    description:
      "Guias e dicas para baixar Reels, posts, stories e carrosséis do Instagram com o JazzGhost — grátis, rápido e privado.",
    ogLocale: "pt_BR",
  },
  de: {
    title: `${SITE_NAME} — Artikel & Guides`,
    description:
      "Anleitungen und Tipps zum Herunterladen von Instagram Reels, Posts, Stories und Karussells mit JazzGhost.",
    ogLocale: "de_DE",
  },
  fr: {
    title: `${SITE_NAME} — Blog et guides`,
    description:
      "Guides et conseils pour télécharger des Reels, posts, stories et carrousels Instagram avec JazzGhost.",
    ogLocale: "fr_FR",
  },
  es: {
    title: `${SITE_NAME} — Artículos y guías`,
    description:
      "Guías y consejos para descargar Reels, posts, stories y carruseles de Instagram con JazzGhost.",
    ogLocale: "es_ES",
  },
  tr: {
    title: `${SITE_NAME} — Makaleler ve rehberler`,
    description:
      "JazzGhost ile Instagram Reels, gönderi, hikâye ve kaydırma indirme ipuçları ve rehberleri.",
    ogLocale: "tr_TR",
  },
  ar: {
    title: `${SITE_NAME} — مقالات وأدلة`,
    description:
      "أدلة ونصائح لتنزيل ريلز ومنشورات وقصص وكاروسيل إنستغرام باستخدام JazzGhost.",
    ogLocale: "ar_AR",
  },
  ja: {
    title: `${SITE_NAME} — 記事とガイド`,
    description:
      "JazzGhostでInstagramのリール・投稿・ストーリー・カルーセルをダウンロードするヒントとガイド。",
    ogLocale: "ja_JP",
  },
  nl: {
    title: `${SITE_NAME} — Artikelen & gidsen`,
    description:
      "Gidsen en tips om Instagram Reels, posts, stories en carrousels te downloaden met JazzGhost.",
    ogLocale: "nl_NL",
  },
  it: {
    title: `${SITE_NAME} — Articoli e guide`,
    description:
      "Guide e consigli per scaricare Reels, post, storie e caroselli Instagram con JazzGhost.",
    ogLocale: "it_IT",
  },
  sv: {
    title: `${SITE_NAME} — Artiklar och guider`,
    description:
      "Guider och tips för att ladda ner Instagram Reels, inlägg, stories och karuseller med JazzGhost.",
    ogLocale: "sv_SE",
  },
  no: {
    title: `${SITE_NAME} — Artikler og guider`,
    description:
      "Guider og tips for å laste ned Instagram Reels, innlegg, stories og karuseller med JazzGhost.",
    ogLocale: "nb_NO",
  },
  da: {
    title: `${SITE_NAME} — Artikler og guides`,
    description:
      "Guides og tips til at downloade Instagram Reels, opslag, stories og karruseller med JazzGhost.",
    ogLocale: "da_DK",
  },
};

function copyFor(page: PageKey, lang: string): LocaleCopy {
  const table = page === "home" ? HOME : ARTICLES;
  return table[lang] ?? table.en;
}

export function hreflangLanguages(pathSuffix = ""): Record<string, string> {
  const map: Record<string, string> = {
    "x-default": `${SITE_URL}/en${pathSuffix}`,
  };
  for (const l of LANGS) {
    const key = l.code === "pt" ? "pt-BR" : l.code;
    map[key] = `${SITE_URL}/${l.code}${pathSuffix}`;
  }
  return map;
}

export function absoluteUrl(path: string): string {
  if (path.startsWith("http")) return path;
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

export function buildPageMetadata(lang: string, page: PageKey = "home"): Metadata {
  const copy = copyFor(page, lang);
  const path = page === "home" ? `/${lang}` : `/${lang}/blogs`;
  const url = absoluteUrl(path);
  const keywords = [...GLOBAL_KEYWORDS, ...(copy.keywords ?? [])];

  const languages = hreflangLanguages(page === "home" ? "" : "/blogs");

  return {
    title: copy.title,
    description: copy.description,
    keywords,
    authors: [{ name: SITE_NAME, url: SITE_URL }],
    creator: SITE_NAME,
    publisher: SITE_NAME,
    category: "technology",
    applicationName: SITE_NAME,
    alternates: {
      canonical: url,
      languages,
    },
    openGraph: {
      type: "website",
      url,
      siteName: SITE_NAME,
      title: copy.title,
      description: copy.description,
      locale: copy.ogLocale,
      alternateLocale: LANGS
        .filter((l) => l.code !== lang)
        .map((l) => copyFor(page, l.code).ogLocale),
      images: [
        {
          url: DEFAULT_OG_IMAGE,
          width: 1200,
          height: 630,
          alt: `${SITE_NAME} — Instagram Downloader`,
          type: "image/png",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      site: SITE_TWITTER,
      creator: SITE_TWITTER,
      title: copy.title,
      description: copy.description,
      images: [DEFAULT_OG_IMAGE],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
  };
}

export function buildArticleMetadata(opts: {
  lang: string;
  slug: string;
  title: string;
  description: string;
  image?: string | null;
  imageAlt?: string | null;
  publishedAt?: string | null;
  updatedAt?: string | null;
  keywords?: string;
}): Metadata {
  const path = `/${opts.lang}/blogs/${opts.slug}`;
  const url = absoluteUrl(path);
  const image = opts.image
    ? absoluteUrl(opts.image)
    : DEFAULT_OG_IMAGE;
  const desc =
    opts.description?.trim() ||
    `Read “${opts.title}” on ${SITE_NAME} — Instagram downloader guides and tips.`;
  const imageAlt = opts.imageAlt?.trim() || opts.title;

  return {
    title: opts.title,
    description: desc.slice(0, 160),
    keywords: opts.keywords
      ? opts.keywords.split(",").map((k) => k.trim()).filter(Boolean)
      : GLOBAL_KEYWORDS,
    alternates: {
      canonical: url,
      languages: hreflangLanguages(`/blogs/${opts.slug}`),
    },
    openGraph: {
      type: "article",
      url,
      siteName: SITE_NAME,
      title: opts.title,
      description: desc.slice(0, 200),
      publishedTime: opts.publishedAt ?? undefined,
      modifiedTime: opts.updatedAt ?? undefined,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: imageAlt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      site: SITE_TWITTER,
      title: opts.title,
      description: desc.slice(0, 200),
      images: [image],
    },
    robots: { index: true, follow: true },
  };
}

export function websiteJsonLd() {
  const faqEntities = [
    {
      "@type": "Question",
      name: "What is JazzGhost?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "JazzGhost is a free browser-based toolkit for saving public Instagram media and reading public bio/caption text.",
      },
    },
    {
      "@type": "Question",
      name: "Which Instagram formats are supported?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Dedicated tools cover Reels, posts, carousels, stories, highlights, profile bios, and captions.",
      },
    },
    {
      "@type": "Question",
      name: "Is JazzGhost free?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Core downloaders are free to use, with fair-use rate limits.",
      },
    },
    {
      "@type": "Question",
      name: "Do you need my Instagram password?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Never. Paste public links or usernames only.",
      },
    },
  ];

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: SITE_NAME,
        alternateName: ["Jazz Ghost", "JazzGhost Instagram Tools"],
        description: SITE_DESCRIPTION,
        inLanguage: LANGS.map((l) => (l.code === "pt" ? "pt-BR" : l.code)),
        publisher: { "@id": `${SITE_URL}/#organization` },
      },
      {
        "@type": "Organization",
        "@id": `${SITE_URL}/#organization`,
        name: SITE_NAME,
        url: SITE_URL,
        description: SITE_DESCRIPTION,
        logo: {
          "@type": "ImageObject",
          url: `${SITE_URL}/icon`,
          width: 32,
          height: 32,
        },
        image: DEFAULT_OG_IMAGE,
        contactPoint: {
          "@type": "ContactPoint",
          contactType: "customer support",
          url: `${SITE_URL}/en/contact`,
          availableLanguage: LANGS.map((l) => (l.code === "pt" ? "pt-BR" : l.code)),
        },
      },
      {
        "@type": ["SoftwareApplication", "WebApplication"],
        "@id": `${SITE_URL}/#app`,
        name: SITE_NAME,
        applicationCategory: "MultimediaApplication",
        applicationSubCategory: "Instagram Tools",
        operatingSystem: "Any",
        browserRequirements: "Requires JavaScript. Works in modern web browsers.",
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
          availability: "https://schema.org/InStock",
        },
        description: SITE_DESCRIPTION,
        url: SITE_URL,
        image: DEFAULT_OG_IMAGE,
        featureList: [
          "Instagram Reels Downloader",
          "Instagram Post Downloader",
          "Instagram Carousel Downloader",
          "Instagram Story Downloader",
          "Instagram Highlight Downloader",
          "Instagram Bio information",
          "Instagram Caption extractor",
        ],
        publisher: { "@id": `${SITE_URL}/#organization` },
      },
      {
        "@type": "WebPage",
        "@id": `${SITE_URL}/#webpage`,
        url: SITE_URL,
        name: `${SITE_NAME} — Instagram Tools & Downloaders`,
        description: SITE_DESCRIPTION,
        isPartOf: { "@id": `${SITE_URL}/#website` },
        about: { "@id": `${SITE_URL}/#organization` },
        primaryImageOfPage: {
          "@type": "ImageObject",
          url: DEFAULT_OG_IMAGE,
        },
        breadcrumb: { "@id": `${SITE_URL}/#breadcrumb` },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${SITE_URL}/#breadcrumb`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: SITE_URL,
          },
        ],
      },
      {
        "@type": "FAQPage",
        "@id": `${SITE_URL}/#faq`,
        mainEntity: faqEntities,
      },
      {
        "@type": "ItemList",
        "@id": `${SITE_URL}/#tools`,
        name: "JazzGhost Instagram tools",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Instagram Reels Downloader", url: `${SITE_URL}/en/instagram-reels-downloader` },
          { "@type": "ListItem", position: 2, name: "Instagram Post Downloader", url: `${SITE_URL}/en/instagram-post-downloader` },
          { "@type": "ListItem", position: 3, name: "Instagram Story Downloader", url: `${SITE_URL}/en/instagram-story-downloader` },
          { "@type": "ListItem", position: 4, name: "Instagram Carousel Downloader", url: `${SITE_URL}/en/instagram-carousel-downloader` },
          { "@type": "ListItem", position: 5, name: "Instagram Highlight Downloader", url: `${SITE_URL}/en/instagram-highlight-downloader` },
          { "@type": "ListItem", position: 6, name: "Instagram Bio Downloader", url: `${SITE_URL}/en/instagram-bio-downloader` },
          { "@type": "ListItem", position: 7, name: "Instagram Caption Downloader", url: `${SITE_URL}/en/instagram-caption-downloader` },
        ],
      },
    ],
  };
}

export function faqPageJsonLd(items: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a.replace(/\n/g, " "),
      },
    })),
  };
}

export function breadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function articleJsonLd(opts: {
  title: string;
  description: string;
  url: string;
  image?: string | null;
  publishedAt?: string | null;
  updatedAt?: string | null;
  lang: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: opts.title,
    description: opts.description,
    url: opts.url,
    mainEntityOfPage: opts.url,
    image: opts.image ? [absoluteUrl(opts.image)] : [DEFAULT_OG_IMAGE],
    datePublished: opts.publishedAt ?? undefined,
    dateModified: opts.updatedAt || opts.publishedAt || undefined,
    inLanguage: opts.lang === "pt" ? "pt-BR" : opts.lang,
    author: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/icon`,
      },
    },
  };
}

export function isSupportedLang(lang: string): lang is Lang {
  return LANGS.some((l) => l.code === lang);
}

export function buildDownloaderMetadata(
  lang: string,
  content: {
    slug: string;
    metaTitle: string;
    metaDescription: string;
    keywords: string[];
    h1: string;
  }
): Metadata {
  const path = `/${lang}/${content.slug}`;
  const url = absoluteUrl(path);
  const ogLocale = HOME[lang]?.ogLocale ?? HOME.en.ogLocale;

  return {
    title: content.metaTitle,
    description: content.metaDescription,
    keywords: content.keywords,
    alternates: {
      canonical: url,
      languages: hreflangLanguages(`/${content.slug}`),
    },
    openGraph: {
      type: "website",
      url,
      siteName: SITE_NAME,
      title: content.metaTitle,
      description: content.metaDescription,
      locale: ogLocale,
      images: [
        {
          url: DEFAULT_OG_IMAGE,
          width: 1200,
          height: 630,
          alt: content.h1,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      site: SITE_TWITTER,
      title: content.metaTitle,
      description: content.metaDescription,
      images: [DEFAULT_OG_IMAGE],
    },
    robots: { index: true, follow: true },
  };
}

export function downloaderToolJsonLd(
  lang: string,
  content: {
    slug: string;
    h1: string;
    metaDescription: string;
    subtitle: string;
    howToTitle: string;
    steps: { order: number; title: string; description: string; image?: string; imageAlt?: string }[];
    faqs: { question: string; answer: string }[];
  }
) {
  const url = absoluteUrl(`/${lang}/${content.slug}`);
  const sortedSteps = [...content.steps].sort((a, b) => a.order - b.order);

  const howTo = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: content.howToTitle,
    description: content.metaDescription,
    totalTime: "PT1M",
    estimatedCost: { "@type": "MonetaryAmount", currency: "USD", value: "0" },
    tool: { "@type": "HowToTool", name: SITE_NAME },
    step: sortedSteps.map((s) => ({
      "@type": "HowToStep",
      position: s.order,
      name: s.title,
      text: s.description,
      url: `${url}#tool`,
      ...(s.image
        ? {
            image: absoluteUrl(s.image),
          }
        : {}),
    })),
  };

  const faq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: content.faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };

  const webApp = {
    "@context": "https://schema.org",
    "@type": ["WebApplication", "SoftwareApplication"],
    name: content.h1,
    applicationCategory: "MultimediaApplication",
    operatingSystem: "Any",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    description: content.metaDescription,
    url,
    publisher: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
  };

  const webPage = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: content.h1,
    description: content.subtitle,
    url,
    isPartOf: { "@type": "WebSite", name: SITE_NAME, url: SITE_URL },
  };

  return [webPage, webApp, howTo, faq];
}
