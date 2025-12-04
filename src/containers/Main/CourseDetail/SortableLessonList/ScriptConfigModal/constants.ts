/**
 * Tone options for script generation configuration
 */
export const TONE_OPTIONS = [
  { value: 'calming', label: 'Calming' },
  { value: 'energizing', label: 'Energizing' },
  { value: 'neutral', label: 'Neutral' },
  { value: 'visualization', label: 'Guided Visualization' },
] as const;

export type ToneValue = (typeof TONE_OPTIONS)[number]['value'];

/**
 * Maximum characters for instructions field
 */
export const MAX_INSTRUCTIONS_LENGTH = 500;
