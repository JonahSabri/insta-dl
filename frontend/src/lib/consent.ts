export const CONSENT_KEY = "jg_cookie_consent";
export const CONSENT_EVENT = "jg-consent";

export type ConsentChoice = "accepted" | "necessary";

export function readConsent(): ConsentChoice | null {
  if (typeof window === "undefined") return null;
  try {
    const v = localStorage.getItem(CONSENT_KEY);
    return v === "accepted" || v === "necessary" ? v : null;
  } catch {
    return null;
  }
}

export function saveConsent(value: ConsentChoice) {
  try {
    localStorage.setItem(CONSENT_KEY, value);
    document.cookie = `${CONSENT_KEY}=${value};path=/;max-age=31536000;SameSite=Lax`;
  } catch {
    /* ignore */
  }
  window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: value }));
}
