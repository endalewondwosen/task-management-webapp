import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { labelsApi } from '../api/labels';
import type { CreateLabelInput, UpdateLabelInput, LabelTaskInput } from '../types';
import toast from 'react-hot-toast';

export const useLabels = () => {
  return useQuery({
    queryKey: ['labels'],
    queryFn: () => labelsApi.getAllLabels(),
  });
};

export const useLabel = (id: string | null | undefined) => {
  return useQuery({
    queryKey: ['labels', id],
    queryFn: () => {
      if (!id) {
        throw new Error('Label ID is required');
      }
      return labelsApi.getLabel(id);
    },
    enabled: !!id,
  });
};

export const useCreateLabel = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateLabelInput) => labelsApi.createLabel(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['labels'] });
      toast.success('Label created successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create label');
    },
  });
};

export const useUpdateLabel = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateLabelInput }) =>
      labelsApi.updateLabel(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['labels'] });
      queryClient.invalidateQueries({ queryKey: ['labels', variables.id] });
      toast.success('Label updated successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update label');
    },
  });
};

export const useDeleteLabel = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => labelsApi.deleteLabel(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['labels'] });
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast.success('Label deleted successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete label');
    },
  });
};

export const useAddLabelToTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: LabelTaskInput) => labelsApi.addLabelToTask(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['tasks', variables.taskId] });
      toast.success('Label added to task!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to add label to task');
    },
  });
};

export const useRemoveLabelFromTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: LabelTaskInput) => labelsApi.removeLabelFromTask(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['tasks', variables.taskId] });
      toast.success('Label removed from task!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to remove label from task');
    },
  });
};

