import { api } from '../lib/api';
import type { RoleDetail, CreateRoleInput, UpdateRoleInput, AssignPermissionInput } from '../types';

export const rolesApi = {
  // Get all roles
  getAllRoles: async (): Promise<RoleDetail[]> => {
    const response = await api.get<RoleDetail[]>('/roles');
    return response.data || [];
  },

  // Get a single role
  getRole: async (id: string): Promise<RoleDetail> => {
    if (!id) {
      throw new Error('Role ID is required');
    }
    const response = await api.get<RoleDetail>(`/roles/${id}`);
    return response.data;
  },

  // Create a role
  createRole: async (data: CreateRoleInput): Promise<RoleDetail> => {
    if (!data?.name?.trim()) {
      throw new Error('Role name is required');
    }
    const response = await api.post<RoleDetail>('/roles', {
      name: data.name.trim(),
      description: data.description?.trim() || undefined,
    });
    return response.data;
  },

  // Update a role
  updateRole: async (id: string, data: UpdateRoleInput): Promise<RoleDetail> => {
    if (!id) {
      throw new Error('Role ID is required');
    }
    const response = await api.patch<RoleDetail>(`/roles/${id}`, data);
    return response.data;
  },

  // Delete a role
  deleteRole: async (id: string): Promise<void> => {
    if (!id) {
      throw new Error('Role ID is required');
    }
    await api.delete(`/roles/${id}`);
  },

  // Assign permission to role
  assignPermission: async (data: AssignPermissionInput): Promise<void> => {
    if (!data?.roleId) {
      throw new Error('Role ID is required');
    }
    if (!data?.permissionId) {
      throw new Error('Permission ID is required');
    }
    await api.post('/roles/assign-permission', data);
  },

  // Remove permission from role
  removePermission: async (data: AssignPermissionInput): Promise<void> => {
    if (!data?.roleId) {
      throw new Error('Role ID is required');
    }
    if (!data?.permissionId) {
      throw new Error('Permission ID is required');
    }
    await api.post('/roles/remove-permission', data);
  },
};

