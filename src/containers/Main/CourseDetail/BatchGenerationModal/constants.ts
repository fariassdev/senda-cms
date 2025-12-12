/**
 * Constants for BatchGenerationModal component
 */

/**
 * Messages displayed in the batch generation modal
 */
export const BATCH_MESSAGES = {
  PROCESSING_WARNING:
    'This may take several minutes depending on the number of lessons.',
  START_TOAST: (count: number) =>
    `Batch generation started for ${count} lessons...`,
  COMPLETE_SUCCESS: (count: number) =>
    `✅ ${count} scripts generated successfully`,
  COMPLETE_PARTIAL: (success: number, failed: number) =>
    `Batch complete: ${success} succeeded, ${failed} failed`,
  RETRY_BUTTON: (count: number) => `Retry Failed (${count})`,
  NO_SELECTION: 'Select at least one lesson to generate',
} as const;

/**
 * Modal configuration and labels
 */
export const MODAL_CONFIG = {
  title: (count: number) => `Generate Scripts for ${count} Lessons`,
  titleProgress: 'Generating Scripts',
  titleComplete: 'Generation Complete',
  description: 'Select which lessons to generate scripts for.',
  submitLabel: (count: number) => `Generate ${count} Scripts`,
  cancelLabel: 'Cancel',
  closeLabel: 'Close',
  viewProgressLabel: 'View Progress',
} as const;

/**
 * Lesson statuses that are eligible for batch script generation
 */
export const ELIGIBLE_STATUSES = ['PENDING', 'SCRIPT_FAILED'] as const;

/**
 * Status icon configurations
 */
export const STATUS_CONFIG = {
  pending: {
    icon: 'Clock',
    color: 'text-gray-400',
    label: 'Waiting',
  },
  generating: {
    icon: 'Loader2',
    color: 'text-blue-500',
    label: 'Generating...',
    animate: true,
  },
  completed: {
    icon: 'CheckCircle',
    color: 'text-green-500',
    label: 'Complete',
  },
  failed: {
    icon: 'XCircle',
    color: 'text-red-500',
    label: 'Failed',
  },
} as const;

/**
 * Progress bar configuration for SimulatedProgressBar
 */
export const PROGRESS_CONFIG = {
  /** Time in ms to simulate per lesson (20 seconds) */
  SIMULATED_TIME_PER_LESSON_MS: 20000,
  /** Progress update interval in ms */
  UPDATE_INTERVAL_MS: 1000,
  /** Labels for the progress bar */
  LABELS: {
    progress: 'Progress',
    ariaLabel: 'Generation progress',
  },
} as const;
