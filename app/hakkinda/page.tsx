import { RevealEmail } from "@/components/reveal-email";
import { pageMetadata } from "@/lib/seo";
import { ArrowUpRight, EyeOff, Maximize, ShieldCheck, Sparkles, UserX, Zap } from "lucide-react";
import { CtaCard } from "@/components/cta-card";
import { PageHero } from "@/components/page-hero";
import { PlatformIcon } from "@/components/platform-icon";
import { site } from "@/lib/site";

export const metadata = pageMetadata({
  path: "/hakkinda",
  title: "Hakkında",
  description: "ppbüyüt nedir, nasıl çalışır ve hangi ilkelerle geliştirilir: reklamsız, kayıtsız, gizliliğe saygılı.",
});

const PRINCIPLES = [
  { icon: Sparkles, title: "Reklamsız", body: "Pop-up yok, sahte indirme butonu yok, bekleme sayacı yok. Sadece arama kutusu." },
  { icon: UserX, title: "Kayıt yok", body: "Üye olmadan, e-posta vermeden kullanırsın. Hesap açmana gerek yok." },
  { icon: EyeOff, title: "Önce gizlilik", body: "Arama geçmişin sunucuda tutulmaz. Son aramalar yalnızca senin tarayıcında kalır." },
  { icon: Maximize, title: "Dürüst boyut", body: "Yapay büyütme yapmayız. Gördüğün çözünürlük, platformdaki gerçek dosyanın çözünürlüğüdür." },
  { icon: ShieldCheck, title: "Sadece herkese açık", body: "Gizli içeriklere erişim vaat etmeyiz. Yalnızca zaten herkese açık olan profil fotoğrafını gösteririz." },
  { icon: Zap, title: "Hızlı", body: "Bağlantıyı yapıştırdığın an platform tanınır ve arama başlar. Tek tık, tek sonuç." },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="Hakkında"
        title="Küçük bir sorun için yapılmış, sade bir araç."
        description="Sosyal medya platformları profil fotoğraflarını küçük ve kırpılmış gösterir. Fotoğrafa yakından bakmak için ekran görüntüsü alıp yakınlaştırmak bulanık sonuç verir. ppbüyüt, platformun sunucusunda zaten var olan en büyük versiyonu bulup sana getirir."
      />

      <section className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid gap-10 rounded-3xl border border-line bg-surface p-8 shadow-soft sm:p-10 lg:grid-cols-2">
          <div>
            <h2 className="text-2xl font-semibold tracking-[-0.03em]">Nasıl çalışıyor?</h2>
            <p className="mt-3 leading-relaxed text-muted">
              Platformlar aynı fotoğrafın farklı boyutlarını saklar ve sayfada genellikle en küçüğünü kullanır. Fotoğraf
              adresindeki boyut bilgisi değiştirildiğinde büyük versiyona ulaşılabilir.
            </p>
            <p className="mt-3 leading-relaxed text-muted">
              ppbüyüt bağlantıdan platformu tanır, mümkün olduğunda platformun resmi arayüzünü kullanır ve fotoğraf
              adresini platformun izin verdiği en büyük boyuta çevirir.
            </p>
          </div>
          <div className="space-y-2 self-center font-mono text-[13px]">
            {[
              ["X", "…/abc_normal.jpg", "…/abc.jpg"],
              ["YouTube", "…=s88-c-k", "…=s800-c-k"],
              ["GitHub", "….png?size=40", "….png?size=460"],
            ].map(([name, from, to]) => (
              <div key={name} className="flex items-center gap-3 rounded-xl bg-surface-2 px-4 py-3">
                <span className="w-16 shrink-0 font-sans text-xs font-medium text-muted">{name}</span>
                <span className="truncate text-subtle line-through">{from}</span>
                <span className="text-subtle">→</span>
                <span className="truncate text-success">{to}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-24 sm:px-6 sm:py-32">
        <h2 className="text-3xl font-semibold tracking-[-0.035em]">İlkelerimiz</h2>
        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {PRINCIPLES.map((p) => (
            <li key={p.title} className="rounded-3xl border border-line bg-surface p-6">
              <span className="grid size-10 place-items-center rounded-xl bg-surface-2 ring-1 ring-line ring-inset">
                <p.icon className="size-5" />
              </span>
              <h3 className="mt-5 font-semibold tracking-tight">{p.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted">{p.body}</p>
            </li>
          ))}
        </ul>

        <h2 className="mt-24 text-3xl font-semibold tracking-[-0.035em]">Geliştirici</h2>
        <div className="mt-8 flex flex-col gap-6 rounded-3xl border border-line bg-surface p-6 sm:flex-row sm:items-center sm:p-8">
          {/* eslint-disable-next-line @next/next/no-img-element -- the product itself: a GitHub avatar at full size */}
          <img
            src={`https://github.com/${site.owner.github}.png?size=160`}
            alt={`${site.owner.name} profil fotoğrafı`}
            width={80}
            height={80}
            className="size-20 shrink-0 rounded-2xl bg-surface-2 ring-1 ring-line"
          />
          <div className="flex-1">
            <p className="text-lg font-semibold tracking-tight">{site.owner.name}</p>
            <p className="mt-1 max-w-xl text-sm leading-relaxed text-muted">
              ppbüyüt&apos;ü {site.owner.name} geliştiriyor. Öneri, hata bildirimi ya da kaldırma talepleri için
              e-posta veya GitHub üzerinden ulaşabilirsin.
            </p>
          </div>
          <div className="flex shrink-0 flex-wrap gap-2">
            <RevealEmail encoded={site.owner.emailEncoded} />
            <a
              href={site.owner.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-10 items-center gap-2 rounded-xl border border-line px-4 text-sm font-medium transition-colors hover:bg-surface-2"
            >
              <PlatformIcon id="github" />
              GitHub
              <ArrowUpRight className="-ml-0.5 size-3.5 text-subtle" />
            </a>
          </div>
        </div>

        <p className="mt-12 max-w-2xl text-sm leading-relaxed text-subtle">
          ppbüyüt bağımsız bir projedir; Instagram, TikTok, X, YouTube veya listelenen diğer platformlarla bağlantılı
          değildir ve bu platformlar tarafından onaylanmamıştır.
        </p>
      </section>

      <CtaCard />
    </>
  );
}
