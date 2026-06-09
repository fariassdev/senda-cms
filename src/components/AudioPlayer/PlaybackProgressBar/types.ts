export interface PlaybackProgressBarProps {
  /** Current playback position in seconds */
  progress: number;
  /** Generated or buffered audio available for seek in seconds */
  availableDuration: number;
  /** Total timeline length in seconds (estimated while generating) */
  totalDuration: number;
  /** Whether interaction is disabled */
  disabled?: boolean;
  /** Compact single-pixel bar for minimized player */
  compact?: boolean;
  /** Seek to a position in seconds */
  onSeek: (time: number) => void;
  /** Accessible label for the slider */
  'aria-label'?: string;
}
