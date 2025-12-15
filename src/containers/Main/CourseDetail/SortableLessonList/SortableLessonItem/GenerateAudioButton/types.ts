import type { AudioConfig } from '@/components/AudioConfigModal';
import type { Lesson } from '@/types/models';

export interface GenerateAudioButtonProps {
  lesson: Lesson;
  onGenerate: (config?: AudioConfig) => void;
  isGenerating?: boolean;
  className?: string;
}
