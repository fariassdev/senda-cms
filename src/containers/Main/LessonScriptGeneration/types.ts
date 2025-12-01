import type { LessonStatus } from '@/components/GenerateScriptButton';
import type { Lesson } from '@/types/models';

import type { LessonEditFormData, ScriptConfigFormData } from './constants';

export interface UseScriptGenerationProps {
  courseSlug: string;
  lessonId: number;
  lessonTitle: string;
  status: LessonStatus;
}

export interface UseScriptGenerationReturn {
  generateScript: (config?: ScriptConfigFormData) => void;
  isGenerating: boolean;
}

/**
 * Props for ScriptConfigModal component
 * Now receives the full lesson object for review/editing
 */
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
