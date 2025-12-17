import type { Lesson } from '@/types/models';

export interface LessonRowProps {
  lesson: Lesson;
  courseSlug: string;
  disabled?: boolean;
  onEdit?: (lesson: Lesson) => void;
  onDelete?: (lesson: Lesson) => void;
}

export interface LessonDragOverlayProps {
  lesson: Lesson;
}
