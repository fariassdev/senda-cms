import type { Lesson } from '@/types/models';

export interface LessonDeleteProps {
  courseSlug: string;
  lesson: Lesson;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}
