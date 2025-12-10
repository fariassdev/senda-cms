import { useQueryClient } from '@tanstack/react-query';
import { useState, useCallback } from 'react';
import { toast } from 'sonner';

import { type LessonFormData } from '@/components/LessonForm/constants';
import { $api } from '@/lib/api';

import type { LessonEditProps } from './types';

export default function useConnect({
  courseSlug,
  lesson,
  onOpenChange,
  onSuccess,
}: Omit<LessonEditProps, 'open'>) {
  const queryClient = useQueryClient();
  const [showDiscardDialog, setShowDiscardDialog] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

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

  const onSubmit = useCallback(
    async (data: LessonFormData) => {
      // Skip API call if no changes made
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
    },
    [courseSlug, lesson.id, isDirty, onOpenChange, updateLessonMutation],
  );

  const handleClose = useCallback(() => {
    if (isDirty) {
      setShowDiscardDialog(true);
    } else {
      onOpenChange(false);
    }
  }, [isDirty, onOpenChange]);

  const handleConfirmDiscard = useCallback(() => {
    setShowDiscardDialog(false);
    setIsDirty(false);
    onOpenChange(false);
  }, [onOpenChange]);

  const handleCancelDiscard = useCallback(() => {
    setShowDiscardDialog(false);
  }, []);

  return {
    onSubmit,
    isLoading: updateLessonMutation.isPending,
    isDirty,
    showDiscardDialog,
    handleClose,
    handleConfirmDiscard,
    handleCancelDiscard,
    setIsDirty,
  };
}
