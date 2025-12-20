import { useCallback, useState } from 'react';

import { $api } from '@/lib/api';
import type { Course } from '@/types/models';

/**
 * CourseList container connection hook
 * Handles data fetching and business logic for the course listing
 * Uses auto-generated openapi-react-query hooks for type-safe API integration
 */
export default function useConnect() {
  // Delete modal state
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState<Course | null>(null);

  // Use the auto-generated hook for fetching courses
  const coursesQuery = $api.useQuery('get', '/api/courses', {
    params: {
      query: {
        offset: 0,
        limit: 100, // For now, fetch all courses without pagination
      },
    },
  });

  // Delete modal handlers
  const handleDeleteCourse = useCallback((course: Course) => {
    setCourseToDelete(course);
    setIsDeleteOpen(true);
  }, []);

  const handleCloseDelete = useCallback((open: boolean) => {
    setIsDeleteOpen(open);
    if (!open) {
      setCourseToDelete(null);
    }
  }, []);

  return {
    // Course data and loading states
    courses: coursesQuery.data?.courses ?? [],
    isLoading: coursesQuery.isLoading,
    isError: coursesQuery.isError,
    error: coursesQuery.error,

    // Query utilities
    refetch: coursesQuery.refetch,
    isFetching: coursesQuery.isFetching,

    // Delete modal state and handlers
    isDeleteOpen,
    courseToDelete,
    handleDeleteCourse,
    handleCloseDelete,
  };
}
