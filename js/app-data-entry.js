// ===================================
// DATA ENTRY & FORM HANDLING
// ===================================

// Tab Switching
function switchTab(tabName) {
    document.querySelectorAll('section').forEach(sec => sec.style.display = 'none');
    document.querySelectorAll('nav button').forEach(btn => btn.classList.remove('active'));

    document.getElementById(`section-${tabName}`).style.display = 'block';
    document.getElementById(`tab-${tabName}`).classList.add('active');

    if (tabName === 'dashboard') {
        updateDashboard();
    } else if (tabName === 'entry') {
        updateQuickStats();
    }
}

// Subject Row Management
function addSubjectRow() {
    const container = document.getElementById('subjects-container');
    const rowId = Date.now();
    
    const row = document.createElement('div');
    row.className = 'subject-row';
    row.innerHTML = `
        <div>
            <label>Ders</label>
            <input type="text" name="lesson" required placeholder="örn. Matematik" list="lesson-list">
            <datalist id="lesson-list">
                ${LESSON_OPTIONS.map(lesson => `<option value="${lesson}">`).join('')}
            </datalist>
        </div>
        <div>
            <label>Konu</label>
            <input type="text" name="topic" required placeholder="örn. Fiilimsiler">
        </div>
        <div>
            <label>Soru</label>
            <input type="number" name="total" min="1" required onchange="calculateEmpty('${rowId}')">
        </div>
        <div>
            <label>Doğru</label>
            <input type="number" name="correct" min="0" required onchange="calculateEmpty('${rowId}')">
        </div>
        <div>
            <label>Yanlış</label>
            <input type="number" name="wrong" min="0" required onchange="calculateEmpty('${rowId}')">
        </div>
        <div>
            <label>Boş</label>
            <input type="number" name="empty" id="empty-${rowId}" readonly style="background-color: #eee;">
        </div>
        <button type="button" class="remove-btn" onclick="this.parentElement.remove()">×</button>
    `;
    
    container.appendChild(row);
}

function calculateEmpty(rowId) {
    const emptyInput = document.getElementById(`empty-${rowId}`);
    if (!emptyInput) return;
    
    const row = emptyInput.closest('.subject-row');
    if (!row) return;
    
    const total = Math.max(0, parseInt(row.querySelector('input[name="total"]').value, 10) || 0);
    const correct = Math.max(0, parseInt(row.querySelector('input[name="correct"]').value, 10) || 0);
    const wrong = Math.max(0, parseInt(row.querySelector('input[name="wrong"]').value, 10) || 0);
    
    const empty = total - (correct + wrong);
    emptyInput.value = empty >= 0 ? empty : 0;
}

// Form Submission
function handleFormSubmit(e) {
    e.preventDefault();
    
    // Check authentication
    if (typeof isAuthenticated === 'function' && !isAuthenticated()) {
        if (typeof showNotification === 'function') {
            showNotification('⚠️ Veri eklemek için giriş yapın!', 'warning');
        } else {
            alert('⚠️ Veri eklemek için giriş yapın!');
        }
        if (typeof openAuthModal === 'function') openAuthModal();
        return;
    }
    
    const gradeLevel = document.getElementById('gradeLevel').value;
    const studentName = document.getElementById('studentName').value;
    const examName = document.getElementById('examName').value;
    const examDate = document.getElementById('examDate').value;
    const examNotes = document.getElementById('examNotes')?.value || '';
    
    const subjectRows = document.querySelectorAll('.subject-row');
    const subjects = [];
    let isValid = true;
    
    subjectRows.forEach(row => {
        if (!isValid) return;

        const lesson = row.querySelector('input[name="lesson"]').value;
        const topic = row.querySelector('input[name="topic"]').value;
        const total = parseInt(row.querySelector('input[name="total"]').value, 10) || 0;
        const correct = parseInt(row.querySelector('input[name="correct"]').value, 10) || 0;
        const wrong = parseInt(row.querySelector('input[name="wrong"]').value, 10) || 0;
        
        if (correct + wrong > total) {
            alert(`Hata: ${lesson} dersinde doğru ve yanlış sayıları toplamı soru sayısını geçemez.`);
            isValid = false;
            return;
        }

        const empty = total - (correct + wrong);
        subjects.push({ lesson, topic, total, correct, wrong, empty });
    });
    
    if (!isValid) return;

    // Check for duplicates
    const isDuplicate = exams.some(exam => 
        exam.studentName === studentName && 
        exam.examName === examName && 
        exam.date === examDate &&
        exam.id !== editingExamId
    );
    
    if (isDuplicate) {
        alert('Hata: Bu öğrenci için aynı tarihte aynı adlı sınav zaten kayıtlı!');
        return;
    }

    if (editingExamId) {
        const examIndex = exams.findIndex(e => e.id === editingExamId);
        if (examIndex !== -1) {
            // Keep original uploader info when editing
            const originalExam = exams[examIndex];
            exams[examIndex] = {
                id: editingExamId,
                gradeLevel,
                studentName,
                examName,
                date: examDate,
                notes: examNotes,
                subjects,
                uploadedBy: originalExam.uploadedBy || null,
                uploadedByNickname: originalExam.uploadedByNickname || null,
                lastEditedBy: typeof getCurrentUserId === 'function' ? getCurrentUserId() : null,
                lastEditedByNickname: typeof getCurrentUserNickname === 'function' ? getCurrentUserNickname() : null,
                lastEditedAt: new Date().toISOString()
            };
        }
        cancelEdit();
        alert('Sınav başarıyla güncellendi!');
    } else {
        const newExam = {
            id: Date.now(),
            gradeLevel,
            studentName,
            examName,
            date: examDate,
            notes: examNotes,
            subjects,
            uploadedBy: typeof getCurrentUserId === 'function' ? getCurrentUserId() : null,
            uploadedByNickname: typeof getCurrentUserNickname === 'function' ? getCurrentUserNickname() : null,
            uploadedAt: new Date().toISOString()
        };
        exams.push(newExam);
        alert('Sınav başarıyla kaydedildi!');
    }
    
    saveData();
    
    // Reset form
    e.target.reset();
    document.getElementById('subjects-container').innerHTML = '';
    addSubjectRow();
    
    renderRecentEntries();
    populateStudentDropdown();
    updateQuickStats();
}

// Copy Last Exam Template
function copyLastExam() {
    const studentNameInput = document.getElementById('studentName');
    if (!studentNameInput) return;
    
    const studentName = studentNameInput.value;
    
    if (!studentName) {
        alert('Önce öğrenci adı girin!');
        return;
    }
    
    const studentExams = exams
        .filter(e => e.studentName === studentName)
        .sort((a, b) => new Date(b.date) - new Date(a.date));
    
    if (studentExams.length === 0) {
        alert('Bu öğrenci için önceki sınav bulunamadı!');
        return;
    }
    
    const lastExam = studentExams[0];
    
    document.getElementById('gradeLevel').value = lastExam.gradeLevel;
    document.getElementById('examDate').value = new Date().toISOString().split('T')[0];
    
    document.getElementById('subjects-container').innerHTML = '';
    
    lastExam.subjects.forEach(subject => {
        const container = document.getElementById('subjects-container');
        const rowId = Date.now() + Math.random();
        
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
                <input type="number" name="correct" min="0" required value="0" onchange="calculateEmpty('${rowId}')">
            </div>
            <div>
                <label>Yanlış</label>
                <input type="number" name="wrong" min="0" required value="0" onchange="calculateEmpty('${rowId}')">
            </div>
            <div>
                <label>Boş</label>
                <input type="number" name="empty" id="empty-${rowId}" value="${subject.total}" readonly style="background-color: #eee;">
            </div>
            <button type="button" class="remove-btn" onclick="this.parentElement.remove()">×</button>
        `;
        container.appendChild(row);
    });
    
    alert('✅ Son sınav şablonu kopyalandı! Puanları güncelleyin.');
}

// Cancel Edit Mode
function cancelEdit() {
    editingExamId = null;
    document.getElementById('exam-form').reset();
    document.getElementById('subjects-container').innerHTML = '';
    addSubjectRow();
    
    const cancelBtn = document.getElementById('cancel-edit-btn');
    if (cancelBtn) {
        cancelBtn.style.display = 'none';
    }
}

// Quick Stats on Entry Page
function updateQuickStats() {
    const quickStudents = document.getElementById('quick-students');
    const quickExams = document.getElementById('quick-exams');
    const quickAvg = document.getElementById('quick-avg');
    const quickTrend = document.getElementById('quick-trend');
    
    if (!quickStudents || !quickExams || !quickAvg || !quickTrend) return;
    
    const students = new Set(exams.map(e => e.studentName));
    quickStudents.textContent = students.size;
    quickExams.textContent = exams.length;
    
    let totalCorrect = 0, totalQuestions = 0;
    exams.forEach(exam => {
        exam.subjects.forEach(sub => {
            totalCorrect += sub.correct;
            totalQuestions += sub.total;
        });
    });
    
    const avg = totalQuestions > 0 ? ((totalCorrect / totalQuestions) * 100).toFixed(1) : 0;
    quickAvg.textContent = avg + '%';
    
    // Calculate recent trend
    const recentExams = exams.slice(-10);
    if (recentExams.length >= 2) {
        const firstHalf = recentExams.slice(0, Math.floor(recentExams.length / 2));
        const secondHalf = recentExams.slice(Math.floor(recentExams.length / 2));
        
        const avgFirst = calculateAverageForExams(firstHalf);
        const avgSecond = calculateAverageForExams(secondHalf);
        const diff = avgSecond - avgFirst;
        
        quickTrend.textContent = 
            diff > 2 ? '📈 Yükseliyor' : diff < -2 ? '📉 Düşüyor' : '➡️ Stabil';
    } else {
        quickTrend.textContent = '-';
    }
}

function calculateAverageForExams(examsList) {
    let total = 0, correct = 0;
    examsList.forEach(exam => {
        exam.subjects.forEach(sub => {
            total += sub.total;
            correct += sub.correct;
        });
    });
    return total > 0 ? (correct / total) * 100 : 0;
}

// Global function exports
window.switchTab = switchTab;
window.addSubjectRow = addSubjectRow;
window.calculateEmpty = calculateEmpty;
window.copyLastExam = copyLastExam;
window.cancelEdit = cancelEdit;
