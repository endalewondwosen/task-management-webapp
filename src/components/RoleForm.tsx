import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCreateRole, useUpdateRole, useRole } from '../hooks/useRoles';
import type { CreateRoleInput, UpdateRoleInput } from '../types';
import { useEffect } from 'react';

const roleSchema = z.object({
  name: z.string().min(1, 'Name is required').max(50, 'Name must be less than 50 characters'),
  description: z.string().max(200, 'Description must be less than 200 characters').optional().or(z.literal('')),
});

type RoleFormData = z.infer<typeof roleSchema>;

interface RoleFormProps {
  roleId?: string;
  onSuccess?: () => void;
}

export const RoleForm = ({ roleId, onSuccess }: RoleFormProps) => {
  const isEditing = !!roleId;
  const { data: existingRole } = useRole(roleId);
  const createRole = useCreateRole();
  const updateRole = useUpdateRole();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<RoleFormData>({
    resolver: zodResolver(roleSchema),
    defaultValues: {
      name: '',
      description: '',
    },
  });

  // Update form when existing role loads
  useEffect(() => {
    if (isEditing && existingRole) {
      reset({
        name: existingRole.name || '',
        description: existingRole.description || '',
      });
    }
  }, [existingRole, isEditing, reset]);

  const onSubmit = async (data: RoleFormData) => {
    try {
      if (isEditing && roleId) {
        const updateData: UpdateRoleInput = {
          name: data.name.trim(),
          description: data.description?.trim() || undefined,
        };
        await updateRole.mutateAsync({ id: roleId, data: updateData });
      } else {
        const createData: CreateRoleInput = {
          name: data.name.trim(),
          description: data.description?.trim() || undefined,
        };
        await createRole.mutateAsync(createData);
      }
      onSuccess?.();
    } catch (error) {
      console.error('Failed to save role:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Name */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Name <span className="text-red-500">*</span>
        </label>
        <input
          {...register('name')}
          type="text"
          id="name"
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-md focus:ring-blue-500 focus:border-blue-500 transition-colors"
          placeholder="Enter role name (e.g., ADMIN, MANAGER)"
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.name.message}</p>
        )}
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Description
        </label>
        <textarea
          {...register('description')}
          id="description"
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-md focus:ring-blue-500 focus:border-blue-500 transition-colors"
          placeholder="Enter role description"
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.description.message}</p>
        )}
      </div>

      {/* Submit Button */}
      <div className="flex justify-end gap-3 pt-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-md hover:bg-blue-700 dark:hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting ? 'Saving...' : isEditing ? 'Update Role' : 'Create Role'}
        </button>
      </div>
    </form>
  );
};

