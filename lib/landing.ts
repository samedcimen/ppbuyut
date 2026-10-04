import { PLATFORMS, type PlatformId } from "./platforms";

// Copy for the per-platform landing pages (/pp-buyutme/<platform>): the
// searches people actually type ("instagram pp büyütme") need pages of their own.

interface LandingCopy {
  /** How to get the profile link on this platform. */
  linkSteps: string[];
  /** One platform-specific sentence for the intro. */
  detail: string;
  /** Whether "private account" questions apply. */
  hasPrivateAccounts: boolean;
}

const COPY: Record<PlatformId, LandingCopy> = {
  instagram: {
    linkSteps: [
      "Instagram'da profile git.",
      "Sağ üstteki üç noktaya dokun ve “Profil bağlantısını kopyala”yı seç.",
      "Bağlantıyı yukarıdaki kutuya yapıştır; ya da sadece kullanıcı adını yaz.",
    ],
    detail: "Instagram, girişsiz ziyaretçilere profil fotoğrafını en fazla 320 px verir; mümkün olduğunda daha büyük kopyasını getiririz.",
    hasPrivateAccounts: true,
  },
  facebook: {
    linkSteps: [
      "Facebook'ta profile ya da sayfaya git.",
      "Adres çubuğundaki bağlantıyı kopyala (ör. facebook.com/kullanici veya profile.php?id=…).",
      "Bağlantıyı yukarıdaki kutuya yapıştır.",
    ],
    detail: "Sayfalarda ve herkese açık profillerde fotoğraf çoğu zaman 2048 px orijinal boyutunda gelir.",
    hasPrivateAccounts: true,
  },
  tiktok: {
    linkSteps: [
      "TikTok'ta profile git.",
      "Paylaş simgesine dokunup “Bağlantıyı kopyala”yı seç.",
      "Bağlantıyı yukarıdaki kutuya yapıştır; ya da @kullanıcıadını yaz.",
    ],
    detail: "TikTok profil fotoğrafları genellikle 720–1080 px boyutunda saklanır; en büyüğünü getiririz.",
    hasPrivateAccounts: true,
  },
  x: {
    linkSteps: [
      "X'te (Twitter) profile git.",
      "Adres çubuğundaki x.com/kullanici bağlantısını kopyala.",
      "Bağlantıyı yukarıdaki kutuya yapıştır; ya da @kullanıcıadını yaz.",
    ],
    detail: "X'te profil fotoğrafının küçük kopyası yerine yüklenen orijinal dosyayı getiririz.",
    hasPrivateAccounts: true,
  },
  youtube: {
    linkSteps: [
      "YouTube'da kanala git.",
      "Adres çubuğundaki youtube.com/@kanal bağlantısını kopyala.",
      "Bağlantıyı yukarıdaki kutuya yapıştır; ya da @kanal adını yaz.",
    ],
    detail: "YouTube kanal fotoğrafını yüklendiği orijinal boyutta getiririz.",
    hasPrivateAccounts: false,
  },
  threads: {
    linkSteps: [
      "Threads'te profile git.",
      "Profil bağlantısını kopyala (threads.com/@kullanici).",
      "Bağlantıyı yukarıdaki kutuya yapıştır.",
    ],
    detail: "Threads profilleri Instagram hesabının profil fotoğrafını kullanır; fotoğrafı oradan getiririz.",
    hasPrivateAccounts: true,
  },
  github: {
    linkSteps: [
      "GitHub'da kullanıcının sayfasına git.",
      "Adres çubuğundaki github.com/kullanici bağlantısını kopyala.",
      "Bağlantıyı yukarıdaki kutuya yapıştır; ya da kullanıcı adını yaz.",
    ],
    detail: "GitHub avatarları en fazla 460 px sunulur; o boyutta getiririz.",
    hasPrivateAccounts: false,
  },
  twitch: {
    linkSteps: [
      "Twitch'te kanala git.",
      "Adres çubuğundaki twitch.tv/kanal bağlantısını kopyala.",
      "Bağlantıyı yukarıdaki kutuya yapıştır; ya da kanal adını yaz.",
    ],
    detail: "Twitch profil resimleri 300 px olarak saklanır; o boyutta getiririz.",
    hasPrivateAccounts: false,
  },
  telegram: {
    linkSteps: [
      "Telegram'da kişinin ya da kanalın profilini aç.",
      "Kullanıcı adını kopyala (t.me/kullanici bağlantısı da olur; Telegram Web adresi de tanınır).",
      "Yukarıdaki kutuya yapıştır.",
    ],
    detail: "Yalnızca kullanıcı adı olan ve fotoğrafını herkese açık bırakan hesapların fotoğrafı görünür.",
    hasPrivateAccounts: true,
  },
  pinterest: {
    linkSteps: [
      "Pinterest'te profile git.",
      "Adres çubuğundaki pinterest.com/kullanici bağlantısını kopyala.",
      "Bağlantıyı yukarıdaki kutuya yapıştır.",
    ],
    detail: "Pinterest profil fotoğraflarını en fazla 280 px sunar; o boyutta getiririz.",
    hasPrivateAccounts: false,
  },
  snapchat: {
    linkSteps: [
      "Snapchat'te profilin paylaşım bağlantısını al (snapchat.com/add/kullanici).",
      "Ya da sadece kullanıcı adını not et.",
      "Yukarıdaki kutuya yapıştır.",
    ],
    detail: "Herkese açık profillerde fotoğraf 1080 px gelir; kişisel hesaplarda çoğunlukla Bitmoji bulunur.",
    hasPrivateAccounts: true,
  },
};

export interface LandingPage {
  platform: PlatformId;
  path: string;
  title: string;
  description: string;
  heading: { line: string; highlight: string; after?: string };
  intro: string;
  linkSteps: string[];
  faq: { q: string; a: string }[];
}

export function landingFor(platform: PlatformId): LandingPage {
  const p = PLATFORMS[platform];
  const c = COPY[platform];
  const faq = [
    {
      q: `${p.name} pp büyütme ücretsiz mi?`,
      a: `Evet. ppbüyüt ücretsizdir, üyelik istemez ve reklam göstermez. ${p.name} kullanıcı adını ya da profil bağlantısını yapıştırman yeterli.`,
    },
    {
      q: `${p.name} profil fotoğrafı en fazla kaç piksel?`,
      a: `${c.detail} Fotoğrafı yapay olarak büyütmüyoruz; gördüğün, platformun sunduğu gerçek dosyadır.`,
    },
    {
      q: `Profil fotoğrafına baktığımı ${p.name} kullanıcısı görür mü?`,
      a: `Hayır. Arama ${p.name} hesabın olmadan yapılır; kişiye bildirim gitmez ve aramaların sunucuda saklanmaz.`,
    },
    ...(c.hasPrivateAccounts
      ? [
          {
            q: `Gizli ${p.name} hesabının profil fotoğrafı görülebilir mi?`,
            a: `Profil fotoğrafı herkese açık bırakıldıysa evet. Gizli gönderilere, hikâyelere ya da başka içeriklere erişim sağlamıyoruz; bunu vaat eden siteler dolandırıcılıktır.`,
          },
        ]
      : []),
  ];

  return {
    platform,
    path: `/pp-buyutme/${platform}`,
    title: `${p.name} PP Büyütme — Profil Fotoğrafını Büyük Gör ve İndir`,
    description: `${p.name} profil fotoğrafını (pp) en büyük boyutta görüntüle ve indir. Ücretsiz ${p.name} pp büyütme aracı: reklamsız, kayıtsız, tek tık.`,
    heading: { line: p.name, highlight: "PP büyütme" },
    intro: `${p.name} profil fotoğrafları uygulamada küçük ve kırpılmış görünür. ppbüyüt, ${p.name} hesabının profil fotoğrafını platformun sunduğu en büyük boyutta bulur; tek tıkla büyütüp indirebilirsin. ${c.detail}`,
    linkSteps: c.linkSteps,
    faq,
  };
}
