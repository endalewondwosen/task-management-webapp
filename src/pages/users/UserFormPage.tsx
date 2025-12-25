import { useParams, useNavigate, Link } from 'react-router-dom';
import { UserForm } from '../../components/UserForm';
import { ArrowLeft } from 'lucide-react';

export const UserFormPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = !!id;

  const handleSuccess = () => {
    if (isEditing) {
      navigate(`/users/${id}`);
    } else {
      navigate('/users');
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Page Header */}
      <div className="mb-6">
        <Link
          to={isEditing ? `/users/${id}` : '/users'}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 mb-4"
        >
          <ArrowLeft className="h-5 w-5" />
          Back
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          {isEditing ? 'Edit User' : 'Create New User'}
        </h1>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 transition-colors">
        <UserForm userId={id} onSuccess={handleSuccess} />
      </div>
    </div>
  );
};

