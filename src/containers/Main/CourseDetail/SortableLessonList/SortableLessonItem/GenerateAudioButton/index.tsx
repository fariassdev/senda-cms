'use client';

import { Loader2, Volume2 } from 'lucide-react';
import { useCallback } from 'react';

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
  const { getButtonState } = useConnect();

  const status = lesson.status as LessonStatus;
  const buttonState = getButtonState(status, isGenerating);

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      // Shift+Click for quick generation (same pattern as GenerateScriptButton)
      if (e.shiftKey || !buttonState.disabled) {
        onGenerate();
      }
    },
    [onGenerate, buttonState.disabled],
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
  if (buttonState.tooltip) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <span>{button}</span>
        </TooltipTrigger>
        <TooltipContent>{buttonState.tooltip}</TooltipContent>
      </Tooltip>
    );
  }

  return button;
}
