import type { Metadata } from "next";
import LegalPageShell from "@/components/LegalPageShell";
import { getLegalMeta, loadLegalHtml } from "@/lib/legal";
import { absoluteUrl } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const meta = getLegalMeta("about");
  return {
    title: meta.title,
    description: meta.description,
    alternates: { canonical: absoluteUrl(`/${lang}/about`) },
    robots: { index: true, follow: true },
  };
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  return <LegalPageShell html={loadLegalHtml("about", lang)} />;
}
