import { useTaskComments, useDeleteComment, useUpdateComment } from '../../hooks/useComments';
import { useAuth } from '../../contexts/AuthContext';
import { MessageSquare, Trash2, Edit2 } from 'lucide-react';
import { useState } from 'react';
import type { Comment } from '../../types';

interface CommentListProps {
  taskId: string;
}

export const CommentList = ({ taskId }: CommentListProps) => {
  const { user } = useAuth();
  const { data: comments, isLoading, error } = useTaskComments(taskId);
  const deleteComment = useDeleteComment();
  const updateComment = useUpdateComment();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');

  // Debug logging
  if (error) {
    console.error('Error loading comments:', error);
  }

  const handleDelete = async (id: string) => {
    if (!id) return;
    if (window.confirm('Are you sure you want to delete this comment?')) {
      try {
        await deleteComment.mutateAsync(id);
      } catch (error) {
        console.error('Failed to delete comment:', error);
      }
    }
  };

  const handleEdit = (comment: Comment) => {
    if (!comment?.id || !comment?.content) return;
    setEditingId(comment.id);
    setEditContent(comment.content);
  };

  const handleSaveEdit = async (id: string) => {
    if (!id || !editContent.trim()) return;
    try {
      await updateComment.mutateAsync({
        id,
        data: { content: editContent.trim() },
      });
      setEditingId(null);
      setEditContent('');
    } catch (error) {
      console.error('Failed to update comment:', error);
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditContent('');
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2].map((i) => (
          <div key={i} className="animate-pulse">
            <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded-lg" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 dark:text-red-400 mb-2">Error loading comments</p>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {error instanceof Error ? error.message : 'Failed to load comments'}
        </p>
      </div>
    );
  }

  if (!comments || comments.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        <MessageSquare className="h-12 w-12 mx-auto mb-2 opacity-50" />
        <p>No comments yet. Be the first to comment!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {comments.map((comment) => {
        if (!comment?.id) return null;

        const isEditing = editingId === comment.id;
        const canEdit = user?.id === comment.createdById;
        const canDelete = user?.id === comment.createdById;

        return (
          <div
            key={comment.id}
            className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                  <span className="text-blue-600 dark:text-blue-400 font-semibold text-xs">
                    {comment.createdBy?.name?.charAt(0).toUpperCase() || 'U'}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {comment.createdBy?.name || 'Unknown User'}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {comment.createdAt
                      ? new Date(comment.createdAt).toLocaleString()
                      : 'Unknown date'}
                  </p>
                </div>
              </div>
              {(canEdit || canDelete) && (
                <div className="flex items-center gap-2">
                  {canEdit && (
                    <button
                      onClick={() => handleEdit(comment)}
                      className="p-1 text-gray-400 dark:text-gray-500 hover:text-blue-600 dark:hover:text-blue-400"
                      title="Edit"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                  )}
                  {canDelete && (
                    <button
                      onClick={() => handleDelete(comment.id)}
                      className="p-1 text-gray-400 dark:text-gray-500 hover:text-red-600 dark:hover:text-red-400"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              )}
            </div>
            {isEditing ? (
              <div className="space-y-2">
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  rows={3}
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => handleSaveEdit(comment.id)}
                    className="px-3 py-1 text-sm bg-blue-600 dark:bg-blue-500 text-white rounded hover:bg-blue-700 dark:hover:bg-blue-600"
                  >
                    Save
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="px-3 py-1 text-sm bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                {comment.content || 'No content'}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
};

