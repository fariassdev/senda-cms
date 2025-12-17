import type { Lesson } from '@/types/models';

/**
 * Props for the PlayButton component
 */
export interface PlayButtonProps {
  /** The lesson to play */
  lesson: Lesson;
}

/**
 * Result from the useConnect hook
 */
export interface UsePlayButtonConnectResult {
  /** Whether this lesson can be played (has audio) */
  canPlay: boolean;
  /** Whether this lesson is currently playing */
  isCurrentlyPlaying: boolean;
  /** Click handler to play/pause the lesson */
  handleClick: () => void;
  /** Button label for accessibility */
  ariaLabel: string;
  /** Tooltip text */
  tooltipText: string;
}
