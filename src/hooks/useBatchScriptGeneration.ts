import { useQueryClient } from '@tanstack/react-query';
import { useCallback, useEffect } from 'react';
import { toast } from 'sonner';

import { $api } from '@/lib/api';
import type { Lesson } from '@/types/models';

/**
 * Status for each lesson in a batch generation operation
 */
export type LessonBatchStatus =
  | 'pending'
  | 'generating'
  | 'completed'
  | 'failed';

/**
 * State structure for batch generation tracking
 */
export interface BatchState {
  lessonStatuses: Record<number, LessonBatchStatus>;
  totalCount: number;
  completedCount: number;
  failedCount: number;
  isActive: boolean;
  startTime?: number;
}

/**
 * Query data structure for lessons
 */
interface LessonsQueryData {
  lessons?: Lesson[];
}

/**
 * Query key for batch generation state
 */
const getBatchQueryKey = (courseSlug: string) =>
  ['batch-generation', courseSlug] as const;

/**
 * Hook for batch script generation
 *
 * Manages batch generation state, calls the batch endpoint, and syncs
 * individual lesson statuses via existing polling (Story 3.6).
 *
 * @param courseSlug - The course slug to generate scripts for
 * @param lessons - Current lessons data for status synchronization
 */
export function useBatchScriptGeneration(
  courseSlug: string,
  lessons: Lesson[] | undefined,
) {
  const queryClient = useQueryClient();
  const BATCH_QUERY_KEY = getBatchQueryKey(courseSlug);

  // Batch mutation using the batch endpoint
  const batchMutation = $api.useMutation(
    'post',
    '/api/courses/{slug}/generate-batch-scripts',
  );

  // Get fresh batch state from cache
  const getBatchState = useCallback((): BatchState | undefined => {
    return queryClient.getQueryData<BatchState>(BATCH_QUERY_KEY);
  }, [queryClient, BATCH_QUERY_KEY]);

  // Sync batch statuses with lesson statuses from polling
  useEffect(() => {
    if (!lessons) return;

    const currentBatchState = getBatchState();
    if (!currentBatchState?.isActive) return;

    let hasChanges = false;
    const updatedStatuses = { ...currentBatchState.lessonStatuses };
    let completedCount = 0;
    let failedCount = 0;

    // Sync each lesson's status
    for (const lessonId of Object.keys(updatedStatuses)) {
      const id = Number(lessonId);
      const lesson = lessons.find((l) => l.id === id);
      if (!lesson) continue;

      const currentBatchStatus = updatedStatuses[id];

      // Map lesson status to batch status
      let newBatchStatus: LessonBatchStatus;
      if (
        lesson.status === 'SCRIPT_COMPLETED' ||
        lesson.status === 'AUDIO_GENERATING' ||
        lesson.status === 'AUDIO_COMPLETED'
      ) {
        newBatchStatus = 'completed';
        completedCount++;
      } else if (lesson.status === 'SCRIPT_FAILED') {
        newBatchStatus = 'failed';
        failedCount++;
      } else if (lesson.status === 'SCRIPT_GENERATING') {
        newBatchStatus = 'generating';
      } else {
        newBatchStatus = currentBatchStatus || 'pending';
        if (newBatchStatus === 'completed') completedCount++;
        if (newBatchStatus === 'failed') failedCount++;
      }

      if (updatedStatuses[id] !== newBatchStatus) {
        updatedStatuses[id] = newBatchStatus;
        hasChanges = true;
      }
    }

    // Update cache if statuses changed
    if (hasChanges) {
      const allDone = Object.values(updatedStatuses).every(
        (status) => status === 'completed' || status === 'failed',
      );

      const newState: BatchState = {
        ...currentBatchState,
        lessonStatuses: updatedStatuses,
        completedCount,
        failedCount,
        isActive: !allDone,
      };

      queryClient.setQueryData(BATCH_QUERY_KEY, newState);

      // Show completion toast when batch finishes
      if (allDone && currentBatchState.isActive) {
        const successCount = completedCount;
        const failCount = failedCount;

        if (failCount === 0) {
          toast.success(`✅ ${successCount} scripts generated successfully`);
        } else {
          toast.info(
            `Batch complete: ${successCount} succeeded, ${failCount} failed`,
          );
        }
      }
    }
  }, [lessons, getBatchState, queryClient, BATCH_QUERY_KEY]);

  /**
   * Start batch generation for selected lessons
   */
  const generateBatch = useCallback(
    async (lessonIds: number[]) => {
      if (lessonIds.length === 0) return;

      // Initialize batch state with all lessons as 'generating'
      const initialStatuses: Record<number, LessonBatchStatus> = {};
      for (const id of lessonIds) {
        initialStatuses[id] = 'generating';
      }

      const initialState: BatchState = {
        lessonStatuses: initialStatuses,
        totalCount: lessonIds.length,
        completedCount: 0,
        failedCount: 0,
        isActive: true,
        startTime: Date.now(),
      };

      // Store state in React Query cache with staleTime: Infinity for persistence
      queryClient.setQueryData(BATCH_QUERY_KEY, initialState);

      // Optimistically update lessons to SCRIPT_GENERATING
      queryClient.setQueriesData<LessonsQueryData>(
        { queryKey: ['get', '/api/courses/{slug}/lessons'] },
        (old) => {
          if (!old?.lessons) return old;
          return {
            ...old,
            lessons: old.lessons.map((lesson) =>
              lessonIds.includes(lesson.id)
                ? { ...lesson, status: 'SCRIPT_GENERATING' }
                : lesson,
            ),
          };
        },
      );

      toast.info(`Batch generation started for ${lessonIds.length} lessons...`);

      try {
        // Call batch endpoint with specific lesson IDs
        await batchMutation.mutateAsync({
          params: { path: { slug: courseSlug } },
          body: { lesson_ids: lessonIds },
        });

        // Invalidate lessons query to trigger polling
        await queryClient.invalidateQueries({
          queryKey: ['get', '/api/courses/{slug}/lessons'],
        });
      } catch (error) {
        // On error, mark all as failed
        const failedState: BatchState = {
          ...initialState,
          lessonStatuses: Object.fromEntries(
            lessonIds.map((id) => [id, 'failed' as LessonBatchStatus]),
          ),
          failedCount: lessonIds.length,
          isActive: false,
        };
        queryClient.setQueryData(BATCH_QUERY_KEY, failedState);

        toast.error('Batch generation failed. Please try again.');
        console.error('Batch generation error:', error);
      }
    },
    [courseSlug, queryClient, BATCH_QUERY_KEY, batchMutation],
  );

  /**
   * Retry only the failed lessons from the previous batch
   */
  const retryFailed = useCallback(async () => {
    const currentState = getBatchState();
    if (!currentState) return;

    const failedIds = Object.entries(currentState.lessonStatuses)
      .filter(([, status]) => status === 'failed')
      .map(([id]) => Number(id));

    if (failedIds.length === 0) return;

    // Update failed lessons to 'generating' status
    const updatedStatuses = { ...currentState.lessonStatuses };
    for (const id of failedIds) {
      updatedStatuses[id] = 'generating';
    }

    queryClient.setQueryData<BatchState>(BATCH_QUERY_KEY, {
      ...currentState,
      lessonStatuses: updatedStatuses,
      failedCount: 0,
      isActive: true,
    });

    // Optimistically update lessons to SCRIPT_GENERATING
    queryClient.setQueriesData<LessonsQueryData>(
      { queryKey: ['get', '/api/courses/{slug}/lessons'] },
      (old) => {
        if (!old?.lessons) return old;
        return {
          ...old,
          lessons: old.lessons.map((lesson) =>
            failedIds.includes(lesson.id)
              ? { ...lesson, status: 'SCRIPT_GENERATING' }
              : lesson,
          ),
        };
      },
    );

    toast.info(`Retrying ${failedIds.length} failed lessons...`);

    try {
      // Call batch endpoint with only the failed lesson IDs
      await batchMutation.mutateAsync({
        params: { path: { slug: courseSlug } },
        body: { lesson_ids: failedIds },
      });

      await queryClient.invalidateQueries({
        queryKey: ['get', '/api/courses/{slug}/lessons'],
      });
    } catch (error) {
      toast.error('Retry failed. Please try again.');
      console.error('Batch retry error:', error);
    }
  }, [getBatchState, courseSlug, queryClient, BATCH_QUERY_KEY, batchMutation]);

  /**
   * Clear batch state (after completion or manual dismissal)
   */
  const clearBatchState = useCallback(() => {
    queryClient.removeQueries({ queryKey: BATCH_QUERY_KEY });
  }, [queryClient, BATCH_QUERY_KEY]);

  return {
    generateBatch,
    retryFailed,
    clearBatchState,
    batchState: getBatchState(),
    isGeneratingBatch: batchMutation.isPending,
  };
}

export default useBatchScriptGeneration;
