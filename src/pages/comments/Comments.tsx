import { useState } from 'react';
import { useTasks } from '../../hooks/useTasks';
import { useTaskComments } from '../../hooks/useComments';
import { MessageSquare, Search, Eye, Link as LinkIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SkeletonList } from '../../components/Skeleton';

export const Comments = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const { data: tasksData, isLoading: tasksLoading } = useTasks({ page: 1, limit: 100 });

  // Get all comments from all tasks
  // const allComments: Array<{ comment: any; task: any }> = []; // Reserved for future use
  
  if (tasksData?.data) {
    tasksData.data.forEach((task) => {
      if (task?.id) {
        // We'll fetch comments for each task
        // For now, we'll show a message that comments are task-specific
      }
    });
  }

  const filteredTasks = tasksData?.data?.filter((task) =>
    task?.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    task?.description?.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  return (
    <div className="max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Comments</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          View and manage comments across all tasks
        </p>
      </div>

      {/* Search */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow mb-6 p-4 transition-colors">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
          <input
            type="text"
            placeholder="Search tasks to view their comments..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-md focus:ring-blue-500 focus:border-blue-500 transition-colors"
          />
        </div>
      </div>

      {/* Info Message */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
        <div className="flex items-start gap-3">
          <MessageSquare className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
          <div>
            <p className="text-sm text-blue-800 dark:text-blue-300 font-medium">
              Comments are task-specific
            </p>
            <p className="text-sm text-blue-700 dark:text-blue-400 mt-1">
              Click on any task below to view and manage its comments on the task detail page.
            </p>
          </div>
        </div>
      </div>

      {/* Tasks List with Comment Counts */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow transition-colors">
        {tasksLoading ? (
          <SkeletonList count={5} />
        ) : !filteredTasks.length ? (
          <div className="p-8 text-center">
            <MessageSquare className="h-12 w-12 mx-auto mb-2 text-gray-400 dark:text-gray-500" />
            <p className="text-gray-600 dark:text-gray-400">
              {searchQuery ? 'No tasks found matching your search.' : 'No tasks found.'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredTasks.map((task) => {
              if (!task?.id) return null;
              
              return (
                <TaskCommentCard key={task.id} taskId={task.id} task={task} />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

interface TaskCommentCardProps {
  taskId: string;
  task: any;
}

const TaskCommentCard = ({ taskId, task }: TaskCommentCardProps) => {
  const { data: comments, isLoading } = useTaskComments(taskId);
  const commentCount = comments?.length || 0;

  return (
    <div className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <Link
              to={`/tasks/${taskId}`}
              className="text-lg font-semibold text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400"
            >
              {task?.title || 'Untitled Task'}
            </Link>
            <span className="px-2 py-1 text-xs font-medium rounded bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
              {isLoading ? '...' : `${commentCount} comment${commentCount !== 1 ? 's' : ''}`}
            </span>
          </div>
          {task?.description && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
              {task.description}
            </p>
          )}
          {commentCount > 0 && comments && (
            <div className="mt-3 space-y-2">
              {comments.slice(0, 2).map((comment: any) => {
                if (!comment?.id) return null;
                return (
                  <div
                    key={comment.id}
                    className="text-sm bg-gray-50 dark:bg-gray-700/50 rounded p-2 border-l-2 border-blue-500"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                        {comment.createdBy?.name || 'Unknown'}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {comment.createdAt
                          ? new Date(comment.createdAt).toLocaleDateString()
                          : ''}
                      </span>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 line-clamp-2">
                      {comment.content || 'No content'}
                    </p>
                  </div>
                );
              })}
              {commentCount > 2 && (
                <Link
                  to={`/tasks/${taskId}`}
                  className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                >
                  View all {commentCount} comments
                  <LinkIcon className="h-3 w-3" />
                </Link>
              )}
            </div>
          )}
        </div>
        <Link
          to={`/tasks/${taskId}`}
          className="ml-4 p-2 text-gray-400 dark:text-gray-500 hover:text-blue-600 dark:hover:text-blue-400"
          title="View Task"
        >
          <Eye className="h-5 w-5" />
        </Link>
      </div>
    </div>
  );
};

