import Link from "next/link";
import { PlatformBadge } from "@/components/platform-icon";
import { FaqList } from "@/components/sections/faq";
import { Viewer } from "@/components/viewer/viewer";
import { plainAnswer } from "@/lib/content/faq";
import { landingFor } from "@/lib/content/landing";
import type { Locale } from "@/lib/i18n";
import { landingPath } from "@/lib/i18n/routes";
import { PLATFORMS, PLATFORM_LIST, type PlatformId } from "@/lib/platforms";
import { jsonLd, pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";

// One landing page per platform for the searches people type ("instagram pp
// büyütme", "instagram profile picture viewer"), each with the search box
// preset to that platform.

export function landingMetadata(platform: PlatformId, locale: Locale) {
  const page = landingFor(platform, locale);
  return pageMetadata({
    locale,
    paths: { tr: landingPath(platform, "tr"), en: landingPath(platform, "en") },
    title: page.title,
    description: page.description,
  });
}

export function LandingPage({ platform, locale }: { platform: PlatformId; locale: Locale }) {
  const page = landingFor(platform, locale);
  const name = PLATFORMS[platform].name;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd({
          "@graph": [
            {
              "@type": "FAQPage",
              inLanguage: locale,
              mainEntity: page.faq.map((item) => ({
                "@type": "Question",
                name: item.q,
                acceptedAnswer: { "@type": "Answer", text: plainAnswer(item.a) },
              })),
            },
            {
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: site.name, item: site.url },
                { "@type": "ListItem", position: 2, name: page.linkLabel(name), item: `${site.url}${page.path}` },
              ],
            },
          ],
        })}
      />

      <div className="pb-16">
        <Viewer presetPlatform={platform} heading={page.heading} subtitle={page.subtitle} />
      </div>

      <section className="mx-auto grid max-w-6xl gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2">
        <div>
          <h2 className="text-3xl font-semibold tracking-[-0.035em] text-balance">{page.introTitle}</h2>
          <p className="mt-4 leading-relaxed text-muted">{page.intro}</p>
        </div>
        <ol className="space-y-3">
          {page.linkSteps.map((step, i) => (
            <li key={step} className="flex gap-4 rounded-2xl border border-line bg-surface p-5">
              <span className="grid size-7 shrink-0 place-items-center rounded-full bg-surface-2 font-mono text-sm ring-1 ring-line">
                {i + 1}
              </span>
              <span className="leading-relaxed text-muted">{step}</span>
            </li>
          ))}
        </ol>
      </section>

      <section className="mx-auto grid max-w-6xl gap-12 px-4 pb-20 sm:px-6 lg:grid-cols-[1fr_1.4fr]">
        <h2 className="text-3xl font-semibold tracking-[-0.035em] text-balance">{page.faqTitle}</h2>
        <FaqList items={page.faq} />
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-24 sm:px-6 sm:pb-32">
        <h2 className="text-xl font-semibold tracking-tight">{page.othersTitle}</h2>
        <ul className="mt-5 flex flex-wrap gap-2">
          {PLATFORM_LIST.filter((p) => p.id !== platform).map((p) => (
            <li key={p.id}>
              <Link
                href={landingPath(p.id, locale)}
                className="flex items-center gap-2 rounded-full border border-line bg-surface py-1 pr-3.5 pl-1 text-sm transition-colors hover:border-line-strong"
              >
                <PlatformBadge id={p.id} size="sm" className="rounded-full" />
                {page.linkLabel(p.name)}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
