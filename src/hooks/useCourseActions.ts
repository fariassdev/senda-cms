import { useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';

import { $api } from '@/lib/api';
import type {
  CourseGenerationRequest,
  CreateCourseData,
  UpdateCourseData,
} from '@/types/models';

const useCourseActions = () => {
  const queryClient = useQueryClient();

  const { mutateAsync: createCourseMutation, isPending: loadingCreateCourse } =
    $api.useMutation('post', '/api/courses', {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ['get', '/api/courses'],
        });
      },
    });

  const { mutateAsync: updateCourseMutation, isPending: loadingUpdateCourse } =
    $api.useMutation('put', '/api/courses/{slug}', {
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries({
          queryKey: ['get', '/api/courses'],
        });
        queryClient.invalidateQueries({
          queryKey: [
            'get',
            '/api/courses/{slug}',
            { path: { slug: variables.params.path.slug } },
          ],
        });
      },
    });

  const { mutateAsync: deleteCourseMutation, isPending: loadingDeleteCourse } =
    $api.useMutation('delete', '/api/courses/{slug}', {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ['get', '/api/courses'],
        });
      },
    });

  const {
    mutateAsync: generateCourseMutation,
    isPending: loadingGenerateCourse,
  } = $api.useMutation('post', '/api/courses/generate', {
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['get', '/api/courses'],
      });
    },
  });

  const createCourse = useCallback(
    async (data: CreateCourseData) => {
      const response = await createCourseMutation({
        body: { course: data },
      });
      return response?.course;
    },
    [createCourseMutation],
  );

  const updateCourse = useCallback(
    async (slug: string, data: UpdateCourseData) => {
      const response = await updateCourseMutation({
        params: {
          path: { slug },
        },
        body: { course: data },
      });
      return response?.course;
    },
    [updateCourseMutation],
  );

  const deleteCourse = useCallback(
    async (slug: string) => {
      await deleteCourseMutation({
        params: {
          path: { slug },
        },
      });
    },
    [deleteCourseMutation],
  );

  const generateCourse = useCallback(
    async (data: CourseGenerationRequest) => {
      const response = await generateCourseMutation({
        body: data,
      });
      return response?.course;
    },
    [generateCourseMutation],
  );

  return {
    createCourse,
    updateCourse,
    deleteCourse,
    generateCourse,
    loadingCreateCourse,
    loadingUpdateCourse,
    loadingDeleteCourse,
    loadingGenerateCourse,
  };
};

export default useCourseActions;
export type UseCourseActions = ReturnType<typeof useCourseActions>;
