import axios from 'axios';
import toast from 'react-hot-toast';

// Create axios instance with base configuration
const apiClient = axios.create({
    baseURL: '/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('auth_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        const message = error.response?.data?.message || error.message || 'An error occurred';

        // Handle specific error codes
        if (error.response?.status === 401) {
            // Clear auth token and redirect to login
            localStorage.removeItem('auth_token');
            localStorage.removeItem('user');
            window.location.href = '/login';
            toast.error('Session expired. Please log in again.');
        } else if (error.response?.status === 403) {
            toast.error('You do not have permission to perform this action.');
        } else if (error.response?.status === 404) {
            toast.error('Resource not found.');
        } else if (error.response?.status >= 500) {
            toast.error('Server error. Please try again later.');
        }

        return Promise.reject(error);
    }
);

export default apiClient;
