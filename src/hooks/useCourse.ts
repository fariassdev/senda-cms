import { useMemo } from 'react';

import { $api } from '@/lib/api';

const useCourse = ({ slug }: { slug?: string }) => {
  const { data, isLoading, isError, error, refetch } = $api.useQuery(
    'get',
    '/api/courses/{slug}',
    {
      params: {
        path: {
          slug: slug || '',
        },
      },
    },
    {
      enabled: !!slug,
    }
  );

  const course = useMemo(() => data?.course, [data]);

  return {
    course,
    loading: isLoading,
    error,
    isError,
    refetch,
  };
};

export default useCourse;
export type UseCourse = ReturnType<typeof useCourse>;
