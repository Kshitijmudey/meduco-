// Telemedicine JavaScript
let localStream = null;
let remoteStream = null;
let isCallActive = false;
let isMuted = false;
let isVideoEnabled = true;
let isChatOpen = false;

document.addEventListener('DOMContentLoaded', function() {
    checkMediaDevices();
    setupChatInput();
});

async function checkMediaDevices() {
    try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const hasCamera = devices.some(device => device.kind === 'videoinput');
        const hasMicrophone = devices.some(device => device.kind === 'audioinput');
        
        if (!hasCamera || !hasMicrophone) {
            showNotification('Camera or microphone not detected. Please check your devices.', 'warning');
        }
    } catch (error) {
        console.error('Error checking media devices:', error);
        showNotification('Unable to access media devices. Please check permissions.', 'error');
    }
}

async function startConsultation() {
    try {
        // Request camera and microphone permissions
        localStream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true
        });
        
        // Display local video
        const patientVideo = document.getElementById('patientVideo');
        patientVideo.srcObject = localStream;
        document.getElementById('patientVideoPlaceholder').style.display = 'none';
        
        // Show video interface and controls
        document.getElementById('videoInterface').style.display = 'grid';
        document.getElementById('callControls').style.display = 'block';
        
        // Update status
        const statusCard = document.getElementById('consultationStatus');
        statusCard.innerHTML = `
            <div class="row">
                <div style="flex: 1;">
                    <h3 style="margin: 0; color: var(--success);">✅ Connected</h3>
                    <p style="margin: 0; color: var(--muted);">Your video consultation is active. The doctor will join shortly.</p>
                </div>
                <div style="display: flex; gap: 8px; align-items: center;">
                    <span class="badge" style="background: var(--success); color: white;">Live</span>
                    <span id="callTimer" style="font-family: monospace; font-weight: bold;">00:00</span>
                </div>
            </div>
        `;
        
        isCallActive = true;
        startCallTimer();
        
        // Simulate doctor joining after 3 seconds
        setTimeout(() => {
            simulateDoctorJoining();
        }, 3000);
        
        showNotification('Video consultation started successfully!', 'success');
        
    } catch (error) {
        console.error('Error starting consultation:', error);
        showNotification('Failed to start video consultation. Please check your camera and microphone permissions.', 'error');
    }
}

function simulateDoctorJoining() {
    // Hide doctor placeholder and show simulated video
    const doctorPlaceholder = document.getElementById('doctorVideoPlaceholder');
    doctorPlaceholder.innerHTML = `
        <div style="color: white; text-align: center;">
            <div style="font-size: 48px; margin-bottom: 16px;">👨‍⚕️</div>
            <p>Dr. Sarah Johnson</p>
            <p style="font-size: 14px; opacity: 0.8;">Connected</p>
        </div>
    `;
    
    // Add a subtle animation to simulate video
    setInterval(() => {
        if (isCallActive) {
            doctorPlaceholder.style.transform = `scale(${0.98 + Math.random() * 0.04})`;
        }
    }, 2000);
    
    showNotification('Dr. Sarah Johnson has joined the consultation', 'info');
}

function toggleMute() {
    if (localStream) {
        const audioTrack = localStream.getAudioTracks()[0];
        if (audioTrack) {
            audioTrack.enabled = !audioTrack.enabled;
            isMuted = !audioTrack.enabled;
            
            const muteBtn = document.getElementById('muteBtn');
            const muteIcon = document.getElementById('muteIcon');
            
            if (isMuted) {
                muteBtn.innerHTML = '<span id="muteIcon">🔇</span> Unmute';
                muteBtn.style.background = 'var(--danger)';
                muteBtn.style.color = 'white';
            } else {
                muteBtn.innerHTML = '<span id="muteIcon">🎤</span> Mute';
                muteBtn.style.background = '';
                muteBtn.style.color = '';
            }
        }
    }
}

function toggleVideo() {
    if (localStream) {
        const videoTrack = localStream.getVideoTracks()[0];
        if (videoTrack) {
            videoTrack.enabled = !videoTrack.enabled;
            isVideoEnabled = videoTrack.enabled;
            
            const videoBtn = document.getElementById('videoBtn');
            const patientVideoPlaceholder = document.getElementById('patientVideoPlaceholder');
            
            if (!isVideoEnabled) {
                videoBtn.innerHTML = '<span id="videoIcon">📹</span> Turn On Video';
                videoBtn.style.background = 'var(--danger)';
                videoBtn.style.color = 'white';
                patientVideoPlaceholder.style.display = 'flex';
                patientVideoPlaceholder.innerHTML = `
                    <div style="color: white; text-align: center;">
                        <div style="font-size: 48px; margin-bottom: 16px;">📹</div>
                        <p>Video Off</p>
                    </div>
                `;
            } else {
                videoBtn.innerHTML = '<span id="videoIcon">📹</span> Video';
                videoBtn.style.background = '';
                videoBtn.style.color = '';
                patientVideoPlaceholder.style.display = 'none';
            }
        }
    }
}

function shareScreen() {
    if (navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia) {
        navigator.mediaDevices.getDisplayMedia({ video: true })
            .then(stream => {
                // In a real implementation, this would replace the video track
                showNotification('Screen sharing started (simulated)', 'info');
                
                // Stop screen sharing after 10 seconds for demo
                setTimeout(() => {
                    stream.getTracks().forEach(track => track.stop());
                    showNotification('Screen sharing stopped', 'info');
                }, 10000);
            })
            .catch(error => {
                console.error('Error sharing screen:', error);
                showNotification('Screen sharing not supported or permission denied', 'warning');
            });
    } else {
        showNotification('Screen sharing not supported in this browser', 'warning');
    }
}

function openChat() {
    const chatPanel = document.getElementById('chatPanel');
    isChatOpen = !isChatOpen;
    
    if (isChatOpen) {
        chatPanel.style.display = 'block';
        document.getElementById('chatInput').focus();
    } else {
        chatPanel.style.display = 'none';
    }
}

function setupChatInput() {
    const chatInput = document.getElementById('chatInput');
    if (chatInput) {
        chatInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendChatMessage();
            }
        });
    }
}

function sendChatMessage() {
    const chatInput = document.getElementById('chatInput');
    const message = chatInput.value.trim();
    
    if (message) {
        addChatMessage('You', message, 'patient');
        chatInput.value = '';
        
        // Simulate doctor response after 2 seconds
        setTimeout(() => {
            const responses = [
                "Thank you for that information.",
                "I understand. Let me check your records.",
                "That's helpful to know.",
                "I'll make a note of that.",
                "Any other symptoms you'd like to discuss?"
            ];
            const randomResponse = responses[Math.floor(Math.random() * responses.length)];
            addChatMessage('Dr. Johnson', randomResponse, 'doctor');
        }, 2000);
    }
}

function addChatMessage(sender, message, type) {
    const chatMessages = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.style.cssText = `
        margin-bottom: 12px;
        padding: 8px 12px;
        border-radius: 8px;
        background: ${type === 'patient' ? 'var(--brand-light)' : 'var(--surface)'};
        border-left: 4px solid ${type === 'patient' ? 'var(--brand)' : 'var(--success)'};
    `;
    
    messageDiv.innerHTML = `
        <div style="font-weight: 600; font-size: 14px; color: var(--text); margin-bottom: 4px;">${sender}</div>
        <div style="color: var(--text-secondary);">${message}</div>
        <div style="font-size: 12px; color: var(--muted); margin-top: 4px;">${new Date().toLocaleTimeString()}</div>
    `;
    
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function endConsultation() {
    if (confirm('Are you sure you want to end the consultation?')) {
        // Stop local stream
        if (localStream) {
            localStream.getTracks().forEach(track => track.stop());
            localStream = null;
        }
        
        // Hide video interface and controls
        document.getElementById('videoInterface').style.display = 'none';
        document.getElementById('callControls').style.display = 'none';
        document.getElementById('chatPanel').style.display = 'none';
        
        // Reset status
        const statusCard = document.getElementById('consultationStatus');
        statusCard.innerHTML = `
            <div class="row">
                <div style="flex: 1;">
                    <h3 style="margin: 0; color: var(--text);">Consultation Ended</h3>
                    <p style="margin: 0; color: var(--muted);">Your video consultation has ended. A summary will be sent to your patient portal.</p>
                </div>
                <button class="btn btn-primary" onclick="location.reload()">Start New Consultation</button>
            </div>
        `;
        
        isCallActive = false;
        showNotification('Video consultation ended', 'info');
    }
}

function startCallTimer() {
    let seconds = 0;
    const timer = setInterval(() => {
        if (!isCallActive) {
            clearInterval(timer);
            return;
        }
        
        seconds++;
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        const timerElement = document.getElementById('callTimer');
        
        if (timerElement) {
            timerElement.textContent = 
                `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
        }
    }, 1000);
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
    }, 4000);
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
    
    .video-container video {
        transition: all 0.3s ease;
    }
    
    .video-container:hover {
        transform: scale(1.02);
    }
`;
document.head.appendChild(style);