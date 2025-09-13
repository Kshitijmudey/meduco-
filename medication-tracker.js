// Medication Tracker JavaScript
document.addEventListener('DOMContentLoaded', function() {
    loadMedications();
    loadTodaySchedule();
    updateStats();
    
    // Set up form submission
    document.getElementById('addMedicationForm').addEventListener('submit', addMedication);
    
    // Set up notifications
    requestNotificationPermission();
    scheduleNotifications();
});

// Sample medication data (in a real app, this would come from a database)
let medications = [
    {
        id: 1,
        name: 'Metformin',
        dosage: '500mg',
        frequency: 'twice-daily',
        times: ['08:00', '20:00'],
        startDate: '2024-01-15',
        instructions: 'Take with food',
        active: true
    },
    {
        id: 2,
        name: 'Lisinopril',
        dosage: '10mg',
        frequency: 'once-daily',
        times: ['08:00'],
        startDate: '2024-01-15',
        instructions: 'Take in the morning',
        active: true
    },
    {
        id: 3,
        name: 'Atorvastatin',
        dosage: '20mg',
        frequency: 'once-daily',
        times: ['22:00'],
        startDate: '2024-01-15',
        instructions: 'Take at bedtime',
        active: true
    }
];

// Sample medication log (tracks when medications were taken)
let medicationLog = [
    { medicationId: 1, takenAt: new Date().toISOString(), scheduledTime: '08:00' },
    { medicationId: 2, takenAt: new Date().toISOString(), scheduledTime: '08:00' },
    { medicationId: 1, takenAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), scheduledTime: '20:00' }
];

function loadMedications() {
    const medicationsList = document.getElementById('medicationsList');
    
    if (medications.length === 0) {
        medicationsList.innerHTML = '<p style="color: var(--muted); text-align: center;">No medications added yet.</p>';
        return;
    }
    
    medicationsList.innerHTML = medications.map(med => `
        <div class="medication-item" style="border: 1px solid var(--border); border-radius: 12px; padding: 16px; margin-bottom: 12px; background: var(--surface);">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
                <div>
                    <h4 style="margin: 0; color: var(--text);">${med.name}</h4>
                    <p style="margin: 0; color: var(--muted); font-size: 14px;">${med.dosage} • ${formatFrequency(med.frequency)}</p>
                </div>
                <div style="display: flex; gap: 8px;">
                    <button class="btn btn-outline" style="padding: 4px 8px; font-size: 12px;" onclick="editMedication(${med.id})">Edit</button>
                    <button class="btn btn-outline" style="padding: 4px 8px; font-size: 12px; color: var(--danger);" onclick="removeMedication(${med.id})">Remove</button>
                </div>
            </div>
            <div style="display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 8px;">
                ${med.times.map(time => `<span class="badge" style="background: var(--brand-light); color: var(--brand);">${time}</span>`).join('')}
            </div>
            ${med.instructions ? `<p style="margin: 0; color: var(--muted); font-size: 13px; font-style: italic;">${med.instructions}</p>` : ''}
        </div>
    `).join('');
}

function loadTodaySchedule() {
    const todaySchedule = document.getElementById('todaySchedule');
    const today = new Date().toISOString().split('T')[0];
    
    // Generate today's schedule
    const schedule = [];
    medications.forEach(med => {
        med.times.forEach(time => {
            const scheduledDateTime = new Date(`${today}T${time}`);
            const isTaken = medicationLog.some(log => 
                log.medicationId === med.id && 
                log.scheduledTime === time &&
                log.takenAt.startsWith(today)
            );
            
            schedule.push({
                medication: med,
                time: time,
                scheduledDateTime: scheduledDateTime,
                isTaken: isTaken,
                isPast: scheduledDateTime < new Date()
            });
        });
    });
    
    // Sort by time
    schedule.sort((a, b) => a.scheduledDateTime - b.scheduledDateTime);
    
    if (schedule.length === 0) {
        todaySchedule.innerHTML = '<p style="color: var(--muted); text-align: center;">No medications scheduled for today.</p>';
        return;
    }
    
    todaySchedule.innerHTML = schedule.map(item => `
        <div class="schedule-item" style="display: flex; justify-content: space-between; align-items: center; padding: 12px; border: 1px solid var(--border); border-radius: 8px; margin-bottom: 8px; background: ${item.isTaken ? 'var(--success)' : item.isPast ? '#fef2f2' : 'var(--surface)'};">
            <div>
                <strong style="color: var(--text);">${item.time}</strong> - ${item.medication.name} (${item.medication.dosage})
                ${item.medication.instructions ? `<br><small style="color: var(--muted);">${item.medication.instructions}</small>` : ''}
            </div>
            <div>
                ${item.isTaken ? 
                    '<span class="badge" style="background: var(--success); color: white;">✓ Taken</span>' :
                    item.isPast ?
                        `<button class="btn btn-outline" style="padding: 4px 8px; font-size: 12px; color: var(--danger);" onclick="markAsTaken(${item.medication.id}, '${item.time}')">Mark as Taken</button>` :
                        '<span class="badge" style="background: var(--warning); color: white;">Upcoming</span>'
                }
            </div>
        </div>
    `).join('');
}

function updateStats() {
    const today = new Date().toISOString().split('T')[0];
    
    // Total active medications
    document.getElementById('totalMeds').textContent = medications.filter(med => med.active).length;
    
    // Medications taken today
    const takenToday = medicationLog.filter(log => log.takenAt.startsWith(today)).length;
    document.getElementById('todayTaken').textContent = takenToday;
    
    // Upcoming doses today
    const totalDosesToday = medications.reduce((total, med) => total + med.times.length, 0);
    const upcomingDoses = totalDosesToday - takenToday;
    document.getElementById('upcomingDoses').textContent = Math.max(0, upcomingDoses);
    
    // Calculate adherence rate (last 7 days)
    const adherenceRate = calculateAdherenceRate();
    document.getElementById('adherenceRate').textContent = adherenceRate + '%';
}

function calculateAdherenceRate() {
    const last7Days = [];
    for (let i = 0; i < 7; i++) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        last7Days.push(date.toISOString().split('T')[0]);
    }
    
    let totalScheduled = 0;
    let totalTaken = 0;
    
    last7Days.forEach(date => {
        medications.forEach(med => {
            totalScheduled += med.times.length;
            const takenCount = medicationLog.filter(log => 
                log.medicationId === med.id && log.takenAt.startsWith(date)
            ).length;
            totalTaken += takenCount;
        });
    });
    
    return totalScheduled > 0 ? Math.round((totalTaken / totalScheduled) * 100) : 100;
}

function formatFrequency(frequency) {
    const frequencies = {
        'once-daily': 'Once daily',
        'twice-daily': 'Twice daily',
        'three-times-daily': 'Three times daily',
        'four-times-daily': 'Four times daily',
        'as-needed': 'As needed'
    };
    return frequencies[frequency] || frequency;
}

function markAsTaken(medicationId, scheduledTime) {
    const now = new Date().toISOString();
    medicationLog.push({
        medicationId: medicationId,
        takenAt: now,
        scheduledTime: scheduledTime
    });
    
    // Refresh displays
    loadTodaySchedule();
    updateStats();
    loadMedicationHistory();
    
    // Show success message
    showNotification('Medication marked as taken!', 'success');
}

function addMedication(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const frequency = formData.get('frequency');
    
    // Generate times based on frequency
    const times = generateMedicationTimes(frequency);
    
    const newMedication = {
        id: Date.now(), // Simple ID generation
        name: formData.get('name'),
        dosage: formData.get('dosage'),
        frequency: frequency,
        times: times,
        startDate: formData.get('startDate'),
        endDate: formData.get('endDate') || null,
        instructions: formData.get('instructions'),
        active: true
    };
    
    medications.push(newMedication);
    
    // Refresh displays
    loadMedications();
    loadTodaySchedule();
    updateStats();
    
    // Close modal and reset form
    closeAddMedicationModal();
    event.target.reset();
    
    showNotification('Medication added successfully!', 'success');
}

function generateMedicationTimes(frequency) {
    const timeMap = {
        'once-daily': ['08:00'],
        'twice-daily': ['08:00', '20:00'],
        'three-times-daily': ['08:00', '14:00', '20:00'],
        'four-times-daily': ['08:00', '12:00', '16:00', '20:00'],
        'as-needed': []
    };
    return timeMap[frequency] || [];
}

function removeMedication(medicationId) {
    if (confirm('Are you sure you want to remove this medication?')) {
        medications = medications.filter(med => med.id !== medicationId);
        loadMedications();
        loadTodaySchedule();
        updateStats();
        showNotification('Medication removed', 'info');
    }
}

function editMedication(medicationId) {
    // In a full implementation, this would open an edit modal
    alert('Edit functionality would be implemented here');
}

function loadMedicationHistory() {
    const medicationHistory = document.getElementById('medicationHistory');
    
    // Get recent medication logs (last 10)
    const recentLogs = medicationLog
        .sort((a, b) => new Date(b.takenAt) - new Date(a.takenAt))
        .slice(0, 10);
    
    if (recentLogs.length === 0) {
        medicationHistory.innerHTML = '<p style="color: var(--muted); text-align: center;">No medication history yet.</p>';
        return;
    }
    
    medicationHistory.innerHTML = recentLogs.map(log => {
        const medication = medications.find(med => med.id === log.medicationId);
        const takenDate = new Date(log.takenAt);
        const timeAgo = getTimeAgo(takenDate);
        
        return `
            <div style="padding: 8px 0; border-bottom: 1px solid var(--border);">
                <div style="font-weight: 600; color: var(--text);">${medication ? medication.name : 'Unknown'}</div>
                <div style="font-size: 13px; color: var(--muted);">
                    Taken ${timeAgo} • Scheduled for ${log.scheduledTime}
                </div>
            </div>
        `;
    }).join('');
}

function getTimeAgo(date) {
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'just now';
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
}

function openAddMedicationModal() {
    document.getElementById('addMedicationModal').style.display = 'block';
}

function closeAddMedicationModal() {
    document.getElementById('addMedicationModal').style.display = 'none';
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? 'var(--success)' : type === 'error' ? 'var(--danger)' : 'var(--info)'};
        color: white;
        padding: 16px 20px;
        border-radius: 8px;
        box-shadow: var(--shadow-lg);
        z-index: 1001;
        animation: slideInRight 0.3s ease;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

function requestNotificationPermission() {
    if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission();
    }
}

function scheduleNotifications() {
    // In a real app, this would use service workers for persistent notifications
    // For now, we'll just show browser notifications when the page is open
    
    setInterval(() => {
        const now = new Date();
        const currentTime = now.toTimeString().slice(0, 5); // HH:MM format
        
        medications.forEach(med => {
            med.times.forEach(time => {
                if (time === currentTime) {
                    const today = now.toISOString().split('T')[0];
                    const alreadyTaken = medicationLog.some(log => 
                        log.medicationId === med.id && 
                        log.scheduledTime === time &&
                        log.takenAt.startsWith(today)
                    );
                    
                    if (!alreadyTaken && Notification.permission === 'granted') {
                        new Notification('Medication Reminder', {
                            body: `Time to take ${med.name} (${med.dosage})`,
                            icon: '/favicon.ico'
                        });
                    }
                }
            });
        });
    }, 60000); // Check every minute
}

// Initialize medication history on load
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(loadMedicationHistory, 100);
});

// Close modal when clicking outside
window.addEventListener('click', function(event) {
    const modal = document.getElementById('addMedicationModal');
    if (event.target === modal) {
        closeAddMedicationModal();
    }
});

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
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