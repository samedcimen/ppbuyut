import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getMessages, type Locale } from "@/lib/i18n";
import { pagePath } from "@/lib/i18n/routes";

/** Closing call-to-action that sends visitors back to the search. */
export function CtaCard({ locale, title, body }: { locale: Locale; title?: string; body?: string }) {
  const t = getMessages(locale);
  return (
    <div className="mx-auto max-w-6xl px-4 pb-24 sm:px-6 sm:pb-32">
      <div className="flex flex-col items-start justify-between gap-6 rounded-3xl border border-line bg-surface p-8 shadow-soft sm:flex-row sm:items-center sm:p-10">
        <div>
          <h2 className="text-2xl font-semibold tracking-[-0.03em]">{title ?? t.cta.title}</h2>
          <p className="mt-1.5 text-muted">{body ?? t.cta.body}</p>
        </div>
        <Link
          href={pagePath("home", locale)}
          className="flex h-11 shrink-0 items-center gap-2 rounded-xl bg-fg px-5 text-sm font-semibold text-bg transition-all hover:opacity-90 active:scale-[0.98]"
        >
          {t.cta.button}
          <ArrowRight className="size-4" />
        </Link>
      </div>
    </div>
  );
}
