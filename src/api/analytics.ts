import { api } from '../lib/api';

export interface TaskStats {
  total: number;
  byStatus: {
    TODO: number;
    IN_PROGRESS: number;
    IN_REVIEW: number;
    DONE: number;
    CANCELLED: number;
  };
  byPriority: {
    LOW: number;
    MEDIUM: number;
    HIGH: number;
    URGENT: number;
  };
  completionRate: number;
  overdue: number;
  dueThisWeek: number;
  dueThisMonth: number;
}

export interface ProjectStats {
  total: number;
  byStatus: {
    ACTIVE: number;
    ON_HOLD: number;
    COMPLETED: number;
    CANCELLED: number;
  };
  averageProgress: number;
  withTasks: number;
  withoutTasks: number;
}

export interface UserActivityStats {
  totalUsers: number;
  activeUsers: number;
  tasksCreated: number;
  tasksCompleted: number;
  projectsCreated: number;
  recentActivity: Array<{
    userId: string;
    userName: string;
    userEmail: string;
    tasksCreated: number;
    tasksCompleted: number;
    lastActivity: string;
  }>;
}

export interface CalendarTask {
  id: string;
  title: string;
  dueDate: string;
  status: string;
  priority: string;
  projectId: string | null;
  projectName: string | null;
}

export const analyticsApi = {
  /**
   * Get task statistics
   */
  getTaskStats: async (userId?: string): Promise<TaskStats> => {
    const params = userId ? { userId } : {};
    const response = await api.get<TaskStats>('/analytics/tasks', { params });
    return response.data;
  },

  /**
   * Get project statistics
   */
  getProjectStats: async (userId?: string): Promise<ProjectStats> => {
    const params = userId ? { userId } : {};
    const response = await api.get<ProjectStats>('/analytics/projects', { params });
    return response.data;
  },

  /**
   * Get user activity statistics
   */
  getUserActivityStats: async (userId?: string): Promise<UserActivityStats> => {
    const params = userId ? { userId } : {};
    const response = await api.get<UserActivityStats>('/analytics/users', { params });
    return response.data;
  },

  /**
   * Get calendar tasks
   */
  getCalendarTasks: async (userId?: string, startDate?: Date, endDate?: Date): Promise<{ tasks: CalendarTask[] }> => {
    const params: any = {};
    if (userId) params.userId = userId;
    if (startDate) params.startDate = startDate.toISOString();
    if (endDate) params.endDate = endDate.toISOString();
    
    const response = await api.get<{ tasks: CalendarTask[] }>('/analytics/calendar', { params });
    return response.data;
  },
};

