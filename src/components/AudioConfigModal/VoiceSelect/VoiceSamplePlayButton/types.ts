import type { VoiceSamplePlayButtonSize } from './constants';

export interface VoiceSamplePlayButtonProps {
  voiceSlug: string;
  sampleAudioUrl?: string | null;
  isPlaying: boolean;
  onToggle: (
    e: React.MouseEvent,
    voiceSlug: string,
    sampleAudioUrl: string | null | undefined,
  ) => void;
  size?: VoiceSamplePlayButtonSize;
}
