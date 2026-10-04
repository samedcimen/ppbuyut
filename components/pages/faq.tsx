import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CtaCard } from "@/components/cta-card";
import { PageHero } from "@/components/page-hero";
import { FaqList } from "@/components/sections/faq";
import { FAQ, plainAnswer } from "@/lib/content/faq";
import { pageCopy } from "@/lib/content/pages";
import type { Locale } from "@/lib/i18n";
import { pagePath } from "@/lib/i18n/routes";
import { jsonLd, pageMetadata } from "@/lib/seo";

export function faqMetadata(locale: Locale) {
  const t = pageCopy(locale).faq;
  return pageMetadata({
    locale,
    paths: { tr: pagePath("faq", "tr"), en: pagePath("faq", "en") },
    title: t.title,
    description: t.metaDescription,
  });
}

export function FaqPage({ locale }: { locale: Locale }) {
  const t = pageCopy(locale).faq;
  const items = FAQ[locale];
  const links = (["about", "terms", "platforms"] as const).map((page) => ({
    href: pagePath(page, locale),
    ...t.links[page],
  }));

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd({
          "@type": "FAQPage",
          inLanguage: locale,
          mainEntity: items.map((item) => ({
            "@type": "Question",
            name: item.q,
            acceptedAnswer: { "@type": "Answer", text: plainAnswer(item.a) },
          })),
        })}
      />
      <PageHero eyebrow={t.eyebrow} title={t.title} description={t.description} />

      <section className="mx-auto grid max-w-6xl gap-12 px-4 pb-24 sm:px-6 sm:pb-32 lg:grid-cols-[1.6fr_1fr]">
        <FaqList items={items} />
        <aside className="space-y-3 lg:sticky lg:top-28 lg:self-start">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="group flex items-center justify-between gap-4 rounded-2xl border border-line bg-surface p-5 transition-colors hover:border-line-strong"
            >
              <div>
                <p className="font-medium">{l.title}</p>
                <p className="mt-0.5 text-sm text-muted">{l.body}</p>
              </div>
              <ArrowRight className="size-4 shrink-0 text-subtle transition-transform group-hover:translate-x-0.5 group-hover:text-fg" />
            </Link>
          ))}
        </aside>
      </section>

      <CtaCard locale={locale} />
    </>
  );
}
