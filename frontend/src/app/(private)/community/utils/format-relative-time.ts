import type { Locale } from "@/lib/i18n";

export function formatRelativeTime(
  isoString: string,
  locale: Locale = "pt",
): string {
  const date = new Date(isoString);
  const now = new Date();

  const diffMs = now.getTime() - date.getTime();

  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) {
    return locale === "fr"
      ? "maintenant"
      : locale === "en"
        ? "now"
        : "agora";
  }

  if (diffMins < 60) return `${diffMins}m`;

  if (diffHours < 24) return `${diffHours}h`;

  return `${diffDays}d`;
}