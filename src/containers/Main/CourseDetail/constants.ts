import { z } from 'zod';

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
