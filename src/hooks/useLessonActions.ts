import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { $api } from '@/lib/api';

export interface UseLessonActionsProps {
  courseSlug: string;
  lessonId: number;
}

export interface LessonUpdateData {
  title: string;
  corePractice: string;
  keyPoint: string;
  tone: string;
  durationMinutes: number;
}

interface ApiError {
  detail?: Array<{ loc: (string | number)[]; msg: string; type: string }>;
}

export interface UseLessonActionsReturn {
  updateLesson: (data: LessonUpdateData) => Promise<void>;
  isUpdating: boolean;
}

/**
 * Hook for lesson mutation actions (update, and future: delete, duplicate, etc.)
 */
export function useLessonActions({
  courseSlug,
  lessonId,
}: UseLessonActionsProps): UseLessonActionsReturn {
  const queryClient = useQueryClient();

  const updateMutation = $api.useMutation(
    'put',
    '/api/courses/{slug}/lessons/{id}',
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: ['get', '/api/courses/{slug}/lessons'],
        });
      },
      onError: (error: ApiError) => {
        const errorMessage =
          error.detail?.[0]?.msg ||
          'Failed to update lesson. Please try again.';
        toast.error(errorMessage);
        console.error('Lesson update error:', error);
      },
    },
  );

  const updateLesson = async (data: LessonUpdateData): Promise<void> => {
    toast.info('Saving lesson changes...');

    await updateMutation.mutateAsync({
      params: {
        path: {
          slug: courseSlug,
          id: lessonId,
        },
      },
      body: {
        lesson: {
          title: data.title,
          core_practice: data.corePractice,
          key_point: data.keyPoint,
          tone: data.tone,
          duration_minutes: data.durationMinutes,
        },
      },
    });

    toast.success('Lesson updated successfully');
  };

  return {
    updateLesson,
    isUpdating: updateMutation.isPending,
  };
}

export default useLessonActions;
