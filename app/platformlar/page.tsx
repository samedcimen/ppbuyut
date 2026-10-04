import type { Metadata } from "next";
import { CtaCard } from "@/components/cta-card";
import { PageHero } from "@/components/page-hero";
import { PlatformGrid, STATUS_DOT } from "@/components/sections/platform-grid";
import { STATUS_LABEL, type PlatformStatus } from "@/lib/platforms";
import { cn } from "@/lib/cn";

export const metadata: Metadata = {
  title: "Platformlar",
  description: "ppbüyüt'ün desteklediği 10 platform ve her birinin sunduğu en büyük profil fotoğrafı boyutu.",
};

const STATUS_INFO: Record<PlatformStatus, string> = {
  stable: "Resmi API ya da herkese açık, değişmeyen bir adres kullanılır. Neredeyse hiç bozulmaz.",
  beta: "Platformun herkese açık sayfasındaki veriler okunur. Platform sayfasını değiştirirse geçici sorunlar olabilir.",
  experimental: "Platform girişsiz erişimi aktif olarak kısıtlıyor. Zaman zaman sonuç alınamayabilir.",
};

const METHODS = [
  { name: "Resmi API", body: "Platformun geliştiricilere sunduğu resmi arayüz. En güvenilir yöntem." },
  { name: "Açık URL / Açık API", body: "Profil fotoğrafına herkese açık, kalıcı bir adresten ulaşılır." },
  { name: "Sayfa verisi", body: "Herkese açık profil sayfasına gömülü veriden fotoğraf adresi okunur." },
  { name: "Dahili endpoint", body: "Platformun kendi web sitesinin kullandığı, belgelenmemiş adresler." },
];

export default function PlatformsPage() {
  return (
    <>
      <PageHero
        eyebrow="Platformlar"
        title="Her platformun bir sınırı var. Biz hep en büyüğünü getiriyoruz."
        description="Aşağıdaki boyutlar, platformun herkese açık olarak sunduğu en büyük versiyondur. Fotoğraflar hiçbir zaman yapay olarak büyütülmez; indirdiğin dosya platformdaki gerçek dosyadır."
      />

      <section className="mx-auto max-w-6xl px-4 sm:px-6">
        <PlatformGrid />
      </section>

      <section className="mx-auto grid max-w-6xl gap-12 px-4 py-24 sm:px-6 sm:py-32 lg:grid-cols-2">
        <div>
          <h2 className="text-2xl font-semibold tracking-[-0.03em]">Durumlar ne anlama geliyor?</h2>
          <ul className="mt-6 space-y-3">
            {(Object.keys(STATUS_LABEL) as PlatformStatus[]).map((s) => (
              <li key={s} className="flex gap-4 rounded-2xl border border-line bg-surface p-5">
                <span className={cn("mt-1.5 size-2 shrink-0 rounded-full", STATUS_DOT[s])} />
                <div>
                  <p className="font-medium">{STATUS_LABEL[s]}</p>
                  <p className="mt-1 text-sm leading-relaxed text-muted">{STATUS_INFO[s]}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="text-2xl font-semibold tracking-[-0.03em]">Yöntemler</h2>
          <dl className="mt-6 divide-y divide-line rounded-2xl border border-line bg-surface">
            {METHODS.map((m) => (
              <div key={m.name} className="p-5">
                <dt className="font-medium">{m.name}</dt>
                <dd className="mt-1 text-sm leading-relaxed text-muted">{m.body}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <CtaCard />
    </>
  );
}
