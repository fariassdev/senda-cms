import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { $api } from '@/lib/api';

import {
  DEFAULT_FORM_VALUES,
  lessonSchema,
  type LessonFormData,
} from './constants';
import type { LessonCreateProps } from './types';

export default function useConnect({
  courseSlug,
  nextLessonNumber,
  onOpenChange,
  onSuccess,
}: Omit<LessonCreateProps, 'open'>) {
  const queryClient = useQueryClient();
  const [showDiscardDialog, setShowDiscardDialog] = useState(false);

  const form = useForm<LessonFormData>({
    resolver: zodResolver(lessonSchema),
    defaultValues: DEFAULT_FORM_VALUES,
  });

  const { isDirty } = form.formState;

  const createLessonMutation = $api.useMutation(
    'post',
    '/api/courses/{slug}/lessons',
    {
      onSuccess: async () => {
        toast.success('Lesson created successfully');

        // Invalidate lessons query to refetch updated list
        await queryClient.invalidateQueries({
          queryKey: [
            'get',
            '/api/courses/{slug}/lessons',
            { params: { path: { slug: courseSlug } } },
          ],
          refetchType: 'active',
        });

        // Also invalidate course query for lesson count
        await queryClient.invalidateQueries({
          queryKey: [
            'get',
            '/api/courses/{slug}',
            { params: { path: { slug: courseSlug } } },
          ],
          refetchType: 'active',
        });

        form.reset(DEFAULT_FORM_VALUES);
        onOpenChange(false);
        onSuccess?.();
      },
      onError: (error) => {
        const errorMessage =
          error instanceof Error ? error.message : 'Failed to create lesson';
        toast.error(errorMessage);
      },
    },
  );

  const onSubmit = async (data: LessonFormData) => {
    createLessonMutation.mutate({
      params: {
        path: {
          slug: courseSlug,
        },
      },
      body: {
        lesson: {
          lesson_number: nextLessonNumber,
          title: data.title,
          core_practice: data.corePractice,
          key_point: data.keyPoint,
          tone: data.tone,
          duration_minutes: data.durationMinutes,
        },
      },
    });
  };

  const handleClose = () => {
    if (isDirty) {
      setShowDiscardDialog(true);
    } else {
      form.reset(DEFAULT_FORM_VALUES);
      onOpenChange(false);
    }
  };

  const handleConfirmDiscard = () => {
    setShowDiscardDialog(false);
    form.reset(DEFAULT_FORM_VALUES);
    onOpenChange(false);
  };

  const handleCancelDiscard = () => {
    setShowDiscardDialog(false);
  };

  return {
    form,
    onSubmit,
    isLoading: createLessonMutation.isPending,
    isDirty,
    showDiscardDialog,
    handleClose,
    handleConfirmDiscard,
    handleCancelDiscard,
  };
}
