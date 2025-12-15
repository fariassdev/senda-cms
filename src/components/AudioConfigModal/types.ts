/**
 * Types for AudioConfigModal component
 */

export interface AudioConfig {
  voice: string;
  speed: number;
}

export interface AudioConfigModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lessonTitle: string;
  onGenerate: (config: AudioConfig) => void;
  isGenerating: boolean;
  /**
   * If true, modal is for regeneration (existing audio).
   * Shows warning banner and "Regenerate" button text.
   */
  isRegeneration?: boolean;
}
