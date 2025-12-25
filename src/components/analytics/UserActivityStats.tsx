import { useUserActivityStats } from '../../hooks/useAnalytics';
import { Users, CheckSquare, FolderKanban, Activity } from 'lucide-react';
import { Skeleton } from '../Skeleton';
import { formatDistanceToNow } from 'date-fns';

export const UserActivityStats = ({ userId }: { userId?: string }) => {
  const { data, isLoading } = useUserActivityStats(userId);

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <Skeleton variant="rectangular" width="100%" height={400} />
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 transition-colors">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6">User Activity Statistics</h3>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <div className="flex items-center gap-3">
            <Users className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            <div>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{data.totalUsers}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Users</p>
            </div>
          </div>
        </div>

        <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
          <div className="flex items-center gap-3">
            <Activity className="h-8 w-8 text-green-600 dark:text-green-400" />
            <div>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">{data.activeUsers}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Active Users</p>
            </div>
          </div>
        </div>

        <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
          <div className="flex items-center gap-3">
            <CheckSquare className="h-8 w-8 text-purple-600 dark:text-purple-400" />
            <div>
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{data.tasksCreated}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Tasks Created</p>
            </div>
          </div>
        </div>

        <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
          <div className="flex items-center gap-3">
            <FolderKanban className="h-8 w-8 text-orange-600 dark:text-orange-400" />
            <div>
              <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">{data.projectsCreated}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Projects Created</p>
            </div>
          </div>
        </div>
      </div>

      {/* Activity Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Tasks Completed</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">{data.tasksCompleted}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {data.tasksCreated > 0 
              ? `${((data.tasksCompleted / data.tasksCreated) * 100).toFixed(1)}% completion rate`
              : 'No tasks created yet'
            }
          </p>
        </div>

        <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Active Rate</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            {data.totalUsers > 0 
              ? `${((data.activeUsers / data.totalUsers) * 100).toFixed(1)}%`
              : '0%'
            }
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Users active in last 30 days
          </p>
        </div>
      </div>

      {/* Recent Activity */}
      {data.recentActivity.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">Recent Activity</h4>
          <div className="space-y-3">
            {data.recentActivity.slice(0, 5).map((activity) => (
              <div
                key={activity.userId}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
              >
                <div className="flex-1">
                  <p className="font-medium text-gray-900 dark:text-gray-100">{activity.userName}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{activity.userEmail}</p>
                </div>
                <div className="text-right">
                  <div className="flex gap-4 text-sm">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-gray-100">{activity.tasksCreated}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Created</p>
                    </div>
                    <div>
                      <p className="font-medium text-green-600 dark:text-green-400">{activity.tasksCompleted}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Completed</p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {formatDistanceToNow(new Date(activity.lastActivity), { addSuffix: true })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

