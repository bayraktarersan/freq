# Freq

Türkçe ve İngilizce, miks odaklı kulak pratiği. Web ve telefonda kullanılabilen prototip, sürüm **0.4**.

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
2. Ses kaynağını seç; yanıtı gösterilen örneği A/B arasında geçiş yaparak dinle.
3. **Hazırım, dinleyelim** ile beş soruluk pratiğe başla.
4. Her soruda A ve B'yi dinle, değişen bölgeyi seç. Yanıttan sonra EQ eğrisi görünür. Yanlış yanıtta **C: Seçtiğin EQ** açılır; B ile C'yi karşılaştırarak kendi seçiminin nasıl duyulduğunu dinle.
5. **Yollar → Miks ve prodüksiyon → Ses yüksekliği** ile 6, 3 ve 1 dB karşılaştırmalarını dene. **Temel müzik kulağı → Ritim** bölümünde iki örneği sonuna kadar dinle; yanıtından sonra kalıpları incele.
6. **Miks ve prodüksiyon → Dinamikler / Masking / Stereo alan / Reverb ve delay** başlıklarını aç. Etiketli örnekleri sırayla dinle, sonra pratiğe geç. Yanlış yanıtta C senin seçtiğin ayarı çalar; ses ölçümleri yalnızca yanıttan sonra açılır. Stereo ve ping-pong için sol/sağ kulaklık kontrolünü doğrula.
7. Miks yolundaki **Laboratuvarı aç** ile hazır akustik örneği veya kendi kaydını kullan. Ayarları değiştir, A/B ve mono ile karşılaştır, işlenmiş WAV önizlemesini indir.
8. **TR / EN** ile dili değiştir; **Becerilerim** bölümünde kendi yanıtlarını gör.

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
| Miks ve prodüksiyon | EQ ve ses yüksekliği; üçer seviyeli kompresyon, attack, release, masking, stereo, reverb ve delay: toplam 27 pratik |
| Temel müzik kulağı | Melodi ve armoni: ses yönü → aralıklar → majör/minör. Ritim: sekizlik bölünme → sus/ters vuruş → onaltılık hareket |
| Sınava hazırlık | 1: üç notalı; 2: dört notalı; 3: beş notalı melodik hafıza |

Toplam 36 pratik, 14 beceri var. Miks yolu altı açılır bölümde düzenlenir; dinamikler ve reverb/delay içinde beceri adları açıkça görünür. Her becerinin üç seviyesi vardır. Her pratikte açıklama, yanıtı görünen örnek, beş soru, tekrar dinleme, geri bildirim ve sonuç var. Seviyeleri doğrudan seçebilirsin. Ana ekrandaki öneri, bir seviyede son 10 yanıtın en az 8'i doğruysa sonraki seviyeye geçer. Önceki EQ öneri sırası korunur; tüm yeni bölümler doğrudan da seçilebilir. Bu geçici ürün kuralı bilimsel olarak doğrulanmış bir ustalık ölçütü değildir.

Miks pratiklerinde beş kaynak seçilebilir: üç özgün sentez döngüsü ve iki CC0 gerçek akustik kayıt düzenlemesi (piyano/vurmalılar). Kaynak, beş soru boyunca sabit kalır ve kayıtla birlikte korunur. VSCO 2 Community Edition kayıtlarından hazırlanmış kısa özgün düzenlemeler, tam ticari şarkı veya canlı grup multitrack’i değildir. [Krediler, lisans ve kayıt doğrulamaları](public/audio/recordings.json); [CC0 lisansı](public/audio/CC0-1.0.txt).

EQ’da A orijinal, B hedef EQ'dur. Yanlış yanıttan sonra C, seçtiğin frekansa hedefle aynı gain/Q uygulanmış halidir. A/B/C aynı ses saati anında başlar; EQ örneklerinin ortalama RMS seviyeleri eşitlenir ve ortak tepe payı uygulanır. RMS eşitleme her kaynakta algısal ses yüksekliğinin kusursuz eşit olduğu anlamına gelmez; fiziksel dinleme pilotunda ayrıca kontrol edilmeli.

Ses yüksekliği çalışmasında beş kaynak da kullanılabilir. A ve B aynı döngünün aynı zamanında çalar; B yalnızca sinyal seviyesi bakımından farklıdır veya A ile aynıdır. ±6, ±3 ve ±1 dB farklar bilerek korunur; RMS eşitleme yapılmaz. Ortak tepe payı kırpılmayı önler. Yanıttan sonra göreli dB farkı gösterilir; kulaklıktaki mutlak ses basıncı ölçülmez.

Ritimde 100 BPM ve dört sayımdan sonra bir ölçü duyulur. A/B aynı tempoda, aynı ses renginde ve aynı sayıda vuruş içerir. B ya aynıdır ya da tek vuruş bir alt bölüme kaymıştır. İki örnek tamamlanmadan yanıt açılamaz; durdurulan örnek tamamlanmış sayılmaz. Dinlenen örnek işaretlenir. Kalıpların çizimi yalnızca öğretici örnekte ve yanıt sonrasında görünür. Bu dinleyerek ritim ayırt etme pratiğidir; dokunma doğruluğu veya sınavdaki ritim tekrarı ölçülmez.

İleri derslerde her soruda tek parametre değişir: dinamiklerde kompresyon oranı / attack / release; masking’de eşlik katmanının EQ bölgesi; stereo’da pan / side miktarı / polarite; reverb’de miktar / nominal kuyruk / ön gecikme; delay’de aralık / feedback / ping-pong. Etiketli örnekler parametre farkını önceden dinletir. Soruda ayarlar gizlidir; yanıttan sonra ayar tablosu ve gerçek buffer’ın tepe zarfı / crest factor’ı açılır. Stereo’da korelasyon da gösterilir. A/B/C iki kanalın ortak RMS enerjisiyle eşitlenir; ortak tepe payı 0.72’dir. Masking’de solo hedef, stereo’da mono toplamı dinlenebilir. Reverb/delay için dört saniyelik kuyruk alanı eklenir. Bu eğitim modelleri ticari plugin emülasyonu veya her kaynak için önerilen ayarlar değildir. [Ayrıntılı araştırma ve teknik sınırlar](docs/research/ileri-miks-arastirmasi.md).

**Kendi kaydınla çalışma:** laboratuvar mono/stereo ses dosyalarını cihazda okur; en fazla 20 MiB, ilk sekiz saniye. WAV önerilir; diğer biçimler tarayıcı desteğine bağlıdır. Kompresyon parametreleri, eşlik EQ, pan, width, polarite, reverb ve delay serbestçe denenir. A referans, B ayarın; işlenmiş stereo PCM16 WAV indirilebilir. Masking için zaman başlangıçları aynı olan ayrı hedef ve eşlik dosyaları gerekir. Mono kayıtta mevcut side bileşeni olmadığı açıklanır. Ses dosyaları sunucuya gönderilmez, localStorage/JSON yedeğine eklenmez ve laboratuvardan çıkınca veya yenileyince yeniden seçilir. Bu alanda puanlama veya otomatik miks değerlendirmesi yoktur.

İlerleme bu tarayıcının `localStorage` alanına kaydedilir. Hesap, sunucu, mikrofon veya bulut eşitlemesi yok. Kayıtlar dil değişiminden etkilenmez, yarım kalan oturum yeniden açılabilir. Profil'den JSON yedeği indirip **Yedekten geri yükle** ile başka tarayıcıya taşıyabilirsin. Dosya cihazında okunur; sunucuya yüklenmez.

Geri yükleme öncesinde onay özeti gösterilir. Kayıtlar mevcut ilerlemeyle birleştirilir; aynı yanıt ve sonuç iki kez sayılmaz. Mevcut dil/ses tercihleri korunur. İki farklı yarım pratik varsa cihazdaki oturum devam eder; mevcut oturum yoksa yedekteki geri alınır. Aynı oturumun iki kopyası varsa daha ileri kopya kullanılır. Bozuk, çelişen, desteklenmeyen veya 2 MB'dan büyük dosyalar mevcut kayıtları değiştirmez. 0.1 sürümünün eski JSON yedekleri de desteklenir.

Son 2.000 yanıt ve 200 tamamlanmış pratik tutulur. Tarayıcı verileri silinirse kayıtlar kaybolur; bu işlemden önce yedeği indir. Yeni bir HTTPS adresine geçmek ayrı kayıt alanı oluşturur; yedeği orada geri yükleyebilirsin.

## Sonraki kapsam

Daha geniş lisanslı multitrack kütüphanesi, bir arada miks sorunları, yeni kayıtlarda beceri aktarımı, ritim tekrarı/dikte, işlevsel işitme, makam/usul ve kurumlara özgü sınav paketleri sonraki içerik aşamalarıdır. Makam/usul uzmanla yazılmalı; bu sürümde bu alanlar için hazır pratik bulunmuyor. Tam kapsam ve araştırma: [ürün planı](docs/urun-plani.md), [pazar araştırması](docs/research/pazar-arastirmasi.md), [43 ürünlük matris](docs/research/rakip-matrisi.csv).

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

Tarayıcı testleri gerçek Web Audio buffer'larını, beş kaynakta seviye eşleştirmeyi, A/B/C zamanlamasını, 36 pratiğin geri bildirimini, kasıtlı dB farklarını, ritim örneklerindeki vuruş yerlerini ve tam dinleme koşulunu, gerçek dosya indirme/geri yüklemeyi, kayıt/yenileme, dil değişimi, çevrimdışı kullanım, alt klasör yayını, klavye ve mobil görünümü kontrol eder. Yeni stereo DSP, attack/release, delay zamanlaması, reverb kuyruğu, gerçek kayıt hash’leri, kendi ses dosyasıyla çalışma, ayrı eşlik ve WAV indirme de doğrulanır. Otomatik erişilebilirlik kontrolü manuel ekran okuyucu testinin yerine geçmez.

Akustik WAV’lar depoda hazırdır; standart kurulumda Python veya ffmpeg gerekmez. Yalnızca kayıtları yeniden hazırlamak isteyen geliştirici için: Python 3 + NumPy + ffmpeg ile `python3 scripts/prepare-recordings.py`. Script sabit commit’teki dört ham kaydı hash kontrolüyle indirir ve `public/audio/` dosyalarını üretir.
