// ===================================
// STATE MANAGEMENT & INITIALIZATION
// ===================================

// Global State
let exams = JSON.parse(localStorage.getItem('studentExams')) || [];
let chartInstance = null;
let editingExamId = null;
let currentGradeFilter = 'Lise Hazırlık';
let studentGoals = JSON.parse(localStorage.getItem('studentGoals')) || {};
let bulkMode = false;
let selectedExams = new Set();

// OCR State (optional feature)
let ocrData = null;
let ocrEnabled = false; // Set to true to enable OCR features

// Constants
const LESSON_OPTIONS = [
    'Türkçe', 'Matematik', 'Fen Bilgileri', 'Sosyal Bilgiler',
    'İngilizce', 'Din Kültürü', 'Tarih', 'Coğrafya',
    'Fizik', 'Kimya', 'Biyoloji'
];

// Data Persistence - Now uses Firebase when available
function saveData() {
    // Always save to localStorage as backup
    localStorage.setItem('studentExams', JSON.stringify(exams));
    
    // Also save to Firebase if authenticated
    if (typeof saveDataToFirebase === 'function' && typeof isAuthenticated === 'function') {
        if (isAuthenticated()) {
            saveDataToFirebase();
        }
    }
}

function saveGoals() {
    // Always save to localStorage as backup
    localStorage.setItem('studentGoals', JSON.stringify(studentGoals));
    
    // Also save to Firebase if authenticated
    if (typeof saveGoalsToFirebase === 'function' && typeof isAuthenticated === 'function') {
        if (isAuthenticated()) {
            saveGoalsToFirebase();
        }
    }
}

// Initialization
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

function initializeApp() {
    try {
        // Render initial data (from localStorage first, Firebase will update later)
        renderRecentEntries();
        populateStudentDropdown();
        updateQuickStats();
        
        // Add initial subject row
        addSubjectRow();

        // Setup Event Listeners
        setupEventListeners();
        
        // Initialize dashboard
        updateDashboard();
        
        // Hide/show OCR section based on feature flag
        toggleOCRFeature();
    } catch (error) {
        console.error('Initialization error:', error);
        alert('⚠️ Uygulama yüklenirken bir hata oluştu. Sayfayı yenileyin.');
    }
}

function setupEventListeners() {
    const addSubjectBtn = document.getElementById('add-subject-btn');
    const examForm = document.getElementById('exam-form');
    const filterGrade = document.getElementById('filterGrade');
    const filterStudent = document.getElementById('filterStudent');
    const filterSubject = document.getElementById('filterSubject');
    const cancelEditBtn = document.getElementById('cancel-edit-btn');
    const dateRange = document.getElementById('dateRange');
    
    if (addSubjectBtn) addSubjectBtn.addEventListener('click', addSubjectRow);
    if (examForm) examForm.addEventListener('submit', handleFormSubmit);
    if (filterGrade) filterGrade.addEventListener('change', updateGradeFilter);
    if (filterStudent) filterStudent.addEventListener('change', updateDashboard);
    if (filterSubject) filterSubject.addEventListener('change', updateDashboard);
    if (cancelEditBtn) cancelEditBtn.addEventListener('click', cancelEdit);
    if (dateRange) dateRange.addEventListener('change', handleDateRangeChange);
    
    // OCR listener (only if enabled)
    if (ocrEnabled) {
        document.getElementById('file-upload')?.addEventListener('change', handleFileUpload);
    }
}

function toggleOCRFeature() {
    const ocrSection = document.getElementById('ocr-section');
    if (ocrSection) {
        ocrSection.style.display = ocrEnabled ? 'block' : 'none';
    }
}
