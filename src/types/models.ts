import type { components } from '@/types/api';

// Course types
export type Course = components['schemas']['CourseData'];
export type CourseGenerationData =
  components['schemas']['CourseGenerationData'];
export type CreateCourseData = components['schemas']['CreateCourseData'];
export type UpdateCourseData = components['schemas']['UpdateCourseData'];

// Lesson types
export type Lesson = components['schemas']['LessonData'];
export type LessonGenerationData =
  components['schemas']['LessonGenerationData'];
export type CreateLessonData = components['schemas']['CreateLessonData'];
export type UpdateLessonData = components['schemas']['UpdateLessonData'];

// Script and Audio types
export type ScriptPart = components['schemas']['ScriptPartResponse'];
export type ScriptGenerationResponse =
  components['schemas']['ScriptGenerationResponse'];
export type AudioGenerationResponse =
  components['schemas']['AudioGenerationResponse'];

// User types
export type User = components['schemas']['AuthenticatedUserData'];
export type LoggedInUser = components['schemas']['LoggedInUserData'];
export type RegisteredUser = components['schemas']['RegisteredUserData'];

// Other types
export type DifficultyLevel = components['schemas']['DifficultyLevel'];
