import type { Lesson } from '@/types/models';

/**
 * Props for the PlayButton component
 */
export interface PlayButtonProps {
  /** The lesson to play */
  lesson: Lesson;
  /** Course slug for restoring in-flight generation jobs after reload */
  courseSlug: string;
}

/**
 * Result from the useConnect hook
 */
export interface UsePlayButtonConnectResult {
  /** Whether this lesson can be played (has audio) */
  canPlay: boolean;
  /** Whether this lesson is currently playing */
  isCurrentlyPlaying: boolean;
  /** Whether playback is preparing or waiting for the first HLS segment */
  isLoadingPlayback: boolean;
  /** Click handler to play/pause the lesson */
  handleClick: () => void;
  /** Button label for accessibility */
  ariaLabel: string;
  /** Tooltip text */
  tooltipText: string;
}
