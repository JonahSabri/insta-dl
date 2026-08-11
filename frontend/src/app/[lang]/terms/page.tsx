import type { Metadata } from "next";
import LegalPageShell from "@/components/LegalPageShell";
import { getLegalMeta, loadLegalHtml } from "@/lib/legal";
import { absoluteUrl, buildPageMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const meta = getLegalMeta("terms");
  return {
    ...buildPageMetadata(lang, "home"),
    title: meta.title,
    description: meta.description,
    alternates: {
      canonical: absoluteUrl(`/${lang}/terms`),
    },
    openGraph: {
      title: meta.title,
      description: meta.description,
      url: absoluteUrl(`/${lang}/terms`),
    },
    robots: { index: true, follow: true },
  };
}

export default async function TermsPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  return <LegalPageShell html={loadLegalHtml("terms", lang)} />;
}
