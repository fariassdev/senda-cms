import type { LessonFormData } from '@/components/LessonForm';
import type { Lesson } from '@/types/models';

export interface ScriptConfigModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lesson: Lesson;
  courseSlug: string;
  onGenerate: () => void;
  onUpdateAndGenerate: (data: LessonFormData) => Promise<void>;
  isGenerating: boolean;
  isUpdating: boolean;
}
