# Ürün planı ve ilk sürüm sınırı

## Kararlaştırılan hedef

Ana odak miks ve prodüksiyon kulağı. Temel müzik kulağı ve konservatuvar / müzik bölümüne hazırlık kendi yollarında yer alır. Türkçe ve İngilizce içerik; web, iOS ve Android hedefleri. Ana ekran tek aktif yol ve bir sonraki pratik gösterir. Navigasyon: Bugün, Yollar, Becerilerim, Profil.

## İlk çalışan sürüm: 0.1

Dokuz seviye / beş beceri, önce öğretim ardından pratik. Her derste yanıtı görünen bir örnek var. EQ'da iki örneği, hafızada iki tam melodiyi dinlemeden yanıt düğmeleri açılmaz. Doğru/yanlış sonrası tekrar dinleme serbesttir; tekrar dinleme puanı değiştirmez. Yarım bırakılmış oturum korunur. Başka pratiğe geçerken uyarı gösterilir; eski yanıtlar beceri kaydında kalır.

Miks: üç frekans bölgesi → beş frekans noktası → dar bant / yükseltme-kesme. Müzik: yön → aralık → majör/minör. Hazırlık: üç → dört → beş notalı karşılaştırma. Bu son yol, gerçek bir kurum sınavının yerine geçen bir deneme değildir.

İlk mobil deneyim HTTPS üstünde kurulabilen PWA. Native mağaza uygulamaları ayrı bir teslimat aşaması. Soru modeli (`src/model.ts`) ve dil içerikleri (`src/content.ts`) tarayıcıdan bağımsız tutuldu; native ses ve kalıcı kayıt adaptörleri henüz yazılmadı.

## Miks yolunun devamı

M0: dinleme ve A/B koşulları. M1: frekans bölgeleri. M2: frekans, yükseltme/kesme, gain/Q. M3: timbre ve masking; solo ile bütün miks. M4: transient/sustain, kompresör attack/release, seviye eşitleme. M5: pan, genişlik, mono ve reverb/delay. M6: birden çok sorun ve ilk müdahale. M7: yeni müzikte gerekçeli uygulama. M3–M5 kısmen paralel olabilir; tek bir zorunlu sıra yaratılmaz.

0.1 yalnızca M0–M2'nin ilk kısmını uygular. Küçük özgün sentez döngüsü ilk etkileşimi doğrular; gerçek müzikte aktarım için lisanslı/özgün çoklu kaynaklar ve stem'ler gerekir.

## Müzik, hazırlık ve makam

Tonal merkez, derece / işlev, ritim, dikte ve ileri armoni sıradaki içerik ailesi. Hazırlık paketleri kurumların ilan ettiği formatlara göre yazılır. Makam ayrı bir müzik sistemi olarak seyir, karar/güçlü, bağlama göre entonasyon ve usul içerir; Batı dizisinin farklı isimlerle sunulması yeterli değildir. İçerik için bu alanda uzman ve icracı ortaklığı gerekir.

## Araştırmadan alınan tasarım kararları

Öğretmeden sınamak, zorluk sıçraması, yanlış yanıttan sonra karşılaştırma yetersizliği ve oturum kaybı ürün riskleri olarak ele alındı. Bunlar seçili yorumlarda görülüyor; bütün rakiplerde güncel ve aynı sorun olduğu iddia edilmiyor. TYE'de geri bildirim / düzeltme, SoundGym'de kompresyon ve multitrack, EarMaster'da Türkçe ve adaptasyon zaten mevcut. Freq'in hedefi bunları yeni icat gibi sunmak değil; düzenli bir akışta kaliteli içerik, ses doğruluğu ve gerçek miks aktarımı sağlamak.

## Kullanıcı pilotu

Önce iki dilde derslerin anlaşılmasını, cihazlarda sesin güvenilirliğini, zorluk geçişini ve yanlış yanıttan sonra öğrenmeyi değerlendir. Daha sonra eğitimde duyulmayan kaynaklarda ön test / son test / gecikmeli tekrar uygulanabilir. İlk sürümdeki 10 yanıt / %80 öneri kuralı bir ürün varsayımıdır; bilimsel doğrulama veya sınav başarısı garantisi değildir.

Gerçek iPhone Safari, Android Chrome, Bluetooth ve kablolu kulaklık, arka plana alma, düşük güç modu, VoiceOver / TalkBack ve farklı işitme profilleriyle manuel test gerekir. İlk teslimattaki Chromium testleri bu matrisin tamamını kapsamaz.
