import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const SUPPORTED_LANGS = ["en", "pt", "de", "fr", "ja", "nl", "sv", "no", "da", "it", "es", "tr", "ar"];
const DEFAULT_LANG = "en";

/** Root assets / Next metadata — never prefix with /{lang} */
const SKIP_LANG_PREFIX =
  /^\/(api|_next|fonts|icon|apple-icon|opengraph-image|twitter-image|pwa-icon|manifest\.webmanifest|robots\.txt|sitemap\.xml|favicon\.ico)(\/|$|\?)/;

const COUNTRY_TO_LANG: Record<string, string> = {
  SA: "ar", AE: "ar", EG: "ar", IQ: "ar", JO: "ar", KW: "ar", LB: "ar",
  OM: "ar", QA: "ar", BH: "ar", SY: "ar", YE: "ar", MA: "ar", DZ: "ar",
  TN: "ar", LY: "ar", SD: "ar", PS: "ar",
  BR: "pt", PT: "pt", AO: "pt", MZ: "pt",
  DE: "de", AT: "de", LI: "de",
  FR: "fr", MC: "fr",
  JP: "ja",
  NL: "nl",
  SE: "sv",
  NO: "no",
  DK: "da",
  IT: "it", SM: "it", VA: "it",
  ES: "es", MX: "es", AR: "es", CO: "es", CL: "es", PE: "es", VE: "es",
  EC: "es", GT: "es", CU: "es", BO: "es", DO: "es", HN: "es", PY: "es",
  SV: "es", NI: "es", CR: "es", PA: "es", UY: "es", PR: "es",
  TR: "tr",
  US: "en", GB: "en", AU: "en", CA: "en", NZ: "en", IE: "en",
  IR: "en", AF: "en",
};

function langFromCountry(country: string | null | undefined): string | null {
  if (!country) return null;
  const mapped = COUNTRY_TO_LANG[country.toUpperCase()];
  if (mapped && SUPPORTED_LANGS.includes(mapped)) return mapped;
  return null;
}

function getCountryFromHeaders(request: NextRequest): string | null {
  const geo = (request as NextRequest & { geo?: { country?: string } }).geo;
  return (
    request.headers.get("x-vercel-ip-country") ||
    request.headers.get("cf-ip-country") ||
    request.headers.get("x-country-code") ||
    request.headers.get("cloudfront-viewer-country") ||
    geo?.country ||
    null
  );
}

/** Map Accept-Language to first supported locale. */
function detectLangFromAcceptLanguage(header: string | null): string | null {
  if (!header) return null;
  const parts = header.split(",").map((p) => {
    const [tag, qPart] = p.trim().split(";q=");
    const q = qPart ? Number(qPart) : 1;
    return { tag: tag.trim().toLowerCase(), q: Number.isFinite(q) ? q : 1 };
  });
  parts.sort((a, b) => b.q - a.q);

  for (const { tag } of parts) {
    if (!tag || tag === "*") continue;
    const primary = tag.split("-")[0];
    // pt-BR → pt
    if (SUPPORTED_LANGS.includes(primary)) return primary;
    if (tag.startsWith("nb") || tag.startsWith("nn")) return "no";
  }
  return null;
}

async function detectLangFromGeo(request: NextRequest): Promise<string | null> {
  const headerCountry = getCountryFromHeaders(request);
  const fromHeader = langFromCountry(headerCountry);
  if (fromHeader) return fromHeader;

  // CDN gave a country we don't map → treat as inconclusive (fall through)
  if (headerCountry) return null;

  try {
    const api = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000").replace(/\/$/, "");
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "";
    const url = ip
      ? `${api}/api/v1/geo?ip=${encodeURIComponent(ip)}`
      : `${api}/api/v1/geo`;

    const res = await fetch(url, {
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(2000),
      cache: "no-store",
    });
    if (res.ok) {
      const data = (await res.json()) as { lang?: string; country?: string };
      if (data.lang && SUPPORTED_LANGS.includes(data.lang)) return data.lang;
    }
  } catch {
    /* ignore geo failures — fall through to Accept-Language / default */
  }

  return null;
}

/**
 * Priority: Manual selection > Saved preference > Browser Accept-Language > IP geo > en
 */
async function detectLang(request: NextRequest): Promise<string> {
  const manual = request.cookies.get("lang_manual")?.value;
  const saved = request.cookies.get("lang")?.value;

  if (manual === "1" && saved && SUPPORTED_LANGS.includes(saved)) {
    return saved;
  }

  if (saved && SUPPORTED_LANGS.includes(saved)) {
    return saved;
  }

  const fromBrowser = detectLangFromAcceptLanguage(request.headers.get("accept-language"));
  if (fromBrowser) return fromBrowser;

  const fromGeo = await detectLangFromGeo(request);
  if (fromGeo) return fromGeo;

  return DEFAULT_LANG;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/fa" || pathname.startsWith("/fa/")) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.replace(/^\/fa/, "/en") || "/en";
    const res = NextResponse.redirect(url);
    res.cookies.set("lang", "en", { path: "/", maxAge: 60 * 60 * 24 * 365, sameSite: "lax" });
    res.cookies.delete("lang_manual");
    return res;
  }

  const hasLangPrefix = SUPPORTED_LANGS.some(
    (l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`)
  );
  if (hasLangPrefix) {
    const rest = pathname.replace(/^\/[a-z]{2}(?=\/)/, "") || "/";
    if (SKIP_LANG_PREFIX.test(rest)) {
      const url = request.nextUrl.clone();
      url.pathname = rest;
      return NextResponse.redirect(url);
    }
    // Sync cookie to URL lang without clearing manual preference
    const urlLang = pathname.split("/")[1];
    const res = NextResponse.next();
    if (urlLang && SUPPORTED_LANGS.includes(urlLang)) {
      const current = request.cookies.get("lang")?.value;
      if (current !== urlLang) {
        res.cookies.set("lang", urlLang, {
          path: "/",
          maxAge: 60 * 60 * 24 * 365,
          sameSite: "lax",
        });
      }
    }
    return res;
  }

  if (SKIP_LANG_PREFIX.test(pathname) || pathname.includes(".")) {
    return NextResponse.next();
  }

  const lang = await detectLang(request);
  const url = request.nextUrl.clone();
  url.pathname = `/${lang}${pathname === "/" ? "" : pathname}`;

  const res = NextResponse.redirect(url);
  res.cookies.set("lang", lang, { path: "/", maxAge: 60 * 60 * 24 * 365, sameSite: "lax" });
  return res;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|icon|apple-icon|opengraph-image|twitter-image|pwa-icon|manifest.webmanifest|robots.txt|sitemap.xml).*)",
  ],
};
