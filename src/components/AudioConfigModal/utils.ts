import type { components } from '@/types/api';

export type VoiceResponse = components['schemas']['VoiceResponse'];

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
