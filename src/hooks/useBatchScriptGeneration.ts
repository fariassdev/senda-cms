import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { toast } from 'sonner';

import { $api } from '@/lib/api';
import type { BatchScriptResponse, Lesson } from '@/types/models';

/**
 * Status for each lesson in a batch generation operation
 */
export type LessonBatchStatus =
  | 'pending'
  | 'generating'
  | 'completed'
  | 'failed';

/**
 * Error info for a failed lesson
 */
export interface LessonError {
  errorType: string;
  errorMessage: string;
}

/**
 * State structure for batch generation tracking
 */
export interface BatchState {
  lessonStatuses: Record<number, LessonBatchStatus>;
  lessonErrors: Record<number, LessonError>;
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
 * API Response type for batch script generation
 */

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
 * Uses useQuery with staleTime: Infinity for state persistence across navigation.
 *
 * @param courseSlug - The course slug to generate scripts for
 */
const useBatchScriptGeneration = (courseSlug: string) => {
  const queryClient = useQueryClient();
  const BATCH_QUERY_KEY = getBatchQueryKey(courseSlug);

  // Use useQuery with staleTime: Infinity for persistent batch state
  // This ensures state survives navigation and won't be garbage collected
  // We use enabled: false because we manage state via setQueryData, not fetching
  const { data: batchState } = useQuery<BatchState | null>({
    queryKey: BATCH_QUERY_KEY,
    queryFn: () => null, // Never actually called due to enabled: false
    staleTime: Infinity,
    gcTime: Infinity,
    enabled: false, // We only use this for cache storage, not fetching
    initialData: null,
  });

  // Batch mutation using the batch endpoint
  const batchMutation = $api.useMutation(
    'post',
    '/api/courses/{slug}/generate-batch-scripts',
  );

  // Update batch state in React Query cache
  const updateBatchState = useCallback(
    (newState: BatchState | undefined) => {
      if (newState) {
        queryClient.setQueryData(BATCH_QUERY_KEY, newState);
      } else {
        queryClient.removeQueries({ queryKey: BATCH_QUERY_KEY });
      }
    },
    [queryClient, BATCH_QUERY_KEY],
  );

  /**
   * Process batch response and update state with individual lesson results
   */
  const processBatchResponse = useCallback(
    (
      response: BatchScriptResponse,
      lessonIds: number[],
      startTime: number,
    ): BatchState => {
      const lessonStatuses: Record<number, LessonBatchStatus> = {};
      const lessonErrors: Record<number, LessonError> = {};

      // Mark successful lessons
      for (const result of response.generated_scripts) {
        lessonStatuses[result.lesson_id] = 'completed';
      }

      // Mark failed lessons with error details
      if (response.errors) {
        for (const error of response.errors) {
          lessonStatuses[error.lesson_id] = 'failed';
          lessonErrors[error.lesson_id] = {
            errorType: error.error_type,
            errorMessage: error.error_message,
          };
        }
      }

      // Mark any remaining lessons as pending (shouldn't happen, but safety)
      for (const id of lessonIds) {
        if (!(id in lessonStatuses)) {
          lessonStatuses[id] = 'pending';
        }
      }

      return {
        lessonStatuses,
        lessonErrors,
        totalCount: lessonIds.length,
        completedCount: response.successful_generations,
        failedCount: response.errors?.length ?? 0,
        isActive: false,
        startTime,
      };
    },
    [],
  );

  /**
   * Start batch generation for selected lessons
   */
  const generateBatch = useCallback(
    async (lessonIds: number[]) => {
      if (lessonIds.length === 0) return;

      const startTime = Date.now();

      // Initialize batch state with all lessons as 'generating'
      const initialStatuses: Record<number, LessonBatchStatus> = {};
      for (const id of lessonIds) {
        initialStatuses[id] = 'generating';
      }

      const initialState: BatchState = {
        lessonStatuses: initialStatuses,
        lessonErrors: {},
        totalCount: lessonIds.length,
        completedCount: 0,
        failedCount: 0,
        isActive: true,
        startTime,
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
        const response = await batchMutation.mutateAsync({
          params: { path: { slug: courseSlug } },
          body: { lesson_ids: lessonIds },
        });

        // Process the structured response
        const completedState = processBatchResponse(
          response,
          lessonIds,
          startTime,
        );
        updateBatchState(completedState);

        // Invalidate lessons query to refresh data
        await queryClient.invalidateQueries({
          queryKey: ['get', '/api/courses/{slug}/lessons'],
        });

        // Show appropriate toast based on results
        if (completedState.failedCount === 0) {
          toast.success(
            `✅ ${completedState.completedCount} scripts generated successfully!`,
          );
        } else if (completedState.completedCount > 0) {
          toast.warning(
            `⚠️ ${completedState.completedCount} succeeded, ${completedState.failedCount} failed`,
          );
        } else {
          toast.error(
            `❌ All ${completedState.failedCount} generations failed`,
          );
        }
      } catch (error) {
        // On complete API failure, mark all as failed
        const failedStatuses: Record<number, LessonBatchStatus> = {};
        const lessonErrors: Record<number, LessonError> = {};
        const errorMessage =
          error instanceof Error ? error.message : 'Unknown error';

        for (const id of lessonIds) {
          failedStatuses[id] = 'failed';
          lessonErrors[id] = {
            errorType: 'NetworkError',
            errorMessage,
          };
        }

        const failedState: BatchState = {
          lessonStatuses: failedStatuses,
          lessonErrors,
          totalCount: lessonIds.length,
          completedCount: 0,
          failedCount: lessonIds.length,
          isActive: false,
          startTime,
        };

        updateBatchState(failedState);

        toast.error('Batch generation failed. Please try again.');
        console.error('Batch generation error:', error);
      }
    },
    [
      courseSlug,
      queryClient,
      batchMutation,
      updateBatchState,
      processBatchResponse,
    ],
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

    const startTime = Date.now();

    // Update failed lessons to 'generating' status, keep successful ones
    const updatedStatuses = { ...batchState.lessonStatuses };
    for (const id of failedIds) {
      updatedStatuses[id] = 'generating';
    }

    const retryState: BatchState = {
      ...batchState,
      lessonStatuses: updatedStatuses,
      lessonErrors: {}, // Clear previous errors
      failedCount: 0,
      isActive: true,
      startTime,
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
      const response = await batchMutation.mutateAsync({
        params: { path: { slug: courseSlug } },
        body: { lesson_ids: failedIds },
      });

      // Process response for retry
      const retryResult = processBatchResponse(response, failedIds, startTime);

      // Merge retry results with previously successful lessons
      const mergedStatuses = { ...batchState.lessonStatuses };
      const mergedErrors = { ...retryResult.lessonErrors };

      for (const id of failedIds) {
        mergedStatuses[id] = retryResult.lessonStatuses[id] ?? 'failed';
      }

      const completedCount = Object.values(mergedStatuses).filter(
        (s) => s === 'completed',
      ).length;
      const failedCount = Object.values(mergedStatuses).filter(
        (s) => s === 'failed',
      ).length;

      const completedState: BatchState = {
        lessonStatuses: mergedStatuses,
        lessonErrors: mergedErrors,
        totalCount: batchState.totalCount,
        completedCount,
        failedCount,
        isActive: false,
        startTime: batchState.startTime,
      };

      updateBatchState(completedState);

      await queryClient.invalidateQueries({
        queryKey: ['get', '/api/courses/{slug}/lessons'],
      });

      if (retryResult.failedCount === 0) {
        toast.success(
          `✅ ${retryResult.completedCount} scripts generated successfully!`,
        );
      } else {
        toast.warning(
          `⚠️ ${retryResult.completedCount} succeeded, ${retryResult.failedCount} still failed`,
        );
      }
    } catch (error) {
      // Keep the merged state with previous successes, mark retried as failed
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      const mergedErrors: Record<number, LessonError> = {};

      for (const id of failedIds) {
        mergedErrors[id] = {
          errorType: 'NetworkError',
          errorMessage,
        };
      }

      const failedState: BatchState = {
        ...retryState,
        lessonErrors: mergedErrors,
        failedCount: failedIds.length,
        isActive: false,
      };

      updateBatchState(failedState);

      toast.error('Retry failed. Please try again.');
      console.error('Batch retry error:', error);
    }
  }, [
    batchState,
    courseSlug,
    queryClient,
    batchMutation,
    updateBatchState,
    processBatchResponse,
  ]);

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
};

export default useBatchScriptGeneration;
export type UseBatchScriptGeneration = ReturnType<
  typeof useBatchScriptGeneration
>;
