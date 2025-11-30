'use client';

import type {
  DragEndEvent,
  DragStartEvent,
  UniqueIdentifier,
} from '@dnd-kit/core';
import {
  closestCenter,
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { useMemo, useState } from 'react';

import { LessonListEmpty } from '@/components/LessonListEmpty';
import {
  LessonDragOverlay,
  SortableLessonItem,
} from '@/components/SortableLessonItem';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { Lesson } from '@/types/models';

interface SortableLessonListProps {
  lessons: Lesson[] | undefined;
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
  onAddLesson?: () => void;
  onEditLesson?: (lesson: Lesson) => void;
  onDeleteLesson?: (lesson: Lesson) => void;
  onReorder: (orderedIds: number[]) => void;
  isReordering?: boolean;
}

export function SortableLessonList({
  lessons,
  isLoading,
  isError,
  onRetry,
  onAddLesson,
  onEditLesson,
  onDeleteLesson,
  onReorder,
  isReordering = false,
}: SortableLessonListProps) {
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);

  // Sort lessons by lessonNumber
  const sortedLessons = useMemo(() => {
    if (!lessons) return [];
    return [...lessons].sort((a, b) => a.lessonNumber - b.lessonNumber);
  }, [lessons]);

  // Get lesson IDs for SortableContext
  const lessonIds = useMemo(
    () => sortedLessons.map((lesson) => lesson.id as UniqueIdentifier),
    [sortedLessons],
  );

  // Get active lesson for DragOverlay
  const activeLesson = useMemo(
    () => sortedLessons.find((lesson) => lesson.id === activeId),
    [sortedLessons, activeId],
  );

  // Disable drag if only 1 lesson (AC6)
  const isDragDisabled = sortedLessons.length <= 1;

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

  // Accessibility announcements (AC5)
  const announcements = useMemo(
    () => ({
      onDragStart({ active }: DragStartEvent) {
        const lesson = sortedLessons.find((l) => l.id === active.id);
        const position = sortedLessons.findIndex((l) => l.id === active.id) + 1;
        return `Picked up lesson "${lesson?.title || active.id}". Position ${position} of ${sortedLessons.length}. Use arrow keys to move, Enter to drop, Escape to cancel.`;
      },
      onDragOver({
        active,
        over,
      }: {
        active: { id: UniqueIdentifier };
        over: { id: UniqueIdentifier } | null;
      }) {
        if (over) {
          const overPosition =
            sortedLessons.findIndex((l) => l.id === over.id) + 1;
          const lesson = sortedLessons.find((l) => l.id === active.id);
          return `Lesson "${lesson?.title || active.id}" is over position ${overPosition} of ${sortedLessons.length}.`;
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
          const overPosition =
            sortedLessons.findIndex((l) => l.id === over.id) + 1;
          const lesson = sortedLessons.find((l) => l.id === active.id);
          return `Lesson "${lesson?.title || active.id}" was dropped at position ${overPosition} of ${sortedLessons.length}.`;
        }
        const lesson = sortedLessons.find((l) => l.id === active.id);
        return `Lesson "${lesson?.title || active.id}" was dropped.`;
      },
      onDragCancel({ active }: { active: { id: UniqueIdentifier } }) {
        const lesson = sortedLessons.find((l) => l.id === active.id);
        return `Dragging cancelled. Lesson "${lesson?.title || active.id}" was returned to its original position.`;
      },
    }),
    [sortedLessons],
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
    const oldIndex = sortedLessons.findIndex((l) => l.id === active.id);
    const newIndex = sortedLessons.findIndex((l) => l.id === over.id);

    if (oldIndex === -1 || newIndex === -1) {
      return;
    }

    const reorderedLessons = arrayMove(sortedLessons, oldIndex, newIndex);
    const orderedIds = reorderedLessons.map((l) => l.id);

    // Call mutation handler (AC3)
    onReorder(orderedIds);
  };

  const handleDragCancel = () => {
    setActiveId(null);
  };

  if (isLoading) {
    return <LessonListSkeleton />;
  }

  if (isError) {
    return <LessonListError onRetry={onRetry} />;
  }

  if (!lessons || lessons.length === 0) {
    return <LessonListEmpty onAddLesson={onAddLesson} />;
  }

  return (
    <>
      {/* Screen reader instructions for keyboard navigation */}
      <div id="sortable-instructions" className="sr-only">
        Press Enter or Space to start dragging. Use Arrow Up and Arrow Down to
        move the item. Press Enter to drop, Escape to cancel.
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
        accessibility={{ announcements }}
      >
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead scope="col" className="w-10">
                <span className="sr-only">Reorder</span>
              </TableHead>
              <TableHead scope="col">Title</TableHead>
              <TableHead scope="col">Duration</TableHead>
              <TableHead scope="col">Status</TableHead>
              <TableHead scope="col">Updated</TableHead>
              <TableHead scope="col">
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <SortableContext
            items={lessonIds}
            strategy={verticalListSortingStrategy}
          >
            <TableBody>
              {sortedLessons.map((lesson) => (
                <SortableLessonItem
                  key={lesson.id}
                  lesson={lesson}
                  disabled={isDragDisabled || isReordering}
                  onEdit={onEditLesson}
                  onDelete={onDeleteLesson}
                />
              ))}
            </TableBody>
          </SortableContext>
        </Table>

        {/* DragOverlay for smooth dragging visualization (AC1, AC2) */}
        <DragOverlay>
          {activeLesson ? <LessonDragOverlay lesson={activeLesson} /> : null}
        </DragOverlay>
      </DndContext>

      {/* Loading indicator during reorder */}
      {isReordering && (
        <div className="flex items-center justify-center gap-2 py-2 text-sm text-muted-foreground">
          <RefreshCw className="h-4 w-4 animate-spin" />
          <span>Saving order...</span>
        </div>
      )}
    </>
  );
}

function LessonListSkeleton() {
  return (
    <div className="space-y-3">
      {/* Table header skeleton */}
      <div className="flex items-center gap-4 border-b pb-3">
        <Skeleton className="h-4 w-6" />
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-16" />
      </div>
      {/* Table rows skeleton */}
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 py-2">
          <Skeleton className="h-5 w-5" />
          <Skeleton className="h-5 w-48" />
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-6 w-28 rounded-full" />
          <Skeleton className="h-5 w-24" />
          <div className="flex gap-1">
            <Skeleton className="h-8 w-8" />
            <Skeleton className="h-8 w-8" />
          </div>
        </div>
      ))}
    </div>
  );
}

function LessonListError({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-destructive/50 bg-destructive/10 p-8 text-center">
      <AlertCircle className="mb-4 h-12 w-12 text-destructive" />
      <h3 className="mb-2 text-lg font-semibold">Failed to load lessons</h3>
      <p className="mb-4 max-w-sm text-sm text-muted-foreground">
        An error occurred while fetching the lessons. Please try again.
      </p>
      <Button variant="outline" onClick={onRetry}>
        <RefreshCw className="mr-2 h-4 w-4" />
        Retry
      </Button>
    </div>
  );
}
