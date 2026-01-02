// ===================================
// DATA MANAGEMENT (Export/Import)
// ===================================

// Export Data
function exportData() {
    const dataStr = JSON.stringify(exams, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `sinav-verileri-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    alert('✅ Veriler başarıyla dışa aktarıldı!');
}

// Import Data
function importData(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const imported = JSON.parse(e.target.result);
            
            if (!Array.isArray(imported)) {
                throw new Error('Geçersiz dosya formatı');
            }
            
            let duplicates = 0;
            let imported_count = 0;
            
            imported.forEach(exam => {
                if (!exams.some(e => 
                    e.studentName === exam.studentName && 
                    e.examName === exam.examName && 
                    e.date === exam.date
                )) {
                    exams.push(exam);
                    imported_count++;
                } else {
                    duplicates++;
                }
            });
            
            saveData();
            renderRecentEntries();
            updateGradeFilter();
            
            let message = `✅ ${imported_count} sınav başarıyla içe aktarıldı!`;
            if (duplicates > 0) {
                message += `\n⚠️ ${duplicates} tekrarlayan kayıt atlandı.`;
            }
            alert(message);
            
            event.target.value = '';
        } catch (err) {
            alert('❌ Dosya yüklenirken hata oluştu: ' + err.message);
        }
    };
    reader.readAsText(file);
}

// Export Goals
function exportGoals() {
    const dataStr = JSON.stringify(studentGoals, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `hedefler-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    alert('✅ Hedefler başarıyla dışa aktarıldı!');
}

// Import Goals
function importGoals(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const imported = JSON.parse(e.target.result);
            
            if (typeof imported !== 'object' || imported === null || Array.isArray(imported)) {
                throw new Error('Geçersiz dosya formatı');
            }
            
            studentGoals = { ...studentGoals, ...imported };
            saveGoals();
            renderGoals();
            
            alert(`✅ ${Object.keys(imported).length} hedef başarıyla içe aktarıldı!`);
            event.target.value = '';
        } catch (err) {
            alert('❌ Dosya yüklenirken hata oluştu: ' + err.message);
        }
    };
    reader.readAsText(file);
}

// Clear All Data
function clearAllData() {
    // Check authentication for cloud data
    if (typeof isAuthenticated === 'function' && !isAuthenticated()) {
        alert('⚠️ Verileri silmek için giriş yapmanız gerekiyor!');
        if (typeof openAuthModal === 'function') openAuthModal();
        return;
    }
    
    if (!confirm('⚠️ Tüm verileri silmek istediğinizden emin misiniz? Bu işlem geri alınamaz!')) {
        return;
    }
    
    if (!confirm('⚠️ SON UYARI: Bu işlem tüm sınav kayıtlarını ve hedefleri kalıcı olarak silecek!')) {
        return;
    }
    
    exams = [];
    studentGoals = {};
    editingExamId = null;
    
    // Clear localStorage
    localStorage.removeItem('studentExams');
    localStorage.removeItem('studentGoals');
    
    // Clear Firebase data
    if (typeof clearFirebaseData === 'function') {
        clearFirebaseData();
    }
    
    renderRecentEntries();
    updateGradeFilter();
    renderGoals();
    updateQuickStats();
    
    if (typeof showNotification === 'function') {
        showNotification('✅ Tüm veriler temizlendi!', 'success');
    } else {
        alert('✅ Tüm veriler temizlendi!');
    }
}

// Global exports
window.exportData = exportData;
window.importData = importData;
window.exportGoals = exportGoals;
window.importGoals = importGoals;
window.clearAllData = clearAllData;
