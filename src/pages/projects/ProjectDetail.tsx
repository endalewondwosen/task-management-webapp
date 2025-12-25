import { useParams, Link, useNavigate } from 'react-router-dom';
import { useProject, useDeleteProject, useUpdateProject } from '../../hooks/useProjects';
import { ActivityLog } from '../../components/ActivityLog';
import { FileUpload, AttachmentList } from '../../components/attachments';
import { useProjectAttachments, useUploadProjectAttachment } from '../../hooks/useAttachments';
import { ArrowLeft, Edit, Trash2, Calendar, User, Activity, Paperclip } from 'lucide-react';
import { useState } from 'react';

export const ProjectDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: project, isLoading, error } = useProject(id || '');
  const deleteProject = useDeleteProject();
  const updateProject = useUpdateProject();
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const { data: attachments, isLoading: attachmentsLoading } = useProjectAttachments(id || '');
  const uploadAttachment = useUploadProjectAttachment();

  const handleDelete = async () => {
    if (!project || !window.confirm('Are you sure you want to delete this project? This will also delete all associated tasks.')) {
      return;
    }
    try {
      await deleteProject.mutateAsync(project.id);
      navigate('/projects');
    } catch (error) {
      console.error('Failed to delete project:', error);
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    if (!project || isUpdatingStatus) return;
    setIsUpdatingStatus(true);
    try {
      await updateProject.mutateAsync({
        id: project.id,
        data: { status: newStatus as any },
      });
    } catch (error) {
      console.error('Failed to update project status:', error);
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center transition-colors">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading project...</p>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center transition-colors">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400 mb-4">Project not found</p>
          <Link to="/projects" className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300">
            Back to Projects
          </Link>
        </div>
      </div>
    );
  }

  const statusOptions = ['ACTIVE', 'ON_HOLD', 'COMPLETED', 'CANCELLED'];

  return (
    <div className="max-w-4xl mx-auto">
      {/* Page Header */}
      <div className="flex items-center justify-between mb-6">
        <Link
          to="/projects"
          className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
        >
          <ArrowLeft className="h-5 w-5" />
          Back to Projects
        </Link>
        <div className="flex items-center gap-2">
          <Link
            to={`/projects/${project.id}/edit`}
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
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">{project.name}</h1>

          {/* Status */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Status
            </label>
            <select
              value={project.status}
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

          {/* Description */}
          {project.description && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Description</h2>
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{project.description}</p>
            </div>
          )}

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {project.startDate && (
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Start Date</p>
                  <p className="text-gray-900 dark:text-gray-100">
                    {new Date(project.startDate).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
              </div>
            )}

            {project.endDate && (
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">End Date</p>
                  <p className="text-gray-900 dark:text-gray-100">
                    {new Date(project.endDate).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
              </div>
            )}

            {project.createdBy && (
              <div className="flex items-center gap-3">
                <User className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Created By</p>
                  <p className="text-gray-900 dark:text-gray-100">{project.createdBy.name}</p>
                </div>
              </div>
            )}
          </div>

          {/* Timestamps */}
          <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              <p>Created: {new Date(project.createdAt).toLocaleString()}</p>
              <p>Last updated: {new Date(project.updatedAt).toLocaleString()}</p>
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
                    await uploadAttachment.mutateAsync({ projectId: id, file });
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
              <AttachmentList attachments={attachments || []} entityType="project" />
            )}
          </div>
        </div>

        {/* Activity Log Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 transition-colors mt-6">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="h-5 w-5 text-gray-500 dark:text-gray-400" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Activity Log</h2>
          </div>
          
          {project?.id ? (
            <ActivityLog entityType="project" entityId={project.id} limit={20} />
          ) : (
            <p className="text-gray-500 dark:text-gray-400">Loading activity...</p>
          )}
        </div>
    </div>
  );
};

