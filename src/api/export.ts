import { api } from '../lib/api';

export interface ExportFilters {
  userId?: string;
  projectId?: string;
  status?: string;
  priority?: string;
  startDate?: Date;
  endDate?: Date;
}

export const exportApi = {
  /**
   * Export tasks to Excel
   */
  exportTasksExcel: async (filters?: ExportFilters): Promise<Blob> => {
    const params: any = {};
    if (filters?.userId) params.userId = filters.userId;
    if (filters?.projectId) params.projectId = filters.projectId;
    if (filters?.status) params.status = filters.status;
    if (filters?.priority) params.priority = filters.priority;
    if (filters?.startDate) params.startDate = filters.startDate.toISOString();
    if (filters?.endDate) params.endDate = filters.endDate.toISOString();

    const response = await api.get('/export/tasks/excel', {
      params,
      responseType: 'blob',
    });
    return response.data;
  },

  /**
   * Export tasks to CSV
   */
  exportTasksCSV: async (filters?: ExportFilters): Promise<Blob> => {
    const params: any = {};
    if (filters?.userId) params.userId = filters.userId;
    if (filters?.projectId) params.projectId = filters.projectId;
    if (filters?.status) params.status = filters.status;
    if (filters?.priority) params.priority = filters.priority;
    if (filters?.startDate) params.startDate = filters.startDate.toISOString();
    if (filters?.endDate) params.endDate = filters.endDate.toISOString();

    const response = await api.get('/export/tasks/csv', {
      params,
      responseType: 'blob',
    });
    return response.data;
  },

  /**
   * Export projects to PDF
   */
  exportProjectsPDF: async (filters?: ExportFilters): Promise<Blob> => {
    const params: any = {};
    if (filters?.userId) params.userId = filters.userId;
    if (filters?.status) params.status = filters.status;
    if (filters?.startDate) params.startDate = filters.startDate.toISOString();
    if (filters?.endDate) params.endDate = filters.endDate.toISOString();

    const response = await api.get('/export/projects/pdf', {
      params,
      responseType: 'blob',
    });
    return response.data;
  },
};

