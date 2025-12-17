import type {
  DragEndEvent,
  DragStartEvent,
  UniqueIdentifier,
} from '@dnd-kit/core';
import {
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { useMemo, useState } from 'react';
import type { LessonListConnectProps } from './types';

export default function useConnect({
  lessons,
  onReorder,
}: LessonListConnectProps) {
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);

  // Configure sensors for pointer and keyboard (AC5)
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // 8px drag threshold
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  // Get lesson IDs for SortableContext (lessons are already sorted by parent)
  const lessonIds = useMemo(
    () => lessons.map((lesson) => lesson.id as UniqueIdentifier),
    [lessons],
  );

  // Get active lesson for DragOverlay
  const activeLesson = useMemo(
    () => lessons.find((lesson) => lesson.id === activeId),
    [lessons, activeId],
  );

  // Disable drag if only 1 lesson (AC6)
  const isDragDisabled = lessons.length <= 1;

  // Accessibility announcements (AC5)
  const announcements = useMemo(
    () => ({
      onDragStart({ active }: DragStartEvent) {
        const lesson = lessons.find((l) => l.id === active.id);
        const position = lessons.findIndex((l) => l.id === active.id) + 1;
        return `Picked up lesson "${lesson?.title || active.id}". Position ${position} of ${lessons.length}. Use arrow keys to move, Enter to drop, Escape to cancel.`;
      },
      onDragOver({
        active,
        over,
      }: {
        active: { id: UniqueIdentifier };
        over: { id: UniqueIdentifier } | null;
      }) {
        if (over) {
          const overPosition = lessons.findIndex((l) => l.id === over.id) + 1;
          const lesson = lessons.find((l) => l.id === active.id);
          return `Lesson "${lesson?.title || active.id}" is over position ${overPosition} of ${lessons.length}.`;
        }
        return undefined;
      },
      onDragEnd({
        active,
        over,
      }: {
        active: { id: UniqueIdentifier };
        over: { id: UniqueIdentifier } | null;
      }) {
        if (over) {
          const overPosition = lessons.findIndex((l) => l.id === over.id) + 1;
          const lesson = lessons.find((l) => l.id === active.id);
          return `Lesson "${lesson?.title || active.id}" was dropped at position ${overPosition} of ${lessons.length}.`;
        }
        const lesson = lessons.find((l) => l.id === active.id);
        return `Lesson "${lesson?.title || active.id}" was dropped.`;
      },
      onDragCancel({ active }: { active: { id: UniqueIdentifier } }) {
        const lesson = lessons.find((l) => l.id === active.id);
        return `Dragging cancelled. Lesson "${lesson?.title || active.id}" was returned to its original position.`;
      },
    }),
    [lessons],
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    setActiveId(null);

    if (!over || active.id === over.id) {
      return;
    }

    // Calculate new order
    const oldIndex = lessons.findIndex((l) => l.id === active.id);
    const newIndex = lessons.findIndex((l) => l.id === over.id);

    if (oldIndex === -1 || newIndex === -1) {
      return;
    }

    const reorderedLessons = arrayMove(lessons, oldIndex, newIndex);
    const orderedIds = reorderedLessons.map((l) => l.id);

    // Notify parent of new order (local change, not saved yet)
    onReorder(orderedIds);
  };

  const handleDragCancel = () => {
    setActiveId(null);
  };

  return {
    activeId,
    setActiveId,
    sensors,
    lessonIds,
    activeLesson,
    isDragDisabled,
    announcements,
    handleDragStart,
    handleDragEnd,
    handleDragCancel,
  };
}
