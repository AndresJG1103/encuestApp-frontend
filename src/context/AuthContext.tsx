"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { getAccessToken, setTokens, clearTokens, apiFetch } from '../lib/api';

interface AuthContextType {
  isAuthenticated: boolean;
  user: any | null;
  login: (data: any) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const initAuth = async () => {
      const token = getAccessToken();
      if (token) {
        try {
          // Basic JWT decoding
          const payload = JSON.parse(atob(token.split('.')[1]));
          setUser(payload);
          setIsAuthenticated(true);
        } catch (e) {
          console.error('Invalid token');
          clearTokens();
        }
      } else {
        setIsAuthenticated(false);
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated && pathname !== '/login' && pathname !== '/register') {
        router.push('/login');
      } else if (isAuthenticated && (pathname === '/login' || pathname === '/register')) {
        router.push('/');
      }
    }
  }, [isAuthenticated, loading, pathname, router]);

  const login = async (credentials: any) => {
    try {
      const res = await apiFetch('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      });

      if (res.ok) {
        const responseData = await res.json();
        const { accessToken, refreshToken } = responseData.data;
        setTokens(accessToken, refreshToken);
        setIsAuthenticated(true);
        router.push('/');
      } else {
        throw new Error('Credenciales inválidas');
      }
    } catch (error) {
      throw error;
    }
  };

  const register = async (userData: any) => {
    try {
      const res = await apiFetch('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData),
      });

      if (res.ok) {
        router.push('/login');
      } else {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Error en el registro');
      }
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await apiFetch('/auth/logout', { method: 'POST' });
    } catch (error) {
      console.error('Logout failed', error);
    } finally {
      clearTokens();
      setIsAuthenticated(false);
      setUser(null);
      router.push('/login');
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, register, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
