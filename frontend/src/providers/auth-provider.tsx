'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '@/types/user';
import { apiClient } from '@/services/api/client';

interface AuthContextType {
  user: User | null;
  role: UserRole | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string, userData: User) => void;
  logout: () => void;
  devSwitchRole: (newRole: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await apiClient.get('/api/v1/profile');
        const u = response.data.data;
        if (u) {
          setUser({
            id: u.id || u._id,
            name: u.name,
            email: u.email,
            role: u.role,
            createdAt: u.createdAt || new Date().toISOString()
          });
        } else {
          setUser(null);
        }
      } catch {
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUserProfile();
  }, []);

  const login = (token: string, userData: User) => {
    document.cookie = `ciisic_token=${token}; path=/; max-age=86400; SameSite=Strict`;
    setUser(userData);
  };

  const logout = () => {
    document.cookie = 'ciisic_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    setUser(null);
  };

  const devSwitchRole = (newRole: UserRole) => {
    // Dev role switch removed to avoid unauthorized bypasses
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role || null,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        devSwitchRole
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside an AuthProvider');
  }
  return context;
};
