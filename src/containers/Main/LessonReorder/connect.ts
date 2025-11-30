import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { $api } from '@/lib/api';
import type { Lesson } from '@/types/models';

import { TOAST_MESSAGES } from './constants';
import type {
  LessonReorderContext,
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

export default function useLessonReorder({
  courseSlug,
  onSuccess,
}: UseLessonReorderOptions) {
  const queryClient = useQueryClient();

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

  const handleReorderLessons = (orderedIds: number[]) => {
    const request = buildReorderRequest(orderedIds);

    reorderMutation.mutate({
      params: {
        path: {
          slug: courseSlug,
        },
      },
      body: request,
    });
  };

  return {
    handleReorderLessons,
    isReordering: reorderMutation.isPending,
  };
}

export { reorderLessonsInCache, buildReorderRequest };
