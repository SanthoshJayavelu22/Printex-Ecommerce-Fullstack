'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchApi, setAuthToken, removeAuthToken, getAuthToken } from '@/lib/api';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  phoneNumber?: string;
  addresses?: any[];
  wishlist?: string[];
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => void;
  updateProfile: (data: any) => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getAuthToken();
    if (token) {
      loadUser();
    } else {
      setLoading(false);
    }
  }, []);

  const loadUser = async () => {
    try {
      const { user } = await fetchApi('/auth/me');
      setUser(user);
    } catch (err) {
      removeAuthToken();
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    const { token, user } = await fetchApi('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    setAuthToken(token);
    setUser(user);
  };

  const register = async (userData: any) => {
    const { token, user } = await fetchApi('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    setAuthToken(token);
    setUser(user);
  };

  const logout = () => {
    removeAuthToken();
    setUser(null);
  };

  const updateProfile = async (data: any) => {
    const { user: updatedUser } = await fetchApi('/auth/updateprofile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateProfile, refreshUser: loadUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
