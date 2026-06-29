'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '@/types/user';

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
    // Load session from local storage on client mount
    const savedUser = localStorage.getItem('ciisic_user');
    const savedToken = localStorage.getItem('ciisic_token');

    if (savedUser && savedToken) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem('ciisic_user');
        localStorage.removeItem('ciisic_token');
      }
    }

    // Handle dev-only environment role override
    const devRole = process.env.NEXT_PUBLIC_DEV_ROLE;
    if (devRole && process.env.NODE_ENV === 'development' && !savedToken) {
      setUser({
        id: 'dev-user-id',
        name: 'Developer Mode',
        email: 'dev@ciisic.org',
        role: devRole as UserRole,
        createdAt: new Date().toISOString()
      });
    }

    setIsLoading(false);
  }, []);

  const login = (token: string, userData: User) => {
    localStorage.setItem('ciisic_token', token);
    localStorage.setItem('ciisic_user', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('ciisic_token');
    localStorage.removeItem('ciisic_user');
    setUser(null);
  };

  const devSwitchRole = (newRole: UserRole) => {
    if (process.env.NODE_ENV === 'development') {
      const updatedUser = user ? { ...user, role: newRole } : {
        id: 'dev-user-id',
        name: 'Developer Mode',
        email: 'dev@ciisic.org',
        role: newRole,
        createdAt: new Date().toISOString()
      };
      localStorage.setItem('ciisic_user', JSON.stringify(updatedUser));
      setUser(updatedUser);
    }
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
