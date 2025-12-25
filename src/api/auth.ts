import { api } from '../lib/api';
import type { LoginCredentials, AuthResponse, User, Session } from '../types';

export const authApi = {
  /**
   * Login user
   */
  login: async (credentials: LoginCredentials & { rememberMe?: boolean }): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/login', credentials, {
      withCredentials: true, // Include cookies for refresh token
    });
    // Store access token in localStorage
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  },

  /**
   * Get current authenticated user
   */
  getCurrentUser: async (): Promise<User> => {
    const response = await api.get<User>('/auth/me');
    return response.data;
  },

  /**
   * Refresh access token
   */
  refreshToken: async (): Promise<{ token: string }> => {
    const response = await api.post<{ token: string }>('/auth/refresh', {}, {
      withCredentials: true,
    });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  },

  /**
   * Get all active sessions
   */
  getSessions: async (): Promise<{ sessions: Session[]; currentSessionId?: string | null }> => {
    const response = await api.get<{ sessions: Session[]; currentSessionId?: string | null }>('/auth/sessions');
    return response.data;
  },

  /**
   * Revoke a specific session
   */
  revokeSession: async (sessionId: string): Promise<void> => {
    await api.delete(`/auth/sessions/${sessionId}`);
  },

  /**
   * Revoke all other sessions
   */
  revokeAllOtherSessions: async (): Promise<{ message: string; revokedCount: number }> => {
    const response = await api.delete('/auth/sessions/revoke-others');
    return response.data;
  },

  /**
   * Logout user (revoke current session)
   */
  logout: async (): Promise<void> => {
    try {
      await api.post('/auth/logout', {}, { withCredentials: true });
    } catch (error) {
      // Continue even if logout request fails
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('token');
    }
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('token');
  },
};

