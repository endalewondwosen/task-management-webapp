import { useQuery } from '@tanstack/react-query';
import { permissionsApi } from '../api/permissions';

export const usePermissions = () => {
  return useQuery({
    queryKey: ['permissions'],
    queryFn: () => permissionsApi.getAllPermissions(),
  });
};

export const usePermission = (id: string | null | undefined) => {
  return useQuery({
    queryKey: ['permissions', id],
    queryFn: () => {
      if (!id) {
        throw new Error('Permission ID is required');
      }
      return permissionsApi.getPermission(id);
    },
    enabled: !!id,
  });
};

