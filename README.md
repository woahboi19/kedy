# 🎓 Öğrenci Takip Sistemi (Student Analyzer)

**Modern, bulut tabanlı öğrenci performans takip ve analiz platformu**

[![Live Demo](https://img.shields.io/badge/Demo-Live-brightgreen)](https://woahboi19.github.io/kedy/)
[![Firebase](https://img.shields.io/badge/Backend-Firebase-orange)](https://firebase.google.com/)

## ✨ Özellikler

### 🔐 Kimlik Doğrulama & Yetkilendirme
- **Firebase Authentication** ile güvenli giriş sistemi
- **Kullanıcı takma adları** (nickname) desteği
- **Rol tabanlı erişim**: Herkes görüntüleyebilir, sadece öğretmenler düzenleyebilir
- Sınav yükleyen kişi bilgisi otomatik kaydedilir

### ☁️ Bulut Senkronizasyonu
- **Firebase Realtime Database** ile anlık veri senkronizasyonu
- Tüm cihazlardan erişim
- Offline çalışma desteği (localStorage yedekleme)
- Otomatik veri yedekleme

### 📊 Veri Yönetimi
- Öğrenci sınav sonuçları girişi
- Ders bazında detaylı analiz (Doğru/Yanlış/Boş)
- Sınav notları ve yorum ekleme
- Hedef belirleme ve takip
- Toplu silme işlemleri

### 📈 Görselleştirme & Raporlama
- **4 farklı grafik türü**:
  - 📉 Çizgi grafik (zaman bazlı gelişim)
  - 🕸️ Radar grafik (ders bazlı performans)
  - 📊 Bar grafik (sınav karşılaştırma)
  - 🔥 Heatmap (konu bazlı analiz)
- Dinamik filtreleme (öğrenci, ders, tarih)
- Hızlı istatistikler ve özet kartlar

### 💾 Veri Taşınabilirliği
- JSON formatında veri dışa aktarma
- JSON dosyasından veri içe aktarma
- Test verisi yükleme özelliği (sadece lokal)

---

## 🚀 Hızlı Başlangıç

### Canlı Demo
Uygulamayı hemen kullanmaya başlayın: **[https://woahboi19.github.io/kedy/](https://woahboi19.github.io/kedy/)**

### Test Verileri ile Başlama (Lokal)
**Not:** Test verileri sadece localStorage'a kaydedilir, buluta yüklenmez.

1. Yerel olarak `test-data-yukle.html` dosyasını açın
2. Test verilerini yükleyin
3. `index.html` dosyasını açın
4. Verileri görüntüleyin (düzenleme için giriş gerekir)

### Yetkili Kullanıcı Olarak Giriş
1. Sağ üstteki **🔐 Giriş** butonuna tıklayın
2. E-posta ve şifrenizi girin
3. Artık sınav ekleyebilir ve düzenleyebilirsiniz

---

## 📖 Detaylı Dökümanlar

### Türkçe
- [📘 Hızlı Başlangıç](md-tr/HIZLI-BAŞLANGIÇ.md) - İlk adımlar ve kurulum
- [📗 Kullanım Kılavuzu](md-tr/KULLANIM-KILAVUZU.md) - Tüm özellikler detaylı
- [📙 Özet](md-tr/OZET.md) - Hızlı referans
- [📕 Paylaşım Rehberi](md-tr/PAYLASIM-REHBERI.md) - GitHub Pages yayınlama

### English
- [📘 Quick Start](md-en/QUICK-START.md) - Getting started guide
- [📗 Architecture](md-en/ARCHITECTURE.md) - Technical architecture
- [📙 Summary](md-en/SUMMARY.md) - Feature overview
- [📕 Optimization Notes](md-en/OPTIMIZATION-NOTES.md) - Performance tips
- [✅ Testing Checklist](md-en/TESTING-CHECKLIST.md) - QA checklist

---

## 🛠️ Teknoloji Stack'i

### Frontend
- **HTML5** - Semantik yapı
- **CSS3** - Modern, responsive tasarım
- **JavaScript (ES6+)** - Modüler mimari
- **Chart.js** - Dinamik grafikler

### Backend & Database
- **Firebase Authentication** - Kullanıcı yönetimi
- **Firebase Realtime Database** - NoSQL bulut veritabanı
- **localStorage API** - Offline yedekleme

### Modüler Yapı
```
js/
├── firebase-config.js      # Firebase entegrasyonu ve auth
├── app-state.js           # Global state yönetimi
├── app-data.js            # Veri işleme ve yardımcılar
├── app-data-entry.js      # Form ve veri girişi
├── app-entries.js         # Liste görünümü ve CRUD
├── app-dashboard.js       # Dashboard ve filtreler
├── app-reports.js         # Grafikler ve raporlar
└── app-goals.js           # Hedef yönetimi
```

---

## 🔧 Kurulum (Kendi Sunucunuzda)

### 1. Depoyu Klonlayın

```bash
git clone https://github.com/woahboi19/kedy.git
cd kedy
```

### 2. Firebase Projesi Oluşturun
1. [Firebase Console](https://console.firebase.google.com/)'a gidin
2. Yeni proje oluşturun
3. **Authentication** → Email/Password'ü etkinleştirin
4. **Realtime Database** oluşturun
5. Database kurallarını ayarlayın:
```json
{
  "rules": {
    ".read": true,
    "exams": {
      ".write": "auth != null"
    },
    "goals": {
      ".write": "auth != null"
    },
    "users": {
      ".read": true,
      ".write": false
    }
  }
}
```

### 3. Firebase Config'i Güncelleyin
`js/firebase-config.js` dosyasını açın ve Firebase projenizin config'ini yapıştırın:
```javascript
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT.firebaseapp.com",
    databaseURL: "https://YOUR_PROJECT.firebaseio.com",
    projectId: "YOUR_PROJECT_ID",
    // ...
};
```

### 4. Kullanıcı Oluşturun
**Authentication** panelinden öğretmen kullanıcıları oluşturun.

**Takma Ad Eklemek İçin** (3 yöntem):

#### Yöntem 1: Firebase Auth Display Name (En Kolay)
- Authentication → Users → Kullanıcıyı seç → Edit user → Display name

#### Yöntem 2: Realtime Database
- Database → Data sekmesi → users node'u oluştur:
```json
users/
  USER_UID/
    nickname: "Ahmet Hoca"
```

#### Yöntem 3: Otomatik (Fallback)
- E-posta'nın @ işaretinden önceki kısım otomatik kullanılır

### 5. Yerel Sunucu Başlatın

```bash
# Python ile
python -m http.server 8000

# Node.js ile
npx http-server
```

Tarayıcıda açın: `http://localhost:8000`

---

## 👥 Kullanım Senaryoları

### Öğretmenler İçin
✅ Öğrenci sınav sonuçlarını ekleyin
✅ Hedefler belirleyin ve takip edin
✅ Grafik ve raporlarla ilerlemeyi analiz edin
✅ Notlar ekleyerek öğrencileri değerlendirin

### Veliler İçin
✅ Çocuklarının sınav sonuçlarını görüntüleyin
✅ Ders bazında performansı inceleyin
✅ Zaman içindeki gelişimi takip edin

### Öğrenciler İçin
✅ Kendi performanslarını görüntüleyin
✅ Hangi konularda eksik olduklarını keşfedin
✅ Hedeflere ulaşma durumunu takip edin

---

## 🔒 Güvenlik

- ✅ **Firebase Authentication** ile güvenli giriş
- ✅ **Rol tabanlı erişim kontrolü** (Public read, Auth write)
- ✅ **Database güvenlik kuralları**
- ✅ **API key'ler güvenli** (Firebase API key'leri public olabilir)
- ✅ **HTTPS** ile şifreli bağlantı

---

## 📱 Tarayıcı Desteği

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

---

## 🤝 Katkıda Bulunma

Katkılarınızı bekliyoruz! Lütfen:
1. Repo'yu fork edin
2. Feature branch oluşturun (`git checkout -b feature/AmazingFeature`)
3. Değişikliklerinizi commit edin (`git commit -m 'Add some AmazingFeature'`)
4. Branch'inizi push edin (`git push origin feature/AmazingFeature`)
5. Pull Request açın

---

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

---

## 🐛 Sorun Bildirimi

Bir sorunla karşılaştınız mı? [Issues](https://github.com/woahboi19/kedy/issues) sayfasından bize bildirin.

---

## 📞 İletişim

- **GitHub**: [@woahboi19](https://github.com/woahboi19)
- **Proje**: [kedy](https://github.com/woahboi19/kedy)

---

<div align="center">
  <sub>Built with ❤️ using Firebase & Vanilla JS</sub>
</div>
