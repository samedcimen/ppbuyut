import { Bookmarklet } from "@/components/sections/bookmarklet";
import { HowItWorks } from "@/components/sections/how-it-works";
import { SeoIntro } from "@/components/sections/seo-intro";
import { Viewer } from "@/components/viewer/viewer";
import { jsonLd } from "@/lib/seo";
import { site } from "@/lib/site";

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd({
          "@type": "WebApplication",
          name: site.name,
          url: site.url,
          description: site.description,
          applicationCategory: "MultimediaApplication",
          operatingSystem: "Any",
          inLanguage: "tr",
          isAccessibleForFree: true,
          offers: { "@type": "Offer", price: "0", priceCurrency: "TRY" },
          author: { "@type": "Person", name: site.owner.name, url: site.owner.url },
        })}
      />
      <div className="min-h-[calc(100svh-4.5rem)] pb-16">
        <Viewer />
      </div>
      <HowItWorks />
      <Bookmarklet />
      <SeoIntro />
    </>
  );
}
