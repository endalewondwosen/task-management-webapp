import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTasks } from '../hooks/useTasks';
import { useProjects } from '../hooks/useProjects';
import { CheckSquare, FolderKanban, Users, ArrowRight } from 'lucide-react';
import { SkeletonStats, Skeleton } from '../components/Skeleton';
import {
  TaskCompletionChart,
  ProjectProgressTracking,
  UserActivityStats,
  DueDateCalendarView,
} from '../components/analytics';
import { ExportButton } from '../components/ExportButton';

export const Dashboard = () => {
  const { user } = useAuth();
  const { data: tasksData, isLoading: tasksLoading } = useTasks({ page: 1, limit: 5 });
  const { data: projectsData, isLoading: projectsLoading } = useProjects({ page: 1, limit: 5 });

  return (
    <div className="max-w-7xl mx-auto">
        {/* Quick Navigation */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Link
            to="/tasks"
            className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 hover:shadow-lg transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <CheckSquare className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">Tasks</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Manage tasks</p>
              </div>
            </div>
          </Link>
          <Link
            to="/projects"
            className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 hover:shadow-lg transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
                <FolderKanban className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">Projects</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Manage projects</p>
              </div>
            </div>
          </Link>
          <Link
            to="/users"
            className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 hover:shadow-lg transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
                <Users className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">Users</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Manage users</p>
              </div>
            </div>
          </Link>
        </div>

        {/* Stats Cards */}
        {(tasksLoading || projectsLoading) ? (
          <SkeletonStats />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 transition-colors">
              <div className="flex items-center">
                <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                  <CheckSquare className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Tasks</p>
                  <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                    {tasksData?.meta.total || 0}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 transition-colors">
              <div className="flex items-center">
                <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
                  <FolderKanban className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Projects</p>
                  <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                    {projectsData?.meta.total || 0}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 transition-colors">
              <div className="flex items-center">
                <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
                  <Users className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Your Role</p>
                  <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">{user?.role.name}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Recent Tasks */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow mb-8 transition-colors">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Recent Tasks</h2>
            <Link
              to="/tasks"
              className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
            >
              View All <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="p-6">
            {tasksLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex-1 space-y-2">
                      <Skeleton variant="text" width="60%" height={20} />
                      <Skeleton variant="text" width="80%" height={16} />
                    </div>
                    <Skeleton variant="rectangular" width={60} height={24} className="rounded-md" />
                  </div>
                ))}
              </div>
            ) : tasksData?.data.length === 0 ? (
              <p className="text-gray-600 dark:text-gray-400">No tasks found. Create your first task!</p>
            ) : (
              <div className="space-y-4">
                {tasksData?.data.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-gray-100">{task.title}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{task.description || 'No description'}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 text-xs font-medium rounded ${
                        task.status === 'DONE' ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' :
                        task.status === 'IN_PROGRESS' ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200' :
                        'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                      }`}>
                        {task.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Recent Projects */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow transition-colors mb-8">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Recent Projects</h2>
          </div>
          <div className="p-6">
            {projectsLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div className="flex-1 space-y-2">
                      <Skeleton variant="text" width="60%" height={20} />
                      <Skeleton variant="text" width="80%" height={16} />
                    </div>
                    <Skeleton variant="rectangular" width={60} height={24} className="rounded-md" />
                  </div>
                ))}
              </div>
            ) : projectsData?.data.length === 0 ? (
              <p className="text-gray-600 dark:text-gray-400">No projects found. Create your first project!</p>
            ) : (
              <div className="space-y-4">
                {projectsData?.data.map((project) => (
                  <div
                    key={project.id}
                    className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-gray-100">{project.name}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{project.description || 'No description'}</p>
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded ${
                      project.status === 'ACTIVE' ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' :
                      project.status === 'COMPLETED' ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200' :
                      'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                    }`}>
                      {project.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Analytics Section */}
        <div className="space-y-8">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Analytics & Insights</h2>
            <div className="flex items-center gap-3">
              <ExportButton
                type="tasks"
                filters={{
                  userId: user?.id,
                }}
              />
              <ExportButton
                type="projects"
                filters={{
                  userId: user?.id,
                }}
              />
            </div>
          </div>
          
          {/* Task Completion Chart */}
          <TaskCompletionChart userId={user?.id} />

          {/* Project Progress Tracking */}
          <ProjectProgressTracking userId={user?.id} />

          {/* Calendar and User Activity in Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <DueDateCalendarView userId={user?.id} />
            <UserActivityStats userId={user?.id} />
          </div>
        </div>
    </div>
  );
};

