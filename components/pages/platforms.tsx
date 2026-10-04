import { CtaCard } from "@/components/cta-card";
import { StatusSummary } from "@/components/live-status";
import { PageHero } from "@/components/page-hero";
import { PlatformGrid, STATUS_DOT } from "@/components/sections/platform-grid";
import { pageCopy } from "@/lib/content/pages";
import { getMessages, type Locale } from "@/lib/i18n";
import { pagePath } from "@/lib/i18n/routes";
import { PLATFORM_LIST, type PlatformStatus } from "@/lib/platforms";
import { pageMetadata } from "@/lib/seo";
import { STATE_DOT, type ServiceState } from "@/lib/service-state";
import { cn } from "@/lib/cn";

export function platformsMetadata(locale: Locale) {
  const t = pageCopy(locale).platforms;
  return pageMetadata({
    locale,
    paths: { tr: pagePath("platforms", "tr"), en: pagePath("platforms", "en") },
    title: t.title,
    description: t.metaDescription(PLATFORM_LIST.length),
  });
}

const STATES: ServiceState[] = ["up", "degraded", "down"];
const RELIABILITY: PlatformStatus[] = ["stable", "beta", "experimental"];
// Only the methods some platform actually uses, in first-use order.
const METHODS = [...new Set(PLATFORM_LIST.map((p) => p.method))];

export function PlatformsPage({ locale }: { locale: Locale }) {
  const t = getMessages(locale);
  const page = pageCopy(locale).platforms;

  return (
    <>
      <PageHero eyebrow={page.eyebrow} title={page.heading} description={page.description}>
        <div className="mt-8">
          <StatusSummary />
        </div>
      </PageHero>

      <section className="mx-auto max-w-6xl px-4 sm:px-6">
        <PlatformGrid locale={locale} />
      </section>

      <section className="mx-auto grid max-w-6xl gap-12 px-4 py-24 sm:px-6 sm:py-32 lg:grid-cols-2">
        <div className="space-y-12">
          <div>
            <h2 className="text-2xl font-semibold tracking-[-0.03em]">{page.live.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">{page.live.body}</p>
            <ul className="mt-6 space-y-3">
              {STATES.map((s) => (
                <li key={s} className="flex gap-4 rounded-2xl border border-line bg-surface p-5">
                  <span className={cn("mt-1.5 size-2 shrink-0 rounded-full", STATE_DOT[s])} />
                  <div>
                    <p className="font-medium">{t.status.labels[s]}</p>
                    <p className="mt-1 text-sm leading-relaxed text-muted">{t.status.hints[s]}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="text-2xl font-semibold tracking-[-0.03em]">{page.reliability.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">{page.reliability.body}</p>
            <ul className="mt-6 space-y-3">
              {RELIABILITY.map((s) => (
                <li key={s} className="flex gap-4 rounded-2xl border border-line bg-surface p-5">
                  <span className={cn("mt-1.5 size-2 shrink-0 rounded-full", STATUS_DOT[s])} />
                  <div>
                    <p className="font-medium">{t.reliability.labels[s]}</p>
                    <p className="mt-1 text-sm leading-relaxed text-muted">{t.reliability.info[s]}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-semibold tracking-[-0.03em]">{page.methods.title}</h2>
          <dl className="mt-6 divide-y divide-line rounded-2xl border border-line bg-surface">
            {METHODS.map((m) => (
              <div key={m} className="p-5">
                <dt className="font-medium">{t.methods.labels[m]}</dt>
                <dd className="mt-1 text-sm leading-relaxed text-muted">{t.methods.info[m]}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <CtaCard locale={locale} />
    </>
  );
}
