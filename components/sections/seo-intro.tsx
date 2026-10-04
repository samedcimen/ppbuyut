import Link from "next/link";
import { PlatformBadge } from "@/components/platform-icon";
import { PLATFORM_LIST } from "@/lib/platforms";

/** "What is pp büyütme" copy plus links to every platform's landing page. */
export function SeoIntro() {
  return (
    <section className="mx-auto grid max-w-6xl gap-12 px-4 pb-24 sm:px-6 sm:pb-32 lg:grid-cols-[1fr_1.2fr]">
      <div>
        <p className="text-xs font-semibold tracking-[0.14em] text-subtle uppercase">PP büyütme</p>
        <h2 className="mt-3 text-3xl font-semibold tracking-[-0.035em] text-balance sm:text-4xl">
          PP büyütme nedir?
        </h2>
        <div className="mt-4 space-y-3 leading-relaxed text-muted">
          <p>
            “PP”, sosyal medyada profil fotoğrafının kısaltması. Uygulamalar profil fotoğraflarını küçük ve yuvarlak
            kırpılmış gösterir; ekran görüntüsü alıp yakınlaştırmak da bulanık sonuç verir.
          </p>
          <p>
            PP büyütme, fotoğrafın platformun sunucusunda saklanan en büyük hâlini bulup göstermek demek. ppbüyüt bunu
            Instagram, TikTok, X, Facebook, YouTube ve daha fazlası için ücretsiz yapar: kullanıcı adını ya da profil
            bağlantısını yapıştır, fotoğrafı tam boyutta gör ve tek tıkla indir. Fotoğraflar yapay olarak büyütülmez.
          </p>
        </div>
      </div>
      <div>
        <h3 className="font-semibold tracking-tight">Platforma göre pp büyütme</h3>
        <ul className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
          {PLATFORM_LIST.map((p) => (
            <li key={p.id}>
              <Link
                href={`/pp-buyutme/${p.id}`}
                className="flex items-center gap-3 rounded-xl border border-line bg-surface p-3 text-sm transition-colors hover:border-line-strong"
              >
                <PlatformBadge id={p.id} size="sm" />
                <span className="font-medium">{p.name} pp büyütme</span>
                <span className="ml-auto font-mono text-xs text-subtle">{p.maxSizeLabel}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
