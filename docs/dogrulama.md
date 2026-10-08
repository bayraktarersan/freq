# Doğrulama kayıtları

## 0.2

8 Ekim 2026 UTC, Node.js 24 ve sistem Chromium'u ile.

| Kontrol | Sonuç |
| --- | --- |
| TypeScript ve üretim build'i | Geçti |
| Soru, ses materyali, eski kayıt ve yedek birleştirme testleri | 54 / 54 geçti |
| Tarayıcı / gerçek Web Audio işlev testleri | 29 / 29 geçti |
| Üç ses kaynağında seçim, yenileme ve kaynakla kayıt | Geçti |
| Üç kaynakta A/B RMS farkı | 0.001 dB altında |
| Yanlış yanıttaki A/B/C başlangıcı | Üçünde aynı zaman damgası |
| A/B/C RMS farkı ve tepe payı | 0.001 dB altında; tepe en fazla 0.720001 |
| Dosya düğmesinden gerçek yedek indirme, sıfırlama ve geri yükleme | Aynı yanıt ve yarım oturum geri geldi |
| İkinci yedek yüklemesi ve sayfa yenileme | Kayıtlar ikinci kez sayılmadı ve korundu |
| Eski 0.1 yedeği, yüklemeyi iptal, bozuk/çelişen/yeni şema/çok büyük dosya | Geçti; reddedilen dosyalar ilerlemeyi değiştirmedi |
| Mobil kaynak seçimi ve karşılaştırma ekranı | 390 px'te yatay taşma yok |
| Mobil karşılaştırma ve geri yükleme penceresi için otomatik erişilebilirlik | Seçilen WCAG 2 A/AA ve 2.1 AA kurallarında ihlal bulunmadı |
| Dokuz seviye, dil, çevrimdışı kullanım ve alt klasör yayını | Önceki işlev kontrolleri tekrar geçti |

Mobil açıklama ve örnek panelinin grid içindeki doğal genişliği ekranı taşıyordu. Çocuk panellerin küçülmesine izin verilerek düzeltildi; taşma gizlenmedi. Kaynak seçimi ekranı yeniden test edildi.

Sentez dokularının fiziksel dinleme kalitesi, iPhone/Android donanımı, Bluetooth, manuel ekran okuyucu ve gerçek müzikte eğitim etkisi hâlâ ayrı pilot kontrolleridir. Native mağaza paketleri bu sürüme dahil değildir. Uzak GitHub CI ve canlı yayın bu yerel sonuçlardan hareketle çalıştırılmış sayılmaz.

## 0.1 (önceki sürüm)

8 Ekim 2026 UTC, bu cloud ortamında Node.js 24 ve sistem Chromium'u ile.

| Kontrol | Sonuç |
| --- | --- |
| TypeScript + üretim build'i | Geçti |
| Soru, oturum, bozuk kayıt ve ses materyali testleri | 26 / 26 geçti |
| Gerçek tarayıcı / Web Audio işlev testleri | 19 / 19 geçti |
| Türkçe / İngilizce geçişi ve kayıt koruma | Geçti |
| Dokuz seviyede ses, yanlış yanıt ve tekrar dinleme | Geçti |
| Beş soruluk oturum, yenileme ve tek sefer puanlama | Geçti |
| EQ buffer RMS farkı | 0.001 dB altında |
| EQ A/B başlama zamanı | Aynı Web Audio zaman damgası |
| EQ buffer tepe değeri | 0.720001 altında |
| Çevrimdışı yeniden açma ve ses | Geçti |
| Alt klasörden yükleme ve çevrimdışı kullanım | Geçti |
| 390 px mobil görünüm, yatay taşma ve klavye | Geçti |
| Axe otomatik WCAG 2 A/AA + 2.1 AA kontrolü | Ana ekran, ders, soru, geri bildirim ve profil için seçilen kurallarda ihlal bulunmadı |

İlk çevrimdışı testte statik sunucunun `Vary: Origin` başlığı, modül isteklerini kurulum önbelleğiyle eşleştirmeyi engelledi. Yalnızca uygulamanın kendi aynı origin build dosyalarında `ignoreVary` ile eşleştirme yapılarak düzeltildi. Son testte hem kök URL hem `/freq/` alt klasörü internetsiz açıldı ve gerçek ses çaldı.

Doğrulanmayanlar: iPhone Safari / iOS ana ekran kurulumu, Android cihaz kurulumu, fiziksel hoparlör/kulaklık ve Bluetooth, manuel VoiceOver/TalkBack, native iOS/Android paketleri, gerçek kurum sınavı kapsamı, eğitim etkisi ve farklı müziklerde beceri aktarımı. Başsız Chromium'un ses buffer üretmesi, bir insanın ses kalitesini dinleyerek onayladığı anlamına gelmez.

GitHub Actions ve web yayını için dosyalar hazırlanmıştır; uzak CI ve canlı site, bu yerel test sonuçlarıyla çalıştırılmış sayılmaz.
