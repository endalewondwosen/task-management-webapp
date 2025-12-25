import { useMyActivityHistory } from '../../hooks/useActivity';
import { formatDistanceToNow } from 'date-fns';
import { Activity, Plus, Minus, Edit, Trash2, Clock, Filter, RefreshCw } from 'lucide-react';
import { Skeleton } from '../../components/Skeleton';
import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';

export const UserActivityHistory = () => {
  const [limit, setLimit] = useState(50);
  const [offset, setOffset] = useState(0);
  const [actionFilter, setActionFilter] = useState<string>('all');
  const [entityTypeFilter, setEntityTypeFilter] = useState<string>('all');
  const queryClient = useQueryClient();

  const { data, isLoading, error, refetch } = useMyActivityHistory(limit, offset);

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'CREATE':
        return <Plus className="h-4 w-4 text-green-600 dark:text-green-400" />;
      case 'UPDATE':
        return <Edit className="h-4 w-4 text-blue-600 dark:text-blue-400" />;
      case 'DELETE':
        return <Trash2 className="h-4 w-4 text-red-600 dark:text-red-400" />;
      default:
        return <Activity className="h-4 w-4 text-gray-600 dark:text-gray-400" />;
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'CREATE':
        return 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200';
      case 'UPDATE':
        return 'bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200';
      case 'DELETE':
        return 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200';
      default:
        return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200';
    }
  };

  const filteredActivities = data?.data.filter((activity) => {
    if (actionFilter !== 'all' && activity.action !== actionFilter) return false;
    if (entityTypeFilter !== 'all' && activity.entityType !== entityTypeFilter) return false;
    return true;
  });

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ['activities', 'me'] });
    refetch();
  };

  if (isLoading && !data) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-start gap-3 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <Skeleton variant="circular" width={32} height={32} />
              <div className="flex-1 space-y-2">
                <Skeleton variant="text" width="60%" height={16} />
                <Skeleton variant="text" width="40%" height={14} />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <p className="text-red-800 dark:text-red-200">Failed to load activity history. Please try again.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">My Activity History</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Track all your actions and changes in the system
          </p>
        </div>
        <button
          onClick={handleRefresh}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-md hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-6">
        <div className="flex items-center gap-4">
          <Filter className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Action
              </label>
              <select
                value={actionFilter}
                onChange={(e) => setActionFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-md focus:ring-blue-500 focus:border-blue-500 transition-colors"
              >
                <option value="all">All Actions</option>
                <option value="CREATE">Create</option>
                <option value="UPDATE">Update</option>
                <option value="DELETE">Delete</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Entity Type
              </label>
              <select
                value={entityTypeFilter}
                onChange={(e) => setEntityTypeFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-md focus:ring-blue-500 focus:border-blue-500 transition-colors"
              >
                <option value="all">All Types</option>
                <option value="task">Tasks</option>
                <option value="project">Projects</option>
                <option value="user">Users</option>
                <option value="comment">Comments</option>
                <option value="label">Labels</option>
                <option value="role">Roles</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      {data && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Activities</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{data.total}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Showing</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {filteredActivities?.length || 0}
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Page</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {Math.floor(offset / limit) + 1}
            </p>
          </div>
        </div>
      )}

      {/* Activity List */}
      {!filteredActivities || filteredActivities.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow">
          <Activity className="h-16 w-16 mx-auto mb-4 text-gray-400 dark:text-gray-500" />
          <p className="text-gray-600 dark:text-gray-400 text-lg">No activities found</p>
          <p className="text-gray-500 dark:text-gray-500 text-sm mt-2">
            {actionFilter !== 'all' || entityTypeFilter !== 'all'
              ? 'Try adjusting your filters'
              : 'Your activity history will appear here'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredActivities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-start gap-3 p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors bg-white dark:bg-gray-800"
            >
              <div className={`p-2 rounded-full ${getActionColor(activity.action)}`}>
                {getActionIcon(activity.action)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {activity.description || `${activity.action} ${activity.entityType}`}
                    </p>
                    {activity.entityName && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {activity.entityType}: {activity.entityName}
                      </p>
                    )}
                  </div>
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded whitespace-nowrap ${getActionColor(
                      activity.action
                    )}`}
                  >
                    {activity.action}
                  </span>
                </div>

                {/* Show changes if available */}
                {activity.changes && Object.keys(activity.changes).length > 0 && (
                  <div className="mt-2 space-y-1">
                    {Object.entries(activity.changes).slice(0, 3).map(([field, change]) => (
                      <div key={field} className="text-xs text-gray-600 dark:text-gray-400">
                        <span className="font-medium">{field}:</span>{' '}
                        <span className="line-through text-red-600 dark:text-red-400">
                          {String(change.old || 'N/A')}
                        </span>
                        {' → '}
                        <span className="text-green-600 dark:text-green-400">
                          {String(change.new || 'N/A')}
                        </span>
                      </div>
                    ))}
                    {Object.keys(activity.changes).length > 3 && (
                      <p className="text-xs text-gray-500 dark:text-gray-500">
                        +{Object.keys(activity.changes).length - 3} more changes
                      </p>
                    )}
                  </div>
                )}

                <div className="flex items-center gap-4 mt-2 text-xs text-gray-500 dark:text-gray-400">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>{formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true })}</span>
                  </div>
                  <span className="capitalize">{activity.entityType}</span>
                  {activity.ipAddress && (
                    <span className="text-gray-400 dark:text-gray-500">IP: {activity.ipAddress}</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {data && data.total > limit && (
        <div className="flex items-center justify-between mt-6">
          <button
            onClick={() => setOffset(Math.max(0, offset - limit))}
            disabled={offset === 0}
            className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Previous
          </button>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Showing {offset + 1} - {Math.min(offset + limit, data.total)} of {data.total}
          </span>
          <button
            onClick={() => setOffset(offset + limit)}
            disabled={offset + limit >= data.total}
            className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

