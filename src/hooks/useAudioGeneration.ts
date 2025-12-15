import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { $api } from '@/lib/api';
import type { components } from '@/types/api';
import type { Lesson } from '@/types/models';

/**
 * Audio configuration for generation request
 * Matches AudioConfigRequest schema from API
 */
export type AudioConfigRequest = components['schemas']['AudioConfigRequest'];

interface ApiError {
  detail?: Array<{ loc: (string | number)[]; msg: string; type: string }>;
}

interface LessonsQueryData {
  lessons?: Lesson[];
}

/**
 * Hook for audio generation mutation logic
 * On error, invalidates the lessons query to refresh from server state.
 */
const useAudioGeneration = ({
  courseSlug,
  lessonId,
}: {
  courseSlug: string;
  lessonId: number;
}) => {
  const queryClient = useQueryClient();

  const generateMutation = $api.useMutation(
    'post',
    '/api/courses/{slug}/lessons/{id}/generate-audio',
    {
      onMutate: async () => {
        toast.info('Audio generation started...');

        await queryClient.cancelQueries({
          queryKey: ['get', '/api/courses/{slug}/lessons'],
        });

        // Optimistically update to AUDIO_GENERATING
        queryClient.setQueriesData<LessonsQueryData>(
          { queryKey: ['get', '/api/courses/{slug}/lessons'] },
          (old) => {
            if (!old?.lessons) return old;
            return {
              ...old,
              lessons: old.lessons.map((lesson) =>
                lesson.id === lessonId
                  ? { ...lesson, status: 'AUDIO_GENERATING' }
                  : lesson,
              ),
            };
          },
        );
      },
      onSuccess: async () => {
        // Note: Success toast is handled by polling mechanism (Story 3.6)
        // when status changes to COMPLETED. Do NOT add toast here.
        await queryClient.invalidateQueries({
          queryKey: ['get', '/api/courses/{slug}/lessons'],
        });
      },
      onError: async (error: ApiError) => {
        // Invalidate queries to refresh from server state
        // This avoids race conditions with polling updates from other lessons
        await queryClient.invalidateQueries({
          queryKey: ['get', '/api/courses/{slug}/lessons'],
        });

        const errorMessage =
          error.detail?.[0]?.msg ||
          'Failed to start audio generation. Please try again.';
        toast.error(errorMessage);
        console.error('Audio generation error:', error);
      },
    },
  );

  /**
   * Trigger audio generation with optional configuration
   * @param config - Optional voice and speed settings
   */
  const generateAudio = (config?: AudioConfigRequest) => {
    generateMutation.mutate({
      params: {
        path: {
          slug: courseSlug,
          id: lessonId,
        },
      },
      body: config ? { audio_config: config } : undefined,
    });
  };

  return {
    generateAudio,
    isGenerating: generateMutation.isPending,
  };
};

export default useAudioGeneration;
export type UseAudioGeneration = ReturnType<typeof useAudioGeneration>;
