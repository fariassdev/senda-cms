import { describe, expect, it } from 'vitest';

import { calculateScriptMetrics } from './constants';

describe('calculateScriptMetrics', () => {
  it('calculates metrics for script with speak and pause parts', () => {
    const script = [
      { type: 'speak', content: 'Hello world this is a test', duration: null },
      { type: 'pause', content: null, duration: 3 },
      { type: 'speak', content: 'Another sentence here', duration: null },
      { type: 'pause', content: null, duration: 2 },
    ];

    const result = calculateScriptMetrics(script, 10);

    expect(result.wordCount).toBe(9); // 6 + 3 words
    expect(result.charCount).toBe(47); // 26 + 21 characters (including spaces)
    expect(result.totalPauseSeconds).toBe(5); // 3 + 2 seconds
    expect(result.totalDurationMinutes).toBe(2); // ceil(1 + 5/60) = ceil(1.083) = 2
    expect(result.pausePercentage).toBe(4); // round((5/60) / 2 * 100) ≈ 4%
    expect(result.targetDurationMinutes).toBe(10);
  });

  it('handles empty script', () => {
    const result = calculateScriptMetrics([], 5);

    expect(result.wordCount).toBe(0);
    expect(result.charCount).toBe(0);
    expect(result.totalPauseSeconds).toBe(0);
    expect(result.totalDurationMinutes).toBe(1); // minimum 1 minute
    expect(result.pausePercentage).toBe(0);
    expect(result.targetDurationMinutes).toBe(5);
  });

  it('handles script with only speak parts', () => {
    const script = [
      {
        type: 'speak',
        content:
          'This is a long sentence with many words to test the calculation properly',
        duration: null,
      },
    ];

    const result = calculateScriptMetrics(script, 8);

    expect(result.wordCount).toBe(13);
    expect(result.charCount).toBe(72);
    expect(result.totalPauseSeconds).toBe(0);
    expect(result.totalDurationMinutes).toBe(1);
    expect(result.pausePercentage).toBe(0);
    expect(result.targetDurationMinutes).toBe(8);
  });

  it('handles script with only pause parts', () => {
    const script = [
      { type: 'pause', content: null, duration: 10 },
      { type: 'pause', content: null, duration: 20 },
    ];

    const result = calculateScriptMetrics(script, 2);

    expect(result.wordCount).toBe(0);
    expect(result.charCount).toBe(0);
    expect(result.totalPauseSeconds).toBe(30);
    expect(result.totalDurationMinutes).toBe(2); // ceil(1 + 30/60) = ceil(1.5) = 2
    expect(result.pausePercentage).toBe(25); // round(30/60 / 2 * 100) = 25%
    expect(result.targetDurationMinutes).toBe(2);
  });

  it('handles null/undefined content and duration safely', () => {
    const script = [
      { type: 'speak', content: null, duration: null },
      { type: 'speak', content: undefined, duration: null },
      { type: 'pause', content: null, duration: null },
      { type: 'pause', content: null, duration: undefined },
      { type: 'speak', content: 'Valid content', duration: null },
    ];

    const result = calculateScriptMetrics(script, 3);

    expect(result.wordCount).toBe(2); // only "Valid content"
    expect(result.charCount).toBe(13); // length of "Valid content"
    expect(result.totalPauseSeconds).toBe(0); // null durations treated as 0
  });

  it('calculates reading time correctly for large word counts', () => {
    const longContent = 'word '.repeat(200); // 200 words
    const script = [
      { type: 'speak', content: longContent.trim(), duration: null },
    ];

    const result = calculateScriptMetrics(script, 5);

    expect(result.wordCount).toBe(200);
  });

  it('handles target duration comparison highlighting', () => {
    const script = [
      { type: 'speak', content: 'Short content', duration: null },
    ];

    // Test case where estimated duration is more than 1 minute different from target
    const result = calculateScriptMetrics(script, 3); // target = 3, estimated = 1

    expect(result.targetDurationMinutes).toBe(3);
    expect(result.totalDurationMinutes).toBe(1);
    // The difference is 2 minutes (> 1), so should highlight in UI
    expect(
      Math.abs(result.totalDurationMinutes - result.targetDurationMinutes),
    ).toBe(2);
  });

  it('rounds pause percentage correctly', () => {
    const script = [
      { type: 'speak', content: 'word '.repeat(150), duration: null }, // 150 words = 1 minute reading
      { type: 'pause', content: null, duration: 18 }, // 18 seconds = 0.3 minutes
    ];

    const result = calculateScriptMetrics(script, 5);

    expect(result.totalPauseSeconds).toBe(18);
    expect(result.totalDurationMinutes).toBe(2); // ceil(1 + 18/60) = ceil(1.3) = 2
    expect(result.pausePercentage).toBe(15); // round(18/60 / 2 * 100) = round(0.3/2 * 100) = 15%
  });
});
