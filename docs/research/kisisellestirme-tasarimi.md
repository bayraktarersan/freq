# Kişiye uygun çalışma: tasarım ve ölçüm sınırları

10 Ekim 2026. Bu geliştirme, [önceki kaynaklı pazar araştırmasının](pazar-arastirmasi.md) uyarlama, hata geri bildirimi ve öğrenme yolu bulgularını uygular. EarMaster ve Auralia gibi ürünler zaten kademeli çalışma ve kişiye/öğrenciye göre yönlendirme sunar; adaptasyon yeni bir ürün icadı olarak sunulmaz. Bu belge yeni bir bilimsel literatür taraması veya rakip algoritmalarının bağımsız çözümlemesi değildir.

## Başlangıcı belirleme

Miks yolunda 9 beceri / 18 soru; müzik kulağında 10 beceri / 20 soru; hazırlıkta otomatik değerlendirilebilen 6 beceri / 12 soru. Her becerinin mevcut ilk aşamasından başlanır. İlk doğru yanıttan sonra ikinci soru varsa sonraki aşamadan gelir; yanlış veya boş yanıttan sonra aynı aşamadan yeni örnek gelir. İki doğru cevap ikinci aşamayı önerir. Daha yüksek bir başlangıç düzeyi iki sorudan çıkarılmaz.

Yön, aralık ve majör/minör alıştırmalarında tek mevcut ders vardır; bunlara hayalî üç seviye eklenmedi. Ekran tek aşama olduğunu açıklar. Aday örneklerin doğru/yanlış işaretleri değerlendirme bitmeden gösterilmez; dikte taslağını dinleme değerlendirmede kapatılır. Soru sesini yeniden dinlemek serbesttir. Süre veya hız üzerinden yetenek ölçülmez. Stereo sorularından önce kulaklık ayrımı doğrulanır.

İki soru güvenilir bir tanı/yerleştirme sınavı sayılmaz. Başlangıç önerisi geçicidir. Bilinmeyen soru geçilebilir, değerlendirme duraklatılabilir. Tamamlanmayan yeniden değerlendirme mevcut öneriyi değiştirmez. Biten değerlendirme yanıtlanmış beceriler için yeni başlangıç önerisi sağlar; tamamen geçilen becerilerin önceki önerisi korunur. Önceki puanlar ve hatalar silinmez. Jüri, şan veya çalgı öz değerlendirmeleri otomatik beceri kanıtına çevrilmez.

## Seviye uyarlaması

Her beceri ayrı izlenir. Güncel önerilen seviyede son 10 **yeni** sorudan en az 8 doğru ve en az iki farklı oturum, bir aşama artışa izin verir. Son 6 yeni sorudan en fazla 2 doğru ve en az iki oturum, bir aşama düşüş önerir. İlk aşamada aynı güçlük görüldüğünde hayalî daha alt bir seviye yerine açıklamalı ders örneklerine dönüş önerilir. Seviye değişince kanıt penceresi yeniden başlar. Bir üst/alt seviyeden gelen cevaplar bu pencereye katılmaz; üst aşamayı kendin seçmek, başlangıç önerisini tek yanıtta değiştirmez.

Aynı ders, etkin soru tohumu ve ses kaynağıyla üretilmiş soru ikinci kez bağımsız başarı kanıtı sayılmaz. Oturum tohumu ve indeks aynı soru tohumuna farklı yoldan ulaşıyorsa da tekrar sayılır. Bu kontrol farklı tohumların her zaman tamamen farklı işitsel içerik ürettiği iddiası değildir; mevcut dar içerik ailelerinde örnekler benzeşebilir. Hata tekrarları ayrıca saklanır; düzey yükseltme kanıtı değildir. Tek doğru cevabın ardından zorluğu artırmak ve ezberlenmiş sorularla yüksek seviye vermek önlenir. Hız, tekrar dinleme sayısı veya cihazın ses hazırlama süresi seviye puanına katılmaz. Boş bırakılan kişisel pratik soruları doğruluk oranına katılmaz.

Eşikler **Freq ürün kurallarıdır**. Şans düzeltmeli bir yetenek ölçeği, psikometrik uyarlamalı test, cihazlar arası kalibrasyon veya sınav başarısı tahmini uygulanmadı. İki seçenekli ve daha çok seçenekli becerilerin ham yüzdeleri genel bir müzikal yetenek yüzdesi olarak birleştirilmez. Beceriler arası genel ham doğruluk yalnız çalışma kaydıdır.

## Hata tekrarları

Yeni ders cevapları her beceride özgün soru seed’i, seçilen cevap ve ses kaynağıyla arşivlenir. Mevcut müzik kayıtları da kullanılır. Eski sürümlerde soru ayrıntısı kaydedilmeyen miks yanlışları için özgün ses uydurulmaz; bu cevaplar seviye kanıtına katkı sağlar, ilgili dersle yeni örnekler çalışılır.

İlk tekrar yanlış cevaptan 10 dakika sonra hazır olur. Zamanı gelmiş doğru yanıtın ardından 1, 3 ve 7 günlük aralıklar uygulanır; dördüncü zamanında doğru tekrar kartı kapatır. Erken doğru çalışma takvimi ilerletmez. Yanlış tekrar aynı kartı yeniden 10 dakika sonrasına alır; yeni kopya yaratmaz. Boş bırakma takvimi değiştirmez. Her tekrar aynı soruyu yeniden yanıtlatır; açıklama ve sesle hedef/yanıt karşılaştırması cevap verildikten sonra açılır. Geçmiş sonucu geri dinlemek kayıt yaratmaz.

Bu aralıklar bir başlangıç politikasıdır; kişiye özgü unutma eğrisi veya bilimsel olarak en uygun süre iddiası değildir. Gerçek aktarım ayrıca **yeni örneklerle** izlenir. Günlük plan en fazla iki zamanı gelen tekrar ve kalan yeni sorularla beş soruluk oturum kurar. Öncelik: tekrarlanan güçlük, düşük güncel doğruluk, henüz çalışılmamış veya en uzun süredir çalışılmayan beceri. Kullanıcı dersleri her zaman kendisi seçebilir.

## Kalıcı veri ve pilot

Son 100 kişisel oturum yerelde/JSON yedeğinde saklanır. Mevcut 2.000 ders cevabı / 200 ders sonucu ve sınav atölyesi sınırları korunur. Kayıtlardan seçilen yoldaki en erken 200 açık tekrar gösterilir. Tekrar referansı özgün ses ve oluşturulma zamanını taşır; özgün kişisel oturum saklama sınırından çıksa da tutulmuş tekrar kayıtlarından bekleyen takvim yeniden kurulabilir. Artık hiçbir saklı kayıtta bulunmayan geçmiş sonsuza kadar tutulmaz.

Yedek birleştirme kimlikleri tekilleştirir; aynı çalışmanın ileri kopyasını korur, tamamlananı yeniden açmaz. Aynı kimlikle çelişen cevaplar veya iki farklı yarım kişisel oturum birleştirmeyi durdurur; biri sessizce kaybedilmez. Eski yedek mevcut kişisel verileri silmez. Dil/yol/ses tercihleri korunur. Yeni `personal` alanı ileriye dönük desteklenir; eski uygulama sürümü bu yeni alanı korumayabilir.

Uzman pilotunda değerlendirme başlangıcının uygunluğu, yanlış/boş ayrımı, seviyelerin ses bakımından ayrışması ve bir hafta sonra duyulmamış kaynakta başarı izlenmeli. Mobil cihaz/BT gecikmesi, işitme farklılıkları ve gerçek ekran okuyucuları ayrıca değerlendirilmelidir. Otomatik Chromium/axe kontrolleri bu pilotun yerini tutmaz.
