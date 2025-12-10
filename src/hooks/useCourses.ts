import { useMemo } from 'react';

import { $api } from '@/lib/api';

const useCourses = () => {
  const { data, isLoading, isError, error, refetch } = $api.useQuery(
    'get',
    '/api/courses',
  );

  const courses = useMemo(() => data?.courses, [data]);

  return {
    courses,
    loading: isLoading,
    error,
    isError,
    refetch,
  };
};

export default useCourses;
export type UseCourses = ReturnType<typeof useCourses>;
