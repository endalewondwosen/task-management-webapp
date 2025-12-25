import { useTaskStats } from '../../hooks/useAnalytics';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Skeleton } from '../Skeleton';

const STATUS_COLORS = {
  TODO: '#94a3b8',
  IN_PROGRESS: '#3b82f6',
  IN_REVIEW: '#f59e0b',
  DONE: '#10b981',
  CANCELLED: '#ef4444',
};

const PRIORITY_COLORS = {
  LOW: '#10b981',
  MEDIUM: '#f59e0b',
  HIGH: '#f97316',
  URGENT: '#ef4444',
};

export const TaskCompletionChart = ({ userId }: { userId?: string }) => {
  const { data, isLoading } = useTaskStats(userId);

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <Skeleton variant="rectangular" width="100%" height={300} />
      </div>
    );
  }

  if (!data) return null;

  const statusData = [
    { name: 'To Do', value: data.byStatus.TODO, color: STATUS_COLORS.TODO },
    { name: 'In Progress', value: data.byStatus.IN_PROGRESS, color: STATUS_COLORS.IN_PROGRESS },
    { name: 'In Review', value: data.byStatus.IN_REVIEW, color: STATUS_COLORS.IN_REVIEW },
    { name: 'Done', value: data.byStatus.DONE, color: STATUS_COLORS.DONE },
    { name: 'Cancelled', value: data.byStatus.CANCELLED, color: STATUS_COLORS.CANCELLED },
  ].filter(item => item.value > 0);

  const priorityData = [
    { name: 'Low', value: data.byPriority.LOW, color: PRIORITY_COLORS.LOW },
    { name: 'Medium', value: data.byPriority.MEDIUM, color: PRIORITY_COLORS.MEDIUM },
    { name: 'High', value: data.byPriority.HIGH, color: PRIORITY_COLORS.HIGH },
    { name: 'Urgent', value: data.byPriority.URGENT, color: PRIORITY_COLORS.URGENT },
  ].filter(item => item.value > 0);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 transition-colors">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6">Task Completion Overview</h3>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Distribution */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">Tasks by Status</h4>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value, percent }) => `${name}: ${value} (${percent ? (percent * 100).toFixed(0) : 0}%)`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Priority Distribution */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">Tasks by Priority</h4>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={priorityData}>
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
              <Bar dataKey="value" fill="#3b82f6">
                {priorityData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
        <div className="text-center">
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{data.completionRate.toFixed(1)}%</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Completion Rate</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-red-600 dark:text-red-400">{data.overdue}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Overdue</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">{data.dueThisWeek}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Due This Week</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{data.dueThisMonth}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Due This Month</p>
        </div>
      </div>
    </div>
  );
};

