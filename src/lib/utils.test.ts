import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { formatTimestamp } from './utils';

describe('formatTimestamp', () => {
  // Use Vitest's fake timers for consistent test results
  const mockNow = new Date('2025-11-30T12:00:00Z');

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(mockNow);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('relative timestamps (< 7 days)', () => {
    it('formats recent timestamps with "ago" suffix', () => {
      const recentDate = '2025-11-29T10:00:00Z'; // 1 day ago
      const result = formatTimestamp(recentDate);
      expect(result).toMatch(/ago$/);
    });

    it('formats timestamps within 7 days as relative', () => {
      const testCases = [
        { date: '2025-11-30T11:00:00Z', expectedContains: '1 hour' },
        { date: '2025-11-29T12:00:00Z', expectedContains: '1 day' },
        { date: '2025-11-25T12:00:00Z', expectedContains: '5 days' },
        { date: '2025-11-24T12:00:00Z', expectedContains: '6 days' },
      ];

      testCases.forEach(({ date, expectedContains }) => {
        const result = formatTimestamp(date);
        expect(result).toContain(expectedContains);
      });
    });
  });

  describe('absolute timestamps (>= 7 days)', () => {
    it('formats older timestamps as absolute dates', () => {
      const oldDate = '2025-11-20T12:00:00Z'; // More than 7 days ago
      const result = formatTimestamp(oldDate);
      expect(result).toMatch(/Nov \d{1,2}, 2025/);
    });

    it('formats timestamps exactly 7 days ago as absolute', () => {
      const sevenDaysAgo = '2025-11-23T12:00:00Z'; // Exactly 7 days ago
      const result = formatTimestamp(sevenDaysAgo);
      expect(result).toMatch(/Nov \d{1,2}, 2025/);
    });

    it('formats much older timestamps correctly', () => {
      const veryOldDate = '2024-01-15T12:00:00Z';
      const result = formatTimestamp(veryOldDate);
      expect(result).toBe('Jan 15, 2024');
    });
  });
});
