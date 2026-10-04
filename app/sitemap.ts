import type { MetadataRoute } from "next";
import { getReleases } from "@/lib/changelog";
import { landingPath, pagePath } from "@/lib/i18n/routes";
import { PLATFORM_IDS } from "@/lib/platforms";
import { site } from "@/lib/site";

type Entry = {
  /** Address in each language the page exists in. */
  paths: { tr: string; en?: string };
  priority: number;
  changeFrequency: "weekly" | "monthly";
};

const bilingual = (page: Parameters<typeof pagePath>[0]) => ({ tr: pagePath(page, "tr"), en: pagePath(page, "en") });

// Profile paths (/instagram/kullanici) are left out on purpose: they're noindex.
const PAGES: Entry[] = [
  { paths: bilingual("home"), priority: 1, changeFrequency: "weekly" },
  { paths: bilingual("platforms"), priority: 0.8, changeFrequency: "weekly" },
  { paths: bilingual("faq"), priority: 0.7, changeFrequency: "monthly" },
  { paths: bilingual("about"), priority: 0.5, changeFrequency: "monthly" },
  { paths: bilingual("changelog"), priority: 0.4, changeFrequency: "weekly" },
  { paths: bilingual("terms"), priority: 0.3, changeFrequency: "monthly" },
  ...PLATFORM_IDS.map((id) => ({
    paths: { tr: landingPath(id, "tr"), en: landingPath(id, "en") },
    priority: 0.9,
    changeFrequency: "monthly" as const,
  })),
];

export default function sitemap(): MetadataRoute.Sitemap {
  // The latest release date stands in for "last modified" across the site.
  const latest = getReleases().find((r) => r.date)?.date;
  const lastModified = latest ? new Date(latest) : undefined;
  const url = (path: string) => `${site.url}${path === "/" ? "" : path}`;

  // One entry per language version, each listing all versions as alternates.
  return PAGES.flatMap(({ paths, priority, changeFrequency }) => {
    const languages = paths.en ? { tr: url(paths.tr), en: url(paths.en) } : undefined;
    return Object.values(paths).map((path) => ({
      url: url(path),
      lastModified,
      changeFrequency,
      priority,
      ...(languages && { alternates: { languages } }),
    }));
  });
}
