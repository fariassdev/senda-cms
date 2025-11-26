import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { $api } from '@/lib/api';

export default function useConnect(courseSlug: string) {
  const queryClient = useQueryClient();

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

  return {
    course,
    isLoading,
    isError,
    error,
    refetch,
    updateCourse,
    isUpdating: updateCourseMutation.isPending,
  };
}
