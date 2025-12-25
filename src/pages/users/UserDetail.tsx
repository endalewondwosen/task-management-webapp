import { useParams, Link, useNavigate } from 'react-router-dom';
import { useUser, useDeleteUser } from '../../hooks/useUsers';
import { ArrowLeft, Edit, Trash2, User, Shield } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useConfirm } from '../../contexts/ConfirmContext';
import toast from 'react-hot-toast';

export const UserDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: user, isLoading, error } = useUser(id || '');
  const { user: currentUser } = useAuth();
  const deleteUser = useDeleteUser();
  const { confirm } = useConfirm();

  const handleDelete = async () => {
    if (!user) return;
    if (user.id === currentUser?.id) {
      toast.error('You cannot delete your own account!');
      return;
    }
    
    const confirmed = await confirm({
      title: 'Delete User',
      message: 'Are you sure you want to delete this user? This action cannot be undone.',
      confirmText: 'Delete',
      cancelText: 'Cancel',
      variant: 'danger',
    });

    if (confirmed) {
      try {
        await deleteUser.mutateAsync(user.id);
        navigate('/users');
      } catch (error) {
        console.error('Failed to delete user:', error);
      }
    }
  };

  const canManageUsers = currentUser?.role?.permissions?.some(
    (p) => p === 'user.create' || p === 'user.update' || p === 'user.delete'
  ) || false;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center transition-colors">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading user...</p>
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center transition-colors">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400 mb-4">User not found</p>
          <Link to="/users" className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300">
            Back to Users
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Page Header */}
      <div className="flex items-center justify-between mb-6">
        <Link
          to="/users"
          className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
        >
          <ArrowLeft className="h-5 w-5" />
          Back to Users
        </Link>
        {canManageUsers && (
          <div className="flex items-center gap-2">
            <Link
              to={`/users/${user.id}/edit`}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-md hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
            >
              <Edit className="h-4 w-4" />
              Edit
            </Link>
            {user.id !== currentUser?.id && (
              <button
                onClick={handleDelete}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 dark:bg-red-500 text-white rounded-md hover:bg-red-700 dark:hover:bg-red-600 transition-colors"
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </button>
            )}
          </div>
        )}
      </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 transition-colors">
          {/* Name and Role */}
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
              <User className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">{user.name}</h1>
              <p className="text-gray-600 dark:text-gray-400">{user.email}</p>
            </div>
          </div>

          {/* Role */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-2">
              <Shield className="h-5 w-5 text-gray-400" />
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Role</h2>
            </div>
            <div className="ml-8">
              <span
                className={`inline-block px-3 py-1 rounded-md text-sm font-medium ${
                  user.role?.name === 'ADMIN'
                    ? 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
                    : user.role?.name === 'MANAGER'
                    ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                }`}
              >
                {user.role?.name || 'Unknown'}
              </span>
            </div>
          </div>

          {/* Permissions */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">Permissions</h2>
            <div className="ml-4">
              {!user.role?.permissions || user.role.permissions.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400">No permissions assigned</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {user.role.permissions.map((permission, index) => (
                    <span
                      key={permission || index}
                      className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-sm"
                    >
                      {permission}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Timestamps */}
          <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              <p>Created: {user.createdAt ? new Date(user.createdAt).toLocaleString() : 'Unknown'}</p>
              <p>Last updated: {user.updatedAt ? new Date(user.updatedAt).toLocaleString() : 'Unknown'}</p>
            </div>
          </div>
        </div>
    </div>
  );
};

