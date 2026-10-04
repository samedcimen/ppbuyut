import type { MetadataRoute } from "next";
import { getReleases } from "@/lib/changelog";
import { site } from "@/lib/site";

// Profile paths (/instagram/kullanici) are left out on purpose: they're noindex.
const PAGES: { path: string; priority: number; changeFrequency: "weekly" | "monthly" }[] = [
  { path: "/", priority: 1, changeFrequency: "weekly" },
  { path: "/platformlar", priority: 0.8, changeFrequency: "weekly" },
  { path: "/sss", priority: 0.7, changeFrequency: "monthly" },
  { path: "/hakkinda", priority: 0.5, changeFrequency: "monthly" },
  { path: "/surum-notlari", priority: 0.4, changeFrequency: "weekly" },
  { path: "/kullanim-sartlari", priority: 0.3, changeFrequency: "monthly" },
];

export default function sitemap(): MetadataRoute.Sitemap {
  // The latest release date stands in for "last modified" across the site.
  const latest = getReleases().find((r) => r.date)?.date;
  const lastModified = latest ? new Date(latest) : undefined;

  return PAGES.map(({ path, priority, changeFrequency }) => ({
    url: `${site.url}${path}`,
    lastModified,
    changeFrequency,
    priority,
  }));
}
