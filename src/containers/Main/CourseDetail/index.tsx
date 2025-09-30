'use client';

import {
  AlertCircleIcon,
  BookOpenIcon,
  CalendarIcon,
  TagIcon,
  UserIcon,
} from 'lucide-react';
import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

import useConnect from './connect';
import type { CourseDetailProps } from './types';

export default function CourseDetail({ courseId }: CourseDetailProps) {
  const { course, isLoading, isError, error, refetch } = useConnect(courseId);

  if (isLoading) {
    return <CourseDetailSkeleton />;
  }

  if (isError) {
    return <CourseDetailError error={error} onRetry={refetch} />;
  }

  if (!course) {
    return <CourseNotFound />;
  }

  return (
    <div className="space-y-6">
      {/* Course Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">{course.title}</h1>
        {course.description && (
          <p className="text-lg text-muted-foreground">{course.description}</p>
        )}
      </div>

      {/* Course Metadata */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BookOpenIcon className="h-5 w-5" />
              <span>Course Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <UserIcon className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">
                <strong>Author:</strong> {course.author}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <CalendarIcon className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">
                <strong>Created:</strong>{' '}
                {course.createdAt
                  ? new Date(course.createdAt).toLocaleDateString()
                  : 'Unknown'}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <BookOpenIcon className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">
                <strong>Lessons:</strong> {course.lessons.length}
              </span>
            </div>
            <div className="space-y-2">
              <span className="text-sm font-medium">Status:</span>
              <Badge variant={course.active ? 'default' : 'secondary'}>
                {course.active ? 'Active' : 'Inactive'}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TagIcon className="h-5 w-5" />
              <span>Tags</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {course.tags.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {course.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No tags assigned</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* TODO: Lessons List - Will be implemented in Phase 5 */}
      <Card>
        <CardHeader>
          <CardTitle>Lessons</CardTitle>
          <CardDescription>
            Manage individual meditation lessons for this course
          </CardDescription>
        </CardHeader>
        <CardContent>
          {course.lessons.length > 0 ? (
            <p className="text-muted-foreground">
              {course.lessons.length} lessons in this course. Lesson management
              coming in Phase 5.
            </p>
          ) : (
            <p className="text-muted-foreground">
              No lessons created yet. Lesson creation coming in Phase 5.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function CourseDetailSkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-9 w-96" />
        <Skeleton className="h-6 w-128" />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
          </CardHeader>
          <CardContent className="space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-5 w-full" />
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-24" />
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-6 w-16 rounded-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-5 w-96" />
        </CardContent>
      </Card>
    </div>
  );
}

function CourseDetailError({
  error,
  onRetry,
}: {
  error: unknown;
  onRetry: () => void;
}) {
  const errorMessage =
    error instanceof Error
      ? error.message
      : 'An unexpected error occurred while loading the course.';

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Course Details</h1>
        <p className="text-muted-foreground">
          Unable to load course information
        </p>
      </div>

      <Card>
        <CardContent className="flex flex-col items-center justify-center p-8 text-center">
          <AlertCircleIcon className="h-12 w-12 text-destructive mb-4" />
          <h3 className="text-lg font-semibold mb-2">Failed to load course</h3>
          <p className="text-muted-foreground mb-4 max-w-md">{errorMessage}</p>
          <Button onClick={onRetry} variant="outline">
            Try Again
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

function CourseNotFound() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Course Not Found</h1>
        <p className="text-muted-foreground">
          The course you&apos;re looking for doesn&apos;t exist
        </p>
      </div>

      <Card>
        <CardContent className="flex flex-col items-center justify-center p-8 text-center">
          <BookOpenIcon className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">Course not found</h3>
          <p className="text-muted-foreground mb-4 max-w-md">
            This course may have been deleted or the link may be incorrect.
          </p>
          <Button asChild variant="outline">
            <Link href="/courses">Back to Courses</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
