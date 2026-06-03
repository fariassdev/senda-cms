'use client';

import { Play, Volume2 } from 'lucide-react';
import { useRef } from 'react';

import { cn } from '@/lib/utils';

type VoiceSamplePlayButtonSize = 'sm' | 'md';

interface VoiceSamplePlayButtonProps {
  voiceSlug: string;
  sampleAudioUrl?: string | null;
  isPlaying: boolean;
  onToggle: (
    e: React.MouseEvent,
    voiceSlug: string,
    sampleAudioUrl: string | null | undefined,
  ) => void;
  size?: VoiceSamplePlayButtonSize;
}

const sizeClasses: Record<VoiceSamplePlayButtonSize, string> = {
  sm: 'size-7',
  md: 'size-8',
};

const playIconClasses: Record<VoiceSamplePlayButtonSize, string> = {
  sm: 'h-3 w-3',
  md: 'h-3.5 w-3.5',
};

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
  const activatedByPointerRef = useRef(false);

  if (!sampleAudioUrl) {
    return (
      <div
        className={cn(
          'rounded-full bg-secondary/20 flex items-center justify-center',
          sizeClasses[size],
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

  const handleActivate = (e: React.MouseEvent | React.PointerEvent) => {
    stopSelectItemSelection(e);
    onToggle(e as React.MouseEvent, voiceSlug, sampleAudioUrl);
  };

  return (
    <button
      type="button"
      onPointerDown={stopSelectItemSelection}
      onPointerUp={(e) => {
        stopSelectItemSelection(e);
        activatedByPointerRef.current = true;
        handleActivate(e);
      }}
      onClick={(e) => {
        stopSelectItemSelection(e);
        if (activatedByPointerRef.current) {
          activatedByPointerRef.current = false;
          return;
        }
        handleActivate(e);
      }}
      className={cn(
        'pointer-events-auto flex items-center justify-center rounded-full border transition-all duration-200',
        '[&_svg]:pointer-events-auto',
        sizeClasses[size],
        isPlaying
          ? 'bg-primary/20 border-primary text-primary hover:bg-primary/30'
          : size === 'md'
            ? 'bg-secondary/40 border-border text-foreground hover:bg-secondary/80'
            : 'bg-secondary hover:bg-secondary-foreground/10 border-border text-muted-foreground hover:text-foreground',
      )}
      title={isPlaying ? 'Pause sample' : 'Play sample preview'}
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
        <Play className={cn(playIconClasses[size], 'fill-current ml-0.5')} />
      )}
    </button>
  );
}
