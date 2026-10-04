import type { Metadata } from "next";
import { site } from "./site";

/**
 * Metadata for a content page. A page's `openGraph` replaces the layout's
 * instead of merging with it, so the shared fields are repeated here.
 */
export function pageMetadata({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  path: string;
}): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      locale: site.locale,
      siteName: site.name,
      url: path,
      title: `${title} · ${site.name}`,
      description,
      // Set explicitly: a page-level openGraph drops the inherited image.
      images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: site.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} · ${site.name}`,
      description,
      images: ["/twitter-image"],
    },
  };
}

/** Renders schema.org data for search engines. */
export function jsonLd(data: Record<string, unknown>) {
  // "<" is escaped so the JSON can't close the script tag early.
  return { __html: JSON.stringify({ "@context": "https://schema.org", ...data }).replace(/</g, "\\u003c") };
}
