# Freq

Türkçe ve İngilizce, miks odaklı kulak pratiği. Web ve telefonda kullanılabilen ilk çalışan prototip.

## Dosyalar nerede?

Bu projenin hedef deposu **bayraktarersan/freq**. Kaynak kod `src/`, görseller `public/`, araştırma ve ürün notları `docs/` altında. Cloud ortamındaki proje klasörü `/workspace/freq`.

GitHub kaynak kodu saklar. Uygulamayı telefonda bir bağlantıyla denemek için ayrıca web yayını gerekir. GitHub'a kod göndermek, web sitesini kendiliğinden yayımlamaz. Bu sürüm statik bir site olarak GitHub Pages, Netlify veya Vercel üzerinde çalışabilir.

## Bilgisayarında dene

Node.js **24 LTS** kur. Projeyi GitHub'dan klonla veya kaynak ZIP paketini aç. `freq` klasöründe terminal aç:

```sh
npm ci
npm run dev
```

Terminalde gösterilen adresi **kendi bilgisayarındaki** tarayıcıda aç. Kulaklık kullan, rahat bir ses seviyesi seç. Başka bir bilgisayardaki cloud terminalinin adresi doğrudan telefonunda açılmayabilir.

1. **Bugün → Pratiğe başla** ile frekans bölgeleri dersini aç.
2. Yanıtı gösterilen örneği A/B arasında geçiş yaparak dinle.
3. **Hazırım, dinleyelim** ile beş soruluk pratiğe başla.
4. Her soruda A ve B'yi dinle, değişen bölgeyi seç. Yanıttan sonra EQ eğrisi görünür.
5. **Yollar** bölümünde müzik kulağı ve melodik hafıza çalışmalarını dene.
6. **TR / EN** ile dili değiştir; **Becerilerim** bölümünde kendi yanıtlarını gör.

Üretim çıktısını denemek için:

```sh
npm run build
npm run preview
```

`dist/` yayımlanabilir dosyalardır. `index.html` dosyasını çift tıklayarak açmak yerine HTTP sunucusu kullan; modüller ve çevrimdışı önbellek `file:` adreslerinde düzgün çalışmaz.

## Telefonunda dene

En kolay ortak deneme, `dist/` klasörünü HTTPS ile yayımlamak ve verilen bağlantıyı telefonda açmak. [Yayınlama adımları](docs/deneme-ve-yayin.md).

- iPhone: Safari → Paylaş → Ana Ekrana Ekle.
- Android: Chrome → menü → Uygulamayı yükle / Ana ekrana ekle.
- İlk ziyaret ve çevrimdışı önbelleğin kurulmasından sonra bu sürümdeki pratikler internetsiz de çalışır.
- Ekran kilitlenince veya uygulama arka plana gidince ses durur. Geri geldiğinde dinlemeyi sen başlatırsın.

Bu sürüm bir **PWA**'dır; App Store / Google Play paketi değildir. iOS ve Android mağaza uygulamaları ürün hedefidir. Henüz gerçek iPhone/Android donanımında doğrulama yapılmadı. Tarayıcı testi, kulaklıkla gerçek cihaz dinleme testinin yerine geçmez.

## Bu sürümde çalışanlar

| Yol | Seviyeler |
| --- | --- |
| Miks ve prodüksiyon | 1: bas/orta/tiz; 2: beş frekans noktası; 3: dar bantta yükseltme/kesme |
| Temel müzik kulağı | 1: ses yönü; 2: aralıklar; 3: majör/minör akor |
| Sınava hazırlık | 1: üç notalı; 2: dört notalı; 3: beş notalı melodik hafıza |

Her pratikte açıklama, yanıtı görünen örnek, beş soru, tekrar dinleme, geri bildirim ve sonuç var. Seviyeleri doğrudan seçebilirsin. Ana ekrandaki öneri, bir seviyede son 10 yanıtın en az 8'i doğruysa sonraki seviyeye geçer. Bu geçici ürün kuralı bilimsel olarak doğrulanmış bir ustalık ölçütü değildir.

EQ örnekleri uygulamada üretilen özgün bir davul/bas/arpej döngüsüdür. A ve B aynı ses saati anında başlar; ortalama RMS seviyeleri eşitlenir ve ortak tepe payı uygulanır. RMS eşitleme her kaynakta algısal ses yüksekliğinin kusursuz eşit olduğu anlamına gelmez; sonraki pilotta farklı kaynaklarla kontrol edilmeli.

İlerleme bu tarayıcının `localStorage` alanına kaydedilir. Hesap, sunucu, mikrofon veya bulut eşitlemesi yok. Kayıtlar dil değişiminden etkilenmez, yarım kalan oturum yeniden açılabilir. Profil'den JSON dışa aktarımı yapılabilir; **geri içe aktarma henüz yok**. Tarayıcı verileri silinirse kayıtlar kaybolur. Yeni bir HTTPS adresine geçmek de ayrı kayıt alanı oluşturur.

## Sonraki kapsam

Gerçek miks/stem kaynakları, masking, kompresyon, stereo, ritim/dikte, işlevsel işitme, makam/usul ve kurumlara özgü sınav paketleri sonraki içerik aşamalarıdır. Makam/usul uzmanla yazılmalı; bu sürümde bu alanlar için hazır pratik bulunmuyor. Tam kapsam ve araştırma: [ürün planı](docs/urun-plani.md), [pazar araştırması](docs/research/pazar-arastirmasi.md), [43 ürünlük matris](docs/research/rakip-matrisi.csv).

## Geliştirme ve kontroller

React + TypeScript + Vite; Web Audio API. Ses motoru tarayıcıya bağlı, soru/ilerleme ve iki dilde içerik ayrı modüllerde. Native uygulamalarda içerik ve soru modeli yeniden kullanılabilir; Web Audio motoru için ayrıca native adaptör gerekir.

```sh
npm run typecheck
npm test
npm run build
npx playwright install chromium
npm run test:e2e
```

Cloud ortamındaki sistem Chromium'u için `CHROMIUM_PATH=/usr/bin/chromium npm run test:e2e` kullanılır. Linux'ta Playwright tarayıcısının sistem bağımlılıkları ayrıca gerekebilir.

Tarayıcı testleri gerçek Web Audio buffer'larını, A/B zamanlamasını, dokuz seviyenin geri bildirimini, kayıt/yenileme, dil değişimi, çevrimdışı kullanım, alt klasör yayını, klavye ve mobil görünümü kontrol eder. Otomatik erişilebilirlik kontrolü manuel ekran okuyucu testinin yerine geçmez.
