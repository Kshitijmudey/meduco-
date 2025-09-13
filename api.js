class MeducoAPI {
    constructor() {
        this.baseURL = 'http://localhost:3001/api/v1';
        this.token = localStorage.getItem('authToken');
    }

    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const config = {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        };

        if (this.token) {
            config.headers.Authorization = `Bearer ${this.token}`;
        }

        try {
            const response = await fetch(url, config);
            const data = await response.json();

            if (!response.ok) {
                const error = new Error(data.message || 'API request failed');
                error.response = { data };
                throw error;
            }

            return data;
        } catch (error) {
            console.error('API Request Error:', error);
            throw error;
        }
    }

    async login(email, password, role) {
        const response = await this.request('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password, role })
        });

        if (response.success) {
            this.token = response.data.token;
            localStorage.setItem('authToken', this.token);
            localStorage.setItem('userData', JSON.stringify(response.data.user));
            return response.data;
        }
        throw new Error(response.message);
    }

    async register(userData) {
        const response = await this.request('/auth/register', {
            method: 'POST',
            body: JSON.stringify(userData)
        });

        if (response.success) {
            this.token = response.data.token;
            localStorage.setItem('authToken', this.token);
            localStorage.setItem('userData', JSON.stringify(response.data.user));
            return response.data;
        }
        throw new Error(response.message);
    }

    async logout() {
        if (this.token) {
            await this.request('/auth/logout', { method: 'POST' });
        }
        this.token = null;
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
    }

    async getPatientDashboard() {
        return await this.request('/patients/dashboard');
    }

    async getPatientProfile() {
        return await this.request('/patients/profile');
    }

    async updatePatientProfile(profileData) {
        return await this.request('/patients/profile', {
            method: 'PUT',
            body: JSON.stringify(profileData)
        });
    }

    async getPatientAppointments(filters = {}) {
        const queryParams = new URLSearchParams(filters);
        return await this.request(`/patients/appointments?${queryParams}`);
    }

    async getPatientHealthRecords(filters = {}) {
        const queryParams = new URLSearchParams(filters);
        return await this.request(`/patients/health-records?${queryParams}`);
    }

    async getPatientMedications() {
        return await this.request('/patients/medications');
    }

    async getPatientCarePlans() {
        return await this.request('/patients/care-plans');
    }

    async getDoctorDashboard() {
        return await this.request('/doctors/dashboard');
    }

    async getDoctorProfile() {
        return await this.request('/doctors/profile');
    }

    async getDoctorPatients() {
        return await this.request('/doctors/patients');
    }

    async createPatient(patientData) {
        return await this.request('/doctors/patients', {
            method: 'POST',
            body: JSON.stringify(patientData)
        });
    }

    async getAppointments(filters = {}) {
        const queryParams = new URLSearchParams(filters);
        return await this.request(`/appointments?${queryParams}`);
    }

    async createAppointment(appointmentData) {
        return await this.request('/appointments', {
            method: 'POST',
            body: JSON.stringify(appointmentData)
        });
    }

    async updateAppointment(appointmentId, updateData) {
        return await this.request(`/appointments/${appointmentId}`, {
            method: 'PUT',
            body: JSON.stringify(updateData)
        });
    }

    async getHealthRecords(filters = {}) {
        const queryParams = new URLSearchParams(filters);
        return await this.request(`/health-records?${queryParams}`);
    }

    async createHealthRecord(recordData) {
        return await this.request('/health-records', {
            method: 'POST',
            body: JSON.stringify(recordData)
        });
    }

    async updateHealthRecord(recordId, updateData) {
        return await this.request(`/health-records/${recordId}`, {
            method: 'PUT',
            body: JSON.stringify(updateData)
        });
    }

    async getMessages(type = 'inbox', filters = {}) {
        const queryParams = new URLSearchParams({ type, ...filters });
        return await this.request(`/messages?${queryParams}`);
    }

    async sendMessage(messageData) {
        return await this.request('/messages', {
            method: 'POST',
            body: JSON.stringify(messageData)
        });
    }

    async markMessageAsRead(messageId) {
        return await this.request(`/messages/${messageId}/read`, {
            method: 'PUT'
        });
    }

    async getNotifications(filters = {}) {
        const queryParams = new URLSearchParams(filters);
        return await this.request(`/notifications?${queryParams}`);
    }

    async markNotificationAsRead(notificationId) {
        return await this.request(`/notifications/${notificationId}/read`, {
            method: 'PUT'
        });
    }

    async getCarePlans(filters = {}) {
        const queryParams = new URLSearchParams(filters);
        return await this.request(`/care-plans?${queryParams}`);
    }

    async getCarePlanTasks(carePlanId) {
        return await this.request(`/care-plans/${carePlanId}/tasks`);
    }

    async updateCarePlanTask(taskId, updateData) {
        return await this.request(`/care-plans/tasks/${taskId}/complete`, {
            method: 'PUT',
            body: JSON.stringify(updateData)
        });
    }

    async getMedications(filters = {}) {
        const queryParams = new URLSearchParams(filters);
        return await this.request(`/medications?${queryParams}`);
    }

    async logMedication(medicationId, logData) {
        return await this.request(`/medications/${medicationId}/log`, {
            method: 'POST',
            body: JSON.stringify(logData)
        });
    }

    isAuthenticated() {
        return !!this.token;
    }

    getUserData() {
        const userData = localStorage.getItem('userData');
        return userData ? JSON.parse(userData) : null;
    }

    getUserRole() {
        const userData = this.getUserData();
        return userData ? userData.role : null;
    }

    async getDoctors() {
        try {
            const response = await this.request('/appointments/doctors');
            return response.data.doctors;
        } catch (error) {
            console.error('Get doctors error:', error);
            throw error;
        }
    }

    async getDoctorAvailability(doctorId) {
        try {
            const response = await this.request(`/appointments/doctors/${doctorId}/availability`);
            return response.data.availability;
        } catch (error) {
            console.error('Get doctor availability error:', error);
            throw error;
        }
    }

    async getDoctorSlots(doctorId, date) {
        try {
            const response = await this.request(`/appointments/doctors/${doctorId}/slots?date=${date}`);
            return response.data.slots;
        } catch (error) {
            console.error('Get doctor slots error:', error);
            throw error;
        }
    }
}

window.meducoAPI = new MeducoAPI();
