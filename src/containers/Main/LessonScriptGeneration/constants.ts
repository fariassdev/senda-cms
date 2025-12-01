import { z } from 'zod';

import type { LessonStatus } from '@/components/GenerateScriptButton';

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
 * Zod schema for script generation configuration form
 */
export const scriptConfigSchema = z.object({
  tone: z.enum(['calming', 'energizing', 'neutral', 'visualization']),
  target_duration: z
    .number()
    .min(1, 'Duration must be at least 1 minute')
    .max(120, 'Duration cannot exceed 120 minutes'),
  instructions: z
    .string()
    .max(500, 'Instructions cannot exceed 500 characters')
    .optional(),
});

export type ScriptConfigFormData = z.infer<typeof scriptConfigSchema>;

/**
 * Default configuration values
 */
export const DEFAULT_SCRIPT_CONFIG: ScriptConfigFormData = {
  tone: 'calming',
  target_duration: 10,
  instructions: '',
};

/**
 * Maximum characters for instructions field
 */
export const MAX_INSTRUCTIONS_LENGTH = 500;

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

/**
 * localStorage key pattern for storing script config preferences
 */
export function getStorageKey(courseId: string): string {
  return `senda_script_config_${courseId}`;
}
