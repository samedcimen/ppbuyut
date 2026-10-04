import { isPlatformId, type PlatformId } from "../platforms";

export const LOCALES = ["tr", "en"] as const;
export type Locale = (typeof LOCALES)[number];

/** Turkish lives at the root (its search ranking stays put); English under /en. */
export const LOCALE_PREFIX: Record<Locale, string> = { tr: "", en: "/en" };

type PageKey = "home" | "platforms" | "faq" | "about" | "terms" | "changelog";

const PAGE_PATHS: Record<PageKey, Record<Locale, string>> = {
  home: { tr: "/", en: "/en" },
  platforms: { tr: "/platformlar", en: "/en/platforms" },
  faq: { tr: "/sss", en: "/en/faq" },
  about: { tr: "/hakkinda", en: "/en/about" },
  terms: { tr: "/kullanim-sartlari", en: "/en/terms" },
  // Release notes are written in Turkish only.
  changelog: { tr: "/surum-notlari", en: "/surum-notlari" },
};

export function pagePath(page: PageKey, locale: Locale) {
  return PAGE_PATHS[page][locale];
}

/** Per-platform landing page ("instagram pp büyütme" / "instagram profile picture viewer"). */
export function landingPath(platform: PlatformId, locale: Locale) {
  return locale === "tr" ? `/pp-buyutme/${platform}` : `/en/profile-picture/${platform}`;
}

/** A searched profile's shareable address. */
export function profilePath(platform: PlatformId, username: string, locale: Locale) {
  return `${LOCALE_PREFIX[locale]}/${platform}/${encodeURIComponent(username)}`;
}

export function localeOf(pathname: string): Locale {
  return pathname === "/en" || pathname.startsWith("/en/") ? "en" : "tr";
}

/** The same page in the other language, for the language switch. Falls back to that language's home. */
export function switchLocalePath(pathname: string, to: Locale): string {
  const from = localeOf(pathname);
  if (from === to) return pathname;

  for (const paths of Object.values(PAGE_PATHS)) {
    if (paths[from] === pathname) return paths[to];
  }

  const segments = pathname.split("/").filter(Boolean);
  const rest = from === "en" ? segments.slice(1) : segments;

  // Landing pages
  if (from === "tr" && rest[0] === "pp-buyutme" && isPlatformId(rest[1])) return landingPath(rest[1], to);
  if (from === "en" && rest[0] === "profile-picture" && isPlatformId(rest[1])) return landingPath(rest[1], to);
  // Profile results: /<platform>/<username>
  if (rest.length === 2 && isPlatformId(rest[0])) return `${LOCALE_PREFIX[to]}/${rest[0]}/${rest[1]}`;

  return PAGE_PATHS.home[to];
}
