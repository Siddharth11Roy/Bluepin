import apiClient from './client';
import type { LoginCredentials, SignupData, AuthResponse, User } from '../types';

export const authApi = {
    // Login user and get JWT token
    async login(credentials: LoginCredentials): Promise<AuthResponse> {
        const response = await apiClient.post<AuthResponse>('/auth/login', credentials);
        return response.data;
    },

    // Register new user
    async signup(data: SignupData): Promise<AuthResponse> {
        const response = await apiClient.post<AuthResponse>('/auth/signup', data);
        return response.data;
    },

    // Get current user info
    async getCurrentUser(): Promise<User> {
        const response = await apiClient.get<{ user: User }>('/auth/me');
        return response.data.user;
    },

    // Logout (clears token locally, optionally calls server)
    async logout(): Promise<void> {
        try {
            await apiClient.post('/auth/logout');
        } catch {
            // Ignore logout errors
        } finally {
            localStorage.removeItem('auth_token');
            localStorage.removeItem('user');
        }
    },

    // Verify stored token is still valid
    async verifyToken(): Promise<boolean> {
        try {
            await apiClient.get('/auth/me');
            return true;
        } catch {
            return false;
        }
    },
};
