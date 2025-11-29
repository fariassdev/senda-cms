import { Clock, GripVertical, Pencil, Trash2 } from 'lucide-react';

import { StatusBadge } from '@/components/StatusBadge';
import { Button } from '@/components/ui/button';
import { TableCell, TableRow } from '@/components/ui/table';
import { formatTimestamp } from '@/lib/utils';
import type { Lesson } from '@/types/models';

interface LessonListItemProps {
  lesson: Lesson;
  onEdit?: (lesson: Lesson) => void;
  onDelete?: (lesson: Lesson) => void;
}

export function LessonListItem({
  lesson,
  onEdit,
  onDelete,
}: LessonListItemProps) {
  return (
    <TableRow>
      {/* Drag Handle */}
      <TableCell className="w-10">
        <button
          type="button"
          className="cursor-grab text-muted-foreground hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label="Reorder lesson"
          disabled
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
      <TableCell>
        <div className="flex items-center gap-1">
          <Button
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
