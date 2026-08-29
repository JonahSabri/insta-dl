import type { Metadata } from "next";
import { notFound } from "next/navigation";
import DownloaderToolPage from "@/components/DownloaderToolPage";
import JsonLd from "@/components/JsonLd";
import { getDownloaderContent, isDownloaderSlug } from "@/content/downloaders";
import {
  absoluteUrl,
  breadcrumbJsonLd,
  buildDownloaderMetadata,
  downloaderToolJsonLd,
  isSupportedLang,
} from "@/lib/seo";

interface PageProps {
  params: Promise<{ lang: string }>;
  slug: string;
}

export async function generateDownloaderMetadata(
  lang: string,
  slug: string
): Promise<Metadata> {
  if (!isSupportedLang(lang) || !isDownloaderSlug(slug)) {
    return {};
  }
  const content = getDownloaderContent(slug, lang);
  if (!content) return {};
  return buildDownloaderMetadata(lang, content);
}

export default async function DownloaderSlugPage({ params, slug }: PageProps) {
  const { lang } = await params;
  if (!isSupportedLang(lang) || !isDownloaderSlug(slug)) notFound();
  const content = getDownloaderContent(slug, lang);
  if (!content) notFound();

  const url = absoluteUrl(`/${lang}/${slug}`);
  const schemas = [
    breadcrumbJsonLd([
      { name: "Home", url: absoluteUrl(`/${lang}`) },
      { name: content.h1, url },
    ]),
    ...downloaderToolJsonLd(lang, content),
  ];

  return (
    <>
      {schemas.map((schema, i) => (
        <JsonLd key={i} data={schema} />
      ))}
      <DownloaderToolPage content={content} />
    </>
  );
}
