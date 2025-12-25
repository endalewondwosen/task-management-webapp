import { useParams, Link, useNavigate } from 'react-router-dom';
import { useTask, useDeleteTask, useUpdateTask } from '../../hooks/useTasks';
import { useProjects } from '../../hooks/useProjects';
import { useUsers } from '../../hooks/useUsers';
import { CommentList, CommentForm } from '../../components/comments';
import { ActivityLog } from '../../components/ActivityLog';
import { ErrorDisplay } from '../../components/ErrorDisplay';
import { FileUpload, AttachmentList } from '../../components/attachments';
import { useTaskAttachments, useUploadTaskAttachment } from '../../hooks/useAttachments';
import { ArrowLeft, Edit, Trash2, Calendar, User, FolderKanban, MessageSquare, Activity, Paperclip } from 'lucide-react';
import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';

export const TaskDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: task, isLoading, error, refetch } = useTask(id || '');
  const { data: projectsData } = useProjects();
  const { data: usersData } = useUsers();
  const deleteTask = useDeleteTask();
  const updateTask = useUpdateTask();
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const queryClient = useQueryClient();
  const { data: attachments, isLoading: attachmentsLoading } = useTaskAttachments(id || '');
  const uploadAttachment = useUploadTaskAttachment();

  const handleDelete = async () => {
    if (!task || !window.confirm('Are you sure you want to delete this task?')) {
      return;
    }
    try {
      await deleteTask.mutateAsync(task.id);
      navigate('/tasks');
    } catch (error) {
      console.error('Failed to delete task:', error);
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    if (!task || isUpdatingStatus) return;
    setIsUpdatingStatus(true);
    try {
      await updateTask.mutateAsync({
        id: task.id,
        data: { status: newStatus as any },
      });
    } catch (error) {
      console.error('Failed to update task status:', error);
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center transition-colors">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading task...</p>
        </div>
      </div>
    );
  }

  if (error || !task) {
    return (
      <div className="max-w-4xl mx-auto p-8">
        <ErrorDisplay
          error={error || new Error('Task not found')}
          title={error ? 'Error Loading Task' : 'Task Not Found'}
          message={error ? undefined : 'The task you are looking for does not exist or has been deleted.'}
          onRetry={() => {
            if (id) {
              queryClient.invalidateQueries({ queryKey: ['tasks', id] });
              refetch();
            }
          }}
          retryLabel="Retry"
        />
        <div className="mt-4 text-center">
          <Link
            to="/tasks"
            className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Tasks
          </Link>
        </div>
      </div>
    );
  }

  const statusOptions = ['TODO', 'IN_PROGRESS', 'IN_REVIEW', 'DONE', 'CANCELLED'];
  const priorityOptions = ['LOW', 'MEDIUM', 'HIGH', 'URGENT'];

  return (
    <div className="max-w-4xl mx-auto">
      {/* Page Header */}
      <div className="flex items-center justify-between mb-6">
        <Link
          to="/tasks"
          className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
        >
          <ArrowLeft className="h-5 w-5" />
          Back to Tasks
        </Link>
        <div className="flex items-center gap-2">
          <Link
            to={`/tasks/${task.id}/edit`}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-md hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
          >
            <Edit className="h-4 w-4" />
            Edit
          </Link>
          <button
            onClick={handleDelete}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 dark:bg-red-500 text-white rounded-md hover:bg-red-700 dark:hover:bg-red-600 transition-colors"
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </button>
        </div>
      </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 transition-colors">
          {/* Title */}
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">{task.title}</h1>

          {/* Status and Priority */}
          <div className="flex gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Status
              </label>
              <select
                value={task.status}
                onChange={(e) => handleStatusChange(e.target.value)}
                disabled={isUpdatingStatus}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-md focus:ring-blue-500 focus:border-blue-500 transition-colors"
              >
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Priority
              </label>
              <span
                className={`inline-block px-3 py-2 rounded-md text-sm font-medium ${
                  task.priority === 'URGENT'
                    ? 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
                    : task.priority === 'HIGH'
                    ? 'bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200'
                    : task.priority === 'MEDIUM'
                    ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                }`}
              >
                {task.priority}
              </span>
            </div>
          </div>

          {/* Description */}
          {task.description && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Description</h2>
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{task.description}</p>
            </div>
          )}

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {task.dueDate && (
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Due Date</p>
                  <p className="text-gray-900 dark:text-gray-100">
                    {new Date(task.dueDate).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
              </div>
            )}

            {task.assignee && (
              <div className="flex items-center gap-3">
                <User className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Assigned To</p>
                  <p className="text-gray-900 dark:text-gray-100">{task.assignee.name}</p>
                </div>
              </div>
            )}

            {task.project && (
              <div className="flex items-center gap-3">
                <FolderKanban className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Project</p>
                  <p className="text-gray-900 dark:text-gray-100">{task.project.name}</p>
                </div>
              </div>
            )}

            {task.createdBy && (
              <div className="flex items-center gap-3">
                <User className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Created By</p>
                  <p className="text-gray-900 dark:text-gray-100">{task.createdBy.name}</p>
                </div>
              </div>
            )}
          </div>

          {/* Timestamps */}
          <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              <p>Created: {new Date(task.createdAt).toLocaleString()}</p>
              <p>Last updated: {new Date(task.updatedAt).toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Attachments Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 transition-colors mt-6">
          <div className="flex items-center gap-2 mb-4">
            <Paperclip className="h-5 w-5 text-gray-500 dark:text-gray-400" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Attachments</h2>
          </div>

          {/* File Upload */}
          <div className="mb-6">
            <FileUpload
              onUpload={async (files) => {
                if (files.length > 0 && id) {
                  // Upload files one by one
                  for (const file of files) {
                    await uploadAttachment.mutateAsync({ taskId: id, file });
                  }
                }
              }}
              maxFiles={20}
              maxSize={10}
              acceptedTypes={[
                'image/*',
                'application/pdf',
                'application/msword',
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                'application/vnd.ms-excel',
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                'text/plain',
                'text/csv',
                'application/zip',
              ]}
              disabled={uploadAttachment.isPending}
            />
          </div>

          {/* Attachments List */}
          <div>
            {attachmentsLoading ? (
              <p className="text-gray-500 dark:text-gray-400">Loading attachments...</p>
            ) : (
              <AttachmentList attachments={attachments || []} entityType="task" />
            )}
          </div>
        </div>

        {/* Comments Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 transition-colors mt-6">
          <div className="flex items-center gap-2 mb-4">
            <MessageSquare className="h-5 w-5 text-gray-500 dark:text-gray-400" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Comments</h2>
          </div>
          
          {/* Comment Form */}
          {task?.id && <CommentForm taskId={task.id} />}
          
          {/* Comments List */}
          <div className="mt-6">
            {task?.id ? (
              <CommentList taskId={task.id} />
            ) : (
              <p className="text-gray-500 dark:text-gray-400">Loading comments...</p>
            )}
          </div>
        </div>

        {/* Activity Log Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 transition-colors mt-6">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="h-5 w-5 text-gray-500 dark:text-gray-400" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Activity Log</h2>
          </div>
          
          {task?.id ? (
            <ActivityLog entityType="task" entityId={task.id} limit={20} />
          ) : (
            <p className="text-gray-500 dark:text-gray-400">Loading activity...</p>
          )}
        </div>
    </div>
  );
};

