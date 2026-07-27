import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const SUPPORTED_LANGS = ["en", "pt", "de", "fr", "ja", "nl", "sv", "no", "da", "it", "es", "tr", "ar"];
const DEFAULT_LANG = "en";

const COUNTRY_TO_LANG: Record<string, string> = {
  // Persian removed — IR/AF fall through to English
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

async function detectLangFromGeo(request: NextRequest): Promise<string> {
  const headerCountry = getCountryFromHeaders(request);
  const fromHeader = langFromCountry(headerCountry);
  if (fromHeader) return fromHeader;

  // If CDN already gave a country not in our map → English
  if (headerCountry) return DEFAULT_LANG;

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
      // country known but not mapped → English
      if (data.country) return DEFAULT_LANG;
    }
  } catch {
    /* ignore geo failures */
  }

  return DEFAULT_LANG;
}

async function detectLang(request: NextRequest): Promise<string> {
  // Manual language choice always wins
  const manual = request.cookies.get("lang_manual")?.value;
  const saved = request.cookies.get("lang")?.value;
  if (manual === "1" && saved && SUPPORTED_LANGS.includes(saved)) {
    return saved;
  }

  return detectLangFromGeo(request);
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Persian removed — redirect old /fa paths to English
  if (pathname === "/fa" || pathname.startsWith("/fa/")) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.replace(/^\/fa/, "/en") || "/en";
    const res = NextResponse.redirect(url);
    res.cookies.set("lang", "en", { path: "/", maxAge: 60 * 60 * 24 * 365, sameSite: "lax" });
    res.cookies.delete("lang_manual");
    return res;
  }

  // Skip: already has a lang prefix
  const hasLangPrefix = SUPPORTED_LANGS.some(
    (l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`)
  );
  if (hasLangPrefix) return NextResponse.next();

  // Skip: api, Next.js internals, static files
  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/fonts") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  const lang = await detectLang(request);
  const url = request.nextUrl.clone();
  url.pathname = `/${lang}${pathname === "/" ? "" : pathname}`;

  const res = NextResponse.redirect(url);
  // Persist geo/manual lang for subsequent visits (manual flag unchanged)
  res.cookies.set("lang", lang, { path: "/", maxAge: 60 * 60 * 24 * 365, sameSite: "lax" });
  return res;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
