'use client';

import { cn } from '@/lib/utils';

import useConnect from './connect';
import type { PlaybackProgressBarProps } from './types';

/**
 * YouTube-style playback bar with played, generated/buffered, and total regions.
 */
export function PlaybackProgressBar(props: PlaybackProgressBarProps) {
  const {
    trackRef,
    playedPercent,
    availablePercent,
    compact,
    disabled,
    ariaLabel,
    ariaValueMax,
    ariaValueNow,
    ariaValueText,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    handleKeyDown,
  } = useConnect(props);

  return (
    <div
      ref={trackRef}
      role="slider"
      aria-label={ariaLabel}
      aria-valuemin={0}
      aria-valuemax={ariaValueMax}
      aria-valuenow={ariaValueNow}
      aria-valuetext={ariaValueText}
      aria-disabled={disabled}
      tabIndex={disabled ? -1 : 0}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onKeyDown={handleKeyDown}
      className={cn(
        'relative w-full touch-none select-none',
        compact ? 'h-1 cursor-pointer' : 'h-1.5 cursor-pointer group',
        disabled && 'cursor-not-allowed opacity-50',
      )}
    >
      <div className="absolute inset-0 rounded-full bg-muted" />
      <div
        className="absolute inset-y-0 left-0 rounded-full bg-muted-foreground/35"
        style={{ width: `${availablePercent}%` }}
        aria-hidden="true"
      />
      <div
        className="absolute inset-y-0 left-0 rounded-full bg-primary transition-[width] duration-100"
        style={{ width: `${playedPercent}%` }}
        aria-hidden="true"
      />
      {!compact ? (
        <div
          className="absolute top-1/2 size-3.5 -translate-y-1/2 rounded-full border border-primary bg-background shadow-sm opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100"
          style={{ left: `calc(${playedPercent}% - 7px)` }}
          aria-hidden="true"
        />
      ) : null}
    </div>
  );
}
