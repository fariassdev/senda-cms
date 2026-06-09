import { useCallback, useMemo } from 'react';

import { useAudioPlayer } from '@/contexts/AudioPlayerContext';
import {
  useLessonAudioJob,
  useRestoreGeneratingAudioJob,
} from '@/hooks/useAudioJobPolling';

import type { LessonStatus } from '@/types/models';

import type { PlayButtonProps, UsePlayButtonConnectResult } from './types';

/**
 * Statuses that indicate audio may be available for HLS playback
 */
const PLAYABLE_STATUSES = ['AUDIO_COMPLETED', 'AUDIO_GENERATING'] as const;

/**
 * Hook to manage PlayButton state and behavior
 */
const useConnect = ({
  lesson,
  courseSlug,
}: PlayButtonProps): UsePlayButtonConnectResult => {
  const { currentLesson, isPlaying, isLoading, setCurrentLesson, togglePlay } =
    useAudioPlayer();

  const { isRestoring } = useRestoreGeneratingAudioJob({
    lessonId: lesson.id,
    courseSlug,
    lessonStatus: lesson.status as LessonStatus,
  });

  const activeJob = useLessonAudioJob(lesson.id);

  const playlistUrl = lesson.playlistUrl ?? activeJob?.playlistUrl ?? null;
  const isGenerating = lesson.status === 'AUDIO_GENERATING';
  const isCurrentLesson = currentLesson?.id === lesson.id;

  const canPlay = useMemo(() => {
    if (
      !PLAYABLE_STATUSES.includes(
        lesson.status as (typeof PLAYABLE_STATUSES)[number],
      )
    ) {
      return false;
    }

    if (isGenerating) {
      return !!playlistUrl && !isRestoring;
    }

    return !!playlistUrl;
  }, [lesson.status, isGenerating, playlistUrl, isRestoring]);

  const isCurrentlyPlaying = useMemo(
    () => isCurrentLesson && isPlaying,
    [isCurrentLesson, isPlaying],
  );

  const isLoadingPlayback = useMemo(
    () => isRestoring || (isCurrentLesson && isLoading && !isCurrentlyPlaying),
    [isRestoring, isCurrentLesson, isLoading, isCurrentlyPlaying],
  );

  const handleClick = useCallback(() => {
    if (isCurrentLesson) {
      togglePlay();
      return;
    }

    setCurrentLesson({ ...lesson, playlistUrl }, { jobId: activeJob?.jobId });
  }, [
    isCurrentLesson,
    togglePlay,
    setCurrentLesson,
    lesson,
    playlistUrl,
    activeJob?.jobId,
  ]);

  const ariaLabel = useMemo(() => {
    if (isLoadingPlayback) {
      return `Preparing audio for ${lesson.title}`;
    }
    if (!canPlay) {
      return `No audio available for ${lesson.title}`;
    }
    if (isCurrentlyPlaying) {
      return `Pause ${lesson.title}`;
    }
    if (isCurrentLesson) {
      return `Resume ${lesson.title}`;
    }
    return `Play ${lesson.title}`;
  }, [
    isLoadingPlayback,
    canPlay,
    isCurrentlyPlaying,
    isCurrentLesson,
    lesson.title,
  ]);

  const tooltipText = useMemo(() => {
    if (isLoadingPlayback) {
      return isRestoring
        ? 'Restoring live stream...'
        : 'Waiting for first audio segment';
    }
    if (!canPlay) {
      return isGenerating ? 'Preparing live stream...' : 'Generate audio first';
    }
    if (isCurrentlyPlaying) {
      return 'Pause';
    }
    if (isCurrentLesson) {
      return 'Resume';
    }
    if (isGenerating) {
      return 'Play live preview';
    }
    return 'Play audio';
  }, [
    isLoadingPlayback,
    isRestoring,
    canPlay,
    isGenerating,
    isCurrentlyPlaying,
    isCurrentLesson,
  ]);

  return {
    canPlay,
    isCurrentlyPlaying,
    isLoadingPlayback,
    handleClick,
    ariaLabel,
    tooltipText,
  };
};

export default useConnect;
