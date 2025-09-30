import { z } from 'zod';

// Form validation schema based on API schema
export const validationSchema = z.object({
  prompt: z
    .string()
    .min(1, 'Prompt is required')
    .min(10, 'Prompt must be at least 10 characters'),
});
