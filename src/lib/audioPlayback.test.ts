import { describe, expect, it } from 'vitest';

import {
  getBufferedEnd,
  getFiniteDuration,
  getMaxSeekTime,
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
});
