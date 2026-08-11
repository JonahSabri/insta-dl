import type { Metadata } from "next";
import { LANGS, type Lang } from "@/i18n/translations";
import { flattenFaqItems } from "@/content/faq";

export const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME ?? "JazzGhost";
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://jazzghost.com").replace(/\/$/, "");
export const SITE_TWITTER = process.env.NEXT_PUBLIC_TWITTER_HANDLE || "@JazzGhost";
export const DEFAULT_OG_IMAGE = `${SITE_URL}/opengraph-image`;

export const SITE_DESCRIPTION =
  "Free online Instagram Reels, posts, carousels and stories downloader. No sign-up, no app — paste a link and save in HD with JazzGhost.";

export const GLOBAL_KEYWORDS = [
  "Instagram downloader",
  "download Instagram Reels",
  "download Instagram video",
  "Instagram post downloader",
  "Instagram carousel download",
  "Instagram story saver",
  "save Instagram Reels",
  "free Instagram downloader",
  "online Instagram saver",
  "JazzGhost",
  "baixar Instagram",
  "descargar Instagram",
  "Instagram Video herunterladen",
  "télécharger Instagram",
];

type PageKey = "home" | "articles";

interface LocaleCopy {
  title: string;
  description: string;
  ogLocale: string;
  keywords?: string[];
}

const HOME: Record<string, LocaleCopy> = {
  en: {
    title: `${SITE_NAME} — Free Instagram Reels & Posts Downloader`,
    description:
      "Download Instagram Reels, posts, carousels and stories in HD for free. No sign-up, no app — paste a link and save in seconds with JazzGhost.",
    ogLocale: "en_US",
    keywords: ["download Instagram Reels HD", "save Instagram video online", "free IG downloader"],
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
  const path = page === "home" ? `/${lang}` : `/${lang}/articles`;
  const url = absoluteUrl(path);
  const keywords = [...GLOBAL_KEYWORDS, ...(copy.keywords ?? [])];

  const languages = hreflangLanguages(page === "home" ? "" : "/articles");

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
  const path = `/${opts.lang}/articles/${opts.slug}`;
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
      languages: hreflangLanguages(`/articles/${opts.slug}`),
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
  const faqEntities = flattenFaqItems().slice(0, 12).map((item) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.a.replace(/\n/g, " "),
    },
  }));

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: SITE_NAME,
        alternateName: ["Jazz Ghost", "JazzGhost Instagram Downloader"],
        description: SITE_DESCRIPTION,
        inLanguage: LANGS.map((l) => (l.code === "pt" ? "pt-BR" : l.code)),
        publisher: { "@id": `${SITE_URL}/#organization` },
        potentialAction: {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate: `${SITE_URL}/en/articles?q={search_term_string}`,
          },
          "query-input": "required name=search_term_string",
        },
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
        sameAs: [
          // add real social profile URLs when available
        ].filter(Boolean),
      },
      {
        "@type": ["SoftwareApplication", "WebApplication"],
        "@id": `${SITE_URL}/#app`,
        name: SITE_NAME,
        applicationCategory: "MultimediaApplication",
        applicationSubCategory: "Instagram Downloader",
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
        screenshot: DEFAULT_OG_IMAGE,
        featureList: [
          "Download Instagram Reels",
          "Download Instagram posts",
          "Download Instagram carousels",
          "Download Instagram Stories",
          "HD quality",
          "No sign-up required",
          "Works in browser",
          "Free forever",
        ],
        publisher: { "@id": `${SITE_URL}/#organization` },
      },
      {
        "@type": "WebPage",
        "@id": `${SITE_URL}/#webpage`,
        url: SITE_URL,
        name: `${SITE_NAME} — Free Instagram Reels & Posts Downloader`,
        description: SITE_DESCRIPTION,
        isPartOf: { "@id": `${SITE_URL}/#website` },
        about: { "@id": `${SITE_URL}/#app` },
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
        "@type": "HowTo",
        "@id": `${SITE_URL}/#howto`,
        name: "How to download Instagram Reels and posts with JazzGhost",
        description:
          "Download Instagram Reels, posts, carousels and Stories in 3 simple steps — free, no app needed.",
        totalTime: "PT1M",
        estimatedCost: {
          "@type": "MonetaryAmount",
          currency: "USD",
          value: "0",
        },
        tool: {
          "@type": "HowToTool",
          name: "JazzGhost web app",
        },
        step: [
          {
            "@type": "HowToStep",
            position: 1,
            name: "Copy the Instagram link",
            text: "Open Instagram and copy the link to the Reel, post, carousel, or Story you want to save.",
            url: `${SITE_URL}/en#download`,
          },
          {
            "@type": "HowToStep",
            position: 2,
            name: "Paste the link on JazzGhost",
            text: "Paste the Instagram URL into the JazzGhost download box on the homepage.",
            url: `${SITE_URL}/en#download`,
          },
          {
            "@type": "HowToStep",
            position: 3,
            name: "Download in HD",
            text: "Click download and save the file to your device in the highest available quality.",
            url: `${SITE_URL}/en#download`,
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
        "@id": `${SITE_URL}/#features`,
        name: "Supported Instagram content types",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Instagram Reels" },
          { "@type": "ListItem", position: 2, name: "Instagram Posts" },
          { "@type": "ListItem", position: 3, name: "Instagram Carousels" },
          { "@type": "ListItem", position: 4, name: "Instagram Stories" },
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
