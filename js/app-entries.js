// ===================================
// ENTRIES LIST & MANAGEMENT
// ===================================

// Helper - Calculate exam stats
function getExamStats(exam) {
    const correctTotal = exam.subjects.reduce((sum, sub) => sum + sub.correct, 0);
    const questionTotal = exam.subjects.reduce((sum, sub) => sum + sub.total, 0);
    const wrongTotal = exam.subjects.reduce((sum, sub) => sum + (sub.wrong || 0), 0);
    const emptyTotal = exam.subjects.reduce((sum, sub) => sum + (sub.empty || 0), 0);
    const percentage = questionTotal > 0 ? ((correctTotal / questionTotal) * 100).toFixed(1) : 0;
    return { correctTotal, questionTotal, percentage, wrongTotal, emptyTotal };
}

// Helper - Render single entry item
function createEntryItem(exam) {
    const { percentage, correctTotal, questionTotal, wrongTotal, emptyTotal } = getExamStats(exam);
    const notesIcon = exam.notes ? ' 📝' : '';
    const uploaderInfo = exam.uploadedByNickname ? ` • 👤 ${exam.uploadedByNickname}` : '';
    
    const div = document.createElement('div');
    div.className = 'entry-item';
    
        if (bulkMode) {
        div.innerHTML = `
            <input type="checkbox" class="bulk-checkbox" onchange="toggleExamSelection('${exam.id}')" 
                   ${selectedExams.has(exam.id) ? 'checked' : ''}>
                <div class="entry-info">
                <strong>${exam.examName}${notesIcon}</strong>
                <span class="entry-date">${exam.date} - ${exam.studentName}${uploaderInfo}</span>
                <div class="entry-score">
                    <span class="score-percent">${percentage}%</span>
                    <span class="score-breakdown">
                        <span class="badge badge-correct">✓ ${correctTotal}</span>
                        <span class="badge badge-wrong">✗ ${wrongTotal}</span>
                        <span class="badge badge-empty">○ ${emptyTotal}</span>
                    </span>
                </div>
            </div>
        `;
        } else {
        div.innerHTML = `
            <div class="entry-info">
                <strong>${exam.examName}${notesIcon}</strong>
                <span class="entry-date">${exam.date} - ${exam.studentName}${uploaderInfo}</span>
                <div class="entry-score">
                    <span class="score-percent">${percentage}%</span>
                    <span class="score-breakdown">
                        <span class="badge badge-correct">✓ ${correctTotal}</span>
                        <span class="badge badge-wrong">✗ ${wrongTotal}</span>
                        <span class="badge badge-empty">○ ${emptyTotal}</span>
                    </span>
                </div>
            </div>
            <div class="entry-actions">
                <button onclick="editExam('${exam.id}')" class="action-btn edit-btn" title="Düzenle">✎</button>
                <button onclick="deleteExam('${exam.id}')" class="action-btn delete-btn" title="Sil">🗑</button>
            </div>
        `;
    }
    
    return div;
}

// Render entries to list
function renderEntriesToList(examsList) {
    const list = document.getElementById('entries-list');
    if (!list) return;
    
    list.innerHTML = '';
    
    if (examsList.length === 0) {
        list.innerHTML = '<p class="empty-state">Henüz kayıtlı sınav yok.</p>';
        return;
    }
    
    examsList.slice().reverse().forEach(exam => {
        list.appendChild(createEntryItem(exam));
    });
}

// Render Recent Entries
function renderRecentEntries() {
    renderEntriesToList(exams);
}

// Search/Filter Entries
function filterEntries() {
    const searchInput = document.getElementById('entry-search');
    if (!searchInput) return;
    
    const searchTerm = searchInput.value.toLowerCase();
    
    if (!searchTerm) {
        renderRecentEntries();
        return;
    }
    
    const filtered = exams.filter(exam => 
        exam.studentName.toLowerCase().includes(searchTerm) ||
        exam.examName.toLowerCase().includes(searchTerm) ||
        exam.date.includes(searchTerm) ||
        (exam.notes && exam.notes.toLowerCase().includes(searchTerm))
    );
    
    renderEntriesToList(filtered);
}

// Edit Exam
function editExam(examId) {
    const exam = exams.find(e => e.id === examId);
    if (!exam) return;
    
    editingExamId = examId;
    document.getElementById('gradeLevel').value = exam.gradeLevel;
    document.getElementById('studentName').value = exam.studentName;
    document.getElementById('examName').value = exam.examName;
    document.getElementById('examDate').value = exam.date;
    
    if (document.getElementById('examNotes')) {
        document.getElementById('examNotes').value = exam.notes || '';
    }
    
    document.getElementById('subjects-container').innerHTML = '';
    
    exam.subjects.forEach(subject => {
        const container = document.getElementById('subjects-container');
        const rowId = examId + '_' + subject.lesson + '_' + Math.random();
        
        const row = document.createElement('div');
        row.className = 'subject-row';
        row.innerHTML = `
            <div>
                <label>Ders</label>
                <input type="text" name="lesson" required value="${subject.lesson}">
            </div>
            <div>
                <label>Konu</label>
                <input type="text" name="topic" required value="${subject.topic}">
            </div>
            <div>
                <label>Soru</label>
                <input type="number" name="total" min="0" value="${subject.total || 0}" onchange="calculateEmpty('${rowId}')" oninput="calculateEmpty('${rowId}')">
            </div>
            <div>
                <label>Doğru</label>
                <input type="number" name="correct" min="0" value="${subject.correct || 0}" onchange="calculateEmpty('${rowId}')" oninput="calculateEmpty('${rowId}')">
            </div>
            <div>
                <label>Yanlış</label>
                <input type="number" name="wrong" min="0" value="${subject.wrong || 0}" onchange="calculateEmpty('${rowId}')" oninput="calculateEmpty('${rowId}')">
            </div>
            <div>
                <label>Boş</label>
                <input type="number" name="empty" id="empty-${rowId}" value="${subject.empty || 0}" readonly style="background-color: #eee;">
            </div>
            <button type="button" class="remove-btn" onclick="this.parentElement.remove()">×</button>
        `;
        
        container.appendChild(row);
    });
    
    const cancelBtn = document.getElementById('cancel-edit-btn');
    if (cancelBtn) {
        cancelBtn.style.display = 'inline-block';
    }
    
    document.getElementById('section-entry').scrollIntoView({ behavior: 'smooth' });
    switchTab('entry');
}

// Delete Exam
function deleteExam(examId) {
    // Check authentication
    if (typeof isAuthenticated === 'function' && !isAuthenticated()) {
        if (typeof showNotification === 'function') {
            showNotification('⚠️ Silmek için giriş yapın!', 'warning');
        }
        if (typeof openAuthModal === 'function') openAuthModal();
        return;
    }
    
    if (confirm('Bu sınav sonucunu silmek istediğinizden emin misiniz?')) {
        exams = exams.filter(e => e.id !== examId);
        saveData();
        renderRecentEntries();
        populateStudentDropdown();
        updateQuickStats();
        if (typeof showNotification === 'function') {
            showNotification('✅ Sınav başarıyla silindi!', 'success');
        } else {
            alert('Sınav başarıyla silindi!');
        }
    }
}

// Bulk Actions
function toggleBulkMode() {
    bulkMode = !bulkMode;
    selectedExams.clear();
    
    const bulkActions = document.getElementById('bulk-actions');
    const bulkBtn = document.getElementById('bulk-mode-btn');
    
    if (bulkActions) {
        bulkActions.style.display = bulkMode ? 'flex' : 'none';
    }
    
    if (bulkBtn) {
        bulkBtn.style.background = bulkMode ? '#4a90e2' : '';
        bulkBtn.style.color = bulkMode ? 'white' : '';
    }
    
    renderRecentEntries();
}

function toggleExamSelection(examId) {
    if (selectedExams.has(examId)) {
        selectedExams.delete(examId);
    } else {
        selectedExams.add(examId);
    }
}

function deleteSelected() {
    // Check authentication
    if (typeof isAuthenticated === 'function' && !isAuthenticated()) {
        if (typeof showNotification === 'function') {
            showNotification('⚠️ Silmek için giriş yapın!', 'warning');
        }
        if (typeof openAuthModal === 'function') openAuthModal();
        return;
    }
    
    if (selectedExams.size === 0) {
        alert('Lütfen en az bir sınav seçin!');
        return;
    }
    
    if (confirm(`${selectedExams.size} sınavı silmek istediğinizden emin misiniz?`)) {
        exams = exams.filter(e => !selectedExams.has(e.id));
        saveData();
        selectedExams.clear();
        toggleBulkMode();
        renderRecentEntries();
        populateStudentDropdown();
        updateQuickStats();
        alert('✅ Seçilen sınavlar silindi!');
    }
}

// Global function exports
window.editExam = editExam;
window.deleteExam = deleteExam;
window.filterEntries = filterEntries;
window.toggleBulkMode = toggleBulkMode;
window.toggleExamSelection = toggleExamSelection;
window.deleteSelected = deleteSelected;
window.renderRecentEntries = renderRecentEntries;
window.getExamStats = getExamStats;
