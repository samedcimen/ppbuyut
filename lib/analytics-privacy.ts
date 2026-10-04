import { isPlatformId } from "./platforms";

// Searches are never stored (see the terms page), but profile paths carry the
// username (/instagram/natgeo). Every page view is reduced to its page type
// before it leaves the browser.

const STATIC_PAGES = new Set(["/", "/platformlar", "/sss", "/hakkinda", "/kullanim-sartlari", "/surum-notlari"]);

export function redactPath(pathname: string): string {
  const path = pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname;
  if (STATIC_PAGES.has(path)) return path;

  const segments = path.split("/").filter(Boolean);
  // Landing pages: /pp-buyutme/<platform>
  if (segments.length === 2 && segments[0] === "pp-buyutme" && isPlatformId(segments[1])) return path;
  // Profile result: /<platform>/<username>
  if (segments.length === 2 && isPlatformId(segments[0])) return `/${segments[0]}/[kullanici]`;
  // A pasted profile link (/https://…) or anything else that could contain a name.
  return "/[profil-baglantisi]";
}

/** Rewrites an analytics event URL: redacted path, no query or fragment. */
export function redactUrl(url: string): string {
  const parsed = new URL(url);
  return `${parsed.origin}${redactPath(parsed.pathname)}`;
}
