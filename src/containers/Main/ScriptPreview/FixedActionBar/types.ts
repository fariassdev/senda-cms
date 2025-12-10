export type SaveState = 'idle' | 'saving' | 'success' | 'error';

export interface FixedActionBarProps {
  isEditing: boolean;
  onEdit?: () => void;
  onGenerateAudio?: () => void;
  onRegenerate?: () => void;
  canGenerateAudio?: boolean;
  hasUnsavedChanges?: boolean;
  saveStatus?: SaveState;
  onSave?: () => void;
  onCancelEdit?: () => void;
}
