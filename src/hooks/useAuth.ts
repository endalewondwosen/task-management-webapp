import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { authApi } from '../api/auth';
import type { LoginCredentials } from '../types';

export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (credentials: LoginCredentials & { rememberMe?: boolean }) => 
      authApi.login(credentials),
    onSuccess: (data) => {
      queryClient.setQueryData(['auth', 'me'], data.user);
      toast.success(`Welcome back, ${data.user.name}!`);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Login failed. Please check your credentials.');
    },
  });
};

export const useCurrentUser = () => {
  return useQuery({
    queryKey: ['auth', 'me'],
    queryFn: () => authApi.getCurrentUser(),
    enabled: authApi.isAuthenticated(),
    retry: false,
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();

  return async () => {
    await authApi.logout();
    queryClient.clear();
    toast.success('Logged out successfully');
    window.location.href = '/login';
  };
};

export const useSessions = () => {
  return useQuery({
    queryKey: ['auth', 'sessions'],
    queryFn: () => authApi.getSessions(),
  });
};

export const useRevokeSession = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (sessionId: string) => authApi.revokeSession(sessionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auth', 'sessions'] });
      toast.success('Session revoked successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to revoke session');
    },
  });
};

export const useRevokeAllOtherSessions = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => authApi.revokeAllOtherSessions(),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['auth', 'sessions'] });
      const count = data?.revokedCount ?? 0;
      toast.success(`Revoked ${count} session(s)`);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to revoke sessions');
    },
  });
};

