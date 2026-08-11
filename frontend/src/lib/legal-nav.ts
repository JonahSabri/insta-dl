export type LegalSlug =
  | "terms"
  | "privacy-policy"
  | "cookie-policy"
  | "disclaimer"
  | "contact"
  | "about";

export const LEGAL_NAV: { slug: LegalSlug; label: string }[] = [
  { slug: "about", label: "About" },
  { slug: "contact", label: "Contact" },
  { slug: "terms", label: "Terms" },
  { slug: "privacy-policy", label: "Privacy" },
  { slug: "cookie-policy", label: "Cookies" },
  { slug: "disclaimer", label: "Disclaimer" },
];
