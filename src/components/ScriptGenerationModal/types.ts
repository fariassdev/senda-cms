import type { LessonFormData } from '@/components/LessonForm';
import type { Lesson } from '@/types/models';

export interface ScriptGenerationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lesson: Lesson;
  onGenerate: () => void;
  onUpdateAndGenerate: (data: LessonFormData) => Promise<void>;
  isGenerating: boolean;
  isUpdating: boolean;
  /**
   * If true, modal is for regeneration (existing script).
   * If false, modal is for initial generation.
   */
  isRegeneration?: boolean;
}
