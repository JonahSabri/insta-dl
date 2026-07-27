import type { Metadata } from "next";
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

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!isSupportedLang(lang)) return {};
  return buildPageMetadata(lang, "articles");
}

export default async function ArticlesLayout({ children, params }: Props) {
  const { lang } = await params;
  const crumbs = breadcrumbJsonLd([
    { name: SITE_NAME, url: absoluteUrl(`/${lang}`) },
    { name: "Articles", url: absoluteUrl(`/${lang}/articles`) },
  ]);

  return (
    <>
      <JsonLd data={crumbs} />
      {children}
    </>
  );
}
