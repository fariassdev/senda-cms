import type { TtsProvider } from '@/types/models';

export type VoiceBadgeVariant = 'trigger' | 'list';

export const PROVIDER_BADGE_STYLES: Record<
  TtsProvider,
  { trigger: string; list: string }
> = {
  kokoro: {
    trigger: 'bg-sky-500/10 text-sky-400 border-sky-500/20',
    list: 'bg-sky-500/10 text-sky-400',
  },
  chatterbox: {
    trigger: 'bg-primary/10 text-primary border-primary/20',
    list: 'bg-primary/10 text-primary',
  },
};

export function getProviderBadgeClassName(
  provider: TtsProvider,
  variant: VoiceBadgeVariant,
): string {
  const styles =
    PROVIDER_BADGE_STYLES[provider] ?? PROVIDER_BADGE_STYLES.chatterbox;
  return styles[variant];
}
