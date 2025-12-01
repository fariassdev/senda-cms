import type { UniqueIdentifier } from '@dnd-kit/core';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Clock, GripVertical, Pencil, Trash2 } from 'lucide-react';
import type { CSSProperties } from 'react';

import {
  GenerateScriptButton,
  type LessonStatus,
} from '@/components/GenerateScriptButton';
import { StatusBadge } from '@/components/StatusBadge';
import { Button } from '@/components/ui/button';
import { TableCell, TableRow } from '@/components/ui/table';
import { useScriptGeneration } from '@/containers/Main/LessonScriptGeneration';
import { formatTimestamp } from '@/lib/utils';
import type { Lesson } from '@/types/models';

interface SortableLessonItemProps {
  lesson: Lesson;
  courseSlug: string;
  disabled?: boolean;
  onEdit?: (lesson: Lesson) => void;
  onDelete?: (lesson: Lesson) => void;
}

export function SortableLessonItem({
  lesson,
  courseSlug,
  disabled = false,
  onEdit,
  onDelete,
}: SortableLessonItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: lesson.id as UniqueIdentifier,
    disabled,
  });

  // Script generation hook - now returns extended interface
  const { generateScript, updateAndGenerateScript, isGenerating, isUpdating } =
    useScriptGeneration({
      courseSlug,
      lessonId: lesson.id,
      lessonTitle: lesson.title,
      status: lesson.status as LessonStatus,
    });

  const style: CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    position: 'relative' as const,
    zIndex: isDragging ? 1 : 0,
  };

  return (
    <TableRow
      ref={setNodeRef}
      style={style}
      className={isDragging ? 'bg-muted shadow-lg' : ''}
    >
      {/* Drag Handle */}
      <TableCell className="w-10">
        <button
          type="button"
          className={`${
            disabled
              ? 'cursor-not-allowed text-muted-foreground/50'
              : 'cursor-grab text-muted-foreground hover:text-foreground active:cursor-grabbing'
          } focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2`}
          aria-label={
            disabled
              ? 'Cannot reorder with only one lesson'
              : `Reorder ${lesson.title}`
          }
          disabled={disabled}
          {...attributes}
          {...listeners}
          aria-describedby={disabled ? undefined : 'sortable-instructions'}
        >
          <GripVertical className="h-5 w-5" />
        </button>
      </TableCell>

      {/* Lesson Title */}
      <TableCell className="font-medium">{lesson.title}</TableCell>

      {/* Duration */}
      <TableCell>
        <span className="inline-flex items-center gap-1 text-muted-foreground">
          <Clock className="h-4 w-4" aria-hidden="true" />
          <span>{lesson.durationMinutes} min</span>
        </span>
      </TableCell>

      {/* Status Badge */}
      <TableCell>
        <StatusBadge status={lesson.status} />
      </TableCell>

      {/* Last Updated */}
      <TableCell className="text-muted-foreground">
        {formatTimestamp(lesson.updatedAt)}
      </TableCell>

      {/* Actions */}
      <TableCell className="text-right">
        <div className="flex items-center justify-end gap-1">
          <GenerateScriptButton
            lesson={lesson}
            courseSlug={courseSlug}
            onGenerate={generateScript}
            onUpdateAndGenerate={updateAndGenerateScript}
            isGenerating={isGenerating}
            isUpdating={isUpdating}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            aria-label={`Edit ${lesson.title}`}
            onClick={() => onEdit?.(lesson)}
            disabled={!onEdit}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-destructive hover:text-destructive"
            aria-label={`Delete ${lesson.title}`}
            onClick={() => onDelete?.(lesson)}
            disabled={!onDelete}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}

interface LessonDragOverlayProps {
  lesson: Lesson;
}

export function LessonDragOverlay({ lesson }: LessonDragOverlayProps) {
  return (
    <div className="flex items-center gap-4 rounded-lg border-2 border-primary bg-background p-3 shadow-xl">
      <GripVertical className="h-5 w-5 text-muted-foreground" />
      <span className="font-medium">{lesson.title}</span>
      <span className="text-sm text-muted-foreground">
        {lesson.durationMinutes} min
      </span>
      <StatusBadge status={lesson.status} />
    </div>
  );
}
