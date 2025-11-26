import type { Course } from '@/types/models';

/**
 * Course detail container props
 */
export interface CourseDetailProps {
  courseSlug: string;
}

/**
 * Course update form data
 */
export interface CourseUpdateFormData {
  name: string;
  description: string;
  author: string;
  tags: string[];
  active: boolean;
  imagePlaceholderUrl?: string;
}

/**
 * Course detail container state from connect hook
 */
export interface CourseDetailState {
  course: Course | undefined;
  isLoading: boolean;
  isError: boolean;
  error: unknown;
  refetch: () => void;
  updateCourse: (data: {
    name?: string | null;
    description?: string | null;
    tags?: string[] | null;
    active?: boolean | null;
    author?: string | null;
    imagePlaceholderUrl?: string | null;
  }) => Promise<void>;
  isUpdating: boolean;
}
