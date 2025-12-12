import type {
  LessonBatchStatus,
  BatchState,
  LessonError,
} from '@/hooks/useBatchScriptGeneration';
import type { Lesson } from '@/types/models';

/**
 * Props for the BatchGenerationModal component
 */
export interface BatchGenerationModalProps {
  /** Whether the modal is open */
  open: boolean;
  /** Callback when the modal open state changes */
  onOpenChange: (open: boolean) => void;
  /** List of all lessons in the course */
  lessons: Lesson[];
  /** Callback to start batch generation with selected lesson IDs */
  onGenerate: (lessonIds: number[]) => void;
  /** Callback to retry failed lessons */
  onRetryFailed: () => void;
  /** Current batch state (null if no active batch) */
  batchState: BatchState | null;
  /** Whether batch generation is currently in progress (API call pending) */
  isGenerating: boolean;
  /** Initial view to show when modal opens */
  initialView?: BatchModalView;
}

/**
 * View states for the batch generation modal
 */
export type BatchModalView = 'selection' | 'progress' | 'complete';

/**
 * Individual lesson item for the selection list
 */
export interface LessonSelectionItem {
  id: number;
  title: string;
  lessonNumber: number;
  isEligible: boolean;
  batchStatus?: LessonBatchStatus;
  error?: LessonError;
}
