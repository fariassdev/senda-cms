import { z } from 'zod';

// Tone suggestions - users can also type custom values
export const TONE_SUGGESTIONS = [
  'Calming',
  'Energizing',
  'Neutral',
  'Guided Visualization',
  'Soothing',
  'Motivating',
  'Reflective',
] as const;

export const lessonSchema = z.object({
  title: z
    .string()
    .min(3, 'Title must be at least 3 characters')
    .max(100, 'Title cannot exceed 100 characters'),
  durationMinutes: z
    .number({ message: 'Duration is required' })
    .min(1, 'Duration must be at least 1 minute')
    .max(120, 'Duration cannot exceed 120 minutes'),
  corePractice: z
    .string()
    .min(3, 'Core practice must be at least 3 characters'),
  keyPoint: z.string().min(3, 'Key point must be at least 3 characters'),
  tone: z
    .string()
    .min(2, 'Tone must be at least 2 characters')
    .max(50, 'Tone cannot exceed 50 characters'),
});

export type LessonFormData = z.infer<typeof lessonSchema>;

export const DEFAULT_FORM_VALUES: LessonFormData = {
  title: '',
  durationMinutes: 10,
  corePractice: '',
  keyPoint: '',
  tone: '',
};
