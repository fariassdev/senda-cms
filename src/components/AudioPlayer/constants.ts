import type { PlaybackSpeed } from '@/contexts/AudioPlayerContext';

/**
 * Z-index for the audio player (below modals z-50, above content z-10)
 */
export const AUDIO_PLAYER_Z_INDEX = 40;

/**
 * Available playback speed options
 */
export const SPEED_OPTIONS: { value: PlaybackSpeed; label: string }[] = [
  { value: 0.75, label: '0.75x' },
  { value: 1.0, label: '1x' },
  { value: 1.25, label: '1.25x' },
  { value: 1.5, label: '1.5x' },
  { value: 2.0, label: '2x' },
];

/**
 * Player height in pixels
 */
export const PLAYER_HEIGHT = {
  expanded: 120,
  minimized: 60,
} as const;

/**
 * Keyboard shortcuts for the player
 */
export const KEYBOARD_SHORTCUTS = {
  PLAY_PAUSE: ' ', // Space
  SEEK_BACKWARD: 'ArrowLeft',
  SEEK_FORWARD: 'ArrowRight',
  TOGGLE_MUTE: 'm',
  VOLUME_UP: 'ArrowUp',
  VOLUME_DOWN: 'ArrowDown',
} as const;

/**
 * Seek amount in seconds for keyboard navigation
 */
export const SEEK_AMOUNT = 10;

/**
 * Volume adjustment amount for keyboard navigation (0-1 scale)
 */
export const VOLUME_STEP = 0.1;
