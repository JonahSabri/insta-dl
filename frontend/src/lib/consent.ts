export const CONSENT_EVENT = "cookie-consent-changed";

export type ConsentState = "accepted" | "declined" | null;

export function readConsent(): ConsentState {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(/(?:^|;\s*)cookie-consent=([^;]+)/);
  return (match?.[1] as ConsentState) ?? null;
}

export function writeConsent(state: "accepted" | "declined") {
  document.cookie = `cookie-consent=${state};path=/;max-age=31536000;SameSite=Lax`;
  window.dispatchEvent(new Event(CONSENT_EVENT));
}
