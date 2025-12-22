import React, { createContext, useState, useContext, useEffect, useMemo, useCallback } from 'react';
import authService from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check for logged-in user on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (authService.isAuthenticated()) {
          // Verify token validity by fetching profile
          // This ensures we don't just trust localStorage blindly
          const userData = await authService.getCurrentUserProfile();
          setUser(userData);
        }
      } catch (err) {
        console.error("Auth initialization error:", err);
        // If token is invalid (e.g. expired refresh token), clear it
        authService.logout();
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = useCallback(async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const result = await authService.login(email, password);
      setUser(result.user);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const signup = useCallback(async (userData) => {
    setLoading(true);
    setError(null);
    try {
      const result = await authService.signup(userData);
      setUser(result.user);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const userData = await authService.getCurrentUserProfile();
      setUser(userData);
    } catch (err) {
      console.error('Error refreshing user:', err);
    }
  }, []);

  const logout = useCallback(() => {
    authService.logout();
    setUser(null);
  }, []);

  const value = useMemo(() => ({
    user,
    loading,
    error,
    login,
    signup,
    logout,
    refreshUser,
    isAuthenticated: !!user,
  }), [user, loading, error, login, signup, logout, refreshUser]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
