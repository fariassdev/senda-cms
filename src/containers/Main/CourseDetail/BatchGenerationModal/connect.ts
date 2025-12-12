import { useMemo, useState, useCallback } from 'react';

import type { BatchState } from '@/hooks/useBatchScriptGeneration';
import type { Lesson } from '@/types/models';

import { ELIGIBLE_STATUSES } from './constants';
import type { BatchModalView, LessonSelectionItem } from './types';

/**
 * Hook for BatchGenerationModal state and logic
 *
 * @param lessons - All lessons in the course
 * @param batchState - Current batch generation state
 * @param initialView - Initial view to show (defaults to 'selection')
 */
export default function useConnect(
  lessons: Lesson[],
  batchState?: BatchState,
  initialView: BatchModalView = 'selection',
) {
  // Current view state
  const [view, setView] = useState<BatchModalView>(initialView);

  // Selected lesson IDs for generation
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

  // Get eligible lessons (PENDING or SCRIPT_FAILED)
  const eligibleLessons = useMemo<LessonSelectionItem[]>(() => {
    return lessons
      .filter((lesson) =>
        ELIGIBLE_STATUSES.includes(
          lesson.status as (typeof ELIGIBLE_STATUSES)[number],
        ),
      )
      .map((lesson) => ({
        id: lesson.id,
        title: lesson.title,
        lessonNumber: lesson.lessonNumber,
        isEligible: true,
        batchStatus: batchState?.lessonStatuses[lesson.id],
      }))
      .sort((a, b) => a.lessonNumber - b.lessonNumber);
  }, [lessons, batchState]);

  // Get all lessons with batch status for progress view
  const allLessonsWithStatus = useMemo<LessonSelectionItem[]>(() => {
    if (!batchState) return [];

    const result: LessonSelectionItem[] = [];

    for (const idStr of Object.keys(batchState.lessonStatuses)) {
      const id = Number(idStr);
      const lesson = lessons.find((l) => l.id === id);
      if (!lesson) continue;

      result.push({
        id: lesson.id,
        title: lesson.title,
        lessonNumber: lesson.lessonNumber,
        isEligible: true,
        batchStatus: batchState.lessonStatuses[id],
      });
    }

    return result.sort((a, b) => a.lessonNumber - b.lessonNumber);
  }, [lessons, batchState]);

  // Initialize selected IDs with all eligible lessons
  const initializeSelection = useCallback(() => {
    setSelectedIds(new Set(eligibleLessons.map((l) => l.id)));
    setView('selection');
  }, [eligibleLessons]);

  // Toggle individual lesson selection
  const toggleLesson = useCallback((lessonId: number) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(lessonId)) {
        next.delete(lessonId);
      } else {
        next.add(lessonId);
      }
      return next;
    });
  }, []);

  // Select all eligible lessons
  const selectAll = useCallback(() => {
    setSelectedIds(new Set(eligibleLessons.map((l) => l.id)));
  }, [eligibleLessons]);

  // Deselect all lessons
  const deselectAll = useCallback(() => {
    setSelectedIds(new Set());
  }, []);

  // Progress calculations
  const progressStats = useMemo(() => {
    if (!batchState) {
      return {
        total: 0,
        completed: 0,
        failed: 0,
        pending: 0,
        generating: 0,
        percentage: 0,
        isComplete: false,
      };
    }

    const statuses = Object.values(batchState.lessonStatuses);
    const completed = statuses.filter((s) => s === 'completed').length;
    const failed = statuses.filter((s) => s === 'failed').length;
    const generating = statuses.filter((s) => s === 'generating').length;
    const pending = statuses.filter((s) => s === 'pending').length;
    const total = statuses.length;

    // Batch is complete when isActive is false (API returned)
    const isComplete = !batchState.isActive && total > 0;

    return {
      total,
      completed,
      failed,
      pending,
      generating,
      isComplete,
    };
  }, [batchState]);

  // Determine if generate button should be disabled
  const isGenerateDisabled = selectedIds.size === 0;

  // Selected count for display
  const selectedCount = selectedIds.size;
  const eligibleCount = eligibleLessons.length;

  // Switch to progress view when generation starts
  const startGeneration = useCallback(() => {
    setView('progress');
  }, []);

  // Switch to complete view
  const showComplete = useCallback(() => {
    setView('complete');
  }, []);

  // Get selected lesson IDs as array
  const getSelectedLessonIds = useCallback(() => {
    return Array.from(selectedIds);
  }, [selectedIds]);

  return {
    // View state
    view,
    setView,
    initializeSelection,
    startGeneration,
    showComplete,

    // Selection state
    selectedIds,
    toggleLesson,
    selectAll,
    deselectAll,
    isGenerateDisabled,
    selectedCount,
    eligibleCount,
    getSelectedLessonIds,

    // Lesson data
    eligibleLessons,
    allLessonsWithStatus,

    // Progress
    progressStats,
    batchState,
  };
}
