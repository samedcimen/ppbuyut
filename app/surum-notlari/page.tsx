import type { Metadata } from "next";
import { InlineMarkdown } from "@/components/inline-markdown";
import { PageHero } from "@/components/page-hero";
import { getReleases, type Release } from "@/lib/changelog";
import { cn } from "@/lib/cn";

export const metadata: Metadata = {
  title: "Sürüm notları",
  description: "ppbüyüt'e eklenen yenilikler, düzeltmeler ve planlanan özellikler.",
};

const UNRELEASED = "Yayınlanmamış";

const SECTION_STYLE: Record<string, string> = {
  Eklenenler: "bg-success/12 text-success",
  Değiştirilenler: "bg-surface-2 text-fg",
  Düzeltilenler: "bg-warning/12 text-warning",
  Kaldırılanlar: "bg-danger/10 text-danger",
  "Bilinen sorunlar": "bg-warning/12 text-warning",
  Planlanan: "bg-surface-2 text-muted",
};

const formatDate = (iso: string) =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });

export default function ReleaseNotesPage() {
  const releases = getReleases();
  const latest = releases.find((r) => r.version !== UNRELEASED)?.version;

  return (
    <>
      <PageHero
        eyebrow="Sürüm notları"
        title="Neler değişti?"
        description="ppbüyüt'e eklenen yenilikler, düzeltmeler ve sırada olanlar. En yeni sürüm en üstte."
      />

      <ol className="mx-auto max-w-6xl px-4 pb-24 sm:px-6 sm:pb-32">
        {releases.map((release) => (
          <ReleaseEntry key={release.version} release={release} isLatest={release.version === latest} />
        ))}
      </ol>
    </>
  );
}

function ReleaseEntry({ release, isLatest }: { release: Release; isLatest: boolean }) {
  const unreleased = release.version === UNRELEASED;

  return (
    <li
      id={unreleased ? "yakinda" : `v${release.version}`}
      className="grid scroll-mt-28 gap-6 border-t border-line py-12 first:border-t-0 first:pt-0 lg:grid-cols-[220px_1fr] lg:gap-12"
    >
      <div className="lg:sticky lg:top-28 lg:self-start">
        <div className="flex items-center gap-2.5">
          <h2 className={cn("font-semibold tracking-tight", unreleased ? "text-xl" : "font-mono text-2xl")}>
            {unreleased ? "Yakında" : `v${release.version}`}
          </h2>
          {isLatest && (
            <span className="rounded-full bg-fg px-2 py-0.5 text-[11px] font-semibold text-bg">Güncel</span>
          )}
        </div>
        <p className="mt-1 text-sm text-muted">
          {release.date ? (
            <time dateTime={release.date}>{formatDate(release.date)}</time>
          ) : (
            "Üzerinde çalışılıyor"
          )}
        </p>
      </div>

      <div className={cn("min-w-0", unreleased && "rounded-3xl border border-dashed border-line-strong p-6 sm:p-8")}>
        {release.summary && (
          <p className="mb-8 text-lg leading-relaxed text-pretty">
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
                {section.title}
              </h3>
              <ul className="mt-4 space-y-3">
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
