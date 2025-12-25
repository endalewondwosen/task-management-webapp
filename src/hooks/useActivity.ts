import { useQuery } from '@tanstack/react-query';
import {
  activityApi,
  type Activity,
  type ActivityFilters,
  type ActivityResponse,
  type EntityType,
} from '../api/activity';

export const useActivities = (filters?: ActivityFilters) => {
  return useQuery<ActivityResponse>({
    queryKey: ['activities', filters],
    queryFn: () => activityApi.getActivities(filters),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useEntityActivities = (entityType: EntityType, entityId: string, limit?: number) => {
  return useQuery<ActivityResponse>({
    queryKey: ['activities', 'entity', entityType, entityId, limit],
    queryFn: () => activityApi.getEntityActivities(entityType, entityId, limit),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useMyActivityHistory = (limit?: number, offset?: number) => {
  return useQuery<ActivityResponse>({
    queryKey: ['activities', 'me', limit, offset],
    queryFn: () => activityApi.getMyActivityHistory(limit, offset),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

