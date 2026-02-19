// ===================================
// DATA MANAGEMENT (Export/Import)
// ===================================

// Validate exam object structure
function validateExamStructure(exam) {
    const hasRequiredFields = exam.studentName && exam.examName && exam.date && exam.gradeLevel;
    const hasValidSubjects = Array.isArray(exam.subjects) && exam.subjects.length > 0;
    return hasRequiredFields && hasValidSubjects;
}

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
    
    // Check authentication first
    if (typeof isAuthenticated === 'function' && !isAuthenticated()) {
        if (typeof showNotification === 'function') {
            showNotification('⚠️ Verileri yüklemek için giriş yapın!', 'warning');
        } else {
            alert('⚠️ Verileri yüklemek için giriş yapın!');
        }
        if (typeof openAuthModal === 'function') openAuthModal();
        event.target.value = '';
        return;
    }
    
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
            
            // Use a Set for efficient duplicate checking
            const existingSignatures = new Set(exams.map(e => `${e.studentName}|${e.examName}|${e.date}`));

            imported.forEach(exam => {
                // Validate required fields
                if (!exam.studentName || !exam.examName || !exam.date || !exam.gradeLevel) {
                    console.warn('Skipping invalid entry:', exam);
                    invalid_count++;
                    return;
                }
                
                const signature = `${exam.studentName}|${exam.examName}|${exam.date}`;

                // Check for duplicates in existing data
                if (!existingSignatures.has(signature)) {
                    // Sanitize and prepare data
                    if (!exam.subjects) exam.subjects = [];
                    
                    // Ensure subjects have correct numbers
                    exam.subjects = (exam.subjects || []).map(sub => {
                        const total = parseInt(sub.total) || 0;
                        const correct = parseInt(sub.correct) || 0;
                        const wrong = parseInt(sub.wrong) || 0;
                        let empty = parseInt(sub.empty);
                        
                        if (isNaN(empty)) empty = total - (correct + wrong);
                        
                        return { 
                            lesson: sub.lesson || '',
                            topic: sub.topic || '',
                            total, 
                            correct, 
                            wrong, 
                            empty: Math.max(0, empty) 
                        };
                    });

                    // Generate new ID if not present
                    if (!exam.id) {
                        // Use a consistent string-based ID
                        exam.id = 'exam_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
                    } else {
                        // Ensure ID is string for consistency
                        exam.id = String(exam.id);
                    }

                    // Add upload metadata
                    if (!exam.uploadedAt) exam.uploadedAt = new Date().toISOString();
                    if (typeof getCurrentUserId === 'function' && !exam.uploadedBy) {
                        exam.uploadedBy = getCurrentUserId();
                    }
                    if (typeof getCurrentUserNickname === 'function' && !exam.uploadedByNickname) {
                        exam.uploadedByNickname = getCurrentUserNickname();
                    }

                    // Add the new exam to exams array
                    exams.push(exam);
                    console.log('✅ Imported exam:', exam.studentName, '-', exam.examName);
                    
                    // Add signature to set to prevent duplicates from the same file
                    existingSignatures.add(signature);
                    imported_count++;
                } else {
                    duplicates++;
                }
            });
            
            // Save to localStorage and Firebase
            if (imported_count > 0) {
                console.log('Saving', imported_count, 'exams to database...');
                
                // Save to localStorage first
                saveData();
                console.log('✅ Saved to localStorage');
                
                // Force UI update immediately
                if (typeof renderRecentEntries === 'function') {
                    setTimeout(() => renderRecentEntries(), 100);
                }
                if (typeof populateStudentDropdown === 'function') {
                    setTimeout(() => populateStudentDropdown(), 100);
                }
                if (typeof updateQuickStats === 'function') {
                    setTimeout(() => updateQuickStats(), 100);
                }
                if (typeof updateDashboard === 'function') {
                    setTimeout(() => updateDashboard(), 100);
                }
                
                // Also sync to Firebase if authenticated
                if (typeof saveDataToFirebase === 'function') {
                    saveDataToFirebase().then(success => {
                        if (success) {
                            console.log('✅ Synced to Firebase');
                            if (typeof showNotification === 'function') {
                                showNotification('☁️ Veriler buluta yüklendi!', 'success');
                            }
                        } else {
                            console.warn('⚠️ Firebase sync had issues');
                        }
                    }).catch(err => {
                        console.error('Firebase sync error:', err);
                    });
                }
            }
            
            let message = `✅ ${imported_count} sınav başarıyla içe aktarıldı!`;
            if (duplicates > 0) {
                message += `\n⚠️ ${duplicates} tekrarlayan kayıt atlandı.`;
            }
            if (invalid_count > 0) {
                message += `\n❌ ${invalid_count} kayıt eksik bilgi nedeniyle atlandı.`;
            }
            
            if (typeof showNotification === 'function') {
                showNotification(message, imported_count > 0 ? 'success' : 'warning');
            } else {
                alert(message);
            }
            
            event.target.value = '';
        } catch (err) {
            console.error('Import error:', err);
            if (typeof showNotification === 'function') {
                showNotification('❌ Dosya yüklenirken hata: ' + err.message, 'error');
            } else {
                alert('❌ Dosya yüklenirken hata: ' + err.message);
            }
            event.target.value = '';
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
    
    // Check authentication first
    if (typeof isAuthenticated === 'function' && !isAuthenticated()) {
        if (typeof showNotification === 'function') {
            showNotification('⚠️ Hedefleri yüklemek için giriş yapın!', 'warning');
        } else {
            alert('⚠️ Hedefleri yüklemek için giriş yapın!');
        }
        if (typeof openAuthModal === 'function') openAuthModal();
        event.target.value = '';
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const imported = JSON.parse(e.target.result);
            
            if (typeof imported !== 'object' || imported === null || Array.isArray(imported)) {
                throw new Error('Geçersiz dosya formatı. Hedefler bir JSON nesnesi olmalıdır.');
            }
            
            // Merge with existing goals
            studentGoals = { ...studentGoals, ...imported };
            
            // Save to localStorage and Firebase
            saveGoals(); // Save to localStorage
            
            // Also sync to Firebase if authenticated
            if (typeof saveGoalsToFirebase === 'function') {
                saveGoalsToFirebase().then(success => {
                    if (success) {
                        if (typeof showNotification === 'function') {
                            showNotification('☁️ Hedefler buluta yüklendi!', 'success');
                        }
                    }
                });
            }
            
            // Refresh UI
            if (typeof renderGoals === 'function') renderGoals();
            if (typeof updateDashboard === 'function') updateDashboard();
            
            if (typeof showNotification === 'function') {
                showNotification(`✅ ${Object.keys(imported).length} hedef başarıyla içe aktarıldı!`, 'success');
            } else {
                alert(`✅ ${Object.keys(imported).length} hedef başarıyla içe aktarıldı!`);
            }
            event.target.value = '';
        } catch (err) {
            console.error('Goals import error:', err);
            if (typeof showNotification === 'function') {
                showNotification('❌ Dosya yüklenirken hata: ' + err.message, 'error');
            } else {
                alert('❌ Dosya yüklenirken hata: ' + err.message);
            }
            event.target.value = '';
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
window.validateExamStructure = validateExamStructure;

// Debug function to check data
window.debugExams = function() {
    console.log('=== EXAM DATA DEBUG ===');
    console.log('Total exams:', exams.length);
    console.log('localStorage exams:', JSON.parse(localStorage.getItem('studentExams') || '[]').length);
    if (exams.length > 0) {
        console.log('First exam:', exams[0]);
    }
    console.log('Firebase ready:', typeof isFirebaseReady !== 'undefined' ? isFirebaseReady : 'unknown');
    console.log('Authenticated:', typeof isAuthenticated === 'function' ? isAuthenticated() : 'unknown');
};
