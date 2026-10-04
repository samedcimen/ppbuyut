import Link from "next/link";
import { PlatformBadge } from "@/components/platform-icon";
import { getMessages, sizeLabel, type Locale } from "@/lib/i18n";
import { landingPath } from "@/lib/i18n/routes";
import { PLATFORM_LIST } from "@/lib/platforms";

/** "What is pp büyütme" copy plus links to every platform's landing page. */
export function SeoIntro({ locale }: { locale: Locale }) {
  const messages = getMessages(locale);
  const t = messages.seoIntro;
  return (
    <section className="mx-auto grid max-w-6xl gap-12 px-4 pb-24 sm:px-6 sm:pb-32 lg:grid-cols-[1fr_1.2fr]">
      <div>
        <p className="text-xs font-semibold tracking-[0.14em] text-subtle uppercase">{t.eyebrow}</p>
        <h2 className="mt-3 text-3xl font-semibold tracking-[-0.035em] text-balance sm:text-4xl">{t.title}</h2>
        <div className="mt-4 space-y-3 leading-relaxed text-muted">
          {t.paragraphs.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>
      </div>
      <div>
        <h3 className="font-semibold tracking-tight">{t.listTitle}</h3>
        <ul className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
          {PLATFORM_LIST.map((p) => (
            <li key={p.id}>
              <Link
                href={landingPath(p.id, locale)}
                className="flex items-center gap-3 rounded-xl border border-line bg-surface p-3 text-sm transition-colors hover:border-line-strong"
              >
                <PlatformBadge id={p.id} size="sm" />
                <span className="font-medium">{t.linkLabel(p.name)}</span>
                <span className="ml-auto font-mono text-xs text-subtle">{sizeLabel(p.maxSizeLabel, messages)}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
