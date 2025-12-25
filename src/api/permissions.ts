import { api } from '../lib/api';
import type { Permission } from '../types';

export const permissionsApi = {
  // Get all permissions
  getAllPermissions: async (): Promise<Permission[]> => {
    const response = await api.get<Permission[]>('/permissions');
    return response.data || [];
  },

  // Get a single permission
  getPermission: async (id: string): Promise<Permission> => {
    if (!id) {
      throw new Error('Permission ID is required');
    }
    const response = await api.get<Permission>(`/permissions/${id}`);
    return response.data;
  },
};

