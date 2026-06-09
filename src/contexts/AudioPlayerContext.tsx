'use client';

import { useQueryClient } from '@tanstack/react-query';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import {
  audioGenerationJobQueryKey,
  type AudioGenerationJobCache,
  useAudioJobPolling,
} from '@/hooks/useAudioJobPolling';
import { useHlsPlayer } from '@/hooks/useHlsPlayer';
import {
  getBufferedEnd,
  getFiniteDuration,
  getMaxSeekTime,
} from '@/lib/audioPlayback';
import type { Lesson } from '@/types/models';

/**
 * Playback speed options available for the audio player
 */
export const PLAYBACK_SPEEDS = [0.75, 1.0, 1.25, 1.5, 2.0] as const;
export type PlaybackSpeed = (typeof PLAYBACK_SPEEDS)[number];

export interface SetCurrentLessonOptions {
  /** Active generation job id when playing a live HLS stream */
  jobId?: string;
}

/**
 * Audio player state managed by the context
 */
interface AudioPlayerState {
  /** Whether audio is currently playing */
  isPlaying: boolean;
  /** Currently loaded lesson (null if no audio loaded) */
  currentLesson: Lesson | null;
  /** HLS playlist URL for the active lesson */
  playlistUrl: string | null;
  /** Whether the stream is still being generated (live HLS) */
  isLiveGenerating: boolean;
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
  /** Whether audio is currently loading or buffering */
  isLoading: boolean;
}

/**
 * Audio player controls exposed by the context
 */
interface AudioPlayerControls {
  /** Set the current lesson and start playback */
  setCurrentLesson: (lesson: Lesson, options?: SetCurrentLessonOptions) => void;
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
  const queryClient = useQueryClient();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentLesson, setCurrentLessonState] = useState<Lesson | null>(null);
  const [activeJobId, setActiveJobId] = useState<string | undefined>();
  const [playlistUrl, setPlaylistUrl] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [speed, setSpeedState] = useState<PlaybackSpeed>(1.0);
  const [isMinimized, setIsMinimized] = useState(false);
  const [playbackError, setPlaybackError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [playbackKey, setPlaybackKey] = useState(0);

  const previousVolumeRef = useRef(1);
  const hasAutoPlayedRef = useRef(false);

  const isLiveGenerating = currentLesson?.status === 'AUDIO_GENERATING';

  const {
    segmentsReady,
    isFailed: isJobFailed,
    errorMessage: jobErrorMessage,
    playlistUrl: polledPlaylistUrl,
  } = useAudioJobPolling({
    jobId: activeJobId,
    enabled: isLiveGenerating && !!activeJobId,
  });

  const resolvedPlaylistUrl =
    polledPlaylistUrl ?? playlistUrl ?? currentLesson?.playlistUrl ?? undefined;

  const waitForSegments = isLiveGenerating && !!activeJobId && !segmentsReady;

  const handleHlsReady = useCallback(() => {
    setIsLoading(false);

    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = volume;
    audio.muted = isMuted;
    audio.playbackRate = speed;

    if (hasAutoPlayedRef.current) {
      return;
    }

    hasAutoPlayedRef.current = true;

    if (isLiveGenerating) {
      audio.currentTime = 0;
    }

    audio.play().catch((error) => {
      console.error('Auto-play error:', error);
    });
  }, [volume, isMuted, speed, isLiveGenerating]);

  const handleHlsFatalError = useCallback((message: string) => {
    setIsLoading(false);
    setIsPlaying(false);
    setPlaybackError(message);
  }, []);

  const handleBufferingChange = useCallback((buffering: boolean) => {
    setIsLoading(buffering);
  }, []);

  useHlsPlayer({
    audioRef,
    playlistUrl: resolvedPlaylistUrl,
    enabled: !!currentLesson && !playbackError,
    isGenerating: isLiveGenerating,
    waitForSegments,
    onReady: handleHlsReady,
    onFatalError: handleHlsFatalError,
    onBufferingChange: handleBufferingChange,
  });

  useEffect(() => {
    hasAutoPlayedRef.current = false;
  }, [playbackKey]);

  const setCurrentLesson = useCallback(
    (lesson: Lesson, options?: SetCurrentLessonOptions) => {
      const cachedJob = queryClient.getQueryData<AudioGenerationJobCache>(
        audioGenerationJobQueryKey(lesson.id),
      );

      const jobId = options?.jobId ?? cachedJob?.jobId;
      const nextPlaylistUrl =
        lesson.playlistUrl ?? cachedJob?.playlistUrl ?? null;

      setCurrentLessonState(lesson);
      setActiveJobId(jobId);
      setPlaylistUrl(nextPlaylistUrl);
      setPlaybackError(null);
      setProgress(0);
      setDuration(0);
      setIsLoading(true);
      setIsMinimized(false);
      setPlaybackKey((key) => key + 1);
    },
    [queryClient],
  );

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

  const seek = useCallback(
    (time: number) => {
      const audio = audioRef.current;
      if (!audio) return;

      const maxTime = getMaxSeekTime(audio, isLiveGenerating);
      if (maxTime <= 0) {
        return;
      }

      const clampedTime = Math.max(0, Math.min(time, maxTime));
      audio.currentTime = clampedTime;
      setProgress(clampedTime);
    },
    [isLiveGenerating],
  );

  const setVolume = useCallback((newVolume: number) => {
    const audio = audioRef.current;
    const clampedVolume = Math.max(0, Math.min(1, newVolume));

    setVolumeState(clampedVolume);
    if (audio) {
      audio.volume = clampedVolume;
    }

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
    setActiveJobId(undefined);
    setPlaylistUrl(null);
    setIsPlaying(false);
    setProgress(0);
    setDuration(0);
    setPlaybackError(null);
    setIsMinimized(false);
    setIsLoading(false);
  }, []);

  const retryPlayback = useCallback(() => {
    if (!currentLesson) return;

    setPlaybackError(null);
    setIsLoading(true);
    setPlaybackKey((key) => key + 1);
  }, [currentLesson]);

  const clearError = useCallback(() => {
    setPlaybackError(null);
  }, []);

  const handleTimeUpdate = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    setProgress(audio.currentTime);

    if (isLiveGenerating) {
      const seekableEnd = getBufferedEnd(audio);
      if (seekableEnd > 0) {
        setDuration(seekableEnd);
      }
      return;
    }

    const finiteDuration = getFiniteDuration(audio);
    if (finiteDuration > 0) {
      setDuration(finiteDuration);
    }
  }, [isLiveGenerating]);

  const handleLoadedMetadata = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isLiveGenerating) {
      const seekableEnd = getBufferedEnd(audio);
      if (seekableEnd > 0) {
        setDuration(seekableEnd);
      }
      return;
    }

    const finiteDuration = getFiniteDuration(audio);
    if (finiteDuration > 0) {
      setDuration(finiteDuration);
    }
  }, [isLiveGenerating]);

  const handlePlay = useCallback(() => {
    setIsPlaying(true);
    setIsLoading(false);
  }, []);

  const handlePause = useCallback(() => {
    setIsPlaying(false);
  }, []);

  const handleEnded = useCallback(() => {
    setIsPlaying(false);
  }, []);

  const handleError = useCallback(() => {
    setIsLoading(false);
    setIsPlaying(false);
    setPlaybackError('Unable to play audio. Please try again.');
  }, []);

  const value = useMemo<AudioPlayerContextValue>(
    () => ({
      isPlaying,
      currentLesson,
      playlistUrl: resolvedPlaylistUrl ?? null,
      isLiveGenerating,
      progress,
      duration,
      volume,
      isMuted,
      speed,
      isMinimized,
      playbackError,
      isLoading: isLoading || waitForSegments,
      audioRef,
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
    }),
    [
      isPlaying,
      currentLesson,
      resolvedPlaylistUrl,
      isLiveGenerating,
      progress,
      duration,
      volume,
      isMuted,
      speed,
      isMinimized,
      playbackError,
      isLoading,
      waitForSegments,
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
    ],
  );

  useEffect(() => {
    if (isJobFailed && isLiveGenerating && jobErrorMessage && !playbackError) {
      setPlaybackError(jobErrorMessage);
      setIsLoading(false);
      setIsPlaying(false);
    }
  }, [isJobFailed, isLiveGenerating, jobErrorMessage, playbackError]);

  return (
    <AudioPlayerContext.Provider value={value}>
      {children}
      {currentLesson && !playbackError && (
        <audio
          key={playbackKey}
          ref={audioRef}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onDurationChange={handleLoadedMetadata}
          onPlay={handlePlay}
          onPause={handlePause}
          onEnded={handleEnded}
          onError={handleError}
          preload="auto"
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
