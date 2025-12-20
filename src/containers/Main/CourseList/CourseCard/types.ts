import type { Course } from '@/types/models';

export interface CourseCardProps {
  course: Course;
  onDelete?: (course: Course) => void;
}
