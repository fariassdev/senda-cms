import { z } from 'zod';

import type { LessonStatus } from '@/components/StatusBadge';

/**
 * Polling interval in milliseconds for generating lessons
 */
export const POLLING_INTERVAL = 3000;

/**
 * Status values that indicate a lesson is currently generating
 */
export const GENERATING_STATUSES: LessonStatus[] = [
  'SCRIPT_GENERATING',
  'AUDIO_GENERATING',
];

/**
 * Course update form validation schema
 * Matches the UpdateCourseData schema from the API
 */
export const courseUpdateSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title is too long'),
  description: z.string().min(1, 'Description is required'),
  difficulty_level: z.string().optional(),
  active: z.boolean(),
  image_placeholder_url: z.string().optional(),
});

export type CourseUpdateFormData = z.infer<typeof courseUpdateSchema>;
