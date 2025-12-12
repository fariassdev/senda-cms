'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'sonner';
import useLessonActions, {
  type LessonUpdateData,
} from '@/hooks/useLessonActions';
import useScriptGeneration from '@/hooks/useScriptGeneration';
import { $api } from '@/lib/api';
import type { Lesson, LessonStatus, ScriptPart } from '@/types/models';

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
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Edit mode state
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState('');
  const [originalContent, setOriginalContent] = useState('');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [saveStatus, setSaveStatus] = useState<SaveState>('idle');
  const [isUnsavedModalOpen, setIsUnsavedModalOpen] = useState(false);

  // Regeneration modal state (Task 1.2)
  const [isRegenerateModalOpen, setIsRegenerateModalOpen] = useState(false);

  const handleInsertPause = (text: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const startPos = textarea.selectionStart;
    const endPos = textarea.selectionEnd;
    const textBefore = editedContent.substring(0, startPos);
    const textAfter = editedContent.substring(endPos);

    const newValue = textBefore + text + textAfter;
    const newCursorPos = startPos + text.length;

    setEditedContent(newValue);
    setHasUnsavedChanges(newValue !== originalContent);

    // Set cursor position after React update
    setTimeout(() => {
      textarea.selectionStart = newCursorPos;
      textarea.selectionEnd = newCursorPos;
      textarea.focus();
    }, 0);
  };

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

  // Initialize useScriptGeneration hook for regeneration (Task 1.1)
  const { generateScript, isGenerating } = useScriptGeneration({
    courseSlug,
    lessonId: Number(lessonId),
  });

  // Initialize useLessonActions for updating lesson before regeneration (Task 5.2)
  const { updateLesson, isUpdating } = useLessonActions({
    courseSlug,
    lessonId: Number(lessonId),
  });

  // Save script mutation
  const saveScriptMutation = $api.useMutation(
    'put',
    '/api/courses/{slug}/lessons/{id}',
    {
      onMutate: () => {
        setSaveStatus('saving');
      },
      onSuccess: async () => {
        toast.success('Script saved successfully');
        setSaveStatus('success');
        setHasUnsavedChanges(false);
        setOriginalContent(editedContent);

        // Clear success state after 2 seconds
        setTimeout(() => setSaveStatus('idle'), 2000);

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
        setSaveStatus('error');
      },
    },
  );

  // Initialize edit content when entering edit mode
  useEffect(() => {
    if (isEditing && lesson?.script) {
      const serialized = serializeScript(lesson.script);
      setEditedContent(serialized);
      setOriginalContent(serialized);
      setHasUnsavedChanges(false);
    }
  }, [isEditing, lesson?.script]);

  // Browser navigation guard
  useEffect(() => {
    if (hasUnsavedChanges) {
      const handleBeforeUnload = (e: BeforeUnloadEvent) => {
        e.preventDefault();
        e.returnValue = '';
      };

      window.addEventListener('beforeunload', handleBeforeUnload);

      return () => {
        window.removeEventListener('beforeunload', handleBeforeUnload);
      };
    }
  }, [hasUnsavedChanges]);

  // Calculate metrics from edited text
  const editedMetrics = useMemo(() => {
    if (!isEditing || !editedContent) return null;
    return calculateMetricsFromText(
      editedContent,
      lesson?.durationMinutes || 0,
    );
  }, [isEditing, editedContent, lesson?.durationMinutes]);

  // Navigation handlers
  const handleBackToCourse = () => {
    if (hasUnsavedChanges) {
      setIsUnsavedModalOpen(true);
    } else {
      router.push(`/courses/${courseSlug}`);
    }
  };

  const handleEditScript = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    if (hasUnsavedChanges) {
      setIsUnsavedModalOpen(true);
    } else {
      setIsEditing(false);
      setEditedContent('');
      setOriginalContent('');
    }
  };

  const handleSaveScript = async () => {
    if (!lesson || !hasUnsavedChanges) return;

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
          script: parsedScript,
        },
      },
    });
  };

  const handleSaveAndExit = async () => {
    await handleSaveScript();
    if (saveStatus !== 'error') {
      setIsEditing(false);
      setIsUnsavedModalOpen(false);
    }
  };

  const handleDiscardChanges = () => {
    setEditedContent(originalContent);
    setHasUnsavedChanges(false);
    setIsEditing(false);
    setIsUnsavedModalOpen(false);
  };

  const handleContentChange = (newContent: string) => {
    setEditedContent(newContent);
    setHasUnsavedChanges(newContent !== originalContent);
  };

  // Handle regeneration confirmation from modal (Task 1.5)
  const handleConfirmRegenerate = () => {
    generateScript();
    setIsRegenerateModalOpen(false);
    router.push(`/courses/${courseSlug}`);
  };

  // Handle regenerate click with Shift+Click detection (Task 1.3, 1.4)
  const handleRegenerateClick = (e: React.MouseEvent) => {
    if (e.shiftKey) {
      // Quick regeneration - bypass modal (Task 1.4)
      handleConfirmRegenerate();
    } else {
      // Normal click - open modal (Task 1.3)
      setIsRegenerateModalOpen(true);
    }
  };

  // Handle lesson update then regeneration (Task 5.2)
  const handleUpdateAndRegenerate = async (data: LessonUpdateData) => {
    await updateLesson(data);
    generateScript();
    setIsRegenerateModalOpen(false);
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
    handleRegenerateClick,
    handleConfirmRegenerate,
    isRegenerateModalOpen,
    setIsRegenerateModalOpen,
    isGenerating,
    isUpdating,
    handleUpdateAndRegenerate,
    handleGenerateAudio,
    handleRetry,
    courseSlug,
    textareaRef,
    handleInsertPause,
    // Edit mode state and handlers
    isEditing,
    editedContent,
    hasUnsavedChanges,
    saveStatus,
    isUnsavedModalOpen,
    editedMetrics,
    handleCancelEdit,
    handleSaveScript,
    handleSaveAndExit,
    handleDiscardChanges,
    handleContentChange,
    setIsUnsavedModalOpen,
  };
}
