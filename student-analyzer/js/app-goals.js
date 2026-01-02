// ===================================
// GOALS & TARGETS MANAGEMENT
// ===================================

// Set Goal
function setGoal() {
    // Check authentication
    if (typeof isAuthenticated === 'function' && !isAuthenticated()) {
        if (typeof showNotification === 'function') {
            showNotification('⚠️ Hedef belirlemek için giriş yapın!', 'warning');
        }
        if (typeof openAuthModal === 'function') openAuthModal();
        return;
    }
    
    const studentSelect = document.getElementById('goal-student');
    const subjectSelect = document.getElementById('goal-subject');
    const percentageInput = document.getElementById('goal-percentage');
    
    if (!studentSelect || !subjectSelect || !percentageInput) return;
    
    const student = studentSelect.value;
    const subject = subjectSelect.value;
    const target = parseInt(percentageInput.value);
    
    if (!student || !subject || !target) {
        alert('Lütfen tüm alanları doldurun!');
        return;
    }
    
    if (target < 0 || target > 100) {
        alert('Hedef 0-100 arasında olmalıdır!');
        return;
    }
    
    const key = `${student}-${subject}`;
    studentGoals[key] = { target, student, subject };
    saveGoals();
    
    renderGoals();
    
    // Clear inputs
    subjectSelect.value = '';
    percentageInput.value = '';
    
    if (typeof showNotification === 'function') {
        showNotification('✅ Hedef başarıyla belirlendi!', 'success');
    } else {
        alert('✅ Hedef başarıyla belirlendi!');
    }
}

// Render Goals
function renderGoals() {
    const container = document.getElementById('goals-list');
    if (!container) return;
    
    const currentGradeGoals = Object.entries(studentGoals).filter(([key, goal]) => {
        const studentExams = exams.filter(e => e.studentName === goal.student);
        return studentExams.some(e => e.gradeLevel === currentGradeFilter);
    });
    
    if (currentGradeGoals.length === 0) {
        container.innerHTML = '<p class="empty-state">Henüz hedef belirlenmedi.</p>';
        return;
    }
    
    let html = '';
    currentGradeGoals.forEach(([key, goal]) => {
        const current = calculateCurrentPerformance(goal.student, goal.subject);
        const diff = current - goal.target;
        const status = diff >= 0 ? 'success' : 'warning';
        const icon = diff >= 0 ? '✅' : '⚠️';
        
        html += `
            <div class="goal-item ${status}">
                <div class="goal-info">
                    <span>${icon} <strong>${goal.student}</strong> - ${goal.subject}</span>
                    <span class="goal-progress">Hedef: ${goal.target}% | Mevcut: ${current.toFixed(1)}%</span>
                </div>
                <button onclick="deleteGoal('${key}')" class="remove-btn-small" title="Hedefi Sil">×</button>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

// Calculate Current Performance
function calculateCurrentPerformance(studentName, subject) {
    const studentExams = exams.filter(e => 
        e.studentName === studentName && 
        e.gradeLevel === currentGradeFilter
    );
    
    let total = 0, correct = 0;
    
    studentExams.forEach(exam => {
        exam.subjects.forEach(sub => {
            if (sub.lesson === subject) {
                total += sub.total;
                correct += sub.correct;
            }
        });
    });
    
    return total > 0 ? (correct / total) * 100 : 0;
}

// Delete Goal
function deleteGoal(key) {
    // Check authentication
    if (typeof isAuthenticated === 'function' && !isAuthenticated()) {
        if (typeof showNotification === 'function') {
            showNotification('⚠️ Silmek için giriş yapın!', 'warning');
        }
        if (typeof openAuthModal === 'function') openAuthModal();
        return;
    }
    
    if (confirm('Bu hedefi silmek istediğinizden emin misiniz?')) {
        delete studentGoals[key];
        saveGoals();
        renderGoals();
        if (typeof showNotification === 'function') {
            showNotification('✅ Hedef silindi!', 'success');
        } else {
            alert('✅ Hedef silindi!');
        }
    }
}

// Global exports
window.setGoal = setGoal;
window.deleteGoal = deleteGoal;
