# 📚 Öğrenci Takip Sistemi - Kullanım Kılavuzu

## 🎯 Ne İşe Yarar?

Bu uygulama, öğrencilerin sınav performanslarını takip etmek, analiz etmek ve raporlamak için tasarlanmış bir sistemdir.

### Ana Özellikler
✅ Sınav sonuçlarını kaydetme  
✅ Öğrenci performansını grafiklerde görüntüleme  
✅ Hedef belirleme ve takip etme  
✅ Performans uyarıları alma  
✅ Profesyonel raporlar yazdırma  
✅ Veri yedekleme ve geri yükleme  

---

## 🚀 Hemen Başlayın

### 1. İlk Açılış
1. **index.html** dosyasını çift tıklayarak açın
2. Tarayıcınızda uygulama açılacaktır
3. İnternet bağlantısı gereklidir (grafikler için)

### 2. Test Verileriyle Başlayın (Önerilir)
Uygulamayı denemek için örnek veriler yükleyin:

1. **test-data-yukle.html** dosyasını açın
2. "Test Verilerini Yükle" butonuna tıklayın
3. 6 öğrenci ve 12 sınav yüklenecektir

### 3. İlk Sınav Girişi
1. **Veri Girişi** sekmesinde olduğunuzdan emin olun
2. Sınav türünü seçin (Lise Hazırlık, TYT, AYT)
3. Öğrenci adını girin
4. Sınav adını ve tarihini girin
5. "+ Ders Ekle" ile dersleri ekleyin
6. Her ders için Doğru, Yanlış, Boş sayılarını girin
7. İsteğe bağlı: Notlar alanına yorum yazın
8. "Sonucu Kaydet" butonuna tıklayın

---

## 📊 Paneli Kullanma

### Panel'e Geçiş
Üst menüden **"Panel"** sekmesine tıklayın

### Filtreleme
- **Sınav Türü:** Hangi sınav türünü görüntülemek istediğinizi seçin
- **Öğrenci:** Belirli bir öğrenciyi veya tümünü seçin
- **Ders:** Hangi dersi analiz etmek istediğinizi seçin
- **Zaman Aralığı:** Son 7/30/90 gün veya özel aralık

### Grafik Yorumlama
- **Çizgi Grafiği:** Zaman içindeki performans değişimini gösterir
- **Üzerine Gelin:** Tam yüzdeyi görmek için noktalara gelin
- **Trend:** Yükselen ↗️, düşen ↘️ veya sabit ➡️

### İstatistik Kartları
- **Analiz Edilen Sınav:** Toplam sınav sayısı
- **Ortalama Başarı:** Genel başarı yüzdesi
- **Toplam Soru:** Çözülen tüm sorular
- **Toplam Doğru:** Doğru cevaplar
- **Eğilim:** Performans yönü (📈 📉 ➡️)

---

## 🎯 Hedef Belirleme

### Hedef Nasıl Belirlenir?
1. Panel'de en alta kaydırın
2. "🎯 Hedef Belirleme" bölümünü bulun
3. Öğrenci seçin
4. Ders seçin
5. Hedef yüzdeyi girin (0-100 arası)
6. "Hedef Belirle" butonuna tıklayın

### Hedef Durumları
- ✅ **Yeşil:** Öğrenci hedefe ulaştı
- ⚠️ **Sarı:** Henüz hedefe ulaşmadı

### Hedef Silme
Hedefin yanındaki **×** butonuna tıklayın

---

## 🔍 Arama ve Filtreleme

### Kayıtlarda Arama
1. "Son Kayıtlar" bölümünün üstündeki arama kutusunu bulun
2. Öğrenci veya sınav adı yazın
3. Sonuçlar anlık filtrelenir

### Toplu Silme
1. ☑️ butonuna tıklayarak toplu modu açın
2. Silmek istediğiniz sınavları işaretleyin
3. "Seçilenleri Sil" butonuna tıklayın
4. Onaylayın

---

## 🖨️ Rapor Yazdırma

### Bireysel Öğrenci Raporu
1. Panel'de öğrenciyi seçin
2. "🖨️ Rapor Yazdır" butonuna tıklayın
3. Yeni pencerede rapor açılır
4. Yazdırmak için Ctrl+P veya PDF olarak kaydet

**Raporda Neler Var:**
- Öğrenci bilgileri
- Genel istatistikler
- Tüm sınav geçmişi tablosu
- Ders bazında performans dökümü

### Sınıf Raporu
1. Panel'de "Tüm Öğrenciler" seçin
2. "🖨️ Rapor Yazdır" butonuna tıklayın
3. Tüm öğrencilerin karşılaştırmalı raporu açılır

**Sınıf Raporunda:**
- Tüm öğrenciler listesi
- Her öğrencinin sınav sayısı
- Ortalama, en yüksek ve en düşük puanlar

---

## 💾 Veri Yönetimi

### Veri Dışa Aktarma (Yedekleme)
1. 💾 butonuna tıklayın
2. JSON dosyası bilgisayarınıza indirilir
3. Bu dosyayı güvenli bir yerde saklayın

### Veri İçe Aktarma (Geri Yükleme)
1. 📁 butonuna tıklayın
2. Daha önce dışa aktardığınız JSON dosyasını seçin
3. Veriler otomatik yüklenir

### Tüm Verileri Temizleme
1. Panel'de en alta gidin
2. "🗑️ Tüm Verileri Temizle" butonuna tıklayın
3. İki kez onaylayın (GERİ ALINAMAZ!)

---

## ⚠️ Performans Uyarıları

Panel'in üstünde otomatik uyarılar görünür:

### Uyarı Türleri
- 🎉 **Yeşil (İyileştirme):** Öğrenci %10'dan fazla gelişme gösterdi
- ⚠️ **Turuncu (Dikkat):** Öğrencinin performansı %50'nin altında
- 📉 **Kırmızı (Düşüş):** Öğrenci %10'dan fazla düştü

### Ne Yapmalı?
- Düşüş gösteren öğrencilerle birebir konuşun
- Motivasyon sorunlarını tespit edin
- Ek destek veya rehberlik sağlayın

---

## 📱 Mobil Kullanım

### Telefon/Tablet'ten Kullanım
- Uygulama mobil cihazlarda tam çalışır
- Tüm özellikler mobilde kullanılabilir
- Sınav sonuçlarını anında girilebilir

### İpuçları
- Yatay modda grafikler daha iyi görünür
- Dokunmatik ile zoom yapılabilir
- İnternet bağlantısı gereklidir

---

## 🔒 Güvenlik ve Gizlilik

### Veri Nerede Saklanır?
- Tüm veriler **tarayıcınızın yerel belleğinde** saklanır
- İnternete gönderilmez
- Başka kimse erişemez

### Veri Kaybını Önleme
1. **Her hafta dışa aktarın** (💾 butonu)
2. Yedekleri birden fazla yere kaydedin:
   - Bilgisayarınız
   - USB bellek
   - Bulut depolama (Google Drive, OneDrive)
   - E-posta ekine gönderin

### Dikkat!
- Tarayıcı verilerini temizlerseniz tüm kayıtlar silinir
- Tarayıcı önbelleğini temizlemeden önce yedek alın

---

## 💡 İpuçları ve Püf Noktaları

### Zaman Kazanma
1. **Son Sınavı Kopyala:** Aynı yapıdaki sınavlar için kullanın
2. **Toplu İşlemler:** Eski sınavları toplu silin
3. **Arama:** Hızlı bulmak için arama özelliğini kullanın

### Daha İyi Analiz
1. **Düzenli Giriş:** Sınavları hemen girin, biriktirmeyin
2. **Notlar Kullanın:** Özel durumları not alın
3. **Hedef Belirleyin:** Her öğrenci için gerçekçi hedefler koyun

### Veli İletişimi
1. Raporları veli toplantılarında kullanın
2. Grafikleri göstererek görselleştirin
3. Hedefleri velilerle birlikte belirleyin

### Dönemlik Kullanım
- **Dönem Başı:** Test verileriyle alışın
- **Dönem İçi:** Düzenli giriş yapın
- **Dönem Sonu:** Tüm veriyi dışa aktarın ve raporlayın
- **Yeni Dönem:** Temiz başlangıç veya eski verileri koruyun

---

## 🆘 Sık Karşılaşılan Sorunlar

### Sayfa Açılmıyor
✅ İnternet bağlantınızı kontrol edin  
✅ Farklı tarayıcı deneyin (Chrome, Firefox, Edge)  
✅ F5 ile sayfayı yenileyin  

### Grafikler Görünmüyor
✅ İnternet bağlantısı var mı?  
✅ Reklam engelleyici kapalı mı?  
✅ Ctrl+Shift+R ile sabit yenileme yapın  

### Veriler Kayboldu
✅ Tarayıcı verilerini temizlediniz mi?  
✅ Yedekten geri yükleyin (📁 butonu)  
✅ Gelecekte düzenli yedek alın  

### Sınav Ekleyemiyorum
✅ Tüm alanları doldurdunuz mu?  
✅ En az bir ders eklediniz mi?  
✅ Aynı sınav zaten kayıtlı mı? (Tekrar kontrolü)  

### Rapor Yazdıramıyorum
✅ Açılan pencere engellendi mi?  
✅ PDF yazıcısı seçili mi?  
✅ Tarayıcı yazdırma iznine sahip mi?  

---

## 📞 Yardım ve Destek

### Dokümantasyon
- **HIZLI-BASLANGIÇ.md** - Temel kullanım
- **TEKNIK-DOKUMAN.md** - Detaylı bilgi
- **TEST-LISTESI.md** - Özellik testi

### Hata Bulduğunuzda
1. Hangi özellikte hata oldu?
2. Ne yaptınız?
3. Ne olmasını bekliyordunuz?
4. Tarayıcı konsolunda (F12) hata var mı?

---

## 🎓 Eğitim Materyalleri

### Video Eğitimler (Yapılacak)
- Temel kullanım
- Panel analizi
- Rapor hazırlama
- Veri yönetimi

### Örnek Senaryolar
1. **Senaryo 1:** İlk sınav girişi
2. **Senaryo 2:** Öğrenci ilerlemesini takip
3. **Senaryo 3:** Veli toplantısı hazırlığı
4. **Senaryo 4:** Dönem sonu raporlama

---

## ✅ Kontrol Listesi

Uygulamayı kullanmadan önce:
- [ ] index.html'i açtım
- [ ] Test verilerini yükledim
- [ ] İlk sınavı başarıyla girdim
- [ ] Paneli görüntüledim
- [ ] Bir hedef belirledim
- [ ] Rapor yazdırdım
- [ ] Veriyi dışa aktardım

Haftada bir:
- [ ] Yeni sınavları girdim
- [ ] Performans uyarılarını kontrol ettim
- [ ] Veriyi yedekledim

Dönem sonunda:
- [ ] Tüm veriyi dışa aktardım
- [ ] Öğrenci raporlarını yazdırdım
- [ ] Sınıf raporunu hazırladım

---

## 🌟 Başarı Hikayeleri

### Örnek Kullanım Senaryoları

**Öğretmen Ayşe Hanım:**
"Öğrencilerimin hangi derslerde zorlandığını hemen görebiliyorum. Performans uyarıları sayesinde sorunları erken fark edip müdahale ediyorum."

**Öğretmen Mehmet Bey:**
"Veli toplantılarında grafikli raporlar gösteriyorum. Veliler çocuklarının gelişimini görsel olarak görmekten çok memnun."

**Öğretmen Zeynep Hanım:**
"Hedef belirleme özelliği harika! Öğrenciler hedeflerine ulaşmak için daha motive oluyorlar."

---

## 📈 İleri Seviye Kullanım

### Toplu Veri Girişi
Birden fazla öğrencinin aynı sınavını giriyorsanız:
1. İlk öğrenciyi girin
2. "Son Sınavı Kopyala" kullanın
3. Sadece öğrenci adını ve puanları değiştirin

### Karşılaştırmalı Analiz
İki öğrenciyi karşılaştırmak için:
1. Birinci öğrencinin raporunu yazdırın
2. İkinci öğrencinin raporunu yazdırın
3. Yan yana koyarak karşılaştırın

### Dönemsel Takip
Her dönem için:
1. Dönem başında hedefler belirleyin
2. Ortada ilerleme raporları alın
3. Sonunda genel değerlendirme yapın

---

## 🎉 Başlayalım!

Artık sistemi kullanmaya hazırsınız!

**İlk adımlar:**
1. test-data-yukle.html ile örnek verileri yükleyin
2. index.html'i açın ve keşfedin
3. Kendi verilerinizi girmeye başlayın

**Başarılar dileriz! 🚀📚**

---

**Sürüm:** 2.0.0  
**Tarih:** Ocak 2026  
**Dil:** Türkçe  
**Platform:** Web Tarayıcı  
**Lisans:** MIT
