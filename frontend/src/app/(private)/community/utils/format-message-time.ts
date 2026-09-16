import type { Locale } from "@/lib/i18n";

export function formatMessageTime(
  isoString: string,
  locale: Locale = "pt",
): string {
  const date = new Date(isoString);

  return date.toLocaleTimeString(locale, {
    hour: "2-digit",
    minute: "2-digit",
  });
}