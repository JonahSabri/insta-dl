/** ISO 3166-1 alpha-2 for flagcdn (no emoji — works on all OS/browsers). */
export const FLAG_CODES: Record<string, string> = {
  en: "gb",
  pt: "br",
  de: "de",
  fr: "fr",
  ja: "jp",
  nl: "nl",
  sv: "se",
  no: "no",
  da: "dk",
  it: "it",
  es: "es",
  tr: "tr",
  ar: "sa",
};

export default function FlagIcon({
  lang,
  size = 16,
  className,
}: {
  lang: string;
  size?: number;
  className?: string;
}) {
  const code = FLAG_CODES[lang] || "un";
  const h = Math.round(size * 0.75);
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`https://flagcdn.com/w40/${code}.png`}
      srcSet={`https://flagcdn.com/w80/${code}.png 2x`}
      width={size}
      height={h}
      alt=""
      loading="lazy"
      decoding="async"
      className={className}
      style={{
        width: size,
        height: h,
        objectFit: "cover",
        borderRadius: 2,
        display: "inline-block",
        flexShrink: 0,
      }}
    />
  );
}
