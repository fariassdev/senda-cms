import type { Lesson } from '@/types/models';

/**
 * Returns the end time (seconds) of the last buffered range, or 0 if none.
 */
export function getBufferedEnd(audio: HTMLAudioElement): number {
  const { buffered } = audio;
  if (buffered.length === 0) {
    return 0;
  }
  return buffered.end(buffered.length - 1);
}

/**
 * Returns a finite media duration when available.
 */
export function getFiniteDuration(audio: HTMLAudioElement): number {
  const { duration } = audio;
  return Number.isFinite(duration) && duration > 0 ? duration : 0;
}

/**
 * Maximum seek target: buffered range while generating, full duration when VOD.
 */
export function getMaxSeekTime(
  audio: HTMLAudioElement,
  isLiveGenerating: boolean,
): number {
  if (isLiveGenerating) {
    return getBufferedEnd(audio);
  }
  return getFiniteDuration(audio);
}

/** Estimated full audio length from lesson metadata (seconds). */
export function getEstimatedTotalDuration(lesson: Lesson | null): number {
  if (!lesson?.durationMinutes || lesson.durationMinutes <= 0) {
    return 0;
  }
  return lesson.durationMinutes * 60;
}

/** Timeline denominator for the streaming progress bar. */
export function getTimelineTotalDuration(
  isLiveGenerating: boolean,
  availableDuration: number,
  estimatedTotalDuration: number,
): number {
  if (isLiveGenerating && estimatedTotalDuration > 0) {
    return Math.max(estimatedTotalDuration, availableDuration);
  }
  return availableDuration;
}

/** Maps a duration value to a percentage of the total timeline. */
export function toTimelinePercent(value: number, total: number): number {
  if (total <= 0) {
    return 0;
  }
  return Math.min(100, Math.max(0, (value / total) * 100));
}
