import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { $api } from '@/lib/api';
import type { Lesson } from '@/types/models';

import { courseUpdateSchema, type CourseUpdateFormData } from './constants';

export default function useConnect(courseSlug: string) {
  const queryClient = useQueryClient();
  const [isLessonCreateOpen, setIsLessonCreateOpen] = useState(false);
  const [isLessonEditOpen, setIsLessonEditOpen] = useState(false);
  const [isLessonDeleteOpen, setIsLessonDeleteOpen] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [lessonToDelete, setLessonToDelete] = useState<Lesson | null>(null);

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

  // Fetch lessons for this course
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
  });

  const lessons: Lesson[] | undefined = lessonsResponse?.lessons;

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
  };
}
