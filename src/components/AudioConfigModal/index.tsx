'use client';

import {
  AlertTriangle,
  Loader2,
  ChevronDown,
  Check,
  Gauge,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';

import { VoiceOptionContent } from './VoiceOptionContent';
import { VoiceSamplePlayButton } from './VoiceSamplePlayButton';
import useConnect from './connect';
import {
  MODAL_CONFIG,
  WARNING_BANNER_TEXT,
  SPEECH_RATE_CONFIG,
} from './constants';
import type { AudioConfigModalProps } from './types';
import { useVoiceSamplePreview } from './useVoiceSamplePreview';

/**
 * AudioConfigModal — configuration for audio generation (all TTS providers).
 */
export function AudioConfigModal({
  open,
  onOpenChange,
  lessonTitle,
  onGenerate,
  isGenerating,
  isRegeneration = false,
}: AudioConfigModalProps) {
  const {
    voices,
    isLoading,
    error,
    selectedVoiceSlug,
    setSelectedVoiceSlug,
    selectedVoiceObj,
    speed,
    setSpeed,
    supportsSpeechRateControl,
    getConfig,
    resetToDefaults,
  } = useConnect();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { playingVoiceSlug, togglePlay } = useVoiceSamplePreview(open);

  const config = isRegeneration
    ? MODAL_CONFIG.regenerate
    : MODAL_CONFIG.generate;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSubmit = () => {
    onGenerate(getConfig());
    onOpenChange(false);
    setDropdownOpen(false);
  };

  const handleCancel = () => {
    resetToDefaults();
    onOpenChange(false);
    setDropdownOpen(false);
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      resetToDefaults();
      setDropdownOpen(false);
    }
    onOpenChange(newOpen);
  };

  const getSubmitButtonLabel = () => {
    if (isGenerating) {
      return isRegeneration ? 'Regenerating...' : 'Generating...';
    }
    return config.submitLabel;
  };

  const isSubmitDisabled = isGenerating || !selectedVoiceSlug;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[480px] backdrop-blur-lg border border-border bg-background shadow-xl rounded-xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold tracking-tight text-foreground">
            {config.title}
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground/80 mt-1">
            {config.description}
            <span className="block mt-1.5 text-xs text-primary font-medium">
              Lesson: {lessonTitle}
            </span>
          </DialogDescription>
        </DialogHeader>

        {isRegeneration && (
          <div
            role="alert"
            className="flex items-start gap-3 rounded-xl bg-amber-500/10 border border-amber-500/30 p-3.5 text-amber-600 dark:text-amber-400"
          >
            <AlertTriangle
              className="h-5 w-5 flex-shrink-0 mt-0.5"
              aria-hidden="true"
            />
            <p className="text-xs leading-normal font-medium">
              {WARNING_BANNER_TEXT}
            </p>
          </div>
        )}

        <div className="space-y-5 py-3">
          <div className="space-y-2 relative" ref={dropdownRef}>
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
                  Verify the system's voice database catalog is configured.
                </p>
              </div>
            ) : (
              <>
                <div
                  id="voice-unified-select"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className={cn(
                    'w-full flex items-center justify-between min-h-[58px] px-3.5 py-2.5 bg-card hover:bg-secondary/20 border rounded-xl text-left cursor-pointer transition-all duration-200 select-none shadow-sm',
                    dropdownOpen
                      ? 'border-primary ring-2 ring-primary/30'
                      : 'border-border',
                  )}
                  role="combobox"
                  aria-expanded={dropdownOpen}
                  aria-haspopup="listbox"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setDropdownOpen(!dropdownOpen);
                    }
                  }}
                >
                  {selectedVoiceObj ? (
                    <div className="flex-1 min-w-0 pr-2">
                      <VoiceOptionContent
                        voice={selectedVoiceObj}
                        variant="trigger"
                      />
                    </div>
                  ) : (
                    <span className="text-muted-foreground text-sm font-medium">
                      Select a voice...
                    </span>
                  )}

                  <div className="flex items-center gap-2.5 flex-shrink-0">
                    {selectedVoiceObj && (
                      <VoiceSamplePlayButton
                        voiceSlug={selectedVoiceObj.slug}
                        sampleAudioUrl={selectedVoiceObj.sampleAudioUrl}
                        isPlaying={playingVoiceSlug === selectedVoiceObj.slug}
                        onToggle={togglePlay}
                        size="md"
                      />
                    )}
                    <ChevronDown
                      className={cn(
                        'h-4 w-4 text-muted-foreground/80 transition-transform duration-200',
                        dropdownOpen && 'transform rotate-180',
                      )}
                    />
                  </div>
                </div>

                {dropdownOpen && (
                  <div
                    className="absolute z-[100] left-0 right-0 mt-1.5 bg-popover border border-border shadow-xl rounded-xl p-1.5 max-h-[250px] overflow-y-auto space-y-0.5 animate-in fade-in slide-in-from-top-1 duration-200"
                    role="listbox"
                  >
                    {voices.map((v) => {
                      const isSelected = selectedVoiceSlug === v.voice.slug;
                      return (
                        <div
                          key={v.voice.id}
                          onClick={() => {
                            setSelectedVoiceSlug(v.voice.slug);
                            setDropdownOpen(false);
                          }}
                          className={cn(
                            'flex items-center justify-between w-full p-2.5 rounded-lg cursor-pointer transition-all duration-150 select-none text-left gap-2',
                            isSelected
                              ? 'bg-secondary/40 border border-primary/20'
                              : 'hover:bg-secondary/20 border border-transparent',
                          )}
                          role="option"
                          aria-selected={isSelected}
                        >
                          <div className="w-5 h-5 flex items-center justify-center flex-shrink-0 text-primary">
                            {isSelected && (
                              <Check className="h-4 w-4 stroke-[3px]" />
                            )}
                          </div>

                          <VoiceOptionContent voice={v.voice} variant="list" />

                          <div
                            className="flex-shrink-0 ml-2"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <VoiceSamplePlayButton
                              voiceSlug={v.voice.slug}
                              sampleAudioUrl={v.voice.sampleAudioUrl}
                              isPlaying={playingVoiceSlug === v.voice.slug}
                              onToggle={togglePlay}
                              size="sm"
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </>
            )}
          </div>

          {selectedVoiceObj && supportsSpeechRateControl && (
            <Card className="border border-sky-500/10 shadow-sm bg-sky-500/[0.02] rounded-xl overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-300 mt-2">
              <CardContent className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Gauge className="h-4 w-4 text-sky-400" />
                    <Label
                      htmlFor="unified-speech-rate"
                      className="text-xs font-semibold uppercase tracking-wider text-sky-400"
                    >
                      Speech Rate
                    </Label>
                  </div>
                  <span
                    className="text-sm font-semibold text-sky-400"
                    aria-live="polite"
                  >
                    {speed.toFixed(1)}x
                  </span>
                </div>

                <div className="space-y-2">
                  <Slider
                    id="unified-speech-rate"
                    min={SPEECH_RATE_CONFIG.min}
                    max={SPEECH_RATE_CONFIG.max}
                    step={SPEECH_RATE_CONFIG.step}
                    value={[speed]}
                    onValueChange={(values) =>
                      setSpeed(values[0] ?? SPEECH_RATE_CONFIG.default)
                    }
                    className="w-full [&_[data-slot=slider-range]]:bg-sky-400 [&_[data-slot=slider-thumb]]:border-sky-400"
                    aria-label={`Speech rate: ${speed.toFixed(1)}x`}
                  />
                  <div className="flex justify-between text-[10px] text-muted-foreground opacity-75 font-medium">
                    <span>0.7x (Slower)</span>
                    <span>1.3x (Faster)</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <DialogFooter className="gap-3 sm:gap-2 mt-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            disabled={isGenerating}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitDisabled}
            aria-busy={isGenerating}
          >
            {isGenerating && (
              <Loader2
                className="mr-2 h-4 w-4 animate-spin"
                aria-hidden="true"
              />
            )}
            {getSubmitButtonLabel()}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export type { AudioConfig, AudioConfigModalProps } from './types';
