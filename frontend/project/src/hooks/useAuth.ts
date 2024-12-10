import { useState } from 'react';
import { LoginCredentials, AuthState } from '../types/auth';

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    username: null,
    error: null,
  });

  const login = async (credentials: LoginCredentials) => {
    // Simulate API call
    if (credentials.username === 'admin' && credentials.password === 'password') {
      setAuthState({
        isAuthenticated: true,
        username: credentials.username,
        error: null,
      });
      return true;
    }

    setAuthState({
      isAuthenticated: false,
      username: null,
      error: 'Usuário ou senha inválidos',
    });
    return false;
  };

  const logout = () => {
    setAuthState({
      isAuthenticated: false,
      username: null,
      error: null,
    });
  };

  return {
    ...authState,
    login,
    logout,
  };
}