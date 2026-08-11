import type { Metadata } from "next";
import FaqPageClient from "@/components/FaqPageClient";
import JsonLd from "@/components/JsonLd";
import { FAQ_TOTAL, flattenFaqItems } from "@/content/faq";
import { absoluteUrl, breadcrumbJsonLd, faqPageJsonLd, SITE_NAME } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const title = `FAQ — Free Instagram Downloader Help | ${SITE_NAME}`;
  const description = `Answers to ${FAQ_TOTAL} common questions about JazzGhost: free Instagram Reels, posts, carousels & Stories downloader — privacy, quality, and how-to.`;
  const url = absoluteUrl(`/${lang}/faq`);
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, type: "website" },
    robots: { index: true, follow: true },
  };
}

export default async function FaqPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const url = absoluteUrl(`/${lang}/faq`);
  const items = flattenFaqItems();

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: SITE_NAME, url: absoluteUrl(`/${lang}`) },
          { name: "FAQ", url },
        ])}
      />
      <JsonLd data={faqPageJsonLd(items)} />
      <FaqPageClient />
    </>
  );
}
