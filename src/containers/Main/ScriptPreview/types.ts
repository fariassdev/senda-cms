import type { ScriptPart } from '@/types/models';

/**
 * Props for the ScriptPreview container
 */
export interface ScriptPreviewProps {
  courseSlug: string;
  lessonId: string;
}

/**
 * Metrics calculated from script content
 */
export interface ScriptMetrics {
  wordCount: number;
  charCount: number;
  readingTimeMinutes: number;
  totalPauseSeconds: number;
  totalDurationMinutes: number;
  pausePercentage: number;
  targetDurationMinutes: number;
}

/**
 * Props for the ScriptContent component
 */
export interface ScriptContentProps {
  script: ScriptPart[];
}

/**
 * Status messages for empty states based on lesson status
 */
export type EmptyStateStatus =
  | 'PENDING'
  | 'SCRIPT_GENERATING'
  | 'SCRIPT_FAILED'
  | 'unknown';
