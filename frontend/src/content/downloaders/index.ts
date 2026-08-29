import { EN_DOWNLOADERS } from "./en";
import type { DownloaderContent, DownloaderSlug, DownloaderToolId } from "./types";
import { DOWNLOADER_SLUGS } from "./types";

export type { DownloaderContent, DownloaderSlug, DownloaderToolId, DownloaderStep, DownloaderFaq } from "./types";
export { DOWNLOADER_SLUGS } from "./types";

const BY_SLUG = new Map(EN_DOWNLOADERS.map((d) => [d.slug, d]));
const BY_ID = new Map(EN_DOWNLOADERS.map((d) => [d.id, d]));

/** Full unique English content; other langs fall back to EN until translated. */
export function getDownloaderContent(slug: string, _lang?: string): DownloaderContent | null {
  return BY_SLUG.get(slug) ?? null;
}

export function getDownloaderById(id: DownloaderToolId): DownloaderContent | null {
  return BY_ID.get(id) ?? null;
}

export function listDownloaders(): DownloaderContent[] {
  return EN_DOWNLOADERS;
}

export function isDownloaderSlug(slug: string): slug is DownloaderSlug {
  return (DOWNLOADER_SLUGS as readonly string[]).includes(slug);
}

export const TOOL_NAV = EN_DOWNLOADERS.map((d) => ({
  slug: d.slug,
  id: d.id,
  label: d.h1.replace(/^Instagram\s+/i, "").replace(/\s+Downloader$/i, "") || d.h1,
  shortLabel:
    d.id === "reel"
      ? "Reels"
      : d.id === "post"
        ? "Posts"
        : d.id === "carousel"
          ? "Carousel"
          : d.id === "story"
            ? "Stories"
            : d.id === "highlight"
              ? "Highlights"
              : d.id === "bio"
                ? "Bio"
                : "Caption",
  href: (lang: string) => `/${lang}/${d.slug}`,
}));
