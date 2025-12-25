import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { rolesApi } from '../api/roles';
import type { CreateRoleInput, UpdateRoleInput, AssignPermissionInput } from '../types';
import toast from 'react-hot-toast';

export const useRoles = () => {
  return useQuery({
    queryKey: ['roles'],
    queryFn: () => rolesApi.getAllRoles(),
  });
};

export const useRole = (id: string | null | undefined) => {
  return useQuery({
    queryKey: ['roles', id],
    queryFn: () => {
      if (!id) {
        throw new Error('Role ID is required');
      }
      return rolesApi.getRole(id);
    },
    enabled: !!id,
  });
};

export const useCreateRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateRoleInput) => rolesApi.createRole(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
      toast.success('Role created successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create role');
    },
  });
};

export const useUpdateRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateRoleInput }) =>
      rolesApi.updateRole(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
      queryClient.invalidateQueries({ queryKey: ['roles', variables.id] });
      toast.success('Role updated successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update role');
    },
  });
};

export const useDeleteRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => rolesApi.deleteRole(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('Role deleted successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete role');
    },
  });
};

export const useAssignPermission = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AssignPermissionInput) => rolesApi.assignPermission(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
      queryClient.invalidateQueries({ queryKey: ['roles', variables.roleId] });
      toast.success('Permission assigned successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to assign permission');
    },
  });
};

export const useRemovePermission = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AssignPermissionInput) => rolesApi.removePermission(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
      queryClient.invalidateQueries({ queryKey: ['roles', variables.roleId] });
      toast.success('Permission removed successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to remove permission');
    },
  });
};

