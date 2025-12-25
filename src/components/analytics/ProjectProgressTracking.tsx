import { useProjectStats } from '../../hooks/useAnalytics';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { Skeleton } from '../Skeleton';

const STATUS_COLORS = {
  ACTIVE: '#10b981',
  ON_HOLD: '#f59e0b',
  COMPLETED: '#3b82f6',
  CANCELLED: '#ef4444',
};

export const ProjectProgressTracking = ({ userId }: { userId?: string }) => {
  const { data, isLoading } = useProjectStats(userId);

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <Skeleton variant="rectangular" width="100%" height={300} />
      </div>
    );
  }

  if (!data) return null;

  const statusData = [
    { name: 'Active', value: data.byStatus.ACTIVE, color: STATUS_COLORS.ACTIVE },
    { name: 'On Hold', value: data.byStatus.ON_HOLD, color: STATUS_COLORS.ON_HOLD },
    { name: 'Completed', value: data.byStatus.COMPLETED, color: STATUS_COLORS.COMPLETED },
    { name: 'Cancelled', value: data.byStatus.CANCELLED, color: STATUS_COLORS.CANCELLED },
  ].filter(item => item.value > 0);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 transition-colors">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6">Project Progress Tracking</h3>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Distribution */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">Projects by Status</h4>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={statusData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-gray-300 dark:stroke-gray-600" />
              <XAxis dataKey="name" className="text-gray-600 dark:text-gray-400" />
              <YAxis className="text-gray-600 dark:text-gray-400" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--tw-color-gray-800)',
                  border: '1px solid var(--tw-color-gray-700)',
                  borderRadius: '6px',
                }}
              />
              <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Progress Stats */}
        <div className="space-y-4">
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{data.averageProgress.toFixed(1)}%</p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Average Progress</p>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">{data.withTasks}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">With Tasks</p>
            </div>
            
            <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <p className="text-2xl font-bold text-gray-600 dark:text-gray-400">{data.withoutTasks}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Without Tasks</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Overall Progress</span>
              <span className="text-sm text-gray-600 dark:text-gray-400">{data.averageProgress.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
              <div
                className="bg-blue-600 dark:bg-blue-500 h-3 rounded-full transition-all duration-300"
                style={{ width: `${data.averageProgress}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{data.total}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Projects</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">{data.byStatus.ACTIVE}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Active</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{data.byStatus.COMPLETED}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Completed</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">{data.byStatus.ON_HOLD}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">On Hold</p>
          </div>
        </div>
      </div>
    </div>
  );
};

