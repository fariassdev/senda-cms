'use client';

import { Clock, Eye, GripVertical, Pencil, Trash2 } from 'lucide-react';
import Link from 'next/link';

import { StatusBadge } from '@/components/StatusBadge';
import { Button } from '@/components/ui/button';
import { TableCell, TableRow } from '@/components/ui/table';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { GenerateAudioButton } from '@/containers/Main/CourseDetail/LessonList/LessonRow/GenerateAudioButton';
import { GenerateScriptButton } from '@/containers/Main/CourseDetail/LessonList/LessonRow/GenerateScriptButton';
import { PlayButton } from '@/containers/Main/CourseDetail/LessonList/LessonRow/PlayButton';

import useConnect from './connect';
import type { LessonDragOverlayProps, LessonRowProps } from './types';

export function LessonRow(props: LessonRowProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    style,
    isDragging,
    generateScript,
    updateAndGenerateScript,
    isGenerating,
    isUpdating,
    hasViewableScript,
    formatTimestamp,
    generateAudio,
    isGeneratingAudio,
  } = useConnect(props);

  const { lesson, courseSlug, disabled = false, onEdit, onDelete } = props;

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
      <TableCell className="text-right pr-2">
        <div className="flex items-center justify-end gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  aria-label={
                    hasViewableScript
                      ? `View script for ${lesson.title}`
                      : 'No script available yet'
                  }
                  disabled={!hasViewableScript}
                  asChild={hasViewableScript}
                >
                  {hasViewableScript ? (
                    <Link
                      href={`/courses/${courseSlug}/lessons/${lesson.id}/script`}
                    >
                      <Eye className="h-4 w-4" />
                    </Link>
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </span>
            </TooltipTrigger>
            <TooltipContent>
              {hasViewableScript ? 'View Script' : 'Generate script first'}
            </TooltipContent>
          </Tooltip>
          <PlayButton lesson={lesson} />
        </div>
      </TableCell>

      {/* Actions */}
      <TableCell className="text-right pl-0">
        <div className="flex items-center justify-end gap-1">
          <GenerateScriptButton
            lesson={lesson}
            onGenerate={generateScript}
            onUpdateAndGenerate={updateAndGenerateScript}
            isGenerating={isGenerating}
            isUpdating={isUpdating}
          />
          <GenerateAudioButton
            lesson={lesson}
            onGenerate={generateAudio}
            isGenerating={isGeneratingAudio}
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
