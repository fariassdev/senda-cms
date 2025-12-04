import type { LessonEditFormData } from '@/containers/Main/CourseDetail/LessonScriptGeneration';
import type { Lesson } from '@/types/models';

export type LessonStatus =
  | 'PENDING'
  | 'SCRIPT_GENERATING'
  | 'SCRIPT_COMPLETED'
  | 'AUDIO_GENERATING'
  | 'AUDIO_COMPLETED'
  | 'SCRIPT_FAILED'
  | 'AUDIO_FAILED';

export interface GenerateScriptButtonProps {
  lesson: Lesson;
  courseSlug: string;
  onGenerate: () => void;
  onUpdateAndGenerate: (data: LessonEditFormData) => Promise<void>;
  isGenerating?: boolean;
  isUpdating?: boolean;
  className?: string;
}
