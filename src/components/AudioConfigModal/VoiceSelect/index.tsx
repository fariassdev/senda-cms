'use client';

import { AlertCircle, Loader2, MicOff } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

import { VoiceOptionContent } from './VoiceOptionContent';
import { VoiceSamplePlayButton } from './VoiceSamplePlayButton';
import { VoiceSelectOption } from './VoiceSelectOption';
import useConnect from './connect';
import { TRIGGER_CLASS_NAME } from './constants';
import type { VoiceSelectProps } from './types';

export function VoiceSelect(props: VoiceSelectProps) {
  const {
    voices,
    isLoading,
    isError,
    onRetry,
    selectedVoiceSlug,
    onSelectVoiceSlug,
    selectedVoiceObj,
    playingVoiceSlug,
    onTogglePlay,
  } = props;

  const { selectOpen, setSelectOpen, catalogErrorMessage } = useConnect(props);

  return (
    <div className="space-y-2">
      <Label
        htmlFor="voice-unified-select"
        className="text-sm font-medium text-foreground"
      >
        Voice Profile
      </Label>

      {isLoading ? (
        <Loading />
      ) : isError ? (
        <Error errorMessage={catalogErrorMessage} onRetry={onRetry} />
      ) : voices.length === 0 ? (
        <EmptyState />
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
                TRIGGER_CLASS_NAME,
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

function Loading() {
  return (
    <div className="flex items-center gap-2.5 px-3 py-3 border border-border bg-secondary/30 rounded-xl text-muted-foreground text-sm">
      <Loader2 className="h-4 w-4 animate-spin text-primary" />
      <span>Loading active voices catalog...</span>
    </div>
  );
}

interface ErrorProps {
  errorMessage: string;
  onRetry: () => void;
}

function Error({ errorMessage, onRetry }: ErrorProps) {
  return (
    <div
      role="alert"
      className="rounded-xl bg-destructive/10 border border-destructive/20 p-3.5 space-y-3"
    >
      <div className="flex items-start gap-2.5">
        <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5 text-destructive" />
        <div className="space-y-1 text-xs">
          <p className="font-semibold text-destructive">
            Failed to load voice catalog
          </p>
          <p className="text-muted-foreground leading-normal">{errorMessage}</p>
        </div>
      </div>
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="h-8 text-xs"
        onClick={onRetry}
      >
        Try again
      </Button>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="rounded-xl bg-amber-500/10 border border-amber-500/25 p-3.5 text-xs space-y-1">
      <div className="flex items-start gap-2.5">
        <MicOff className="h-4 w-4 flex-shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
        <div className="space-y-1">
          <p className="font-semibold text-amber-700 dark:text-amber-300">
            No active voices available
          </p>
          <p className="text-muted-foreground leading-normal">
            The voice catalog has no active entries. Add or activate voices in
            the admin catalog before generating audio.
          </p>
        </div>
      </div>
    </div>
  );
}
