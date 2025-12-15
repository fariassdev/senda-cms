import type { AudioConfig } from '@/components/AudioConfigModal';

export type SaveState = 'idle' | 'saving' | 'success' | 'error';

export interface FixedActionBarProps {
  isEditing: boolean;
  onEdit?: () => void;
  onGenerateAudio?: (config?: AudioConfig) => void;
  onRegenerate?: (e: React.MouseEvent) => void;
  canGenerateAudio?: boolean;
  isAudioRegeneration?: boolean;
  isGeneratingAudio?: boolean;
  lessonTitle?: string;
  hasUnsavedChanges?: boolean;
  saveStatus?: SaveState;
  onSave?: () => void;
  onCancelEdit?: () => void;
}
