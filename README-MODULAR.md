# 📦 Mod

üler Mimari Dokümantasyonu

## 🏗️ Proje Yapısı

```
kedy/
├── index.html                 # Ana HTML dosyası
├── style.css                  # Global CSS stilleri
├── test-data-yukle.html       # Test verisi yükleyici (sadece lokal)
├── test-data.json             # Örnek test verileri
│
├── js/                        # JavaScript modülleri
│   ├── firebase-config.js     # 🔥 Firebase & Auth
│   ├── app-state.js           # 🌐 Global state yönetimi
│   ├── app-data.js            # 💾 Veri işleme
│   ├── app-data-entry.js      # ✏️ Form & veri girişi
│   ├── app-entries.js         # 📝 Liste & CRUD
│   ├── app-dashboard.js       # 📊 Dashboard & filtreler
│   ├── app-reports.js         # 📈 Grafikler & raporlar
│   └── app-goals.js           # 🎯 Hedef yönetimi
│
├── md-tr/                     # Türkçe dökümanlar
│   ├── HIZLI-BAŞLANGIÇ.md
│   ├── KULLANIM-KILAVUZU.md
│   ├── OZET.md
│   └── PAYLASIM-REHBERI.md
│
└── md-en/                     # İngilizce dökümanlar
    ├── QUICK-START.md
    ├── ARCHITECTURE.md
    ├── SUMMARY.md
    ├── OPTIMIZATION-NOTES.md
    └── TESTING-CHECKLIST.md
```

---

## 📄 JavaScript Modül Detayları

### 🔥 `firebase-config.js` (496 satır)
**Firebase entegrasyonu ve kimlik doğrulama**

#### Sorumluluklar:
- Firebase SDK başlatma
- Authentication yönetimi
- Realtime Database bağlantısı
- Kullanıcı nickname yönetimi
- Auth state observer
- Auth modal kontrolü

#### Ana Fonksiyonlar:
```javascript
- loginWithEmail(email, password)
- logout()
- isAuthenticated()
- getCurrentUserId()
- getCurrentUserNickname()
- loadUserNickname(uid)
- updateAuthUI()
- enableWriteActions(enabled)
- loadDataFromFirebase()
- saveDataToFirebase()
- saveGoalsToFirebase()
- clearFirebaseData()
- syncLocalToFirebase()
```

#### Global Değişkenler:
```javascript
- currentUser
- currentUserNickname
- isFirebaseReady
- dataLoadedFromFirebase
```

---

### 🌐 `app-state.js` (108 satır)
**Global durum yönetimi ve veri kalıcılığı**

#### Sorumluluklar:
- Uygulama başlatma
- localStorage yönetimi
- Firebase senkronizasyonu
- Event listener'lar kurma

#### Ana Fonksiyonlar:
```javascript
- loadData()
- saveData()
- loadGoals()
- saveGoals()
- initializeApp()
- setupEventListeners()
```

#### Global Değişkenler:
```javascript
- exams = []
- studentGoals = {}
- editingExamId = null
- bulkMode = false
- selectedExams = new Set()
```

---

### 💾 `app-data.js` (150 satır)
**Veri işleme ve yardımcı fonksiyonlar**

#### Sorumluluklar:
- Veri dışa/içe aktarma
- localStorage temizleme
- Öğrenci dropdown doldurma
- Ders seçenekleri listesi

#### Ana Fonksiyonlar:
```javascript
- exportData()
- importData(event)
- clearAllData()
- populateStudentDropdown()
```

#### Sabitler:
```javascript
LESSON_OPTIONS = [
  "Türkçe", "Matematik", "Fen", "Sosyal",
  "İngilizce", "Din Kültürü", ...
]
```

---

### ✏️ `app-data-entry.js` (324 satır)
**Form yönetimi ve veri girişi**

#### Sorumluluklar:
- Sekme değiştirme
- Ders satırı ekleme/silme
- Form validasyonu
- Sınav kaydetme/güncelleme
- Öğrenci bilgisi kopyalama

#### Ana Fonksiyonlar:
```javascript
- switchTab(tabName)
- addSubjectRow()
- calculateEmpty(rowId)
- handleFormSubmit(e)
- copyLastExam()
- cancelEdit()
```

#### Özellikler:
- Boş değerler 0 olarak kaydedilir
- Gerçek zamanlı boş hesaplama
- Uploader bilgisi tracking
- Duplicate kontrol

---

### 📝 `app-entries.js` (256 satır)
**Liste görünümü ve CRUD işlemleri**

#### Sorumluluklar:
- Sınav listesi render
- Arama/filtreleme
- Sınav düzenleme
- Sınav silme
- Toplu silme modu

#### Ana Fonksiyonlar:
```javascript
- renderRecentEntries()
- filterEntries()
- editExam(examId)
- deleteExam(examId)
- toggleBulkMode()
- toggleExamSelection(examId)
- deleteSelected()
```

#### Özellikler:
- Uploader nickname gösterimi
- Auth kontrolü silme işlemlerinde
- Bulk mode ile çoklu seçim

---

### 📊 `app-dashboard.js` (180 satır)
**Dashboard ve filtreleme**

#### Sorumluluklar:
- Dashboard güncelleme
- Filtre yönetimi
- Hızlı istatistikler
- Tarih aralığı seçimi

#### Ana Fonksiyonlar:
```javascript
- updateDashboard()
- updateGradeFilter()
- handleDateRangeChange()
- updateQuickStats()
- getFilteredExams()
```

---

### 📈 `app-reports.js` (450 satır)
**Grafikler ve görselleştirme**

#### Sorumluluklar:
- Chart.js entegrasyonu
- 4 farklı grafik tipi
- Grafik sekmeleri
- Dinamik veri yükleme

#### Grafik Türleri:
```javascript
1. Line Chart - Zaman bazlı performans
2. Radar Chart - Ders bazlı yeterlilik
3. Bar Chart - Sınav karşılaştırma
4. Heatmap - Konu bazlı analiz
```

#### Ana Fonksiyonlar:
```javascript
- renderPerformanceChart()
- renderRadarChart()
- renderBarChart()
- renderHeatmap()
- switchChartTab(tabName)
```

---

### 🎯 `app-goals.js` (120 satır)
**Hedef yönetimi**

#### Sorumluluklar:
- Hedef belirleme
- Hedef silme
- Hedef listesi gösterimi
- Hedef karşılaştırma

#### Ana Fonksiyonlar:
```javascript
- setGoal()
- renderGoals()
- deleteGoal(studentName, subject)
```

---

## 🔄 Veri Akışı

### Sınav Ekleme Akışı
```
User Input (Form)
    ↓
handleFormSubmit()
    ↓
Auth Check (isAuthenticated)
    ↓
Data Validation
    ↓
Add uploadedBy & uploadedByNickname
    ↓
exams.push(newExam)
    ↓
saveData() → localStorage
    ↓
saveDataToFirebase() → Firebase DB
    ↓
renderRecentEntries()
    ↓
updateQuickStats()
```

### Firebase Sync Akışı
```
Page Load
    ↓
initializeApp()
    ↓
Firebase Auth Check
    ↓
loadUserNickname(uid)
    ↓
updateAuthUI()
    ↓
loadDataFromFirebase()
    ↓
Firebase Realtime Listener
    ↓
Auto Update on Changes
```

---

## 🔐 Auth & Security

### Public Access (Read)
- Tüm ziyaretçiler sınav sonuçlarını görüntüleyebilir
- Grafik ve raporlar herkese açık
- Hedefler görüntülenebilir

### Authenticated Access (Write)
- Sadece giriş yapanlar veri ekleyebilir
- Sadece giriş yapanlar veri düzenleyebilir
- Sadece giriş yapanlar veri silebilir

### Firebase Database Rules
```json
{
  "rules": {
    ".read": true,
    "exams": { ".write": "auth != null" },
    "goals": { ".write": "auth != null" },
    "users": { ".read": true, ".write": false }
  }
}
```

---

## 💾 Veri Modelleri

### Exam Object
```javascript
{
  id: 1234567890,
  gradeLevel: "Lise Hazırlık",
  studentName: "Ayşe Yılmaz",
  examName: "Deneme 1",
  date: "2025-12-15",
  notes: "İyi bir performans",
  subjects: [
    {
      lesson: "Matematik",
      topic: "Denklemler",
      total: 30,
      correct: 25,
      wrong: 3,
      empty: 2
    }
  ],
  uploadedBy: "uid123",
  uploadedByNickname: "Ahmet Hoca",
  uploadedAt: "2025-12-15T10:30:00Z",
  lastEditedBy: "uid456",
  lastEditedByNickname: "Mehmet Hoca",
  lastEditedAt: "2025-12-16T14:20:00Z"
}
```

### Goals Object
```javascript
{
  "Ayşe Yılmaz": {
    "Matematik": 85,
    "Türkçe": 90
  }
}
```

### User Object (Firebase)
```javascript
users/
  uid123/
    nickname: "Ahmet Hoca"
```

---

## 📝 Önemli Notlar

### Test Data
- `test-data-yukle.html` **sadece localStorage'a** yazar
- Firebase'e test verileri **yüklenmez**
- Yerel test için tasarlanmıştır

### Nickname Priority
1. **Firebase Auth displayName** (en yüksek öncelik)
2. **Realtime Database users/uid/nickname**
3. **Email prefix** (otomatik fallback)

### Offline Support
- localStorage her zaman güncel tutulur
- Firebase bağlantısı kesilirse localStorage kullanılır
- Tekrar bağlanınca otomatik senkronize olur

---

## 🎨 Stil ve UI

### CSS Organization
```
style.css (1471 satır)
├── Global Variables
├── Layout & Container
├── Form Components
├── Cards & Stats
├── Charts & Visualizations
├── Auth UI (Modal, Status, Buttons)
├── Responsive Design
└── Animations
```

### Responsive Breakpoints
- Desktop: > 768px
- Mobile: ≤ 768px
- Small Mobile: ≤ 480px

---

## 🚀 Performance

### Optimizations
- DOM query caching
- Debounced search
- Lazy chart rendering
- Efficient array operations
- Minimal re-renders

### Memory Management
- Chart destroy on tab switch
- Event listener cleanup
- Proper closure usage

---

## 🔮 Gelecek Geliştirmeler

### Planlanan Özellikler
- [ ] PDF rapor export
- [ ] Email bildirimleri
- [ ] Öğrenci profil sayfaları
- [ ] Detaylı analitik dashboard
- [ ] Mobil uygulama
- [ ] OCR ile sınav sonucu okuma (experimental)

---

<div align="center">
  <sub>Modüler, ölçeklenebilir, bakımı kolay mimari</sub>
</div>
