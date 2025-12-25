import { useState } from 'react';
import { useCreateComment } from '../../hooks/useComments';
import { Send } from 'lucide-react';

interface CommentFormProps {
  taskId: string;
}

export const CommentForm = ({ taskId }: CommentFormProps) => {
  const [content, setContent] = useState('');
  const createComment = useCreateComment();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || !taskId) {
      console.warn('Cannot submit: content or taskId is missing', { content: content.trim(), taskId });
      return;
    }

    try {
      await createComment.mutateAsync({
        content: content.trim(),
        taskId,
      });
      setContent('');
    } catch (error) {
      console.error('Failed to create comment:', error);
      // Error toast is handled by the hook
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write a comment..."
          rows={3}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-md focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
          required
        />
      </div>
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={!content.trim() || createComment.isPending}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-md hover:bg-blue-700 dark:hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Send className="h-4 w-4" />
          {createComment.isPending ? 'Posting...' : 'Post Comment'}
        </button>
      </div>
    </form>
  );
};

