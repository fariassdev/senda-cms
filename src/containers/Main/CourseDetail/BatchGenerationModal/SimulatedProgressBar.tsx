'use client';

import { useEffect, useRef, useState } from 'react';

import { Progress } from '@/components/ui/progress';

import { PROGRESS_CONFIG } from './constants';

interface SimulatedProgressBarProps {
  /** Number of lessons being processed */
  lessonCount: number;
  /** Whether the batch is currently generating (API call in progress) */
  isGenerating: boolean;
  /** Whether the batch has completed */
  isComplete: boolean;
}

/**
 * SimulatedProgressBar Component
 *
 * A self-contained progress bar that simulates progress during a synchronous
 * API call. Uses its own state to avoid re-rendering parent components.
 *
 * - Uses CSS transitions for smooth visual updates
 * - Updates every 1 second to minimize re-renders
 * - Caps at 95% until API completes, then jumps to 100%
 */
export function SimulatedProgressBar({
  lessonCount,
  isGenerating,
  isComplete,
}: SimulatedProgressBarProps) {
  const [progress, setProgress] = useState(0);
  const startTimeRef = useRef<number>(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Calculate expected duration
  const expectedDuration =
    lessonCount * PROGRESS_CONFIG.SIMULATED_TIME_PER_LESSON_MS;

  // Start/stop simulation based on generation state
  useEffect(() => {
    if (isGenerating && !isComplete) {
      // Start simulation
      startTimeRef.current = Date.now();
      setProgress(0);

      intervalRef.current = setInterval(() => {
        const elapsed = Date.now() - startTimeRef.current;
        // Cap at 95% so it doesn't show complete before API returns
        const newProgress = Math.min(
          95,
          Math.round((elapsed / expectedDuration) * 100),
        );
        setProgress(newProgress);
      }, PROGRESS_CONFIG.UPDATE_INTERVAL_MS);

      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      };
    } else if (isComplete) {
      // API completed - jump to 100%
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      setProgress(100);
    }
  }, [isGenerating, isComplete, expectedDuration]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm text-muted-foreground">
        <span>{PROGRESS_CONFIG.LABELS.progress}</span>
        <span>{progress}%</span>
      </div>
      <Progress
        value={progress}
        className="h-2 transition-all duration-1000 ease-linear"
        aria-label={PROGRESS_CONFIG.LABELS.ariaLabel}
      />
    </div>
  );
}

export default SimulatedProgressBar;
