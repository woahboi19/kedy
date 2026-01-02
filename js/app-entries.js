// ===================================
// ENTRIES LIST & MANAGEMENT
// ===================================

// Render Recent Entries
function renderRecentEntries() {
    const list = document.getElementById('entries-list');
    if (!list) return;
    
    list.innerHTML = '';
    
    if (exams.length === 0) {
        list.innerHTML = '<p class="empty-state">Henüz kayıtlı sınav yok.</p>';
        return;
    }
    
    // Show all entries (reversed)
    exams.slice().reverse().forEach(exam => {
        const correctTotal = exam.subjects.reduce((sum, sub) => sum + sub.correct, 0);
        const questionTotal = exam.subjects.reduce((sum, sub) => sum + sub.total, 0);
        const percentage = questionTotal > 0 ? ((correctTotal / questionTotal) * 100).toFixed(1) : 0;
        const notesIcon = exam.notes ? ' 📝' : '';
        const uploaderInfo = exam.uploadedByNickname ? ` • 👤 ${exam.uploadedByNickname}` : '';
        
        const div = document.createElement('div');
        div.className = 'entry-item';
        
        if (bulkMode) {
            div.innerHTML = `
                <input type="checkbox" class="bulk-checkbox" onchange="toggleExamSelection(${exam.id})" 
                       ${selectedExams.has(exam.id) ? 'checked' : ''}>
                <div class="entry-info">
                    <strong>${exam.examName}${notesIcon}</strong>
                    <span class="entry-date">${exam.date} - ${exam.studentName}${uploaderInfo}</span>
                    <span class="entry-score">${percentage}% (${correctTotal}/${questionTotal})</span>
                </div>
            `;
        } else {
            div.innerHTML = `
                <div class="entry-info">
                    <strong>${exam.examName}${notesIcon}</strong>
                    <span class="entry-date">${exam.date} - ${exam.studentName}${uploaderInfo}</span>
                    <span class="entry-score">${percentage}% (${correctTotal}/${questionTotal})</span>
                </div>
                <div class="entry-actions">
                    <button onclick="editExam(${exam.id})" class="action-btn edit-btn" title="Düzenle">✎</button>
                    <button onclick="deleteExam(${exam.id})" class="action-btn delete-btn" title="Sil">🗑</button>
                </div>
            `;
        }
        
        list.appendChild(div);
    });
}

// Search/Filter Entries
function filterEntries() {
    const searchInput = document.getElementById('entry-search');
    if (!searchInput) return;
    const searchTerm = searchInput.value.toLowerCase();
    const list = document.getElementById('entries-list');
    
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
    
    list.innerHTML = '';
    
    if (filtered.length === 0) {
        list.innerHTML = '<p class="empty-state">Arama sonucu bulunamadı.</p>';
        return;
    }
    
    filtered.slice().reverse().forEach(exam => {
        const correctTotal = exam.subjects.reduce((sum, sub) => sum + sub.correct, 0);
        const questionTotal = exam.subjects.reduce((sum, sub) => sum + sub.total, 0);
        const percentage = questionTotal > 0 ? ((correctTotal / questionTotal) * 100).toFixed(1) : 0;
        const notesIcon = exam.notes ? ' 📝' : '';
        const uploaderInfo = exam.uploadedByNickname ? ` • 👤 ${exam.uploadedByNickname}` : '';
        
        const div = document.createElement('div');
        div.className = 'entry-item';
        div.innerHTML = `
            <div class="entry-info">
                <strong>${exam.examName}${notesIcon}</strong>
                <span class="entry-date">${exam.date} - ${exam.studentName}${uploaderInfo}</span>
                <span class="entry-score">${percentage}% (${correctTotal}/${questionTotal})</span>
            </div>
            <div class="entry-actions">
                <button onclick="editExam(${exam.id})" class="action-btn edit-btn" title="Düzenle">✎</button>
                <button onclick="deleteExam(${exam.id})" class="action-btn delete-btn" title="Sil">🗑</button>
            </div>
        `;
        list.appendChild(div);
    });
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
                <input type="number" name="total" min="1" required value="${subject.total}" onchange="calculateEmpty('${rowId}')">
            </div>
            <div>
                <label>Doğru</label>
                <input type="number" name="correct" min="0" required value="${subject.correct}" onchange="calculateEmpty('${rowId}')">
            </div>
            <div>
                <label>Yanlış</label>
                <input type="number" name="wrong" min="0" required value="${subject.wrong}" onchange="calculateEmpty('${rowId}')">
            </div>
            <div>
                <label>Boş</label>
                <input type="number" name="empty" id="empty-${rowId}" value="${subject.empty}" readonly style="background-color: #eee;">
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
