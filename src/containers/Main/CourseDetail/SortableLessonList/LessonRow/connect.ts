import type { UniqueIdentifier } from '@dnd-kit/core';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { CSSProperties } from 'react';

import type { LessonFormData } from '@/components/LessonForm';
import useAudioGeneration from '@/hooks/useAudioGeneration';
import useLessonActions from '@/hooks/useLessonActions';
import useScriptGeneration from '@/hooks/useScriptGeneration';
import { formatTimestamp } from '@/lib/utils';
import type { LessonStatus } from '@/types/models';
import type { LessonRowProps } from './types';

export default function useConnect({
  lesson,
  courseSlug,
  disabled,
}: LessonRowProps) {
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

  // Lesson update actions
  const { updateLesson, isUpdating } = useLessonActions({
    courseSlug,
    lessonId: lesson.id,
  });

  // Script generation
  const { generateScript, isGenerating } = useScriptGeneration({
    courseSlug,
    lessonId: lesson.id,
  });

  // Audio generation
  const { generateAudio, isGenerating: isGeneratingAudio } = useAudioGeneration(
    {
      courseSlug,
      lessonId: lesson.id,
    },
  );

  // Compose: update lesson then generate script
  const updateAndGenerateScript = async (data: LessonFormData) => {
    await updateLesson(data);
    generateScript();
  };

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
    generateAudio,
    isGeneratingAudio,
  };
}
