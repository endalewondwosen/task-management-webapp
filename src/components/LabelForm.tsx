import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCreateLabel, useUpdateLabel, useLabel } from '../hooks/useLabels';
import type { CreateLabelInput, UpdateLabelInput } from '../types';
import { useEffect } from 'react';

const labelSchema = z.object({
  name: z.string().min(1, 'Name is required').max(50, 'Name must be less than 50 characters'),
  color: z.string().regex(/^#[0-9A-F]{6}$/i, 'Color must be a valid hex color').optional(),
});

type LabelFormData = z.infer<typeof labelSchema>;

interface LabelFormProps {
  labelId?: string;
  onSuccess?: () => void;
}

const defaultColors = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8',
  '#F7DC6F', '#BB8FCE', '#85C1E2', '#F8B739', '#52BE80',
];

export const LabelForm = ({ labelId, onSuccess }: LabelFormProps) => {
  const isEditing = !!labelId;
  const { data: existingLabel } = useLabel(labelId);
  const createLabel = useCreateLabel();
  const updateLabel = useUpdateLabel();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
    watch,
  } = useForm<LabelFormData>({
    resolver: zodResolver(labelSchema),
    defaultValues: {
      name: '',
      color: '#808080',
    },
  });

  const selectedColor = watch('color');

  // Update form when existing label loads
  useEffect(() => {
    if (isEditing && existingLabel) {
      reset({
        name: existingLabel.name || '',
        color: existingLabel.color || '#808080',
      });
    }
  }, [existingLabel, isEditing, reset]);

  const onSubmit = async (data: LabelFormData) => {
    try {
      if (isEditing && labelId) {
        const updateData: UpdateLabelInput = {
          name: data.name.trim(),
          color: data.color,
        };
        await updateLabel.mutateAsync({ id: labelId, data: updateData });
      } else {
        const createData: CreateLabelInput = {
          name: data.name.trim(),
          color: data.color || '#808080',
        };
        await createLabel.mutateAsync(createData);
      }
      onSuccess?.();
    } catch (error) {
      console.error('Failed to save label:', error);
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
          placeholder="Enter label name"
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.name.message}</p>
        )}
      </div>

      {/* Color */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Color
        </label>
        <div className="space-y-3">
          {/* Color Picker */}
          <div className="flex items-center gap-3">
            <input
              {...register('color')}
              type="color"
              className="w-16 h-10 border border-gray-300 dark:border-gray-600 rounded cursor-pointer"
            />
            <input
              type="text"
              value={selectedColor || '#808080'}
              onChange={(e) => {
                const value = e.target.value;
                if (/^#[0-9A-F]{6}$/i.test(value)) {
                  setValue('color', value);
                }
              }}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-md focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="#808080"
            />
          </div>

          {/* Preset Colors */}
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Quick select:</p>
            <div className="flex flex-wrap gap-2">
              {defaultColors.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setValue('color', color)}
                  className={`w-8 h-8 rounded-full border-2 transition-all ${
                    selectedColor === color
                      ? 'border-gray-900 dark:border-gray-100 scale-110'
                      : 'border-gray-300 dark:border-gray-600 hover:scale-105'
                  }`}
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
            </div>
          </div>
        </div>
        {errors.color && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.color.message}</p>
        )}
      </div>

      {/* Submit Button */}
      <div className="flex justify-end gap-3 pt-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-md hover:bg-blue-700 dark:hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting ? 'Saving...' : isEditing ? 'Update Label' : 'Create Label'}
        </button>
      </div>
    </form>
  );
};

