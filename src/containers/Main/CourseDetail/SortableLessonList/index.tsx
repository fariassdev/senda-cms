'use client';

import { closestCenter, DndContext, DragOverlay } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { AlertCircle, FilePlus2, RefreshCw } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { LessonDragOverlay, SortableLessonItem } from './SortableLessonItem';

import useConnect from './connect';
import type { SortableLessonListProps } from './types';

export function SortableLessonList({
  lessons,
  isLoading,
  isError,
  courseSlug,
  onRetry,
  onAddLesson,
  onEditLesson,
  onDeleteLesson,
  onReorder,
  isReordering = false,
}: SortableLessonListProps) {
  const {
    sensors,
    lessonIds,
    activeLesson,
    isDragDisabled,
    announcements,
    handleDragStart,
    handleDragEnd,
    handleDragCancel,
  } = useConnect({ lessons, onReorder });

  if (isLoading) {
    return <LessonListSkeleton />;
  }

  if (isError) {
    return <LessonListError onRetry={onRetry} />;
  }

  if (lessons.length === 0) {
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
              {lessons.map((lesson) => (
                <SortableLessonItem
                  key={lesson.id}
                  lesson={lesson}
                  courseSlug={courseSlug}
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

function LessonListEmpty({ onAddLesson }: { onAddLesson?: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 p-8 text-center">
      <FilePlus2 className="mb-4 h-16 w-16 text-muted-foreground/50" />
      <h3 className="mb-2 text-lg font-semibold">No lessons yet</h3>
      <p className="mb-6 max-w-sm text-sm text-muted-foreground">
        Create your first lesson to start building this course
      </p>
      <Button
        onClick={onAddLesson}
        disabled={!onAddLesson}
        className="bg-cyan-600 hover:bg-cyan-700"
      >
        <FilePlus2 className="mr-2 h-4 w-4" />
        Add First Lesson
      </Button>
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
