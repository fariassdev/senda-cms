import type { LessonStatus } from '@/components/GenerateScriptButton';

import type { ScriptConfigFormData } from './constants';

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
 */
export interface ScriptConfigModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lessonTitle: string;
  lessonDuration: number;
  keyThemes?: string[];
  defaultTone?: ScriptConfigFormData['tone'];
  onGenerate: (config: ScriptConfigFormData) => void;
  isGenerating: boolean;
}
