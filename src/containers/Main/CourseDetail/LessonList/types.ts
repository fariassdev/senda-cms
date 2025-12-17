import type { Lesson } from '@/types/models';

export interface LessonListProps {
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

export interface LessonListConnectProps {
  lessons: Lesson[];
  onReorder: LessonListProps['onReorder'];
}
