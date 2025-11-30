import type { Lesson } from '@/types/models';

export interface ReorderParams {
  lessons: {
    lesson_id: number;
    lesson_number: number;
  }[];
}

export interface UseLessonReorderOptions {
  courseSlug: string;
  onSuccess?: () => void;
}

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
