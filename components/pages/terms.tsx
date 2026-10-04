import { InlineMarkdown } from "@/components/inline-markdown";
import { PageHero } from "@/components/page-hero";
import { pageCopy } from "@/lib/content/pages";
import type { Locale } from "@/lib/i18n";
import { pagePath } from "@/lib/i18n/routes";
import { pageMetadata } from "@/lib/seo";

export function termsMetadata(locale: Locale) {
  const t = pageCopy(locale).terms;
  return pageMetadata({
    locale,
    paths: { tr: pagePath("terms", "tr"), en: pagePath("terms", "en") },
    title: t.title,
    description: t.metaDescription,
  });
}

export function TermsPage({ locale }: { locale: Locale }) {
  const t = pageCopy(locale).terms;

  return (
    <>
      <PageHero
        eyebrow={t.eyebrow}
        title={t.title}
        description={
          <>
            {t.updated} <time dateTime="2026-10-04">{t.updatedDate}</time>
          </>
        }
      />

      <div className="mx-auto grid max-w-6xl gap-12 px-4 pb-24 sm:px-6 sm:pb-32 lg:grid-cols-[220px_1fr]">
        <nav aria-label={t.toc} className="hidden lg:sticky lg:top-28 lg:block lg:self-start">
          <p className="text-xs font-semibold tracking-[0.14em] text-subtle uppercase">{t.toc}</p>
          <ol className="mt-4 space-y-2 text-sm">
            {t.sections.map((section, i) => (
              <li key={section.title}>
                <a href={`#${t.anchor}-${i + 1}`} className="text-muted transition-colors hover:text-fg">
                  {section.title}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <ol className="max-w-2xl space-y-10">
          {t.sections.map((section, i) => (
            <li key={section.title} id={`${t.anchor}-${i + 1}`} className="grid scroll-mt-28 gap-3 sm:grid-cols-[3rem_1fr]">
              <span className="font-mono text-sm text-subtle sm:pt-1">{String(i + 1).padStart(2, "0")}</span>
              <div>
                <h2 className="text-lg font-semibold tracking-tight">{section.title}</h2>
                <div className="mt-3 space-y-3 text-[15px] leading-relaxed text-muted">
                  {section.body.map((p) => (
                    <p key={p}>
                      <InlineMarkdown text={p} />
                    </p>
                  ))}
                </div>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </>
  );
}
