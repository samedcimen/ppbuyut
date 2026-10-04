import { Bookmarklet } from "@/components/sections/bookmarklet";
import { HowItWorks } from "@/components/sections/how-it-works";
import { InstallApp } from "@/components/sections/install-app";
import { SeoIntro } from "@/components/sections/seo-intro";
import { Viewer } from "@/components/viewer/viewer";
import { getMessages, type Locale } from "@/lib/i18n";
import { pagePath } from "@/lib/i18n/routes";
import { jsonLd } from "@/lib/seo";
import { site } from "@/lib/site";

export function HomePage({ locale }: { locale: Locale }) {
  const t = getMessages(locale);
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd({
          "@type": "WebApplication",
          name: site.name,
          url: locale === "tr" ? site.url : `${site.url}${pagePath("home", locale)}`,
          description: t.site.description,
          applicationCategory: "MultimediaApplication",
          operatingSystem: "Any",
          inLanguage: locale,
          isAccessibleForFree: true,
          offers: { "@type": "Offer", price: "0", priceCurrency: locale === "tr" ? "TRY" : "USD" },
          author: { "@type": "Person", name: site.owner.name, url: site.owner.url },
        })}
      />
      <div className="min-h-[calc(100svh-4.5rem)] pb-16">
        <Viewer />
      </div>
      <HowItWorks locale={locale} />
      <Bookmarklet />
      <InstallApp />
      <SeoIntro locale={locale} />
    </>
  );
}
