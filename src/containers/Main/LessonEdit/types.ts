import type { Lesson } from '@/types/models';

export interface LessonEditProps {
  courseSlug: string;
  lesson: Lesson;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}
