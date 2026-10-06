/** Where the site is served; ppbuyut.vercel.app redirects here (next.config.ts). */
export const PRODUCTION_URL = "https://ppbuyut.com";

/** Public address of the site, used for canonical URLs, the sitemap and social previews. */
function siteUrl() {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  // Not VERCEL_PROJECT_PRODUCTION_URL: it follows any domain attached in Vercel,
  // even one that doesn't resolve yet, and search engines would be sent there.
  if (process.env.VERCEL_ENV === "production") return PRODUCTION_URL;
  return `http://localhost:${process.env.PORT ?? 3000}`;
}

export const site = {
  name: "ppbüyüt",
  url: siteUrl(),
  /** Google Search Console ownership tag for the old ppbuyut.vercel.app property (public, ships in the HTML). */
  googleVerification: "RfYdHb1tZKZ_tRKeVpMpLEOfTVEa4km_PZ0tu4AlrWA",
  /** Yandex Webmaster ownership tag (public, ships in the HTML). */
  yandexVerification: "a4ae42442316d5bf",
  owner: {
    name: "samedcimen",
    /** Contact e-mail, encoded with `encodeEmail` (lib/obfuscate.ts) so it isn't harvestable from the public repo. */
    emailEncoded: "bW9jLmxpYW10b2hAbmVtaWNkZW1hcw==",
    url: "https://github.com/samedcimen",
    github: "samedcimen",
  },
  year: "2026",
};
