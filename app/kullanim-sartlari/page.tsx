import { PageHero } from "@/components/page-hero";
import { pageMetadata } from "@/lib/seo";
import Link from "next/link";

export const metadata = pageMetadata({
  path: "/kullanim-sartlari",
  title: "Kullanım şartları",
  description: "ppbüyüt kullanım şartları, telif ve kişilik hakları, veri ve gizlilik ilkeleri.",
});

const SECTIONS: { title: string; body: React.ReactNode[] }[] = [
  {
    title: "Hizmetin kapsamı",
    body: [
      "ppbüyüt, sosyal medya platformlarında herkese açık olarak yayınlanan profil fotoğraflarını, platformun sunduğu en büyük boyutta görüntülemeye ve indirmeye yarayan ücretsiz bir araçtır.",
      "Yalnızca herkese açık profil fotoğrafları gösterilir. Gizli hesapların gönderilerine, hikâyelerine veya başka herhangi bir gizli içeriğe erişim sağlanmaz ve bu yönde bir vaatte bulunulmaz.",
    ],
  },
  {
    title: "Telif ve kişilik hakları",
    body: [
      "Görüntülenen ve indirilen fotoğrafların telif hakları ile kişilik hakları sahiplerine aittir. ppbüyüt bu görseller üzerinde herhangi bir hak iddia etmez.",
      "İndirilen görsellerin kullanımından doğacak her türlü sorumluluk kullanıcıya aittir. Görselleri taciz, kimlik taklidi, sahte hesap oluşturma veya yasalara aykırı başka amaçlarla kullanmak yasaktır.",
    ],
  },
  {
    title: "Veri ve gizlilik",
    body: [
      "Arama geçmişin sunucularımızda saklanmaz. “Son aramalar” listesi yalnızca senin tarayıcında tutulur ve dilediğin zaman silinebilir.",
      "Görseller sunucularımızda kalıcı olarak depolanmaz; performans için yalnızca kısa süreli önbelleğe alınabilir. Kötüye kullanımı önlemek amacıyla IP adresi bazında anonim istek sınırlaması uygulanır.",
    ],
  },
  {
    title: "Üçüncü taraf platformlar",
    body: [
      "ppbüyüt; Instagram, TikTok, X, YouTube veya listelenen diğer platformlarla bağlantılı değildir, bu platformlar tarafından onaylanmamıştır.",
      "Bazı platformlardan veri alınması bu platformların kendi kullanım şartlarına tabi olabilir. Platformlar erişimi değiştirebilir veya kısıtlayabilir; bu nedenle hizmetin kesintisiz çalışacağı garanti edilmez.",
    ],
  },
  {
    title: "Kaldırma talepleri",
    body: [
      "Kendi profil fotoğrafının bu araç üzerinden görüntülenmesini istemiyorsan, platformdaki profil fotoğrafını kaldırman veya değiştirmen yeterlidir; önbellekteki kopyalar kısa süre içinde kendiliğinden silinir.",
      <>
        Kaldırma talepleri ve diğer bildirimler için{" "}
        <Link href="/hakkinda" className="font-medium text-fg underline decoration-line-strong underline-offset-4 hover:decoration-fg">
          Hakkında
        </Link>{" "}
        sayfasındaki iletişim bilgilerini kullanabilirsin.
      </>,
    ],
  },
  {
    title: "Değişiklikler",
    body: [
      "Bu şartlar zaman zaman güncellenebilir. Hizmeti kullanmaya devam etmen, güncel şartları kabul ettiğin anlamına gelir.",
    ],
  },
];

export default function TermsPage() {
  return (
    <>
      <PageHero
        eyebrow="Yasal"
        title="Kullanım şartları"
        description={
          <>
            Son güncelleme: <time dateTime="2026-10-04">4 Ekim 2026</time>
          </>
        }
      />

      <div className="mx-auto grid max-w-6xl gap-12 px-4 pb-24 sm:px-6 sm:pb-32 lg:grid-cols-[220px_1fr]">
        <nav aria-label="İçindekiler" className="hidden lg:sticky lg:top-28 lg:block lg:self-start">
          <p className="text-xs font-semibold tracking-[0.14em] text-subtle uppercase">İçindekiler</p>
          <ol className="mt-4 space-y-2 text-sm">
            {SECTIONS.map((section, i) => (
              <li key={section.title}>
                <a href={`#madde-${i + 1}`} className="text-muted transition-colors hover:text-fg">
                  {section.title}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <ol className="max-w-2xl space-y-10">
          {SECTIONS.map((section, i) => (
            <li key={section.title} id={`madde-${i + 1}`} className="grid scroll-mt-28 gap-3 sm:grid-cols-[3rem_1fr]">
              <span className="font-mono text-sm text-subtle sm:pt-1">{String(i + 1).padStart(2, "0")}</span>
              <div>
                <h2 className="text-lg font-semibold tracking-tight">{section.title}</h2>
                <div className="mt-3 space-y-3 text-[15px] leading-relaxed text-muted">
                  {section.body.map((p, j) => (
                    <p key={j}>{p}</p>
                  ))}
                </div>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </>
  );
}
