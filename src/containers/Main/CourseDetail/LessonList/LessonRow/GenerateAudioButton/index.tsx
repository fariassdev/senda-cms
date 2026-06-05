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

  const handleClick = useCallback(() => {
    if (buttonState.disabled) return;
    setIsModalOpen(true);
  }, [buttonState.disabled, setIsModalOpen]);

  const handleGenerateFromModal = useCallback(
    (config: AudioConfig) => {
      onGenerate(config);
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
        // Primary outline styling for audio button
        !buttonState.disabled &&
          // Responsive: hide text on small screens, show only icon, fixed width on desktop
          'px-2 sm:px-0 sm:w-[155px]',
        className,
      )}
      onClick={handleClick}
      disabled={buttonState.disabled}
      aria-label={`${buttonState.label} for ${lesson.title}`}
      aria-busy={isGenerating || status === 'AUDIO_GENERATING'}
      title={buttonState.tooltip ?? undefined}
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
