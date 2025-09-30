import { $api } from '@/lib/api';

export default function useConnect(courseId: string) {
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

  return {
    course,
    isLoading,
    isError,
    error,
    refetch,
  };
}
