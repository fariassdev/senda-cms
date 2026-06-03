/**
 * Types for AudioConfigModal component
 */

import type { components } from '@/types/api';

/** Matches API `AudioConfigRequest` (voice_id required; speed optional). */
export type AudioConfig = components['schemas']['AudioConfigRequest'];

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
