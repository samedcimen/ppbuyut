import Link from "next/link";
import { notFound } from "next/navigation";
import { PlatformBadge } from "@/components/platform-icon";
import { FaqList, plainAnswer } from "@/components/sections/faq";
import { Viewer } from "@/components/viewer/viewer";
import { landingFor } from "@/lib/landing";
import { PLATFORMS, PLATFORM_IDS, PLATFORM_LIST, isPlatformId } from "@/lib/platforms";
import { jsonLd, pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";

// One landing page per platform for the searches people type
// ("instagram pp büyütme"), each with the search box preset to that platform.

export const dynamicParams = false;

export function generateStaticParams() {
  return PLATFORM_IDS.map((platform) => ({ platform }));
}

export async function generateMetadata(props: PageProps<"/pp-buyutme/[platform]">) {
  const { platform } = await props.params;
  if (!isPlatformId(platform)) return {};
  const page = landingFor(platform);
  return pageMetadata({ path: page.path, title: page.title, description: page.description });
}

export default async function PlatformLandingPage(props: PageProps<"/pp-buyutme/[platform]">) {
  const { platform } = await props.params;
  if (!isPlatformId(platform)) notFound();
  const page = landingFor(platform);
  const name = PLATFORMS[platform].name;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd({
          "@graph": [
            {
              "@type": "FAQPage",
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
                { "@type": "ListItem", position: 2, name: `${name} pp büyütme`, item: `${site.url}${page.path}` },
              ],
            },
          ],
        })}
      />

      <div className="pb-16">
        <Viewer
          presetPlatform={platform}
          heading={page.heading}
          subtitle={`${name} kullanıcı adını ya da profil bağlantısını yapıştır; profil fotoğrafı en büyük boyutta gelsin.`}
        />
      </div>

      <section className="mx-auto grid max-w-6xl gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2">
        <div>
          <h2 className="text-3xl font-semibold tracking-[-0.035em] text-balance">
            {name} profil fotoğrafı nasıl büyütülür?
          </h2>
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
        <h2 className="text-3xl font-semibold tracking-[-0.035em] text-balance">{name} pp büyütme hakkında</h2>
        <FaqList items={page.faq} />
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-24 sm:px-6 sm:pb-32">
        <h2 className="text-xl font-semibold tracking-tight">Diğer platformlar</h2>
        <ul className="mt-5 flex flex-wrap gap-2">
          {PLATFORM_LIST.filter((p) => p.id !== platform).map((p) => (
            <li key={p.id}>
              <Link
                href={`/pp-buyutme/${p.id}`}
                className="flex items-center gap-2 rounded-full border border-line bg-surface py-1 pr-3.5 pl-1 text-sm transition-colors hover:border-line-strong"
              >
                <PlatformBadge id={p.id} size="sm" className="rounded-full" />
                {p.name} pp büyütme
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
