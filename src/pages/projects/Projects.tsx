import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useProjects, useDeleteProject } from '../../hooks/useProjects';
// import type { ProjectStatus } from '../../types'; // Reserved for future use
import { Plus, Search, Edit, Trash2, Eye } from 'lucide-react';
import { SkeletonList } from '../../components/Skeleton';
import { ErrorDisplay } from '../../components/ErrorDisplay';
import { useQueryClient } from '@tanstack/react-query';
import { ExportButton } from '../../components/ExportButton';
import { useAuth } from '../../contexts/AuthContext';
import { useConfirm } from '../../contexts/ConfirmContext';

export const Projects = () => {
  const { user } = useAuth();
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');

  const { data, isLoading, error, refetch } = useProjects({
    page,
    limit,
  });

  const deleteProject = useDeleteProject();
  const queryClient = useQueryClient();
  const { confirm } = useConfirm();

  const handleDelete = async (id: string) => {
    const confirmed = await confirm({
      title: 'Delete Project',
      message: 'Are you sure you want to delete this project? This will also delete all associated tasks. This action cannot be undone.',
      confirmText: 'Delete',
      cancelText: 'Cancel',
      variant: 'danger',
    });

    if (confirmed) {
      try {
        await deleteProject.mutateAsync(id);
      } catch (error) {
        console.error('Failed to delete project:', error);
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Projects</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">Manage your projects</p>
        </div>
        <div className="flex items-center gap-3">
          <ExportButton
            type="projects"
            filters={{
              userId: user?.id,
            }}
          />
          <Link
            to="/projects/new"
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-md hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
          >
            <Plus className="h-4 w-4" />
            New Project
          </Link>
        </div>
      </div>
        {/* Search */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow mb-6 p-4 transition-colors">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(1);
              }}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-md focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
          </div>
        </div>

        {/* Projects List */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow transition-colors">
          {isLoading ? (
            <SkeletonList count={5} />
          ) : error ? (
            <div className="p-8">
              <ErrorDisplay
                error={error}
                onRetry={() => {
                  queryClient.invalidateQueries({ queryKey: ['projects'] });
                  refetch();
                }}
              />
            </div>
          ) : !data?.data.length ? (
            <div className="p-8 text-center">
              <p className="text-gray-600 dark:text-gray-400">No projects found.</p>
              <Link
                to="/projects/new"
                className="mt-4 inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
              >
                <Plus className="h-4 w-4" />
                Create your first project
              </Link>
            </div>
          ) : (
            <>
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {data.data
                  .filter((project) =>
                    searchQuery
                      ? project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        project.description?.toLowerCase().includes(searchQuery.toLowerCase())
                      : true
                  )
                  .map((project) => (
                    <div key={project.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <Link
                              to={`/projects/${project.id}`}
                              className="text-lg font-semibold text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400"
                            >
                              {project.name}
                            </Link>
                            <span
                              className={`px-2 py-1 text-xs font-medium rounded ${
                                project.status === 'ACTIVE'
                                  ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                                  : project.status === 'COMPLETED'
                                  ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200'
                                  : project.status === 'ON_HOLD'
                                  ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200'
                                  : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                              }`}
                            >
                              {project.status}
                            </span>
                          </div>
                          {project.description && (
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
                              {project.description}
                            </p>
                          )}
                          <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                            {project.createdBy && (
                              <span>Created by: {project.createdBy.name}</span>
                            )}
                            {project.startDate && (
                              <span>
                                Start: {new Date(project.startDate).toLocaleDateString()}
                              </span>
                            )}
                            {project.endDate && (
                              <span>
                                End: {new Date(project.endDate).toLocaleDateString()}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 ml-4">
                          <Link
                            to={`/projects/${project.id}`}
                            className="p-2 text-gray-400 dark:text-gray-500 hover:text-blue-600 dark:hover:text-blue-400"
                            title="View"
                          >
                            <Eye className="h-5 w-5" />
                          </Link>
                          <Link
                            to={`/projects/${project.id}/edit`}
                            className="p-2 text-gray-400 dark:text-gray-500 hover:text-blue-600 dark:hover:text-blue-400"
                            title="Edit"
                          >
                            <Edit className="h-5 w-5" />
                          </Link>
                          <button
                            onClick={() => handleDelete(project.id)}
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
                    {Math.min(page * limit, data.meta.total)} of {data.meta.total} projects
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

