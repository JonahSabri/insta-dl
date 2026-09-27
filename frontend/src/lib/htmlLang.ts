const HTML_LANG_MAP: Record<string, string> = { pt: "pt-BR", no: "nb-NO" };

export function toHtmlLang(code: string): string {
  return HTML_LANG_MAP[code] ?? code;
}
