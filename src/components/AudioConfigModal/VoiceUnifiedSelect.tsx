'use client';

import { useEffect, useState } from 'react';

import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import type { Voice } from '@/types/models';

import {
  VoiceCatalogEmpty,
  VoiceCatalogError,
  VoiceCatalogLoading,
} from './VoiceCatalogFeedback';
import { VoiceOptionContent } from './VoiceOptionContent';
import { VoiceSamplePlayButton } from './VoiceSamplePlayButton';
import { VoiceSelectOption } from './VoiceSelectOption';
import type { VoiceResponse } from './utils';

export interface VoiceUnifiedSelectProps {
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

const triggerClassName = cn(
  'w-full min-h-[58px] h-auto px-3.5 py-2.5 rounded-xl bg-card hover:bg-secondary/20',
  'border-border shadow-sm text-left',
  'data-[placeholder]:text-muted-foreground',
  '[&>span]:w-full [&>span]:line-clamp-none',
);

export function VoiceUnifiedSelect({
  voices,
  isLoading,
  isError,
  error,
  onRetry,
  selectedVoiceSlug,
  onSelectVoiceSlug,
  selectedVoiceObj,
  playingVoiceSlug,
  onTogglePlay,
  containerOpen = true,
}: VoiceUnifiedSelectProps) {
  const [selectOpen, setSelectOpen] = useState(false);

  useEffect(() => {
    if (!containerOpen) {
      setSelectOpen(false);
    }
  }, [containerOpen]);

  return (
    <div className="space-y-2">
      <Label
        htmlFor="voice-unified-select"
        className="text-sm font-medium text-foreground"
      >
        Voice Profile
      </Label>

      {isLoading ? (
        <VoiceCatalogLoading />
      ) : isError ? (
        <VoiceCatalogError error={error} onRetry={onRetry} />
      ) : voices.length === 0 ? (
        <VoiceCatalogEmpty />
      ) : (
        <div className="relative w-full">
          <Select
            value={selectedVoiceSlug}
            onValueChange={onSelectVoiceSlug}
            open={selectOpen}
            onOpenChange={setSelectOpen}
          >
            <SelectTrigger
              id="voice-unified-select"
              className={cn(
                triggerClassName,
                selectOpen && 'border-primary ring-2 ring-primary/30',
              )}
            >
              {selectedVoiceObj ? (
                <span className="flex w-full min-w-0 pr-10 text-left">
                  <VoiceOptionContent
                    voice={selectedVoiceObj}
                    variant="trigger"
                  />
                </span>
              ) : (
                <SelectValue placeholder="Select a voice..." />
              )}
            </SelectTrigger>

            <SelectContent
              position="popper"
              hideScrollButtons
              viewportClassName="max-h-[250px] p-1.5"
              className="z-[100] max-h-[250px] rounded-xl"
            >
              {voices.map((v) => (
                <VoiceSelectOption
                  key={v.voice.id}
                  voice={v.voice}
                  playingVoiceSlug={playingVoiceSlug}
                  onTogglePlay={onTogglePlay}
                />
              ))}
            </SelectContent>
          </Select>

          {selectedVoiceObj && (
            <div
              className="pointer-events-auto absolute right-9 top-1/2 z-10 -translate-y-1/2 [&_svg]:pointer-events-auto"
              onPointerDown={(e) => e.preventDefault()}
            >
              <VoiceSamplePlayButton
                voiceSlug={selectedVoiceObj.slug}
                sampleAudioUrl={selectedVoiceObj.sampleAudioUrl}
                isPlaying={playingVoiceSlug === selectedVoiceObj.slug}
                onToggle={onTogglePlay}
                size="md"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
