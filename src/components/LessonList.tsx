import { AlertCircle, RefreshCw } from 'lucide-react';

import { LessonListEmpty } from '@/components/LessonListEmpty';
import { LessonListItem } from '@/components/LessonListItem';
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

interface LessonListProps {
  lessons: Lesson[] | undefined;
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
  onAddLesson?: () => void;
  onEditLesson?: (lesson: Lesson) => void;
  onDeleteLesson?: (lesson: Lesson) => void;
}

export function LessonList({
  lessons,
  isLoading,
  isError,
  onRetry,
  onAddLesson,
  onEditLesson,
  onDeleteLesson,
}: LessonListProps) {
  if (isLoading) {
    return <LessonListSkeleton />;
  }

  if (isError) {
    return <LessonListError onRetry={onRetry} />;
  }

  if (!lessons || lessons.length === 0) {
    return <LessonListEmpty onAddLesson={onAddLesson} />;
  }

  // Sort lessons by lessonNumber (ascending)
  const sortedLessons = [...lessons].sort(
    (a, b) => a.lessonNumber - b.lessonNumber,
  );

  return (
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
      <TableBody>
        {sortedLessons.map((lesson) => (
          <LessonListItem
            key={lesson.id}
            lesson={lesson}
            onEdit={onEditLesson}
            onDelete={onDeleteLesson}
          />
        ))}
      </TableBody>
    </Table>
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
