import { Download, Trash2, File, Image, FileText, FileSpreadsheet, FileCode, Eye } from 'lucide-react';
import { useState } from 'react';
import { useDeleteAttachment, useDownloadAttachment } from '../../hooks/useAttachments';
import { useConfirm } from '../../contexts/ConfirmContext';
import { FileViewer } from './FileViewer';
import type { Attachment } from '../../api/attachments';
import { formatDistanceToNow } from 'date-fns';

interface AttachmentListProps {
  attachments: Attachment[];
  entityType: 'task' | 'project';
  canDelete?: boolean;
}

const getFileIcon = (mimeType: string) => {
  if (mimeType.startsWith('image/')) {
    return <Image className="h-5 w-5 text-blue-500" />;
  }
  if (mimeType.includes('pdf')) {
    return <FileText className="h-5 w-5 text-red-500" />;
  }
  if (mimeType.includes('spreadsheet') || mimeType.includes('excel') || mimeType.includes('csv')) {
    return <FileSpreadsheet className="h-5 w-5 text-green-500" />;
  }
  if (mimeType.includes('text') || mimeType.includes('code')) {
    return <FileCode className="h-5 w-5 text-gray-500" />;
  }
  return <File className="h-5 w-5 text-gray-400" />;
};

const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
};

export const AttachmentList = ({ attachments, canDelete = true }: AttachmentListProps) => {
  const [viewingAttachment, setViewingAttachment] = useState<Attachment | null>(null);
  const deleteAttachment = useDeleteAttachment();
  const downloadAttachment = useDownloadAttachment();
  const { confirm } = useConfirm();

  const handleDelete = async (attachment: Attachment) => {
    const confirmed = await confirm({
      title: 'Delete Attachment',
      message: `Are you sure you want to delete "${attachment.originalName}"? This action cannot be undone.`,
      confirmText: 'Delete',
      cancelText: 'Cancel',
      variant: 'danger',
    });

    if (confirmed) {
      await deleteAttachment.mutateAsync(attachment.id);
    }
  };

  const handleDownload = async (attachment: Attachment) => {
    await downloadAttachment.mutateAsync({
      attachmentId: attachment.id,
      filename: attachment.originalName,
    });
  };

  if (attachments.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        <File className="h-12 w-12 mx-auto mb-2 opacity-50" />
        <p className="text-sm">No attachments yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {attachments.map((attachment) => (
        <div
          key={attachment.id}
          className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <div className="flex items-center gap-3 flex-1 min-w-0">
            {getFileIcon(attachment.mimeType)}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                {attachment.originalName}
              </p>
              <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400 mt-1">
                <span>{formatFileSize(attachment.size)}</span>
                <span>•</span>
                <span>Uploaded by {attachment.uploadedBy.name}</span>
                <span>•</span>
                <span>{formatDistanceToNow(new Date(attachment.createdAt), { addSuffix: true })}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewingAttachment(attachment)}
              className="p-2 text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors"
              title="View"
            >
              <Eye className="h-4 w-4" />
            </button>
            <button
              onClick={() => handleDownload(attachment)}
              disabled={downloadAttachment.isPending}
              className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors disabled:opacity-50"
              title="Download"
            >
              <Download className="h-4 w-4" />
            </button>
            {canDelete && (
              <button
                onClick={() => handleDelete(attachment)}
                disabled={deleteAttachment.isPending}
                className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors disabled:opacity-50"
                title="Delete"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      ))}
      
      {/* File Viewer Modal */}
      <FileViewer
        attachment={viewingAttachment}
        isOpen={!!viewingAttachment}
        onClose={() => setViewingAttachment(null)}
      />
    </div>
  );
};

