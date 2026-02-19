# 📥 📤 Veri İthalatı ve İhracatı Rehberi

## 🎯 Amaç

Sınav verilerinizi JSON formatında dışa aktarabilir, başka sistemlerden aktarılan verileri içe aktarabilir ve tüm verileri buluta (Firebase) senkronize edebilirsiniz.

---

## 📤 Verileri Dışa Aktarma (Export)

### Sınav Verilerini Dışa Aktarma

1. **Raporlar ve Veri Yönetimi** bölümüne gidin
2. **💾 Sınav Verilerini İndir** butonuna tıklayın
3. JSON dosyası otomatik olarak konumunuza indirilecektir (örn: `sinav-verileri-2025-02-19.json`)

### Hedefleri Dışa Aktarma

1. **Raporlar ve Veri Yönetimi** bölümüne gidin
2. **🎯 Hedefleri İndir** butonuna tıklayın
3. Hedefler JSON dosyası otomatik olarak indirilecektir

### Dışa Aktarılan Dosya Formatı

```json
[
  {
    "id": 1234567890,
    "gradeLevel": "Lise Hazırlık",
    "studentName": "Ayşe Yılmaz",
    "examName": "Deneme 1",
    "date": "2025-02-19",
    "notes": "İyi bir performans",
    "subjects": [
      {
        "lesson": "Matematik",
        "topic": "Denklemler",
        "correct": 25,
        "wrong": 3,
        "empty": 2,
        "total": 30
      }
    ],
    "uploadedBy": "uid123",
    "uploadedByNickname": "Ahmet Hoca",
    "uploadedAt": "2025-02-19T10:30:00Z"
  }
]
```

---

## 📥 Verileri İçe Aktarma (Import)

### Hazırlık

1. **Giriş yapıldığından emin olun** 🔐
   - Sağ üstte yeşil duruma göstergeniz olmalı
   - Takma adınız (nickname) görüntülenmelidir

2. **JSON dosyası hazırlayın**
   - Dışa aktarılmış bir dosya kullanabilirsiniz
   - Veya kendi JSON dosyanızı oluşturabilirsiniz (aşağıdaki formata uyarak)

### Sınav Verilerini İçe Aktarma

1. **Raporlar ve Veri Yönetimi** bölümüne gidin
2. **📁 Sınav Verilerini Yükle** butonuna tıklayın
3. JSON dosyasını seçin
4. Sistem otomatik olarak:
   - ✅ Verileri doğrulayacak (eksik bilgi olanları atlayacak)
   - ✅ Tekrarları kontrol edecek (aynı sınav iki kez yüklenmeyecek)
   - ✅ Yükleme bilgisini ekleyecek (kim tarafından yüklendi)
   - ✅ localStorage'a kaydedecek (yerel yedekleme)
   - ☁️ Firebase'e yükleme yapacak (bulut senkronizasyonu)
   - 🔄 Grafikleri güncelleyecek

### Hedefleri İçe Aktarma

1. **Raporlar ve Veri Yönetimi** bölümüne gidin
2. **🎯 Hedefleri Yükle** butonuna tıklayın
3. JSON dosyasını seçin
4. Hedefler otomatik olarak buluta yüklenir

---

## 📋 JSON Dosya Örnekleri

### Tek Sınav (Basit Format)

```json
{
  "studentName": "Ahmet Demir",
  "examName": "Deneme 2",
  "date": "2025-02-20",
  "gradeLevel": "Lise Hazırlık",
  "notes": "Matematikte başarılı",
  "subjects": [
    {
      "lesson": "Matematik",
      "topic": "Trigonometri",
      "total": 25,
      "correct": 20,
      "wrong": 3,
      "empty": 2
    },
    {
      "lesson": "Fizik",
      "topic": "Elektrik",
      "total": 20,
      "correct": 17,
      "wrong": 2,
      "empty": 1
    }
  ]
}
```

### Çoklu Sınavlar (Batch Format)

```json
[
  {
    "studentName": "Ayşe Yılmaz",
    "examName": "Deneme 1",
    "date": "2025-02-15",
    "gradeLevel": "Lise Hazırlık",
    "subjects": [
      {
        "lesson": "Türkçe",
        "topic": "Edebiyat",
        "total": 25,
        "correct": 22,
        "wrong": 2,
        "empty": 1
      }
    ]
  },
  {
    "studentName": "Mehmet Demir",
    "examName": "Deneme 1",
    "date": "2025-02-15",
    "gradeLevel": "Lise Hazırlık",
    "subjects": [
      {
        "lesson": "Matematik",
        "topic": "Cebir",
        "total": 30,
        "correct": 24,
        "wrong": 4,
        "empty": 2
      }
    ]
  }
]
```

### Hedefler Formatı

```json
{
  "Ayşe Yılmaz": {
    "Matematik": 85,
    "Türkçe": 90,
    "Fen": 80
  },
  "Mehmet Demir": {
    "Matematik": 75,
    "İngilizce": 88
  }
}
```

---

## ✅ Geçerli Bilgiler

### Zorunlu Alanlar
- `studentName` - Öğrenci adı (zorunlu)
- `examName` - Sınav adı (zorunlu)
- `date` - Tarih, YYYY-MM-DD formatında (zorunlu)
- `gradeLevel` - Sınıf/seviye (zorunlu)
- `subjects` - En az 1 ders (zorunlu)

### Ders Bilgileri (Subject)
- `lesson` - Ders adı (zorunlu)
- `topic` - Konu adı (zorunlu)
- `total` - Toplam soru sayısı (zorunlu)
- `correct` - Doğru cevap sayısı (varsayılan: 0)
- `wrong` - Yanlış cevap sayısı (varsayılan: 0)
- `empty` - Boş bırakılan sayısı (otomatik hesaplanır: total - correct - wrong)

### İsteğe Bağlı Alanlar
- `notes` - Sınav notları
- `uploadedBy` - Yükleyen kişi UID (otomatik eklenir)
- `uploadedByNickname` - Yükleyen kişi adı (otomatik eklenir)
- `uploadedAt` - Yükleme tarihi (otomatik eklenir)

---

## ⚠️ Önemli Notlar

### Tekrarlama Kontrolü
- Aynı öğrenci, sınav adı ve tarih kombinasyonu iki kez yüklenmez
- Tekrar saptanırsa uyarı alırsınız

### Hata Ayıklama
- Geçersiz kayıtlar otomatik olarak atlanır
- Konsol (F12) hatayı görüntülemek için ayrıntılı bilgi sağlar
- Dosya formatı hatalı ise detaylı hata mesajı alırsınız

### Offline Kullanım
- Veriler her zaman localStorage'a kaydedilir (cihazda saklı)
- İnternet yoksa, veriler buluta yüklenmedikçe buluta gitmez
- İnternet bağlandığında ☁️ Buluta Yükle butonunu kullanın

### Firebase Senkronizasyonu
- Import otomatik olarak Firebase'e yükler (giriş yapılıysa)
- Tüm değişiklikler gerçek zamanlı olarak senkronize olur
- Diğer cihazlarda otomatik olarak güncellenir

---

## 🔄 İş Akışı Örneği

### Senaryo: Başka Bir Sistemden Verileri Aktarma

```
1. Başka sistemden sınav verilerini .json olarak dışa aktarın
   ↓
2. Bu siteyi açın ve giriş yapın
   ↓
3. "📁 Sınav Verilerini Yükle" butonuna tıklayın
   ↓
4. JSON dosyasını seçin
   ↓
5. Sistem otomatik olarak:
   - Verileri doğrular
   - Tekrarları kontrol eder
   - Buluta yükler (Firebase)
   ↓
6. Grafikler ve raporlar otomatik güncellenir
   ↓
7. Başka cihazlarda verileri görüntüleyebilirsiniz
```

---

## 💡 İpuçları

### En İyi Uygulamalar

1. **Düzenli Yedekleme**
   - Verilerinizi haftada bir kez dışa aktarın
   - Bilgisayarınızda yedek saklayın

2. **Batch İthalatı**
   - Çok sayıda veri varsa, hepsi birden yükleyin
   - Sistem otomatik tekrarları filtreler

3. **Saçılmayan Veriler**
   - Excel'den JSON'a dönüştürmek için CSV → JSON dönüştürücü kullanın
   - Formata dikkat edin

4. **Kontrol Etme**
   - İthalattan sonra grafikleri kontrol edin
   - Hatalı kayıtları manuel olarak düzeltin

---

## 🆘 Sorun Giderme

### Problem: "Geçersiz dosya formatı" hatası

**Çözüm:**
- JSON dosyasının geçerli olduğunu kontrol edin (online JSON doğrulayıcı kullanın)
- Gereken alanları kontrol edin (studentName, examName, date, gradeLevel)
- Her öğrencinin en az 1 dersi olmalı

### Problem: Veriler yüklenmedi ama hata yoktu

**Çözüm:**
- Giriş yaptığınızdan emin olun
- Konsolu açın (F12) ve hata mesajlarını kontrol edin
- Tekrar kayıt kontrol edin (uyarı mesajı olabilir)

### Problem: Buluta (Firebase) yüklenmedi

**Çözüm:**
- İnternet bağlantısını kontrol edin
- Giriş yapıldığını kontrol edin
- Verilerin localStorage'da olduğunu kontrol edin
- "☁️ Buluta Yükle" butonunu manuel olarak tıklayın

---

## 📞 Yardım

Sorularınız varsa:
- Konsolu açın (F12 → Console tab)
- Hata mesajlarını kontrol edin
- Buradaki örnekleri takip edin

---

<div align="center">
  <sub>İçe/Dışa aktarma sistemi ile verileriniz her zaman güvende</sub>
</div>
