import { useEntityActivities } from '../hooks/useActivity';
import { formatDistanceToNow } from 'date-fns';
import { Activity, Plus, Edit, Trash2, Clock } from 'lucide-react';
import { Skeleton } from './Skeleton';
import type { EntityType } from '../api/activity';

interface ActivityLogProps {
  entityType: EntityType;
  entityId: string;
  limit?: number;
}

export const ActivityLog = ({ entityType, entityId, limit = 20 }: ActivityLogProps) => {
  const { data, isLoading } = useEntityActivities(entityType, entityId, limit);

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex items-start gap-3 p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
            <Skeleton variant="circular" width={32} height={32} />
            <div className="flex-1 space-y-2">
              <Skeleton variant="text" width="60%" height={16} />
              <Skeleton variant="text" width="40%" height={14} />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!data || data.data.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        <Activity className="h-12 w-12 mx-auto mb-2 opacity-50" />
        <p>No activity recorded yet</p>
      </div>
    );
  }

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

  return (
    <div className="space-y-3">
      {data.data.map((activity) => (
        <div
          key={activity.id}
          className="flex items-start gap-3 p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
        >
          <div className={`p-2 rounded-full ${getActionColor(activity.action)}`}>
            {getActionIcon(activity.action)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-1">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {activity.user.name}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {activity.description || `${activity.action} ${activity.entityType}`}
                </p>
              </div>
              <span className={`px-2 py-1 text-xs font-medium rounded whitespace-nowrap ${getActionColor(activity.action)}`}>
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

            <div className="flex items-center gap-2 mt-2 text-xs text-gray-500 dark:text-gray-400">
              <Clock className="h-3 w-3" />
              <span>{formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true })}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

