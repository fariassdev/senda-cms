import { useQueryClient } from '@tanstack/react-query';
import { useRef } from 'react';
import { toast } from 'sonner';

import { $api } from '@/lib/api';
import type { Lesson } from '@/types/models';

import type { ScriptConfigFormData } from './constants';
import { DEFAULT_SCRIPT_CONFIG } from './constants';
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
 * Hook for script generation mutation logic
 * Follows container pattern: all business logic in connect.ts
 */
export function useScriptGeneration({
  courseSlug,
  lessonId,
}: UseScriptGenerationProps): UseScriptGenerationReturn {
  const queryClient = useQueryClient();
  // Store previous data for rollback on error
  const previousDataRef = useRef<LessonsQueryData | undefined>(undefined);
  // Store current config for toast message
  const currentConfigRef = useRef<ScriptConfigFormData | undefined>(undefined);

  const mutation = $api.useMutation(
    'post',
    '/api/courses/{slug}/lessons/{id}/generate-script',
    {
      onMutate: async () => {
        // Show toast immediately when mutation starts
        const isDefaultConfig =
          !currentConfigRef.current ||
          (currentConfigRef.current.tone === DEFAULT_SCRIPT_CONFIG.tone &&
            !currentConfigRef.current.instructions);

        toast.info(
          isDefaultConfig
            ? 'Script generation started with default settings...'
            : 'Script generation started...',
        );

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

  const generateScript = (config?: ScriptConfigFormData) => {
    // Store config reference for toast message
    currentConfigRef.current = config;

    mutation.mutate({
      params: {
        path: {
          slug: courseSlug,
          id: lessonId,
        },
      },
      // NOTE: Backend API does not yet support configuration body.
      // Configuration is prepared in UI for future backend enhancement.
      // When backend adds requestBody support, uncomment:
      // body: config ? {
      //   tone: config.tone,
      //   target_duration: config.target_duration,
      //   instructions: config.instructions || undefined,
      // } : undefined,
    });
  };

  return {
    generateScript,
    isGenerating: mutation.isPending,
  };
}

export default useScriptGeneration;
