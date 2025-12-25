import { api } from '../lib/api';
import type { Project, CreateProjectInput, UpdateProjectInput, PaginatedResponse, PaginationParams } from '../types';

export interface ProjectQueryParams extends PaginationParams {}

export const projectsApi = {
  /**
   * Get all projects with pagination
   */
  listProjects: async (params?: ProjectQueryParams): Promise<PaginatedResponse<Project>> => {
    const response = await api.get<PaginatedResponse<Project>>('/projects', { params });
    return response.data;
  },

  /**
   * Get a project by ID
   */
  getProject: async (id: string): Promise<Project> => {
    const response = await api.get<Project>(`/projects/${id}`);
    return response.data;
  },

  /**
   * Create a new project
   */
  createProject: async (data: CreateProjectInput): Promise<Project> => {
    const response = await api.post<Project>('/projects', data);
    return response.data;
  },

  /**
   * Update a project
   */
  updateProject: async (id: string, data: UpdateProjectInput): Promise<Project> => {
    const response = await api.patch<Project>(`/projects/${id}`, data);
    return response.data;
  },

  /**
   * Delete a project
   */
  deleteProject: async (id: string): Promise<void> => {
    await api.delete(`/projects/${id}`);
  },
};

