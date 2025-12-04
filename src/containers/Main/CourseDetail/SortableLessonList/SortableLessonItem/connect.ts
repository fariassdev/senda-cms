import type { UniqueIdentifier } from '@dnd-kit/core';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { CSSProperties } from 'react';

import { useScriptGeneration } from '@/containers/Main/CourseDetail/LessonScriptGeneration';
import type { LessonStatus } from '@/containers/Main/CourseDetail/SortableLessonList/SortableLessonItem/GenerateScriptButton/types';
import { formatTimestamp } from '@/lib/utils';
import type { SortableLessonItemProps } from './types';

export default function useConnect({
  lesson,
  courseSlug,
  disabled,
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

  // Script generation hook
  const { generateScript, updateAndGenerateScript, isGenerating, isUpdating } =
    useScriptGeneration({
      courseSlug,
      lessonId: lesson.id,
      lessonTitle: lesson.title,
      status: lesson.status as LessonStatus,
    });

  // Check if script is available for viewing
  const SCRIPT_VIEWABLE_STATUSES: LessonStatus[] = [
    'SCRIPT_COMPLETED',
    'AUDIO_GENERATING',
    'AUDIO_COMPLETED',
  ];
  const hasViewableScript = SCRIPT_VIEWABLE_STATUSES.includes(
    lesson.status as LessonStatus,
  );

  const style: CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    position: 'relative' as const,
    zIndex: isDragging ? 1 : 0,
  };

  return {
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
  };
}
