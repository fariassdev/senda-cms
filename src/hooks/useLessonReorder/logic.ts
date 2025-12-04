import type { Lesson } from '@/types/models';
import type { ReorderParams } from './types';

/**
 * Reorder lessons based on new ordered IDs
 */
export function reorderLessonsInCache(
  lessons: Lesson[] | undefined,
  orderedIds: number[],
): Lesson[] {
  if (!lessons) return [];

  return orderedIds.map((id, index) => {
    const lesson = lessons.find((l) => l.id === id);
    if (!lesson) {
      throw new Error(`Lesson ${id} not found`);
    }
    return { ...lesson, lessonNumber: index + 1 };
  });
}

/**
 * Build request body from reordered lessons
 */
export function buildReorderRequest(orderedIds: number[]): ReorderParams {
  return {
    lessons: orderedIds.map((id, index) => ({
      lesson_id: id,
      lesson_number: index + 1,
    })),
  };
}

/**
 * Get the original order of lesson IDs from lessons sorted by lessonNumber
 */
export function getOriginalOrder(lessons: Lesson[] | undefined): number[] {
  if (!lessons) return [];
  return [...lessons]
    .sort((a, b) => a.lessonNumber - b.lessonNumber)
    .map((l) => l.id);
}

/**
 * Check if two arrays of IDs are in the same order
 */
export function arraysEqual(a: number[], b: number[]): boolean {
  if (a.length !== b.length) return false;
  return a.every((val, idx) => val === b[idx]);
}
