import { useCallback, useEffect } from 'react';

import {
  type PlaybackSpeed,
  useAudioPlayer,
} from '@/contexts/AudioPlayerContext';

import {
  KEYBOARD_SHORTCUTS,
  PLAYER_HEIGHT,
  SEEK_AMOUNT,
  VOLUME_STEP,
} from './constants';
import type { UseAudioPlayerConnectResult } from './types';

/**
 * Format seconds to mm:ss or hh:mm:ss format
 */
function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) {
    return '0:00';
  }

  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  if (hrs > 0) {
    return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Hook to manage AudioPlayer state and behavior
 * Follows the connect pattern - separates logic from presentation
 * Note: Audio element is now rendered in AudioPlayerProvider for navigation persistence
 */
const useConnect = (): UseAudioPlayerConnectResult => {
  const {
    isPlaying,
    currentLesson,
    progress,
    duration,
    volume,
    isMuted,
    speed,
    isMinimized,
    playbackError,
    isLoading,
    togglePlay,
    seek,
    setVolume,
    toggleMute,
    setSpeed,
    toggleMinimized,
    closePlayer,
    retryPlayback,
  } = useAudioPlayer();

  // Calculate derived values
  const progressPercent = duration > 0 ? (progress / duration) * 100 : 0;
  const formattedCurrentTime = formatTime(progress);
  const formattedDuration = formatTime(duration);

  // Determine container height based on state (using constants)
  const containerHeight = playbackError
    ? 'auto'
    : isMinimized
      ? `${PLAYER_HEIGHT.minimized}px`
      : `${PLAYER_HEIGHT.expanded}px`;

  // Aria label for the player region
  const ariaLabel = playbackError
    ? 'Audio player error'
    : isMinimized
      ? 'Audio player minimized'
      : 'Audio player';

  // Handle keyboard shortcuts
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      // Don't handle shortcuts if focused on input elements
      const target = event.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        return;
      }

      switch (event.key) {
        case KEYBOARD_SHORTCUTS.PLAY_PAUSE:
          event.preventDefault();
          togglePlay();
          break;
        case KEYBOARD_SHORTCUTS.SEEK_BACKWARD:
          event.preventDefault();
          seek(Math.max(0, progress - SEEK_AMOUNT));
          break;
        case KEYBOARD_SHORTCUTS.SEEK_FORWARD:
          event.preventDefault();
          seek(Math.min(duration, progress + SEEK_AMOUNT));
          break;
        case KEYBOARD_SHORTCUTS.TOGGLE_MUTE:
        case KEYBOARD_SHORTCUTS.TOGGLE_MUTE.toUpperCase():
          event.preventDefault();
          toggleMute();
          break;
        case KEYBOARD_SHORTCUTS.VOLUME_UP:
          event.preventDefault();
          setVolume(Math.min(1, volume + VOLUME_STEP));
          break;
        case KEYBOARD_SHORTCUTS.VOLUME_DOWN:
          event.preventDefault();
          setVolume(Math.max(0, volume - VOLUME_STEP));
          break;
      }
    },
    [togglePlay, seek, progress, duration, toggleMute, setVolume, volume],
  );

  // Attach keyboard listener when player is active and functional
  useEffect(() => {
    // Don't attach listener if no lesson or player is in error state
    if (!currentLesson || playbackError) return;

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentLesson, playbackError, handleKeyDown]);

  // Handle progress bar change
  const handleProgressChange = useCallback(
    (value: number[]) => {
      const newProgress = ((value[0] ?? 0) / 100) * duration;
      seek(newProgress);
    },
    [duration, seek],
  );

  // Handle volume change
  const handleVolumeChange = useCallback(
    (value: number[]) => {
      setVolume((value[0] ?? 0) / 100);
    },
    [setVolume],
  );

  // Handle speed change
  const handleSpeedChange = useCallback(
    (value: string) => {
      setSpeed(parseFloat(value) as PlaybackSpeed);
    },
    [setSpeed],
  );

  return {
    // State
    isPlaying,
    currentLesson,
    progress,
    duration,
    volume,
    isMuted,
    speed,
    isMinimized,
    playbackError,
    isLoading,

    // Derived values
    progressPercent,
    formattedCurrentTime,
    formattedDuration,
    containerHeight,
    ariaLabel,

    // Controls
    togglePlay,
    seek,
    setVolume,
    toggleMute,
    setSpeed,
    toggleMinimized,
    closePlayer,
    retryPlayback,

    // Handlers
    handleProgressChange,
    handleVolumeChange,
    handleSpeedChange,
  };
};

export default useConnect;
