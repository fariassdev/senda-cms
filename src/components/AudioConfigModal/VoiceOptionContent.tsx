'use client';

import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { Voice } from '@/types/models';

import {
  getProviderBadgeClassName,
  type VoiceBadgeVariant,
} from './voiceDisplay';

interface VoiceOptionContentProps {
  voice: Voice;
  variant?: VoiceBadgeVariant;
}

export function VoiceOptionContent({
  voice,
  variant = 'list',
}: VoiceOptionContentProps) {
  const isTrigger = variant === 'trigger';

  return (
    <div className="min-w-0 flex-1">
      <div
        className={cn(
          'flex items-center flex-wrap',
          isTrigger ? 'gap-2' : 'gap-1.5',
        )}
      >
        <span className="font-semibold text-foreground text-sm">
          {voice.name}
        </span>
        <Badge
          variant="outline"
          className={cn(
            'text-[10px] py-0.5 px-2 capitalize rounded-full',
            isTrigger ? 'font-medium' : 'font-semibold border-none',
            getProviderBadgeClassName(voice.ttsProvider, variant),
          )}
        >
          {voice.ttsProvider}
        </Badge>
        <Badge
          variant="outline"
          className={cn(
            'text-[10px] py-0.5 px-2 capitalize rounded-full',
            isTrigger
              ? 'font-medium border-muted-foreground/20 text-muted-foreground'
              : 'font-semibold border-none bg-muted text-muted-foreground',
          )}
        >
          {voice.gender}
        </Badge>
      </div>
      {voice.description && (
        <p
          className={cn(
            'text-xs text-muted-foreground font-normal',
            isTrigger
              ? 'line-clamp-1 mt-1'
              : 'text-muted-foreground/80 truncate mt-0.5',
          )}
        >
          {voice.description}
        </p>
      )}
    </div>
  );
}
