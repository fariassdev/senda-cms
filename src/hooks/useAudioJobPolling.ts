import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';

import { $api } from '@/lib/api';
import type {
  AudioGenerationJobStatusResponse,
  AudioGenerationStatusResponse,
  LessonStatus,
} from '@/types/models';

/** Query key for in-flight audio generation job metadata per lesson */
export const audioGenerationJobQueryKey = (lessonId: number) =>
  ['audio-generation-job', lessonId] as const;

export interface AudioGenerationJobCache {
  jobId: string;
  playlistUrl: string;
}

/** Reactive read of cached in-flight job metadata for a lesson */
export function useLessonAudioJob(lessonId: number) {
  const { data } = useQuery<AudioGenerationJobCache | null>({
    queryKey: audioGenerationJobQueryKey(lessonId),
    queryFn: () => null,
    staleTime: Infinity,
    gcTime: Infinity,
    enabled: false,
    initialData: null,
  });

  return data;
}

/**
 * Restores in-flight job metadata after a page reload while audio is generating.
 */
export function useRestoreGeneratingAudioJob({
  lessonId,
  courseSlug,
  lessonStatus,
}: {
  lessonId: number;
  courseSlug: string;
  lessonStatus: LessonStatus;
}) {
  const queryClient = useQueryClient();
  const cachedJob = useLessonAudioJob(lessonId);
  const shouldRestore = lessonStatus === 'AUDIO_GENERATING' && !cachedJob;

  const { data, isLoading, isFetching } = $api.useQuery(
    'get',
    '/api/courses/{slug}/lessons/{id}/audio-status',
    {
      params: {
        path: {
          slug: courseSlug,
          id: lessonId,
        },
      },
    },
    {
      enabled: shouldRestore,
      refetchInterval: (query: {
        state: { data?: AudioGenerationStatusResponse | undefined };
      }) => {
        const statusData = query.state.data;
        if (
          statusData?.active_job_id &&
          statusData.playlist_url &&
          lessonStatus === 'AUDIO_GENERATING'
        ) {
          return false;
        }
        return lessonStatus === 'AUDIO_GENERATING' ? 2000 : false;
      },
    },
  );

  useEffect(() => {
    if (!data?.active_job_id || !data.playlist_url) {
      return;
    }

    queryClient.setQueryData<AudioGenerationJobCache>(
      audioGenerationJobQueryKey(lessonId),
      {
        jobId: data.active_job_id,
        playlistUrl: data.playlist_url,
      },
    );
  }, [data, lessonId, queryClient]);

  return {
    isRestoring: shouldRestore && (isLoading || isFetching),
    restoredJob: cachedJob,
    status: data?.status,
  };
}

const ACTIVE_JOB_STATUSES = new Set(['PENDING', 'GENERATING']);

/**
 * Polls an HLS audio generation job until at least one segment is available.
 */
export function useAudioJobPolling({
  jobId,
  enabled,
}: {
  jobId: string | undefined;
  enabled: boolean;
}) {
  const { data, isError } = $api.useQuery(
    'get',
    '/api/jobs/{job_id}/status',
    {
      params: {
        path: {
          job_id: jobId ?? '',
        },
      },
    },
    {
      enabled: enabled && !!jobId,
      refetchInterval: (query: {
        state: { data?: AudioGenerationJobStatusResponse | undefined };
      }) => {
        const status = query.state.data?.status;

        if (!status || status === 'FAILED' || status === 'COMPLETED') {
          return false;
        }

        return 2000;
      },
    },
  );

  const segmentsAvailable = data?.segments_available ?? 0;
  const status = data?.status;

  return {
    segmentsReady: segmentsAvailable >= 1,
    segmentsAvailable,
    availableDurationMs: data?.available_duration_ms ?? 0,
    estimatedTotalDurationMs: data?.estimated_total_duration_ms ?? 0,
    jobStatus: status,
    isJobCompleted: status === 'COMPLETED',
    playlistUrl: data?.playlist_url,
    errorMessage: data?.error_message,
    isFailed: status === 'FAILED',
    isPolling: enabled && !!jobId && ACTIVE_JOB_STATUSES.has(status ?? ''),
    isError,
  };
}
