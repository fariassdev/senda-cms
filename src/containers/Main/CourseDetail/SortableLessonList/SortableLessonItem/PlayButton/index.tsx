'use client';

import { Pause, PlayCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

import useConnect from './connect';
import type { PlayButtonProps } from './types';

/**
 * Play button for lesson audio playback
 * Shows Play icon when audio can be played, Pause when playing
 * Disabled when lesson doesn't have audio
 */
export function PlayButton(props: PlayButtonProps) {
  const { canPlay, isCurrentlyPlaying, handleClick, ariaLabel, tooltipText } =
    useConnect(props);

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className={`h-8 w-8 ${
              isCurrentlyPlaying
                ? 'text-primary'
                : canPlay
                  ? ''
                  : 'text-muted-foreground'
            }`}
            aria-label={ariaLabel}
            disabled={!canPlay}
            onClick={handleClick}
          >
            {isCurrentlyPlaying ? (
              <Pause className="h-4 w-4" />
            ) : (
              <PlayCircle className="h-4 w-4" />
            )}
          </Button>
        </span>
      </TooltipTrigger>
      <TooltipContent>{tooltipText}</TooltipContent>
    </Tooltip>
  );
}

export default PlayButton;
