// ===================================
// REPORTS & PRINTING
// ===================================

// Print Report
function printReport() {
    const studentFilter = document.getElementById('filterStudent').value;
    
    if (studentFilter === 'all') {
        generateClassReport();
    } else {
        generateStudentReport(studentFilter);
    }
}

// Generate Student Report
function generateStudentReport(studentName) {
    const studentExams = exams.filter(e => 
        e.studentName === studentName && 
        e.gradeLevel === currentGradeFilter
    ).sort((a, b) => new Date(a.date) - new Date(b.date));
    
    if (studentExams.length === 0) {
        alert('Bu öğrenci için sınav kaydı bulunamadı!');
        return;
    }
    
    const printWindow = window.open('', '_blank');
    const html = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>${studentName} - Performans Raporu</title>
            <style>
                body { font-family: Arial; margin: 40px; }
                h1 { color: #4a90e2; border-bottom: 3px solid #4a90e2; padding-bottom: 10px; }
                h2 { color: #2c3e50; margin-top: 30px; }
                .header { display: flex; justify-content: space-between; margin-bottom: 30px; }
                .stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin: 30px 0; }
                .stat-box { 
                    border: 2px solid #4a90e2; 
                    padding: 20px; 
                    text-align: center; 
                    border-radius: 8px;
                    background: #f8f9fa;
                }
                .stat-value { font-size: 2.5em; font-weight: bold; color: #4a90e2; margin: 10px 0; }
                .stat-label { color: #7f8c8d; font-size: 0.9em; }
                table { 
                    width: 100%; 
                    border-collapse: collapse; 
                    margin: 20px 0;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                }
                th, td { 
                    border: 1px solid #ddd; 
                    padding: 12px; 
                    text-align: left; 
                }
                th { 
                    background-color: #4a90e2; 
                    color: white; 
                    font-weight: bold;
                }
                tr:nth-child(even) { background-color: #f8f9fa; }
                tr:hover { background-color: #e8f4f8; }
                .footer { 
                    margin-top: 40px; 
                    text-align: center; 
                    color: #888;
                    border-top: 2px solid #ddd;
                    padding-top: 20px;
                }
                .grade-badge {
                    display: inline-block;
                    padding: 5px 15px;
                    background: #4a90e2;
                    color: white;
                    border-radius: 15px;
                    font-size: 0.9em;
                }
                @media print {
                    body { margin: 20px; }
                    .stats { page-break-inside: avoid; }
                    table { page-break-inside: avoid; }
                }
            </style>
        </head>
        <body>
            <div class="header">
                <div>
                    <h1>📊 ${studentName} - Performans Raporu</h1>
                    <p><span class="grade-badge">${currentGradeFilter}</span></p>
                </div>
                <div style="text-align: right;">
                    <p><strong>Rapor Tarihi:</strong><br>${new Date().toLocaleDateString('tr-TR', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                    })}</p>
                </div>
            </div>
            
            <div class="stats">
                ${generateStudentStats(studentExams)}
            </div>
            
            <h2>📋 Sınav Geçmişi</h2>
            <table>
                <thead>
                    <tr>
                        <th>Tarih</th>
                        <th>Sınav</th>
                        <th>Ders Sayısı</th>
                        <th>Toplam Soru</th>
                        <th>Doğru</th>
                        <th>Yanlış</th>
                        <th>Boş</th>
                        <th>Başarı Oranı</th>
                    </tr>
                </thead>
                <tbody>
                    ${generateExamRows(studentExams)}
                </tbody>
            </table>
            
            <h2>📚 Ders Bazında Performans</h2>
            ${generateSubjectBreakdown(studentExams)}
            
            <div class="footer">
                <p><strong>Öğrenci Takip Sistemi</strong></p>
                <p>© ${new Date().getFullYear()} - Tüm hakları saklıdır</p>
            </div>
            
            <script>
                window.onload = function() {
                    window.print();
                };
            </script>
        </body>
        </html>
    `;
    
    printWindow.document.write(html);
    printWindow.document.close();
}

// Generate Student Stats
function generateStudentStats(studentExams) {
    let totalCorrect = 0, totalQuestions = 0, totalExams = studentExams.length;
    
    studentExams.forEach(exam => {
        exam.subjects.forEach(sub => {
            totalCorrect += sub.correct;
            totalQuestions += sub.total;
        });
    });
    
    const avg = totalQuestions > 0 ? ((totalCorrect / totalQuestions) * 100).toFixed(1) : 0;
    
    // Calculate trend
    let trend = '➡️ Stabil';
    if (studentExams.length >= 2) {
        const firstHalf = studentExams.slice(0, Math.floor(studentExams.length / 2));
        const secondHalf = studentExams.slice(Math.floor(studentExams.length / 2));
        
        const avgFirst = calculateAverageForExams(firstHalf);
        const avgSecond = calculateAverageForExams(secondHalf);
        const diff = avgSecond - avgFirst;
        
        if (diff > 2) trend = '📈 Yükseliyor';
        else if (diff < -2) trend = '📉 Düşüyor';
    }
    
    return `
        <div class="stat-box">
            <div class="stat-label">Toplam Sınav</div>
            <div class="stat-value">${totalExams}</div>
        </div>
        <div class="stat-box">
            <div class="stat-label">Ortalama Başarı</div>
            <div class="stat-value">${avg}%</div>
        </div>
        <div class="stat-box">
            <div class="stat-label">Doğru / Toplam</div>
            <div class="stat-value">${totalCorrect} / ${totalQuestions}</div>
        </div>
    `;
}

// Generate Exam Rows
function generateExamRows(studentExams) {
    return studentExams.map(exam => {
        const totalQ = exam.subjects.reduce((sum, sub) => sum + sub.total, 0);
        const totalC = exam.subjects.reduce((sum, sub) => sum + sub.correct, 0);
        const totalW = exam.subjects.reduce((sum, sub) => sum + sub.wrong, 0);
        const totalE = exam.subjects.reduce((sum, sub) => sum + sub.empty, 0);
        const perc = totalQ > 0 ? ((totalC / totalQ) * 100).toFixed(1) : 0;
        
        return `
            <tr>
                <td>${new Date(exam.date).toLocaleDateString('tr-TR')}</td>
                <td><strong>${exam.examName}</strong></td>
                <td>${exam.subjects.length}</td>
                <td>${totalQ}</td>
                <td style="color: #2ecc71; font-weight: bold;">${totalC}</td>
                <td style="color: #e74c3c; font-weight: bold;">${totalW}</td>
                <td style="color: #f1c40f; font-weight: bold;">${totalE}</td>
                <td style="font-weight: bold; font-size: 1.1em;">${perc}%</td>
            </tr>
        `;
    }).join('');
}

// Generate Subject Breakdown
function generateSubjectBreakdown(studentExams) {
    const subjectStats = {};
    
    studentExams.forEach(exam => {
        exam.subjects.forEach(sub => {
            if (!subjectStats[sub.lesson]) {
                subjectStats[sub.lesson] = { correct: 0, total: 0 };
            }
            subjectStats[sub.lesson].correct += sub.correct;
            subjectStats[sub.lesson].total += sub.total;
        });
    });
    
    let html = '<table><thead><tr><th>Ders</th><th>Doğru</th><th>Toplam</th><th>Başarı Oranı</th></tr></thead><tbody>';
    
    Object.entries(subjectStats)
        .sort((a, b) => {
            const aRate = a[1].total > 0 ? (a[1].correct / a[1].total) * 100 : 0;
            const bRate = b[1].total > 0 ? (b[1].correct / b[1].total) * 100 : 0;
            return bRate - aRate;
        })
        .forEach(([lesson, stats]) => {
            const rate = stats.total > 0 ? ((stats.correct / stats.total) * 100).toFixed(1) : 0;
            const color = rate >= 70 ? '#2ecc71' : rate >= 50 ? '#f1c40f' : '#e74c3c';
            
            html += `
                <tr>
                    <td><strong>${lesson}</strong></td>
                    <td>${stats.correct}</td>
                    <td>${stats.total}</td>
                    <td style="color: ${color}; font-weight: bold; font-size: 1.1em;">${rate}%</td>
                </tr>
            `;
        });
    
    html += '</tbody></table>';
    return html;
}

// Generate Class Report
function generateClassReport() {
    const allStudents = [...new Set(exams
        .filter(e => e.gradeLevel === currentGradeFilter)
        .map(e => e.studentName)
    )];
    
    if (allStudents.length === 0) {
        alert('Bu sınıf için kayıt bulunamadı!');
        return;
    }
    
    const printWindow = window.open('', '_blank');
    const html = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Sınıf Raporu - ${currentGradeFilter}</title>
            <style>
                body { font-family: Arial; margin: 40px; }
                h1 { color: #4a90e2; }
                table { 
                    width: 100%; 
                    border-collapse: collapse; 
                    margin: 20px 0;
                }
                th, td { 
                    border: 1px solid #ddd; 
                    padding: 12px; 
                    text-align: left; 
                }
                th { 
                    background-color: #4a90e2; 
                    color: white; 
                }
                tr:nth-child(even) { background-color: #f8f9fa; }
            </style>
        </head>
        <body>
            <h1>📊 Sınıf Raporu - ${currentGradeFilter}</h1>
            <p><strong>Rapor Tarihi:</strong> ${new Date().toLocaleDateString('tr-TR')}</p>
            <p><strong>Toplam Öğrenci:</strong> ${allStudents.length}</p>
            
            <h2>Öğrenci Performansları</h2>
            <table>
                <thead>
                    <tr>
                        <th>Öğrenci</th>
                        <th>Sınav Sayısı</th>
                        <th>Ortalama</th>
                        <th>En Yüksek</th>
                        <th>En Düşük</th>
                    </tr>
                </thead>
                <tbody>
                    ${generateClassRows(allStudents)}
                </tbody>
            </table>
            
            <script>window.onload = function() { window.print(); };</script>
        </body>
        </html>
    `;
    
    printWindow.document.write(html);
    printWindow.document.close();
}

// Generate Class Rows
function generateClassRows(students) {
    return students.map(student => {
        const studentExams = exams.filter(e => 
            e.studentName === student && 
            e.gradeLevel === currentGradeFilter
        );
        
        const scores = studentExams.map(exam => {
            const total = exam.subjects.reduce((sum, sub) => sum + sub.total, 0);
            const correct = exam.subjects.reduce((sum, sub) => sum + sub.correct, 0);
            return total > 0 ? (correct / total) * 100 : 0;
        });
        
        const avg = scores.length > 0 ? (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1) : 0;
        const max = scores.length > 0 ? Math.max(...scores).toFixed(1) : 0;
        const min = scores.length > 0 ? Math.min(...scores).toFixed(1) : 0;
        
        return `
            <tr>
                <td><strong>${student}</strong></td>
                <td>${studentExams.length}</td>
                <td>${avg}%</td>
                <td style="color: #2ecc71; font-weight: bold;">${max}%</td>
                <td style="color: #e74c3c; font-weight: bold;">${min}%</td>
            </tr>
        `;
    }).join('');
}

// Global exports
window.printReport = printReport;
