import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { $api } from '@/lib/api';
import type { UpdateLessonData } from '@/types/models';

interface ApiError {
  detail?: Array<{ loc: (string | number)[]; msg: string; type: string }>;
}

/**
 * Hook for lesson mutation actions (update, and future: delete, duplicate, etc.)
 */
const useLessonActions = ({
  courseSlug,
  lessonId,
}: {
  courseSlug: string;
  lessonId: number;
}) => {
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

  const updateLesson = async (data: UpdateLessonData) => {
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
          core_practice: data.core_practice,
          key_point: data.key_point,
          tone: data.tone,
          duration_minutes: data.duration_minutes,
        },
      },
    });

    toast.success('Lesson updated successfully');
  };

  return {
    updateLesson,
    isUpdating: updateMutation.isPending,
  };
};

export default useLessonActions;
export type UseLessonActions = ReturnType<typeof useLessonActions>;
