import { $api } from '@/lib/api';

/**
 * CourseList container connection hook
 * Handles data fetching and business logic for the course listing
 * Uses auto-generated openapi-react-query hooks for type-safe API integration
 */
export default function useConnect() {
  // Use the auto-generated hook for fetching courses
  const coursesQuery = $api.useQuery('get', '/api/courses', {
    params: {
      query: {
        offset: 0,
        limit: 100, // For now, fetch all courses without pagination
      },
    },
  });

  return {
    // Course data and loading states
    courses: coursesQuery.data?.courses ?? [],
    isLoading: coursesQuery.isLoading,
    isError: coursesQuery.isError,
    error: coursesQuery.error,

    // Query utilities
    refetch: coursesQuery.refetch,
    isFetching: coursesQuery.isFetching,
  };
}
