import { describe, expect, it } from 'vitest';

import type { Lesson } from '@/types/models';

import {
  getBufferedEnd,
  getEstimatedTotalDuration,
  getFiniteDuration,
  getMaxSeekTime,
  getTimelineTotalDuration,
  toTimelinePercent,
} from './audioPlayback';

function createAudioStub({
  duration = NaN,
  bufferedRanges = [] as Array<[number, number]>,
}): HTMLAudioElement {
  const buffered = {
    length: bufferedRanges.length,
    start: (index: number) => bufferedRanges[index]?.[0] ?? 0,
    end: (index: number) => bufferedRanges[index]?.[1] ?? 0,
  };

  return { duration, buffered } as HTMLAudioElement;
}

describe('audioPlayback', () => {
  it('returns buffered end for generating seek limits', () => {
    const audio = createAudioStub({ bufferedRanges: [[0, 42.5]] });

    expect(getBufferedEnd(audio)).toBe(42.5);
    expect(getMaxSeekTime(audio, true)).toBe(42.5);
  });

  it('uses finite duration for completed playback', () => {
    const audio = createAudioStub({
      duration: 120,
      bufferedRanges: [[0, 30]],
    });

    expect(getFiniteDuration(audio)).toBe(120);
    expect(getMaxSeekTime(audio, false)).toBe(120);
  });

  it('estimates total duration from lesson metadata', () => {
    const lesson = { durationMinutes: 10 } as Lesson;

    expect(getEstimatedTotalDuration(lesson)).toBe(600);
    expect(getEstimatedTotalDuration(null)).toBe(0);
  });

  it('derives timeline totals for streaming playback', () => {
    expect(getTimelineTotalDuration(true, 72, 600)).toBe(600);
    expect(getTimelineTotalDuration(true, 720, 600)).toBe(720);
    expect(getTimelineTotalDuration(false, 540, 600)).toBe(540);
  });

  it('maps timeline values to percentages', () => {
    expect(toTimelinePercent(30, 600)).toBe(5);
    expect(toTimelinePercent(0, 0)).toBe(0);
  });
});
