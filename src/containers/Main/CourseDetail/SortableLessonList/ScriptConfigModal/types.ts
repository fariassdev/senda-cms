import type { LessonEditFormData } from '@/constants/lessonScript';
import type { Lesson } from '@/types/models';

export interface ScriptConfigModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lesson: Lesson;
  courseSlug: string;
  onGenerate: () => void;
  onUpdateAndGenerate: (data: LessonEditFormData) => Promise<void>;
  isGenerating: boolean;
  isUpdating: boolean;
}
