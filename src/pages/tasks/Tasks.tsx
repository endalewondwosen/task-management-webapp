import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useTasks, useDeleteTask } from '../../hooks/useTasks';
import type { TaskStatus } from '../../types';
import { Plus, Search, Edit, Trash2, Eye } from 'lucide-react';
import { SkeletonList } from '../../components/Skeleton';
import { ErrorDisplay } from '../../components/ErrorDisplay';
import { useQueryClient } from '@tanstack/react-query';
import { ExportButton } from '../../components/ExportButton';
import { useAuth } from '../../contexts/AuthContext';
import { useConfirm } from '../../contexts/ConfirmContext';

export const Tasks = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [statusFilter, setStatusFilter] = useState<TaskStatus | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');

  // Update search query when URL param changes
  useEffect(() => {
    const urlSearch = searchParams.get('search');
    if (urlSearch) {
      setSearchQuery(urlSearch);
      setPage(1); // Reset to first page when search changes
    }
  }, [searchParams]);

  const { data, isLoading, error, refetch } = useTasks({
    page,
    limit,
    status: statusFilter !== 'ALL' ? statusFilter : undefined,
    search: searchQuery || undefined,
  });

  const deleteTask = useDeleteTask();
  const queryClient = useQueryClient();
  const { confirm } = useConfirm();

  const handleDelete = async (id: string) => {
    const confirmed = await confirm({
      title: 'Delete Task',
      message: 'Are you sure you want to delete this task? This action cannot be undone.',
      confirmText: 'Delete',
      cancelText: 'Cancel',
      variant: 'danger',
    });

    if (confirmed) {
      try {
        await deleteTask.mutateAsync(id);
      } catch (error) {
        console.error('Failed to delete task:', error);
      }
    }
  };

  const handleStatusChange = (newStatus: TaskStatus | 'ALL') => {
    setStatusFilter(newStatus);
    setPage(1); // Reset to first page when filter changes
  };

  const statusOptions: (TaskStatus | 'ALL')[] = ['ALL', 'TODO', 'IN_PROGRESS', 'IN_REVIEW', 'DONE', 'CANCELLED'];

  return (
    <div className="max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Tasks</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">Manage and track your tasks</p>
        </div>
        <div className="flex items-center gap-3">
          <ExportButton
            type="tasks"
            filters={{
              userId: user?.id,
              status: statusFilter !== 'ALL' ? statusFilter : undefined,
            }}
          />
          <Link
            to="/tasks/new"
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-md hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
          >
            <Plus className="h-4 w-4" />
            New Task
          </Link>
        </div>
      </div>
        {/* Filters and Search */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow mb-6 p-4 transition-colors">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
                <input
                  type="text"
                  placeholder="Search tasks..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setPage(1);
                  }}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-md focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div className="flex gap-2 flex-wrap">
              {statusOptions.map((status) => (
                <button
                  key={status}
                  onClick={() => handleStatusChange(status)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    statusFilter === status
                      ? 'bg-blue-600 dark:bg-blue-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Tasks List */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow transition-colors">
          {isLoading ? (
            <SkeletonList count={5} />
          ) : error ? (
            <div className="p-8">
              <ErrorDisplay
                error={error}
                onRetry={() => {
                  queryClient.invalidateQueries({ queryKey: ['tasks'] });
                  refetch();
                }}
              />
            </div>
          ) : !data?.data.length ? (
            <div className="p-8 text-center">
              <p className="text-gray-600 dark:text-gray-400">No tasks found.</p>
              <Link
                to="/tasks/new"
                className="mt-4 inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
              >
                <Plus className="h-4 w-4" />
                Create your first task
              </Link>
            </div>
          ) : (
            <>
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {data.data.map((task) => (
                  <div
                    key={task.id}
                    className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <Link
                            to={`/tasks/${task.id}`}
                            className="text-lg font-semibold text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400"
                          >
                            {task.title}
                          </Link>
                          <span
                            className={`px-2 py-1 text-xs font-medium rounded ${
                              task.status === 'DONE'
                                ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                                : task.status === 'IN_PROGRESS'
                                ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200'
                                : task.status === 'IN_REVIEW'
                                ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200'
                                : task.status === 'CANCELLED'
                                ? 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
                                : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                            }`}
                          >
                            {task.status}
                          </span>
                          <span
                            className={`px-2 py-1 text-xs font-medium rounded ${
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
                        {task.description && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
                            {task.description}
                          </p>
                        )}
                        <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                          {task.assignee && (
                            <span>Assigned to: {task.assignee.name}</span>
                          )}
                          {task.dueDate && (
                            <span>
                              Due: {new Date(task.dueDate).toLocaleDateString()}
                            </span>
                          )}
                          {task.project && (
                            <span>Project: {task.project.name}</span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <Link
                          to={`/tasks/${task.id}`}
                          className="p-2 text-gray-400 dark:text-gray-500 hover:text-blue-600 dark:hover:text-blue-400"
                          title="View"
                        >
                          <Eye className="h-5 w-5" />
                        </Link>
                        <Link
                          to={`/tasks/${task.id}/edit`}
                          className="p-2 text-gray-400 dark:text-gray-500 hover:text-blue-600 dark:hover:text-blue-400"
                          title="Edit"
                        >
                          <Edit className="h-5 w-5" />
                        </Link>
                        <button
                          onClick={() => handleDelete(task.id)}
                          className="p-2 text-gray-400 dark:text-gray-500 hover:text-red-600 dark:hover:text-red-400"
                          title="Delete"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {data.meta.totalPages > 1 && (
                <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
                  <div className="text-sm text-gray-700 dark:text-gray-300">
                    Showing {((page - 1) * limit) + 1} to{' '}
                    {Math.min(page * limit, data.meta.total)} of {data.meta.total} tasks
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={!data.meta.hasPreviousPage}
                      className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => setPage((p) => p + 1)}
                      disabled={!data.meta.hasNextPage}
                      className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
    </div>
  );
};

