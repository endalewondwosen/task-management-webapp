import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { useCurrentUser, useLogin, useLogout } from '../hooks/useAuth';
import type { User } from '../types';
import { authApi } from '../api/auth';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const { data: currentUser, isLoading: isLoadingUser } = useCurrentUser();
  const loginMutation = useLogin();
  const logoutFn = useLogout();

  // Update user state when currentUser query changes
  useEffect(() => {
    if (currentUser) {
      setUser(currentUser);
    } else if (!isLoadingUser && !authApi.isAuthenticated()) {
      setUser(null);
    }
  }, [currentUser, isLoadingUser]);

  const login = async (email: string, password: string, rememberMe?: boolean) => {
    const response = await loginMutation.mutateAsync({ email, password, rememberMe });
    setUser(response.user);
  };

  const logout = async () => {
    await logoutFn();
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    isLoading: isLoadingUser || loginMutation.isPending,
    isAuthenticated: !!user,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

