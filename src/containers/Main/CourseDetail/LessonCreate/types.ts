export interface LessonCreateProps {
  courseSlug: string;
  nextLessonNumber: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}
