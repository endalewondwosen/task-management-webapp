import { api } from '../lib/api';

export interface Attachment {
  id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  storagePath: string;
  entityType: 'task' | 'project';
  entityId: string;
  uploadedBy: {
    id: string;
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

export const attachmentsApi = {
  /**
   * Upload file to task
   */
  uploadTaskAttachment: async (taskId: string, file: File): Promise<Attachment> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post<Attachment>(`/tasks/${taskId}/attachments`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  /**
   * Upload file to project
   */
  uploadProjectAttachment: async (projectId: string, file: File): Promise<Attachment> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post<Attachment>(`/projects/${projectId}/attachments`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  /**
   * Get all attachments for a task
   */
  getTaskAttachments: async (taskId: string): Promise<Attachment[]> => {
    const response = await api.get<Attachment[]>(`/tasks/${taskId}/attachments`);
    return response.data;
  },

  /**
   * Get all attachments for a project
   */
  getProjectAttachments: async (projectId: string): Promise<Attachment[]> => {
    const response = await api.get<Attachment[]>(`/projects/${projectId}/attachments`);
    return response.data;
  },

  /**
   * Download attachment
   */
  downloadAttachment: async (attachmentId: string, filename: string): Promise<void> => {
    const response = await api.get(`/attachments/${attachmentId}/download`, {
      responseType: 'blob',
    });

    // Create blob URL and trigger download
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  },

  /**
   * Delete attachment
   */
  deleteAttachment: async (attachmentId: string): Promise<void> => {
    await api.delete(`/attachments/${attachmentId}`);
  },
};

