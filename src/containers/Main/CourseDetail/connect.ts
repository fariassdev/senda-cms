import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { $api } from '@/lib/api';

export default function useConnect(courseId: string) {
  const queryClient = useQueryClient();

  const {
    data: course,
    isLoading,
    isError,
    error,
    refetch,
  } = $api.useQuery('get', '/api/courses/{course_id}', {
    params: {
      path: {
        course_id: courseId,
      },
    },
  });

  const updateCourseMutation = $api.useMutation(
    'put',
    '/api/courses/{course_id}',
  );

  const updateCourse = async (data: {
    name?: string | null;
    description?: string | null;
    tags?: string[] | null;
    active?: boolean | null;
    author?: string | null;
    imagePlaceholderUrl?: string | null;
  }) => {
    try {
      await updateCourseMutation.mutateAsync({
        params: {
          path: {
            course_id: courseId,
          },
        },
        body: data,
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
