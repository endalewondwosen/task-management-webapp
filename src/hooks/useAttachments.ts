import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { attachmentsApi, type Attachment } from '../api/attachments';

const ATTACHMENTS_QUERY_KEY = 'attachments';

export const useTaskAttachments = (taskId: string) => {
  return useQuery({
    queryKey: [ATTACHMENTS_QUERY_KEY, 'task', taskId],
    queryFn: () => attachmentsApi.getTaskAttachments(taskId),
    enabled: !!taskId,
  });
};

export const useProjectAttachments = (projectId: string) => {
  return useQuery({
    queryKey: [ATTACHMENTS_QUERY_KEY, 'project', projectId],
    queryFn: () => attachmentsApi.getProjectAttachments(projectId),
    enabled: !!projectId,
  });
};

export const useUploadTaskAttachment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ taskId, file }: { taskId: string; file: File }) =>
      attachmentsApi.uploadTaskAttachment(taskId, file),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [ATTACHMENTS_QUERY_KEY, 'task', variables.taskId] });
      toast.success('File uploaded successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to upload file');
    },
  });
};

export const useUploadProjectAttachment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ projectId, file }: { projectId: string; file: File }) =>
      attachmentsApi.uploadProjectAttachment(projectId, file),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [ATTACHMENTS_QUERY_KEY, 'project', variables.projectId] });
      toast.success('File uploaded successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to upload file');
    },
  });
};

export const useDeleteAttachment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (attachmentId: string) => attachmentsApi.deleteAttachment(attachmentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ATTACHMENTS_QUERY_KEY] });
      toast.success('File deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete file');
    },
  });
};

export const useDownloadAttachment = () => {
  return useMutation({
    mutationFn: ({ attachmentId, filename }: { attachmentId: string; filename: string }) =>
      attachmentsApi.downloadAttachment(attachmentId, filename),
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to download file');
    },
  });
};

