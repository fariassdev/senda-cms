import { useQueryClient } from '@tanstack/react-query';
import { useCallback, useState } from 'react';
import { toast } from 'sonner';

import { $api } from '@/lib/api';
import type { Lesson } from '@/types/models';
import { TOAST_MESSAGES } from './constants';
import {
  arraysEqual,
  buildReorderRequest,
  getOriginalOrder,
  reorderLessonsInCache,
} from './logic';
import type { LessonReorderContext, LessonReorderState } from './types';

const useLessonReorder = ({
  courseSlug,
  onSuccess,
}: {
  courseSlug: string;
  onSuccess?: () => void;
}) => {
  const queryClient = useQueryClient();
  const [pendingOrder, setPendingOrder] = useState<number[] | null>(null);

  const lessonsQueryKey = [
    'get',
    '/api/courses/{slug}/lessons',
    { params: { path: { slug: courseSlug } } },
  ] as const;

  const reorderMutation = $api.useMutation(
    'patch',
    '/api/courses/{slug}/lessons/reorder',
    {
      onMutate: async (variables): Promise<LessonReorderContext> => {
        // Cancel any outgoing refetches
        await queryClient.cancelQueries({ queryKey: lessonsQueryKey });

        // Snapshot previous lessons
        const previousData = queryClient.getQueryData(lessonsQueryKey) as
          | { lessons: Lesson[] }
          | undefined;

        const previousLessons = previousData?.lessons;

        // Extract lesson IDs from the mutation body to compute new order
        const orderedIds = variables.body.lessons.map((l) => l.lesson_id);

        // Optimistically update to new order
        queryClient.setQueryData(
          lessonsQueryKey,
          (old: { lessons: Lesson[] } | undefined) => {
            if (!old) return old;
            return {
              ...old,
              lessons: reorderLessonsInCache(old.lessons, orderedIds),
            };
          },
        );

        return { previousLessons };
      },

      onError: (_err, _variables, context) => {
        // Rollback on error
        const ctx = context as LessonReorderContext | undefined;
        if (ctx?.previousLessons) {
          queryClient.setQueryData(
            lessonsQueryKey,
            (old: { lessons: Lesson[] } | undefined) => {
              if (!old) return old;
              return {
                ...old,
                lessons: ctx.previousLessons,
              };
            },
          );
        }
        toast.error(TOAST_MESSAGES.error);
      },

      onSuccess: () => {
        toast.success(TOAST_MESSAGES.success);
        // Clear pending order after successful save
        setPendingOrder(null);
        onSuccess?.();
      },

      onSettled: async () => {
        // Refetch to ensure sync with server
        await queryClient.invalidateQueries({
          queryKey: lessonsQueryKey,
          refetchType: 'active',
        });
      },
    },
  );

  /**
   * Handle local reorder - stores pending order without saving to API
   */
  const handleLocalReorder = useCallback((orderedIds: number[]) => {
    setPendingOrder(orderedIds);
  }, []);

  /**
   * Save pending order to API
   */
  const saveReorder = useCallback(() => {
    if (!pendingOrder) return;

    const request = buildReorderRequest(pendingOrder);

    reorderMutation.mutate({
      params: {
        path: {
          slug: courseSlug,
        },
      },
      body: request,
    });
  }, [pendingOrder, courseSlug, reorderMutation]);

  /**
   * Discard pending changes
   */
  const discardReorder = useCallback(() => {
    setPendingOrder(null);
  }, []);

  /**
   * Get reorder state with computed properties
   */
  const getReorderState = useCallback(
    (lessons: Lesson[] | undefined): LessonReorderState => {
      const originalOrder = getOriginalOrder(lessons);

      // Determine if there are unsaved changes
      const hasUnsavedChanges =
        pendingOrder !== null && !arraysEqual(pendingOrder, originalOrder);

      // Compute display lessons based on pending order or original
      let displayLessons: Lesson[] = [];
      if (lessons) {
        if (pendingOrder) {
          displayLessons = reorderLessonsInCache(lessons, pendingOrder);
        } else {
          displayLessons = [...lessons].sort(
            (a, b) => a.lessonNumber - b.lessonNumber,
          );
        }
      }

      return {
        pendingOrder,
        hasUnsavedChanges,
        displayLessons,
      };
    },
    [pendingOrder],
  );

  /**
   * Reset pending order when lessons change externally (e.g., after refetch)
   */
  const resetPendingOrder = useCallback(() => {
    setPendingOrder(null);
  }, []);

  return {
    handleLocalReorder,
    saveReorder,
    discardReorder,
    getReorderState,
    resetPendingOrder,
    isReordering: reorderMutation.isPending,
  };
};

export default useLessonReorder;
export type UseLessonReorder = ReturnType<typeof useLessonReorder>;
