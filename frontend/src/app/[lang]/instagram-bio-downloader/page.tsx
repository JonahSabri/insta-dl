import DownloaderSlugPage, { generateDownloaderMetadata } from "@/components/DownloaderSlugPage";
import type { Metadata } from "next";

const SLUG = "instagram-bio-downloader";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  return generateDownloaderMetadata(lang, SLUG);
}

export default async function Page({ params }: { params: Promise<{ lang: string }> }) {
  return <DownloaderSlugPage params={params} slug={SLUG} />;
}
