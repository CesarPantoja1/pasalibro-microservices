import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUserState] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setTokenState] = useState(() => localStorage.getItem('token'));
  const [isAuthenticated, setIsAuthenticated] = useState(Boolean(localStorage.getItem('token')));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');

    if (savedToken) {
      setTokenState(savedToken);
      setIsAuthenticated(true);
      if (savedUser) {
        try {
          setUserState(JSON.parse(savedUser));
        } catch (e) {
          console.error('Error parsing saved user', e);
        }
      }
    } else {
      setTokenState(null);
      setUserState(null);
      setIsAuthenticated(false);
    }

    setLoading(false);
  }, []);

  const login = (newToken, userData) => {
    localStorage.setItem('token', newToken);
    if (userData) {
      localStorage.setItem('user', JSON.stringify(userData));
      setUserState(userData);
    }
    setTokenState(newToken);
    setIsAuthenticated(true);
    setLoading(false);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUserState(null);
    setTokenState(null);
    setIsAuthenticated(false);
    setLoading(false);
  };

  const setUser = (nextUser) => {
    if (nextUser) {
      localStorage.setItem('user', JSON.stringify(nextUser));
    } else {
      localStorage.removeItem('user');
    }
    setUserState(nextUser);
  };

  const value = useMemo(
    () => ({
      user,
      token,
      isAuthenticated,
      loading,
      login,
      logout,
      setUser,
    }),
    [user, token, isAuthenticated, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used inside an AuthProvider');
  }

  return context;
}

export default AuthContext;
