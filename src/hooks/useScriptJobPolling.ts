import { useEffect } from 'react';

import { $api } from '@/lib/api';
import type { ScriptGenerationStatusResponse } from '@/types/models';

export interface UseScriptJobPollingProps {
  courseSlug: string;
  lessonId: number;
  enabled: boolean;
  onComplete?: () => void;
}

/**
 * Polls the script status for a single lesson.
 */
export function useScriptJobPolling({
  courseSlug,
  lessonId,
  enabled,
  onComplete,
}: UseScriptJobPollingProps) {
  const { data, isError } = $api.useQuery(
    'get',
    '/api/courses/{slug}/lessons/{id}/script-status',
    {
      params: {
        path: {
          slug: courseSlug,
          id: lessonId,
        },
      },
    },
    {
      enabled: enabled && !!courseSlug && !!lessonId,
      refetchInterval: (query: {
        state: { data?: ScriptGenerationStatusResponse | undefined };
      }) => {
        const status = query.state.data?.status;

        if (
          !status ||
          status === 'SCRIPT_COMPLETED' ||
          status === 'SCRIPT_FAILED'
        ) {
          return false;
        }

        return 2000;
      },
    },
  );

  const status = data?.status;
  const isCompleted = status === 'SCRIPT_COMPLETED';
  const isFailed = status === 'SCRIPT_FAILED';

  useEffect(() => {
    if (isCompleted || isFailed) {
      onComplete?.();
    }
  }, [isCompleted, isFailed, onComplete]);

  return {
    status,
    isCompleted,
    isFailed,
    isError,
  };
}
