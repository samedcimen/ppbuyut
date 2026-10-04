import { Plus } from "lucide-react";
import { InlineMarkdown } from "@/components/inline-markdown";

// Answers use the inline Markdown of InlineMarkdown (**bold**, [links](url)),
// so the same text can be shown on the page and given to search engines.
export const FAQ: { q: string; a: string }[] = [
  {
    q: "Gizli hesapların fotoğraflarını görebilir miyim?",
    a: "Profil fotoğrafı, gizli hesaplarda bile herkese açıktır; biz yalnızca bunu gösteririz. Gizli gönderilere, hikâyelere ya da başka içeriklere erişim sağlamıyoruz. Bunu vaat eden siteler dolandırıcılıktır.",
  },
  {
    q: "Neden bazı fotoğraflar küçük?",
    a: "Her platform farklı bir üst sınır uygular. Örneğin Pinterest en fazla 280 px verirken YouTube ve X orijinal dosyayı verir. Fotoğrafı yapay olarak büyütmüyoruz; gördüğün, platformun sunduğu gerçek dosyadır. Tüm sınırları [platformlar](/platformlar) sayfasında görebilirsin.",
  },
  {
    q: "Instagram fotoğrafları neden bazen çok küçük geliyor?",
    a: "Instagram, giriş yapılmadan yapılan isteklere sık sık sınır koyuyor. Sınır yokken 320 px, sınır varken yalnızca ~100 px alınabiliyor. Biraz sonra tekrar denediğinde büyük hâli gelebilir. Giriş yapılmış hesap kullanmıyoruz; bu Instagram'ın kurallarına aykırı.",
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
    a: "Fotoğrafların telif ve kişilik hakları sahiplerine aittir; kullanım sorumluluğu sana aittir. Ayrıntılar için [kullanım şartlarına](/kullanim-sartlari) göz at.",
  },
  {
    q: "Bir platform çalışmıyor, neden?",
    a: "Fotoğraflar platformların herkese açık sayfalarından okunur. Bir platform sayfasını değiştirdiğinde ya da istekleri sınırladığında geçici sorunlar olabilir. Her platformun anlık durumunu [platformlar](/platformlar) sayfasında görebilirsin.",
  },
  {
    q: "Snapchat’te neden fotoğraf yerine Bitmoji görüyorum?",
    a: "Kişisel Snapchat hesaplarında çoğunlukla gerçek bir profil fotoğrafı bulunmaz; herkese açık görsel olarak yalnızca Bitmoji yayınlanır.",
  },
];

/** The answer without Markdown, for structured data. */
export const plainAnswer = (a: string) => a.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1").replace(/\*\*([^*]+)\*\*/g, "$1");

export function FaqList({ items = FAQ }: { items?: { q: string; a: string }[] }) {
  return (
    <div className="divide-y divide-line border-y border-line">
      {items.map((item) => (
        <details key={item.q} className="group">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 text-left font-medium tracking-tight [&::-webkit-details-marker]:hidden">
            {item.q}
            <span className="grid size-7 shrink-0 place-items-center rounded-full border border-line text-muted transition-all duration-300 group-open:rotate-45 group-open:bg-fg group-open:text-bg">
              <Plus className="size-3.5" />
            </span>
          </summary>
          <div className="pr-12 pb-6 text-[15px] leading-relaxed text-muted">
            <InlineMarkdown text={item.a} />
          </div>
        </details>
      ))}
    </div>
  );
}
