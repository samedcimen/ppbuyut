import type { Metadata } from "next";
import { getMessages, type Locale } from "./i18n";
import { LOCALE_PREFIX } from "./i18n/routes";
import { site } from "./site";

/**
 * Metadata for a content page. A page's `openGraph` replaces the layout's
 * instead of merging with it, so the shared fields are repeated here.
 * `paths` holds the page's address in each language it exists in; they become
 * hreflang alternates, and the one for `locale` the canonical address.
 */
export function pageMetadata({
  title,
  description,
  locale,
  paths,
}: {
  title: string;
  description: string;
  locale: Locale;
  paths: Partial<Record<Locale, string>>;
}): Metadata {
  const t = getMessages(locale);
  const path = paths[locale] ?? "/";
  const prefix = LOCALE_PREFIX[locale];
  const languages = paths.tr && paths.en ? { tr: paths.tr, en: paths.en, "x-default": paths.tr } : undefined;
  return {
    title,
    description,
    alternates: { canonical: path, languages },
    openGraph: {
      type: "website",
      locale: t.ogLocale,
      siteName: site.name,
      url: path,
      title: `${title} · ${site.name}`,
      description,
      // Set explicitly: a page-level openGraph drops the inherited image.
      images: [{ url: `${prefix}/opengraph-image`, width: 1200, height: 630, alt: t.site.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} · ${site.name}`,
      description,
      images: [`${prefix}/opengraph-image`],
    },
  };
}

/** Renders schema.org data for search engines. */
export function jsonLd(data: Record<string, unknown>) {
  // "<" is escaped so the JSON can't close the script tag early.
  return { __html: JSON.stringify({ "@context": "https://schema.org", ...data }).replace(/</g, "\u003c") };
}
