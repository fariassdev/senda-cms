import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { $api } from '@/lib/api';
import { courseUpdateSchema, type CourseUpdateFormData } from './constants';

export default function useConnect(courseSlug: string) {
  const queryClient = useQueryClient();

  const form = useForm<CourseUpdateFormData>({
    resolver: zodResolver(courseUpdateSchema),
    defaultValues: {
      title: '',
      description: '',
      difficulty_level: '',
      active: false,
      image_placeholder_url: '',
    },
  });

  const {
    data: courseResponse,
    isLoading,
    isError,
    error,
    refetch,
  } = $api.useQuery('get', '/api/courses/{slug}', {
    params: {
      path: {
        slug: courseSlug,
      },
    },
  });

  const course = courseResponse?.course;

  // Update form when course data is loaded
  useEffect(() => {
    if (course) {
      form.reset({
        title: course.title,
        description: course.description,
        difficulty_level: course.difficultyLevel,
        active: course.active,
        image_placeholder_url: course.imagePlaceholderUrl || '',
      });
    }
  }, [course, form]);

  const updateCourseMutation = $api.useMutation('put', '/api/courses/{slug}');

  const updateCourse = async (data: {
    title?: string | null;
    description?: string | null;
    difficulty_level?: string | null;
    active?: boolean | null;
    image_placeholder_url?: string | null;
  }) => {
    try {
      await updateCourseMutation.mutateAsync({
        params: {
          path: {
            slug: courseSlug,
          },
        },
        body: {
          course: data,
        },
      });

      toast.success('Course updated successfully');

      refetch();

      await queryClient.invalidateQueries({
        queryKey: ['get', '/api/courses'],
        refetchType: 'active',
      });
    } catch (error) {
      toast.error('Failed to update course');
      console.error('Course update error:', error);
    }
  };

  const onSubmit = async (data: CourseUpdateFormData) => {
    await updateCourse({
      title: data.title,
      description: data.description,
      difficulty_level: data.difficulty_level || null,
      active: data.active,
      image_placeholder_url: data.image_placeholder_url || null,
    });
  };

  return {
    course,
    form,
    isLoading,
    isError,
    error,
    refetch,
    isUpdating: updateCourseMutation.isPending,
    onSubmit,
  };
}
