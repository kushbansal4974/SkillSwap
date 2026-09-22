import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const DemoContext = createContext(null);

export const DemoProvider = ({ children }) => {
  const { user, currentRole: authRole, isCreator: authIsCreator, isClient: authIsClient, quickDemoLogin, logout } = useAuth();

  const [fallbackRole, setFallbackRole] = useState(() => {
    try {
      return localStorage.getItem('skillswap_role') || 'client';
    } catch {
      return 'client';
    }
  });

  const currentRole = user ? user.role : fallbackRole;
  const isCreator = currentRole === 'creator';
  const isClient = currentRole === 'client';

  const currentUser = user || {
    id: isCreator ? 'creator_001' : 'client_001',
    _id: isCreator ? 'creator_001' : 'client_001',
    name: isCreator ? 'Aman Sharma' : 'Rohan Varma',
    email: isCreator ? 'creator@skillswap.com' : 'client@skillswap.com',
    role: currentRole,
    initials: isCreator ? 'AS' : 'RV',
    avatar: isCreator
      ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'
      : 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
  };

  const setRole = async (newRole) => {
    if (newRole !== 'creator' && newRole !== 'client') return;
    setFallbackRole(newRole);
    try {
      localStorage.setItem('skillswap_role', newRole);
      // Automatically perform real JWT authentication for the switched role
      await quickDemoLogin(newRole);
    } catch (err) {
      console.warn('Role switch quick-login notice:', err.message);
    }
  };

  const toggleRole = () => {
    const next = currentRole === 'creator' ? 'client' : 'creator';
    setRole(next);
  };

  return (
    <DemoContext.Provider
      value={{
        currentRole,
        currentUser,
        setRole,
        toggleRole,
        isCreator,
        isClient,
      }}
    >
      {children}
    </DemoContext.Provider>
  );
};

export const useDemo = () => {
  const context = useContext(DemoContext);
  if (!context) {
    throw new Error('useDemo must be used within a DemoProvider');
  }
  return context;
};

export default DemoContext;
