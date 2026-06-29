import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const SUPPORTED_LANGS = ["en", "pt", "fa"];
const DEFAULT_LANG = "en";

function detectLang(request: NextRequest): string {
  // Check if user has a saved preference in cookie
  const saved = request.cookies.get("lang")?.value;
  if (saved && SUPPORTED_LANGS.includes(saved)) return saved;

  // Detect from Accept-Language header
  const accept = request.headers.get("accept-language") ?? "";
  if (accept.includes("fa") || accept.includes("ir")) return "fa";
  if (accept.includes("pt")) return "pt";
  return DEFAULT_LANG;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

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

  // Redirect root (and any other paths) to /{lang}/path
  const lang = detectLang(request);
  const url = request.nextUrl.clone();
  url.pathname = `/${lang}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
