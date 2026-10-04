/**
 * Public address of the site, used for canonical URLs, the sitemap and social
 * previews. Set NEXT_PUBLIC_SITE_URL once a domain exists; on Vercel the
 * production domain is picked up automatically until then.
 */
function siteUrl() {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  return `http://localhost:${process.env.PORT ?? 3000}`;
}

export const site = {
  name: "ppbüyüt",
  url: siteUrl(),
  title: "ppbüyüt — Profil fotoğrafını tam boyutta gör",
  description:
    "Instagram, TikTok, X, YouTube ve daha fazlasında profil fotoğraflarını platformun verdiği en büyük boyutta görüntüle ve indir. Reklamsız, kayıtsız, ücretsiz.",
  keywords: [
    "pp büyütme",
    "profil fotoğrafı büyütme",
    "instagram pp büyütme",
    "instagram profil fotoğrafı büyütme",
    "tiktok profil fotoğrafı",
    "twitter pp büyütme",
    "x profil fotoğrafı",
    "youtube kanal fotoğrafı indir",
    "profil fotoğrafı indir",
    "pp indir",
    "hd profil fotoğrafı",
  ],
  locale: "tr_TR",
  owner: {
    name: "samedcimen",
    /** Contact e-mail, encoded with `encodeEmail` (lib/obfuscate.ts) so it isn't harvestable from the public repo. */
    emailEncoded: "bW9jLmxpYW10b2hAbmVtaWNkZW1hcw==",
    url: "https://github.com/samedcimen",
    github: "samedcimen",
  },
  year: "2026",
};
