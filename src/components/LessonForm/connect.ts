import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import {
  DEFAULT_FORM_VALUES,
  lessonSchema,
  type LessonFormData,
} from './constants';
import type { UseConnectProps } from './types';

export default function useConnect({
  defaultValues,
  onSubmit,
  onDirtyChange,
}: UseConnectProps) {
  const form = useForm<LessonFormData>({
    resolver: zodResolver(lessonSchema),
    defaultValues: { ...DEFAULT_FORM_VALUES, ...defaultValues },
  });

  const { isDirty } = form.formState;

  // Notify parent when dirty state changes
  useEffect(() => {
    onDirtyChange?.(isDirty);
  }, [isDirty, onDirtyChange]);

  // Reset form when defaultValues change (e.g., when modal opens with new data)
  useEffect(() => {
    if (defaultValues) {
      form.reset({ ...DEFAULT_FORM_VALUES, ...defaultValues });
    }
  }, [defaultValues, form]);

  const handleSubmit = async (data: LessonFormData) => {
    await onSubmit(data);
  };

  return {
    form,
    handleSubmit,
  };
}
