'use client';

import { AlertTriangle, Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';

import useConnect from './connect';
import {
  MODAL_CONFIG,
  SPEECH_RATE_CONFIG,
  VOICE_OPTIONS,
  WARNING_BANNER_TEXT,
} from './constants';
import type { AudioConfigModalProps } from './types';

/**
 * AudioConfigModal Component
 * Configuration modal for audio generation settings.
 * Allows users to select voice and adjust speech rate before generation.
 *
 * Features:
 * - Voice selection dropdown with descriptions
 * - Speech rate slider (0.7x - 1.3x)
 * - Regeneration warning banner
 * - Accessible with keyboard navigation and screen reader support
 */
export function AudioConfigModal({
  open,
  onOpenChange,
  lessonTitle,
  onGenerate,
  isGenerating,
  isRegeneration = false,
}: AudioConfigModalProps) {
  const { voice, setVoice, speed, setSpeed, getConfig, resetToDefaults } =
    useConnect();

  const config = isRegeneration
    ? MODAL_CONFIG.regenerate
    : MODAL_CONFIG.generate;

  const handleSubmit = () => {
    onGenerate(getConfig());
    onOpenChange(false);
  };

  const handleCancel = () => {
    resetToDefaults();
    onOpenChange(false);
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      resetToDefaults();
    }
    onOpenChange(newOpen);
  };

  // Get button label based on state
  const getSubmitButtonLabel = () => {
    if (isGenerating) {
      return isRegeneration ? 'Regenerating...' : 'Generating...';
    }
    return config.submitLabel;
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[450px] backdrop-blur-lg">
        <DialogHeader>
          <DialogTitle>{config.title}</DialogTitle>
          <DialogDescription>
            {config.description}
            <span className="block mt-1 text-xs opacity-70">
              Lesson: {lessonTitle}
            </span>
          </DialogDescription>
        </DialogHeader>

        {/* Warning Banner for regeneration - WCAG accessible with role="alert" */}
        {isRegeneration && (
          <div
            role="alert"
            className="flex items-center gap-2 rounded-md bg-amber-500/10 border border-amber-500/30 p-3 text-amber-600 dark:text-amber-400"
          >
            <AlertTriangle
              className="h-5 w-5 flex-shrink-0"
              aria-hidden="true"
            />
            <p className="text-sm">{WARNING_BANNER_TEXT}</p>
          </div>
        )}

        <div className="space-y-6 py-4">
          {/* Voice Selection */}
          <div className="space-y-2">
            <Label htmlFor="voice-select">Voice</Label>
            <Select value={voice} onValueChange={setVoice}>
              <SelectTrigger
                id="voice-select"
                className="w-full min-h-[42px] text-left [&>span]:w-full [&>span]:text-left"
              >
                <SelectValue placeholder="Select a voice" />
              </SelectTrigger>
              <SelectContent>
                {VOICE_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex flex-col items-start text-left">
                      <span className="font-medium">{option.label}</span>
                      <span className="text-xs text-muted-foreground">
                        {option.description}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Speech Rate Slider */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="speech-rate">Speech Rate</Label>
              <span
                className="text-sm font-medium text-primary"
                aria-live="polite"
              >
                {speed.toFixed(1)}x
              </span>
            </div>
            <Slider
              id="speech-rate"
              min={SPEECH_RATE_CONFIG.min}
              max={SPEECH_RATE_CONFIG.max}
              step={SPEECH_RATE_CONFIG.step}
              value={[speed]}
              onValueChange={(values) =>
                setSpeed(values[0] ?? SPEECH_RATE_CONFIG.default)
              }
              className="w-full [&_[data-slot=slider-range]]:bg-primary [&_[data-slot=slider-thumb]]:border-primary"
              aria-label={`Speech rate: ${speed.toFixed(1)}x`}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>0.7x (Slower)</span>
              <span>1.3x (Faster)</span>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-3 sm:gap-2">
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
            disabled={isGenerating}
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

// Re-export types for consumers
export type { AudioConfig, AudioConfigModalProps } from './types';
