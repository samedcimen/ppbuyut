import { InlineMarkdown } from "@/components/inline-markdown";
import { PageHero } from "@/components/page-hero";
import { getReleases, type Release } from "@/lib/changelog";
import { pageCopy } from "@/lib/content/pages";
import type { Locale } from "@/lib/i18n";
import { pagePath } from "@/lib/i18n/routes";
import { pageMetadata } from "@/lib/seo";
import { cn } from "@/lib/cn";

export function changelogMetadata(locale: Locale) {
  const t = pageCopy(locale).changelog;
  return pageMetadata({
    locale,
    paths: { tr: pagePath("changelog", "tr"), en: pagePath("changelog", "en") },
    title: t.title,
    description: t.metaDescription,
  });
}

const UNRELEASED = "Yayınlanmamış";

const SECTION_STYLE: Record<string, string> = {
  Eklenenler: "bg-success/12 text-success",
  Değiştirilenler: "bg-surface-2 text-fg",
  Düzeltilenler: "bg-warning/12 text-warning",
  Kaldırılanlar: "bg-danger/10 text-danger",
  "Bilinen sorunlar": "bg-warning/12 text-warning",
  Planlanan: "bg-surface-2 text-muted",
};

// CHANGELOG.md is written in Turkish; English pages translate its section titles.
const SECTION_EN: Record<string, string> = {
  Eklenenler: "Added",
  Değiştirilenler: "Changed",
  Düzeltilenler: "Fixed",
  Kaldırılanlar: "Removed",
  "Bilinen sorunlar": "Known issues",
  Planlanan: "Planned",
};

const formatDate = (iso: string, locale: Locale) =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString(locale === "tr" ? "tr-TR" : "en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });

export function ChangelogPage({ locale }: { locale: Locale }) {
  const t = pageCopy(locale).changelog;
  // An empty "Unreleased" heading stays in CHANGELOG.md between releases; it only
  // shows up here once something is written under it.
  const releases = getReleases().filter(
    (r) => r.version !== UNRELEASED || r.summary || r.sections.some((s) => s.items.length > 0),
  );
  const latest = releases.find((r) => r.version !== UNRELEASED)?.version;

  return (
    <>
      <PageHero eyebrow={t.eyebrow} title={t.heading} description={t.description} />

      <ol className="mx-auto max-w-6xl px-4 pb-24 sm:px-6 sm:pb-32">
        {releases.map((release) => (
          <ReleaseEntry
            key={release.version}
            release={release}
            isLatest={release.version === latest}
            locale={locale}
          />
        ))}
      </ol>
    </>
  );
}

function ReleaseEntry({ release, isLatest, locale }: { release: Release; isLatest: boolean; locale: Locale }) {
  const t = pageCopy(locale).changelog;
  const unreleased = release.version === UNRELEASED;

  return (
    <li
      id={unreleased ? "yakinda" : `v${release.version}`}
      className="grid scroll-mt-28 gap-6 border-t border-line py-12 first:border-t-0 first:pt-0 lg:grid-cols-[220px_1fr] lg:gap-12"
    >
      <div className="lg:sticky lg:top-28 lg:self-start">
        <div className="flex items-center gap-2.5">
          <h2 className={cn("font-semibold tracking-tight", unreleased ? "text-xl" : "font-mono text-2xl")}>
            {unreleased ? t.upcoming : `v${release.version}`}
          </h2>
          {isLatest && (
            <span className="rounded-full bg-fg px-2 py-0.5 text-[11px] font-semibold text-bg">{t.latest}</span>
          )}
        </div>
        <p className="mt-1 text-sm text-muted">
          {release.date ? (
            <time dateTime={release.date}>{formatDate(release.date, locale)}</time>
          ) : (
            t.inProgress
          )}
        </p>
      </div>

      <div className={cn("min-w-0", unreleased && "rounded-3xl border border-dashed border-line-strong p-6 sm:p-8")}>
        {release.summary && (
          <p lang="tr" className="mb-8 text-lg leading-relaxed text-pretty">
            <InlineMarkdown text={release.summary} />
          </p>
        )}
        <div className="space-y-8">
          {release.sections.map((section) => (
            <section key={section.title}>
              <h3
                className={cn(
                  "inline-flex rounded-full px-2.5 py-1 text-xs font-semibold",
                  SECTION_STYLE[section.title] ?? "bg-surface-2 text-muted",
                )}
              >
                {locale === "tr" ? section.title : (SECTION_EN[section.title] ?? section.title)}
              </h3>
              <ul lang="tr" className="mt-4 space-y-3">
                {section.items.map((item) => (
                  <li key={item.text} className="flex gap-3 text-[15px] leading-relaxed text-muted">
                    <span className="mt-[0.6em] size-1.5 shrink-0 rounded-full bg-line-strong" />
                    <div className="min-w-0">
                      <InlineMarkdown text={item.text} />
                      {item.children.length > 0 && (
                        <ul className="mt-2 space-y-1.5 border-l border-line pl-4">
                          {item.children.map((child) => (
                            <li key={child} className="text-sm">
                              <InlineMarkdown text={child} />
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>
    </li>
  );
}
