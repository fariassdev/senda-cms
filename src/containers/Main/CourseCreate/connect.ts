import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';

import { $api } from '@/lib/api';

import { validationSchema } from './constants';
import type { CourseCreateFormData } from './types';

export default function useConnect() {
  const router = useRouter();

  // Form handling
  const form = useForm<CourseCreateFormData>({
    resolver: zodResolver(validationSchema),
    defaultValues: {
      prompt: '',
    },
  });

  // API mutation for course creation
  const createCourseMutation = $api.useMutation('post', '/api/courses');

  // Handle form submission
  const onSubmit = async (data: CourseCreateFormData) => {
    try {
      await createCourseMutation.mutateAsync({
        body: {
          prompt: data.prompt,
        },
      });

      // Redirect to course list after successful creation
      router.push('/courses');
    } catch (error) {
      // Error is handled by React Query and displayed in the form
      console.error('Failed to create course:', error);
    }
  };

  return {
    form,
    onSubmit,
    isLoading: createCourseMutation.isPending,
    error: createCourseMutation.error,
  };
}
