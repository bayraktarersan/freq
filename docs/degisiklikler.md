# Sürüm değişiklikleri

## 0.3

- Ses yüksekliği için üç seviye: ±6, ±3 ve ±1 dB veya aynı seviye. Üç kaynak seçilebilir; aynı kaynağın A/B örnekleri aynı ses saatinde çalar. Yalnızca seviye değişir; kasıtlı fark RMS eşitlemesiyle kaldırılmaz. Yanıttan sonra göreli dB farkı gösterilir.
- Ritim ayırt etme için üç seviye: sekizlik bölünme, sus/ters vuruş, onaltılık hareket. 100 BPM'de dört sayım ve bir ölçü. Aynı tempo, ses rengi ve vuruş sayısı; B'de tek vuruş bir alt bölüme kayabilir.
- Ritimde iki örnek de tamamlanmadan yanıt açılamaz. Yarıda kesilen örnek tamamlanmış sayılmaz; tamamlanan örnek işaretlenir. Ritim çizimi öğretici örnekte ve yanıt sonrasında gösterilir.
- Miks ve müzik yolları bölüm başlıkları altında düzenlendi. Her bölümün üç seviyesi var; ana ekrandaki sayılar gerçek içeriği yansıtır. Toplam 15 pratik / yedi beceri.
- Yeni beceriler ayrı ölçülür; ses kaynağı, yarım oturum ve sonuçlar yerel kayıt/yedek akışına dahildir. Önceki EQ öneri sırası ve eski oturumların soru hedefleri korunur.
- Türkçe ve İngilizce ders açıklamaları, geri bildirim ve mobil görünüm güncellendi.

Deneme: Yollar → Miks ve prodüksiyon → Ses yüksekliği; Yollar → Temel müzik kulağı → Ritim. Güncel kaynak ve hazır web paketleri 0.3'tür. Pages yayını için yayın workflow'unu yeniden çalıştır.

## 0.2

- EQ dersinin başında üç kaynak seçimi: elektronik groove, ritim ağırlıklı, arpej ağırlıklı. Özgün sentez döngüleri; gerçek kayıt/stem kütüphanesi sonraki aşamada.
- Yanlış yanıttan sonra C örneği: seçilen frekansa hedefle aynı gain/Q uygulanır. A, B ve C aynı zaman çizgisinde, ortalama seviyeleri eşitlenmiş olarak çalar. Klavyeden C ile de karşılaştırılabilir.
- Kaynak seçimi, yarım pratik ve sonuçlarla birlikte kaydedilir. Eski oturumlarda elektronik groove kullanılır; soru hedefleri korunur.
- Profil'den JSON yedeği geri yükleme. Dosya önce doğrulanır, özet gösterilir; kayıtlar birleştirilir, kopyalar tekrar sayılmaz. Çelişen kayıtlar yüklenmez. Dil/ses tercihleri ve cihazdaki farklı yarım pratik korunur.
- 0.1 düz JSON yedekleri ve 0.2 sürümlü yedek biçimi desteklenir. Dosya boyutu sınırı 2 MB, kayıt sınırı 2.000 yanıt / 200 sonuçtur.
- Mobil ders açıklamasındaki yatay taşma giderildi; modal açıkken arka plan gezinmesi ve dinleme kısayolları durur.

Yayın: kaynak kodu GitHub'dan güncelle veya yeni ZIP paketini aç. GitHub Pages kullanılıyorsa yayın workflow'unu yeniden çalıştır. Çevrimdışı uygulamanın eski pencerelerini kapatıp yeniden aç; rutin sürüm güncellemesi mevcut kayıtları korur.

## 0.1

İlk çalışan prototip: Türkçe/İngilizce, üç öğrenme yolu, dokuz seviye, açıklama ve örnek, beş soruluk pratik, yerel kayıt, EQ eğrisi ve çevrimdışı PWA.
