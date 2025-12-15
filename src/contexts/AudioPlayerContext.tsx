'use client';

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from 'react';

import type { Lesson } from '@/types/models';

/**
 * Playback speed options available for the audio player
 */
export const PLAYBACK_SPEEDS = [0.75, 1.0, 1.25, 1.5, 2.0] as const;
export type PlaybackSpeed = (typeof PLAYBACK_SPEEDS)[number];

/**
 * Audio player state managed by the context
 */
interface AudioPlayerState {
  /** Whether audio is currently playing */
  isPlaying: boolean;
  /** Currently loaded lesson (null if no audio loaded) */
  currentLesson: Lesson | null;
  /** Current playback progress in seconds */
  progress: number;
  /** Total duration of current audio in seconds */
  duration: number;
  /** Volume level 0-1 */
  volume: number;
  /** Whether audio is muted */
  isMuted: boolean;
  /** Playback speed multiplier */
  speed: PlaybackSpeed;
  /** Whether player UI is minimized */
  isMinimized: boolean;
  /** Playback error message if any */
  playbackError: string | null;
  /** Whether audio is currently loading */
  isLoading: boolean;
}

/**
 * Audio player controls exposed by the context
 */
interface AudioPlayerControls {
  /** Set the current lesson and start playback */
  setCurrentLesson: (lesson: Lesson) => void;
  /** Toggle play/pause */
  togglePlay: () => void;
  /** Play audio */
  play: () => void;
  /** Pause audio */
  pause: () => void;
  /** Seek to a specific time in seconds */
  seek: (time: number) => void;
  /** Set volume (0-1) */
  setVolume: (volume: number) => void;
  /** Toggle mute */
  toggleMute: () => void;
  /** Set playback speed */
  setSpeed: (speed: PlaybackSpeed) => void;
  /** Toggle minimized state */
  toggleMinimized: () => void;
  /** Close/dismiss the player */
  closePlayer: () => void;
  /** Retry playback after error */
  retryPlayback: () => void;
  /** Clear error state */
  clearError: () => void;
}

interface AudioPlayerContextValue
  extends AudioPlayerState,
    AudioPlayerControls {
  /** Reference to the audio element for direct access if needed */
  audioRef: React.RefObject<HTMLAudioElement | null>;
}

const AudioPlayerContext = createContext<AudioPlayerContextValue | null>(null);

interface AudioPlayerProviderProps {
  children: React.ReactNode;
}

/**
 * Provider component for the global audio player state
 * Must be placed in ClientLayout.tsx to ensure single audio source across navigation
 */
export function AudioPlayerProvider({ children }: AudioPlayerProviderProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Player state
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentLesson, setCurrentLessonState] = useState<Lesson | null>(null);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [speed, setSpeedState] = useState<PlaybackSpeed>(1.0);
  const [isMinimized, setIsMinimized] = useState(false);
  const [playbackError, setPlaybackError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Store previous volume for unmute
  const previousVolumeRef = useRef(1);

  const setCurrentLesson = useCallback((lesson: Lesson) => {
    setCurrentLessonState(lesson);
    setPlaybackError(null);
    setProgress(0);
    setIsLoading(true);
    setIsMinimized(false);

    // Audio will start playing via onCanPlay event
  }, []);

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch((error) => {
        console.error('Play error:', error);
        setPlaybackError('Unable to play audio. Please try again.');
      });
    }
  }, [isPlaying]);

  const play = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.play().catch((error) => {
      console.error('Play error:', error);
      setPlaybackError('Unable to play audio. Please try again.');
    });
  }, []);

  const pause = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.pause();
  }, []);

  const seek = useCallback((time: number) => {
    const audio = audioRef.current;
    if (!audio) return;

    const clampedTime = Math.max(0, Math.min(time, audio.duration || 0));
    audio.currentTime = clampedTime;
    setProgress(clampedTime);
  }, []);

  const setVolume = useCallback((newVolume: number) => {
    const audio = audioRef.current;
    const clampedVolume = Math.max(0, Math.min(1, newVolume));

    setVolumeState(clampedVolume);
    if (audio) {
      audio.volume = clampedVolume;
    }

    // If setting volume above 0, unmute
    if (clampedVolume > 0) {
      setIsMuted(false);
      if (audio) {
        audio.muted = false;
      }
    }

    previousVolumeRef.current =
      clampedVolume > 0 ? clampedVolume : previousVolumeRef.current;
  }, []);

  const toggleMute = useCallback(() => {
    const audio = audioRef.current;

    setIsMuted((prev) => {
      const newMuted = !prev;
      if (audio) {
        audio.muted = newMuted;
      }
      return newMuted;
    });
  }, []);

  const setSpeed = useCallback((newSpeed: PlaybackSpeed) => {
    const audio = audioRef.current;

    setSpeedState(newSpeed);
    if (audio) {
      audio.playbackRate = newSpeed;
    }
  }, []);

  const toggleMinimized = useCallback(() => {
    setIsMinimized((prev) => !prev);
  }, []);

  const closePlayer = useCallback(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }

    setCurrentLessonState(null);
    setIsPlaying(false);
    setProgress(0);
    setDuration(0);
    setPlaybackError(null);
    setIsMinimized(false);
  }, []);

  const retryPlayback = useCallback(() => {
    if (!currentLesson) return;

    // Clear the error - this will cause the audio element to re-render
    // in the normal (non-error) state, which will trigger a fresh load
    setPlaybackError(null);
    setIsLoading(true);
  }, [currentLesson]);

  const clearError = useCallback(() => {
    setPlaybackError(null);
  }, []);

  // Audio event handlers (will be attached to audio element in AudioPlayer component)
  const handleTimeUpdate = useCallback(() => {
    const audio = audioRef.current;
    if (audio) {
      setProgress(audio.currentTime);
    }
  }, []);

  const handleLoadedMetadata = useCallback(() => {
    const audio = audioRef.current;
    if (audio) {
      setDuration(audio.duration);
    }
  }, []);

  const handleCanPlay = useCallback(() => {
    const audio = audioRef.current;
    setIsLoading(false);

    if (audio) {
      // Apply current settings
      audio.volume = volume;
      audio.muted = isMuted;
      audio.playbackRate = speed;

      // Auto-play when audio is ready
      audio.play().catch((error) => {
        console.error('Auto-play error:', error);
        // Don't set error for auto-play fail, user can click play
      });
    }
  }, [volume, isMuted, speed]);

  const handlePlay = useCallback(() => {
    setIsPlaying(true);
  }, []);

  const handlePause = useCallback(() => {
    setIsPlaying(false);
  }, []);

  const handleEnded = useCallback(() => {
    setIsPlaying(false);
    // Keep player open for replay
  }, []);

  const handleError = useCallback(() => {
    setIsLoading(false);
    setIsPlaying(false);
    setPlaybackError('Unable to play audio. Please try again.');
  }, []);

  const handleLoadStart = useCallback(() => {
    setIsLoading(true);
    setPlaybackError(null);
  }, []);

  const value = useMemo<AudioPlayerContextValue>(
    () => ({
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
      audioRef,
      // Controls
      setCurrentLesson,
      togglePlay,
      play,
      pause,
      seek,
      setVolume,
      toggleMute,
      setSpeed,
      toggleMinimized,
      closePlayer,
      retryPlayback,
      clearError,
      // Event handlers exposed for AudioPlayer component
      _handleTimeUpdate: handleTimeUpdate,
      _handleLoadedMetadata: handleLoadedMetadata,
      _handleCanPlay: handleCanPlay,
      _handlePlay: handlePlay,
      _handlePause: handlePause,
      _handleEnded: handleEnded,
      _handleError: handleError,
      _handleLoadStart: handleLoadStart,
    }),
    [
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
      setCurrentLesson,
      togglePlay,
      play,
      pause,
      seek,
      setVolume,
      toggleMute,
      setSpeed,
      toggleMinimized,
      closePlayer,
      retryPlayback,
      clearError,
      handleTimeUpdate,
      handleLoadedMetadata,
      handleCanPlay,
      handlePlay,
      handlePause,
      handleEnded,
      handleError,
      handleLoadStart,
    ],
  );

  // Get audio URL from current lesson
  const audioUrl = currentLesson?.audioUrl ?? undefined;

  return (
    <AudioPlayerContext.Provider value={value}>
      {children}
      {/* Audio element rendered in Provider to persist across navigation */}
      {currentLesson && !playbackError && (
        <audio
          ref={audioRef}
          src={audioUrl}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onCanPlay={handleCanPlay}
          onPlay={handlePlay}
          onPause={handlePause}
          onEnded={handleEnded}
          onError={handleError}
          onLoadStart={handleLoadStart}
          preload="metadata"
          style={{ display: 'none' }}
        />
      )}
    </AudioPlayerContext.Provider>
  );
}

/**
 * Hook to access the audio player context
 * @throws Error if used outside of AudioPlayerProvider
 */
export function useAudioPlayer(): AudioPlayerContextValue {
  const context = useContext(AudioPlayerContext);

  if (!context) {
    throw new Error(
      'useAudioPlayer must be used within an AudioPlayerProvider',
    );
  }

  return context;
}

/**
 * Type for internal event handlers (used by AudioPlayer component)
 */
export interface AudioPlayerEventHandlers {
  _handleTimeUpdate: () => void;
  _handleLoadedMetadata: () => void;
  _handleCanPlay: () => void;
  _handlePlay: () => void;
  _handlePause: () => void;
  _handleEnded: () => void;
  _handleError: () => void;
  _handleLoadStart: () => void;
}
