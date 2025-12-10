import { useQueryClient } from '@tanstack/react-query';
import { useRef } from 'react';
import { toast } from 'sonner';

import { $api } from '@/lib/api';
import type { Lesson } from '@/types/models';

interface ApiError {
  detail?: Array<{ loc: (string | number)[]; msg: string; type: string }>;
}

interface LessonsQueryData {
  lessons?: Lesson[];
}

/**
 * Hook for script generation mutation logic
 */
export function useScriptGeneration({
  courseSlug,
  lessonId,
}: {
  courseSlug: string;
  lessonId: number;
}) {
  const queryClient = useQueryClient();
  // Store previous data for rollback on error
  const previousDataRef = useRef<LessonsQueryData | undefined>(undefined);

  const generateMutation = $api.useMutation(
    'post',
    '/api/courses/{slug}/lessons/{id}/generate-script',
    {
      onMutate: async () => {
        toast.info('Script generation started...');

        await queryClient.cancelQueries({
          queryKey: ['get', '/api/courses/{slug}/lessons'],
        });

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
        await queryClient.invalidateQueries({
          queryKey: ['get', '/api/courses/{slug}/lessons'],
        });
      },
      onError: (error: ApiError) => {
        if (previousDataRef.current) {
          queryClient.setQueriesData<LessonsQueryData>(
            { queryKey: ['get', '/api/courses/{slug}/lessons'] },
            previousDataRef.current,
          );
        }

        const errorMessage =
          error.detail?.[0]?.msg ||
          'Failed to start script generation. Please try again.';
        toast.error(errorMessage);
        console.error('Script generation error:', error);
      },
    },
  );

  const generateScript = () => {
    generateMutation.mutate({
      params: {
        path: {
          slug: courseSlug,
          id: lessonId,
        },
      },
    });
  };

  return {
    generateScript,
    isGenerating: generateMutation.isPending,
  };
}

export default useScriptGeneration;
