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
    // 9 words / 150 wpm * 60 = 3.6s reading + 5s pause = 8.6s ≈ 9s total
    expect(result.totalDurationSeconds).toBe(9);
    // Pause percentage: 5/9 * 100 ≈ 56%
    expect(result.pausePercentage).toBe(56);
    expect(result.targetDurationMinutes).toBe(10);
  });

  it('handles empty script', () => {
    const result = calculateScriptMetrics([], 5);

    expect(result.wordCount).toBe(0);
    expect(result.charCount).toBe(0);
    expect(result.totalPauseSeconds).toBe(0);
    expect(result.totalDurationSeconds).toBe(0); // 0 words = 0 seconds
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
    // 13 words / 150 wpm * 60 = 5.2s ≈ 5s
    expect(result.totalDurationSeconds).toBe(5);
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
    // 0 words reading + 30s pause = 30s
    expect(result.totalDurationSeconds).toBe(30);
    // Pause percentage: 30/30 * 100 = 100%
    expect(result.pausePercentage).toBe(100);
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
    // 200 words / 150 wpm * 60 = 80s
    expect(result.totalDurationSeconds).toBe(80);
  });

  it('handles target duration comparison highlighting', () => {
    const script = [
      { type: 'speak', content: 'Short content', duration: null },
    ];

    // Test case where estimated duration is more than 1 minute different from target
    const result = calculateScriptMetrics(script, 3); // target = 3 min = 180s

    expect(result.targetDurationMinutes).toBe(3);
    // 2 words / 150 wpm * 60 = 0.8s ≈ 1s
    expect(result.totalDurationSeconds).toBe(1);
    // The difference is > 60s, so isDurationOffTarget should be true
    expect(result.isDurationOffTarget).toBe(true);
  });

  it('rounds pause percentage correctly', () => {
    const script = [
      { type: 'speak', content: 'word '.repeat(150), duration: null }, // 150 words = 60s reading
      { type: 'pause', content: null, duration: 18 }, // 18 seconds
    ];

    const result = calculateScriptMetrics(script, 5);

    expect(result.totalPauseSeconds).toBe(18);
    // 150 words / 150 wpm * 60 = 60s reading + 18s pause = 78s
    expect(result.totalDurationSeconds).toBe(78);
    // Pause percentage: 18/78 * 100 ≈ 23%
    expect(result.pausePercentage).toBe(23);
  });
});
