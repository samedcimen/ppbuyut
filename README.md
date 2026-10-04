# ppbüyüt

Profil fotoğraflarını platformun sunduğu **en büyük boyutta** görüntüleyip indirmeye yarayan, reklamsız ve kayıtsız bir web aracı.

Kullanıcı adını ya da profil bağlantısını yapıştırırsın; platform otomatik tanınır, fotoğrafın en büyük versiyonu gösterilir ve tek tıkla indirilir.

> **Durum:** Arayüz tamamlandı. Arama şu an sahte verilerle çalışıyor (GitHub hariç); gerçek veri katmanı geliştiriliyor. Ayrıntılar için [CHANGELOG.md](CHANGELOG.md).

## Özellikler

- 10 platform: Instagram, TikTok, X, YouTube, Threads, GitHub, Twitch, Telegram, Pinterest, Snapchat
- Bağlantıdan platform ve kullanıcı adını otomatik tanıma; sayfanın herhangi bir yerine yapıştırma
- Profil yolları: `ppbuyut.com/instagram.com/kullanici` biçiminde doğrudan arama, paylaşılabilir sonuç adresleri
- Gerçek çözünürlük gösterimi, tam ekran görüntüleyici, indirme
- Son aramalar yalnızca tarayıcıda tutulur; sunucuda arama geçmişi saklanmaz
- Açık / koyu tema, seçilen platformun renklerinde arka plan

## Teknolojiler

- [Next.js 16](https://nextjs.org) (App Router) + TypeScript
- Tailwind CSS 4
- [Motion](https://motion.dev) (animasyonlar), [Lucide](https://lucide.dev) ve [Simple Icons](https://simpleicons.org) (ikonlar)

## Geliştirme

```bash
npm install
npm run dev
```

Ardından [http://localhost:3000](http://localhost:3000) adresini aç.

Arama şu an sahte verilerle çalışır ([lib/avatar-client.ts](lib/avatar-client.ts)). Hata ekranlarını görmek için kullanıcı adı olarak `yok`, `limit` veya `engel` yazabilirsin.

## Proje yapısı

```
app/                    Sayfalar (ana sayfa, platformlar, sss, hakkında, sürüm notları, kullanım şartları)
app/[...slug]/          Profil yolları (ppbuyut.com/<profil bağlantısı>)
components/viewer/      Arama kutusu, platform seçici, sonuç ve hata kartları
lib/detect.ts           Bağlantı / kullanıcı adından platform tespiti
lib/platforms.ts        Platform tanımları (boyut sınırları, renkler, kullanıcı adı kuralları)
lib/site.ts             Site ve geliştirici bilgileri
CHANGELOG.md            Sürüm notları (sitedeki /surum-notlari sayfası bu dosyadan oluşturulur)
```

## Yasal not

ppbüyüt yalnızca herkese açık profil fotoğraflarını gösterir; gizli içeriklere erişim sağlamaz. Fotoğrafların telif ve kişilik hakları sahiplerine aittir. Listelenen platformlarla bağlantılı değildir ve bu platformlar tarafından onaylanmamıştır.

## Lisans

[MIT](LICENSE) © 2026 [samedcimen](https://github.com/samedcimen)
