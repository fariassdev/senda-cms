import type { Lesson } from '@/types/models';

export interface GenerateAudioButtonProps {
  lesson: Lesson;
  onGenerate: () => void;
  isGenerating?: boolean;
  className?: string;
}
