import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { $api } from '@/lib/api';

import { lessonSchema, type LessonFormData, type ToneValue } from './constants';
import type { LessonEditProps } from './types';

export default function useConnect({
  courseSlug,
  lesson,
  onOpenChange,
  onSuccess,
}: Omit<LessonEditProps, 'open'>) {
  const queryClient = useQueryClient();
  const [showDiscardDialog, setShowDiscardDialog] = useState(false);

  // Pre-populate form with current lesson data
  const form = useForm<LessonFormData>({
    resolver: zodResolver(lessonSchema),
    defaultValues: {
      title: lesson.title,
      durationMinutes: lesson.durationMinutes,
      corePractice: lesson.corePractice,
      keyPoint: lesson.keyPoint,
      tone: lesson.tone as ToneValue,
    },
  });

  const { isDirty } = form.formState;

  const updateLessonMutation = $api.useMutation(
    'put',
    '/api/courses/{slug}/lessons/{id}',
    {
      onSuccess: async () => {
        toast.success('Lesson updated');

        // Invalidate lessons query to refetch updated list
        await queryClient.invalidateQueries({
          queryKey: [
            'get',
            '/api/courses/{slug}/lessons',
            { params: { path: { slug: courseSlug } } },
          ],
          refetchType: 'active',
        });

        // Also invalidate course query for lesson data
        await queryClient.invalidateQueries({
          queryKey: [
            'get',
            '/api/courses/{slug}',
            { params: { path: { slug: courseSlug } } },
          ],
          refetchType: 'active',
        });

        onOpenChange(false);
        onSuccess?.();
      },
      onError: (error) => {
        const errorMessage =
          error instanceof Error ? error.message : 'Failed to update lesson';
        toast.error(errorMessage);
      },
    },
  );

  const onSubmit = async (data: LessonFormData) => {
    // AC #5: Skip API call if no changes made
    if (!isDirty) {
      onOpenChange(false);
      return;
    }

    updateLessonMutation.mutate({
      params: {
        path: {
          slug: courseSlug,
          id: lesson.id,
        },
      },
      body: {
        lesson: {
          title: data.title,
          core_practice: data.corePractice,
          key_point: data.keyPoint,
          tone: data.tone,
          duration_minutes: data.durationMinutes,
        },
      },
    });
  };

  // AC #6: Show confirmation if form has unsaved changes
  const handleClose = () => {
    if (isDirty) {
      setShowDiscardDialog(true);
    } else {
      onOpenChange(false);
    }
  };

  const handleConfirmDiscard = () => {
    setShowDiscardDialog(false);
    // Reset form to original lesson values
    form.reset({
      title: lesson.title,
      durationMinutes: lesson.durationMinutes,
      corePractice: lesson.corePractice,
      keyPoint: lesson.keyPoint,
      tone: lesson.tone as ToneValue,
    });
    onOpenChange(false);
  };

  const handleCancelDiscard = () => {
    setShowDiscardDialog(false);
  };

  return {
    form,
    onSubmit,
    isLoading: updateLessonMutation.isPending,
    isDirty,
    showDiscardDialog,
    handleClose,
    handleConfirmDiscard,
    handleCancelDiscard,
  };
}
