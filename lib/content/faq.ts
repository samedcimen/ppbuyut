import type { Locale } from "../i18n";

// Answers use the inline Markdown of InlineMarkdown (**bold**, [links](url)),
// so the same text can be shown on the page and given to search engines.
export type FaqItem = { q: string; a: string };

export const FAQ: Record<Locale, FaqItem[]> = {
  tr: [
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
  ],
  en: [
    {
      q: "Can I see the photos of private accounts?",
      a: "The profile picture is public even on private accounts, and that is all we show. We don't give access to private posts, stories or any other content. Sites that promise this are scams.",
    },
    {
      q: "Why are some photos small?",
      a: "Every platform has its own size limit. Pinterest, for example, serves at most 280 px, while YouTube and X serve the original file. We never upscale photos artificially; what you see is the real file the platform serves. All limits are listed on the [platforms](/en/platforms) page.",
    },
    {
      q: "Why are Instagram photos sometimes very small?",
      a: "Instagram often limits requests made without logging in. Without a limit you get 320 px; with one, only ~100 px. Trying again a little later may bring the larger version. We don't use logged-in accounts; that is against Instagram's rules.",
    },
    {
      q: "Is it paid? Do I need an account?",
      a: "No. ppbüyüt is free, needs no sign-up and shows no ads.",
    },
    {
      q: "Do you store my searches?",
      a: "No. The “Recent searches” list is kept only in your browser and can be cleared at any time. Images are never stored permanently on the server; they are only cached briefly.",
    },
    {
      q: "Should I type a username or paste a link?",
      a: "Either works. If you paste a link, we recognize the platform and the search starts right away. If you type just a username, pick the platform below the search box.",
    },
    {
      q: "Can I use the photo I downloaded however I like?",
      a: "Copyright and personal rights to the photos belong to their owners; you are responsible for how you use them. See the [terms of use](/en/terms) for details.",
    },
    {
      q: "A platform isn't working. Why?",
      a: "Photos are read from the platforms' public pages. When a platform changes its pages or limits requests, there can be temporary problems. The live status of every platform is on the [platforms](/en/platforms) page.",
    },
    {
      q: "Why do I see a Bitmoji instead of a photo on Snapchat?",
      a: "Personal Snapchat accounts usually have no real profile picture; the only public image they publish is the Bitmoji.",
    },
  ],
};

/** The answer without Markdown, for structured data. */
export const plainAnswer = (a: string) => a.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1").replace(/\*\*([^*]+)\*\*/g, "$1");
