import type { TtsProvider } from '@/types/models';

export type VoiceBadgeVariant = 'trigger' | 'list';

export function supportsSpeechRate(provider: TtsProvider): boolean {
  return provider === 'kokoro';
}

export function getProviderBadgeClassName(
  provider: TtsProvider,
  variant: VoiceBadgeVariant,
): string {
  if (variant === 'trigger') {
    return provider === 'kokoro'
      ? 'bg-sky-500/10 text-sky-400 border-sky-500/20'
      : 'bg-primary/10 text-primary border-primary/20';
  }

  return provider === 'kokoro'
    ? 'bg-sky-500/10 text-sky-400'
    : 'bg-primary/10 text-primary';
}
