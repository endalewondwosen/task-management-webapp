import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useRoles, useDeleteRole } from '../../hooks/useRoles';
import { useAuth } from '../../contexts/AuthContext';
import { Plus, Search, Edit, Trash2, Eye, Shield, Users } from 'lucide-react';
import { SkeletonList } from '../../components/Skeleton';

export const Roles = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const { data: roles, isLoading, error } = useRoles();
  const { user: currentUser } = useAuth();
  const deleteRole = useDeleteRole();

  const canManageRoles = currentUser?.role?.permissions?.some(
    (p) => p === 'user.manage_roles'
  ) || false;

  const handleDelete = async (id: string, name: string) => {
    if (!id) return;
    if (window.confirm(`Are you sure you want to delete the role "${name}"? This action cannot be undone.`)) {
      try {
        await deleteRole.mutateAsync(id);
      } catch (error) {
        console.error('Failed to delete role:', error);
      }
    }
  };

  const filteredRoles = roles?.filter((role) =>
    role?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    role?.description?.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  return (
    <div className="max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Roles</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">Manage user roles and permissions</p>
        </div>
        {canManageRoles && (
          <Link
            to="/roles/new"
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-md hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
          >
            <Plus className="h-4 w-4" />
            New Role
          </Link>
        )}
      </div>

      {/* Search */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow mb-6 p-4 transition-colors">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
          <input
            type="text"
            placeholder="Search roles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-md focus:ring-blue-500 focus:border-blue-500 transition-colors"
          />
        </div>
      </div>

      {/* Roles List */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow transition-colors">
        {isLoading ? (
          <SkeletonList count={5} />
        ) : error ? (
          <div className="p-8 text-center">
            <p className="text-red-600 dark:text-red-400">Error loading roles. Please try again.</p>
          </div>
        ) : !filteredRoles.length ? (
          <div className="p-8 text-center">
            <Shield className="h-12 w-12 mx-auto mb-2 text-gray-400 dark:text-gray-500" />
            <p className="text-gray-600 dark:text-gray-400">
              {searchQuery ? 'No roles found matching your search.' : 'No roles found.'}
            </p>
            {!searchQuery && canManageRoles && (
              <Link
                to="/roles/new"
                className="mt-4 inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
              >
                <Plus className="h-4 w-4" />
                Create your first role
              </Link>
            )}
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredRoles.map((role) => {
              if (!role?.id) return null;

              return (
                <div
                  key={role.id}
                  className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                          <Shield className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                            {role.name || 'Unnamed Role'}
                          </h3>
                          {role.description && (
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                              {role.description}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-4 mt-3 text-sm text-gray-500 dark:text-gray-400">
                        <span className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          {role.userCount || 0} user{(role.userCount || 0) !== 1 ? 's' : ''}
                        </span>
                        <span>
                          {role.permissions?.length || 0} permission{(role.permissions?.length || 0) !== 1 ? 's' : ''}
                        </span>
                      </div>
                      {role.permissions && role.permissions.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {role.permissions.slice(0, 5).map((permission) => (
                            <span
                              key={permission.id}
                              className="px-2 py-1 text-xs font-medium rounded bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                            >
                              {permission.name}
                            </span>
                          ))}
                          {role.permissions.length > 5 && (
                            <span className="px-2 py-1 text-xs font-medium rounded bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                              +{role.permissions.length - 5} more
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <Link
                        to={`/roles/${role.id}`}
                        className="p-2 text-gray-400 dark:text-gray-500 hover:text-blue-600 dark:hover:text-blue-400"
                        title="View"
                      >
                        <Eye className="h-5 w-5" />
                      </Link>
                      {canManageRoles && (
                        <>
                          <Link
                            to={`/roles/${role.id}/edit`}
                            className="p-2 text-gray-400 dark:text-gray-500 hover:text-blue-600 dark:hover:text-blue-400"
                            title="Edit"
                          >
                            <Edit className="h-5 w-5" />
                          </Link>
                          <button
                            onClick={() => handleDelete(role.id, role.name)}
                            className="p-2 text-gray-400 dark:text-gray-500 hover:text-red-600 dark:hover:text-red-400"
                            title="Delete"
                            disabled={(role.userCount || 0) > 0}
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

