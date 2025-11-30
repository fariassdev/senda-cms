import { useQueryClient } from '@tanstack/react-query';
import { useCallback, useState } from 'react';
import { toast } from 'sonner';

import { $api } from '@/lib/api';
import type { Lesson } from '@/types/models';

import { TOAST_MESSAGES } from './constants';
import type {
  LessonReorderContext,
  LessonReorderState,
  ReorderParams,
  UseLessonReorderOptions,
} from './types';

/**
 * Reorder lessons based on new ordered IDs
 */
function reorderLessonsInCache(
  lessons: Lesson[] | undefined,
  orderedIds: number[],
): Lesson[] {
  if (!lessons) return [];

  return orderedIds.map((id, index) => {
    const lesson = lessons.find((l) => l.id === id);
    if (!lesson) {
      throw new Error(`Lesson ${id} not found`);
    }
    return { ...lesson, lessonNumber: index + 1 };
  });
}

/**
 * Build request body from reordered lessons
 */
function buildReorderRequest(orderedIds: number[]): ReorderParams {
  return {
    lessons: orderedIds.map((id, index) => ({
      lesson_id: id,
      lesson_number: index + 1,
    })),
  };
}

/**
 * Get the original order of lesson IDs from lessons sorted by lessonNumber
 */
function getOriginalOrder(lessons: Lesson[] | undefined): number[] {
  if (!lessons) return [];
  return [...lessons]
    .sort((a, b) => a.lessonNumber - b.lessonNumber)
    .map((l) => l.id);
}

/**
 * Check if two arrays of IDs are in the same order
 */
function arraysEqual(a: number[], b: number[]): boolean {
  if (a.length !== b.length) return false;
  return a.every((val, idx) => val === b[idx]);
}

export default function useLessonReorder({
  courseSlug,
  onSuccess,
}: UseLessonReorderOptions) {
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
}

export { reorderLessonsInCache, buildReorderRequest, getOriginalOrder };
