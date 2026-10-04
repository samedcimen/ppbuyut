import { ArrowUpRight, EyeOff, Maximize, ShieldCheck, Sparkles, UserX, Zap } from "lucide-react";
import { CtaCard } from "@/components/cta-card";
import { PageHero } from "@/components/page-hero";
import { PlatformIcon } from "@/components/platform-icon";
import { RevealEmail } from "@/components/reveal-email";
import { pageCopy } from "@/lib/content/pages";
import type { Locale } from "@/lib/i18n";
import { pagePath } from "@/lib/i18n/routes";
import { pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";

export function aboutMetadata(locale: Locale) {
  const t = pageCopy(locale).about;
  return pageMetadata({
    locale,
    paths: { tr: pagePath("about", "tr"), en: pagePath("about", "en") },
    title: t.title,
    description: t.metaDescription,
  });
}

const PRINCIPLE_ICONS = {
  noAds: Sparkles,
  noSignup: UserX,
  privacy: EyeOff,
  honest: Maximize,
  publicOnly: ShieldCheck,
  fast: Zap,
} as const;

const EXAMPLES = [
  ["X", "…/abc_normal.jpg", "…/abc.jpg"],
  ["YouTube", "…=s88-c-k", "…=s800-c-k"],
  ["GitHub", "….png?size=40", "….png?size=460"],
];

export function AboutPage({ locale }: { locale: Locale }) {
  const t = pageCopy(locale).about;

  return (
    <>
      <PageHero eyebrow={t.eyebrow} title={t.heading} description={t.description} />

      <section className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid gap-10 rounded-3xl border border-line bg-surface p-8 shadow-soft sm:p-10 lg:grid-cols-2">
          <div>
            <h2 className="text-2xl font-semibold tracking-[-0.03em]">{t.howTitle}</h2>
            {t.how.map((p) => (
              <p key={p} className="mt-3 leading-relaxed text-muted">
                {p}
              </p>
            ))}
          </div>
          <div className="space-y-2 self-center font-mono text-[13px]">
            {EXAMPLES.map(([name, from, to]) => (
              <div key={name} className="flex items-center gap-3 rounded-xl bg-surface-2 px-4 py-3">
                <span className="w-16 shrink-0 font-sans text-xs font-medium text-muted">{name}</span>
                <span className="truncate text-subtle line-through">{from}</span>
                <span className="text-subtle">→</span>
                <span className="truncate text-success">{to}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-24 sm:px-6 sm:py-32">
        <h2 className="text-3xl font-semibold tracking-[-0.035em]">{t.principlesTitle}</h2>
        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {(Object.keys(PRINCIPLE_ICONS) as (keyof typeof PRINCIPLE_ICONS)[]).map((key) => {
            const Icon = PRINCIPLE_ICONS[key];
            const p = t.principles[key];
            return (
              <li key={key} className="rounded-3xl border border-line bg-surface p-6">
                <span className="grid size-10 place-items-center rounded-xl bg-surface-2 ring-1 ring-line ring-inset">
                  <Icon className="size-5" />
                </span>
                <h3 className="mt-5 font-semibold tracking-tight">{p.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted">{p.body}</p>
              </li>
            );
          })}
        </ul>

        <h2 className="mt-24 text-3xl font-semibold tracking-[-0.035em]">{t.developerTitle}</h2>
        <div className="mt-8 flex flex-col gap-6 rounded-3xl border border-line bg-surface p-6 sm:flex-row sm:items-center sm:p-8">
          {/* eslint-disable-next-line @next/next/no-img-element -- the product itself: a GitHub avatar at full size */}
          <img
            src={`https://github.com/${site.owner.github}.png?size=160`}
            alt={t.avatarAlt(site.owner.name)}
            width={80}
            height={80}
            className="size-20 shrink-0 rounded-2xl bg-surface-2 ring-1 ring-line"
          />
          <div className="flex-1">
            <p className="text-lg font-semibold tracking-tight">{site.owner.name}</p>
            <p className="mt-1 max-w-xl text-sm leading-relaxed text-muted">{t.developer(site.owner.name)}</p>
          </div>
          <div className="flex shrink-0 flex-wrap gap-2">
            <RevealEmail encoded={site.owner.emailEncoded} />
            <a
              href={site.owner.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-10 items-center gap-2 rounded-xl border border-line px-4 text-sm font-medium transition-colors hover:bg-surface-2"
            >
              <PlatformIcon id="github" />
              GitHub
              <ArrowUpRight className="-ml-0.5 size-3.5 text-subtle" />
            </a>
          </div>
        </div>

        <p className="mt-12 max-w-2xl text-sm leading-relaxed text-subtle">{t.disclaimer}</p>
      </section>

      <CtaCard locale={locale} />
    </>
  );
}
