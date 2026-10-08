import type { Locale } from "../i18n";
import { landingPath } from "../i18n/routes";
import { PLATFORMS, type PlatformId } from "../platforms";

// Copy for the per-platform landing pages (/pp-buyutme/<platform>,
// /en/profile-picture/<platform>): the searches people actually type
// ("instagram pp büyütme", "instagram profile picture viewer") need pages of their own.

interface LandingCopy {
  /** How to get the profile link on this platform. */
  linkSteps: string[];
  /** One platform-specific sentence for the intro. */
  detail: string;
  /** Whether "private account" questions apply. */
  hasPrivateAccounts: boolean;
}

const COPY_TR: Record<PlatformId, LandingCopy> = {
  flickr: {
    linkSteps: [
      "Flickr'da profili ya da fotoğraf akışını aç.",
      "flickr.com/people/… ya da flickr.com/photos/… bağlantısını kopyala.",
      "Bağlantıyı yukarıdaki kutuya yapıştır; ya da kullanıcı adını yaz.",
    ],
    detail: "Flickr profil fotoğraflarını (buddy icon) 48 px gösterir; sakladığı en büyük sürüm olan 300 px'i getiririz.",
    hasPrivateAccounts: false,
  },
  mastodon: {
    linkSteps: [
      "Mastodon'da profili aç.",
      "Profil bağlantısını (ör. mastodon.social/@ad) ya da tam kullanıcı adını (@ad@sunucu) kopyala.",
      "Yukarıdaki kutuya yapıştır.",
    ],
    detail:
      "Mastodon profil fotoğraflarını yüklendiği gibi saklar; orijinalini, başka sunuculardaki pek çok hesabı da tanıyan mastodon.social üzerinden getiririz.",
    hasPrivateAccounts: false,
  },
  tumblr: {
    linkSteps: [
      "Tumblr'da bloğu aç.",
      "Adresini kopyala (ad.tumblr.com ya da tumblr.com/ad).",
      "Bağlantıyı yukarıdaki kutuya yapıştır; ya da blog adını yaz.",
    ],
    detail: "Tumblr blog avatarlarını resmi API'si üzerinden en fazla 512 px sunar; o boyutta getiririz.",
    hasPrivateAccounts: false,
  },
  soundcloud: {
    linkSteps: [
      "SoundCloud'da profile git.",
      "Adres çubuğundan ya da paylaş menüsünden soundcloud.com/kullanici bağlantısını kopyala.",
      "Bağlantıyı yukarıdaki kutuya yapıştır; ya da kullanıcı adını yaz.",
    ],
    detail:
      "SoundCloud profil fotoğraflarını 500 px gösterir ama yüklenen dosyayı saklar; biz o orijinali getiririz, çoğu zaman 1000–2000 px ve üstü.",
    hasPrivateAccounts: false,
  },
  spotify: {
    linkSteps: [
      "Spotify'da profili ya da sanatçı sayfasını aç.",
      "⋯ → Paylaş → Bağlantıyı kopyala (open.spotify.com/user/… ya da /artist/…).",
      "Bağlantıyı yukarıdaki kutuya yapıştır.",
    ],
    detail: "Spotify kullanıcı fotoğraflarını en fazla 300 px, sanatçı fotoğraflarını 640 px saklar; en büyük hâlini getiririz.",
    hasPrivateAccounts: false,
  },
  kick: {
    linkSteps: [
      "Kick'te kanala git.",
      "Adres çubuğundaki kick.com/kanal bağlantısını kopyala.",
      "Bağlantıyı yukarıdaki kutuya yapıştır; ya da kanal adını yaz.",
    ],
    detail:
      "Kick profil fotoğrafını 350 px'e küçültüp gösterir; biz yayıncının yüklediği asıl dosyayı getiririz, çoğu zaman 1000 px ve üstü.",
    hasPrivateAccounts: false,
  },
  bluesky: {
    linkSteps: [
      "Bluesky'da profile git.",
      "Adres çubuğundan ya da paylaş menüsünden bsky.app/profile/… bağlantısını kopyala.",
      "Bağlantıyı yukarıdaki kutuya yapıştır; ya da kullanıcı adını yaz (ör. ad.bsky.social).",
    ],
    detail:
      "Bluesky profil fotoğrafını yüklendiği boyutta (en fazla 2000 px) saklar; uygulamadaki 1000 px kopya yerine onu getiririz.",
    hasPrivateAccounts: false,
  },
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

const COPY_EN: Record<PlatformId, LandingCopy> = {
  flickr: {
    linkSteps: [
      "Open the profile or photostream on Flickr.",
      "Copy the flickr.com/people/… or flickr.com/photos/… link.",
      "Paste the link into the box above, or type the username.",
    ],
    detail: "Flickr shows profile pictures (buddy icons) at 48 px; we fetch the 300 px version, the largest it keeps.",
    hasPrivateAccounts: false,
  },
  mastodon: {
    linkSteps: [
      "Open the profile on Mastodon.",
      "Copy the profile link (e.g. mastodon.social/@name) or the full handle (@name@server).",
      "Paste it into the box above.",
    ],
    detail:
      "Mastodon keeps profile pictures as uploaded; we fetch that original through mastodon.social, which also knows accounts from many other servers.",
    hasPrivateAccounts: false,
  },
  tumblr: {
    linkSteps: [
      "Open the blog on Tumblr.",
      "Copy its address (name.tumblr.com or tumblr.com/name).",
      "Paste the link into the box above, or type the blog name.",
    ],
    detail: "Tumblr serves blog avatars at up to 512 px through its official API; we fetch that size.",
    hasPrivateAccounts: false,
  },
  soundcloud: {
    linkSteps: [
      "Go to the profile on SoundCloud.",
      "Copy the soundcloud.com/username link from the address bar or the share menu.",
      "Paste the link into the box above, or type the username.",
    ],
    detail:
      "SoundCloud shows profile pictures at 500 px but keeps the uploaded file; we fetch that original, often 1000–2000 px or more.",
    hasPrivateAccounts: false,
  },
  spotify: {
    linkSteps: [
      "Open the profile or the artist page on Spotify.",
      "Tap ⋯ → Share → Copy link (open.spotify.com/user/… or /artist/…).",
      "Paste the link into the box above.",
    ],
    detail: "Spotify keeps user profile pictures at up to 300 px and artist photos at 640 px; we fetch the largest version.",
    hasPrivateAccounts: false,
  },
  kick: {
    linkSteps: [
      "Go to the channel on Kick.",
      "Copy the kick.com/channel link from the address bar.",
      "Paste the link into the box above, or type the channel name.",
    ],
    detail:
      "Kick shows a 350 px copy of the profile picture; we fetch the file the streamer uploaded, often 1000 px or more.",
    hasPrivateAccounts: false,
  },
  bluesky: {
    linkSteps: [
      "Go to the profile on Bluesky.",
      "Copy the bsky.app/profile/… link from the address bar or the share menu.",
      "Paste the link into the box above, or type the handle (e.g. name.bsky.social).",
    ],
    detail:
      "Bluesky keeps the uploaded profile picture at its own size (up to 2000 px); we fetch that instead of the 1000 px copy shown in the app.",
    hasPrivateAccounts: false,
  },
  instagram: {
    linkSteps: [
      "Go to the profile on Instagram.",
      "Tap the three dots in the top right and choose “Copy profile URL”.",
      "Paste the link into the box above, or just type the username.",
    ],
    detail: "Instagram serves profile pictures at up to 320 px to visitors who aren't logged in; we fetch a larger copy when one is available.",
    hasPrivateAccounts: true,
  },
  facebook: {
    linkSteps: [
      "Go to the profile or page on Facebook.",
      "Copy the link from the address bar (e.g. facebook.com/username or profile.php?id=…).",
      "Paste the link into the box above.",
    ],
    detail: "For pages and public profiles the photo usually comes at its original 2048 px.",
    hasPrivateAccounts: true,
  },
  tiktok: {
    linkSteps: [
      "Go to the profile on TikTok.",
      "Tap the share icon and choose “Copy link”.",
      "Paste the link into the box above, or type the @username.",
    ],
    detail: "TikTok usually stores profile pictures at 720–1080 px; we fetch the largest.",
    hasPrivateAccounts: true,
  },
  x: {
    linkSteps: [
      "Go to the profile on X (Twitter).",
      "Copy the x.com/username link from the address bar.",
      "Paste the link into the box above, or type the @username.",
    ],
    detail: "On X we fetch the original uploaded file instead of the small copy.",
    hasPrivateAccounts: true,
  },
  youtube: {
    linkSteps: [
      "Go to the channel on YouTube.",
      "Copy the youtube.com/@channel link from the address bar.",
      "Paste the link into the box above, or type the @channel name.",
    ],
    detail: "We fetch the YouTube channel picture at its original uploaded size.",
    hasPrivateAccounts: false,
  },
  threads: {
    linkSteps: [
      "Go to the profile on Threads.",
      "Copy the profile link (threads.com/@username).",
      "Paste the link into the box above.",
    ],
    detail: "Threads profiles use the Instagram account's profile picture; we fetch it from there.",
    hasPrivateAccounts: true,
  },
  github: {
    linkSteps: [
      "Go to the user's page on GitHub.",
      "Copy the github.com/username link from the address bar.",
      "Paste the link into the box above, or type the username.",
    ],
    detail: "GitHub serves avatars at up to 460 px; we fetch them at that size.",
    hasPrivateAccounts: false,
  },
  twitch: {
    linkSteps: [
      "Go to the channel on Twitch.",
      "Copy the twitch.tv/channel link from the address bar.",
      "Paste the link into the box above, or type the channel name.",
    ],
    detail: "Twitch stores profile pictures at 300 px; we fetch them at that size.",
    hasPrivateAccounts: false,
  },
  telegram: {
    linkSteps: [
      "Open the profile of the person or channel on Telegram.",
      "Copy the username (a t.me/username link works too, and so does a Telegram Web address).",
      "Paste it into the box above.",
    ],
    detail: "Only accounts that have a username and keep their photo public can be shown.",
    hasPrivateAccounts: true,
  },
  pinterest: {
    linkSteps: [
      "Go to the profile on Pinterest.",
      "Copy the pinterest.com/username link from the address bar.",
      "Paste the link into the box above.",
    ],
    detail: "Pinterest serves profile pictures at up to 280 px; we fetch them at that size.",
    hasPrivateAccounts: false,
  },
  snapchat: {
    linkSteps: [
      "Get the profile's share link on Snapchat (snapchat.com/add/username).",
      "Or just note down the username.",
      "Paste it into the box above.",
    ],
    detail: "Public profiles come at 1080 px; personal accounts usually only have a Bitmoji.",
    hasPrivateAccounts: true,
  },
};

export interface LandingPage {
  platform: PlatformId;
  path: string;
  title: string;
  description: string;
  heading: { line: string; highlight: string; after?: string };
  subtitle: string;
  introTitle: string;
  intro: string;
  linkSteps: string[];
  faqTitle: string;
  faq: { q: string; a: string }[];
  /** Link text for another platform's landing page. */
  linkLabel: (platform: string) => string;
  othersTitle: string;
}

export function landingFor(platform: PlatformId, locale: Locale): LandingPage {
  const p = PLATFORMS[platform];
  const path = landingPath(platform, locale);

  if (locale === "en") {
    const c = COPY_EN[platform];
    return {
      platform,
      path,
      title: `${p.name} Profile Picture Viewer — See & Download PFPs Full Size`,
      description: `View and download any ${p.name} profile picture (PFP) at full size. Free ${p.name} profile picture viewer: no ads, no sign-up, one click.`,
      heading: { line: p.name, highlight: "profile picture viewer" },
      subtitle: `Paste a ${p.name} username or profile link; the profile picture comes at its largest size.`,
      introTitle: `How to see a ${p.name} profile picture full size`,
      intro: `${p.name} profile pictures look small and cropped in the app. ppbüyüt finds the ${p.name} account's profile picture at the largest size the platform serves, so you can view and download it in one click. ${c.detail}`,
      linkSteps: c.linkSteps,
      faqTitle: `About the ${p.name} profile picture viewer`,
      faq: [
        {
          q: `Is the ${p.name} profile picture viewer free?`,
          a: `Yes. ppbüyüt is free, needs no sign-up and shows no ads. Just paste a ${p.name} username or profile link.`,
        },
        {
          q: `What is the largest size of a ${p.name} profile picture?`,
          a: `${c.detail} We never upscale photos artificially; what you see is the real file the platform serves.`,
        },
        {
          q: `Will the ${p.name} user know I viewed their profile picture?`,
          a: `No. The search is done without your ${p.name} account; the person isn't notified and your searches aren't stored on the server.`,
        },
        ...(c.hasPrivateAccounts
          ? [
              {
                q: `Can I see the profile picture of a private ${p.name} account?`,
                a: "Yes, if the profile picture is left public. We don't give access to private posts, stories or any other content; sites that promise this are scams.",
              },
            ]
          : []),
      ],
      linkLabel: (name) => `${name} profile picture`,
      othersTitle: "Other platforms",
    };
  }

  const c = COPY_TR[platform];
  return {
    platform,
    path,
    title: `${p.name} PP Büyütme — Profil Fotoğrafını Büyük Gör ve İndir`,
    description: `${p.name} profil fotoğrafını (pp) en büyük boyutta görüntüle ve indir. Ücretsiz ${p.name} pp büyütme aracı: reklamsız, kayıtsız, tek tık.`,
    heading: { line: p.name, highlight: "PP büyütme" },
    subtitle: `${p.name} kullanıcı adını ya da profil bağlantısını yapıştır; profil fotoğrafı en büyük boyutta gelsin.`,
    introTitle: `${p.name} profil fotoğrafı nasıl büyütülür?`,
    intro: `${p.name} profil fotoğrafları uygulamada küçük ve kırpılmış görünür. ppbüyüt, ${p.name} hesabının profil fotoğrafını platformun sunduğu en büyük boyutta bulur; tek tıkla büyütüp indirebilirsin. ${c.detail}`,
    linkSteps: c.linkSteps,
    faqTitle: `${p.name} pp büyütme hakkında`,
    faq: [
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
              a: "Profil fotoğrafı herkese açık bırakıldıysa evet. Gizli gönderilere, hikâyelere ya da başka içeriklere erişim sağlamıyoruz; bunu vaat eden siteler dolandırıcılıktır.",
            },
          ]
        : []),
    ],
    linkLabel: (name) => `${name} pp büyütme`,
    othersTitle: "Diğer platformlar",
  };
}
