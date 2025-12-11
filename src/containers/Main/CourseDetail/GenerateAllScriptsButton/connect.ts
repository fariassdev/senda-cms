import { useMemo } from 'react';

import type { BatchState } from '@/hooks/useBatchScriptGeneration';
import type { Lesson } from '@/types/models';

import { ELIGIBLE_STATUSES } from '../BatchGenerationModal/constants';

/**
 * Hook for GenerateAllScriptsButton state and logic
 *
 * @param lessons - All lessons in the course
 * @param batchState - Current batch generation state
 */
export default function useConnect(
  lessons: Lesson[] | undefined,
  batchState?: BatchState,
) {
  // Count eligible lessons (PENDING or SCRIPT_FAILED)
  const eligibleCount = useMemo(() => {
    if (!lessons) return 0;
    return lessons.filter((lesson) =>
      ELIGIBLE_STATUSES.includes(
        lesson.status as (typeof ELIGIBLE_STATUSES)[number],
      ),
    ).length;
  }, [lessons]);

  // Determine if button should be disabled
  const isDisabled = eligibleCount === 0;

  // Check if batch is active (for showing "View Progress" button)
  const isBatchActive = batchState?.isActive ?? false;

  // Tooltip message when disabled
  const tooltipMessage = isDisabled ? 'All lessons have scripts' : undefined;

  return {
    eligibleCount,
    isDisabled,
    isBatchActive,
    tooltipMessage,
  };
}
