import type { Lesson } from '@/types/models';

export interface LessonCardProps {
  lesson: Lesson;
  courseSlug: string;
  onEdit?: (lesson: Lesson) => void;
  onDelete?: (lesson: Lesson) => void;
}
