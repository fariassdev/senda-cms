import { z } from 'zod';

/**
 * Course update form validation schema
 */
export const courseUpdateSchema = z.object({
  name: z.string().min(1, 'Title is required').max(200, 'Title is too long'),
  description: z.string().min(1, 'Description is required'),
  author: z
    .string()
    .min(1, 'Author is required')
    .max(100, 'Author name is too long'),
  tags: z.array(z.string()),
  active: z.boolean(),
  imagePlaceholderUrl: z.string().optional(),
});

export type CourseUpdateFormData = z.infer<typeof courseUpdateSchema>;
