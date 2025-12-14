import type { Lesson } from '@/types/models';

export interface LessonReorderContext {
  previousLessons: Lesson[] | undefined;
}

export interface LessonReorderState {
  /** The pending order of lesson IDs (null if no changes) */
  pendingOrder: number[] | null;
  /** Whether there are unsaved changes */
  hasUnsavedChanges: boolean;
  /** The ordered lessons to display (pending or original) */
  displayLessons: Lesson[];
}
