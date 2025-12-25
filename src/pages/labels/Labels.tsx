import { useState } from 'react';
import { useLabels, useDeleteLabel } from '../../hooks/useLabels';
import { Plus, Tag, Edit, Trash2, Search } from 'lucide-react';
import { SkeletonList } from '../../components/Skeleton';
import { Link } from 'react-router-dom';

export const Labels = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const { data: labels, isLoading, error } = useLabels();
  const deleteLabel = useDeleteLabel();

  const handleDelete = async (id: string) => {
    if (!id) return;
    if (window.confirm('Are you sure you want to delete this label? This will remove it from all tasks.')) {
      try {
        await deleteLabel.mutateAsync(id);
      } catch (error) {
        console.error('Failed to delete label:', error);
      }
    }
  };

  const filteredLabels = labels?.filter((label) =>
    label?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  return (
    <div className="max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Labels</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">Manage task labels</p>
        </div>
        <Link
          to="/labels/new"
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-md hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
        >
          <Plus className="h-4 w-4" />
          New Label
        </Link>
      </div>

      {/* Search */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow mb-6 p-4 transition-colors">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
          <input
            type="text"
            placeholder="Search labels..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-md focus:ring-blue-500 focus:border-blue-500 transition-colors"
          />
        </div>
      </div>

      {/* Labels List */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow transition-colors">
        {isLoading ? (
          <SkeletonList count={5} />
        ) : error ? (
          <div className="p-8 text-center">
            <p className="text-red-600 dark:text-red-400">Error loading labels. Please try again.</p>
          </div>
        ) : !filteredLabels.length ? (
          <div className="p-8 text-center">
            <Tag className="h-12 w-12 mx-auto mb-2 text-gray-400 dark:text-gray-500" />
            <p className="text-gray-600 dark:text-gray-400">
              {searchQuery ? 'No labels found matching your search.' : 'No labels found.'}
            </p>
            {!searchQuery && (
              <Link
                to="/labels/new"
                className="mt-4 inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
              >
                <Plus className="h-4 w-4" />
                Create your first label
              </Link>
            )}
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredLabels.map((label) => {
              if (!label?.id) return null;
              
              return (
                <div
                  key={label.id}
                  className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: label.color || '#808080' }}
                      />
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                          {label.name || 'Unnamed Label'}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Created: {label.createdAt ? new Date(label.createdAt).toLocaleDateString() : 'Unknown'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Link
                        to={`/labels/${label.id}/edit`}
                        className="p-2 text-gray-400 dark:text-gray-500 hover:text-blue-600 dark:hover:text-blue-400"
                        title="Edit"
                      >
                        <Edit className="h-5 w-5" />
                      </Link>
                      <button
                        onClick={() => handleDelete(label.id)}
                        className="p-2 text-gray-400 dark:text-gray-500 hover:text-red-600 dark:hover:text-red-400"
                        title="Delete"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
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

