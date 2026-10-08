# Değişiklik Günlüğü

Bu projedeki önemli değişiklikler bu dosyada tutulur.

Biçim [Keep a Changelog](https://keepachangelog.com/tr-TR/1.1.0/) esas alınarak hazırlanmıştır ve proje [Anlamsal Sürümleme](https://semver.org/lang/tr/) kullanır.

## [Yayınlanmamış]

### Değiştirilenler
- **Daha hızlı ilk görünüm:** Ana sayfa başlığının giriş animasyonu artık JavaScript yüklenmeyi beklemeden başlıyor; başlık ilk çizimde görünür.
- **Sonuç sayfasında kayma yok:** Profil bağlantısıyla açılan sayfalarda yükleme kartı baştan yerinde; sonuç gelince alttaki bölümler aşağı kaymıyor.
- **Erişilebilirlik:** Soluk gri yazıların kontrastı okunaklılık sınırına çekildi (açık ve koyu tema). Mobildeki Yapıştır düğmesine, logoya ve dil bağlantısına ekran okuyucular için uygun adlar verildi.

## [1.22.1] - 2026-10-08

### Değiştirilenler
- Spotify sanatçılarında sonuç kartı, tam ekran görünüm ve son aramalar `@artist:…` kimliği yerine sanatçının adını gösterir; indirilen dosyanın adı da sanatçı adıyla verilir.

## [1.22.0] - 2026-10-08

Tumblr desteği.

### Eklenenler
- **Tumblr desteği** (16. platform): Blog avatarı, Tumblr'ın resmi API'si üzerinden anahtarsız, en büyük boyutta (512 px). `ad.tumblr.com` ve `tumblr.com/ad` biçimindeki bağlantılar ve yer imi desteklenir; `/pp-buyutme/tumblr` ve `/en/profile-picture/tumblr` sayfaları eklendi.

## [1.21.0] - 2026-10-08

SoundCloud desteği.

### Eklenenler
- **SoundCloud desteği** (15. platform): Profil fotoğrafı, SoundCloud'un gösterdiği 500 px kopya yerine yüklenen orijinal dosya olarak gelir (çoğu zaman 1000–2000 px ve üstü). `soundcloud.com/kullanici` bağlantıları ve yer imi desteklenir; `/pp-buyutme/soundcloud` ve `/en/profile-picture/soundcloud` sayfaları eklendi.

## [1.20.0] - 2026-10-08

Spotify desteği.

### Eklenenler
- **Spotify desteği** (14. platform): Kullanıcı profillerinin (en fazla 300 px) ve sanatçıların (640 px) fotoğrafı, Spotify'ın sakladığı en büyük boyutta. `open.spotify.com/user/…` ve `open.spotify.com/artist/…` bağlantıları (dil önekli `/intl-tr/…` olanlar dahil) ve yer imi desteklenir; `/pp-buyutme/spotify` ve `/en/profile-picture/spotify` sayfaları eklendi.

## [1.19.0] - 2026-10-06

Kick desteği.

### Eklenenler
- **Kick desteği** (13. platform): Kick'in resmi geliştirici API'si üzerinden, ppbüyüt adına kayıtlı bir uygulama anahtarıyla; kullanıcı girişi gerekmez. Fotoğraf, Kick'in gösterdiği 350 px kopya yerine yayıncının yüklediği asıl dosya olarak gelir (çoğu zaman 1000 px ve üstü). `kick.com/kanal` bağlantıları ve yer imi desteklenir; `/pp-buyutme/kick` ve `/en/profile-picture/kick` sayfaları eklendi.

## [1.18.0] - 2026-10-06

Bluesky, sayfa hızı ölçümü ve daha akıllı yer imi.

### Eklenenler
- **Bluesky desteği** (12. platform): Bluesky'ın herkese açık resmi API'si üzerinden, anahtarsız ve girişsiz. Fotoğraf uygulamadaki 1000 px kopya yerine yüklendiği boyutta (en fazla 2000 px) gelir. `bsky.app/profile/…` bağlantıları, `ad.bsky.social` ya da kendi alan adlı kullanıcı adları ve yer imi desteklenir; `/pp-buyutme/bluesky` ve `/en/profile-picture/bluesky` sayfaları eklendi.
- **Sayfa hızı ölçümü (Vercel Speed Insights):** Gerçek ziyaretçilerde sayfa hızı ölçülür; kullanıcı adları gönderilmez.

### Değiştirilenler
- **Ortak servis durumu:** Platformların çalışıyor/çalışmıyor bilgisi Redis'te tutulur; tüm sunucular aynı durumu gösterir ve platformlar daha az yoklanır.

### Düzeltilenler
- **Yer imi yalnızca profil sayfalarında açılır:** Instagram ana sayfası ya da `/explore` gibi profil olmayan sayfalarda ppbüyüt'ü açmak yerine “Bu sayfa bir profil değil” uyarısı gösterir. Yer imi, sitedeki bağlantı tanıma kurallarının aynısını kullanır.

## [1.17.0] - 2026-10-06

Kendi alan adı.

### Değiştirilenler
- **Yeni adres: [ppbuyut.com](https://ppbuyut.com).** Eski adres (ppbuyut.vercel.app) tüm sayfalarıyla kalıcı olarak yeni adrese yönlenir; paylaşılmış bağlantılar ve yer imleri çalışmaya devam eder.

## [1.16.1] - 2026-10-06

Arama kutusunun giriş formu sanılmasının önüne geçildi.

### Değiştirilenler
- **Arama kutusu giriş formu gibi görünmüyor:** Tarayıcılar alanı “kullanıcı adı” etiketinden giriş formu sanıp kayıtlı hesap bilgilerini öneriyordu. Etiket “Profil bağlantısı ya da @hesap” oldu; alan arama kutusu olarak işaretlendi ve şifre yöneticilerinin onu atlaması sağlandı.

### Eklenenler
- Arama kutusunun altında “ppbüyüt hiçbir zaman şifre istemez” uyarısı ve SSS'de “ppbüyüt şifremi ister mi?” sorusu.

## [1.16.0] - 2026-10-06

Güvenlik denetiminden çıkan iyileştirmeler.

### Eklenenler
- **Görsel aktarıcıya istek sınırı:** `/api/proxy` IP başına dakikada 60 yeni istekle sınırlı. Önbellekten gelen görseller bu sınırı tüketmez. Adrese rastgele parametre ekleyip önbelleği atlayarak sunucuyu toplu görsel indirmek için kullanma yolu kapandı.
- **Görsel bağlantılarına süre:** Aktarıcı bağlantıları 2 saat geçerli; kopyalanıp paylaşılan bir bağlantı bir süre sonra çalışmaz.

### Değiştirilenler
- **Daha kapsamlı içerik güvenlik politikası (CSP):** Script, stil, görsel, font ve bağlantılar yalnızca sitenin kendisinden (ve hakkında sayfasındaki GitHub avatarı için GitHub'dan) yüklenebilir. Eklentiler (`object`), başka sitelere form gönderimi ve `<base>` değiştirme engelli.

## [1.15.0] - 2026-10-06

Güvenlik iyileştirmeleri ve ortak önbellek.

### Eklenenler
- **Güvenlik başlıkları:** Tüm sayfalarda `X-Content-Type-Options`, `Referrer-Policy`, `X-Frame-Options`, `Permissions-Policy` ve başka sitelerin ppbüyüt'ü çerçeve içinde açmasını engelleyen CSP (`frame-ancestors 'none'`). Görsel aktarıcı (`/api/proxy`) kendi daha sıkı politikasını korur. `X-Powered-By` başlığı kaldırıldı.

### Değiştirilenler
- **Ortak önbellek ve istek sınırı (Upstash Redis):** Sonuç önbelleği ve dakikada 10 arama sınırı artık tüm sunucularda ortak. Redis ayarlı değilse (yerel geliştirme) ya da yanıt vermezse bellek içi sürüme geri dönülür.
- İstek sınırı için ziyaretçinin IP adresi, istemcinin değiştirebileceği bir başlıktan değil, Vercel'in bildirdiği adresten alınır.

## [1.14.0] - 2026-10-04

Sitenin İngilizce sürümü.

### Eklenenler
- **İngilizce sürüm:** Tüm arayüz ve sayfalar `/en` altında İngilizce: ana sayfa, `/en/platforms`, `/en/faq`, `/en/about`, `/en/terms`. Profil yolları da çalışır (`/en/instagram/kullanici`, `/en/<profil bağlantısı>`).
- **İngilizce platform sayfaları:** `/en/profile-picture/instagram` gibi 11 sayfa, “instagram profile picture viewer” gibi aramalar için.
- **İngilizce sürüm notları** (`/en/changelog`): başlıklar ve tarihler İngilizce, notlar Türkçe.
- **Dil değiştirici:** Üst menüde; bulunduğun sayfanın diğer dildeki karşılığını açar.
- İngilizce paylaşım görseli (`/en/opengraph-image`).
- Yer imi, İngilizce sayfadan sürüklendiğinde profilleri İngilizce sürümde açar ve uyarılarını İngilizce gösterir.

### Değiştirilenler
- Arama motorları için her sayfa diğer dildeki karşılığını bildirir (hreflang); site haritası iki dili de içerir. `<html lang>` artık sunucudan doğru dille gelir.
- Ziyaret istatistiğinde İngilizce profil sayfaları da yalnızca türüyle sayılır (`/en/instagram/[kullanici]`).

### Düzeltilenler
- `/platformlar/abc` gibi yanlış yazılmış sayfa adresleri “desteklenmeyen site” uyarısıyla arama kutusunu açıyordu; artık 404 verir. Açıklama yalnızca gerçekten bağlantıya benzeyen adreslerde (`/instagram.com/explore`, `/https://…`) gösterilir.

## [1.13.0] - 2026-10-04

Telefona uygulama olarak yükleme ve Android Paylaş menüsü.

### Eklenenler
- **Telefona yükleme (PWA):** Site ana ekrana eklenip uygulama gibi açılabiliyor; uygulama ikonları (192/512 px, Android için maskable).
- **Paylaş menüsü (Android):** Yüklenen uygulama, sistem Paylaş menüsünde çıkar. Instagram, TikTok gibi uygulamalarda bir profil paylaşılınca ppbüyüt o profille açılır (`/paylas`). iPhone’da Safari buna izin vermediği için yalnızca ana ekrana ekleme çalışır.
- **“Telefonuna ekle” kartı:** Ana sayfada telefonlarda görünür; Android’de yükleme düğmesi, iPhone’da adım adım anlatım.

## [1.12.0] - 2026-10-04

Ziyaret istatistiği ve otomatik testler.

### Eklenenler
- **Ziyaret istatistiği:** Çerezsiz Vercel Web Analytics. Aranan kullanıcı adları gönderilmez; profil sayfaları yalnızca türüyle sayılır (ör. `/instagram/[kullanici]`). Kullanım şartlarına eklendi.
- **Otomatik testler:** Bağlantı algılama, profil yolları, fotoğraf büyütme kuralları, görsel aktarıcı güvenliği ve istatistik gizliliği için 69 test (`npm test`). Her push’ta GitHub Actions ile testler, tip kontrolü ve lint çalışır.

## [1.11.2] - 2026-10-04

### Eklenenler
- Yandex Webmaster doğrulama etiketi.

## [1.11.1] - 2026-10-04

### Düzeltilenler
- Site adresi Vercel’e eklenen ama henüz çalışmayan bir alan adından alınıyordu; canonical, site haritası ve robots.txt arama motorlarını var olmayan bir adrese yönlendiriyordu. Artık açıkça ayarlanan adres (şimdilik ppbuyut.vercel.app) kullanılır.

## [1.11.0] - 2026-10-04

Arama motorlarında görünmek için: platform sayfaları ve Google doğrulaması.

### Eklenenler
- **Platform sayfaları:** Her platform için ayrı “PP büyütme” sayfası (`/pp-buyutme/instagram` gibi 11 sayfa): o platform seçili arama kutusu, profil bağlantısının nasıl kopyalanacağı, platforma özel sık sorulan sorular.
- **“PP büyütme nedir?”** bölümü ve tüm platform sayfalarına bağlantılar (ana sayfa); Platformlar sayfasındaki kartlar da ilgili sayfaya gider.
- **Arama motoru doğrulaması:** Google Search Console, Bing ve Yandex doğrulama etiketleri ortam değişkenlerinden eklenir.

### Değiştirilenler
- Site başlığı ve açıklaması aranan ifadelere göre yenilendi (“PP Büyütme: Instagram, TikTok ve X Profil Fotoğrafı Büyütme”).
- Site haritası 6 yerine 17 sayfa içeriyor.

## [1.10.0] - 2026-10-04

Gezinirken tek tıkla büyütmek için yer imi.

### Eklenenler
- **Yer imi (bilgisayar):** Ana sayfadaki “ppbüyüt’te aç” butonu yer imleri çubuğuna sürüklenir; desteklenen bir platformda profildeyken tıklanınca ppbüyüt o profille yeni sekmede açılır; başka sitelerde açmaz, desteklenen siteleri listeleyen bir uyarı gösterir.
- **Telegram Web:** `web.telegram.org/k/#@kullanici` bağlantıları tanınır; yer imi Telegram Web’de açık olan sohbetin kullanıcısını açar.

## [1.9.6] - 2026-10-04

### Değiştirilenler
- “Son aramalar” artık bir sonuç gösterilirken de görünür: sonuç kartının altında. Profil bağlantısıyla açılan sayfalarda da (ör. `/instagram/kullanici`) geçmiş kaybolmuyor.

## [1.9.5] - 2026-10-04

### Değiştirilenler
- Sonuç kartındaki “Linki kopyala” butonu kaldırıldı; “Profil” butonu “… profilini aç” olarak tam genişlikte.

### Düzeltilenler
- Butonların üzerine gelince el imleci çıkmıyordu (tema düğmesi, platform seçici vb.).

## [1.9.4] - 2026-10-04

### Düzeltilenler
- Yedek kaynak, daha önce hiç sorulmamış bir Instagram hesabını hazırlarken birkaç saniye bekletiyordu; arama 8 saniyede vazgeçtiği için “Platform isteği engelledi” görünüyordu. Artık daha uzun bekleniyor ve gerekirse bir kez daha deneniyor.

## [1.9.3] - 2026-10-04

### Düzeltilenler
- Facebook, gizli profiller için Vercel sunucularına hata sayfası döndürdüğünde sonuç “Platform isteği engelledi” görünüyor ve Facebook tümüyle “Çalışmıyor” sayılıyordu. Artık “Profil fotoğrafı görünmüyor” gösterilir; servis durumu etkilenmez.
- Facebook’un gizli profilleri giriş sayfasına ikinci kez yönlendirmesi de artık “görünmüyor” olarak değerlendirilir.
- Hata yanıtları kısa bir teknik sebep içerir (sorun teşhisi için).

## [1.9.2] - 2026-10-04

### Düzeltilenler
- Facebook, Vercel sunucularına farklı yanıt verdiği için var olan bir hesap “engelledi”, olmayan bir hesap “gizli” görünebiliyordu. Artık “bulunamadı” yalnızca kesin olduğunda gösterilir; diğer durumlarda hesabın gizli olabileceği ya da olmayabileceği birlikte belirtilir.
- Paylaşım görselinin yazı tipi indirilemezse build artık başarısız olmuyor; varsayılan yazı tipi kullanılıyor.

## [1.9.1] - 2026-10-04

### Düzeltilenler
- Profilini Facebook dışına kapatmış (var olan) hesaplar “Profil bulunamadı” görünüyordu; artık “Profil fotoğrafı görünmüyor” açıklaması gösterilir.

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

[Yayınlanmamış]: https://github.com/samedcimen/ppbuyut/compare/v1.22.1...HEAD
[1.22.1]: https://github.com/samedcimen/ppbuyut/compare/v1.22.0...v1.22.1
[1.22.0]: https://github.com/samedcimen/ppbuyut/compare/v1.21.0...v1.22.0
[1.21.0]: https://github.com/samedcimen/ppbuyut/compare/v1.20.0...v1.21.0
[1.20.0]: https://github.com/samedcimen/ppbuyut/compare/v1.19.0...v1.20.0
[1.19.0]: https://github.com/samedcimen/ppbuyut/compare/v1.18.0...v1.19.0
[1.18.0]: https://github.com/samedcimen/ppbuyut/compare/v1.17.0...v1.18.0
[1.17.0]: https://github.com/samedcimen/ppbuyut/compare/v1.16.1...v1.17.0
[1.16.1]: https://github.com/samedcimen/ppbuyut/compare/v1.16.0...v1.16.1
[1.16.0]: https://github.com/samedcimen/ppbuyut/compare/v1.15.0...v1.16.0
[1.15.0]: https://github.com/samedcimen/ppbuyut/compare/v1.14.0...v1.15.0
[1.14.0]: https://github.com/samedcimen/ppbuyut/compare/v1.13.0...v1.14.0
[1.13.0]: https://github.com/samedcimen/ppbuyut/compare/v1.12.0...v1.13.0
[1.12.0]: https://github.com/samedcimen/ppbuyut/compare/v1.11.2...v1.12.0
[1.11.2]: https://github.com/samedcimen/ppbuyut/compare/v1.11.1...v1.11.2
[1.11.1]: https://github.com/samedcimen/ppbuyut/compare/v1.11.0...v1.11.1
[1.11.0]: https://github.com/samedcimen/ppbuyut/compare/v1.10.0...v1.11.0
[1.10.0]: https://github.com/samedcimen/ppbuyut/compare/v1.9.6...v1.10.0
[1.9.6]: https://github.com/samedcimen/ppbuyut/compare/v1.9.5...v1.9.6
[1.9.5]: https://github.com/samedcimen/ppbuyut/compare/v1.9.4...v1.9.5
[1.9.4]: https://github.com/samedcimen/ppbuyut/compare/v1.9.3...v1.9.4
[1.9.3]: https://github.com/samedcimen/ppbuyut/compare/v1.9.2...v1.9.3
[1.9.2]: https://github.com/samedcimen/ppbuyut/compare/v1.9.1...v1.9.2
[1.9.1]: https://github.com/samedcimen/ppbuyut/compare/v1.9.0...v1.9.1
[1.9.0]: https://github.com/samedcimen/ppbuyut/compare/v1.8.1...v1.9.0
[1.8.1]: https://github.com/samedcimen/ppbuyut/compare/v1.8.0...v1.8.1
[1.8.0]: https://github.com/samedcimen/ppbuyut/compare/v1.7.0...v1.8.0
[1.7.0]: https://github.com/samedcimen/ppbuyut/compare/v1.6.0...v1.7.0
[1.6.0]: https://github.com/samedcimen/ppbuyut/releases/tag/v1.6.0
