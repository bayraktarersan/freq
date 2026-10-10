# Sınava hazırlık: araştırma durumu ve uygulama sınırı

10 Ekim 2026. Kullanıcı, Türkiye'nin önde gelen konservatuvarlarının karşılaştırılmasını ve ortak sınav becerilerinden çıkarım yapılmasını istedi.

## Doğrulama henüz tamamlanmadı

Çalışan ortamın ağ politikası üniversite alan adlarını içermiyor. `https://konservatuvar.hacettepe.edu.tr/` isteği proxy bağlantısında `403 Forbidden` ile engellendi; sayfanın içeriği okunamadı. Google araması JavaScript yönlendirme sayfası döndürdü; Bing RSS aramaları konu dışı sonuçlar verdi. Bu çıktılar sınav kapsamının kanıtı kabul edilmedi.

Mevcut 53 araştırma alan adı ve paket yöneticisi izinleri korunarak aşağıdaki sekiz kurumun ana alan adı ve alt alan adları ortam taslağına kaydedildi. Taslak kaydı başarılı, fakat çalışan ortamın 11 numaralı sürümünde bu eklemeler henüz uygulanmış değil. Ortam ayarlarında kaydetme/yayınlama sonrası erişim tekrar doğrulanmalı.

| Araştırma hedefi | Resmî kurum alanı | İncelenecek ayrım | Durum |
| --- | --- | --- | --- |
| Hacettepe Üniversitesi | hacettepe.edu.tr | Konservatuvarın program ve öğrenim düzeyine göre koşulları | Kılavuz okunamadı |
| Mimar Sinan Güzel Sanatlar Üniversitesi | msgsu.edu.tr | Müzik programı, solfej/teori ve icra kapsamı | Kılavuz okunmadı |
| İstanbul Teknik Üniversitesi | itu.edu.tr | Türk Musikisi programları, işitme/ritim ve program özgü görevler | Kılavuz okunmadı |
| İstanbul Üniversitesi | istanbul.edu.tr | Konservatuvarın program ve öğrenim düzeyi ayrımları | Kılavuz okunmadı |
| Ankara Üniversitesi | ankara.edu.tr | Konservatuvarın programa göre sınav aşamaları | Kılavuz okunmadı |
| Dokuz Eylül Üniversitesi | deu.edu.tr | Konservatuvarın işitme ve icra ayrımları | Kılavuz okunmadı |
| Gazi Üniversitesi | gazi.edu.tr | Müzik öğretmenliği ile konservatuvar sınavını ayırma | Kılavuz okunmadı |
| Marmara Üniversitesi | marmara.edu.tr | Müzik öğretmenliği ve program özgü koşullar | Kılavuz okunmadı |

Tablo bir sıralama değildir. Öğretmenlik programları, konservatuvarlar arasındaki ortaklığı otomatik olarak varsaymak yerine kapsam farkını araştırmak için dahil edildi. Bu aşamada hiçbir kurumun soru sayısı, süre, dinletme sayısı, eleme puanı, eser sayısı veya puan ağırlığı doğrulanmış olarak sunulmuyor. 2026 kılavuzu bulunamazsa erişilen kılavuzun gerçek yılı açıkça gösterilecek; eski kılavuz güncel kabul edilmeyecek.

## Bağımsız olarak geliştirilen hazırlık alanı

Yedi ders ailesinin üçer seviyesi var: tek ses/aralık tekrarı; iki/üç/dört ses; ezgi hafızası; ritim hafızası; melodik/ritmik dikte; deşifre/solfej; eser/jüri provası. Bunlar genel çalışma yöntemleridir; belirli bir kurumun doğrulanmış sınav paketi değildir.

İşitme pratikleri, önceki kaynaklı [müzik kulağı çalışmasına](muzik-kulagi-arastirmasi.md) dayanır. Kuruma özel ağırlıklandırılmış puanlama eklenmedi. Sesle tekrar, solfej ve icra için öz değerlendirme listesi ve öğretmenle inceleme yöntemi var; mikrofonla otomatik değerlendirme yok. Solfej örnekleri Sol anahtarı, Do majör, 4/4 ve dörtlüklerle sınırlı. Dikte girişi derece ve vuruş konumudur; tam porte/süre yazımı değildir.

Ortak hazırlık denemesi 6/8/10 sorudan oluşur. Toplam süre sırasıyla 6/8/10 dakika, her soruda en fazla üç dinleme başlangıcı. Bu sayılar **Freq çalışma ayarlarıdır**. Kesilen dinleme haktan düşer; ses başlatma hatası haktan düşmez. A/B hafıza sorusunda A ve B bir dinleme turunda tamamlanır. Süre sayfa kapansa da devam eder. En az bir tur tamamlanmadan cevap gönderilemez; soru boş bırakılabilir. Doğru yanıtlar ve geri dinleme deneme sonunda açılır. Sonuç yalnız uygulamadaki işitme görevlerinin doğruluğunu gösterir; kabul puanı veya kabul olasılığı değildir.

## Erişim açılınca yapılacak iş

1. Her kurum için program adı, öğrenim düzeyi ve erişilen kılavuzun yılını doğrula; lise/ortaokul veya lisansüstü kılavuzunu lisans sınavıyla karıştırma.
2. Resmî duyuru/PDF'yi indir; URL, erişim tarihi, SHA-256 ve ilgili sayfa/bölümü kaydet. Tam belgeyi yayımlamadan kısa, kaynak gösteren kapsam özeti yaz.
3. İşitme/teori/dikte, ritim/ezgi tekrar, solfej, icra ve görüşme görevlerini ayrı çıkar. Açıklanmayan soru sayısı, süre veya dinleme sayısını uydurma.
4. Ortak görevleri karşılaştır; program özgü repertuvar ve makam/usul görevlerini ayrı tut. Uzman gerektiren görevleri öğretmen provası olarak göster.
5. `src/exam-content.ts` içindeki `examProfiles` listesine yalnız doğrulanmış, yıl içeren kimlikle profil ekle. `sources` alanında resmî URL, yıl, sayfa/bölüm ve kontrol tarihini doldur. Uygulama uyarlamasını resmî görevden açıkça ayır.
6. Deneme planını kurumun doğrulanmış işitme kapsamına göre kur; desteklenmeyen görevler için ders/prova yönlendirmesi ekle. Resmî puan ağırlıklarını otomatik doğruluk oranıyla karıştırma.
7. Bir konservatuvar/işitme öğretmeniyle örnekleri ve seviye geçişlerini kontrol et. Bu uzman kontrolü de henüz yapılmış değildir.

Bu belge tamamlanmış bir kurum araştırması değildir; doğrulama engelini ve devam işini kayıt altına alır.
