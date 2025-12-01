import type { LessonStatus } from '@/components/GenerateScriptButton';

/**
 * Statuses that allow generating a new script (primary button)
 */
export const ELIGIBLE_FOR_GENERATION: LessonStatus[] = [
  'PENDING',
  'SCRIPT_FAILED',
  'AUDIO_FAILED',
];

/**
 * Statuses that allow regenerating a script (secondary button)
 */
export const ELIGIBLE_FOR_REGENERATION: LessonStatus[] = [
  'SCRIPT_COMPLETED',
  'AUDIO_COMPLETED',
];

/**
 * Statuses where the button should be disabled
 */
export const GENERATING_STATUSES: LessonStatus[] = [
  'SCRIPT_GENERATING',
  'AUDIO_GENERATING',
];

/**
 * Check if a status allows script generation
 */
export function canGenerateScript(status: LessonStatus): boolean {
  return (
    ELIGIBLE_FOR_GENERATION.includes(status) ||
    ELIGIBLE_FOR_REGENERATION.includes(status)
  );
}

/**
 * Check if a status indicates active generation
 */
export function isGenerating(status: LessonStatus): boolean {
  return GENERATING_STATUSES.includes(status);
}
