'use client';

import * as SelectPrimitive from '@radix-ui/react-select';
import { CheckIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import type { Voice } from '@/types/models';

import { VoiceOptionContent } from './VoiceOptionContent';
import { VoiceSamplePlayButton } from './VoiceSamplePlayButton';

interface VoiceSelectOptionProps {
  voice: Voice;
  playingVoiceSlug: string | null;
  onTogglePlay: (
    e: React.MouseEvent,
    voiceSlug: string,
    sampleAudioUrl: string | null | undefined,
  ) => void;
}

/**
 * Radix Select item with preview control outside ItemText so play clicks
 * are not swallowed by the select item's pointer-up handler.
 */
export function VoiceSelectOption({
  voice,
  playingVoiceSlug,
  onTogglePlay,
}: VoiceSelectOptionProps) {
  return (
    <SelectPrimitive.Item
      value={voice.slug}
      textValue={voice.name}
      className={cn(
        'relative flex w-full min-h-[52px] cursor-default select-none rounded-lg',
        'py-2.5 pl-8 pr-3 outline-hidden',
        'focus:bg-secondary/20 data-[highlighted]:bg-secondary/20',
        'data-[state=checked]:bg-secondary/40 data-[state=checked]:border data-[state=checked]:border-primary/20',
        "[&_svg:not([class*='text-'])]:text-muted-foreground",
        '[&_button]:relative [&_button]:z-10 [&_button]:pointer-events-auto',
        '[&_button_svg]:pointer-events-auto',
      )}
    >
      <span className="absolute left-2 top-1/2 flex size-3.5 -translate-y-1/2 items-center justify-center text-primary">
        <SelectPrimitive.ItemIndicator>
          <CheckIcon className="size-4" />
        </SelectPrimitive.ItemIndicator>
      </span>

      <SelectPrimitive.ItemText className="block w-full min-w-0 pr-10">
        <VoiceOptionContent voice={voice} variant="list" />
      </SelectPrimitive.ItemText>

      <div className="absolute right-2 top-1/2 z-10 -translate-y-1/2 pointer-events-auto">
        <VoiceSamplePlayButton
          voiceSlug={voice.slug}
          sampleAudioUrl={voice.sampleAudioUrl}
          isPlaying={playingVoiceSlug === voice.slug}
          onToggle={onTogglePlay}
          size="sm"
        />
      </div>
    </SelectPrimitive.Item>
  );
}
