import { useCallback, useMemo } from 'react';

import { useAudioPlayer } from '@/contexts/AudioPlayerContext';

import type { PlayButtonProps, UsePlayButtonConnectResult } from './types';

/**
 * Statuses that indicate audio is available for playback
 */
const PLAYABLE_STATUSES = ['AUDIO_COMPLETED'] as const;

/**
 * Hook to manage PlayButton state and behavior
 */
const useConnect = ({
  lesson,
}: PlayButtonProps): UsePlayButtonConnectResult => {
  const { currentLesson, isPlaying, setCurrentLesson, togglePlay } =
    useAudioPlayer();

  // Check if this lesson can be played (has audio)
  const canPlay = useMemo(
    () =>
      PLAYABLE_STATUSES.includes(
        lesson.status as (typeof PLAYABLE_STATUSES)[number],
      ) && !!lesson.audioUrl,
    [lesson.status, lesson.audioUrl],
  );

  // Check if this is the currently playing lesson
  const isCurrentlyPlaying = useMemo(
    () => currentLesson?.id === lesson.id && isPlaying,
    [currentLesson?.id, lesson.id, isPlaying],
  );

  // Check if this lesson is loaded (but maybe paused)
  const isCurrentLesson = currentLesson?.id === lesson.id;

  // Handle click: start playing or toggle play/pause
  const handleClick = useCallback(() => {
    if (isCurrentLesson) {
      // Already loaded, toggle play/pause
      togglePlay();
    } else {
      // Load and play this lesson
      setCurrentLesson(lesson);
    }
  }, [isCurrentLesson, togglePlay, setCurrentLesson, lesson]);

  // Dynamic labels based on state
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
      return 'Generate audio first';
    }
    if (isCurrentlyPlaying) {
      return 'Pause';
    }
    if (isCurrentLesson) {
      return 'Resume';
    }
    return 'Play audio';
  }, [canPlay, isCurrentlyPlaying, isCurrentLesson]);

  return {
    canPlay,
    isCurrentlyPlaying,
    handleClick,
    ariaLabel,
    tooltipText,
  };
};

export default useConnect;
