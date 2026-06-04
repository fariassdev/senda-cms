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

/** Prefer the first active catalog voice; otherwise the first entry. */
export function pickDefaultVoice(
  voices: VoiceResponse[],
): VoiceResponse | undefined {
  if (voices.length === 0) return undefined;
  return voices.find((v) => v.voice.isActive) ?? voices[0];
}

export function getDefaultVoiceSlug(voices: VoiceResponse[]): string {
  return pickDefaultVoice(voices)?.voice.slug ?? '';
}
