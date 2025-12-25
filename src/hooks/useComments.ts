import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { commentsApi } from '../api/comments';
import type { CreateCommentInput, UpdateCommentInput } from '../types';
import toast from 'react-hot-toast';

export const useTaskComments = (taskId: string | null | undefined) => {
  return useQuery({
    queryKey: ['comments', 'task', taskId],
    queryFn: async () => {
      if (!taskId) {
        console.warn('useTaskComments: taskId is missing');
        return [];
      }
      try {
        const result = await commentsApi.getTaskComments(taskId);
        console.log('Comments loaded:', result);
        return result || [];
      } catch (error) {
        console.error('Error fetching comments:', error);
        throw error;
      }
    },
    enabled: !!taskId,
    retry: 1,
  });
};

export const useComment = (id: string | null | undefined) => {
  return useQuery({
    queryKey: ['comments', id],
    queryFn: () => {
      if (!id) {
        throw new Error('Comment ID is required');
      }
      return commentsApi.getComment(id);
    },
    enabled: !!id,
  });
};

export const useCreateComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCommentInput) => commentsApi.createComment(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['comments', 'task', variables.taskId] });
      toast.success('Comment added successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to add comment');
    },
  });
};

export const useUpdateComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCommentInput }) =>
      commentsApi.updateComment(id, data),
    onSuccess: (comment) => {
      queryClient.invalidateQueries({ queryKey: ['comments', comment.id] });
      queryClient.invalidateQueries({ queryKey: ['comments', 'task', comment.taskId] });
      toast.success('Comment updated successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update comment');
    },
  });
};

export const useDeleteComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => commentsApi.deleteComment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments'] });
      toast.success('Comment deleted successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete comment');
    },
  });
};

