/**
 * Constants for AudioConfigModal component
 */

export const SPEECH_RATE_CONFIG = {
  min: 0.7,
  max: 1.3,
  step: 0.1,
  default: 1.0,
} as const;

export const MODAL_CONFIG = {
  generate: {
    title: 'Generate Audio',
    description: 'Configure voice and audio settings for this lesson.',
    submitLabel: 'Generate',
  },
  regenerate: {
    title: 'Regenerate Audio',
    description:
      'Configure voice and audio settings. Current audio will be replaced.',
    submitLabel: 'Regenerate',
  },
} as const;

export const WARNING_BANNER_TEXT = 'This will replace the current audio file.';
