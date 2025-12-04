import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import type { LessonEditFormData } from '@/constants/lessonScript';
import { lessonEditSchema } from '@/constants/lessonScript';
import { MAX_INSTRUCTIONS_LENGTH } from './constants';

export default function useConnect() {
  const form = useForm<LessonEditFormData>({
    resolver: zodResolver(lessonEditSchema),
    defaultValues: {
      title: '',
      corePractice: '',
      keyPoint: '',
      tone: '',
      durationMinutes: 10,
      instructions: '',
    },
  });

  const { isDirty, isValid } = form.formState;
  const instructionsValue = form.watch('instructions') ?? '';
  const charactersRemaining =
    MAX_INSTRUCTIONS_LENGTH - instructionsValue.length;

  return {
    form,
    isDirty,
    isValid,
    charactersRemaining,
  };
}
