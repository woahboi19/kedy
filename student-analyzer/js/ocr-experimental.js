// ===================================
// OCR EXPERIMENTAL FEATURES
// ===================================
// This module is EXPERIMENTAL and DISABLED by default
// To enable: Set ocrEnabled = true in app-state.js

// PDF Processing
async function processPDF(file) {
    if (!ocrEnabled) {
        alert('⚠️ OCR özelliği şu an devre dışı!');
        return;
    }
    
    showOCRLoading('PDF işleniyor...');
    
    try {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        
        let fullText = '';
        for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            const pageText = textContent.items.map(item => item.str).join(' ');
            fullText += pageText + '\n';
        }
        
        const examData = parseExamData(fullText);
        displayOCRResults(examData);
        
    } catch (error) {
        console.error('PDF Error:', error);
        alert('❌ PDF işlenirken hata oluştu: ' + error.message);
    } finally {
        hideOCRLoading();
    }
}

// Image Processing
async function processImage(file) {
    if (!ocrEnabled) {
        alert('⚠️ OCR özelliği şu an devre dışı!');
        return;
    }
    
    showOCRLoading('Görüntü analiz ediliyor...');
    
    try {
        const result = await Tesseract.recognize(
            file,
            'tur',
            {
                logger: m => console.log(m)
            }
        );
        
        const examData = parseExamData(result.data.text);
        displayOCRResults(examData);
        
    } catch (error) {
        console.error('OCR Error:', error);
        alert('❌ Görüntü işlenirken hata oluştu: ' + error.message);
    } finally {
        hideOCRLoading();
    }
}

// Handle File Upload
function handleFileUpload(event) {
    if (!ocrEnabled) {
        alert('⚠️ OCR özelliği şu an devre dışı!');
        event.target.value = '';
        return;
    }
    
    const file = event.target.files[0];
    if (!file) return;
    
    const fileType = file.type;
    
    if (fileType === 'application/pdf') {
        processPDF(file);
    } else if (fileType.startsWith('image/')) {
        processImage(file);
    } else {
        alert('⚠️ Desteklenmeyen dosya türü! Lütfen PDF veya resim dosyası yükleyin.');
    }
    
    event.target.value = '';
}

// Parse Exam Data from Text
function parseExamData(text) {
    const lines = text.split('\n').map(l => l.trim()).filter(l => l);
    
    const data = {
        studentName: '',
        examName: '',
        date: new Date().toISOString().split('T')[0],
        gradeLevel: 'Lise Hazırlık',
        subjects: []
    };
    
    // Extract student name
    const nameMatch = text.match(/(?:Öğrenci|Adı?|İsim)[:\s]+([A-ZÇĞİÖŞÜ][a-zçğıöşü]+(?:\s+[A-ZÇĞİÖŞÜ][a-zçğıöşü]+)+)/i);
    if (nameMatch) {
        data.studentName = nameMatch[1].trim();
    }
    
    // Extract exam name
    const examMatch = text.match(/(?:Sınav|Test|Deneme)[:\s]+(.+?)(?:\n|$)/i);
    if (examMatch) {
        data.examName = examMatch[1].trim();
    }
    
    // Extract date
    const dateMatch = text.match(/(\d{1,2})[./-](\d{1,2})[./-](\d{4})/);
    if (dateMatch) {
        const [, day, month, year] = dateMatch;
        data.date = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    }
    
    // Extract subjects and scores
    const subjectRegex = /(Türkçe|Matematik|Fen|Sosyal|İngilizce|Tarih|Coğrafya|Fizik|Kimya|Biyoloji|Geometri)[:\s]+D[:\s]*(\d+)[,\s]+Y[:\s]*(\d+)[,\s]+(?:B|Boş)[:\s]*(\d+)/gi;
    
    let match;
    while ((match = subjectRegex.exec(text)) !== null) {
        const [, lesson, correct, wrong, empty] = match;
        const total = parseInt(correct) + parseInt(wrong) + parseInt(empty);
        
        data.subjects.push({
            lesson: lesson,
            correct: parseInt(correct),
            wrong: parseInt(wrong),
            empty: parseInt(empty),
            total: total
        });
    }
    
    return data;
}

// Display OCR Results
function displayOCRResults(examData) {
    ocrData = examData;
    
    const resultsDiv = document.getElementById('ocr-results');
    if (!resultsDiv) return;
    
    let html = '<div class="ocr-results-card">';
    html += '<h3>📄 Analiz Sonuçları</h3>';
    
    if (examData.studentName) {
        html += `<p><strong>Öğrenci:</strong> ${examData.studentName}</p>`;
    }
    if (examData.examName) {
        html += `<p><strong>Sınav:</strong> ${examData.examName}</p>`;
    }
    html += `<p><strong>Tarih:</strong> ${examData.date}</p>`;
    
    if (examData.subjects.length > 0) {
        html += '<h4>Bulunan Dersler:</h4><ul>';
        examData.subjects.forEach(sub => {
            html += `<li>${sub.lesson}: D:${sub.correct} Y:${sub.wrong} B:${sub.empty}</li>`;
        });
        html += '</ul>';
        
        html += '<button onclick="useOCRData()" class="btn btn-primary">Bu Verileri Kullan</button> ';
    } else {
        html += '<p class="warning">⚠️ Ders verisi tespit edilemedi. Lütfen manuel olarak girin.</p>';
    }
    
    html += '<button onclick="clearOCRResults()" class="btn btn-secondary">Temizle</button>';
    html += '</div>';
    
    resultsDiv.innerHTML = html;
    resultsDiv.style.display = 'block';
}

// Use OCR Data
function useOCRData() {
    if (!ocrData) return;
    
    // Fill form with OCR data
    document.getElementById('studentName').value = ocrData.studentName || '';
    document.getElementById('examName').value = ocrData.examName || '';
    document.getElementById('examDate').value = ocrData.date || '';
    document.getElementById('gradeLevel').value = ocrData.gradeLevel || 'Lise Hazırlık';
    
    // Clear existing subject rows
    const container = document.getElementById('subjects-container');
    container.innerHTML = '';
    
    // Add subject rows from OCR
    ocrData.subjects.forEach((sub, index) => {
        const row = document.createElement('div');
        row.className = 'subject-row';
        row.innerHTML = `
            <input type="text" list="lesson-options" value="${sub.lesson}" placeholder="Ders Adı" required>
            <input type="number" value="${sub.correct}" min="0" placeholder="Doğru" required>
            <input type="number" value="${sub.wrong}" min="0" placeholder="Yanlış" required>
            <input type="number" value="${sub.empty}" min="0" placeholder="Boş" required>
            <button type="button" onclick="this.parentElement.remove()" class="remove-btn" title="Dersi Kaldır">×</button>
        `;
        container.appendChild(row);
    });
    
    // Switch to entry tab
    switchTab('entry');
    
    alert('✅ OCR verileri forma yüklendi! Kontrol edip kaydedin.');
    clearOCRResults();
}

// Clear OCR Results
function clearOCRResults() {
    ocrData = null;
    const resultsDiv = document.getElementById('ocr-results');
    if (resultsDiv) {
        resultsDiv.innerHTML = '';
        resultsDiv.style.display = 'none';
    }
}

// Show OCR Loading
function showOCRLoading(message) {
    const resultsDiv = document.getElementById('ocr-results');
    if (resultsDiv) {
        resultsDiv.innerHTML = `<div class="ocr-loading"><div class="spinner"></div><p>${message}</p></div>`;
        resultsDiv.style.display = 'block';
    }
}

// Hide OCR Loading
function hideOCRLoading() {
    // Loading is replaced by results or cleared
}

// Global exports
window.handleFileUpload = handleFileUpload;
window.useOCRData = useOCRData;
window.clearOCRResults = clearOCRResults;
