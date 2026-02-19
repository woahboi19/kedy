// ===================================
// DASHBOARD & ANALYTICS
// ===================================

// Visualization State
let currentViz = 'line';
let radarChartInstance = null;
let barChartInstance = null;

// Filter Management
function updateGradeFilter() {
    const select = document.getElementById('filterGrade');
    currentGradeFilter = select.value;
    populateStudentDropdown();
    updateDashboard();
}

function populateStudentDropdown() {
    const select = document.getElementById('filterStudent');
    const goalStudentSelect = document.getElementById('goal-student');
    if (!select) return;
    
    const currentVal = select.value;
    
    const students = [...new Set(exams
        .filter(e => e.gradeLevel === currentGradeFilter)
        .map(e => e.studentName)
    )].sort(); // Sort alphabetically
    
    // Build options HTML in one go
    let optionsHTML = '<option value="all">Tüm Öğrenciler</option>';
    let goalOptionsHTML = '<option value="">Öğrenci Seç...</option>';
    
    students.forEach(student => {
        const escapedStudent = student.replace(/"/g, '&quot;');
        optionsHTML += `<option value="${escapedStudent}">${student}</option>`;
        goalOptionsHTML += `<option value="${escapedStudent}">${student}</option>`;
    });
    
    select.innerHTML = optionsHTML;
    if (goalStudentSelect) {
        goalStudentSelect.innerHTML = goalOptionsHTML;
    }
    
    select.value = currentVal;
    updateSubjectDropdown();
}

function updateSubjectDropdown() {
    const select = document.getElementById('filterSubject');
    const goalSubjectSelect = document.getElementById('goal-subject');
    if (!select) return;
    
    const currentVal = select.value;
    // Determine whether to populate by lesson or by lesson-topic
    const compareByTopic = document.getElementById('compareByTopic')?.checked;
    const items = new Set();
    exams
        .filter(e => e.gradeLevel === currentGradeFilter)
        .forEach(exam => {
            exam.subjects.forEach(sub => {
                if (compareByTopic) {
                    const key = `${sub.lesson} - ${sub.topic || ''}`.trim();
                    if (key) items.add(key);
                } else {
                    if (sub.lesson) items.add(sub.lesson);
                }
            });
        });

    // Build options HTML efficiently
    const sortedItems = [...items].sort();
    let optionsHTML = '<option value="overall">Genel Başarı</option>';
    let goalOptionsHTML = '<option value="">Ders Seç...</option>';
    
    sortedItems.forEach(item => {
        const escaped = item.replace(/"/g, '&quot;');
        optionsHTML += `<option value="${escaped}">${item}</option>`;
        goalOptionsHTML += `<option value="${escaped}">${item}</option>`;
    });
    
    select.innerHTML = optionsHTML;
    if (goalSubjectSelect) {
        goalSubjectSelect.innerHTML = goalOptionsHTML;
    }
    
    if ([...select.options].some(o => o.value === currentVal)) {
        select.value = currentVal;
    }
}

// Date Range Filtering
function handleDateRangeChange() {
    const range = document.getElementById('dateRange').value;
    const customDiv = document.getElementById('custom-date-range');
    
    if (customDiv) {
        customDiv.style.display = range === 'custom' ? 'flex' : 'none';
    }
    
    if (range !== 'custom') {
        updateDashboard();
    }
}

function filterByDateRange(exams) {
    const rangeSelect = document.getElementById('dateRange');
    if (!rangeSelect) return exams;
    
    const range = rangeSelect.value;
    
    if (range === 'all') return exams;
    
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    
    if (range === 'custom') {
        const startInput = document.getElementById('startDate');
        const endInput = document.getElementById('endDate');
        
        if (!startInput?.value || !endInput?.value) return exams;
        
        const start = new Date(startInput.value);
        const end = new Date(endInput.value);
        end.setHours(23, 59, 59, 999);
        
        return exams.filter(e => {
            const examDate = new Date(e.date);
            return examDate >= start && examDate <= end;
        });
    }
    
    const days = parseInt(range);
    const cutoffDate = new Date(today);
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    return exams.filter(e => new Date(e.date) >= cutoffDate);
}

// Main Dashboard Update
function updateDashboard() {
    const studentFilterEl = document.getElementById('filterStudent');
    const lessonFilterEl = document.getElementById('filterSubject');
    
    if (!studentFilterEl || !lessonFilterEl) return;

    // Refresh subject dropdown in case compareByTopic toggle changed
    updateSubjectDropdown();
    
    const studentFilter = studentFilterEl.value;
    const lessonFilter = lessonFilterEl.value;
    
    let filteredExams = exams.filter(e => e.gradeLevel === currentGradeFilter);
    
    if (studentFilter !== 'all') {
        filteredExams = filteredExams.filter(e => e.studentName === studentFilter);
    }
    
    filteredExams = filterByDateRange(filteredExams);
    filteredExams.sort((a, b) => new Date(a.date) - new Date(b.date));
    
    const labels = filteredExams.map(e => `${e.date} (${e.examName})`);
    const dataPoints = [];
    
    let totalCorrect = 0;
    let totalQuestions = 0;
    
    filteredExams.forEach(exam => {
        let examCorrect = 0;
        let examTotal = 0;
        
        if (lessonFilter === 'overall') {
            exam.subjects.forEach(sub => {
                examCorrect += sub.correct;
                examTotal += sub.total;
            });
        } else {
            exam.subjects.forEach(sub => {
                if (sub.lesson === lessonFilter) {
                    examCorrect += sub.correct;
                    examTotal += sub.total;
                }
            });
        }
        
        const percentage = examTotal > 0 ? (examCorrect / examTotal) * 100 : 0;
        dataPoints.push(percentage);
        
        totalCorrect += examCorrect;
        totalQuestions += examTotal;
    });
    
    // Render appropriate chart based on current viz
    if (currentViz === 'line') {
        renderChart(labels, dataPoints, lessonFilter);
    } else if (currentViz === 'radar') {
        renderRadarChart(filteredExams, studentFilter);
    } else if (currentViz === 'bar') {
        renderBarChart(filteredExams, studentFilter);
    } else if (currentViz === 'heatmap') {
        renderHeatmap(filteredExams, studentFilter);
    }
    
    renderStats(filteredExams.length, totalCorrect, totalQuestions, filteredExams, lessonFilter);
    renderSubjectComparison(filteredExams, studentFilter);
    renderPerformanceAlerts();
    renderGoals();
}

// Chart Rendering
function renderChart(labels, data, label) {
    const ctx = document.getElementById('performanceChart');
    if (!ctx) return;
    
    const context = ctx.getContext('2d');
    
    if (chartInstance) {
        chartInstance.destroy();
    }
    
    chartInstance = new Chart(context, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: label === 'overall' ? 'Genel Başarı Oranı (%)' : `${label} Başarı Oranı (%)`,
                data: data,
                borderColor: '#4a90e2',
                backgroundColor: 'rgba(74, 144, 226, 0.1)',
                tension: 0.3,
                fill: true,
                pointRadius: 5,
                pointHoverRadius: 7
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    title: {
                        display: true,
                        text: 'Başarı Oranı (%)'
                    }
                }
            },
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `Puan: ${context.raw.toFixed(1)}%`;
                        }
                    }
                }
            }
        }
    });
}

// Stats Rendering
function renderStats(examCount, totalCorrect, totalQuestions, filteredExams = [], lessonFilter = 'overall') {
    const container = document.getElementById('stats-summary');
    if (!container) return;
    
    const overallRate = totalQuestions > 0 ? ((totalCorrect / totalQuestions) * 100).toFixed(1) : 0;
    
    let improvementTrend = 'Sabit';
    if (filteredExams.length >= 2) {
        const scores = [];
        filteredExams.forEach(exam => {
            let correct = 0, total = 0;
            if (lessonFilter === 'overall') {
                exam.subjects.forEach(sub => {
                    correct += sub.correct;
                    total += sub.total;
                });
            } else {
                exam.subjects.forEach(sub => {
                    if (sub.lesson === lessonFilter) {
                        correct += sub.correct;
                        total += sub.total;
                    }
                });
            }
            scores.push(total > 0 ? (correct / total) * 100 : 0);
        });
        
        const lastScore = scores[scores.length - 1];
        const prevScore = scores[scores.length - 2];
        const diff = lastScore - prevScore;
        
        if (diff > 2) improvementTrend = '📈 İyileşiyor';
        else if (diff < -2) improvementTrend = '📉 Düşüyor';
        else improvementTrend = '➡️ Sabit';
    }
    
    container.innerHTML = `
        <div class="stat-card">
            <div class="stat-value">${examCount}</div>
            <div class="stat-label">Analiz Edilen Sınav</div>
        </div>
        <div class="stat-card">
            <div class="stat-value">${overallRate}%</div>
            <div class="stat-label">Ortalama Başarı</div>
        </div>
        <div class="stat-card">
            <div class="stat-value">${totalQuestions}</div>
            <div class="stat-label">Çözülen Toplam Soru</div>
        </div>
        <div class="stat-card">
            <div class="stat-value">${totalCorrect}</div>
            <div class="stat-label">Toplam Doğru Cevap</div>
        </div>
        <div class="stat-card">
            <div class="stat-value">${improvementTrend}</div>
            <div class="stat-label">Eğilim</div>
        </div>
    `;
}

// Subject Comparison
function renderSubjectComparison(filteredExams, studentFilter) {
    const comparisonContainer = document.getElementById('subject-comparison');
    if (!comparisonContainer) return;
    
    const compareByTopic = document.getElementById('compareByTopic')?.checked;
    const subjectStats = {};

    filteredExams.forEach(exam => {
        exam.subjects.forEach(sub => {
            const key = compareByTopic ? `${sub.lesson} - ${sub.topic || ''}` : sub.lesson || 'Diğer';
            if (!subjectStats[key]) {
                subjectStats[key] = { correct: 0, total: 0, count: 0 };
            }
            subjectStats[key].correct += parseInt(sub.correct) || 0;
            subjectStats[key].total += parseInt(sub.total) || 0;
            subjectStats[key].count++;
        });
    });
    
    let html = '<h3>Ders Bazında Performans</h3>';
    
    if (Object.keys(subjectStats).length === 0) {
        html += '<p class="empty-state">Gösterilecek veri yok.</p>';
    } else {
        html += '<div class="subject-stats">';
        Object.entries(subjectStats).sort((a, b) => {
            const aRate = a[1].total > 0 ? (a[1].correct / a[1].total) * 100 : 0;
            const bRate = b[1].total > 0 ? (b[1].correct / b[1].total) * 100 : 0;
            return bRate - aRate;
        }).forEach(([lesson, stats]) => {
            const rate = stats.total > 0 ? ((stats.correct / stats.total) * 100).toFixed(1) : 0;
            const statusClass = rate >= 70 ? 'good' : rate >= 50 ? 'medium' : 'poor';
            html += `
                <div class="subject-stat-item ${statusClass}">
                    <strong>${lesson}</strong>
                    <span>${rate}%</span>
                    <small>${stats.correct}/${stats.total}</small>
                </div>
            `;
        });
        html += '</div>';
    }
    
    comparisonContainer.innerHTML = html;
}

// Performance Alerts
function renderPerformanceAlerts() {
    const container = document.getElementById('performance-alerts');
    if (!container) return;
    
    const alerts = [];
    const students = [...new Set(exams
        .filter(e => e.gradeLevel === currentGradeFilter)
        .map(e => e.studentName)
    )];
    
    students.forEach(student => {
        const studentExams = exams
            .filter(e => e.studentName === student && e.gradeLevel === currentGradeFilter)
            .sort((a, b) => new Date(a.date) - new Date(b.date));
        
        if (studentExams.length >= 2) {
            const recent = studentExams.slice(-3);
            const scores = recent.map(e => {
                const total = e.subjects.reduce((sum, sub) => sum + sub.total, 0);
                const correct = e.subjects.reduce((sum, sub) => sum + sub.correct, 0);
                return total > 0 ? (correct / total) * 100 : 0;
            });
            
            const lastScore = scores[scores.length - 1];
            const prevScore = scores[scores.length - 2];
            const diff = lastScore - prevScore;
            
            if (diff < -10) {
                alerts.push({
                    type: 'danger',
                    message: `⚠️ <strong>${student}</strong> performansı %${Math.abs(diff).toFixed(1)} düştü!`
                });
            } else if (diff > 10) {
                alerts.push({
                    type: 'success',
                    message: `🎉 <strong>${student}</strong> performansı %${diff.toFixed(1)} arttı!`
                });
            }
            
            if (lastScore < 50) {
                alerts.push({
                    type: 'warning',
                    message: `📌 <strong>${student}</strong> dikkat gerektiriyor (Son sınav: ${lastScore.toFixed(1)}%)`
                });
            }
        }
    });
    
    if (alerts.length === 0) {
        container.innerHTML = '';
        return;
    }
    
    let html = '<div class="alerts-grid">';
    alerts.forEach(alert => {
        html += `<div class="alert alert-${alert.type}">${alert.message}</div>`;
    });
    html += '</div>';
    
    container.innerHTML = html;
}

// ===================================
// ADVANCED VISUALIZATIONS
// ===================================

// Switch Visualization Type
function switchViz(vizType) {
    currentViz = vizType;
    
    // Update tab buttons
    document.querySelectorAll('.viz-tab').forEach(btn => btn.classList.remove('active'));
    document.getElementById(`viz-${vizType}`).classList.add('active');
    
    // Show/hide chart containers
    ['line', 'radar', 'bar', 'heatmap'].forEach(type => {
        const container = document.getElementById(`chart-${type}`);
        if (container) {
            container.style.display = type === vizType ? 'block' : 'none';
        }
    });
    
    // Re-render dashboard with new viz
    updateDashboard();
}

// Radar Chart - Multi-subject comparison
function renderRadarChart(filteredExams, studentFilter) {
    const ctx = document.getElementById('radarChart');
    if (!ctx) return;
    
    if (radarChartInstance) {
        radarChartInstance.destroy();
        radarChartInstance = null;
    }
    
    // Collect subject (or topic) data
    const compareByTopic = document.getElementById('compareByTopic')?.checked;
    const subjectData = {};
    filteredExams.forEach(exam => {
        exam.subjects.forEach(sub => {
            const key = compareByTopic ? `${sub.lesson} - ${sub.topic || ''}` : sub.lesson || 'Diğer';
            if (!subjectData[key]) {
                subjectData[key] = { correct: 0, total: 0 };
            }
            subjectData[key].correct += parseInt(sub.correct) || 0;
            subjectData[key].total += parseInt(sub.total) || 0;
        });
    });
    
    const labels = Object.keys(subjectData);
    const data = labels.map(lesson => {
        const perf = subjectData[lesson];
        return perf.total > 0 ? (perf.correct / perf.total) * 100 : 0;
    });
    
    if (labels.length === 0) {
        ctx.getContext('2d').clearRect(0, 0, ctx.width, ctx.height);
        return;
    }
    
    radarChartInstance = new Chart(ctx.getContext('2d'), {
        type: 'radar',
        data: {
            labels: labels,
            datasets: [{
                label: studentFilter === 'all' ? 'Tüm Öğrenciler' : studentFilter,
                data: data,
                backgroundColor: 'rgba(74, 144, 226, 0.2)',
                borderColor: '#4a90e2',
                borderWidth: 2,
                pointBackgroundColor: '#4a90e2',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: '#4a90e2'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            scales: {
                r: {
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                        stepSize: 20
                    }
                }
            },
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.label}: ${context.raw.toFixed(1)}%`;
                        }
                    }
                }
            }
        }
    });
}

// Bar Chart - Subject comparison
function renderBarChart(filteredExams, studentFilter) {
    const ctx = document.getElementById('barChart');
    if (!ctx) return;
    
    if (barChartInstance) {
        barChartInstance.destroy();
        barChartInstance = null;
    }
    
    // Collect subject (or topic) data
    const compareByTopic = document.getElementById('compareByTopic')?.checked;
    const subjectData = {};
    filteredExams.forEach(exam => {
        exam.subjects.forEach(sub => {
            const key = compareByTopic ? `${sub.lesson} - ${sub.topic || ''}` : sub.lesson || 'Diğer';
            if (!subjectData[key]) {
                subjectData[key] = { correct: 0, total: 0 };
            }
            subjectData[key].correct += parseInt(sub.correct) || 0;
            subjectData[key].total += parseInt(sub.total) || 0;
        });
    });
    
    const labels = Object.keys(subjectData).sort();
    const data = labels.map(lesson => {
        const perf = subjectData[lesson];
        return perf.total > 0 ? (perf.correct / perf.total) * 100 : 0;
    });
    
    // Color based on performance
    const backgroundColors = data.map(score => {
        if (score >= 85) return '#27ae60';
        if (score >= 70) return '#2ecc71';
        if (score >= 50) return '#f39c12';
        if (score >= 30) return '#e67e22';
        return '#e74c3c';
    });
    
    if (labels.length === 0) {
        ctx.getContext('2d').clearRect(0, 0, ctx.width, ctx.height);
        return;
    }
    
    barChartInstance = new Chart(ctx.getContext('2d'), {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Başarı Oranı (%)',
                data: data,
                backgroundColor: backgroundColors,
                borderColor: backgroundColors.map(c => c),
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                        callback: function(value) {
                            return value + '%';
                        }
                    }
                }
            },
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `Başarı: ${context.raw.toFixed(1)}%`;
                        }
                    }
                },
                legend: {
                    display: false
                }
            }
        }
    });
}

// Heatmap - Performance over time and subjects
function renderHeatmap(filteredExams, studentFilter) {
    const container = document.getElementById('heatmapGrid');
    if (!container) return;
    
    if (filteredExams.length === 0) {
        container.innerHTML = '<p class="empty-state">Veri yok</p>';
        return;
    }
    
    // Organize data by subject or topic and exam
    const compareByTopic = document.getElementById('compareByTopic')?.checked;
    const subjects = new Set();
    filteredExams.forEach(exam => {
        exam.subjects.forEach(sub => {
            const key = compareByTopic ? `${sub.lesson} - ${sub.topic || ''}` : sub.lesson || 'Diğer';
            subjects.add(key);
        });
    });

    const subjectList = [...subjects].sort();
    
    // Build heatmap
    let html = '<div style="overflow-x: auto;">';
    
    // Header row
    html += '<div class="heatmap-row">';
    html += '<div class="heatmap-label"></div>';
    filteredExams.forEach(exam => {
        const shortName = exam.examName.length > 10 ? 
            exam.examName.substring(0, 10) + '...' : exam.examName;
        html += `<div class="heatmap-cell" style="background: #f5f6fa; color: #2c3e50; font-weight: bold; min-height: 50px;">
            ${shortName}<br><span style="font-size: 0.7rem;">${exam.date}</span>
        </div>`;
    });
    html += '</div>';
    
    // Data rows
    subjectList.forEach(subject => {
        html += '<div class="heatmap-row">';
        html += `<div class="heatmap-label">${subject}</div>`;
        
        filteredExams.forEach(exam => {
            // Aggregate all subject rows that belong to this lesson/topic
            let subs;
            if (compareByTopic) {
                subs = exam.subjects.filter(s => `${s.lesson} - ${s.topic || ''}` === subject);
            } else {
                subs = exam.subjects.filter(s => s.lesson === subject);
            }
            if (subs.length > 0) {
                const total = subs.reduce((sum, s) => sum + (s.total || 0), 0);
                const correct = subs.reduce((sum, s) => sum + (s.correct || 0), 0);
                const percentage = total > 0 ? (correct / total) * 100 : 0;

                let colorClass = 'perf-verypoor';
                if (percentage >= 85) colorClass = 'perf-excellent';
                else if (percentage >= 70) colorClass = 'perf-good';
                else if (percentage >= 50) colorClass = 'perf-average';
                else if (percentage >= 30) colorClass = 'perf-poor';

                // Show combined correct/total; include topic count in tooltip
                html += `<div class="heatmap-cell ${colorClass}" title="${subject}: ${percentage.toFixed(1)}% (${correct}/${total}) - ${subs.length} konu">
                    <div class="heatmap-score">${percentage.toFixed(0)}%</div>
                    <div class="heatmap-detail">${correct}/${total}</div>
                </div>`;
            } else {
                html += '<div class="heatmap-cell" style="background: #ecf0f1; color: #95a5a6;">-</div>';
            }
        });
        
        html += '</div>';
    });
    
    html += '</div>';
    
    // Add legend
    html += `
        <div class="heatmap-legend">
            <div class="legend-item">
                <div class="legend-color perf-excellent"></div>
                <span>Mükemmel (85%+)</span>
            </div>
            <div class="legend-item">
                <div class="legend-color perf-good"></div>
                <span>İyi (70-84%)</span>
            </div>
            <div class="legend-item">
                <div class="legend-color perf-average"></div>
                <span>Orta (50-69%)</span>
            </div>
            <div class="legend-item">
                <div class="legend-color perf-poor"></div>
                <span>Zayıf (30-49%)</span>
            </div>
            <div class="legend-item">
                <div class="legend-color perf-verypoor"></div>
                <span>Çok Zayıf (<30%)</span>
            </div>
        </div>
    `;
    
    container.innerHTML = html;
}

// Global exports
window.updateGradeFilter = updateGradeFilter;
window.populateStudentDropdown = populateStudentDropdown;
window.updateDashboard = updateDashboard;
window.handleDateRangeChange = handleDateRangeChange;
window.switchViz = switchViz;
