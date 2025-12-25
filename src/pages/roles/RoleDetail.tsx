import { useParams, Link, useNavigate } from 'react-router-dom';
import { useRole, useDeleteRole, useAssignPermission, useRemovePermission } from '../../hooks/useRoles';
import { usePermissions } from '../../hooks/usePermissions';
import { useAuth } from '../../contexts/AuthContext';
import { ArrowLeft, Edit, Trash2, Shield, Check, X } from 'lucide-react';
// import { useState } from 'react'; // Reserved for future use

export const RoleDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: role, isLoading, error } = useRole(id);
  const { data: allPermissions } = usePermissions();
  const { user: currentUser } = useAuth();
  const deleteRole = useDeleteRole();
  const assignPermission = useAssignPermission();
  const removePermission = useRemovePermission();

  const canManageRoles = currentUser?.role?.permissions?.some(
    (p) => p === 'user.manage_roles'
  ) || false;

  const handleDelete = async () => {
    if (!role) return;
    if (window.confirm(`Are you sure you want to delete the role "${role.name}"? This action cannot be undone.`)) {
      try {
        await deleteRole.mutateAsync(role.id);
        navigate('/roles');
      } catch (error) {
        console.error('Failed to delete role:', error);
      }
    }
  };

  const handleTogglePermission = async (permissionId: string, isAssigned: boolean) => {
    if (!role?.id || !permissionId) return;

    try {
      if (isAssigned) {
        await removePermission.mutateAsync({
          roleId: role.id,
          permissionId,
        });
      } else {
        await assignPermission.mutateAsync({
          roleId: role.id,
          permissionId,
        });
      }
    } catch (error) {
      console.error('Failed to toggle permission:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center transition-colors">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading role...</p>
        </div>
      </div>
    );
  }

  if (error || !role) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center transition-colors">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400 mb-4">Role not found</p>
          <Link to="/roles" className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300">
            Back to Roles
          </Link>
        </div>
      </div>
    );
  }

  const assignedPermissionIds = new Set(role.permissions?.map((p) => p.id) || []);
  const permissionsByResource = (allPermissions || []).reduce((acc, perm) => {
    if (!perm || !perm.resource) return acc;
    if (!acc[perm.resource]) {
      acc[perm.resource] = [];
    }
    acc[perm.resource].push(perm);
    return acc;
  }, {} as Record<string, typeof allPermissions>);

  return (
    <div className="max-w-4xl mx-auto">
      {/* Page Header */}
      <div className="flex items-center justify-between mb-6">
        <Link
          to="/roles"
          className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
        >
          <ArrowLeft className="h-5 w-5" />
          Back to Roles
        </Link>
        {canManageRoles && (
          <div className="flex items-center gap-2">
            <Link
              to={`/roles/${role.id}/edit`}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-md hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
            >
              <Edit className="h-4 w-4" />
              Edit Role
            </Link>
            <button
              onClick={handleDelete}
              disabled={(role.userCount || 0) > 0}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 dark:bg-red-500 text-white rounded-md hover:bg-red-700 dark:hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </button>
          </div>
        )}
      </div>

      {/* Role Info */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 transition-colors mb-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
            <Shield className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">{role.name}</h1>
            {role.description && (
              <p className="text-gray-600 dark:text-gray-400 mt-1">{role.description}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Users with this role</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {role.userCount || 0}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Total Permissions</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {role.permissions?.length || 0}
            </p>
          </div>
        </div>
      </div>

      {/* Permissions Management */}
      {canManageRoles && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 transition-colors">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Manage Permissions
          </h2>

          {Object.keys(permissionsByResource).length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400">No permissions available.</p>
          ) : (
            <div className="space-y-6">
              {Object.entries(permissionsByResource).map(([resource, perms]) => (
                <div key={resource}>
                  <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 uppercase">
                    {resource}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {(perms || []).map((permission) => {
                      if (!permission || !permission.id) return null;
                      const isAssigned = assignedPermissionIds.has(permission.id);

                      return (
                        <div
                          key={permission.id}
                          className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
                            isAssigned
                              ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
                              : 'bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-700'
                          }`}
                        >
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                              {permission.name}
                            </p>
                            {permission.description && (
                              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                {permission.description}
                              </p>
                            )}
                          </div>
                          <button
                            onClick={() => handleTogglePermission(permission.id, isAssigned)}
                            disabled={assignPermission.isPending || removePermission.isPending}
                            className={`ml-3 p-2 rounded transition-colors ${
                              isAssigned
                                ? 'bg-blue-600 dark:bg-blue-500 text-white hover:bg-blue-700 dark:hover:bg-blue-600'
                                : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500'
                            } disabled:opacity-50`}
                            title={isAssigned ? 'Remove permission' : 'Assign permission'}
                          >
                            {isAssigned ? (
                              <Check className="h-4 w-4" />
                            ) : (
                              <X className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Assigned Permissions (Read-only view if no manage permission) */}
      {!canManageRoles && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 transition-colors">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Permissions
          </h2>
          {role.permissions && role.permissions.length > 0 ? (
            <div className="space-y-4">
              {Object.entries(
                (role.permissions || []).reduce((acc, perm) => {
                  if (!perm?.resource) return acc;
                  if (!acc[perm.resource]) {
                    acc[perm.resource] = [];
                  }
                  acc[perm.resource].push(perm);
                  return acc;
                }, {} as Record<string, typeof role.permissions>)
              ).map(([resource, perms]) => (
                <div key={resource}>
                  <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 uppercase">
                    {resource}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {perms.map((permission) => (
                      <span
                        key={permission.id}
                        className="px-3 py-1 text-sm font-medium rounded bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200"
                      >
                        {permission.name}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400">No permissions assigned.</p>
          )}
        </div>
      )}
    </div>
  );
};

