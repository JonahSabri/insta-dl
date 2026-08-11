import { readFileSync } from "fs";
import { join } from "path";
import type { LegalSlug } from "@/lib/legal-nav";

export type { LegalSlug };
export { LEGAL_NAV } from "@/lib/legal-nav";

const TITLES: Record<LegalSlug, string> = {
  terms: "Terms of Service",
  "privacy-policy": "Privacy Policy",
  "cookie-policy": "Cookie Policy",
  disclaimer: "Disclaimer",
  contact: "Contact Us",
  about: "About JazzGhost",
};

const DESCRIPTIONS: Record<LegalSlug, string> = {
  terms: "Terms of Service for JazzGhost — rules for using our Instagram downloader tools.",
  "privacy-policy": "How JazzGhost collects, uses, and protects your information.",
  "cookie-policy": "How JazzGhost uses cookies and how you can manage consent.",
  disclaimer: "Important legal disclaimer for using JazzGhost download tools.",
  contact: "Contact JazzGhost support, copyright, privacy, and business inquiries.",
  about: "Learn about JazzGhost — our mission, how it works, and our commitments.",
};

export function getLegalMeta(slug: LegalSlug) {
  return { title: TITLES[slug], description: DESCRIPTIONS[slug] };
}

export function loadLegalHtml(slug: LegalSlug, lang = "en"): string {
  const file = join(process.cwd(), "src/content/legal", `${slug}.html`);
  let raw = readFileSync(file, "utf8");
  raw = raw.replace(/<!--[\s\S]*?-->/g, "").trim();
  raw = raw.replace(/https:\/\/jazzghost\.com\//g, `/${lang}/`);
  for (const p of [
    "privacy-policy",
    "cookie-policy",
    "terms",
    "disclaimer",
    "contact",
    "about",
  ] as const) {
    raw = raw.replaceAll(`href="/${p}`, `href="/${lang}/${p}`);
  }
  return raw;
}
