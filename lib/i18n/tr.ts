import type { PlatformId, PlatformMethod, PlatformStatus } from "../platforms";
import type { NoteCode } from "../providers/types";
import type { ServiceState } from "../service-state";

/** Turkish UI copy. `Messages` (its shape) is what every language must provide. */
export const tr = {
  lang: "tr",
  ogLocale: "tr_TR",

  site: {
    title: "PP Büyütme: Instagram, TikTok ve X Profil Fotoğrafı Büyütme | ppbüyüt",
    description:
      "Instagram, TikTok, X, Facebook ve YouTube profil fotoğraflarını (pp) en büyük boyutta gör ve indir. Ücretsiz pp büyütme aracı: reklamsız, kayıtsız, tek tık.",
    keywords: [
      "pp büyütme",
      "profil fotoğrafı büyütme",
      "instagram pp büyütme",
      "instagram profil fotoğrafı büyütme",
      "tiktok profil fotoğrafı",
      "twitter pp büyütme",
      "x profil fotoğrafı",
      "youtube kanal fotoğrafı indir",
      "profil fotoğrafı indir",
      "pp indir",
      "hd profil fotoğrafı",
    ],
  },

  nav: {
    platforms: "Platformlar",
    faq: "SSS",
    about: "Hakkında",
    terms: "Şartlar",
    home: "Ana sayfa",
    openMenu: "Menüyü aç",
    closeMenu: "Menüyü kapat",
    theme: "Temayı değiştir",
    language: "Dil",
    otherLanguage: "English",
  },
  footer: { changelog: "Sürüm notları" },

  hero: {
    eyebrow: (count: number) => `Ücretsiz pp büyütme · ${count} platform · reklamsız`,
    line: "Profil fotoğrafını",
    highlight: "tam boyutta",
    after: "gör.",
    subtitle: "Kullanıcı adını ya da profil bağlantısını yapıştır. Platformu biz tanıyalım, en büyük versiyonu sen indir.",
  },

  search: {
    // Avoids "kullanıcı adı": browsers take fields named like that for login forms.
    label: "Profil bağlantısı ya da @hesap",
    examples: [
      "instagram.com/kullanici",
      "@kullanici",
      "tiktok.com/@kullanici",
      "youtube.com/@kanal",
      "x.com/kullanici",
      "github.com/kullanici",
    ],
    paste: "Yapıştır",
    clear: "Temizle",
    submit: "Getir",
    platform: "Platform",
    empty: "Bağlantı yapıştır ya da kullanıcı adı yaz.",
    focusHint: "odaklan",
    submitHint: "getir",
    linkDetected: (platform: string) => `${platform} bağlantısı algılandı`,
    willSearch: (platform: string) => `${platform} üzerinde aranacak — farklıysa aşağıdan platform seç.`,
    platformDown: (platform: string) => `${platform} şu an çalışmıyor; sonuç alınamayabilir.`,
    noPassword: "ppbüyüt hiçbir zaman şifre istemez ve giriş gerektirmez. Buraya şifre yazma.",
  },

  detect: {
    unreadable: () => "Bu bağlantı okunamadı.",
    unsupported: () => "Bu site henüz desteklenmiyor.",
    not_profile: (platform: string) => `Bu bir ${platform} profil bağlantısı değil.`,
    bad_username: (platform: string) => `Geçersiz ${platform} kullanıcı adı.`,
    bad_chars: () => "Kullanıcı adı yalnızca harf, rakam, nokta, alt çizgi ve tire içerebilir.",
    invalid_for: (platform: string) => `Bu kullanıcı adı ${platform} için geçerli değil.`,
  },

  result: {
    alt: (platform: string, username: string) => `${platform} kullanıcısı @${username} profil fotoğrafı`,
    fullscreen: "Tam ekran görüntüle",
    largest: "En büyük",
    resolution: "Çözünürlük",
    source: "Kaynak",
    download: "İndir",
    openProfile: (platform: string) => `${platform} profilini aç`,
    searching: (platform: string) => `${platform} üzerinde aranıyor…`,
    sources: { official: "Resmi kaynak", scrape: "Herkese açık sayfa", thirdparty: "Yedek kaynak" },
  },

  notes: {
    small: "Instagram şu an yalnızca küçük boyutu veriyor; daha sonra tekrar denersen büyük hâli gelebilir.",
    mirror: "Fotoğraf yedek kaynaktan alındı; Instagram'daki güncel hâlinden farklı olabilir.",
    bitmoji: "Bu hesapta gerçek profil fotoğrafı yok; Bitmoji gösteriliyor.",
    threads: "Threads, Instagram hesabının profil fotoğrafını kullanır; fotoğraf Instagram'dan alındı.",
  } satisfies Record<NoteCode, string>,
  platformNotes: {
    instagram: "Instagram, giriş yapılmadan en fazla ~320 px boyut sunuyor.",
  } as Partial<Record<PlatformId, string>>,

  errors: {
    retry: "Tekrar dene",
    not_found: {
      title: "Profil bulunamadı",
      body: (p: string, u: string) => `${p} üzerinde @${u} adlı bir hesap bulamadık. Kullanıcı adını kontrol edip tekrar dene.`,
    },
    hidden: {
      title: "Profil fotoğrafı görünmüyor",
      body: (p: string, u: string) =>
        `${p}, @${u} için herkese açık bir profil fotoğrafı vermiyor. Hesap gizli olabilir ya da bu adla bir hesap olmayabilir.`,
    },
    rate_limited: {
      title: "Biraz yavaşlayalım",
      body: () => "Kısa sürede çok fazla istek gönderildi. Bir dakika bekleyip tekrar dene.",
    },
    blocked: {
      title: "Platform isteği engelledi",
      body: (p: string) => `${p} şu anda erişimi kısıtlıyor. Bu genellikle geçicidir, birazdan tekrar dene.`,
    },
    unavailable: {
      title: "Bu platform şu an kullanılamıyor",
      body: (p: string) => `${p} için şu an çalışan bir yöntem yok. Durumu Platformlar sayfasından takip edebilirsin.`,
    },
    image_failed: {
      title: "Görsel yüklenemedi",
      body: () => "Fotoğrafın adresi bulundu ama görsel açılamadı. Bağlantının süresi dolmuş olabilir.",
    },
    unknown: {
      title: "Bir şeyler ters gitti",
      body: () => "Beklenmeyen bir hata oluştu. Lütfen tekrar dene.",
    },
  },

  lightbox: { download: "İndir", close: "Kapat", footer: "Gerçek boyutunda gösteriliyor · Kapatmak için Esc" },

  recent: {
    title: "Son aramalar",
    local: "yalnızca bu cihazda",
    clear: "Temizle",
    remove: (username: string) => `@${username} aramasını kaldır`,
  },

  status: {
    labels: { up: "Çalışıyor", degraded: "Kısıtlı", down: "Çalışmıyor" } satisfies Record<ServiceState, string>,
    hints: {
      up: "Platformun kendi yöntemiyle sorunsuz çalışıyor.",
      degraded: "Çalışıyor ama şu an yalnızca küçük boyut alınabiliyor.",
      down: "Şu an sonuç alınamıyor. Birazdan tekrar dene.",
    } satisfies Record<ServiceState, string>,
    checking: "Kontrol ediliyor",
    loading: "Servis durumu kontrol ediliyor…",
    failed: "Servis durumu alınamadı",
    summary: (up: number, total: number) => `${up}/${total} platform çalışıyor`,
    count: (n: number, label: string) => `${n} ${label.toLocaleLowerCase("tr")}`,
    checkedAgo: (minutes: number) => (minutes < 1 ? "az önce kontrol edildi" : `${minutes} dk önce kontrol edildi`),
  },

  reliability: {
    labels: { stable: "Kararlı", beta: "Beta", experimental: "Deneysel" } satisfies Record<PlatformStatus, string>,
    info: {
      stable: "Herkese açık, uzun süredir değişmeyen bir adres ya da sayfa kullanılır. Nadiren bozulur.",
      beta: "Platformun herkese açık sayfasındaki veriler okunur. Platform sayfasını değiştirirse geçici sorunlar olabilir.",
      experimental: "Platform girişsiz erişimi aktif olarak kısıtlıyor. Zaman zaman sonuç alınamayabilir.",
    } satisfies Record<PlatformStatus, string>,
  },

  methods: {
    labels: {
      open_url: "Açık URL",
      image_url: "Açık resim adresi",
      open_page: "Açık sayfa",
      page_data: "Sayfa verisi",
      preview: "Bağlantı önizlemesi",
      internal: "Dahili endpoint",
      public_api: "Açık API",
      via_instagram: "Instagram üzerinden",
    } satisfies Record<PlatformMethod, string>,
    info: {
      open_url: "Profil fotoğrafına herkese açık, kalıcı bir adresten ulaşılır.",
      image_url: "Platformun herkese açık resim adresinden, anahtarsız alınır.",
      open_page: "Profilin herkese açık önizleme sayfasından okunur.",
      page_data: "Herkese açık profil sayfasına gömülü veriden fotoğraf adresi okunur.",
      preview: "Profil sayfasının, bağlantı paylaşıldığında gösterilen önizleme görselinden okunur.",
      internal: "Platformun kendi web sitesinin kullandığı, belgelenmemiş adresler.",
      public_api: "Platformun herkese açık, anahtar ya da giriş gerektirmeyen resmi API'si kullanılır.",
      via_instagram: "Threads hesapları Instagram hesabıyla aynı fotoğrafı kullanır; fotoğraf Instagram'dan alınır.",
    } satisfies Record<PlatformMethod, string>,
  },

  sizes: { original: "Orijinal", max: "Maks. boyut" },

  howItWorks: {
    eyebrow: "Nasıl çalışır",
    title: "Üç adım. Hesap yok, reklam yok.",
    description:
      "Platformlar profil fotoğraflarını küçük gösterir ama sunucularında daha büyük bir versiyonu tutar. Biz o versiyonu bulup sana getiriyoruz.",
    steps: [
      { title: "Yapıştır", body: "Profil bağlantısını ya da @kullanıcıadını yapıştır. Sayfanın herhangi bir yerine yapıştırman da yeterli." },
      { title: "Tanı ve büyüt", body: "Platformu otomatik tanırız ve fotoğrafın adresini platformun izin verdiği en büyük boyuta çeviririz." },
      { title: "İndir", body: "Önizle, tam ekranda incele, tek tıkla doğru dosya adıyla indir." },
    ],
    exampleUser: "kullanici",
    exampleFile: "instagram-kullanici.jpg",
  },

  bookmarklet: {
    eyebrow: "Yer imi",
    title: "Gezinirken tek tıkla büyüt",
    body: "Butonu yer imleri çubuğuna sürükle. Instagram, TikTok ya da desteklenen başka bir platformda bir profildeyken ona tıkla; ppbüyüt o profille yeni sekmede açılsın. Başka sitelerde hiçbir şey açmaz.",
    step1: "Yer imleri çubuğu görünmüyorsa",
    step1After: "ile aç.",
    step2: "Sağdaki butonu tutup çubuğa sürükle.",
    step3: "Bir profildeyken yer imine tıkla.",
    button: "ppbüyüt'te aç",
    drag: "Yer imleri çubuğuna sürükle",
    hold: "Tut ve sürükle",
    dragHint: "Tıklama yerine yer imleri çubuğuna sürükle",
    // Shown by the bookmarklet itself (plain text, no quotes or apostrophes).
    unsupported: (names: string) => `ppbüyüt bu sitede çalışmıyor.\\n\\nDesteklenen siteler: ${names}.`,
    telegramNoUser:
      "Bu sohbette kullanıcı adı görünmüyor.\\n\\nTelegram Web üzerinde kullanıcı adı olan bir kişinin ya da kanalın sohbetini açıp tekrar dene.",
    notProfile: "Bu sayfa bir profil değil.\\n\\nBir hesabın profil sayfasını açıp yer imine tekrar tıkla.",
  },

  install: {
    eyebrow: "Uygulama",
    title: "Telefonuna ekle",
    ios: "Ana ekrandan tek dokunuşla aç; adres çubuğu olmadan uygulama gibi çalışır.",
    iosStep1: ["Safari'de alttaki", "Paylaş düğmesine dokun."],
    iosStep2: "“Ana Ekrana Ekle”yi seç.",
    android: ["Yükledikten sonra Instagram, TikTok gibi uygulamalarda bir profili", "Paylaş → ppbüyüt", "ile doğrudan açabilirsin."],
    button: "Uygulamayı yükle",
    menu: ["Tarayıcı menüsünden (⋮)", "“Uygulamayı yükle”", "ya da", "“Ana ekrana ekle”", "yi seç."],
  },

  seoIntro: {
    eyebrow: "PP büyütme",
    title: "PP büyütme nedir?",
    paragraphs: [
      "“PP”, sosyal medyada profil fotoğrafının kısaltması. Uygulamalar profil fotoğraflarını küçük ve yuvarlak kırpılmış gösterir; ekran görüntüsü alıp yakınlaştırmak da bulanık sonuç verir.",
      "PP büyütme, fotoğrafın platformun sunucusunda saklanan en büyük hâlini bulup göstermek demek. ppbüyüt bunu Instagram, TikTok, X, Facebook, YouTube ve daha fazlası için ücretsiz yapar: kullanıcı adını ya da profil bağlantısını yapıştır, fotoğrafı tam boyutta gör ve tek tıkla indir. Fotoğraflar yapay olarak büyütülmez.",
    ],
    listTitle: "Platforma göre pp büyütme",
    linkLabel: (platform: string) => `${platform} pp büyütme`,
  },

  cta: { title: "Hemen dene", body: "Bir profil bağlantısı yapıştır, fotoğrafı tam boyutta gör.", button: "Profil fotoğrafı ara" },

  email: { show: "E-postayı göster", copy: "E-postayı kopyala", copyShort: "Kopyala", send: "E-posta gönder", hide: "E-postayı gizle", hideShort: "Gizle" },

  notFound: {
    title: "Sayfa bulunamadı",
    tag: "404 · profil bulunamadı",
    heading: "Bu sayfayı bulamadık.",
    body: "Aradığın sayfa taşınmış ya da hiç var olmamış olabilir. Profil fotoğrafı arıyorsan ana sayfadan devam et.",
    home: "Ana sayfaya dön",
    faq: "Sık sorulan sorular",
  },
};

export type Messages = typeof tr;
