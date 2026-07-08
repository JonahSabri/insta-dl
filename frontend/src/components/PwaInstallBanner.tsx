"use client";

import { useEffect, useState } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function PwaInstallBanner() {
  const [prompt, setPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    /* Don't show if already installed or user dismissed before */
    if (
      window.matchMedia("(display-mode: standalone)").matches ||
      sessionStorage.getItem("pwa-banner-dismissed")
    ) return;

    function handler(e: Event) {
      e.preventDefault();
      setPrompt(e as BeforeInstallPromptEvent);
      setVisible(true);
    }

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  async function handleInstall() {
    if (!prompt) return;
    await prompt.prompt();
    const { outcome } = await prompt.userChoice;
    if (outcome === "accepted") setVisible(false);
    setPrompt(null);
  }

  function handleDismiss() {
    setVisible(false);
    sessionStorage.setItem("pwa-banner-dismissed", "1");
  }

  if (!visible) return null;

  return (
    <div className="pwa-banner anim-slide-up" role="banner">
      {/* Icon */}
      <div className="pwa-banner-icon">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
          <polyline points="7 10 12 15 17 10"/>
          <line x1="12" y1="15" x2="12" y2="3"/>
        </svg>
      </div>

      {/* Text */}
      <div className="pwa-banner-text">
        <span className="pwa-banner-title">Install JazzGhost</span>
        <span className="pwa-banner-sub">Add to home screen for quick access</span>
      </div>

      {/* Actions */}
      <div className="pwa-banner-actions">
        <button onClick={handleInstall} className="pwa-banner-btn-install">
          Install
        </button>
        <button onClick={handleDismiss} className="pwa-banner-btn-close" aria-label="Dismiss">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>
    </div>
  );
}
