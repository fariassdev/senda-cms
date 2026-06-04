import type { Voice } from '@/types/models';

export interface VoiceSelectOptionProps {
  voice: Voice;
  playingVoiceSlug: string | null;
  onTogglePlay: (
    e: React.MouseEvent,
    voiceSlug: string,
    sampleAudioUrl: string | null | undefined,
  ) => void;
}
