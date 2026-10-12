import { useCallback, useEffect, useMemo, useState } from 'react';
import { getCurrentUser, signIn as requestSignIn, signOut as requestSignOut, signUp as requestSignUp, AuthApiError } from '../api/auth';
import AuthContext from './AuthContext';

const userFromResponse = (response) => {
  if (response?.user && typeof response.user === 'object') {
    return response.user;
  }
  if (response && typeof response === 'object' && typeof response.email === 'string') {
    return response;
  }
  return null;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState('loading');
  const [sessionError, setSessionError] = useState('');

  const refresh = useCallback(async () => {
    setStatus('loading');
    setSessionError('');
    try {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
      setStatus(currentUser ? 'authenticated' : 'unauthenticated');
      return currentUser;
    } catch (error) {
      setUser(null);
      setStatus('error');
      setSessionError(error.message || 'Unable to check your session. Please try again.');
      throw error;
    }
  }, []);

  useEffect(() => {
    let active = true;
    getCurrentUser().then((currentUser) => {
      if (!active) return;
      setUser(currentUser);
      setStatus(currentUser ? 'authenticated' : 'unauthenticated');
    }).catch((error) => {
      if (!active) return;
      setUser(null);
      setStatus('error');
      setSessionError(error.message || 'Unable to check your session. Please try again.');
    });
    return () => {
      active = false;
    };
  }, []);

  const login = useCallback(async (credentials) => {
    const response = await requestSignIn(credentials);
    const currentUser = userFromResponse(response) || await getCurrentUser();
    if (!currentUser) {
      throw new AuthApiError('Sign-in completed, but no authenticated session was found. Check your backend session configuration.');
    }
    setUser(currentUser);
    setSessionError('');
    setStatus('authenticated');
    return currentUser;
  }, []);

  const signup = useCallback(async (credentials) => {
    const response = await requestSignUp(credentials);
    let currentUser = userFromResponse(response);
    if (!currentUser && response?.authenticated === true) {
      currentUser = await getCurrentUser();
    }
    if (currentUser) {
      setUser(currentUser);
      setSessionError('');
      setStatus('authenticated');
    }
    return { response, user: currentUser };
  }, []);

  const logout = useCallback(async () => {
    try {
      await requestSignOut();
    } finally {
      setUser(null);
      setSessionError('');
      setStatus('unauthenticated');
    }
  }, []);

  const continueAsGuest = useCallback(() => {
    setUser(null);
    setSessionError('');
    setStatus('unauthenticated');
  }, []);

  const value = useMemo(() => ({
    user,
    status,
    sessionError,
    refresh,
    login,
    signup,
    logout,
    continueAsGuest,
  }), [user, status, sessionError, refresh, login, signup, logout, continueAsGuest]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
