import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { tasksApi, type TaskQueryParams } from '../api/tasks';
import type { CreateTaskInput, UpdateTaskInput } from '../types';

const TASKS_QUERY_KEY = 'tasks';

export const useTasks = (params?: TaskQueryParams) => {
  return useQuery({
    queryKey: [TASKS_QUERY_KEY, params],
    queryFn: () => tasksApi.listTasks(params),
    retry: (failureCount, error) => {
      // Don't retry on 4xx errors
      if (error && typeof error === 'object' && 'response' in error) {
        const status = (error as any).response?.status;
        if (status && status >= 400 && status < 500) {
          return false;
        }
      }
      return failureCount < 3;
    },
  });
};

export const useTask = (id: string) => {
  return useQuery({
    queryKey: [TASKS_QUERY_KEY, id],
    queryFn: () => tasksApi.getTask(id),
    enabled: !!id,
    retry: (failureCount, error) => {
      // Don't retry on 4xx errors (like 404)
      if (error && typeof error === 'object' && 'response' in error) {
        const status = (error as any).response?.status;
        if (status && status >= 400 && status < 500) {
          return false;
        }
      }
      return failureCount < 3;
    },
  });
};

export const useCreateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTaskInput) => tasksApi.createTask(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TASKS_QUERY_KEY] });
      toast.success('Task created successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create task');
    },
  });
};

export const useUpdateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTaskInput }) =>
      tasksApi.updateTask(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [TASKS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [TASKS_QUERY_KEY, variables.id] });
      toast.success('Task updated successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update task');
    },
  });
};

export const useDeleteTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => tasksApi.deleteTask(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TASKS_QUERY_KEY] });
      toast.success('Task deleted successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete task');
    },
  });
};

