import type { Voice } from '@/types/models';

import type { VoiceBadgeVariant } from './constants';

export interface VoiceOptionContentProps {
  voice: Voice;
  variant?: VoiceBadgeVariant;
}
