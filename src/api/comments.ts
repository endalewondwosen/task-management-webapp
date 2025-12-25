import { api } from '../lib/api';
import type { Comment, CreateCommentInput, UpdateCommentInput } from '../types';

export const commentsApi = {
  // Get all comments for a task
  getTaskComments: async (taskId: string): Promise<Comment[]> => {
    if (!taskId) {
      throw new Error('Task ID is required');
    }
    try {
      const response = await api.get<Comment[]>(`/comments/task/${taskId}`);
      console.log('API Response for comments:', response.data);
      return response.data || [];
    } catch (error: any) {
      console.error('API Error getting comments:', error);
      if (error.response) {
        console.error('Response status:', error.response.status);
        console.error('Response data:', error.response.data);
      }
      throw error;
    }
  },

  // Get a single comment
  getComment: async (id: string): Promise<Comment> => {
    if (!id) {
      throw new Error('Comment ID is required');
    }
    const response = await api.get<Comment>(`/comments/${id}`);
    return response.data;
  },

  // Create a comment
  createComment: async (data: CreateCommentInput): Promise<Comment> => {
    if (!data?.content?.trim()) {
      throw new Error('Comment content is required');
    }
    if (!data?.taskId) {
      throw new Error('Task ID is required');
    }
    const response = await api.post<Comment>('/comments', data);
    return response.data;
  },

  // Update a comment
  updateComment: async (id: string, data: UpdateCommentInput): Promise<Comment> => {
    if (!id) {
      throw new Error('Comment ID is required');
    }
    if (!data?.content?.trim()) {
      throw new Error('Comment content is required');
    }
    const response = await api.patch<Comment>(`/comments/${id}`, data);
    return response.data;
  },

  // Delete a comment
  deleteComment: async (id: string): Promise<void> => {
    if (!id) {
      throw new Error('Comment ID is required');
    }
    await api.delete(`/comments/${id}`);
  },
};

