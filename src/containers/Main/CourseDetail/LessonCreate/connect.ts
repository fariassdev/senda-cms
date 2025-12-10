import { useQueryClient } from '@tanstack/react-query';
import { useState, useCallback } from 'react';
import { toast } from 'sonner';

import { type LessonFormData } from '@/components/LessonForm/constants';
import { $api } from '@/lib/api';

import type { LessonCreateProps } from './types';

export default function useConnect({
  courseSlug,
  nextLessonNumber,
  onOpenChange,
  onSuccess,
}: Omit<LessonCreateProps, 'open'>) {
  const queryClient = useQueryClient();
  const [showDiscardDialog, setShowDiscardDialog] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

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

  const onSubmit = useCallback(
    async (data: LessonFormData) => {
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
    },
    [courseSlug, nextLessonNumber, createLessonMutation],
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
    isLoading: createLessonMutation.isPending,
    isDirty,
    showDiscardDialog,
    handleClose,
    handleConfirmDiscard,
    handleCancelDiscard,
    setIsDirty,
  };
}
