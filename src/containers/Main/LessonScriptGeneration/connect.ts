import { useQueryClient } from '@tanstack/react-query';
import { useRef } from 'react';
import { toast } from 'sonner';

import { $api } from '@/lib/api';
import type { Lesson } from '@/types/models';

import type { LessonEditFormData, ScriptConfigFormData } from './constants';
import type {
  UseScriptGenerationProps,
  UseScriptGenerationReturn,
} from './types';

interface ApiError {
  detail?: Array<{ loc: (string | number)[]; msg: string; type: string }>;
}

interface LessonsQueryData {
  lessons?: Lesson[];
}

/**
 * Return type for the extended script generation hook
 */
export interface UseScriptGenerationExtendedReturn
  extends UseScriptGenerationReturn {
  updateAndGenerateScript: (data: LessonEditFormData) => Promise<void>;
  isUpdating: boolean;
}

/**
 * Hook for script generation mutation logic
 * Follows container pattern: all business logic in connect.ts
 */
export function useScriptGeneration({
  courseSlug,
  lessonId,
}: UseScriptGenerationProps): UseScriptGenerationExtendedReturn {
  const queryClient = useQueryClient();
  // Store previous data for rollback on error
  const previousDataRef = useRef<LessonsQueryData | undefined>(undefined);

  // Mutation for updating lesson data (PUT /api/courses/{slug}/lessons/{id})
  const updateMutation = $api.useMutation(
    'put',
    '/api/courses/{slug}/lessons/{id}',
    {
      onSuccess: async () => {
        // Invalidate to refetch fresh data from server
        await queryClient.invalidateQueries({
          queryKey: ['get', '/api/courses/{slug}/lessons'],
        });
      },
      onError: (error: ApiError) => {
        const errorMessage =
          error.detail?.[0]?.msg ||
          'Failed to update lesson. Please try again.';
        toast.error(errorMessage);
        console.error('Lesson update error:', error);
      },
    },
  );

  // Mutation for generating script
  const generateMutation = $api.useMutation(
    'post',
    '/api/courses/{slug}/lessons/{id}/generate-script',
    {
      onMutate: async () => {
        // Show toast immediately when mutation starts
        toast.info('Script generation started...');

        // Cancel any outgoing refetches to avoid overwriting optimistic update
        await queryClient.cancelQueries({
          queryKey: ['get', '/api/courses/{slug}/lessons'],
        });

        // Snapshot the previous value for potential rollback
        const queries = queryClient.getQueriesData<LessonsQueryData>({
          queryKey: ['get', '/api/courses/{slug}/lessons'],
        });
        if (queries.length > 0 && queries[0]) {
          previousDataRef.current = queries[0][1];
        }

        // Optimistically update to SCRIPT_GENERATING
        queryClient.setQueriesData<LessonsQueryData>(
          { queryKey: ['get', '/api/courses/{slug}/lessons'] },
          (old) => {
            if (!old?.lessons) return old;
            return {
              ...old,
              lessons: old.lessons.map((lesson) =>
                lesson.id === lessonId
                  ? { ...lesson, status: 'SCRIPT_GENERATING' }
                  : lesson,
              ),
            };
          },
        );
      },
      onSuccess: async () => {
        // Invalidate to refetch fresh data from server
        await queryClient.invalidateQueries({
          queryKey: ['get', '/api/courses/{slug}/lessons'],
        });
      },
      onError: (error: ApiError) => {
        // Rollback to previous data on error
        if (previousDataRef.current) {
          queryClient.setQueriesData<LessonsQueryData>(
            { queryKey: ['get', '/api/courses/{slug}/lessons'] },
            previousDataRef.current,
          );
        }

        // Extract error message from API error structure
        const errorMessage =
          error.detail?.[0]?.msg ||
          'Failed to start script generation. Please try again.';
        toast.error(errorMessage);
        console.error('Script generation error:', error);
      },
    },
  );

  const generateScript = (_config?: ScriptConfigFormData) => {
    generateMutation.mutate({
      params: {
        path: {
          slug: courseSlug,
          id: lessonId,
        },
      },
      // NOTE: Backend API does not yet support configuration body.
      // The lesson already contains all needed data (tone, corePractice, keyPoint, etc.)
    });
  };

  const updateAndGenerateScript = async (
    data: LessonEditFormData,
  ): Promise<void> => {
    // First update the lesson
    toast.info('Saving lesson changes...');

    await updateMutation.mutateAsync({
      params: {
        path: {
          slug: courseSlug,
          id: lessonId,
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

    toast.success('Lesson updated successfully');

    // Then generate the script
    generateScript();
  };

  return {
    generateScript,
    updateAndGenerateScript,
    isGenerating: generateMutation.isPending,
    isUpdating: updateMutation.isPending,
  };
}

export default useScriptGeneration;
