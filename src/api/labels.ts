import { api } from '../lib/api';
import type { Label, CreateLabelInput, UpdateLabelInput, LabelTaskInput } from '../types';

export const labelsApi = {
  // Get all labels
  getAllLabels: async (): Promise<Label[]> => {
    const response = await api.get<Label[]>('/labels');
    return response.data || [];
  },

  // Get a single label
  getLabel: async (id: string): Promise<Label> => {
    if (!id) {
      throw new Error('Label ID is required');
    }
    const response = await api.get<Label>(`/labels/${id}`);
    return response.data;
  },

  // Create a label
  createLabel: async (data: CreateLabelInput): Promise<Label> => {
    if (!data?.name?.trim()) {
      throw new Error('Label name is required');
    }
    const response = await api.post<Label>('/labels', {
      name: data.name.trim(),
      color: data.color || '#808080',
    });
    return response.data;
  },

  // Update a label
  updateLabel: async (id: string, data: UpdateLabelInput): Promise<Label> => {
    if (!id) {
      throw new Error('Label ID is required');
    }
    const response = await api.patch<Label>(`/labels/${id}`, data);
    return response.data;
  },

  // Delete a label
  deleteLabel: async (id: string): Promise<void> => {
    if (!id) {
      throw new Error('Label ID is required');
    }
    await api.delete(`/labels/${id}`);
  },

  // Add label to task
  addLabelToTask: async (data: LabelTaskInput): Promise<void> => {
    if (!data?.labelId) {
      throw new Error('Label ID is required');
    }
    if (!data?.taskId) {
      throw new Error('Task ID is required');
    }
    await api.post('/labels/add-to-task', data);
  },

  // Remove label from task
  removeLabelFromTask: async (data: LabelTaskInput): Promise<void> => {
    if (!data?.labelId) {
      throw new Error('Label ID is required');
    }
    if (!data?.taskId) {
      throw new Error('Task ID is required');
    }
    await api.post('/labels/remove-from-task', data);
  },
};

