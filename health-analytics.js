// Health Analytics JavaScript
let bloodPressureChart, bloodSugarChart, weightChart, heartRateChart;

// Sample health data (in a real app, this would come from a database)
const healthData = {
    bloodPressure: [
        { date: '2024-01-01', systolic: 128, diastolic: 82 },
        { date: '2024-01-03', systolic: 125, diastolic: 80 },
        { date: '2024-01-05', systolic: 130, diastolic: 85 },
        { date: '2024-01-07', systolic: 122, diastolic: 78 },
        { date: '2024-01-09', systolic: 126, diastolic: 81 },
        { date: '2024-01-11', systolic: 124, diastolic: 79 },
        { date: '2024-01-13', systolic: 127, diastolic: 83 },
        { date: '2024-01-15', systolic: 123, diastolic: 77 }
    ],
    bloodSugar: [
        { date: '2024-01-01', value: 126, type: 'fasting' },
        { date: '2024-01-02', value: 145, type: 'post-meal' },
        { date: '2024-01-03', value: 118, type: 'fasting' },
        { date: '2024-01-04', value: 152, type: 'post-meal' },
        { date: '2024-01-05', value: 124, type: 'fasting' },
        { date: '2024-01-06', value: 138, type: 'post-meal' },
        { date: '2024-01-07', value: 121, type: 'fasting' },
        { date: '2024-01-08', value: 142, type: 'post-meal' }
    ],
    weight: [
        { date: '2024-01-01', value: 168 },
        { date: '2024-01-08', value: 167 },
        { date: '2024-01-15', value: 166 },
        { date: '2024-01-22', value: 165 },
        { date: '2024-01-29', value: 164 }
    ],
    heartRate: [
        { date: '2024-01-01', value: 75 },
        { date: '2024-01-02', value: 72 },
        { date: '2024-01-03', value: 74 },
        { date: '2024-01-04', value: 71 },
        { date: '2024-01-05', value: 73 },
        { date: '2024-01-06', value: 70 },
        { date: '2024-01-07', value: 72 },
        { date: '2024-01-08', value: 74 }
    ]
};

document.addEventListener('DOMContentLoaded', function() {
    initializeCharts();
    updateMetrics();
    populateRecentReadings();
});

function initializeCharts() {
    // Blood Pressure Chart
    const bpCtx = document.getElementById('bloodPressureChart').getContext('2d');
    bloodPressureChart = new Chart(bpCtx, {
        type: 'line',
        data: {
            labels: healthData.bloodPressure.map(d => formatDate(d.date)),
            datasets: [{
                label: 'Systolic',
                data: healthData.bloodPressure.map(d => d.systolic),
                borderColor: '#ef4444',
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                tension: 0.4
            }, {
                label: 'Diastolic',
                data: healthData.bloodPressure.map(d => d.diastolic),
                borderColor: '#3b82f6',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                }
            },
            scales: {
                y: {
                    beginAtZero: false,
                    min: 60,
                    max: 160
                }
            }
        }
    });

    // Blood Sugar Chart
    const bsCtx = document.getElementById('bloodSugarChart').getContext('2d');
    bloodSugarChart = new Chart(bsCtx, {
        type: 'line',
        data: {
            labels: healthData.bloodSugar.map(d => formatDate(d.date)),
            datasets: [{
                label: 'Blood Sugar',
                data: healthData.bloodSugar.map(d => d.value),
                borderColor: '#f59e0b',
                backgroundColor: 'rgba(245, 158, 11, 0.1)',
                tension: 0.4,
                pointBackgroundColor: healthData.bloodSugar.map(d => d.type === 'fasting' ? '#10b981' : '#f59e0b')
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                }
            },
            scales: {
                y: {
                    beginAtZero: false,
                    min: 80,
                    max: 200
                }
            }
        }
    });

    // Weight Chart
    const weightCtx = document.getElementById('weightChart').getContext('2d');
    weightChart = new Chart(weightCtx, {
        type: 'line',
        data: {
            labels: healthData.weight.map(d => formatDate(d.date)),
            datasets: [{
                label: 'Weight (lbs)',
                data: healthData.weight.map(d => d.value),
                borderColor: '#10b981',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                }
            },
            scales: {
                y: {
                    beginAtZero: false,
                    min: 160,
                    max: 170
                }
            }
        }
    });

    // Heart Rate Chart
    const hrCtx = document.getElementById('heartRateChart').getContext('2d');
    heartRateChart = new Chart(hrCtx, {
        type: 'bar',
        data: {
            labels: healthData.heartRate.map(d => formatDate(d.date)),
            datasets: [{
                label: 'Heart Rate (BPM)',
                data: healthData.heartRate.map(d => d.value),
                backgroundColor: 'rgba(139, 69, 19, 0.6)',
                borderColor: '#8b4513',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                }
            },
            scales: {
                y: {
                    beginAtZero: false,
                    min: 60,
                    max: 90
                }
            }
        }
    });
}

function updateCharts() {
    const timeRange = document.getElementById('timeRange').value;
    // In a real app, this would filter data based on the selected time range
    // For now, we'll just show a message
    console.log(`Updating charts for ${timeRange} days`);
}

function updateMetrics() {
    // Calculate averages
    const avgSystolic = Math.round(healthData.bloodPressure.reduce((sum, d) => sum + d.systolic, 0) / healthData.bloodPressure.length);
    const avgDiastolic = Math.round(healthData.bloodPressure.reduce((sum, d) => sum + d.diastolic, 0) / healthData.bloodPressure.length);
    const avgBloodSugar = Math.round(healthData.bloodSugar.reduce((sum, d) => sum + d.value, 0) / healthData.bloodSugar.length);
    const currentWeight = healthData.weight[healthData.weight.length - 1].value;
    const avgHeartRate = Math.round(healthData.heartRate.reduce((sum, d) => sum + d.value, 0) / healthData.heartRate.length);

    // Update display
    document.getElementById('avgBloodPressure').textContent = `${avgSystolic}/${avgDiastolic}`;
    document.getElementById('avgBloodSugar').textContent = avgBloodSugar;
    document.getElementById('currentWeight').textContent = `${currentWeight} lbs`;
    document.getElementById('avgHeartRate').textContent = `${avgHeartRate} BPM`;
}

function populateRecentReadings() {
    const tableBody = document.getElementById('recentReadingsTable');
    
    // Combine recent readings (simplified for demo)
    const recentReadings = [
        { date: '2024-01-15', bp: '123/77', bs: '121', weight: '164', hr: '72', status: 'Good' },
        { date: '2024-01-13', bp: '127/83', bs: '142', weight: '165', hr: '74', status: 'Fair' },
        { date: '2024-01-11', bp: '124/79', bs: '138', weight: '165', hr: '70', status: 'Good' },
        { date: '2024-01-09', bp: '126/81', bs: '124', weight: '166', hr: '73', status: 'Good' },
        { date: '2024-01-07', bp: '122/78', bs: '121', weight: '166', hr: '72', status: 'Excellent' }
    ];

    tableBody.innerHTML = recentReadings.map(reading => `
        <tr>
            <td>${formatDate(reading.date)}</td>
            <td>${reading.bp} mmHg</td>
            <td>${reading.bs} mg/dL</td>
            <td>${reading.weight} lbs</td>
            <td>${reading.hr} BPM</td>
            <td><span class="badge ${getStatusClass(reading.status)}">${reading.status}</span></td>
        </tr>
    `).join('');
}

function getStatusClass(status) {
    switch (status.toLowerCase()) {
        case 'excellent': return 'success';
        case 'good': return '';
        case 'fair': return 'warning';
        case 'poor': return 'alert';
        default: return '';
    }
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function generateAIInsights() {
    const aiPanel = document.getElementById('aiInsightsPanel');
    const aiContent = document.getElementById('aiInsightsContent');
    
    // Simulate AI analysis
    aiContent.innerHTML = '<div style="text-align: center; padding: 20px;"><div class="loading-spinner"></div><p>Analyzing your health data...</p></div>';
    aiPanel.style.display = 'block';
    
    setTimeout(() => {
        const insights = [
            {
                type: 'positive',
                title: 'Blood Pressure Improvement',
                message: 'Your blood pressure has shown a positive trend over the last 30 days, with 85% of readings within the target range.'
            },
            {
                type: 'warning',
                title: 'Blood Sugar Variability',
                message: 'Your post-meal blood sugar levels show some variability. Consider monitoring carbohydrate intake and meal timing.'
            },
            {
                type: 'positive',
                title: 'Weight Management',
                message: 'Excellent progress on weight management! You\'ve maintained a steady downward trend of 1 lb per week.'
            },
            {
                type: 'info',
                title: 'Heart Rate Stability',
                message: 'Your resting heart rate is consistently within the healthy range, indicating good cardiovascular fitness.'
            }
        ];

        aiContent.innerHTML = insights.map(insight => `
            <div class="ai-insight" style="border-left: 4px solid ${getInsightColor(insight.type)}; padding: 16px; margin-bottom: 16px; background: var(--surface); border-radius: 8px;">
                <h4 style="margin: 0 0 8px; color: var(--text);">${getInsightIcon(insight.type)} ${insight.title}</h4>
                <p style="margin: 0; color: var(--text-secondary);">${insight.message}</p>
            </div>
        `).join('');
    }, 2000);
}

function getInsightColor(type) {
    switch (type) {
        case 'positive': return 'var(--success)';
        case 'warning': return 'var(--warning)';
        case 'info': return 'var(--info)';
        default: return 'var(--border)';
    }
}

function getInsightIcon(type) {
    switch (type) {
        case 'positive': return '✅';
        case 'warning': return '⚠️';
        case 'info': return 'ℹ️';
        default: return '📊';
    }
}

function exportHealthData() {
    // Create CSV data
    const csvData = [
        ['Date', 'Systolic BP', 'Diastolic BP', 'Blood Sugar', 'Weight', 'Heart Rate'],
        ...healthData.bloodPressure.map((bp, index) => [
            bp.date,
            bp.systolic,
            bp.diastolic,
            healthData.bloodSugar[index]?.value || '',
            healthData.weight.find(w => w.date === bp.date)?.value || '',
            healthData.heartRate[index]?.value || ''
        ])
    ];

    // Convert to CSV string
    const csvString = csvData.map(row => row.join(',')).join('\n');

    // Create and download file
    const blob = new Blob([csvString], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'health-data-export.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    // Show success message
    showNotification('Health data exported successfully!', 'success');
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? 'var(--success)' : 'var(--info)'};
        color: white;
        padding: 16px 20px;
        border-radius: 8px;
        box-shadow: var(--shadow-lg);
        z-index: 1001;
        animation: slideInRight 0.3s ease;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Add loading spinner CSS
const style = document.createElement('style');
style.textContent = `
    .loading-spinner {
        border: 4px solid var(--border);
        border-top: 4px solid var(--brand);
        border-radius: 50%;
        width: 40px;
        height: 40px;
        animation: spin 1s linear infinite;
        margin: 0 auto 16px;
    }
    
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
    
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);