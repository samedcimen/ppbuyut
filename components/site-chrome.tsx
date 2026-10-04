import { SiteFooter } from "./site-footer";
import { SiteHeader } from "./site-header";
import type { Locale } from "@/lib/i18n";
import { LocaleProvider } from "@/lib/i18n/client";

/** Header, page and footer in one language; used by each language's layout. */
export function SiteChrome({ locale, children }: { locale: Locale; children: React.ReactNode }) {
  return (
    <LocaleProvider locale={locale}>
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter locale={locale} />
    </LocaleProvider>
  );
}
