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
