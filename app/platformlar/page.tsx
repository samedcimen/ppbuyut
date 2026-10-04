import type { Metadata } from "next";
import { CtaCard } from "@/components/cta-card";
import { StatusSummary } from "@/components/live-status";
import { PageHero } from "@/components/page-hero";
import { PlatformGrid, STATUS_DOT } from "@/components/sections/platform-grid";
import { STATUS_LABEL, type PlatformStatus } from "@/lib/platforms";
import { STATE_DOT, STATE_HINT, STATE_LABEL, type ServiceState } from "@/lib/service-state";
import { cn } from "@/lib/cn";

export const metadata: Metadata = {
  title: "Platformlar",
  description: "ppbüyüt'ün desteklediği 10 platform ve her birinin sunduğu en büyük profil fotoğrafı boyutu.",
};

const STATUS_INFO: Record<PlatformStatus, string> = {
  stable: "Herkese açık, uzun süredir değişmeyen bir adres ya da sayfa kullanılır. Nadiren bozulur.",
  beta: "Platformun herkese açık sayfasındaki veriler okunur. Platform sayfasını değiştirirse geçici sorunlar olabilir.",
  experimental: "Platform girişsiz erişimi aktif olarak kısıtlıyor. Zaman zaman sonuç alınamayabilir.",
};

const METHODS = [
  { name: "Açık URL", body: "Profil fotoğrafına herkese açık, kalıcı bir adresten ulaşılır." },
  { name: "Sayfa verisi", body: "Herkese açık profil sayfasına gömülü veriden fotoğraf adresi okunur." },
  { name: "Bağlantı önizlemesi", body: "Profil sayfasının, bağlantı paylaşıldığında gösterilen önizleme görselinden okunur." },
  { name: "Dahili endpoint", body: "Platformun kendi web sitesinin kullandığı, belgelenmemiş adresler." },
  { name: "Instagram üzerinden", body: "Threads hesapları Instagram hesabıyla aynı fotoğrafı kullanır; fotoğraf Instagram'dan alınır." },
];

export default function PlatformsPage() {
  return (
    <>
      <PageHero
        eyebrow="Platformlar"
        title="Her platformun bir sınırı var. Biz hep en büyüğünü getiriyoruz."
        description="Aşağıdaki boyutlar, platformun herkese açık olarak sunduğu en büyük versiyondur. Fotoğraflar hiçbir zaman yapay olarak büyütülmez; indirdiğin dosya platformdaki gerçek dosyadır."
      >
        <div className="mt-8">
          <StatusSummary />
        </div>
      </PageHero>

      <section className="mx-auto max-w-6xl px-4 sm:px-6">
        <PlatformGrid />
      </section>

      <section className="mx-auto grid max-w-6xl gap-12 px-4 py-24 sm:px-6 sm:py-32 lg:grid-cols-2">
        <div className="space-y-12">
          <div>
            <h2 className="text-2xl font-semibold tracking-[-0.03em]">Canlı durum</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              Son aramalardan ya da yarım saatte bir yapılan kontrolden hesaplanır.
            </p>
            <ul className="mt-6 space-y-3">
              {(Object.keys(STATE_LABEL) as ServiceState[]).map((s) => (
                <li key={s} className="flex gap-4 rounded-2xl border border-line bg-surface p-5">
                  <span className={cn("mt-1.5 size-2 shrink-0 rounded-full", STATE_DOT[s])} />
                  <div>
                    <p className="font-medium">{STATE_LABEL[s]}</p>
                    <p className="mt-1 text-sm leading-relaxed text-muted">{STATE_HINT[s]}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="text-2xl font-semibold tracking-[-0.03em]">Güvenilirlik</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">Yöntemin ne kadar kolay bozulabileceği.</p>
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
