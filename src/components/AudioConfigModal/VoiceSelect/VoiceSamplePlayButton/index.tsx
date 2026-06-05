'use client';

import { Play, Volume2 } from 'lucide-react';

import { cn } from '@/lib/utils';

import { PLAY_ICON_CLASSES, SIZE_CLASSES } from './constants';
import type { VoiceSamplePlayButtonProps } from './types';

/**
 * Radix Select selects items on pointerup (not click). Stop that event from
 * bubbling so preview works without closing the menu. Do not preventDefault on
 * pointerdown — it can suppress the click event entirely.
 */
function stopSelectItemSelection(e: React.SyntheticEvent) {
  e.stopPropagation();
}

export function VoiceSamplePlayButton({
  voiceSlug,
  sampleAudioUrl,
  isPlaying,
  onToggle,
  size = 'md',
}: VoiceSamplePlayButtonProps) {
  if (!sampleAudioUrl) {
    return (
      <div
        className={cn(
          'rounded-full bg-secondary/20 flex items-center justify-center',
          SIZE_CLASSES[size],
        )}
      >
        <Volume2
          className={cn(
            'text-muted-foreground/40',
            size === 'sm' ? 'h-3 w-3' : 'h-3 w-3',
          )}
        />
      </div>
    );
  }

  const handleActivate = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggle(e, voiceSlug, sampleAudioUrl);
  };

  return (
    <button
      type="button"
      onPointerDown={stopSelectItemSelection}
      onPointerUp={stopSelectItemSelection}
      onClick={handleActivate}
      className={cn(
        'pointer-events-auto flex items-center justify-center rounded-full border transition-all duration-200',
        '[&_svg]:pointer-events-auto',
        SIZE_CLASSES[size],
        isPlaying
          ? 'bg-primary/20 border-primary text-primary hover:bg-primary/30'
          : size === 'md'
            ? 'bg-secondary/40 border-border text-foreground hover:bg-secondary/80'
            : 'bg-secondary hover:bg-secondary-foreground/10 border-border text-muted-foreground hover:text-foreground',
      )}
      title={isPlaying ? 'Pause sample' : 'Play sample preview'}
      aria-label={isPlaying ? 'Pause sample' : 'Play sample preview'}
    >
      {isPlaying ? (
        <div
          className={cn('senda-soundwave playing', size === 'sm' && 'scale-75')}
        >
          <span className="bar-1" />
          <span className="bar-2" />
          <span className="bar-3" />
          <span className="bar-4" />
        </div>
      ) : (
        <Play className={cn(PLAY_ICON_CLASSES[size], 'fill-current ml-0.5')} />
      )}
    </button>
  );
}
