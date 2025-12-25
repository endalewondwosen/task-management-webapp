import { useQuery } from '@tanstack/react-query';
import { analyticsApi, type TaskStats, type ProjectStats, type UserActivityStats, type CalendarTask } from '../api/analytics';

export const useTaskStats = (userId?: string) => {
  return useQuery<TaskStats>({
    queryKey: ['analytics', 'tasks', userId],
    queryFn: () => analyticsApi.getTaskStats(userId),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useProjectStats = (userId?: string) => {
  return useQuery<ProjectStats>({
    queryKey: ['analytics', 'projects', userId],
    queryFn: () => analyticsApi.getProjectStats(userId),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useUserActivityStats = (userId?: string) => {
  return useQuery<UserActivityStats>({
    queryKey: ['analytics', 'users', userId],
    queryFn: () => analyticsApi.getUserActivityStats(userId),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useCalendarTasks = (userId?: string, startDate?: Date, endDate?: Date) => {
  return useQuery<{ tasks: CalendarTask[] }>({
    queryKey: ['analytics', 'calendar', userId, startDate?.toISOString(), endDate?.toISOString()],
    queryFn: () => analyticsApi.getCalendarTasks(userId, startDate, endDate),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

