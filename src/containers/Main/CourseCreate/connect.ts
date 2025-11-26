import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { $api } from '@/lib/api';

import { validationSchema } from './constants';
import type { CourseCreateFormData } from './types';

let currentLoadingToastId: string | number | undefined;

export default function useConnect() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const form = useForm<CourseCreateFormData>({
    resolver: zodResolver(validationSchema),
    defaultValues: {
      prompt: '',
    },
  });

  const createCourseMutation = $api.useMutation(
    'post',
    '/api/courses/generate',
    {
      onSuccess: async (result) => {
        if (currentLoadingToastId) {
          toast.dismiss(currentLoadingToastId);
          currentLoadingToastId = undefined;
        }

        toast.success('Course created successfully!', {
          description: `"${result.course.title}" has been created with ${result.course.lessonsCount} lessons.`,
          duration: 4000,
        });

        await queryClient.invalidateQueries({
          queryKey: ['get', '/api/courses'],
          refetchType: 'active',
        });

        // Redirect to the newly created course detail page
        router.push(`/courses/${result.course.slug}`);
      },
      onError: (error) => {
        if (currentLoadingToastId) {
          toast.dismiss(currentLoadingToastId);
          currentLoadingToastId = undefined;
        }

        toast.error('Failed to create course', {
          description:
            'Please check your input and try again. If the problem persists, contact support.',
          duration: 6000,
        });

        console.error('Failed to create course:', error);
      },
    },
  );

  const onSubmit = async (data: CourseCreateFormData) => {
    currentLoadingToastId = toast.loading('Creating course...', {
      description:
        'AI is generating your meditation course. This may take a few moments.',
    });

    createCourseMutation.mutate({
      body: {
        prompt: data.prompt,
      },
    });
  };

  return {
    form,
    onSubmit,
    isLoading: createCourseMutation.isPending,
    error: createCourseMutation.error,
  };
}
