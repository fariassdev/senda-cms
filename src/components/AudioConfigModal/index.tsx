'use client';

import { AlertTriangle, Gauge, Loader2 } from 'lucide-react';

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

import { VoiceSelect } from './VoiceSelect';
import useConnect from './connect';
import { SPEECH_RATE_CONFIG, WARNING_BANNER_TEXT } from './constants';
import type { AudioConfigModalProps } from './types';

/**
 * AudioConfigModal — configuration for audio generation (all TTS providers).
 */
export function AudioConfigModal(props: AudioConfigModalProps) {
  const { open, lessonTitle, isGenerating, isRegeneration = false } = props;

  const {
    voices,
    isLoading,
    isError,
    error,
    refetchVoices,
    selectedVoiceSlug,
    setSelectedVoiceSlug,
    selectedVoiceObj,
    speed,
    setSpeed,
    supportsSpeechRateControl,
    playingVoiceSlug,
    togglePlay,
    config,
    handleSubmit,
    handleCancel,
    handleOpenChange,
    getSubmitButtonLabel,
    isSubmitDisabled,
  } = useConnect(props);

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
          <VoiceSelect
            voices={voices}
            isLoading={isLoading}
            isError={isError}
            error={error}
            onRetry={refetchVoices}
            selectedVoiceSlug={selectedVoiceSlug}
            onSelectVoiceSlug={setSelectedVoiceSlug}
            selectedVoiceObj={selectedVoiceObj}
            playingVoiceSlug={playingVoiceSlug}
            onTogglePlay={togglePlay}
            containerOpen={open}
          />

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
