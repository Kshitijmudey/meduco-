// Emergency Contacts JavaScript
let emergencyContacts = [
    {
        id: 1,
        name: 'John Cooper',
        relationship: 'Spouse',
        phone: '(555) 987-6543',
        email: 'john.cooper@email.com',
        priority: 'primary',
        notes: 'Lives at same address'
    },
    {
        id: 2,
        name: 'Mary Cooper',
        relationship: 'Mother',
        phone: '(555) 876-5432',
        email: 'mary.cooper@email.com',
        priority: 'secondary',
        notes: 'Retired nurse'
    },
    {
        id: 3,
        name: 'Dr. Sarah Johnson',
        relationship: 'Primary Care Doctor',
        phone: '(555) 123-4567',
        email: 'sjohnson@medicalpractice.com',
        priority: 'other',
        notes: 'Available 24/7 for emergencies'
    }
];

let editingContactId = null;

document.addEventListener('DOMContentLoaded', function() {
    loadEmergencyContacts();
    setupForms();
});

function loadEmergencyContacts() {
    const contactsList = document.getElementById('emergencyContactsList');
    
    if (emergencyContacts.length === 0) {
        contactsList.innerHTML = '<p style="color: var(--muted); text-align: center; padding: 20px;">No emergency contacts added yet.</p>';
        return;
    }
    
    contactsList.innerHTML = emergencyContacts.map(contact => `
        <div class="emergency-contact-item" style="border: 1px solid var(--border); border-radius: 12px; padding: 16px; margin-bottom: 12px; background: var(--surface);">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
                <div style="flex: 1;">
                    <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
                        <h4 style="margin: 0; color: var(--text);">${contact.name}</h4>
                        <span class="badge ${getPriorityClass(contact.priority)}">${contact.priority}</span>
                    </div>
                    <p style="margin: 0; color: var(--muted); font-size: 14px;">${contact.relationship}</p>
                </div>
                <div style="display: flex; gap: 8px;">
                    <button class="btn btn-outline" style="padding: 4px 8px; font-size: 12px;" onclick="callContact('${contact.phone}')">Call</button>
                    <button class="btn btn-outline" style="padding: 4px 8px; font-size: 12px;" onclick="editContact(${contact.id})">Edit</button>
                    <button class="btn btn-outline" style="padding: 4px 8px; font-size: 12px; color: var(--danger);" onclick="removeContact(${contact.id})">Remove</button>
                </div>
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 8px;">
                <div>
                    <strong style="color: var(--text);">Phone:</strong><br>
                    <a href="tel:${contact.phone}" style="color: var(--brand); text-decoration: none;">${contact.phone}</a>
                </div>
                <div>
                    <strong style="color: var(--text);">Email:</strong><br>
                    <a href="mailto:${contact.email}" style="color: var(--brand); text-decoration: none;">${contact.email}</a>
                </div>
            </div>
            ${contact.notes ? `<p style="margin: 0; color: var(--muted); font-size: 13px; font-style: italic;">${contact.notes}</p>` : ''}
        </div>
    `).join('');
}

function getPriorityClass(priority) {
    switch (priority) {
        case 'primary': return 'success';
        case 'secondary': return 'warning';
        default: return '';
    }
}

function addEmergencyContact() {
    editingContactId = null;
    document.getElementById('contactModalTitle').textContent = 'Add Emergency Contact';
    document.getElementById('contactForm').reset();
    document.getElementById('contactModal').style.display = 'block';
}

function editContact(contactId) {
    const contact = emergencyContacts.find(c => c.id === contactId);
    if (!contact) return;
    
    editingContactId = contactId;
    document.getElementById('contactModalTitle').textContent = 'Edit Emergency Contact';
    
    const form = document.getElementById('contactForm');
    form.name.value = contact.name;
    form.relationship.value = contact.relationship;
    form.phone.value = contact.phone;
    form.email.value = contact.email;
    form.priority.value = contact.priority;
    form.notes.value = contact.notes || '';
    
    document.getElementById('contactModal').style.display = 'block';
}

function removeContact(contactId) {
    if (confirm('Are you sure you want to remove this emergency contact?')) {
        emergencyContacts = emergencyContacts.filter(c => c.id !== contactId);
        loadEmergencyContacts();
        showNotification('Emergency contact removed', 'info');
    }
}

function callContact(phone) {
    // Remove formatting for tel: link
    const cleanPhone = phone.replace(/[^\d]/g, '');
    window.location.href = `tel:${cleanPhone}`;
}

function callProvider(phone) {
    const cleanPhone = phone.replace(/[^\d]/g, '');
    window.location.href = `tel:${cleanPhone}`;
}

function callEmergency() {
    if (confirm('This will call 911. Are you sure this is an emergency?')) {
        window.location.href = 'tel:911';
    }
}

function editMedicalInfo() {
    document.getElementById('medicalInfoModal').style.display = 'block';
}

function setupForms() {
    // Contact form submission
    document.getElementById('contactForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const contactData = {
            name: formData.get('name'),
            relationship: formData.get('relationship'),
            phone: formData.get('phone'),
            email: formData.get('email'),
            priority: formData.get('priority'),
            notes: formData.get('notes')
        };
        
        if (editingContactId) {
            // Update existing contact
            const contactIndex = emergencyContacts.findIndex(c => c.id === editingContactId);
            if (contactIndex !== -1) {
                emergencyContacts[contactIndex] = { ...emergencyContacts[contactIndex], ...contactData };
                showNotification('Emergency contact updated successfully!', 'success');
            }
        } else {
            // Add new contact
            const newContact = {
                id: Date.now(),
                ...contactData
            };
            emergencyContacts.push(newContact);
            showNotification('Emergency contact added successfully!', 'success');
        }
        
        loadEmergencyContacts();
        closeContactModal();
    });
    
    // Medical info form submission
    document.getElementById('medicalInfoForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        
        // Update the display (in a real app, this would save to database)
        const bloodType = formData.get('bloodType');
        const allergies = formData.get('allergies');
        const conditions = formData.get('conditions');
        const medications = formData.get('medications');
        
        // Update the critical medical information display
        document.querySelector('.mini-card:nth-child(1) .mini-value').textContent = bloodType || 'Not specified';
        document.querySelector('.mini-card:nth-child(2) .mini-value').textContent = allergies || 'None reported';
        document.querySelector('.mini-card:nth-child(3) .mini-value').textContent = conditions || 'None reported';
        document.querySelector('.mini-card:nth-child(4) .mini-value').textContent = medications || 'None';
        
        showNotification('Medical information updated successfully!', 'success');
        closeMedicalInfoModal();
    });
}

function closeContactModal() {
    document.getElementById('contactModal').style.display = 'none';
    editingContactId = null;
}

function closeMedicalInfoModal() {
    document.getElementById('medicalInfoModal').style.display = 'none';
}

function downloadMedicalID() {
    // In a real app, this would generate a PDF
    showNotification('Medical ID download started (feature simulated)', 'info');
    
    // Simulate download
    setTimeout(() => {
        const link = document.createElement('a');
        link.href = 'data:text/plain;charset=utf-8,Medical ID for Jane Cooper\nBlood Type: O+\nAllergies: Penicillin, Shellfish\nConditions: Type 2 Diabetes, Hypertension\nEmergency Contact: John Cooper (555) 987-6543';
        link.download = 'medical-id.txt';
        link.click();
    }, 1000);
}

function shareMedicalID() {
    if (navigator.share) {
        navigator.share({
            title: 'Medical ID - Jane Cooper',
            text: 'Emergency Medical Information for Jane Cooper\nBlood Type: O+\nAllergies: Penicillin, Shellfish\nEmergency Contact: John Cooper (555) 987-6543',
        }).then(() => {
            showNotification('Medical ID shared successfully', 'success');
        }).catch(() => {
            fallbackShare();
        });
    } else {
        fallbackShare();
    }
}

function fallbackShare() {
    const medicalInfo = `Emergency Medical Information for Jane Cooper
Blood Type: O+
Allergies: Penicillin, Shellfish
Conditions: Type 2 Diabetes, Hypertension
Emergency Contact: John Cooper (555) 987-6543`;
    
    navigator.clipboard.writeText(medicalInfo).then(() => {
        showNotification('Medical ID copied to clipboard', 'success');
    }).catch(() => {
        showNotification('Unable to share medical ID', 'error');
    });
}

function printMedicalID() {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <html>
        <head>
            <title>Medical ID - Jane Cooper</title>
            <style>
                body { font-family: Arial, sans-serif; padding: 20px; }
                .medical-id { border: 2px solid #333; padding: 20px; border-radius: 10px; }
                .header { text-align: center; margin-bottom: 20px; }
                .info { margin-bottom: 10px; }
                .emergency { background: #ffebee; padding: 10px; border-radius: 5px; margin-top: 20px; }
            </style>
        </head>
        <body>
            <div class="medical-id">
                <div class="header">
                    <h2>EMERGENCY MEDICAL ID</h2>
                    <h3>Jane Cooper</h3>
                    <p>DOB: March 15, 1985 | ID: PAT-24-1234</p>
                </div>
                <div class="info"><strong>Blood Type:</strong> O+</div>
                <div class="info"><strong>Allergies:</strong> Penicillin, Shellfish</div>
                <div class="info"><strong>Medical Conditions:</strong> Type 2 Diabetes, Hypertension</div>
                <div class="info"><strong>Current Medications:</strong> Metformin, Lisinopril</div>
                <div class="emergency">
                    <strong>Emergency Contact:</strong><br>
                    John Cooper (Spouse)<br>
                    Phone: (555) 987-6543
                </div>
            </div>
        </body>
        </html>
    `);
    printWindow.document.close();
    printWindow.print();
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${getNotificationColor(type)};
        color: white;
        padding: 16px 20px;
        border-radius: 8px;
        box-shadow: var(--shadow-lg);
        z-index: 1001;
        animation: slideInRight 0.3s ease;
        max-width: 300px;
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

function getNotificationColor(type) {
    switch (type) {
        case 'success': return 'var(--success)';
        case 'warning': return 'var(--warning)';
        case 'error': return 'var(--danger)';
        case 'info': return 'var(--info)';
        default: return 'var(--info)';
    }
}

// Close modals when clicking outside
window.addEventListener('click', function(event) {
    const contactModal = document.getElementById('contactModal');
    const medicalInfoModal = document.getElementById('medicalInfoModal');
    
    if (event.target === contactModal) {
        closeContactModal();
    }
    if (event.target === medicalInfoModal) {
        closeMedicalInfoModal();
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