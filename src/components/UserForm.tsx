import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCreateUser, useUpdateUser, useUser } from '../hooks/useUsers';
import { useRoles } from '../hooks/useRoles';
import type { CreateUserInput, UpdateUserInput } from '../api/users';

const userSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters').max(100, 'Name must be less than 100 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters').optional().or(z.literal('')),
  roleName: z.string().optional(),
});

type UserFormData = z.infer<typeof userSchema>;

interface UserFormProps {
  userId?: string;
  onSuccess?: () => void;
}

export const UserForm = ({ userId, onSuccess }: UserFormProps) => {
  const isEditing = !!userId;
  const { data: existingUser } = useUser(userId || '');
  const { data: roles } = useRoles();
  const createUser = useCreateUser();
  const updateUser = useUpdateUser();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: isEditing && existingUser
      ? {
          name: existingUser.name,
          email: existingUser.email,
          password: '',
          roleName: existingUser.role.name,
        }
      : {
          roleName: 'USER',
        },
  });

  // Update form when existing user loads
  React.useEffect(() => {
    if (isEditing && existingUser) {
      reset({
        name: existingUser.name,
        email: existingUser.email,
        password: '',
        roleName: existingUser.role.name,
      });
    }
  }, [existingUser, isEditing, reset]);

  const onSubmit = async (data: UserFormData) => {
    try {
      const userData: CreateUserInput | UpdateUserInput = {
        name: data.name,
        email: data.email,
        ...(data.password && { password: data.password }),
        ...(data.roleName && { roleName: data.roleName }),
      };

      if (isEditing && userId) {
        await updateUser.mutateAsync({ id: userId, data: userData as UpdateUserInput });
      } else {
        await createUser.mutateAsync(userData as CreateUserInput);
      }

      onSuccess?.();
    } catch (error) {
      console.error('Failed to save user:', error);
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
          placeholder="Enter user name"
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
        )}
      </div>

      {/* Email */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Email <span className="text-red-500">*</span>
        </label>
        <input
          {...register('email')}
          type="email"
          id="email"
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-md focus:ring-blue-500 focus:border-blue-500 transition-colors"
          placeholder="Enter user email"
          disabled={isEditing}
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
        )}
        {isEditing && (
          <p className="mt-1 text-sm text-gray-500">Email cannot be changed</p>
        )}
      </div>

      {/* Password */}
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Password {!isEditing && <span className="text-red-500">*</span>}
          {isEditing && <span className="text-gray-500">(leave blank to keep current)</span>}
        </label>
        <input
          {...register('password')}
          type="password"
          id="password"
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-md focus:ring-blue-500 focus:border-blue-500 transition-colors"
          placeholder={isEditing ? 'Enter new password (optional)' : 'Enter password'}
        />
        {errors.password && (
          <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
        )}
      </div>

      {/* Role */}
      <div>
        <label htmlFor="roleName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Role
        </label>
        <select
          {...register('roleName')}
          id="roleName"
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-md focus:ring-blue-500 focus:border-blue-500 transition-colors"
        >
          {roles && roles.length > 0 ? (
            roles.map((role) => (
              <option key={role.id} value={role.name}>
                {role.name}
              </option>
            ))
          ) : (
            <>
              <option value="USER">USER</option>
              <option value="MANAGER">MANAGER</option>
              <option value="ADMIN">ADMIN</option>
            </>
          )}
        </select>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end gap-3 pt-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-md hover:bg-blue-700 dark:hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting ? 'Saving...' : isEditing ? 'Update User' : 'Create User'}
        </button>
      </div>
    </form>
  );
};

