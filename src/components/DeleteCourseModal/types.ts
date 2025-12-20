import type { Course } from '@/types/models';

export interface DeleteCourseModalProps {
  course: Course | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}
