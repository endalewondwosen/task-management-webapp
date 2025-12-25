import { api } from '../lib/api';

export type ActivityAction = 'CREATE' | 'UPDATE' | 'DELETE';
export type EntityType = 'task' | 'project' | 'user' | 'comment' | 'label' | 'role' | 'permission';

export interface ActivityChanges {
  [field: string]: {
    old: any;
    new: any;
  };
}

export interface Activity {
  id: string;
  userId: string;
  action: ActivityAction;
  entityType: EntityType;
  entityId: string;
  entityName: string | null;
  changes: ActivityChanges | null;
  description: string | null;
  metadata: any;
  ipAddress: string | null;
  userAgent: string | null;
  createdAt: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

export interface ActivityFilters {
  userId?: string;
  entityType?: EntityType;
  entityId?: string;
  action?: ActivityAction;
  startDate?: Date;
  endDate?: Date;
  limit?: number;
  offset?: number;
}

export interface ActivityResponse {
  data: Activity[];
  total: number;
  limit: number;
  offset: number;
}

export const activityApi = {
  /**
   * Get activities with filters
   */
  getActivities: async (filters?: ActivityFilters): Promise<ActivityResponse> => {
    const params: any = {};
    if (filters?.userId) params.userId = filters.userId;
    if (filters?.entityType) params.entityType = filters.entityType;
    if (filters?.entityId) params.entityId = filters.entityId;
    if (filters?.action) params.action = filters.action;
    if (filters?.startDate) params.startDate = filters.startDate.toISOString();
    if (filters?.endDate) params.endDate = filters.endDate.toISOString();
    if (filters?.limit) params.limit = filters.limit;
    if (filters?.offset) params.offset = filters.offset;

    const response = await api.get<ActivityResponse>('/activities', { params });
    return response.data;
  },

  /**
   * Get activities for a specific entity
   */
  getEntityActivities: async (
    entityType: EntityType,
    entityId: string,
    limit?: number
  ): Promise<ActivityResponse> => {
    const params: any = {};
    if (limit) params.limit = limit;

    const response = await api.get<ActivityResponse>(
      `/activities/entity/${entityType}/${entityId}`,
      { params }
    );
    return response.data;
  },

  /**
   * Get current user's activity history
   */
  getMyActivityHistory: async (limit?: number, offset?: number): Promise<ActivityResponse> => {
    const params: any = {};
    if (limit) params.limit = limit;
    if (offset) params.offset = offset;

    const response = await api.get<ActivityResponse>('/activities/me', { params });
    return response.data;
  },
};

