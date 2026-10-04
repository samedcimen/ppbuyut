import type { Locale } from "../i18n";

// Copy of the content pages, kept out of the client dictionaries (lib/i18n)
// since only the server renders it. Body text uses InlineMarkdown.

export const PAGES = {
  tr: {
    faq: {
      title: "Sık sorulan sorular",
      metaDescription: "Gizli hesaplar, fotoğraf boyutları, gizlilik ve kullanım hakları hakkında sık sorulan sorular.",
      eyebrow: "SSS",
      description: "Aradığın cevap burada yoksa büyük ihtimalle kullanım şartlarında ya da hakkında sayfasında vardır.",
      links: {
        about: { title: "Hakkında", body: "ppbüyüt neden var, nasıl çalışır." },
        terms: { title: "Kullanım şartları", body: "Haklar, gizlilik ve sorumluluklar." },
        platforms: { title: "Platformlar", body: "Desteklenen platformlar ve boyut sınırları." },
      },
    },

    platforms: {
      title: "Platformlar",
      metaDescription: (count: number) =>
        `ppbüyüt'ün desteklediği ${count} platform, her birinin sunduğu en büyük profil fotoğrafı boyutu ve canlı servis durumu.`,
      eyebrow: "Platformlar",
      heading: "Her platformun bir sınırı var. Biz hep en büyüğünü getiriyoruz.",
      description:
        "Aşağıdaki boyutlar, platformun herkese açık olarak sunduğu en büyük versiyondur. Fotoğraflar hiçbir zaman yapay olarak büyütülmez; indirdiğin dosya platformdaki gerçek dosyadır.",
      live: { title: "Canlı durum", body: "Son aramalardan ya da yarım saatte bir yapılan kontrolden hesaplanır." },
      reliability: { title: "Güvenilirlik", body: "Yöntemin ne kadar kolay bozulabileceği." },
      methods: { title: "Yöntemler" },
    },

    about: {
      title: "Hakkında",
      metaDescription: "ppbüyüt nedir, nasıl çalışır ve hangi ilkelerle geliştirilir: reklamsız, kayıtsız, gizliliğe saygılı.",
      eyebrow: "Hakkında",
      heading: "Küçük bir sorun için yapılmış, sade bir araç.",
      description:
        "Sosyal medya platformları profil fotoğraflarını küçük ve kırpılmış gösterir. Fotoğrafa yakından bakmak için ekran görüntüsü alıp yakınlaştırmak bulanık sonuç verir. ppbüyüt, platformun sunucusunda zaten var olan en büyük versiyonu bulup sana getirir.",
      howTitle: "Nasıl çalışıyor?",
      how: [
        "Platformlar aynı fotoğrafın farklı boyutlarını saklar ve sayfada genellikle en küçüğünü kullanır. Fotoğraf adresindeki boyut bilgisi değiştirildiğinde büyük versiyona ulaşılabilir.",
        "ppbüyüt bağlantıdan platformu tanır, mümkün olduğunda platformun resmi arayüzünü kullanır ve fotoğraf adresini platformun izin verdiği en büyük boyuta çevirir.",
      ],
      principlesTitle: "İlkelerimiz",
      principles: {
        noAds: { title: "Reklamsız", body: "Pop-up yok, sahte indirme butonu yok, bekleme sayacı yok. Sadece arama kutusu." },
        noSignup: { title: "Kayıt yok", body: "Üye olmadan, e-posta vermeden kullanırsın. Hesap açmana gerek yok." },
        privacy: {
          title: "Önce gizlilik",
          body: "Arama geçmişin sunucuda tutulmaz. Son aramalar yalnızca senin tarayıcında kalır.",
        },
        honest: {
          title: "Dürüst boyut",
          body: "Yapay büyütme yapmayız. Gördüğün çözünürlük, platformdaki gerçek dosyanın çözünürlüğüdür.",
        },
        publicOnly: {
          title: "Sadece herkese açık",
          body: "Gizli içeriklere erişim vaat etmeyiz. Yalnızca zaten herkese açık olan profil fotoğrafını gösteririz.",
        },
        fast: { title: "Hızlı", body: "Bağlantıyı yapıştırdığın an platform tanınır ve arama başlar. Tek tık, tek sonuç." },
      },
      developerTitle: "Geliştirici",
      avatarAlt: (name: string) => `${name} profil fotoğrafı`,
      developer: (name: string) =>
        `ppbüyüt'ü ${name} geliştiriyor. Öneri, hata bildirimi ya da kaldırma talepleri için e-posta veya GitHub üzerinden ulaşabilirsin.`,
      disclaimer:
        "ppbüyüt bağımsız bir projedir; Instagram, TikTok, X, YouTube veya listelenen diğer platformlarla bağlantılı değildir ve bu platformlar tarafından onaylanmamıştır.",
    },

    terms: {
      title: "Kullanım şartları",
      metaDescription: "ppbüyüt kullanım şartları, telif ve kişilik hakları, veri ve gizlilik ilkeleri.",
      eyebrow: "Yasal",
      updated: "Son güncelleme:",
      updatedDate: "4 Ekim 2026",
      toc: "İçindekiler",
      anchor: "madde",
      sections: [
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
            "Sitenin kullanımını anlamak için çerez kullanmayan, anonim bir ziyaret istatistiği (Vercel Web Analytics) tutulur. Bu istatistiğe aranan kullanıcı adları gönderilmez; profil sayfaları yalnızca “Instagram profili” gibi türleriyle sayılır.",
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
            "Kaldırma talepleri ve diğer bildirimler için [Hakkında](/hakkinda) sayfasındaki iletişim bilgilerini kullanabilirsin.",
          ],
        },
        {
          title: "Değişiklikler",
          body: [
            "Bu şartlar zaman zaman güncellenebilir. Hizmeti kullanmaya devam etmen, güncel şartları kabul ettiğin anlamına gelir.",
          ],
        },
      ],
    },

    changelog: {
      title: "Sürüm notları",
      metaDescription: "ppbüyüt'e eklenen yenilikler, düzeltmeler ve planlanan özellikler.",
      eyebrow: "Sürüm notları",
      heading: "Neler değişti?",
      description: "ppbüyüt'e eklenen yenilikler, düzeltmeler ve sırada olanlar. En yeni sürüm en üstte.",
      upcoming: "Yakında",
      latest: "Güncel",
      inProgress: "Üzerinde çalışılıyor",
    },

    profile: {
      title: (username: string, platform: string) => `@${username} · ${platform} profil fotoğrafı`,
    },
  },

  en: {
    faq: {
      title: "Frequently asked questions",
      metaDescription: "Frequently asked questions about private accounts, photo sizes, privacy and usage rights.",
      eyebrow: "FAQ",
      description: "If your answer isn't here, it is most likely in the terms of use or on the about page.",
      links: {
        about: { title: "About", body: "Why ppbüyüt exists and how it works." },
        terms: { title: "Terms of use", body: "Rights, privacy and responsibilities." },
        platforms: { title: "Platforms", body: "Supported platforms and their size limits." },
      },
    },

    platforms: {
      title: "Platforms",
      metaDescription: (count: number) =>
        `The ${count} platforms ppbüyüt supports, the largest profile picture size each one serves, and their live service status.`,
      eyebrow: "Platforms",
      heading: "Every platform has a limit. We always fetch the largest.",
      description:
        "The sizes below are the largest version each platform serves publicly. Photos are never upscaled artificially; the file you download is the real file on the platform.",
      live: { title: "Live status", body: "Worked out from recent searches or from a check every half hour." },
      reliability: { title: "Reliability", body: "How easily the method can break." },
      methods: { title: "Methods" },
    },

    about: {
      title: "About",
      metaDescription: "What ppbüyüt is, how it works and the principles behind it: no ads, no sign-up, privacy first.",
      eyebrow: "About",
      heading: "A simple tool for a small problem.",
      description:
        "Social media platforms show profile pictures small and cropped. Taking a screenshot and zooming in gives a blurry result. ppbüyüt finds the largest version that already exists on the platform's servers and brings it to you.",
      howTitle: "How does it work?",
      how: [
        "Platforms store the same photo in several sizes and usually show the smallest one on the page. Changing the size in the photo's address leads to the larger version.",
        "ppbüyüt recognizes the platform from the link, uses the platform's official interface where possible, and rewrites the photo's address to the largest size the platform allows.",
      ],
      principlesTitle: "Our principles",
      principles: {
        noAds: { title: "No ads", body: "No pop-ups, no fake download buttons, no countdowns. Just the search box." },
        noSignup: { title: "No sign-up", body: "Use it without an account or an e-mail address." },
        privacy: {
          title: "Privacy first",
          body: "Your search history is not kept on the server. Recent searches stay in your browser only.",
        },
        honest: {
          title: "Honest size",
          body: "No artificial upscaling. The resolution you see is the resolution of the real file on the platform.",
        },
        publicOnly: {
          title: "Public only",
          body: "We never promise access to private content. We show only the profile picture, which is already public.",
        },
        fast: { title: "Fast", body: "The moment you paste a link, the platform is recognized and the search starts." },
      },
      developerTitle: "Developer",
      avatarAlt: (name: string) => `${name}'s profile picture`,
      developer: (name: string) =>
        `ppbüyüt is built by ${name}. For suggestions, bug reports or removal requests, get in touch by e-mail or on GitHub.`,
      disclaimer:
        "ppbüyüt is an independent project; it is not affiliated with or endorsed by Instagram, TikTok, X, YouTube or any of the other listed platforms.",
    },

    terms: {
      title: "Terms of use",
      metaDescription: "ppbüyüt terms of use: copyright and personal rights, data and privacy.",
      eyebrow: "Legal",
      updated: "Last updated:",
      updatedDate: "October 4, 2026",
      toc: "Contents",
      anchor: "section",
      sections: [
        {
          title: "Scope of the service",
          body: [
            "ppbüyüt is a free tool for viewing and downloading profile pictures that are published publicly on social media platforms, at the largest size the platform serves.",
            "Only public profile pictures are shown. There is no access to the posts, stories or any other private content of private accounts, and no such promise is made.",
          ],
        },
        {
          title: "Copyright and personal rights",
          body: [
            "Copyright and personal rights to the photos viewed and downloaded belong to their owners. ppbüyüt claims no rights over these images.",
            "You are solely responsible for how you use downloaded images. Using them for harassment, impersonation, creating fake accounts or any other unlawful purpose is prohibited.",
          ],
        },
        {
          title: "Data and privacy",
          body: [
            "Your search history is not stored on our servers. The “Recent searches” list is kept only in your browser and can be cleared at any time.",
            "Images are not stored permanently on our servers; they may only be cached briefly for performance. To prevent abuse, anonymous per-IP rate limiting is applied.",
            "To understand how the site is used, an anonymous, cookie-free visit statistic (Vercel Web Analytics) is kept. Searched usernames are never sent to it; profile pages are counted only by type, such as “Instagram profile”.",
          ],
        },
        {
          title: "Third-party platforms",
          body: [
            "ppbüyüt is not affiliated with or endorsed by Instagram, TikTok, X, YouTube or any of the other listed platforms.",
            "Retrieving data from some platforms may be subject to those platforms' own terms. Platforms may change or restrict access, so uninterrupted operation of the service is not guaranteed.",
          ],
        },
        {
          title: "Removal requests",
          body: [
            "If you don't want your own profile picture to be viewable through this tool, removing or changing it on the platform is enough; cached copies expire on their own shortly after.",
            "For removal requests and other notices, use the contact details on the [About](/en/about) page.",
          ],
        },
        {
          title: "Changes",
          body: ["These terms may be updated from time to time. Continuing to use the service means you accept the current terms."],
        },
      ],
    },

    changelog: {
      title: "Changelog",
      metaDescription: "New features, fixes and what's planned for ppbüyüt.",
      eyebrow: "Changelog",
      heading: "What's new?",
      description: "New features, fixes and what's next for ppbüyüt, newest first. The notes themselves are written in Turkish.",
      upcoming: "Upcoming",
      latest: "Latest",
      inProgress: "In progress",
    },

    profile: {
      title: (username: string, platform: string) => `@${username} · ${platform} profile picture`,
    },
  },
} satisfies Record<Locale, unknown>;

export const pageCopy = (locale: Locale) => PAGES[locale];
