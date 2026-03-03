import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { authService } from '../api/services';
import type { User } from '../types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (username: string, password: string, remember?: boolean) => Promise<void>;
  signup: (data: {
    username: string;
    email: string;
    password: string;
    confirm_password: string;
    full_name?: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await authService.checkAuth();
      if (response.data.authenticated) {
        setUser(response.data.user);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (username: string, password: string, remember?: boolean) => {
    const response = await authService.login(username, password, remember);
    if (response.data.success) {
      setUser(response.data.user);
    } else {
      throw new Error(response.data.message);
    }
  };

  const signup = async (data: {
    username: string;
    email: string;
    password: string;
    confirm_password: string;
    full_name?: string;
  }) => {
    const response = await authService.signup(data);
    if (!response.data.success) {
      throw new Error(response.data.message);
    }
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        signup,
        logout,
        isAuthenticated: !!user,
        isAdmin: user?.is_admin ?? false,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
