'use client';

import { Loader2, Volume2 } from 'lucide-react';
import { useCallback } from 'react';

import {
  AudioConfigModal,
  type AudioConfig,
} from '@/components/AudioConfigModal';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

import type { LessonStatus } from '@/types/models';
import useConnect from './connect';
import type { GenerateAudioButtonProps } from './types';

export function GenerateAudioButton({
  lesson,
  onGenerate,
  isGenerating = false,
  className,
}: GenerateAudioButtonProps) {
  const { getButtonState, isRegeneration, isModalOpen, setIsModalOpen } =
    useConnect();

  const status = lesson.status as LessonStatus;
  const buttonState = getButtonState(status, isGenerating);

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      if (buttonState.disabled) return;

      // Shift+Click for quick generation (bypass modal, use defaults)
      if (e.shiftKey) {
        onGenerate();
      } else {
        // Normal click opens modal for configuration
        setIsModalOpen(true);
      }
    },
    [onGenerate, buttonState.disabled, setIsModalOpen],
  );

  const handleGenerateFromModal = useCallback(
    (config: AudioConfig) => {
      // Convert modal config to API format
      onGenerate({ voice: config.voice, speed: config.speed });
    },
    [onGenerate],
  );

  const button = (
    <Button
      type="button"
      variant={buttonState.variant}
      size="sm"
      className={cn(
        // Base styles - ensure minimum touch target
        'min-h-[36px] min-w-[36px]',
        // Cyan outline styling for audio button
        !buttonState.disabled &&
          'border-[#7dcfff] text-[#7dcfff] hover:bg-[#7dcfff]/10',
        // Focus state: visible cyan outline
        'focus-visible:ring-[#7dcfff] focus-visible:ring-2',
        // Responsive: hide text on small screens, show only icon
        'px-2 sm:px-3',
        className,
      )}
      onClick={handleClick}
      disabled={buttonState.disabled}
      aria-label={`${buttonState.label} for ${lesson.title}`}
      aria-busy={isGenerating || status === 'AUDIO_GENERATING'}
      title={
        buttonState.tooltip ||
        'Hold Shift and click for quick generation with defaults'
      }
    >
      {buttonState.icon === 'spinner' ? (
        <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
      ) : (
        <Volume2 className="h-4 w-4" aria-hidden="true" />
      )}
      {/* Hide text on mobile, show on sm+ */}
      <span className="hidden sm:inline">{buttonState.label}</span>
    </Button>
  );

  // Wrap with tooltip if there's a tooltip message
  const buttonWithTooltip = buttonState.tooltip ? (
    <Tooltip>
      <TooltipTrigger asChild>
        <span>{button}</span>
      </TooltipTrigger>
      <TooltipContent>{buttonState.tooltip}</TooltipContent>
    </Tooltip>
  ) : (
    button
  );

  return (
    <>
      {buttonWithTooltip}
      <AudioConfigModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        lessonTitle={lesson.title}
        onGenerate={handleGenerateFromModal}
        isGenerating={isGenerating}
        isRegeneration={isRegeneration(status)}
      />
    </>
  );
}
