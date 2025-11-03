import axios from 'axios';

// Update the baseURL to match your Spring Boot port
const api = axios.create({
  baseURL: 'http://localhost:8080/api', // Change 8099 to your actual port
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

const emailService = {
  // Send immediate email
  sendEmail: async (emailData) => {
    try {
      const response = await api.post('/email/send', emailData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to send email');
    }
  },

  // Schedule email
  scheduleEmail: async (scheduleData) => {
    try {
      const response = await api.post('/email/schedule', scheduleData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to schedule email');
    }
  },

  // Get all scheduled emails
  getScheduledEmails: async () => {
    try {
      const response = await api.get('/email/scheduled');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch scheduled emails');
    }
  },

  // Get pending emails
  getPendingEmails: async () => {
    try {
      const response = await api.get('/email/pending');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch pending emails');
    }
  },

  // Cancel scheduled email
  cancelScheduledEmail: async (id) => {
    try {
      const response = await api.delete(`/email/schedule/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to cancel email');
    }
  },

  // Health check
  healthCheck: async () => {
    try {
      const response = await api.get('/email/health');
      return response.data;
    } catch (error) {
      throw new Error('Backend service is unavailable');
    }
  }
};

export default emailService;