import { useMutation } from '@tanstack/react-query';
import { exportApi, type ExportFilters } from '../api/export';
import { saveAs } from 'file-saver';
import { toast } from 'react-hot-toast';

export const useExportTasksExcel = () => {
  return useMutation({
    mutationFn: (filters?: ExportFilters) => exportApi.exportTasksExcel(filters),
    onSuccess: (blob) => {
      const filename = `tasks_export_${new Date().toISOString().split('T')[0]}.xlsx`;
      saveAs(blob, filename);
      toast.success('Tasks exported to Excel successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to export tasks');
    },
  });
};

export const useExportTasksCSV = () => {
  return useMutation({
    mutationFn: (filters?: ExportFilters) => exportApi.exportTasksCSV(filters),
    onSuccess: (blob) => {
      const filename = `tasks_export_${new Date().toISOString().split('T')[0]}.csv`;
      saveAs(blob, filename);
      toast.success('Tasks exported to CSV successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to export tasks');
    },
  });
};

export const useExportProjectsPDF = () => {
  return useMutation({
    mutationFn: (filters?: ExportFilters) => exportApi.exportProjectsPDF(filters),
    onSuccess: (blob) => {
      const filename = `projects_export_${new Date().toISOString().split('T')[0]}.pdf`;
      saveAs(blob, filename);
      toast.success('Projects exported to PDF successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to export projects');
    },
  });
};

