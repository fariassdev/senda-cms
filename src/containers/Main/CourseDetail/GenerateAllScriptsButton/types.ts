import type { BatchState } from '@/hooks/useBatchScriptGeneration';

/**
 * Props for the GenerateAllScriptsButton component
 */
export interface GenerateAllScriptsButtonProps {
  /** Number of eligible lessons (PENDING or SCRIPT_FAILED) */
  eligibleCount: number;
  /** Whether batch generation is currently in progress */
  isGenerating: boolean;
  /** Current batch state (null if no active batch) */
  batchState: BatchState | null;
  /** Callback when the button is clicked */
  onClick: () => void;
  /** Callback to view progress of active batch */
  onViewProgress?: () => void;
}
