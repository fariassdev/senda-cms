import type { LessonFormData } from '@/components/LessonForm';
import type { Lesson } from '@/types/models';

export interface GenerateScriptButtonProps {
  lesson: Lesson;
  onGenerate: () => void;
  onUpdateAndGenerate: (data: LessonFormData) => Promise<void>;
  isGenerating?: boolean;
  isUpdating?: boolean;
  className?: string;
}
