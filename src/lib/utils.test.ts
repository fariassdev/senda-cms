import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { formatTimestamp, sanitizeFilename } from './utils';

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

describe('sanitizeFilename', () => {
  it('replaces spaces with underscores', () => {
    expect(sanitizeFilename('Hello World')).toBe('Hello_World');
  });

  it('replaces special characters with underscores', () => {
    expect(sanitizeFilename('file@name#test!')).toBe('file_name_test');
  });

  it('preserves hyphens and underscores', () => {
    expect(sanitizeFilename('file-name_test')).toBe('file-name_test');
  });

  it('preserves alphanumeric characters', () => {
    expect(sanitizeFilename('File123Test')).toBe('File123Test');
  });

  it('collapses multiple consecutive underscores into one', () => {
    expect(sanitizeFilename('hello   world')).toBe('hello_world');
    expect(sanitizeFilename('test___file')).toBe('test_file');
  });

  it('trims leading and trailing underscores', () => {
    expect(sanitizeFilename('  test  ')).toBe('test');
    expect(sanitizeFilename('__test__')).toBe('test');
  });

  it('handles complex real-world lesson titles', () => {
    expect(sanitizeFilename('Lesson #1: Introduction')).toBe(
      'Lesson_1_Introduction',
    );
    expect(sanitizeFilename("What's Mindfulness?")).toBe('What_s_Mindfulness');
    expect(sanitizeFilename('Week 1 - Day 3 (Morning)')).toBe(
      'Week_1_-_Day_3_Morning',
    );
  });

  it('handles accented characters by replacing them', () => {
    expect(sanitizeFilename('Méditation du matin')).toBe('M_ditation_du_matin');
  });

  it('returns empty string for input with only special characters', () => {
    expect(sanitizeFilename('!@#$%')).toBe('');
  });

  it('handles empty string input', () => {
    expect(sanitizeFilename('')).toBe('');
  });
});
