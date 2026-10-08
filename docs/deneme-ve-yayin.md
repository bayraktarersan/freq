# Freq'i deneme ve yayımlama

## İndirdiğin paketler

- **freq-source.zip**: proje kaynakları, araştırma, testler ve bu yönergeler. Açıp Node.js 24 ile `npm ci`, ardından `npm run dev` çalıştır.
- **freq-web.zip**: `npm run build` sonucunun hazır web dosyaları. ZIP'i aç; içindeki `index.html`, `assets/`, `sw.js`, ikonlar ve manifest birlikte yayımlanmalı.

İlk kullanıcı testi: kulaklık tak; EQ dersinin örneğini dinle; bir doğru ve bir yanlış yanıt ver; yanlış yanıttan sonra tekrar dinle; yarım bırakıp yenile; Türkçe/İngilizce arasında geçiş yap. Sonra ses yönü ve üç notalı hafızayı dene. Kullandığın telefon modeli, tarayıcı ve ses çıkışını not et.

0.2'yi denemek için dersten önce **Ritim ağırlıklı** veya **Arpej ağırlıklı** kaynağı seç. Yanlış bir EQ yanıtı ver; **B: Doğru EQ** ve **C: Seçtiğin EQ** arasında geçiş yap. Profil'den **İlerlemeyi indir** ile yedek al; farklı bir tarayıcıda **Yedekten geri yükle** seç. Birleştirme özetini kontrol et. Aynı dosyayı ikinci kez yüklemek soru sayısını artırmamalı.

## Kod ile çalışan site farklıdır

GitHub deposunda uygulamanın kaynakları ve dokümanları durur. Çalışan bir bağlantı için web barındırma gerekir. Cloud ortamını yayımlamak geliştirme ortamının anlık görüntüsünü kaydeder; uygulamayı internet sitesine dönüştürmez.

## Hazır dosyaları Netlify'da deneme

1. Netlify hesabında elle site yükleme / sürükle bırak yayınlama ekranını aç.
2. **freq-web.zip** dosyasını açıp `index.html` içeren klasörü yükle. Dosyalar bir alt klasöre sıkışmamalı.
3. Netlify'ın verdiği HTTPS adresini bilgisayar ve telefonda aç.
4. İlk açılışı internet açıkken yap. Sonra uçak modunda yeniden açarak çevrimdışı pratiği kontrol et.

Bu adımlar siteyi o hizmete yayımlar; barındırma hesabı ve bağlantı bu ortamda henüz oluşturulmuş değildir. Oturum açmak için hiçbir şifreyi bu sohbete yazman gerekmez.

## GitHub Pages

Depoda `.github/workflows/pages.yml` var. Kod GitHub'a gönderildikten sonra:

1. Depo **Settings → Pages → Build and deployment → Source: GitHub Actions** seç.
2. **Actions → Publish Freq to GitHub Pages → Run workflow** aç. Kaynak kodun bulunduğu dalı seç.
3. İşlem tamamlanınca GitHub'ın gösterdiği yayın bağlantısını aç. Depo ayarları ve planı Pages kullanımına izin vermeli.

Workflow elle başlatılır; kodu göndermek siteyi otomatik olarak yayımlamaz. Araştırma belgeleri web build'ine dahil edilmez. Statik çıktı alt klasör yollarını destekler.

## Vercel / Netlify ile depodan yayın

GitHub deposunu seç; kurulum `npm ci`, build `npm run build`, çıktı klasörü **dist**, Node.js **24**. API anahtarı, veritabanı veya ortam değişkeni gerekmiyor. Uygulama yalnızca statik dosyalarla çalışır.

## Telefona ekleme

- iPhone Safari → Paylaş → Ana Ekrana Ekle.
- Android Chrome → menü → Uygulamayı yükle / Ana ekrana ekle.

Kurulum seçeneği tarayıcı sürümüne göre farklı görünebilir. HTTPS gereklidir. Kayıtlar cihaz ve tarayıcıya özeldir; Safari'deki bir kayıt, başka tarayıcıya veya mağaza uygulamasına kendiliğinden taşınmaz. Telefonda web uygulaması açılması, native iOS/Android ses motorunun test edildiği anlamına gelmez.

## Sürüm güncelleme

Çevrimdışı önbellek her build için içerik karmasıyla sürümlenir. Yeni sürüm, mevcut uygulama pencereleri kapandıktan ve yeniden açıldıktan sonra etkinleşir; bir pratiğin ortasında zorunlu yenileme yapılmaz. Yeni yayından sonra eski görüntü varsa bütün Freq pencerelerini kapatıp bağlantıyı yeniden aç. İlerleme kaydı sürümlü tutulur; rutin güncellemede korunur.
