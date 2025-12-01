'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';

import type { LessonStatus } from '@/components/StatusBadge';
import { $api } from '@/lib/api';
import type { Lesson, ScriptPart } from '@/types/models';

import {
  AUDIO_GENERATION_ELIGIBLE_STATUS,
  calculateScriptMetrics,
  calculateMetricsFromText,
  parseScriptText,
  serializeScript,
  SCRIPT_AVAILABLE_STATUSES,
} from './constants';
import type { ScriptPreviewProps } from './types';

type SaveState = 'idle' | 'saving' | 'success' | 'error';

export default function useConnect({
  courseSlug,
  lessonId,
}: ScriptPreviewProps) {
  const router = useRouter();
  const queryClient = useQueryClient();

  // Edit mode state
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState('');
  const [originalContent, setOriginalContent] = useState('');
  const [isDirty, setIsDirty] = useState(false);
  const [saveState, setSaveState] = useState<SaveState>('idle');
  const [showUnsavedModal, setShowUnsavedModal] = useState(false);

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

  // Save script mutation
  const saveScriptMutation = $api.useMutation(
    'put',
    '/api/courses/{slug}/lessons/{id}',
    {
      onMutate: () => {
        setSaveState('saving');
      },
      onSuccess: async () => {
        toast.success('Script saved successfully');
        setSaveState('success');
        setIsDirty(false);
        setOriginalContent(editedContent);

        // Clear success state after 2 seconds
        setTimeout(() => setSaveState('idle'), 2000);

        // Invalidate queries to refresh data
        await queryClient.invalidateQueries({
          queryKey: [
            'get',
            '/api/courses/{slug}/lessons',
            { params: { path: { slug: courseSlug } } },
          ],
          refetchType: 'active',
        });
      },
      onError: (error) => {
        const errorMessage =
          error instanceof Error
            ? error.message
            : 'Failed to save script. Please try again.';
        toast.error(errorMessage);
        setSaveState('error');
      },
    },
  );

  // Initialize edit content when entering edit mode
  useEffect(() => {
    if (isEditing && lesson?.script) {
      const serialized = serializeScript(lesson.script);
      setEditedContent(serialized);
      setOriginalContent(serialized);
      setIsDirty(false);
    }
  }, [isEditing, lesson?.script]);

  // Browser navigation guard
  useEffect(() => {
    if (isDirty) {
      const handleBeforeUnload = (e: BeforeUnloadEvent) => {
        e.preventDefault();
        e.returnValue = '';
      };

      window.addEventListener('beforeunload', handleBeforeUnload);

      return () => {
        window.removeEventListener('beforeunload', handleBeforeUnload);
      };
    }
  }, [isDirty]);

  // Calculate metrics from edited text
  const editMetrics = useMemo(() => {
    if (!isEditing || !editedContent) return null;
    return calculateMetricsFromText(
      editedContent,
      lesson?.durationMinutes || 0,
    );
  }, [isEditing, editedContent, lesson?.durationMinutes]);

  // Navigation handlers
  const handleBackToCourse = () => {
    if (isDirty) {
      setShowUnsavedModal(true);
    } else {
      router.push(`/courses/${courseSlug}`);
    }
  };

  const handleEnterEditMode = () => {
    setIsEditing(true);
  };

  const handleExitEditMode = () => {
    if (isDirty) {
      setShowUnsavedModal(true);
    } else {
      setIsEditing(false);
      setEditedContent('');
      setOriginalContent('');
    }
  };

  const handleSaveScript = async () => {
    if (!lesson || !isDirty) return;

    // Parse edited text back to structured format
    const parsedScript: ScriptPart[] = parseScriptText(editedContent);

    saveScriptMutation.mutate({
      params: {
        path: {
          slug: courseSlug,
          id: lesson.id,
        },
      },
      body: {
        lesson: {
          // @ts-expect-error - API type definition shows script as Record<string, never> but it actually accepts ScriptPart[]
          script: parsedScript,
        },
      },
    });
  };

  const handleSaveAndExit = async () => {
    await handleSaveScript();
    if (saveState !== 'error') {
      setIsEditing(false);
      setShowUnsavedModal(false);
    }
  };

  const handleDiscardChanges = () => {
    setEditedContent(originalContent);
    setIsDirty(false);
    setIsEditing(false);
    setShowUnsavedModal(false);
  };

  const handleContentChange = (newContent: string) => {
    setEditedContent(newContent);
    setIsDirty(newContent !== originalContent);
  };

  // Navigation handlers
  const handleEditScript = () => {
    handleEnterEditMode();
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
    // Edit mode state and handlers
    isEditing,
    editedContent,
    isDirty,
    saveState,
    showUnsavedModal,
    editMetrics,
    handleExitEditMode,
    handleSaveScript,
    handleSaveAndExit,
    handleDiscardChanges,
    handleContentChange,
    setShowUnsavedModal,
  };
}
