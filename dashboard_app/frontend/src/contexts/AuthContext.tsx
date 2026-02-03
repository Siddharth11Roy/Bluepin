import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { authApi } from '../api';
import type { User, LoginCredentials, SignupData } from '../types';

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  signup: (data: SignupData) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Check for existing auth on mount
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('auth_token');
      const storedUser = localStorage.getItem('user');

      if (token && storedUser) {
        try {
          // Verify token is still valid
          const currentUser = await authApi.getCurrentUser();
          setUser(currentUser);
        } catch {
          // Token invalid, clear storage
          localStorage.removeItem('auth_token');
          localStorage.removeItem('user');
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = useCallback(async (credentials: LoginCredentials) => {
    setIsLoading(true);
    try {
      const response = await authApi.login(credentials);
      
      if (response.success && response.token && response.user) {
        localStorage.setItem('auth_token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        setUser(response.user);
        toast.success(`Welcome back, ${response.user.full_name || response.user.username}!`);
        navigate('/');
      } else {
        toast.error(response.message || 'Login failed');
      }
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || 'Login failed. Please try again.');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);

  const signup = useCallback(async (data: SignupData) => {
    setIsLoading(true);
    try {
      const response = await authApi.signup(data);
      
      if (response.success) {
        toast.success('Account created successfully! Please log in.');
        navigate('/login');
      } else {
        toast.error(response.message || 'Signup failed');
      }
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || 'Signup failed. Please try again.');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);

  const logout = useCallback(() => {
    authApi.logout();
    setUser(null);
    toast.success('Logged out successfully');
    navigate('/login');
  }, [navigate]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
