export type DownloaderToolId =
  | "reel"
  | "post"
  | "carousel"
  | "story"
  | "highlight"
  | "bio"
  | "caption";

export interface DownloaderStep {
  order: number;
  title: string;
  description: string;
  image?: string;
  imageAlt?: string;
}

export interface DownloaderFaq {
  question: string;
  answer: string;
}

export interface DownloaderContent {
  id: DownloaderToolId;
  slug: string;
  /** Locked media/input mode for DownloadBox */
  lockedType: DownloaderToolId;
  inputMode: "url" | "username";
  metaTitle: string;
  metaDescription: string;
  h1: string;
  subtitle: string;
  placeholder: string;
  ctaLabel: string;
  howToTitle: string;
  steps: DownloaderStep[];
  aboutTitle: string;
  aboutBody: string[];
  featuresTitle: string;
  features: { title: string; description: string }[];
  faqTitle: string;
  faqs: DownloaderFaq[];
  keywords: string[];
}

export const DOWNLOADER_SLUGS = [
  "instagram-reels-downloader",
  "instagram-post-downloader",
  "instagram-story-downloader",
  "instagram-carousel-downloader",
  "instagram-highlight-downloader",
  "instagram-bio-downloader",
  "instagram-caption-downloader",
] as const;

export type DownloaderSlug = (typeof DOWNLOADER_SLUGS)[number];
