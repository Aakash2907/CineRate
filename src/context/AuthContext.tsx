import React, { createContext, useContext, useState, useEffect } from 'react';
import { api, UserProfile } from '../lib/api.ts';

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  authModalOpen: boolean;
  authModalTab: 'login' | 'register';
  openAuthModal: (tab?: 'login' | 'register') => void;
  closeAuthModal: () => void;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, confirmPassword: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (name: string, email?: string) => Promise<void>;
  refreshUser: () => Promise<void>;
  quickLogin: (type: 'admin' | 'user') => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);
  const [authModalTab, setAuthModalTab] = useState<'login' | 'register'>('login');

  const refreshUser = async () => {
    try {
      const data = await api.auth.getMe();
      setUser(data.user);
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const openAuthModal = (tab: 'login' | 'register' = 'login') => {
    setAuthModalTab(tab);
    setAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setAuthModalOpen(false);
  };

  const login = async (email: string, password: string) => {
    const data = await api.auth.login({ email, password });
    setUser(data.user);
    closeAuthModal();
  };

  const register = async (name: string, email: string, password: string, confirmPassword: string) => {
    const data = await api.auth.register({ name, email, password, confirmPassword });
    setUser(data.user);
    closeAuthModal();
  };

  const logout = async () => {
    await api.auth.logout();
    setUser(null);
  };

  const updateProfile = async (name: string, email?: string) => {
    const data = await api.auth.updateProfile({ name, email });
    setUser(data.user);
  };

  const quickLogin = async (type: 'admin' | 'user') => {
    if (type === 'admin') {
      await login('admin@cinerate.com', 'Admin@123');
    } else {
      await login('alex@cinerate.com', 'User@123');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        authModalOpen,
        authModalTab,
        openAuthModal,
        closeAuthModal,
        login,
        register,
        logout,
        updateProfile,
        refreshUser,
        quickLogin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
