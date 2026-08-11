"use client";

import { useEffect } from "react";
import Script from "next/script";
import {
  CONSENT_EVENT,
  readConsent,
  type ConsentChoice,
} from "@/lib/consent";

const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "G-XSR0SWWW9H";

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
  }
}

function applyConsent(choice: ConsentChoice | null) {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  const granted = choice === "accepted";
  window.gtag("consent", "update", {
    analytics_storage: granted ? "granted" : "denied",
    ad_storage: granted ? "granted" : "denied",
    ad_user_data: granted ? "granted" : "denied",
    ad_personalization: granted ? "granted" : "denied",
  });
}

export default function GoogleAnalytics() {
  useEffect(() => {
    applyConsent(readConsent());

    function onConsent(e: Event) {
      const detail = (e as CustomEvent<ConsentChoice>).detail;
      applyConsent(detail ?? readConsent());
    }
    window.addEventListener(CONSENT_EVENT, onConsent);
    return () => window.removeEventListener(CONSENT_EVENT, onConsent);
  }, []);

  if (!GA_ID) return null;

  return (
    <>
      <Script id="ga-consent-default" strategy="beforeInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          window.gtag = gtag;
          gtag('consent', 'default', {
            analytics_storage: 'denied',
            ad_storage: 'denied',
            ad_user_data: 'denied',
            ad_personalization: 'denied',
            wait_for_update: 500
          });
          gtag('js', new Date());
          gtag('config', '${GA_ID}', { anonymize_ip: true });
        `}
      </Script>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
    </>
  );
}
