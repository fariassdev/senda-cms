import type { z } from 'zod';
import type { validationSchema } from './constants';

export type LoginFormData = z.infer<typeof validationSchema>;
