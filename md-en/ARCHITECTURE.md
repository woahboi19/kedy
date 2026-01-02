# 🏗️ Architecture Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         BROWSER                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │                    index.html                           │ │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │ │
│  │  │  Entry Tab   │  │  Dashboard   │  │   Header     │ │ │
│  │  │              │  │     Tab      │  │  Navigation  │ │ │
│  │  │ Quick Stats  │  │   Alerts     │  │              │ │ │
│  │  │ Form Entry   │  │   Filters    │  │              │ │ │
│  │  │ Search Bar   │  │   Chart      │  │              │ │ │
│  │  │ Entry List   │  │   Stats      │  │              │ │ │
│  │  │ Bulk Actions │  │   Goals      │  │              │ │ │
│  │  └──────────────┘  └──────────────┘  └──────────────┘ │ │
│  └────────────────────────────────────────────────────────┘ │
│                              ↓                               │
│  ┌────────────────────────────────────────────────────────┐ │
│  │                     style.css                           │ │
│  │  • Base Styles      • Quick Stats     • Alerts         │ │
│  │  • Form Styles      • Bulk Actions    • Goals          │ │
│  │  • Card Layouts     • Search Input    • Reports        │ │
│  │  • Chart Styles     • Date Range      • Responsive     │ │
│  └────────────────────────────────────────────────────────┘ │
│                              ↓                               │
│  ┌────────────────────────────────────────────────────────┐ │
│  │              JavaScript Module System                   │ │
│  │                                                          │ │
│  │  1. app-state.js ← Loads First                         │ │
│  │     ├─ Global Variables (exams, goals, filters)        │ │
│  │     ├─ ocrEnabled Flag (false)                         │ │
│  │     ├─ localStorage Functions                          │ │
│  │     ├─ Event Listener Setup                            │ │
│  │     └─ initializeApp() ← Entry Point                   │ │
│  │                                                          │ │
│  │  2. app-data-entry.js                                  │ │
│  │     ├─ switchTab()                                     │ │
│  │     ├─ addSubjectRow()                                 │ │
│  │     ├─ handleFormSubmit()                              │ │
│  │     ├─ copyLastExam()                                  │ │
│  │     └─ updateQuickStats()                              │ │
│  │                                                          │ │
│  │  3. app-entries.js                                     │ │
│  │     ├─ renderRecentEntries()                           │ │
│  │     ├─ filterEntries()                                 │ │
│  │     ├─ editExam() / deleteExam()                       │ │
│  │     └─ Bulk Actions Functions                          │ │
│  │                                                          │ │
│  │  4. app-dashboard.js                                   │ │
│  │     ├─ updateDashboard()                               │ │
│  │     ├─ renderChart() [Chart.js]                        │ │
│  │     ├─ renderStats()                                   │ │
│  │     ├─ filterByDateRange()                             │ │
│  │     ├─ renderSubjectComparison()                       │ │
│  │     └─ renderPerformanceAlerts()                       │ │
│  │                                                          │ │
│  │  5. app-goals.js                                       │ │
│  │     ├─ setGoal()                                       │ │
│  │     ├─ renderGoals()                                   │ │
│  │     ├─ calculateCurrentPerformance()                   │ │
│  │     └─ deleteGoal()                                    │ │
│  │                                                          │ │
│  │  6. app-reports.js                                     │ │
│  │     ├─ printReport()                                   │ │
│  │     ├─ generateStudentReport()                         │ │
│  │     ├─ generateClassReport()                           │ │
│  │     └─ Report HTML Generation                          │ │
│  │                                                          │ │
│  │  7. app-data.js                                        │ │
│  │     ├─ exportData()                                    │ │
│  │     ├─ importData()                                    │ │
│  │     ├─ exportGoals()                                   │ │
│  │     ├─ importGoals()                                   │ │
│  │     └─ clearAllData()                                  │ │
│  │                                                          │ │
│  │  8. ocr-experimental.js (DISABLED)                     │ │
│  │     ├─ handleFileUpload()                              │ │
│  │     ├─ processPDF() [PDF.js]                           │ │
│  │     ├─ processImage() [Tesseract.js]                   │ │
│  │     ├─ parseExamData()                                 │ │
│  │     └─ displayOCRResults()                             │ │
│  │                                                          │ │
│  └────────────────────────────────────────────────────────┘ │
│                              ↓                               │
│  ┌────────────────────────────────────────────────────────┐ │
│  │              External Libraries (CDN)                   │ │
│  │                                                          │ │
│  │  • Chart.js 4.x      ← Line charts & visualization     │ │
│  │  • Tesseract.js 4.x  ← OCR for images (disabled)       │ │
│  │  • PDF.js 3.11.174   ← PDF parsing (disabled)          │ │
│  │                                                          │ │
│  └────────────────────────────────────────────────────────┘ │
│                              ↓                               │
│  ┌────────────────────────────────────────────────────────┐ │
│  │                 Browser Storage                         │ │
│  │                                                          │ │
│  │  localStorage:                                          │ │
│  │  ├─ examData        ← All exam records (JSON array)    │ │
│  │  └─ studentGoals    ← All goals (JSON object)          │ │
│  │                                                          │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

## Data Flow Diagram

```
┌─────────────┐
│    USER     │
│  ACTIONS    │
└──────┬──────┘
       │
       ├──── Add Exam ────────────────────────────┐
       │                                           ↓
       │                            ┌──────────────────────────┐
       │                            │  app-data-entry.js       │
       │                            │  handleFormSubmit()      │
       │                            └─────────┬────────────────┘
       │                                      │
       │                                      ↓
       │                            ┌──────────────────────────┐
       │                            │  app-state.js            │
       │                            │  exams.push(newExam)     │
       │                            │  saveData()              │
       │                            └─────────┬────────────────┘
       │                                      │
       │                                      ↓
       │                            ┌──────────────────────────┐
       │                            │  localStorage            │
       │                            │  setItem('examData')     │
       │                            └─────────┬────────────────┘
       │                                      │
       │                                      ↓
       │                            ┌──────────────────────────┐
       │                            │  app-entries.js          │
       │                            │  renderRecentEntries()   │
       │                            └──────────────────────────┘
       │
       ├──── View Dashboard ──────────────────────┐
       │                                           ↓
       │                            ┌──────────────────────────┐
       │                            │  app-data-entry.js       │
       │                            │  switchTab('dashboard')  │
       │                            └─────────┬────────────────┘
       │                                      │
       │                                      ↓
       │                            ┌──────────────────────────┐
       │                            │  app-dashboard.js        │
       │                            │  updateDashboard()       │
       │                            └─────────┬────────────────┘
       │                                      │
       │                                      ├─→ renderChart()
       │                                      ├─→ renderStats()
       │                                      ├─→ renderSubjectComparison()
       │                                      └─→ renderPerformanceAlerts()
       │
       ├──── Set Goal ────────────────────────────┐
       │                                           ↓
       │                            ┌──────────────────────────┐
       │                            │  app-goals.js            │
       │                            │  setGoal()               │
       │                            └─────────┬────────────────┘
       │                                      │
       │                                      ↓
       │                            ┌──────────────────────────┐
       │                            │  app-state.js            │
       │                            │  studentGoals[key]       │
       │                            │  saveGoals()             │
       │                            └─────────┬────────────────┘
       │                                      │
       │                                      ↓
       │                            ┌──────────────────────────┐
       │                            │  localStorage            │
       │                            │  setItem('studentGoals') │
       │                            └──────────────────────────┘
       │
       ├──── Print Report ────────────────────────┐
       │                                           ↓
       │                            ┌──────────────────────────┐
       │                            │  app-reports.js          │
       │                            │  printReport()           │
       │                            └─────────┬────────────────┘
       │                                      │
       │                                      ├─→ generateStudentReport()
       │                                      │    OR
       │                                      └─→ generateClassReport()
       │                                           │
       │                                           ↓
       │                                  window.open() → print()
       │
       ├──── Export/Import Data ──────────────────┐
       │                                           ↓
       │                            ┌──────────────────────────┐
       │                            │  app-data.js             │
       │                            ├─→ exportData()           │
       │                            │    └─→ JSON download     │
       │                            ├─→ importData()           │
       │                            │    └─→ Parse & merge     │
       │                            ├─→ exportGoals()          │
       │                            └─→ importGoals()          │
       │
       └──── Search/Filter ───────────────────────┐
                                                   ↓
                                    ┌──────────────────────────┐
                                    │  app-entries.js          │
                                    │  filterEntries()         │
                                    └─────────┬────────────────┘
                                              │
                                              ↓
                                    Show matching entries only
```

## Module Dependencies

```
app-state.js (Core - No dependencies)
    │
    ├─→ app-data-entry.js
    │       └─→ Uses: exams, editingExamId, saveData()
    │
    ├─→ app-entries.js
    │       └─→ Uses: exams, saveData(), editExam(), deleteExam()
    │
    ├─→ app-dashboard.js
    │       └─→ Uses: exams, currentGradeFilter, chartInstance
    │
    ├─→ app-goals.js
    │       └─→ Uses: studentGoals, exams, currentGradeFilter
    │
    ├─→ app-reports.js
    │       └─→ Uses: exams, currentGradeFilter (read-only)
    │
    ├─→ app-data.js
    │       └─→ Uses: exams, studentGoals, saveData(), saveGoals()
    │
    └─→ ocr-experimental.js
            └─→ Uses: ocrEnabled, ocrData, exams (if enabled)
```

## Feature Matrix

| Feature | Module | Status | Lines |
|---------|--------|--------|-------|
| State Management | app-state.js | ✅ Active | 64 |
| Form Entry | app-data-entry.js | ✅ Active | 198 |
| Entry List | app-entries.js | ✅ Active | 178 |
| Charts & Analytics | app-dashboard.js | ✅ Active | 311 |
| Goal Tracking | app-goals.js | ✅ Active | 71 |
| Print Reports | app-reports.js | ✅ Active | 219 |
| Import/Export | app-data.js | ✅ Active | 117 |
| OCR (PDF/Image) | ocr-experimental.js | ⚠️ Disabled | 173 |
| **Total** | **8 modules** | | **1331** |

## Event Flow

```
Page Load
   ↓
DOMContentLoaded Event
   ↓
app-state.js → initializeApp()
   ↓
├─→ Load data from localStorage
├─→ Populate lesson options datalist
├─→ Set today's date in form
├─→ setupEventListeners()
└─→ toggleOCRFeature() (hide if disabled)
   ↓
Ready for User Interaction
```

## Storage Schema

### localStorage.examData
```json
[
  {
    "studentName": "Ali Yılmaz",
    "examName": "Deneme #1",
    "date": "2025-01-15",
    "gradeLevel": "Lise Hazırlık",
    "notes": "İyi performans",
    "subjects": [
      {
        "lesson": "Türkçe",
        "correct": 15,
        "wrong": 3,
        "empty": 2,
        "total": 20
      }
    ]
  }
]
```

### localStorage.studentGoals
```json
{
  "Ali Yılmaz-Matematik": {
    "student": "Ali Yılmaz",
    "subject": "Matematik",
    "target": 80
  }
}
```

## Function Call Hierarchy

```
User clicks "Sonucu Kaydet"
   ↓
handleFormSubmit(e)  [app-data-entry.js]
   ↓
   ├─→ Validate form
   ├─→ Collect subject data
   ├─→ Check duplicates
   ├─→ exams.push(newExam)
   ├─→ saveData()  [app-state.js]
   │      └─→ localStorage.setItem()
   ├─→ renderRecentEntries()  [app-entries.js]
   ├─→ updateQuickStats()  [app-data-entry.js]
   └─→ Reset form
```

## Security & Data Integrity

- ✅ Duplicate detection on import
- ✅ Form validation before save
- ✅ Double confirmation for delete all
- ✅ Data backup via export
- ⚠️ No encryption (localStorage is plain text)
- ⚠️ No server-side validation
- ⚠️ No multi-device sync

## Performance Considerations

| Operation | Complexity | Notes |
|-----------|-----------|-------|
| Add Exam | O(1) | Direct array push |
| Delete Exam | O(n) | Array filter |
| Render List | O(n) | Iterates all exams |
| Update Dashboard | O(n×m) | n exams, m subjects |
| Search/Filter | O(n) | String matching |
| Import Data | O(n) | Duplicate check |

## Browser Compatibility

| Browser | Version | Status |
|---------|---------|--------|
| Chrome | 90+ | ✅ Fully Supported |
| Firefox | 88+ | ✅ Fully Supported |
| Edge | 90+ | ✅ Fully Supported |
| Safari | 14+ | ✅ Fully Supported |
| Mobile Safari | 14+ | ✅ Fully Supported |
| Chrome Mobile | 90+ | ✅ Fully Supported |

**Requirements:**
- JavaScript ES6+ support
- localStorage API
- Canvas API (for Chart.js)
- Print API
