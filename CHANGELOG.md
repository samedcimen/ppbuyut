# Değişiklik Günlüğü

Bu projedeki önemli değişiklikler bu dosyada tutulur.

Biçim [Keep a Changelog](https://keepachangelog.com/tr-TR/1.1.0/) esas alınarak hazırlanmıştır ve proje [Anlamsal Sürümleme](https://semver.org/lang/tr/) kullanır.

## [Yayınlanmamış]

### Düzeltilenler
- Profilini Facebook dışına kapatmış (var olan) hesaplar “Profil bulunamadı” görünüyordu; artık “Profil fotoğrafı görünmüyor” açıklaması gösterilir.

### Planlanan
- Önbellek ve istek sınırının Upstash Redis'e taşınması (birden çok sunucuda ortak olsun diye)

## [1.9.0] - 2026-10-04

Facebook eklendi; Instagram ve Threads artık her yerden çalışıyor.

### Eklenenler
- **Facebook:** 11. platform. Sayfalar, kurumsal hesaplar ve kişisel profiller için orijinal boyut (çoğu zaman 2048 px). `facebook.com/kullanici`, `profile.php?id=…` ve `people/…` bağlantıları tanınır.
- **Instagram yedek kaynağı:** Instagram isteği reddettiğinde (ör. Vercel sunucularından) fotoğraf yedek bir kaynaktan alınır; çoğu zaman 400–1080 px. Threads de bundan yararlanır. Sonuçta fotoğrafın güncel olmayabileceği belirtilir; servis durumu yalnızca küçük boyut gelebildiğinde “Kısıtlı” görünür.

### Değiştirilenler
- Sonuç kartı sadeleşti: “Platform sınırı” ve “Yöntem” satırları kaldırıldı; “En büyük” rozeti görselin üzerine taşındı.
- Platform sayısı (ana sayfa, paylaşım görseli) artık listeden otomatik hesaplanır.

### Güvenlik
- Görsel aktarıcı adresleri şifreli: fotoğrafın kaynak adresi sayfada görünmez ve aktarıcı yalnızca sunucunun ürettiği adresleri kabul eder.

## [1.8.1] - 2026-10-04

### Düzeltilenler
- Instagram (ve Threads) erişimi engellediğinde var olan hesaplar yanlışlıkla “Profil bulunamadı” görünüyordu; artık “Platform isteği engelledi” gösterilir.

## [1.8.0] - 2026-10-04

Arama motorları ve paylaşım önizlemeleri için hazırlık.

### Eklenenler
- **SEO:** Her sayfaya başlık, açıklama, anahtar kelimeler ve canonical adres; arama motorları için `sitemap.xml` ve `robots.txt`.
- **Paylaşım önizlemesi:** Bağlantı WhatsApp, X, Discord gibi yerlerde paylaşıldığında görünen görsel (Open Graph / Twitter kartı).
- **Yapılandırılmış veri:** Ana sayfada uygulama bilgisi, SSS sayfasında soru-cevaplar (Google'da zengin sonuç için).
- **Uygulama simgesi:** iPhone ana ekran simgesi ve web uygulaması bildirimi (manifest).

### Değiştirilenler
- SSS'ye “Instagram fotoğrafları neden bazen çok küçük geliyor?” sorusu eklendi.

## [1.7.0] - 2026-10-04

Arama artık gerçek verilerle çalışıyor. API anahtarı ya da üçüncü taraf servis kullanılmaz; her platform kendi herkese açık sayfalarından okunur.

### Eklenenler
- **Gerçek veri:** 10 platformun tamamı için profil fotoğrafı sağlayıcıları.
  - GitHub: açık avatar adresi.
  - YouTube: kanal sayfası; fotoğraf **orijinal boyutta** gelir.
  - X: profil sayfasının bağlantı önizlemesi; orijinal boyut.
  - TikTok, Twitch, Telegram, Pinterest, Snapchat, Instagram: herkese açık profil sayfası.
  - Threads: Threads hesapları Instagram fotoğrafını kullandığı için Instagram üzerinden.
- **Görsel aktarıcı (`/api/proxy`):** Fotoğraflar kendi sunucumuz üzerinden gelir; indirmede doğru dosya adı. Yalnızca izinli platform adreslerine istek atar.
- **Servis durumu:** Her platform için canlı “Çalışıyor / Kısıtlı / Çalışmıyor” göstergesi.
  - Platformlar sayfasında özet ve kart başına durum.
  - Platform seçicide sorunlu platformlarda uyarı noktası; çalışmayan platform seçilince uyarı.
- **Önbellek ve istek sınırı:** Aynı aramalar bir süre tekrar sorgulanmaz; IP başına dakikada 10 arama.
- **Sınır koruması:** Bir platform istek sınırı koyduğunda, sınır kalkana kadar o platforma istek atılmaz (aksi hâlde engel uzuyor).
- “Linki kopyala” artık sonucun paylaşılabilir sayfa adresini kopyalar.

### Değiştirilenler
- Snapchat fotoğrafları 90 px yerine orijinal boyutta (1080 px).
- Bitmoji uyarısı yalnızca sonuç gerçekten Bitmoji olduğunda gösterilir.

### Bilinen sorunlar
- Instagram (ve dolayısıyla Threads) girişsiz isteklere sık sık sınır koyuyor; bu durumda yalnızca küçük boyut (~100 px) gelir.

## [1.6.0] - 2026-10-04

Sürüm notları artık sitede.

### Eklenenler
- **Sürüm notları sayfası:** Tüm sürümler ve planlanan işler tek sayfada; içerik doğrudan bu dosyadan oluşturulur.
- **Sürüm rozeti:** Alt bilgide güncel sürüm numarası; tıklayınca sürüm notlarına gider.

### Bilinen sorunlar
- Geliştirme modunda (Turbopack) 404 sayfalarında Next.js kaynaklı “cannot have a negative time stamp” uyarısı görülebilir; yayındaki siteyi etkilemez. ([vercel/next.js#86060](https://github.com/vercel/next.js/issues/86060))

## [1.5.0] - 2026-10-04

Bir bağlantının başına site adresini yazmak yeterli.

### Eklenenler
- **Profil yolları:** `ppbuyut.vercel.app/instagram.com/kullanici` gibi bir adres açıldığında bağlantı arama kutusuna yerleşir ve arama kendiliğinden başlar.
  - Başında `https://` olan bağlantılar da çalışır.
  - Kısa biçim: `ppbuyut.vercel.app/instagram/kullanici`.
- **Paylaşılabilir sonuçlar:** Arama bitince adres çubuğu `/platform/kullanici` biçimine güncellenir.
- **Desteklenmeyen bağlantılar:** Genel 404 yerine bağlantı kutuda gösterilir ve sebebi yazılır (ör. “Bu site henüz desteklenmiyor.”).

### Düzeltilenler
- 404 sayfası koyu tema seçiliyken açık temada açılıyordu.
- Tema betiği nedeniyle 404 sayfalarında görülen React uyarısı giderildi.

## [1.4.0] - 2026-10-04

Geliştirici ve iletişim bilgileri.

### Eklenenler
- **Geliştirici kartı:** Hakkında sayfasında geliştirici bilgisi, GitHub bağlantısı.
- **E-posta göster / gizle:** Adres tıklanınca görünür; kopyalama ve e-posta gönderme düğmeleri.
- **Bot koruması:** E-posta adresi sayfa kaynağında açık yazmaz, yalnızca tıklanınca çözülür.

### Değiştirilenler
- Kullanım şartlarındaki iletişim bilgisi Hakkında sayfasına yönlendirir.
- Alt bilgide geliştirici adı gösterilir.

## [1.3.0] - 2026-10-04

Yeni menü ve ayrı sayfalar.

### Eklenenler
- **Yeni menü:** Üstten ayrık, cam efektli kapsül; aktif sayfa göstergesi ve mobil açılır menü.
- **Ayrı sayfalar:** Platformlar, SSS ve Hakkında artık kendi sayfalarında.
  - Platformlar: durumların ve yöntemlerin açıklaması.
  - SSS: iki yeni soru ve ilgili sayfalara kısayollar.
  - Hakkında: projenin amacı, nasıl çalıştığı ve ilkeler.
- **404 sayfası:** Kayıp profil temalı özel “sayfa bulunamadı” ekranı.

### Değiştirilenler
- Kullanım şartları `/kullanim-sartlari` adresine taşındı; içindekiler listesi eklendi.
- Ana sayfa sadeleşti: arama ve “Nasıl çalışır” bölümü.

## [1.2.0] - 2026-10-04

Her platform kendi renginde.

### Eklenenler
- **Platform renkleri:** Seçilen platformun marka renklerinde, yavaşça hareket eden arka plan ışıması.
- **Renkli başlık:** “tam boyutta” yazısı platform renkleriyle boyanır.
- Platformlar arasında yumuşak renk geçişi.

### Düzeltilenler
- Varsayılan platform seçili olduğu hâlde ilk açılışta rengi görünmüyordu.

## [1.1.0] - 2026-10-04

Yeni isim: ppbüyüt.

### Değiştirilenler
- Proje adı “PFP Viewer” yerine **ppbüyüt** oldu; logo, sayfa başlıkları ve metinler güncellendi.

## [1.0.0] - 2026-10-04

İlk sürüm: arayüz tamamlandı, veriler henüz sahte (GitHub hariç).

### Eklenenler
- **Arama:** Tek kutulu arama; kullanıcı adı veya profil bağlantısı kabul eder.
  - Bağlantıdan platformu ve kullanıcı adını otomatik tanıma (10 platform).
  - Yalnızca kullanıcı adı girildiğinde platform seçici; seçim tarayıcıda hatırlanır.
  - Sayfanın herhangi bir yerine yapıştırma, tanınan bağlantıda otomatik arama.
  - Klavye kısayolları: `/` odaklan, `Enter` getir, `Esc` temizle.
  - Anlık doğrulama ve Türkçe hata mesajları.
- **Sonuç kartı:** Gerçek çözünürlük, “En büyük” rozeti, tam ekran görüntüleyici, indirme, bağlantı kopyalama, profile gitme.
- **Durum ekranları:** Yükleniyor iskeleti; bulunamadı, istek sınırı, engellendi ve görsel yüklenemedi ekranları.
- **Son aramalar:** Yalnızca tarayıcıda tutulur, tek tek veya toptan silinebilir.
- **Tema:** Açık / koyu tema; seçim hatırlanır, sayfa açılırken yanıp sönmez.
- **Bölümler:** Nasıl çalışır, platform listesi, SSS ve kullanım şartları.

[Yayınlanmamış]: https://github.com/samedcimen/ppbuyut/compare/v1.9.0...HEAD
[1.9.0]: https://github.com/samedcimen/ppbuyut/compare/v1.8.1...v1.9.0
[1.8.1]: https://github.com/samedcimen/ppbuyut/compare/v1.8.0...v1.8.1
[1.8.0]: https://github.com/samedcimen/ppbuyut/compare/v1.7.0...v1.8.0
[1.7.0]: https://github.com/samedcimen/ppbuyut/compare/v1.6.0...v1.7.0
[1.6.0]: https://github.com/samedcimen/ppbuyut/releases/tag/v1.6.0
