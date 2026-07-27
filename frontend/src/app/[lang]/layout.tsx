import type { Metadata } from "next";
import { LANGS } from "@/i18n/translations";
import { notFound } from "next/navigation";
import JsonLd from "@/components/JsonLd";
import {
  absoluteUrl,
  breadcrumbJsonLd,
  buildPageMetadata,
  isSupportedLang,
  SITE_NAME,
} from "@/lib/seo";

interface Props {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}

export async function generateStaticParams() {
  return LANGS.map((l) => ({ lang: l.code }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!isSupportedLang(lang)) return {};
  return buildPageMetadata(lang, "home");
}

export default async function LangLayout({ children, params }: Props) {
  const { lang } = await params;

  if (!LANGS.some((l) => l.code === lang)) notFound();

  const langMeta = LANGS.find((l) => l.code === lang)!;
  const htmlLang = lang === "pt" ? "pt-BR" : lang;

  const crumbs = breadcrumbJsonLd([
    { name: SITE_NAME, url: absoluteUrl(`/${lang}`) },
  ]);

  return (
    <div lang={htmlLang} dir={langMeta.dir}>
      <JsonLd data={crumbs} />
      {children}
    </div>
  );
}
