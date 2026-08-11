/** Join class names without trailing empty tokens (avoids hydration mismatches). */
export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}
