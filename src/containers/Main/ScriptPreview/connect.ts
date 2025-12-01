'use client';

import { useRouter } from 'next/navigation';
import { useMemo } from 'react';

import type { LessonStatus } from '@/components/StatusBadge';
import { $api } from '@/lib/api';
import type { Lesson } from '@/types/models';

import {
  AUDIO_GENERATION_ELIGIBLE_STATUS,
  calculateScriptMetrics,
  SCRIPT_AVAILABLE_STATUSES,
} from './constants';
import type { ScriptPreviewProps } from './types';

export default function useConnect({
  courseSlug,
  lessonId,
}: ScriptPreviewProps) {
  const router = useRouter();

  // Fetch lessons for this course
  const {
    data: lessonsResponse,
    isLoading,
    isError,
    error,
    refetch,
  } = $api.useQuery('get', '/api/courses/{slug}/lessons', {
    params: {
      path: {
        slug: courseSlug,
      },
    },
  });

  // Find the specific lesson
  const lesson: Lesson | undefined = useMemo(() => {
    return lessonsResponse?.lessons?.find((l) => l.id === Number(lessonId));
  }, [lessonsResponse?.lessons, lessonId]);

  // Check if script is available based on status
  const hasScriptAvailable = useMemo(() => {
    if (!lesson) return false;
    const hasScript = lesson.script && lesson.script.length > 0;
    const isStatusValid = SCRIPT_AVAILABLE_STATUSES.includes(
      lesson.status as LessonStatus,
    );
    return hasScript && isStatusValid;
  }, [lesson]);

  // Calculate script metrics
  const metrics = useMemo(() => {
    if (!lesson?.script || lesson.script.length === 0) return null;
    return calculateScriptMetrics(lesson.script, lesson.durationMinutes);
  }, [lesson?.script, lesson?.durationMinutes]);

  // Check if audio generation is eligible
  const canGenerateAudio = useMemo(() => {
    return lesson?.status === AUDIO_GENERATION_ELIGIBLE_STATUS;
  }, [lesson?.status]);

  // Navigation handlers
  const handleBackToCourse = () => {
    router.push(`/courses/${courseSlug}`);
  };

  const handleEditScript = () => {
    // Placeholder for Story 4.4
    router.push(`/courses/${courseSlug}/lessons/${lessonId}/script/edit`);
  };

  const handleRegenerateScript = () => {
    // Placeholder for Story 4.5 - will open modal or trigger regeneration
    // For now, navigate back to course where regeneration can be triggered
    router.push(`/courses/${courseSlug}`);
  };

  const handleGenerateAudio = () => {
    // Placeholder for Story 5.x - audio generation
    // For now, this is a no-op when enabled
    console.log('Generate audio clicked for lesson:', lessonId);
  };

  const handleRetry = () => {
    refetch();
  };

  return {
    lesson,
    isLoading,
    isError,
    error,
    hasScriptAvailable,
    metrics,
    canGenerateAudio,
    handleBackToCourse,
    handleEditScript,
    handleRegenerateScript,
    handleGenerateAudio,
    handleRetry,
    courseSlug,
  };
}
