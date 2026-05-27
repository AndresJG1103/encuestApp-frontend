"use client";

import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { getAccessToken, setTokens, clearTokens, apiFetch, extractError } from '../lib/api';
import type { JwtUser, LoginPayload, RegisterPayload, RoleType } from '../types';

interface AuthContextType {
  isAuthenticated: boolean;
  user: JwtUser | null;
  login: (data: LoginPayload) => Promise<void>;
  register: (data: RegisterPayload) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
  hasRole: (role: RoleType) => boolean;
  hasAnyRole: (...roles: RoleType[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const decodeJwt = (token: string): JwtUser | null => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1])) as JwtUser;
    return payload;
  } catch {
    return null;
  }
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<JwtUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const token = getAccessToken();
    if (token) {
      const payload = decodeJwt(token);
      if (payload) {
        setUser(payload);
        setIsAuthenticated(true);
      } else {
        clearTokens();
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (loading) return;
    const isPublic = pathname === '/login' || pathname === '/register' || pathname?.startsWith('/verify');
    if (!isAuthenticated && !isPublic) {
      router.push('/login');
    } else if (isAuthenticated && (pathname === '/login' || pathname === '/register')) {
      router.push('/');
    }
  }, [isAuthenticated, loading, pathname, router]);

  const login = useCallback(async (credentials: LoginPayload) => {
    const res = await apiFetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });

    if (!res.ok) {
      throw new Error(await extractError(res, 'Credenciales inválidas'));
    }

    const responseData = await res.json();
    const { accessToken, refreshToken } = responseData.data;
    setTokens(accessToken, refreshToken);

    const payload = decodeJwt(accessToken);
    setUser(payload);
    setIsAuthenticated(true);
    router.push('/');
  }, [router]);

  const register = useCallback(async (userData: RegisterPayload) => {
    const res = await apiFetch('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });

    if (!res.ok) {
      throw new Error(await extractError(res, 'Error en el registro'));
    }
    router.push('/login');
  }, [router]);

  const logout = useCallback(async () => {
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
  }, [router]);

  const hasRole = useCallback(
    (role: RoleType) => user?.roles.includes(role) ?? false,
    [user],
  );

  const hasAnyRole = useCallback(
    (...roles: RoleType[]) => roles.some((r) => user?.roles.includes(r) ?? false),
    [user],
  );

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, user, login, register, logout, loading, hasRole, hasAnyRole }}
    >
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
