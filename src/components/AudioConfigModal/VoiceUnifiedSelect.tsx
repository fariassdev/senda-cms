'use client';

import { Loader2 } from 'lucide-react';
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

import { VoiceOptionContent } from './VoiceOptionContent';
import { VoiceSamplePlayButton } from './VoiceSamplePlayButton';
import { VoiceSelectOption } from './VoiceSelectOption';
import type { VoiceResponse } from './utils';

export interface VoiceUnifiedSelectProps {
  voices: VoiceResponse[];
  isLoading: boolean;
  error: unknown;
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
  error,
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
        <div className="flex items-center gap-2.5 px-3 py-3 border border-border bg-secondary/30 rounded-xl text-muted-foreground text-sm">
          <Loader2 className="h-4 w-4 animate-spin text-primary" />
          <span>Loading active voices catalog...</span>
        </div>
      ) : error || voices.length === 0 ? (
        <div className="rounded-xl bg-destructive/10 border border-destructive/20 p-3.5 text-destructive text-xs space-y-1">
          <p className="font-semibold">No active voices found</p>
          <p className="text-muted-foreground">
            Verify the system&apos;s voice database catalog is configured.
          </p>
        </div>
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
              className="z-[100] max-h-[250px] rounded-xl p-1.5"
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
