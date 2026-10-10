# Ürün planı ve ilk sürüm sınırı

## Kararlaştırılan hedef

Ana odak miks ve prodüksiyon kulağı. Temel müzik kulağı ve konservatuvar / müzik bölümüne hazırlık kendi yollarında yer alır. Türkçe ve İngilizce içerik; web, iOS ve Android hedefleri. Ana ekran tek aktif yol ve bir sonraki pratik gösterir. Navigasyon: Bugün, Yollar, Becerilerim, Profil.

## Çalışan sürüm: 0.6 önizleme

54 pratik / 20 beceri, önce öğretim ardından pratik. Her derste yanıtı görünen bir örnek var. EQ ve ses yüksekliğinde iki örneği, hafıza ve ritimde iki tam örneği dinlemeden yanıt düğmeleri açılmaz. Doğru/yanlış sonrası tekrar dinleme serbesttir; tekrar dinleme puanı değiştirmez. Yarım bırakılmış oturum korunur. Başka pratiğe geçerken uyarı gösterilir; eski yanıtlar beceri kaydında kalır.

0.2'de miks kaynağı seçimi ve yanlış yanıtı ses olarak karşılaştırma eklendi. Üç kaynak farklı sentez dokuları sunar. Yanlış frekans seçilince C örneği o frekansa aynı gain/Q uygular; orijinal, hedef ve seçim aynı anda başlayan, ortalama seviyeleri eşitlenmiş döngülerdir. Kaynak değişikliği başlangıçta yapılır; soru sırasında birden çok değişken eklenmez.

0.3'te yollar içerik ailelerine göre bölümlendi. Ses yüksekliği alıştırmalarında aynı kaynağın yalnızca seviyesi değiştirilir veya aynı bırakılır; göreli fark bilerek korunur. Ritim alıştırmalarında sayımdan sonra dört vuruşlu bir ölçü karşılaştırılır. Vuruş sayısı, tempo ve ses rengi sabittir; bir vuruşun yeri bir alt bölüme kayabilir. Çizim bağımsız soruda cevap verilmeden gösterilmez. Bu alıştırma dinleyerek ayırt etmedir; ritim tekrarı veya dokunma puanı değildir. Her iki yeni beceri ayrı ölçülür ve yedeklenir.

Profil'den yedek geri yükleme, mevcut kayıtları birleştirir. Kimliği aynı olan kayıtlar tekrar sayılmaz; çelişkiler yüklemeyi durdurur. Eski 0.1 yedekleri ve yarım oturumlar desteklenir. Dosyalar sunucuya gönderilmez. Kalıcı veri sınırı 2.000 yanıt / 200 sonuçtur; geri yükleme özeti bunu açıklar.

Miks: EQ bölümünde üç frekans bölgesi → beş frekans noktası → dar bant / yükseltme-kesme; ses yüksekliği bölümünde 6 → 3 → 1 dB. Müzik: melodi ve armonide yön → aralık → majör/minör; ritimde sekizlik bölünme → sus/ters vuruş → onaltılık hareket. Hazırlık: üç → dört → beş notalı karşılaştırma. Bu son yol, gerçek bir kurum sınavının yerine geçen bir deneme değildir.

İlk mobil deneyim HTTPS üstünde kurulabilen PWA. Native mağaza uygulamaları ayrı bir teslimat aşaması. Soru modeli (`src/model.ts`) ve dil içerikleri (`src/content.ts`) tarayıcıdan bağımsız tutuldu; native ses ve kalıcı kayıt adaptörleri henüz yazılmadı.

## Miks yolunun devamı

M0: dinleme ve A/B koşulları. M1: frekans bölgeleri. M2: frekans, yükseltme/kesme, gain/Q. M3: timbre ve masking; solo ile bütün miks. M4: transient/sustain, kompresör attack/release, seviye eşitleme. M5: pan, genişlik, mono ve reverb/delay. M6: birden çok sorun ve ilk müdahale. M7: yeni müzikte gerekçeli uygulama. M3–M5 kısmen paralel olabilir; tek bir zorunlu sıra yaratılmaz.

0.4, M3–M5 için 21 yeni pratik ekler: kompresyon, atak, bırakma, masking, pan/genişlik/mono, reverb ve delay. Beş kaynak, etiketli örnek ayarları, yanlış yanıtta seçilen ayarı çalan C ve yanıttan sonra gerçek buffer ölçümleri bulunur. İleri bölümler açılır başlıklarla düzenlenir; karmaşık tek bir ayar ekranında toplanmaz.

CC0 tek nota/vuruş kayıtlarından hazırlanmış iki akustik düzenleme ve ayrı hedef/eşlik katmanları vardır. Kendi kaydın laboratuvarında ilk sekiz saniye cihazda işlenir; A/B, mono, solo ve işlenmiş WAV indirme kullanılır. Bu alan puansızdır, dosya yedeğe veya sunucuya gönderilmez. Daha geniş müzik/stem kütüphanesi ve M6–M7 bağlam aktarımı ilerleyen kapsamdır. [Araştırma ve ses modelleri](research/ileri-miks-arastirmasi.md).

## Müzik, hazırlık ve makam

0.5, tonal merkez, dizi dereceleri, işlevsel işitme, melodik/ritmik dikte ve ritim tekrarı için üçer seviyeli 18 pratik ekler. Müzik yolunda 24 pratik / altı bölüm bulunur. Dikte girişleri düzenlenebilir ve dinlenebilir; tekrar, dokunma/Space ile bir ölçüyü üretir. Gönderilmiş cevaplar yedeklenir ve Becerilerim altında son beş müzik yanıtı yeniden dinlenir; taslak çıkınca temizlenir. Yanıttan önce hedef çizimi gösterilmez. [Öğretim ve değerlendirme sınırları](research/muzik-kulagi-arastirmasi.md). Minör/kromatik işitme, tam porte/süre diktesi, sesle tekrar ve ileri armoni sonraki içerik ailesidir. Hazırlık paketleri kurumların ilan ettiği formatlara göre yazılır. Makam ayrı bir müzik sistemi olarak seyir, karar/güçlü, bağlama göre entonasyon ve usul içerir; Batı dizisinin farklı isimlerle sunulması yeterli değildir. İçerik için bu alanda uzman ve icracı ortaklığı gerekir.

## Sınav atölyesi önizlemesi ve bekleyen araştırma

Yedi ders ailesi / üçer seviye, öz değerlendirme notları, Sol anahtarlı Do majör 4/4 solfej örneği ve 6/8/10 soruluk süreli ortak deneme çalışır. Ders ve deneme alanları ayrı sekmelerde; eski beş soruluk hafıza pratikleri korunur. Deneme sırasında cevap açılmaz; sonunda her soru geri dinlenir ve eksik beceriye yönlendirilir. Süre, soru sayısı ve dinleme sınırı Freq varsayımıdır. Otomatik sonuç jüri/icra puanı içermez.

Kurumlara özel doğrulanmış kapsam ve denemeler tamamlanmadı. Hacettepe, MSGSÜ, İTÜ, İstanbul, Ankara, Dokuz Eylül, Gazi ve Marmara alanları ortam taslağına eklendi; çalışan erişim açılınca resmî program/yıl kılavuzları karşılaştırılacak. [Araştırma durumu](research/sinav-hazirligi-arastirma-durumu.md).

## Araştırmadan alınan tasarım kararları

Öğretmeden sınamak, zorluk sıçraması, yanlış yanıttan sonra karşılaştırma yetersizliği ve oturum kaybı ürün riskleri olarak ele alındı. Bunlar seçili yorumlarda görülüyor; bütün rakiplerde güncel ve aynı sorun olduğu iddia edilmiyor. TYE'de geri bildirim / düzeltme, SoundGym'de kompresyon ve multitrack, EarMaster'da Türkçe ve adaptasyon zaten mevcut. Freq'in hedefi bunları yeni icat gibi sunmak değil; düzenli bir akışta kaliteli içerik, ses doğruluğu ve gerçek miks aktarımı sağlamak.

## Kullanıcı pilotu

Önce iki dilde derslerin anlaşılmasını, cihazlarda sesin güvenilirliğini, zorluk geçişini ve yanlış yanıttan sonra öğrenmeyi değerlendir. Daha sonra eğitimde duyulmayan kaynaklarda ön test / son test / gecikmeli tekrar uygulanabilir. İlk sürümdeki 10 yanıt / %80 öneri kuralı bir ürün varsayımıdır; bilimsel doğrulama veya sınav başarısı garantisi değildir.

Gerçek iPhone Safari, Android Chrome, Bluetooth ve kablolu kulaklık, arka plana alma, düşük güç modu, VoiceOver / TalkBack ve farklı işitme profilleriyle manuel test gerekir. İlk teslimattaki Chromium testleri bu matrisin tamamını kapsamaz.
