import type { Voice } from '@/types/models';

import type { VoiceResponse } from '../types';

export interface VoiceSelectProps {
  voices: VoiceResponse[];
  isLoading: boolean;
  isError: boolean;
  error: unknown;
  onRetry: () => void;
  selectedVoiceSlug: string;
  onSelectVoiceSlug: (slug: string) => void;
  selectedVoiceObj?: Voice;
  playingVoiceSlug: string | null;
  onTogglePlay: (
    e: React.MouseEvent,
    voiceSlug: string,
    sampleAudioUrl: string | null | undefined,
  ) => void;
  /** When false (e.g. parent dialog closed), closes the select panel. */
  containerOpen?: boolean;
}
