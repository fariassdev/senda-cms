import { useQueryClient } from '@tanstack/react-query';
import { useCallback, useEffect } from 'react';

import {
  useAudioJobPolling,
  useLessonAudioJob,
  useRestoreGeneratingAudioJob,
} from '@/hooks/useAudioJobPolling';
import { useScriptJobPolling } from '@/hooks/useScriptJobPolling';
import type { LessonStatus } from '@/types/models';

export interface UseLessonStatusPollingProps {
  courseSlug: string;
  lessonId: number;
  status: LessonStatus;
}

/**
 * Hook to poll and track generation status for a specific lesson.
 * Consolidates polling for both script and audio generation, and
 * triggers a single lessons list refetch when generation completes.
 */
export function useLessonStatusPolling({
  courseSlug,
  lessonId,
  status,
}: UseLessonStatusPollingProps) {
  const queryClient = useQueryClient();

  const handleComplete = useCallback(async () => {
    await queryClient.invalidateQueries({
      queryKey: ['get', '/api/courses/{slug}/lessons'],
    });
  }, [queryClient]);

  const isScriptGenerating = status === 'SCRIPT_GENERATING';
  useScriptJobPolling({
    courseSlug,
    lessonId,
    enabled: isScriptGenerating,
    onComplete: handleComplete,
  });

  const isAudioGenerating = status === 'AUDIO_GENERATING';

  const { status: restoredStatus } = useRestoreGeneratingAudioJob({
    lessonId,
    courseSlug,
    lessonStatus: status,
  });

  const finishedRestoration =
    isAudioGenerating &&
    restoredStatus &&
    restoredStatus !== 'AUDIO_GENERATING';

  useEffect(() => {
    if (finishedRestoration) {
      handleComplete();
    }
  }, [finishedRestoration, handleComplete]);

  const cachedJob = useLessonAudioJob(lessonId);
  const jobId = cachedJob?.jobId;

  const { isJobCompleted, isFailed } = useAudioJobPolling({
    jobId,
    enabled: isAudioGenerating && !!jobId,
  });

  useEffect(() => {
    if (isAudioGenerating && jobId && (isJobCompleted || isFailed)) {
      handleComplete();
    }
  }, [isAudioGenerating, jobId, isJobCompleted, isFailed, handleComplete]);
}
