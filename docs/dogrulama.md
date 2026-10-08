# İlk sürümün doğrulaması

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
