import { useQueryClient } from '@tanstack/react-query';
import { useCallback, useEffect, useState } from 'react';
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
 * Manages batch generation state and calls the batch endpoint.
 * Progress simulation is handled by the modal component for performance.
 *
 * @param courseSlug - The course slug to generate scripts for
 * @param lessons - Current lessons data for status synchronization
 */
export function useBatchScriptGeneration(
  courseSlug: string,
  _lessons: Lesson[] | undefined,
) {
  const queryClient = useQueryClient();
  const BATCH_QUERY_KEY = getBatchQueryKey(courseSlug);

  // State for reactive updates
  const [batchState, setBatchState] = useState<BatchState | undefined>(
    undefined,
  );

  // Batch mutation using the batch endpoint
  const batchMutation = $api.useMutation(
    'post',
    '/api/courses/{slug}/generate-batch-scripts',
  );

  // Sync state from cache on mount
  useEffect(() => {
    const cachedState = queryClient.getQueryData<BatchState>(BATCH_QUERY_KEY);
    if (cachedState) {
      setBatchState(cachedState);
    }
  }, [queryClient, BATCH_QUERY_KEY]);

  // Update both local state and cache
  const updateBatchState = useCallback(
    (newState: BatchState | undefined) => {
      setBatchState(newState);
      if (newState) {
        queryClient.setQueryData(BATCH_QUERY_KEY, newState);
      } else {
        queryClient.removeQueries({ queryKey: BATCH_QUERY_KEY });
      }
    },
    [queryClient, BATCH_QUERY_KEY],
  );

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

      // Store state
      updateBatchState(initialState);

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
        // Call batch endpoint - this blocks until all are generated
        await batchMutation.mutateAsync({
          params: { path: { slug: courseSlug } },
          body: { lesson_ids: lessonIds },
        });

        // API returned successfully - mark all as completed
        const completedStatuses: Record<number, LessonBatchStatus> = {};
        for (const id of lessonIds) {
          completedStatuses[id] = 'completed';
        }

        const completedState: BatchState = {
          lessonStatuses: completedStatuses,
          totalCount: lessonIds.length,
          completedCount: lessonIds.length,
          failedCount: 0,
          isActive: false, // Mark as not active so modal shows complete view
          startTime: initialState.startTime,
        };

        updateBatchState(completedState);

        // Invalidate lessons query to refresh data
        await queryClient.invalidateQueries({
          queryKey: ['get', '/api/courses/{slug}/lessons'],
        });

        toast.success(`✅ ${lessonIds.length} scripts generated successfully!`);
      } catch (error) {
        // On error, mark all as failed
        const failedStatuses: Record<number, LessonBatchStatus> = {};
        for (const id of lessonIds) {
          failedStatuses[id] = 'failed';
        }

        const failedState: BatchState = {
          lessonStatuses: failedStatuses,
          totalCount: lessonIds.length,
          completedCount: 0,
          failedCount: lessonIds.length,
          isActive: false,
          startTime: initialState.startTime,
        };

        updateBatchState(failedState);

        toast.error('Batch generation failed. Please try again.');
        console.error('Batch generation error:', error);
      }
    },
    [courseSlug, queryClient, batchMutation, updateBatchState],
  );

  /**
   * Retry only the failed lessons from the previous batch
   */
  const retryFailed = useCallback(async () => {
    if (!batchState) return;

    const failedIds = Object.entries(batchState.lessonStatuses)
      .filter(([, status]) => status === 'failed')
      .map(([id]) => Number(id));

    if (failedIds.length === 0) return;

    // Update failed lessons to 'generating' status
    const updatedStatuses = { ...batchState.lessonStatuses };
    for (const id of failedIds) {
      updatedStatuses[id] = 'generating';
    }

    const retryState: BatchState = {
      ...batchState,
      lessonStatuses: updatedStatuses,
      failedCount: 0,
      isActive: true,
    };

    updateBatchState(retryState);

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
      await batchMutation.mutateAsync({
        params: { path: { slug: courseSlug } },
        body: { lesson_ids: failedIds },
      });

      // Mark retried lessons as completed
      const completedStatuses = { ...batchState.lessonStatuses };
      for (const id of failedIds) {
        completedStatuses[id] = 'completed';
      }

      const completedCount = Object.values(completedStatuses).filter(
        (s) => s === 'completed',
      ).length;

      const completedState: BatchState = {
        ...batchState,
        lessonStatuses: completedStatuses,
        completedCount,
        failedCount: 0,
        isActive: false,
      };

      updateBatchState(completedState);

      await queryClient.invalidateQueries({
        queryKey: ['get', '/api/courses/{slug}/lessons'],
      });

      toast.success(`✅ ${failedIds.length} scripts generated successfully!`);
    } catch (error) {
      toast.error('Retry failed. Please try again.');
      console.error('Batch retry error:', error);
    }
  }, [batchState, courseSlug, queryClient, batchMutation, updateBatchState]);

  /**
   * Clear batch state (after completion or manual dismissal)
   */
  const clearBatchState = useCallback(() => {
    updateBatchState(undefined);
  }, [updateBatchState]);

  return {
    generateBatch,
    retryFailed,
    clearBatchState,
    batchState,
    isGeneratingBatch: batchMutation.isPending,
  };
}

export default useBatchScriptGeneration;
