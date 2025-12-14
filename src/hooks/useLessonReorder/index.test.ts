// @vitest-environment jsdom
import { useQueryClient } from '@tanstack/react-query';
import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi, type Mock } from 'vitest';

import { $api } from '@/lib/api';
import type { Lesson } from '@/types/models';
import useLessonReorder from '.';

// Mocks
vi.mock('@tanstack/react-query', () => ({
  useQueryClient: vi.fn(),
}));

vi.mock('@/lib/api', () => ({
  $api: {
    useMutation: vi.fn(),
  },
}));

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe('useLessonReorder', () => {
  const mockQueryClient = {
    cancelQueries: vi.fn(),
    getQueryData: vi.fn(),
    setQueryData: vi.fn(),
    invalidateQueries: vi.fn(),
  };

  const mockMutate = vi.fn();
  const mockIsPending = false;

  beforeEach(() => {
    vi.clearAllMocks();
    (useQueryClient as Mock).mockReturnValue(mockQueryClient);
    ($api.useMutation as Mock).mockReturnValue({
      mutate: mockMutate,
      isPending: mockIsPending,
    });
  });

  it('should initialize with no pending order', () => {
    const { result } = renderHook(() =>
      useLessonReorder({ courseSlug: 'test-course' }),
    );

    expect(result.current.getReorderState([]).pendingOrder).toBeNull();
    expect(result.current.getReorderState([]).hasUnsavedChanges).toBe(false);
  });

  const mockLessons = [
    { id: 1, lessonNumber: 1, title: 'L1' },
    { id: 2, lessonNumber: 2, title: 'L2' },
    { id: 3, lessonNumber: 3, title: 'L3' },
  ] as unknown as Lesson[];

  it('should handle local reorder', () => {
    const { result } = renderHook(() =>
      useLessonReorder({ courseSlug: 'test-course' }),
    );

    act(() => {
      result.current.handleLocalReorder([1, 2, 3]);
    });

    expect(result.current.getReorderState(mockLessons).pendingOrder).toEqual([
      1, 2, 3,
    ]);
  });

  it('should discard reorder', () => {
    const { result } = renderHook(() =>
      useLessonReorder({ courseSlug: 'test-course' }),
    );

    act(() => {
      result.current.handleLocalReorder([1, 2, 3]);
    });

    act(() => {
      result.current.discardReorder();
    });

    expect(result.current.getReorderState([]).pendingOrder).toBeNull();
  });

  it('should save reorder', () => {
    const { result } = renderHook(() =>
      useLessonReorder({ courseSlug: 'test-course' }),
    );

    act(() => {
      result.current.handleLocalReorder([1, 2, 3]);
    });

    act(() => {
      result.current.saveReorder();
    });

    expect(mockMutate).toHaveBeenCalledWith(
      expect.objectContaining({
        body: {
          lessons: [
            { lesson_id: 1, lesson_number: 1 },
            { lesson_id: 2, lesson_number: 2 },
            { lesson_id: 3, lesson_number: 3 },
          ],
        },
      }),
    );
  });
});
