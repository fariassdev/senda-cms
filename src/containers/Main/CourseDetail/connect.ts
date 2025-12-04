import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { useLessonReorder } from '@/hooks/useLessonReorder';
import { $api } from '@/lib/api';
import type { LessonStatus, Lesson } from '@/types/models';

import {
  courseUpdateSchema,
  GENERATING_STATUSES,
  POLLING_INTERVAL,
  type CourseUpdateFormData,
} from './constants';

export default function useConnect(courseSlug: string) {
  const queryClient = useQueryClient();
  const [isLessonCreateOpen, setIsLessonCreateOpen] = useState(false);
  const [isLessonEditOpen, setIsLessonEditOpen] = useState(false);
  const [isLessonDeleteOpen, setIsLessonDeleteOpen] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [lessonToDelete, setLessonToDelete] = useState<Lesson | null>(null);
  const [isUnsavedChangesModalOpen, setIsUnsavedChangesModalOpen] =
    useState(false);
  const [pendingNavigationUrl, setPendingNavigationUrl] = useState<
    string | null
  >(null);

  // Ref to track previous lessons for status change detection
  const previousLessonsRef = useRef<Lesson[] | null>(null);

  const form = useForm<CourseUpdateFormData>({
    resolver: zodResolver(courseUpdateSchema),
    defaultValues: {
      title: '',
      description: '',
      difficulty_level: '',
      active: false,
      image_placeholder_url: '',
    },
  });

  const {
    data: courseResponse,
    isLoading: isCourseLoading,
    isError: isCourseError,
    error: courseError,
    refetch: refetchCourse,
  } = $api.useQuery('get', '/api/courses/{slug}', {
    params: {
      path: {
        slug: courseSlug,
      },
    },
  });

  const course = courseResponse?.course;

  // Helper function to check if any lessons are generating
  const hasGeneratingLessons = (lessonsData: Lesson[] | undefined): boolean => {
    if (!lessonsData) return false;
    return lessonsData.some((lesson) =>
      GENERATING_STATUSES.includes(lesson.status as LessonStatus),
    );
  };

  // Fetch lessons for this course with dynamic polling
  const {
    data: lessonsResponse,
    isLoading: isLessonsLoading,
    isError: isLessonsError,
    refetch: refetchLessons,
  } = $api.useQuery('get', '/api/courses/{slug}/lessons', {
    params: {
      path: {
        slug: courseSlug,
      },
    },
    refetchInterval: (query: {
      state: { data?: { lessons?: Lesson[] } | undefined };
    }) => {
      const lessonsData = query.state.data?.lessons;
      return hasGeneratingLessons(lessonsData) ? POLLING_INTERVAL : false;
    },
  });

  const lessons: Lesson[] | undefined = lessonsResponse?.lessons;

  // Detect status changes and show toast notifications
  useEffect(() => {
    if (!lessons) return;

    const previousLessons = previousLessonsRef.current;
    if (previousLessons) {
      lessons.forEach((lesson) => {
        const prev = previousLessons.find((p) => p.id === lesson.id);
        if (!prev) return;

        const wasGenerating = GENERATING_STATUSES.includes(
          prev.status as LessonStatus,
        );

        if (wasGenerating && lesson.status === 'SCRIPT_COMPLETED') {
          toast.success(`Script ready for ${lesson.title}`);
        }
        if (wasGenerating && lesson.status === 'AUDIO_COMPLETED') {
          toast.success(`Audio ready for ${lesson.title}`);
        }
        if (
          wasGenerating &&
          (lesson.status === 'SCRIPT_FAILED' ||
            lesson.status === 'AUDIO_FAILED')
        ) {
          toast.error(`Generation failed for ${lesson.title}`);
        }
      });
    }

    previousLessonsRef.current = lessons;
  }, [lessons]);

  // Update form when course data is loaded
  useEffect(() => {
    if (course) {
      form.reset({
        title: course.title,
        description: course.description,
        difficulty_level: course.difficultyLevel,
        active: course.active,
        image_placeholder_url: course.imagePlaceholderUrl || '',
      });
    }
  }, [course, form]);

  const updateCourseMutation = $api.useMutation('put', '/api/courses/{slug}');

  const updateCourse = async (data: {
    title?: string | null;
    description?: string | null;
    difficulty_level?: string | null;
    active?: boolean | null;
    image_placeholder_url?: string | null;
  }) => {
    try {
      await updateCourseMutation.mutateAsync({
        params: {
          path: {
            slug: courseSlug,
          },
        },
        body: {
          course: data,
        },
      });

      toast.success('Course updated successfully');

      refetchCourse();

      await queryClient.invalidateQueries({
        queryKey: ['get', '/api/courses'],
        refetchType: 'active',
      });
    } catch (error) {
      toast.error('Failed to update course');
      console.error('Course update error:', error);
    }
  };

  const onSubmit = async (data: CourseUpdateFormData) => {
    await updateCourse({
      title: data.title,
      description: data.description,
      difficulty_level: data.difficulty_level || null,
      active: data.active,
      image_placeholder_url: data.image_placeholder_url || null,
    });
  };

  // Calculate next lesson number for new lessons
  const nextLessonNumber = lessons
    ? Math.max(0, ...lessons.map((l) => l.lessonNumber)) + 1
    : 1;

  const handleOpenLessonCreate = () => {
    setIsLessonCreateOpen(true);
  };

  const handleCloseLessonCreate = (open: boolean) => {
    setIsLessonCreateOpen(open);
  };

  const handleLessonCreateSuccess = () => {
    refetchLessons();
  };

  // Lesson Edit Modal handlers
  const handleEditLesson = (lesson: Lesson) => {
    setSelectedLesson(lesson);
    setIsLessonEditOpen(true);
  };

  const handleCloseLessonEdit = (open: boolean) => {
    setIsLessonEditOpen(open);
    if (!open) {
      setSelectedLesson(null);
    }
  };

  const handleLessonEditSuccess = () => {
    refetchLessons();
  };

  // Lesson Delete Modal handlers
  const handleDeleteLesson = (lesson: Lesson) => {
    setLessonToDelete(lesson);
    setIsLessonDeleteOpen(true);
  };

  const handleCloseLessonDelete = (open: boolean) => {
    setIsLessonDeleteOpen(open);
    if (!open) {
      setLessonToDelete(null);
    }
  };

  const handleLessonDeleteSuccess = () => {
    refetchLessons();
  };

  // Lesson Reorder handlers
  const {
    handleLocalReorder,
    saveReorder,
    discardReorder,
    getReorderState,
    resetPendingOrder,
    isReordering,
  } = useLessonReorder({
    courseSlug,
    onSuccess: () => {
      refetchLessons();
    },
  });

  // Get computed reorder state
  const reorderState = useMemo(
    () => getReorderState(lessons),
    [getReorderState, lessons],
  );

  // Track lesson IDs to detect structural changes (add/delete) vs status-only changes
  const previousLessonIdsRef = useRef<string | null>(null);

  // Reset pending order only when lessons are structurally changed (add/edit/delete)
  // NOT when only status changes from polling
  useEffect(() => {
    if (!lessons) return;

    const currentLessonIds = lessons
      .map((l) => l.id)
      .sort((a, b) => a - b)
      .join(',');

    if (
      previousLessonIdsRef.current !== null &&
      previousLessonIdsRef.current !== currentLessonIds
    ) {
      // Lesson IDs changed = structural change, reset pending order
      resetPendingOrder();
    }

    previousLessonIdsRef.current = currentLessonIds;
  }, [lessons, resetPendingOrder]);

  // Unsaved changes modal handlers
  const handleNavigateWithCheck = (url: string) => {
    if (reorderState.hasUnsavedChanges) {
      setPendingNavigationUrl(url);
      setIsUnsavedChangesModalOpen(true);
    } else {
      // Navigate directly if no unsaved changes
      window.location.href = url;
    }
  };

  const handleSaveAndNavigate = async () => {
    saveReorder();
    setIsUnsavedChangesModalOpen(false);
    // Navigate after save - the mutation will complete and then navigate
    if (pendingNavigationUrl) {
      // Small delay to allow toast to show
      setTimeout(() => {
        window.location.href = pendingNavigationUrl;
      }, 500);
    }
    setPendingNavigationUrl(null);
  };

  const handleDiscardAndNavigate = () => {
    discardReorder();
    setIsUnsavedChangesModalOpen(false);
    if (pendingNavigationUrl) {
      window.location.href = pendingNavigationUrl;
    }
    setPendingNavigationUrl(null);
  };

  const handleCancelNavigation = () => {
    setIsUnsavedChangesModalOpen(false);
    setPendingNavigationUrl(null);
  };

  return {
    course,
    lessons,
    form,
    isLoading: isCourseLoading,
    isError: isCourseError,
    error: courseError,
    refetch: refetchCourse,
    isLessonsLoading,
    isLessonsError,
    refetchLessons,
    isUpdating: updateCourseMutation.isPending,
    onSubmit,
    isLessonCreateOpen,
    nextLessonNumber,
    handleOpenLessonCreate,
    handleCloseLessonCreate,
    handleLessonCreateSuccess,
    isLessonEditOpen,
    selectedLesson,
    handleEditLesson,
    handleCloseLessonEdit,
    handleLessonEditSuccess,
    isLessonDeleteOpen,
    lessonToDelete,
    handleDeleteLesson,
    handleCloseLessonDelete,
    handleLessonDeleteSuccess,
    // Reorder handlers
    handleLocalReorder,
    saveReorder,
    discardReorder,
    reorderState,
    isReordering,
    // Unsaved changes modal
    isUnsavedChangesModalOpen,
    handleNavigateWithCheck,
    handleSaveAndNavigate,
    handleDiscardAndNavigate,
    handleCancelNavigation,
  };
}
