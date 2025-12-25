import { useParams, useNavigate, Link } from 'react-router-dom';
import { TaskForm } from '../../components/TaskForm';
import { ArrowLeft } from 'lucide-react';

export const TaskFormPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = !!id;

  const handleSuccess = () => {
    if (isEditing) {
      navigate(`/tasks/${id}`);
    } else {
      navigate('/tasks');
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Page Header */}
      <div className="mb-6">
        <Link
          to={isEditing ? `/tasks/${id}` : '/tasks'}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 mb-4"
        >
          <ArrowLeft className="h-5 w-5" />
          Back
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          {isEditing ? 'Edit Task' : 'Create New Task'}
        </h1>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 transition-colors">
        <TaskForm taskId={id} onSuccess={handleSuccess} />
      </div>
    </div>
  );
};

