import { useCallback, useMemo, useRef } from 'react';

import { toTimelinePercent } from '@/lib/audioPlayback';

import type { PlaybackProgressBarProps } from './types';

const KEYBOARD_SEEK_STEP_SECONDS = 5;
const KEYBOARD_SEEK_STEP_LARGE_SECONDS = 30;

export default function useConnect({
  progress,
  availableDuration,
  totalDuration,
  disabled = false,
  compact = false,
  onSeek,
  'aria-label': ariaLabel = 'Playback progress',
}: PlaybackProgressBarProps) {
  const trackRef = useRef<HTMLDivElement>(null);

  const playedPercent = useMemo(
    () => toTimelinePercent(progress, totalDuration),
    [progress, totalDuration],
  );
  const availablePercent = useMemo(
    () => toTimelinePercent(availableDuration, totalDuration),
    [availableDuration, totalDuration],
  );

  const seekFromClientX = useCallback(
    (clientX: number) => {
      const track = trackRef.current;
      if (!track || disabled || totalDuration <= 0) {
        return;
      }

      const rect = track.getBoundingClientRect();
      if (rect.width <= 0) {
        return;
      }

      const ratio = Math.min(
        1,
        Math.max(0, (clientX - rect.left) / rect.width),
      );
      onSeek(ratio * totalDuration);
    },
    [disabled, onSeek, totalDuration],
  );

  const handlePointerDown = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (disabled) {
        return;
      }

      seekFromClientX(event.clientX);
      event.currentTarget.setPointerCapture(event.pointerId);
    },
    [disabled, seekFromClientX],
  );

  const handlePointerMove = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (disabled || !event.currentTarget.hasPointerCapture(event.pointerId)) {
        return;
      }

      seekFromClientX(event.clientX);
    },
    [disabled, seekFromClientX],
  );

  const handlePointerUp = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (event.currentTarget.hasPointerCapture(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId);
      }
    },
    [],
  );

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (disabled) {
        return;
      }

      const step = event.shiftKey
        ? KEYBOARD_SEEK_STEP_LARGE_SECONDS
        : KEYBOARD_SEEK_STEP_SECONDS;

      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        onSeek(progress - step);
      } else if (event.key === 'ArrowRight') {
        event.preventDefault();
        onSeek(progress + step);
      }
    },
    [disabled, onSeek, progress],
  );

  return {
    trackRef,
    playedPercent,
    availablePercent,
    compact,
    disabled,
    ariaLabel,
    ariaValueMax: Math.round(totalDuration),
    ariaValueNow: Math.round(progress),
    ariaValueText: `${Math.round(progress)} seconds of ${Math.round(totalDuration)} seconds`,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    handleKeyDown,
  };
}
