// ===================================
// DATA MANAGEMENT (Export/Import)
// ===================================

// Download Template for Manual Entry
function downloadTemplate() {
    const template = [
        {
            "studentName": "Öğrenci Adı Soyadı",
            "examName": "Deneme Sınavı 1",
            "date": new Date().toISOString().split('T')[0],
            "gradeLevel": "Lise Hazırlık",
            "notes": "Sınav hakkında notlar...",
            "subjects": [
                {
                    "lesson": "Matematik",
                    "topic": "Üslü Sayılar",
                    "correct": 15,
                    "wrong": 2,
                    "empty": 3,
                    "total": 20
                }
            ]
        }
    ];
    
    const dataStr = JSON.stringify(template, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `sinav-sablonu.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

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
            const importedData = JSON.parse(e.target.result);
            let imported;
            
            // Allow importing a single exam object or an array of them
            if (Array.isArray(importedData)) {
                imported = importedData;
            } else if (typeof importedData === 'object' && importedData !== null) {
                imported = [importedData]; // Wrap single object in an array
            } else {
                throw new Error('Geçersiz dosya formatı. Dosya bir JSON dizisi veya tek bir JSON nesnesi olmalıdır.');
            }
            
            let duplicates = 0;
            let imported_count = 0;
            let invalid_count = 0;
            
            imported.forEach(exam => {
                // Validate required fields
                if (!exam.studentName || !exam.examName || !exam.date || !exam.gradeLevel) {
                    console.warn('Skipping invalid entry:', exam);
                    invalid_count++;
                    return;
                }

                if (!exams.some(e => 
                    e.studentName === exam.studentName && 
                    e.examName === exam.examName && 
                    e.date === exam.date
                )) {
                    // Sanitize and prepare data for manual entries
                    if (!exam.id) exam.id = Date.now() + Math.random();
                    if (!exam.subjects) exam.subjects = [];
                    
                    // Ensure subjects have correct numbers
                    exam.subjects = exam.subjects.map(sub => {
                        const total = parseInt(sub.total) || 0;
                        const correct = parseInt(sub.correct) || 0;
                        const wrong = parseInt(sub.wrong) || 0;
                        let empty = parseInt(sub.empty);
                        
                        if (isNaN(empty)) empty = total - (correct + wrong);
                        
                        return {
                            ...sub,
                            total, correct, wrong, 
                            empty: Math.max(0, empty)
                        };
                    });

                    // Add upload metadata
                    if (!exam.uploadedAt) exam.uploadedAt = new Date().toISOString();
                    if (typeof getCurrentUserId === 'function' && !exam.uploadedBy) {
                        exam.uploadedBy = getCurrentUserId();
                    }
                    if (typeof getCurrentUserNickname === 'function' && !exam.uploadedByNickname) {
                        exam.uploadedByNickname = getCurrentUserNickname();
                    }

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
            if (invalid_count > 0) {
                message += `\n❌ ${invalid_count} kayıt eksik bilgi (örn. Sınav Türü) nedeniyle atlandı.`;
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
window.downloadTemplate = downloadTemplate;
window.exportData = exportData;
window.importData = importData;
window.exportGoals = exportGoals;
window.importGoals = importGoals;
window.clearAllData = clearAllData;
