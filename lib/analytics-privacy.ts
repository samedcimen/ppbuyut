import { pagePath } from "./i18n/routes";
import { isPlatformId } from "./platforms";

// Searches are never stored (see the terms page), but profile paths carry the
// username (/instagram/natgeo, /en/instagram/natgeo). Every page view is
// reduced to its page type before it leaves the browser.

const PAGES = ["home", "platforms", "faq", "about", "terms", "changelog"] as const;
const STATIC_PAGES = new Set(PAGES.flatMap((page) => [pagePath(page, "tr"), pagePath(page, "en")]));

export function redactPath(pathname: string): string {
  const path = pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname;
  if (STATIC_PAGES.has(path)) return path;

  const all = path.split("/").filter(Boolean);
  const english = all[0] === "en";
  const prefix = english ? "/en" : "";
  const segments = english ? all.slice(1) : all;

  // Landing pages: /pp-buyutme/<platform>, /en/profile-picture/<platform>
  const landing = english ? "profile-picture" : "pp-buyutme";
  if (segments.length === 2 && segments[0] === landing && isPlatformId(segments[1])) return path;
  // Profile result: /<platform>/<username>
  if (segments.length === 2 && isPlatformId(segments[0])) return `${prefix}/${segments[0]}/[kullanici]`;
  // A pasted profile link (/https://…) or anything else that could contain a name.
  return `${prefix}/[profil-baglantisi]`;
}

/** Rewrites an analytics event URL: redacted path, no query or fragment. */
export function redactUrl(url: string): string {
  const parsed = new URL(url);
  return `${parsed.origin}${redactPath(parsed.pathname)}`;
}
