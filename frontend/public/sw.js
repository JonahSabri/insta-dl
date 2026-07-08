/**
 * JazzGhost Service Worker
 * Strategy:
 *   - /_next/static/**  → Cache-first (fingerprinted assets, immutable)
 *   - /fonts/**         → Cache-first
 *   - /pwa-icon/**      → Cache-first
 *   - /api/**           → Network-only (never cache download routes)
 *   - HTML pages        → Network-first, fall back to offline shell
 */

const CACHE_VERSION = "jazzghost-v1";
const OFFLINE_URL   = "/offline";

/* Assets to pre-cache on install */
const PRECACHE = [
  "/en",
  "/manifest.webmanifest",
  "/fonts/Lalezar-Regular.ttf",
  "/pwa-icon/192",
  "/pwa-icon/512",
];

/* ── Install ──────────────────────────────────────────────────────────────── */
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_VERSION)
      .then((cache) =>
        cache.addAll(PRECACHE).catch(() => {
          /* Non-fatal: precache best-effort */
        })
      )
      .then(() => self.skipWaiting())
  );
});

/* ── Activate ─────────────────────────────────────────────────────────────── */
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((k) => k !== CACHE_VERSION)
            .map((k) => caches.delete(k))
        )
      )
      .then(() => self.clients.claim())
  );
});

/* ── Fetch ────────────────────────────────────────────────────────────────── */
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  /* Only handle same-origin GET requests */
  if (request.method !== "GET" || url.origin !== self.location.origin) return;

  const path = url.pathname;

  /* 1. API routes → Network-only, no caching */
  if (path.startsWith("/api/") || path.startsWith("/admin")) return;

  /* 2. Next.js HMR websocket → skip */
  if (path.startsWith("/_next/webpack-hmr")) return;

  /* 3. Immutable static assets (_next/static) → Cache-first */
  if (
    path.startsWith("/_next/static/") ||
    path.startsWith("/fonts/") ||
    path.startsWith("/pwa-icon/") ||
    path.startsWith("/icons/")
  ) {
    event.respondWith(cacheFirst(request));
    return;
  }

  /* 4. HTML navigation → Network-first with offline fallback */
  if (request.headers.get("accept")?.includes("text/html")) {
    event.respondWith(networkFirstWithOfflineFallback(request));
    return;
  }

  /* 5. Everything else → Stale-while-revalidate */
  event.respondWith(staleWhileRevalidate(request));
});

/* ── Strategies ───────────────────────────────────────────────────────────── */

async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) return cached;
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(CACHE_VERSION);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    return new Response("Network error", { status: 503 });
  }
}

async function networkFirstWithOfflineFallback(request) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(CACHE_VERSION);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    const cached = await caches.match(request);
    if (cached) return cached;

    /* Return cached /en as the offline shell if available */
    const shell = await caches.match("/en");
    return (
      shell ??
      new Response(offlineHtml(), {
        headers: { "Content-Type": "text/html; charset=utf-8" },
      })
    );
  }
}

async function staleWhileRevalidate(request) {
  const cache  = await caches.open(CACHE_VERSION);
  const cached = await cache.match(request);

  const networkFetch = fetch(request)
    .then((response) => {
      if (response.ok) cache.put(request, response.clone());
      return response;
    })
    .catch(() => null);

  return cached ?? (await networkFetch) ?? new Response("", { status: 503 });
}

/* ── Minimal offline HTML ─────────────────────────────────────────────────── */
function offlineHtml() {
  return `<!DOCTYPE html>
<html lang="en" style="background:#060610;color:#e2e8f0;font-family:system-ui,sans-serif">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>JazzGhost — Offline</title></head>
<body style="display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:100vh;gap:1rem;text-align:center;padding:1rem">
  <div style="width:64px;height:64px;border-radius:16px;background:linear-gradient(135deg,#833ab4,#e1306c,#fcb045);display:flex;align-items:center;justify-content:center">
    <span style="color:#fff;font-size:24px;font-weight:900">JG</span>
  </div>
  <h1 style="margin:0;font-size:1.5rem;font-weight:800">You're offline</h1>
  <p style="margin:0;color:#64748b;font-size:0.95rem">Check your connection and try again.</p>
  <button onclick="location.reload()" style="margin-top:.5rem;padding:.65rem 1.5rem;border-radius:12px;border:none;background:linear-gradient(135deg,#833ab4,#e1306c);color:#fff;font-size:.9rem;font-weight:600;cursor:pointer">
    Retry
  </button>
</body>
</html>`;
}

/* ── Push notifications (future-ready, no-op for now) ─────────────────────── */
self.addEventListener("push", () => {});
self.addEventListener("notificationclick", () => {});
