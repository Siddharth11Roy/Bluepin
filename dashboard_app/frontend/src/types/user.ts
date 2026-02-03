// User types
export interface User {
    id: number;
    username: string;
    email: string;
    full_name: string | null;
    is_admin: boolean;
    is_active: boolean;
    created_at: string;
    last_login: string | null;
}

export interface LoginCredentials {
    username: string;
    password: string;
    remember?: boolean;
}

export interface SignupData {
    username: string;
    email: string;
    full_name?: string;
    password: string;
    confirm_password: string;
}

export interface AuthResponse {
    success: boolean;
    message: string;
    user?: User;
    token?: string;
}
