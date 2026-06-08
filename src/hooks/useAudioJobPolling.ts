import { useQuery } from '@tanstack/react-query';

import { $api } from '@/lib/api';
import type { components } from '@/types/api';

type JobStatusResponse =
  components['schemas']['AudioGenerationJobStatusResponse'];

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
  const { data, isError } = $api.useQuery('get', '/api/jobs/{job_id}/status', {
    params: {
      path: {
        job_id: jobId ?? '',
      },
    },
    enabled: enabled && !!jobId,
    refetchInterval: (query: {
      state: { data?: JobStatusResponse | undefined };
    }) => {
      const status = query.state.data?.status;
      const segments = query.state.data?.segments_available ?? 0;

      if (!status || status === 'FAILED' || status === 'COMPLETED') {
        return false;
      }

      if (segments >= 1) {
        return false;
      }

      return 2000;
    },
  });

  const segmentsAvailable = data?.segments_available ?? 0;
  const status = data?.status;

  return {
    segmentsReady: segmentsAvailable >= 1,
    segmentsAvailable,
    jobStatus: status,
    playlistUrl: data?.playlist_url,
    errorMessage: data?.error_message,
    isFailed: status === 'FAILED',
    isPolling: enabled && !!jobId && ACTIVE_JOB_STATUSES.has(status ?? ''),
    isError,
  };
}
