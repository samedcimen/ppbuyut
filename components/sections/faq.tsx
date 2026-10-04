import Link from "next/link";
import { Plus } from "lucide-react";

const linkClass = "font-medium text-fg underline decoration-line-strong underline-offset-4 hover:decoration-fg";

const FAQ: { q: string; a: React.ReactNode }[] = [
  {
    q: "Gizli hesapların fotoğraflarını görebilir miyim?",
    a: "Profil fotoğrafı, gizli hesaplarda bile herkese açıktır; biz yalnızca bunu gösteririz. Gizli gönderilere, hikâyelere ya da başka içeriklere erişim sağlamıyoruz. Bunu vaat eden siteler dolandırıcılıktır.",
  },
  {
    q: "Neden bazı fotoğraflar küçük?",
    a: (
      <>
        Her platform farklı bir üst sınır uygular. Örneğin Pinterest en fazla 280 px, YouTube ise 800 px sunar.
        Fotoğrafı yapay olarak büyütmüyoruz; gördüğün, platformun sunduğu gerçek dosyadır. Tüm sınırları{" "}
        <Link href="/platformlar" className={linkClass}>
          platformlar
        </Link>{" "}
        sayfasında görebilirsin.
      </>
    ),
  },
  {
    q: "Ücretli mi? Üye olmam gerekiyor mu?",
    a: "Hayır. ppbüyüt ücretsizdir, üyelik istemez ve reklam göstermez.",
  },
  {
    q: "Aramalarımı kaydediyor musunuz?",
    a: "Hayır. “Son aramalar” listesi yalnızca senin tarayıcında tutulur ve istediğin an silinebilir. Sunucu tarafında görseller kalıcı olarak saklanmaz, yalnızca kısa süreli önbelleğe alınır.",
  },
  {
    q: "Kullanıcı adı mı yazmalıyım, bağlantı mı?",
    a: "İkisi de olur. Bağlantı yapıştırırsan platformu otomatik tanırız ve arama hemen başlar. Yalnızca kullanıcı adı yazarsan, arama kutusunun altından platformu seçmen yeterli.",
  },
  {
    q: "İndirdiğim fotoğrafı istediğim gibi kullanabilir miyim?",
    a: (
      <>
        Fotoğrafların telif ve kişilik hakları sahiplerine aittir; kullanım sorumluluğu sana aittir. Ayrıntılar için{" "}
        <Link href="/kullanim-sartlari" className={linkClass}>
          kullanım şartlarına
        </Link>{" "}
        göz at.
      </>
    ),
  },
  {
    q: "Bir platform çalışmıyor, neden?",
    a: "Instagram, TikTok gibi bazı platformların resmi bir API’si yok; sayfa yapıları değiştiğinde ya da istekleri sınırladıklarında geçici sorunlar yaşanabilir. Bu platformlar “Beta” veya “Deneysel” olarak işaretlenmiştir.",
  },
  {
    q: "Snapchat’te neden fotoğraf yerine Bitmoji görüyorum?",
    a: "Kişisel Snapchat hesaplarında çoğunlukla gerçek bir profil fotoğrafı bulunmaz; herkese açık görsel olarak yalnızca Bitmoji yayınlanır.",
  },
];

export function FaqList() {
  return (
    <div className="divide-y divide-line border-y border-line">
      {FAQ.map((item) => (
        <details key={item.q} className="group">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 text-left font-medium tracking-tight [&::-webkit-details-marker]:hidden">
            {item.q}
            <span className="grid size-7 shrink-0 place-items-center rounded-full border border-line text-muted transition-all duration-300 group-open:rotate-45 group-open:bg-fg group-open:text-bg">
              <Plus className="size-3.5" />
            </span>
          </summary>
          <div className="pr-12 pb-6 text-[15px] leading-relaxed text-muted">{item.a}</div>
        </details>
      ))}
    </div>
  );
}
