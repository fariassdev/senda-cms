import type { Lesson } from '@/types/models';

export interface SortableLessonListProps {
  lessons: Lesson[];
  isLoading: boolean;
  isError: boolean;
  courseSlug: string;
  onRetry: () => void;
  onAddLesson?: () => void;
  onEditLesson?: (lesson: Lesson) => void;
  onDeleteLesson?: (lesson: Lesson) => void;
  onReorder: (orderedIds: number[]) => void;
  isReordering?: boolean;
}

export interface SortableLessonListConnectProps {
  lessons: Lesson[];
  onReorder: SortableLessonListProps['onReorder'];
}
