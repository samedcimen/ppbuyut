# ppbüyüt

Profil fotoğraflarını platformun sunduğu **en büyük boyutta** görüntüleyip indirmeye yarayan, reklamsız ve kayıtsız bir web aracı.

Kullanıcı adını ya da profil bağlantısını yapıştırırsın; platform otomatik tanınır, fotoğrafın en büyük versiyonu gösterilir ve tek tıkla indirilir.

**Canlı:** [ppbuyut.com](https://ppbuyut.com)

## Özellikler

- 12 platform: Instagram, Facebook, TikTok, X, YouTube, Threads, Bluesky, GitHub, Twitch, Telegram, Pinterest, Snapchat
- Bağlantıdan platform ve kullanıcı adını otomatik tanıma; sayfanın herhangi bir yerine yapıştırma
- Profil yolları: `ppbuyut.com/instagram.com/kullanici` biçiminde doğrudan arama, paylaşılabilir sonuç adresleri
- Gerçek çözünürlük gösterimi, tam ekran görüntüleyici, indirme
- Son aramalar yalnızca tarayıcıda tutulur; sunucuda arama geçmişi saklanmaz
- Açık / koyu tema, seçilen platformun renklerinde arka plan
- Türkçe (kök adres) ve İngilizce (`/en`) arayüz; hreflang ile her sayfanın diğer dildeki karşılığı

## Teknolojiler

- [Next.js 16](https://nextjs.org) (App Router) + TypeScript
- Tailwind CSS 4
- [Motion](https://motion.dev) (animasyonlar), [Lucide](https://lucide.dev) ve [Simple Icons](https://simpleicons.org) (ikonlar)

## Geliştirme

```bash
npm install
npm run dev
npm test        # birim testleri (Vitest)
```

Ardından [http://localhost:3000](http://localhost:3000) adresini aç.

API anahtarı ya da üçüncü taraf servis gerekmez: her platform kendi herkese açık sayfalarından okunur.

## Proje yapısı

```
app/(tr)/               Türkçe sayfalar ve kök layout (ana sayfa, platformlar, sss, hakkında, sürüm notları, kullanım şartları)
app/en/                 İngilizce sayfalar ve kök layout (/en, /en/platforms, /en/faq …)
app/(tr)/[...slug]/     Profil yolları (ppbuyut.com/<profil bağlantısı>; İngilizcesi /en/<profil bağlantısı>)
components/pages/       İki dilin ortak kullandığı sayfa bileşenleri
lib/i18n/               Arayüz sözlükleri (tr.ts, en.ts) ve dil adresleri (routes.ts)
lib/content/            Sayfa metinleri (SSS, hakkında, kullanım şartları, platform sayfaları)
components/viewer/      Arama kutusu, platform seçici, sonuç ve hata kartları
lib/detect.ts           Bağlantı / kullanıcı adından platform tespiti
lib/platforms.ts        Platform tanımları (boyut sınırları, renkler, kullanıcı adı kuralları)
lib/providers/          Platform başına profil fotoğrafı sağlayıcıları
lib/health.ts           Canlı servis durumu
app/api/                avatar (arama), proxy (görsel aktarma), status (servis durumu)
lib/site.ts             Site ve geliştirici bilgileri
CHANGELOG.md            Sürüm notları (sitedeki /surum-notlari sayfası bu dosyadan oluşturulur)
```

## Yasal not

ppbüyüt yalnızca herkese açık profil fotoğraflarını gösterir; gizli içeriklere erişim sağlamaz. Fotoğrafların telif ve kişilik hakları sahiplerine aittir. Listelenen platformlarla bağlantılı değildir ve bu platformlar tarafından onaylanmamıştır.

## Lisans

[MIT](LICENSE) © 2026 [samedcimen](https://github.com/samedcimen)
