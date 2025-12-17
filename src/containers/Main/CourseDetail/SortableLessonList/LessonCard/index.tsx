'use client';

import { Clock, Eye, Pencil, Trash2 } from 'lucide-react';
import Link from 'next/link';

import { StatusBadge } from '@/components/StatusBadge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { GenerateAudioButton } from '@/containers/Main/CourseDetail/SortableLessonList/LessonRow/GenerateAudioButton';
import { GenerateScriptButton } from '@/containers/Main/CourseDetail/SortableLessonList/LessonRow/GenerateScriptButton';
import { PlayButton } from '@/containers/Main/CourseDetail/SortableLessonList/LessonRow/PlayButton';

import useConnect from './connect';
import type { LessonCardProps } from './types';

export function LessonCard(props: LessonCardProps) {
  const {
    generateScript,
    updateAndGenerateScript,
    isGenerating,
    isUpdating,
    hasViewableScript,
    formatTimestamp,
    generateAudio,
    isGeneratingAudio,
  } = useConnect(props);

  const { lesson, courseSlug, onEdit, onDelete } = props;

  return (
    <Card>
      <CardContent className="p-4">
        {/* Header: Title and Status */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <h3 className="font-medium text-base leading-tight">
            {lesson.title}
          </h3>
          <StatusBadge status={lesson.status} />
        </div>

        {/* Metadata: Duration and Updated */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground mb-4">
          <span className="inline-flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" aria-hidden="true" />
            <span>{lesson.durationMinutes} min</span>
          </span>
          <span>Updated: {formatTimestamp(lesson.updatedAt)}</span>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap items-center gap-1">
          {/* View Script */}
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

          {/* Play Audio */}
          <PlayButton lesson={lesson} />

          {/* Divider */}
          <div className="h-5 w-px bg-border mx-1" />

          {/* Generate Script */}
          <GenerateScriptButton
            lesson={lesson}
            onGenerate={generateScript}
            onUpdateAndGenerate={updateAndGenerateScript}
            isGenerating={isGenerating}
            isUpdating={isUpdating}
          />

          {/* Generate Audio */}
          <GenerateAudioButton
            lesson={lesson}
            onGenerate={generateAudio}
            isGenerating={isGeneratingAudio}
          />

          {/* Divider */}
          <div className="h-5 w-px bg-border mx-1" />

          {/* Edit */}
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

          {/* Delete */}
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
      </CardContent>
    </Card>
  );
}
