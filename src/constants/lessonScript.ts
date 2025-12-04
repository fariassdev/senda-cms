import { z } from 'zod';

import type { LessonStatus } from '@/types/models';

/**
 * Zod schema for the complete lesson editing form in script generation modal
 * This includes all lesson fields that can be reviewed/edited before generation
 * Tone is a flexible string field with suggestions (not restricted to enum)
 */
export const lessonEditSchema = z.object({
  title: z
    .string()
    .min(3, 'Title must be at least 3 characters')
    .max(100, 'Title cannot exceed 100 characters'),
  corePractice: z
    .string()
    .min(1, 'Core practice is required')
    .max(500, 'Core practice cannot exceed 500 characters'),
  keyPoint: z
    .string()
    .min(1, 'Key point is required')
    .max(500, 'Key point cannot exceed 500 characters'),
  tone: z
    .string()
    .min(2, 'Tone must be at least 2 characters')
    .max(50, 'Tone cannot exceed 50 characters'),
  durationMinutes: z
    .number()
    .min(1, 'Duration must be at least 1 minute')
    .max(120, 'Duration cannot exceed 120 minutes'),
  instructions: z
    .string()
    .max(500, 'Instructions cannot exceed 500 characters')
    .optional(),
});

export type LessonEditFormData = z.infer<typeof lessonEditSchema>;

/**
 * @deprecated Use lessonEditSchema instead - kept for backwards compatibility
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
 * @deprecated Use DEFAULT_LESSON_EDIT_CONFIG instead
 */
export const DEFAULT_SCRIPT_CONFIG: ScriptConfigFormData = {
  tone: 'calming',
  target_duration: 10,
  instructions: '',
};

/**
 * Default values for lesson edit form (used when lesson data is missing)
 */
export const DEFAULT_LESSON_EDIT_VALUES: Partial<LessonEditFormData> = {
  tone: 'calming',
  durationMinutes: 10,
  instructions: '',
};

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
