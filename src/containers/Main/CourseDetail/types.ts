import type { Course } from '@/types/models';

export interface CourseDetailProps {
  courseId: string;
}

export interface CourseDetailState {
  course: Course | undefined;
  isLoading: boolean;
  isError: boolean;
  error: unknown;
  refetch: () => void;
}
