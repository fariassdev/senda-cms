/**
 * Constants for ScriptGenerationModal component
 */

export const WARNING_BANNER_TEXT =
  'This will replace the current script. The current version will be saved to history.';

export const MODAL_CONFIG = {
  generate: {
    title: 'Review Lesson & Generate Script',
    description:
      'Review the lesson details before generating. Any changes will be saved automatically.',
    submitLabel: 'Generate',
    submitLabelDirty: 'Save & Generate',
  },
  regenerate: {
    title: 'Regenerate Script',
    description:
      'Review and optionally update lesson parameters before regenerating.',
    submitLabel: 'Regenerate',
    submitLabelDirty: 'Save & Regenerate',
  },
} as const;
