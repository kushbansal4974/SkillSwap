import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import authApi from '../api/authApi';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(true);

  // Initialize auth state and sync with backend
  useEffect(() => {
    let isMounted = true;

    const initializeAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const freshUser = await authApi.getCurrentUser();
          if (isMounted && freshUser) {
            setUser(freshUser);
          }
        } catch (err) {
          console.warn('Session verification notice:', err.message);
          // Keep stored user if offline or network issue, only clear if 401
          if (err.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            if (isMounted) setUser(null);
          }
        }
      }
      if (isMounted) {
        setLoading(false);
      }
    };

    initializeAuth();

    return () => {
      isMounted = false;
    };
  }, []);

  const login = async (credentials) => {
    setLoading(true);
    try {
      const response = await authApi.login(credentials);
      setUser(response.user);
      return response;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    try {
      const response = await authApi.register(userData);
      setUser(response.user);
      return response;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await authApi.logout();
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (profileData) => {
    const updatedUser = await authApi.updateProfile(profileData);
    setUser(updatedUser);
    return updatedUser;
  };

  // Helper to 1-click test login for hackathon evaluation or quick inspection
  const quickDemoLogin = async (role = 'creator') => {
    const email = role === 'creator' ? 'creator@skillswap.com' : 'client@skillswap.com';
    return login({ email, password: 'password123' });
  };

  const currentRole = user?.role || 'client';
  const isCreator = currentRole === 'creator';
  const isClient = currentRole === 'client';

  return (
    <AuthContext.Provider
      value={{
        user,
        currentUser: user,
        isAuthenticated: !!user,
        loading,
        login,
        register,
        logout,
        updateProfile,
        setUser,
        currentRole,
        isCreator,
        isClient,
        quickDemoLogin,
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

export default AuthContext;
