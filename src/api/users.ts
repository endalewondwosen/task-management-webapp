import { api } from '../lib/api';
import type { User, PaginatedResponse, PaginationParams } from '../types';

export interface UserQueryParams extends PaginationParams {}

export interface CreateUserInput {
  name: string;
  email: string;
  password: string;
  roleName?: string;
}

export interface UpdateUserInput {
  name?: string;
  email?: string;
  password?: string;
  roleName?: string;
}

export const usersApi = {
  /**
   * Get all users with pagination
   */
  listUsers: async (params?: UserQueryParams): Promise<PaginatedResponse<User>> => {
    const response = await api.get<PaginatedResponse<User>>('/users', { params });
    return response.data;
  },

  /**
   * Get a user by ID
   */
  getUser: async (id: string): Promise<User> => {
    const response = await api.get<User>(`/users/${id}`);
    return response.data;
  },

  /**
   * Create a new user
   */
  createUser: async (data: CreateUserInput): Promise<User> => {
    const response = await api.post<User>('/users', data);
    return response.data;
  },

  /**
   * Update a user
   */
  updateUser: async (id: string, data: UpdateUserInput): Promise<User> => {
    const response = await api.patch<User>(`/users/${id}`, data);
    return response.data;
  },

  /**
   * Delete a user
   */
  deleteUser: async (id: string): Promise<void> => {
    await api.delete(`/users/${id}`);
  },
};

