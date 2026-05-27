'use client';

import { AlertTriangle, Loader2, Volume2, Sparkles } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

import { ChatterboxConfig } from './chatterbox/ChatterboxConfig';
import useConnect from './connect';
import { MODAL_CONFIG, WARNING_BANNER_TEXT } from './constants';
import { KokoroConfig } from './kokoro/KokoroConfig';
import type { AudioConfigModalProps } from './types';

/**
 * AudioConfigModal Component
 * Configuration modal for audio generation settings.
 * Allows users to choose the audio provider (KokoroTTS or ChatterboxTTS),
 * select voice, and adjust settings before generation.
 *
 * Features:
 * - Provider switching tabs with modern micro-animations
 * - KokoroTTS view with legacy voices and speed multiplier slider
 * - ChatterboxTTS view with custom active voices loaded from the DB
 * - Advanced parameters visualization for Chatterbox voices
 * - WCAG accessible keyboard navigation and focus management
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
    provider,
    setProvider,
    kokoroVoice,
    setKokoroVoice,
    kokoroSpeed,
    setKokoroSpeed,
    chatterboxVoice,
    setChatterboxVoice,
    getConfig,
    resetToDefaults,
  } = useConnect();

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

  // Disable submit if generating or if Chatterbox has no voice selected yet
  const isSubmitDisabled =
    isGenerating || (provider === 'chatterbox' && !chatterboxVoice);

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[480px] backdrop-blur-lg">
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

        {/* Custom Premium Tabs for Provider selection */}
        <div className="flex border-b border-muted mt-2">
          <button
            type="button"
            onClick={() => setProvider('chatterbox')}
            className={cn(
              'flex-1 flex items-center justify-center gap-2 py-3 text-sm font-semibold border-b-2 transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-t-md',
              provider === 'chatterbox'
                ? 'border-primary text-primary bg-primary/[0.02]'
                : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/30',
            )}
            aria-selected={provider === 'chatterbox'}
            role="tab"
          >
            <Sparkles className="h-4 w-4" />
            ChatterboxTTS
          </button>
          <button
            type="button"
            onClick={() => setProvider('kokoro')}
            className={cn(
              'flex-1 flex items-center justify-center gap-2 py-3 text-sm font-semibold border-b-2 transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-t-md',
              provider === 'kokoro'
                ? 'border-primary text-primary bg-primary/[0.02]'
                : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/30',
            )}
            aria-selected={provider === 'kokoro'}
            role="tab"
          >
            <Volume2 className="h-4 w-4" />
            KokoroTTS
          </button>
        </div>

        {/* Dynamic Provider Views */}
        <div className="space-y-6 py-4 min-h-[220px] flex flex-col justify-center">
          {provider === 'kokoro' ? (
            <KokoroConfig
              voice={kokoroVoice}
              onVoiceChange={setKokoroVoice}
              speed={kokoroSpeed}
              onSpeedChange={setKokoroSpeed}
            />
          ) : (
            <ChatterboxConfig
              selectedVoice={chatterboxVoice}
              onVoiceChange={setChatterboxVoice}
            />
          )}
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

// Re-export types for consumers
export type { AudioConfig, AudioConfigModalProps } from './types';
