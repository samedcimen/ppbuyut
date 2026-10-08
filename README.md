<div align="center">

<img src="public/icons/icon-192.png" width="96" height="96" alt="ppbüyüt logosu" />

# ppbüyüt

**Profil fotoğraflarını tam boyutta gör ve indir.**<br />
19 platform · reklamsız · kayıtsız · ücretsiz

[![Canlı](https://img.shields.io/badge/canlı-ppbuyut.com-09090b?style=for-the-badge)](https://ppbuyut.com)
[![English](https://img.shields.io/badge/English-ppbuyut.com%2Fen-0f62fe?style=for-the-badge)](https://ppbuyut.com/en)

[![Sürüm](https://img.shields.io/github/v/tag/samedcimen/ppbuyut?label=s%C3%BCr%C3%BCm&color=16a34a)](CHANGELOG.md)
[![CI](https://github.com/samedcimen/ppbuyut/actions/workflows/ci.yml/badge.svg)](https://github.com/samedcimen/ppbuyut/actions/workflows/ci.yml)
[![Next.js](https://img.shields.io/badge/Next.js-16-000000?logo=nextdotjs)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Lisans: MIT](https://img.shields.io/badge/lisans-MIT-blue)](LICENSE)

<a href="https://ppbuyut.com"><img src="https://ppbuyut.com/opengraph-image" alt="ppbüyüt: Profil fotoğrafını tam boyutta gör" width="800" /></a>

</div>

---

## ✨ Nasıl çalışır?

| 1️⃣ Yapıştır | 2️⃣ Tanı ve büyüt | 3️⃣ İndir |
| :-- | :-- | :-- |
| Profil bağlantısını ya da `@kullanıcıadı`nı yapıştır. Sayfanın herhangi bir yerine yapıştırman yeterli. | Platform otomatik tanınır; fotoğrafın adresi platformun sunduğu **en büyük boyuta** çevrilir. | Tam ekranda incele, tek tıkla doğru dosya adıyla indir. |

Fotoğraflar **yapay olarak büyütülmez**: gördüğün, platformun sunucusunda zaten duran en büyük gerçek dosyadır.

> [!TIP]
> Bir bağlantının başına site adresini eklemek de yeterli:
> `ppbuyut.com/instagram.com/natgeo` → arama hemen başlar.

## 🌐 Desteklenen platformlar

| | Platform | En büyük boyut | Yöntem | Güvenilirlik |
| :-: | :-- | :-- | :-- | :-- |
| <img src="https://cdn.simpleicons.org/instagram" width="20" /> | Instagram | 320 px | Dahili endpoint | 🔴 Deneysel |
| <img src="https://cdn.simpleicons.org/facebook" width="20" /> | Facebook | 2048 px | Açık resim adresi | 🟡 Beta |
| <img src="https://cdn.simpleicons.org/tiktok/000000/ffffff" width="20" /> | TikTok | 720–1080 px | Sayfa verisi | 🟡 Beta |
| <img src="https://cdn.simpleicons.org/x/000000/ffffff" width="20" /> | X (Twitter) | Orijinal | Bağlantı önizlemesi | 🟡 Beta |
| <img src="https://cdn.simpleicons.org/youtube" width="20" /> | YouTube | Orijinal | Sayfa verisi | 🟢 Kararlı |
| <img src="https://cdn.simpleicons.org/threads/000000/ffffff" width="20" /> | Threads | 320 px | Instagram üzerinden | 🔴 Deneysel |
| <img src="https://cdn.simpleicons.org/bluesky" width="20" /> | Bluesky | Orijinal | Açık API | 🟢 Kararlı |
| <img src="https://cdn.simpleicons.org/mastodon" width="20" /> | Mastodon | Orijinal | Açık API | 🟡 Beta |
| <img src="https://cdn.simpleicons.org/github/181717/ffffff" width="20" /> | GitHub | 460 px | Açık URL | 🟢 Kararlı |
| <img src="https://cdn.simpleicons.org/twitch" width="20" /> | Twitch | 300 px | Sayfa verisi | 🟢 Kararlı |
| <img src="https://cdn.simpleicons.org/kick" width="20" /> | Kick | Orijinal | Resmi geliştirici API'si | 🟢 Kararlı |
| <img src="https://cdn.simpleicons.org/spotify" width="20" /> | Spotify | 300 px (sanatçı 640 px) | Bağlantı önizlemesi | 🟡 Beta |
| <img src="https://cdn.simpleicons.org/soundcloud" width="20" /> | SoundCloud | Orijinal | Bağlantı önizlemesi | 🟡 Beta |
| <img src="https://cdn.simpleicons.org/tumblr/36465D/ffffff" width="20" /> | Tumblr | 512 px | Açık API | 🟢 Kararlı |
| <img src="https://cdn.simpleicons.org/flickr" width="20" /> | Flickr | 300 px | Sayfa verisi | 🟡 Beta |
| <img src="https://cdn.simpleicons.org/vk" width="20" /> | VK | ~500 px | Bağlantı önizlemesi | 🔴 Deneysel |
| <img src="https://cdn.simpleicons.org/telegram" width="20" /> | Telegram | ~320 px | Açık sayfa | 🟢 Kararlı |
| <img src="https://cdn.simpleicons.org/pinterest" width="20" /> | Pinterest | 280 px | Sayfa verisi | 🟡 Beta |
| <img src="https://cdn.simpleicons.org/snapchat/000000/FFFC00" width="20" /> | Snapchat | 1080 px | Sayfa verisi | 🟡 Beta |

**Orijinal**: platformun sakladığı, yüklenen dosyanın kendisi (çoğu zaman 1000–2000 px ve üstü).<br />
Her platformun anlık durumu sitedeki [Platformlar](https://ppbuyut.com/platformlar) sayfasında canlı olarak gösterilir.

## 🚀 Özellikler

<table>
<tr>
<td width="50%" valign="top">

**🔎 Akıllı arama**
- Bağlantıdan platform ve kullanıcı adını otomatik tanır
- Sayfanın herhangi bir yerine yapıştırınca arama başlar
- Paylaşılabilir sonuç adresleri (`/instagram/natgeo`)
- Son aramalar yalnızca senin tarayıcında kalır

</td>
<td width="50%" valign="top">

**🖼️ Gerçek boyut**
- Fotoğrafın gerçek çözünürlüğü gösterilir
- Tam ekran görüntüleyici
- Tek tıkla, doğru dosya adıyla indirme
- Görseller kendi sunucumuz üzerinden aktarılır

</td>
</tr>
<tr>
<td valign="top">

**🧭 Her yerden ulaş**
- **Yer imi:** Instagram, TikTok… gezerken tek tıkla aç
- **Telefona yükle:** ana ekrandan uygulama gibi açılır
- **Android Paylaş menüsü:** uygulamadan profil paylaş → ppbüyüt
- **Türkçe ve İngilizce** arayüz

</td>
<td valign="top">

**🛡️ Gizlilik ve güvenlik**
- Hesap yok, şifre yok, çerez yok
- Aranan kullanıcı adları istatistiğe gönderilmez
- Şifreli ve süreli görsel bağlantıları
- İstek sınırı, güvenlik başlıkları ve CSP

</td>
</tr>
</table>

## 🧰 Teknolojiler

| Alan | Kullanılan |
| :-- | :-- |
| Çatı | [Next.js 16](https://nextjs.org) (App Router, Turbopack) · TypeScript · React 19 |
| Arayüz | [Tailwind CSS 4](https://tailwindcss.com) · [Motion](https://motion.dev) · [Lucide](https://lucide.dev) · [Simple Icons](https://simpleicons.org) |
| Barındırma | [Vercel](https://vercel.com) · Web Analytics · Speed Insights |
| Önbellek ve istek sınırı | [Upstash Redis](https://upstash.com) (yoksa bellek içi) |
| Test | [Vitest](https://vitest.dev) · GitHub Actions (test, tip kontrolü, lint) |

Platformlar kendi herkese açık sayfalarından ve resmi API'lerinden okunur; ücretli bir üçüncü taraf servis kullanılmaz.

## 🛠️ Geliştirme

```bash
npm install
npm run dev      # http://localhost:3020
npm test         # birim testleri (Vitest)
npm run lint     # ESLint
npm run build    # production derlemesi
```

Yerelde hiçbir ortam değişkeni zorunlu değil; eksik olanların yerine güvenli varsayılanlar kullanılır.

<details>
<summary><b>Ortam değişkenleri</b> (production)</summary>

| Değişken | Ne için | Yoksa |
| :-- | :-- | :-- |
| `PROXY_SECRET` | Görsel bağlantılarını şifreleyen anahtar | Sunucu başına rastgele anahtar (bağlantılar sunucular arasında çalışmaz) |
| `KV_REST_API_URL`, `KV_REST_API_TOKEN` | Upstash Redis (Vercel entegrasyonu); `UPSTASH_REDIS_REST_*` adları da olur | Bellek içi önbellek ve istek sınırı |
| `KICK_CLIENT_ID`, `KICK_CLIENT_SECRET` | Kick'in resmi geliştirici API'si | Kick "kullanılamıyor" olur |
| `NEXT_PUBLIC_SITE_URL` | Site adresini değiştirmek için | Production’da `https://ppbuyut.com`, yerelde `localhost` |
| `GOOGLE_SITE_VERIFICATION`, `YANDEX_VERIFICATION`, `BING_SITE_VERIFICATION` | Arama motoru doğrulama etiketleri | Koddaki değerler |

</details>

<details>
<summary><b>Proje yapısı</b></summary>

```
app/(tr)/               Türkçe sayfalar ve kök layout
app/en/                 İngilizce sayfalar ve kök layout (/en, /en/platforms, /en/faq …)
app/(tr)/[...slug]/     Profil yolları (ppbuyut.com/<profil bağlantısı>; İngilizcesi /en/…)
app/api/                avatar (arama), proxy (görsel aktarma), status (servis durumu)
components/pages/       İki dilin ortak kullandığı sayfa bileşenleri
components/viewer/      Arama kutusu, platform seçici, sonuç ve hata kartları
lib/platforms.ts        Platform tanımları (boyut sınırları, renkler, kullanıcı adı kuralları)
lib/detect.ts           Bağlantı / kullanıcı adından platform tespiti
lib/bookmarklet.ts      Yer imi (detect.ts ile aynı kararları veren kurallar)
lib/providers/          Platform başına profil fotoğrafı sağlayıcıları
lib/health.ts           Canlı servis durumu
lib/i18n/               Arayüz sözlükleri (tr.ts, en.ts) ve dil adresleri
lib/content/            Sayfa metinleri (SSS, hakkında, kullanım şartları, platform sayfaları)
tests/                  Birim testleri
CHANGELOG.md            Sürüm notları (sitedeki /surum-notlari sayfası bu dosyadan oluşur)
```

</details>

## ⚖️ Yasal not

ppbüyüt yalnızca **herkese açık** profil fotoğraflarını gösterir; gizli hesapların gönderilerine, hikâyelerine ya da başka içeriklere erişim sağlamaz. Fotoğrafların telif ve kişilik hakları sahiplerine aittir. ppbüyüt, listelenen platformlarla bağlantılı değildir ve bu platformlar tarafından onaylanmamıştır. Ayrıntılar: [Kullanım şartları](https://ppbuyut.com/kullanim-sartlari).

## 📄 Lisans

[MIT](LICENSE) © 2026 [samedcimen](https://github.com/samedcimen)
