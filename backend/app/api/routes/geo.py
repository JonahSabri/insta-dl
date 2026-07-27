from __future__ import annotations

import ipaddress

import httpx
from fastapi import APIRouter, Request

router = APIRouter(tags=["geo"])

# ISO country code → site language (only supported langs)
COUNTRY_TO_LANG: dict[str, str] = {
    # Persian
    "IR": "fa",
    "AF": "fa",
    # Arabic
    "SA": "ar", "AE": "ar", "EG": "ar", "IQ": "ar", "JO": "ar", "KW": "ar",
    "LB": "ar", "OM": "ar", "QA": "ar", "BH": "ar", "SY": "ar", "YE": "ar",
    "MA": "ar", "DZ": "ar", "TN": "ar", "LY": "ar", "SD": "ar", "PS": "ar",
    # Portuguese
    "BR": "pt", "PT": "pt", "AO": "pt", "MZ": "pt",
    # German
    "DE": "de", "AT": "de", "LI": "de",
    # French
    "FR": "fr", "MC": "fr",
    # Japanese
    "JP": "ja",
    # Dutch
    "NL": "nl",
    # Swedish
    "SE": "sv",
    # Norwegian
    "NO": "no",
    # Danish
    "DK": "da",
    # Italian
    "IT": "it", "SM": "it", "VA": "it",
    # Spanish
    "ES": "es", "MX": "es", "AR": "es", "CO": "es", "CL": "es", "PE": "es",
    "VE": "es", "EC": "es", "GT": "es", "CU": "es", "BO": "es", "DO": "es",
    "HN": "es", "PY": "es", "SV": "es", "NI": "es", "CR": "es", "PA": "es",
    "UY": "es", "PR": "es",
    # Turkish
    "TR": "tr",
    # English-majority / fallbacks stay "en"
    "US": "en", "GB": "en", "AU": "en", "CA": "en", "NZ": "en", "IE": "en",
    "ZA": "en", "IN": "en", "SG": "en", "PH": "en",
}


def _client_ip(request: Request, explicit: str | None = None) -> str:
    if explicit:
        return explicit.strip()
    xff = request.headers.get("x-forwarded-for")
    if xff:
        return xff.split(",")[0].strip()
    xri = request.headers.get("x-real-ip")
    if xri:
        return xri.strip()
    if request.client:
        return request.client.host
    return ""


def _is_private(ip: str) -> bool:
    try:
        return ipaddress.ip_address(ip).is_private or ipaddress.ip_address(ip).is_loopback
    except ValueError:
        return True


async def _lookup_country(ip: str) -> str | None:
    if not ip or _is_private(ip):
        return None
    try:
        async with httpx.AsyncClient(timeout=2.5) as client:
            # Free endpoint, no API key (non-HTTPS allowed by ip-api)
            r = await client.get(
                f"http://ip-api.com/json/{ip}",
                params={"fields": "status,countryCode"},
            )
            if r.status_code != 200:
                return None
            data = r.json()
            if data.get("status") != "success":
                return None
            code = (data.get("countryCode") or "").upper()
            return code or None
    except Exception:
        return None


@router.get("/v1/geo")
async def geo_lang(request: Request, ip: str | None = None) -> dict:
    """Resolve visitor IP → country → site language (else English)."""
    # Prefer CDN / proxy country headers when present
    header_country = (
        request.headers.get("x-vercel-ip-country")
        or request.headers.get("cf-ip-country")
        or request.headers.get("x-country-code")
        or request.headers.get("cloudfront-viewer-country")
    )
    country = (header_country or "").upper() or None
    resolved_ip = _client_ip(request, ip)

    if not country:
        country = await _lookup_country(resolved_ip)

    lang = COUNTRY_TO_LANG.get(country or "", "en")
    return {
        "ip": resolved_ip or None,
        "country": country,
        "lang": lang,
        "mapped": country in COUNTRY_TO_LANG if country else False,
    }
