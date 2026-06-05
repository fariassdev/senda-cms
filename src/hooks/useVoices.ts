import { useMemo } from 'react';

import { $api } from '@/lib/api';

interface UseVoicesOptions {
  activeOnly?: boolean;
}

const useVoices = (options: UseVoicesOptions = { activeOnly: true }) => {
  const { data, isLoading, isError, error, refetch } = $api.useQuery(
    'get',
    '/api/voices',
    {
      params: {
        query: {
          active_only: options.activeOnly,
        },
      },
    },
  );

  const voices = useMemo(() => data || [], [data]);

  return {
    voices,
    loading: isLoading,
    error,
    isError,
    refetch,
  };
};

export default useVoices;
export type UseVoices = ReturnType<typeof useVoices>;
