import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { $api } from '@/lib/api';

import type { LessonDeleteProps } from './types';

export default function useConnect({
  courseSlug,
  lesson,
  onOpenChange,
  onSuccess,
}: Omit<LessonDeleteProps, 'open'>) {
  const queryClient = useQueryClient();

  const deleteLessonMutation = $api.useMutation(
    'delete',
    '/api/courses/{slug}/lessons/{id}',
    {
      onSuccess: async () => {
        toast.success('Lesson deleted');

        // Invalidate lessons query to refetch updated list
        await queryClient.invalidateQueries({
          queryKey: [
            'get',
            '/api/courses/{slug}/lessons',
            { params: { path: { slug: courseSlug } } },
          ],
          refetchType: 'active',
        });

        // Also invalidate course query for lesson data
        await queryClient.invalidateQueries({
          queryKey: [
            'get',
            '/api/courses/{slug}',
            { params: { path: { slug: courseSlug } } },
          ],
          refetchType: 'active',
        });

        onOpenChange(false);
        onSuccess?.();
      },
      onError: (error) => {
        const errorMessage =
          error instanceof Error ? error.message : 'Failed to delete lesson';
        toast.error(errorMessage);
        onOpenChange(false);
      },
    },
  );

  const handleDelete = () => {
    deleteLessonMutation.mutate({
      params: {
        path: {
          slug: courseSlug,
          id: lesson.id,
        },
      },
    });
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  return {
    handleDelete,
    handleCancel,
    isDeleting: deleteLessonMutation.isPending,
  };
}
