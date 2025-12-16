import type { PlaybackSpeed } from '@/contexts/AudioPlayerContext';
import type { Lesson } from '@/types/models';

/**
 * Props for the AudioPlayer component
 */
export interface AudioPlayerProps {
  /** Additional CSS classes */
  className?: string;
}

/**
 * Result from the useConnect hook
 * Note: Audio element event handlers are no longer needed here
 * as the audio element is rendered in AudioPlayerProvider
 */
export interface UseAudioPlayerConnectResult {
  // State
  /** Whether audio is currently playing */
  isPlaying: boolean;
  /** Currently loaded lesson (guaranteed to exist when hook returns non-null) */
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

  // Derived values
  /** Progress as percentage (0-100) */
  progressPercent: number;
  /** Current time formatted as mm:ss */
  formattedCurrentTime: string;
  /** Duration formatted as mm:ss */
  formattedDuration: string;
  /** Container height based on state */
  containerHeight: string;
  /** Aria label for the player region */
  ariaLabel: string;
  /** Whether download is in progress */
  isDownloading: boolean;

  // Controls
  togglePlay: () => void;
  seek: (time: number) => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  setSpeed: (speed: PlaybackSpeed) => void;
  toggleMinimized: () => void;
  closePlayer: () => void;
  retryPlayback: () => void;

  // Handlers for UI components
  handleProgressChange: (value: number[]) => void;
  handleVolumeChange: (value: number[]) => void;
  handleSpeedChange: (value: string) => void;
  /** Handle download of the current audio file */
  handleDownload: () => void;
}
