import type { LessonStatus } from '@/components/GenerateScriptButton';

export interface UseScriptGenerationProps {
  courseSlug: string;
  lessonId: number;
  lessonTitle: string;
  status: LessonStatus;
}

export interface UseScriptGenerationReturn {
  generateScript: () => void;
  isGenerating: boolean;
}
