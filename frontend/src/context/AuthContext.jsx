import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUserState] = useState(null);
  const [token, setTokenState] = useState(() => localStorage.getItem('token'));
  const [isAuthenticated, setIsAuthenticated] = useState(Boolean(localStorage.getItem('token')));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem('token');

    if (savedToken) {
      setTokenState(savedToken);
      setIsAuthenticated(true);
      // TODO: Consultar GET /api/users/profile para obtener la información del usuario.
      // Esta llamada se conectará con el backend más adelante.
    } else {
      setTokenState(null);
      setIsAuthenticated(false);
    }

    setLoading(false);
  }, []);

  const login = (newToken) => {
    localStorage.setItem('token', newToken);
    setTokenState(newToken);
    setIsAuthenticated(true);
    setLoading(false);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUserState(null);
    setTokenState(null);
    setIsAuthenticated(false);
    setLoading(false);
  };

  const setUser = (nextUser) => {
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
