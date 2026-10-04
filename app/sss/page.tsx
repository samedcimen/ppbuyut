import Link from "next/link";
import { jsonLd, pageMetadata } from "@/lib/seo";
import { ArrowRight } from "lucide-react";
import { CtaCard } from "@/components/cta-card";
import { PageHero } from "@/components/page-hero";
import { FAQ, FaqList, plainAnswer } from "@/components/sections/faq";

export const metadata = pageMetadata({
  path: "/sss",
  title: "Sık sorulan sorular",
  description: "Gizli hesaplar, fotoğraf boyutları, gizlilik ve kullanım hakları hakkında sık sorulan sorular.",
});

export default function FaqPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd({
          "@type": "FAQPage",
          mainEntity: FAQ.map((item) => ({
            "@type": "Question",
            name: item.q,
            acceptedAnswer: { "@type": "Answer", text: plainAnswer(item.a) },
          })),
        })}
      />
      <PageHero
        eyebrow="SSS"
        title="Sık sorulan sorular"
        description="Aradığın cevap burada yoksa büyük ihtimalle kullanım şartlarında ya da hakkında sayfasında vardır."
      />

      <section className="mx-auto grid max-w-6xl gap-12 px-4 pb-24 sm:px-6 sm:pb-32 lg:grid-cols-[1.6fr_1fr]">
        <FaqList />
        <aside className="space-y-3 lg:sticky lg:top-28 lg:self-start">
          {[
            { href: "/hakkinda", title: "Hakkında", body: "ppbüyüt neden var, nasıl çalışır." },
            { href: "/kullanim-sartlari", title: "Kullanım şartları", body: "Haklar, gizlilik ve sorumluluklar." },
            { href: "/platformlar", title: "Platformlar", body: "Desteklenen platformlar ve boyut sınırları." },
          ].map((l) => (
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

      <CtaCard />
    </>
  );
}
