import type { Metadata, Viewport } from "next";
import { getMessages, type Locale } from "./i18n";
import { LOCALE_PREFIX } from "./i18n/routes";
import { OG_SIZE } from "./og-image";
import { site } from "./site";

// Site-wide metadata of each language's root layout; pages add their own on top.
export function siteMetadata(locale: Locale): Metadata {
  const t = getMessages(locale);
  const home = locale === "tr" ? "/" : "/en";
  const image = `${LOCALE_PREFIX[locale]}/opengraph-image`;
  return {
    metadataBase: new URL(site.url),
    title: { default: t.site.title, template: `%s · ${site.name}` },
    description: t.site.description,
    keywords: t.site.keywords,
    applicationName: site.name,
    authors: [{ name: site.owner.name, url: site.owner.url }],
    creator: site.owner.name,
    category: "utilities",
    alternates: { canonical: home, languages: { tr: "/", en: "/en", "x-default": "/" } },
    openGraph: {
      type: "website",
      locale: t.ogLocale,
      siteName: site.name,
      url: home,
      title: t.site.title,
      description: t.site.description,
      images: [{ url: image, ...OG_SIZE, alt: t.site.title }],
    },
    twitter: { card: "summary_large_image", title: t.site.title, description: t.site.description, images: [image] },
    robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large" } },
    formatDetection: { telephone: false, email: false, address: false },
    // Home-screen app on iOS (Android reads app/manifest.ts).
    appleWebApp: { capable: true, title: site.name, statusBarStyle: "default" },
    // Search Console / Webmaster Tools ownership tags, set in the deployment's environment.
    verification: {
      google: process.env.GOOGLE_SITE_VERIFICATION ?? site.googleVerification,
      yandex: process.env.YANDEX_VERIFICATION ?? site.yandexVerification,
      other: process.env.BING_SITE_VERIFICATION ? { "msvalidate.01": process.env.BING_SITE_VERIFICATION } : undefined,
    },
  };
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fafafa" },
    { media: "(prefers-color-scheme: dark)", color: "#08080a" },
  ],
};
