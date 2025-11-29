import { z } from 'zod';

export const TONE_OPTIONS = [
  { value: 'calming', label: 'Calming' },
  { value: 'energizing', label: 'Energizing' },
  { value: 'neutral', label: 'Neutral' },
  { value: 'visualization', label: 'Guided Visualization' },
] as const;

export type ToneValue = (typeof TONE_OPTIONS)[number]['value'];

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
  tone: z.enum(['calming', 'energizing', 'neutral', 'visualization'], {
    message: 'Please select a tone',
  }),
});

export type LessonFormData = z.infer<typeof lessonSchema>;

export const DEFAULT_FORM_VALUES: LessonFormData = {
  title: '',
  durationMinutes: 10,
  corePractice: '',
  keyPoint: '',
  tone: 'calming',
};
