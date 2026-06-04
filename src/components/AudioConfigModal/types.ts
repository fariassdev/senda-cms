/**
 * Types for AudioConfigModal component
 */

import type { components } from '@/types/api';

/** Matches API `AudioConfigRequest` (voice_id required; speed optional). */
export type AudioConfig = components['schemas']['AudioConfigRequest'];

export type VoiceResponse = components['schemas']['VoiceResponse'];

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

/** Default to "Cheryl" or the first voice entry in the pre-filtered catalog list. */
function pickDefaultVoice(voices: VoiceResponse[]): VoiceResponse | undefined {
  return voices.find((v) => v.voice.slug === 'Cheryl') ?? voices[0];
}

export function getDefaultVoiceSlug(voices: VoiceResponse[]): string {
  return pickDefaultVoice(voices)?.voice.slug ?? '';
}
