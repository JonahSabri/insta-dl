"use client";

import { useEffect, useRef } from "react";

const CLIENT_ID = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;

declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

export default function AdUnit({ slot, minHeight = 250 }: { slot: string; minHeight?: number }) {
  const pushed = useRef(false);

  useEffect(() => {
    if (pushed.current || !CLIENT_ID) return;
    pushed.current = true;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      /* script not loaded (no consent) */
    }
  }, []);

  if (!CLIENT_ID) return null;

  return (
    <div style={{ minHeight }} aria-hidden="true">
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={CLIENT_ID}
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}
