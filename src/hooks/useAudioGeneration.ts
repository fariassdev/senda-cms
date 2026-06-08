import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import {
  audioGenerationJobQueryKey,
  type AudioGenerationJobCache,
} from '@/hooks/useAudioJobPolling';
import { $api } from '@/lib/api';
import type { components } from '@/types/api';
import type { Lesson } from '@/types/models';

/**
 * Audio configuration for generation request
 * Matches AudioConfigRequest schema from API
 */
export type AudioConfigRequest = components['schemas']['AudioConfigRequest'];

type StartAudioGenerationResponse =
  components['schemas']['StartAudioGenerationResponse'];

interface ApiError {
  detail?: Array<{ loc: (string | number)[]; msg: string; type: string }>;
}

interface LessonsQueryData {
  lessons?: Lesson[];
}

/**
 * Hook for async HLS audio generation (HTTP 202).
 * Stores job metadata for live playback while segments are produced.
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
      onSuccess: async (data: StartAudioGenerationResponse) => {
        const jobCache: AudioGenerationJobCache = {
          jobId: data.job_id,
          playlistUrl: data.playlist_url,
        };

        queryClient.setQueryData(
          audioGenerationJobQueryKey(lessonId),
          jobCache,
        );

        queryClient.setQueriesData<LessonsQueryData>(
          { queryKey: ['get', '/api/courses/{slug}/lessons'] },
          (old) => {
            if (!old?.lessons) return old;
            return {
              ...old,
              lessons: old.lessons.map((lesson) =>
                lesson.id === lessonId
                  ? {
                      ...lesson,
                      status: 'AUDIO_GENERATING',
                      playlistUrl: data.playlist_url,
                    }
                  : lesson,
              ),
            };
          },
        );

        await queryClient.invalidateQueries({
          queryKey: ['get', '/api/courses/{slug}/lessons'],
        });
      },
      onError: async (error: ApiError) => {
        await queryClient.invalidateQueries({
          queryKey: ['get', '/api/courses/{slug}/lessons'],
        });

        queryClient.removeQueries({
          queryKey: audioGenerationJobQueryKey(lessonId),
        });

        const errorMessage =
          error.detail?.[0]?.msg ||
          'Failed to start audio generation. Please try again.';
        toast.error(errorMessage);
        console.error('Audio generation error:', error);
      },
    },
  );

  /** Trigger audio generation */
  const generateAudio = (config: AudioConfigRequest) => {
    generateMutation.mutate({
      params: {
        path: {
          slug: courseSlug,
          id: lessonId,
        },
      },
      body: { audio_config: config },
    });
  };

  return {
    generateAudio,
    isGenerating: generateMutation.isPending,
  };
};

export default useAudioGeneration;
export type UseAudioGeneration = ReturnType<typeof useAudioGeneration>;
