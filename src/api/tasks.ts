import { api } from '../lib/api';
import type { Task, CreateTaskInput, UpdateTaskInput, PaginatedResponse, PaginationParams } from '../types';

import type { TaskStatus } from '../types';

export interface TaskQueryParams extends PaginationParams {
  status?: TaskStatus;
  search?: string;
  dueBefore?: string;
  dueAfter?: string;
}

export const tasksApi = {
  /**
   * Get all tasks with pagination and filters
   */
  listTasks: async (params?: TaskQueryParams): Promise<PaginatedResponse<Task>> => {
    const response = await api.get<PaginatedResponse<Task>>('/tasks', { params });
    return response.data;
  },

  /**
   * Get a task by ID
   */
  getTask: async (id: string): Promise<Task> => {
    const response = await api.get<Task>(`/tasks/${id}`);
    return response.data;
  },

  /**
   * Create a new task
   */
  createTask: async (data: CreateTaskInput): Promise<Task> => {
    const response = await api.post<Task>('/tasks', data);
    return response.data;
  },

  /**
   * Update a task
   */
  updateTask: async (id: string, data: UpdateTaskInput): Promise<Task> => {
    const response = await api.patch<Task>(`/tasks/${id}`, data);
    return response.data;
  },

  /**
   * Delete a task
   */
  deleteTask: async (id: string): Promise<void> => {
    await api.delete(`/tasks/${id}`);
  },
};

