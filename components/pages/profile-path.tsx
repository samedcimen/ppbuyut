import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { HowItWorks } from "@/components/sections/how-it-works";
import { Viewer } from "@/components/viewer/viewer";
import { pageCopy } from "@/lib/content/pages";
import { detect, looksLikeLinkPath, parseProfilePath, profilePathText } from "@/lib/detect";
import type { Locale } from "@/lib/i18n";
import { PLATFORMS } from "@/lib/platforms";

// Any path that isn't a real page is tried as a profile link:
// ppbuyut.com/instagram.com/kullanici → search box prefilled, search starts.
// A link we can't use (other site, non-profile page) is still shown in the box with the reason.

export function profilePathMetadata(slug: string[], locale: Locale): Metadata {
  const profile = parseProfilePath(slug);
  return {
    title: profile ? pageCopy(locale).profile.title(profile.username, PLATFORMS[profile.platform].name) : undefined,
    robots: { index: false },
  };
}

export function ProfilePathPage({ slug, locale }: { slug: string[]; locale: Locale }) {
  const profile = parseProfilePath(slug);
  const text = profilePathText(slug);
  // Plain words like /olmayan-sayfa or /platformlar/abc are a normal 404; only
  // link-looking paths (/instagram.com/explore) get the explanation.
  if (!profile && !(looksLikeLinkPath(slug) && detect(text).kind === "invalid")) notFound();

  return (
    <>
      <div className="min-h-[calc(100svh-4.5rem)] pb-16">
        <Viewer initial={profile ?? undefined} initialText={profile ? undefined : text} />
      </div>
      <HowItWorks locale={locale} />
    </>
  );
}
