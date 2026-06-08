import { useCallback, useMemo } from 'react';

import { useAudioPlayer } from '@/contexts/AudioPlayerContext';
import { useLessonAudioJob } from '@/hooks/useAudioJobPolling';

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
}: PlayButtonProps): UsePlayButtonConnectResult => {
  const { currentLesson, isPlaying, setCurrentLesson, togglePlay } =
    useAudioPlayer();

  const activeJob = useLessonAudioJob(lesson.id);

  const playlistUrl = lesson.playlistUrl ?? activeJob?.playlistUrl ?? null;

  const canPlay = useMemo(
    () =>
      PLAYABLE_STATUSES.includes(
        lesson.status as (typeof PLAYABLE_STATUSES)[number],
      ) && !!playlistUrl,
    [lesson.status, playlistUrl],
  );

  const isCurrentlyPlaying = useMemo(
    () => currentLesson?.id === lesson.id && isPlaying,
    [currentLesson?.id, lesson.id, isPlaying],
  );

  const isCurrentLesson = currentLesson?.id === lesson.id;

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
  }, [canPlay, isCurrentlyPlaying, isCurrentLesson, lesson.title]);

  const tooltipText = useMemo(() => {
    if (!canPlay) {
      return lesson.status === 'AUDIO_GENERATING'
        ? 'Waiting for first audio segment'
        : 'Generate audio first';
    }
    if (isCurrentlyPlaying) {
      return 'Pause';
    }
    if (isCurrentLesson) {
      return 'Resume';
    }
    if (lesson.status === 'AUDIO_GENERATING') {
      return 'Play live preview';
    }
    return 'Play audio';
  }, [canPlay, isCurrentlyPlaying, isCurrentLesson, lesson.status]);

  return {
    canPlay,
    isCurrentlyPlaying,
    handleClick,
    ariaLabel,
    tooltipText,
  };
};

export default useConnect;
