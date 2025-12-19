import type { Course } from '@/types/models';

export interface CourseRowProps {
  course: Course;
  onDelete?: (course: Course) => void;
}
