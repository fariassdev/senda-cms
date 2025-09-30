import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { $api } from '@/lib/api';

import { validationSchema } from './constants';
import type { CourseCreateFormData } from './types';

export default function useConnect() {
  const router = useRouter();

  const form = useForm<CourseCreateFormData>({
    resolver: zodResolver(validationSchema),
    defaultValues: {
      prompt: '',
    },
  });

  const createCourseMutation = $api.useMutation('post', '/api/courses');

  const onSubmit = async (data: CourseCreateFormData) => {
    try {
      const result = await createCourseMutation.mutateAsync({
        body: {
          prompt: data.prompt,
        },
      });

      toast.success('Course created successfully!', {
        description: `"${result.title}" has been created and is ready for lesson management.`,
      });

      router.push('/courses');
    } catch (error) {
      toast.error('Failed to create course', {
        description:
          'Please check your input and try again. If the problem persists, contact support.',
      });

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
