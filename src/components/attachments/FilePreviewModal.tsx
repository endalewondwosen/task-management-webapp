import { X } from 'lucide-react';
import { useEffect, useState } from 'react';

interface FilePreviewModalProps {
  file: File | null;
  isOpen: boolean;
  onClose: () => void;
}

export const FilePreviewModal = ({ file, isOpen, onClose }: FilePreviewModalProps) => {
  const [fileUrl, setFileUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen || !file) {
      setFileUrl(null);
      return;
    }

    // Create object URL from File object
    const url = URL.createObjectURL(file);
    setFileUrl(url);

    // Cleanup on unmount
    return () => {
      URL.revokeObjectURL(url);
    };
  }, [isOpen, file]);

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen || !file) return null;

  const isImage = file.type.startsWith('image/');
  const isPDF = file.type.includes('pdf');

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 dark:bg-black/90"
      onClick={onClose}
    >
      <div
        className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 truncate">
              {file.name}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {file.type || 'Unknown type'} • {formatFileSize(file.size)}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors ml-4"
            title="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-4">
          {isImage && fileUrl ? (
            <div className="flex items-center justify-center h-full">
              <img
                src={fileUrl}
                alt={file.name}
                className="max-w-full max-h-[70vh] object-contain rounded-lg"
              />
            </div>
          ) : isPDF && fileUrl ? (
            <div className="w-full h-full">
              <iframe
                src={fileUrl}
                className="w-full h-[70vh] border border-gray-200 dark:border-gray-700 rounded-lg"
                title={file.name}
              />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Preview not available for this file type
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-500 mb-4">
                {file.type || 'Unknown file type'}
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500">
                You can upload this file and view it after upload
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

