'use client';

import {
  AlertCircleIcon,
  BookOpenIcon,
  CalendarIcon,
  PlusIcon,
  TagIcon,
  UserIcon,
} from 'lucide-react';
import Image from 'next/image';
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { Course } from '@/types/models';

import useConnect from './connect';

/**
 * CourseList - Connected component for displaying the list of courses
 * Follows container pattern: handles data fetching and business logic
 * Delegates pure UI rendering to internal components
 */
export default function CourseList() {
  const { courses, isLoading, isError, error, refetch } = useConnect();

  if (isLoading) {
    return <CourseListSkeleton />;
  }

  if (isError) {
    return <CourseListError error={error} onRetry={refetch} />;
  }

  if (courses.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Courses</h1>
          <p className="text-muted-foreground">
            Manage your meditation courses and lessons
          </p>
        </div>
        <Button asChild>
          <Link href="/courses/new">
            <PlusIcon className="mr-2 h-4 w-4" />
            Create Course
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Courses</CardTitle>
          <CardDescription>
            {courses.length} course{courses.length !== 1 ? 's' : ''} available
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">Image</TableHead>
                  <TableHead className="w-[300px]">Title</TableHead>
                  <TableHead className="w-[120px]">Author</TableHead>
                  <TableHead className="w-[150px]">Tags</TableHead>
                  <TableHead className="w-[80px]">Lessons</TableHead>
                  <TableHead className="w-[80px]">Status</TableHead>
                  <TableHead className="w-[100px]">Created</TableHead>
                  <TableHead className="w-[80px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {courses.map((course) => (
                  <CourseRow key={course.slug} course={course} />
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

/**
 * CourseRow - Individual course row component
 */
function CourseRow({ course }: { course: Course }) {
  const createdDate = course.createdAt
    ? new Date(course.createdAt).toLocaleDateString()
    : 'Unknown';

  return (
    <TableRow>
      <TableCell className="w-[80px]">
        <div className="relative h-20 w-20 rounded-lg overflow-hidden bg-muted">
          {course.imagePlaceholderUrl ? (
            <Image
              src={course.imagePlaceholderUrl}
              alt={course.title}
              fill
              className="object-cover"
              sizes="80px"
            />
          ) : (
            <Image
              src="/images/list_placeholder.png"
              alt={course.title + ' placeholder'}
              fill
              className="object-cover"
              sizes="80px"
            />
          )}
        </div>
      </TableCell>
      <TableCell className="max-w-[300px]">
        <div className="space-y-2 py-2">
          <Link
            href={`/courses/${course.slug}`}
            className="font-medium hover:underline block"
          >
            {course.title}
          </Link>
          {course.description && (
            <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed whitespace-normal">
              {course.description}
            </p>
          )}
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center space-x-2">
          <UserIcon className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm">
            {course.author?.username || 'Unknown'}
          </span>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex flex-wrap gap-1">
          {course.tagList && course.tagList.length > 0 ? (
            course.tagList.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                <TagIcon className="mr-1 h-3 w-3" />
                {tag}
              </Badge>
            ))
          ) : (
            <span className="text-sm text-muted-foreground">No tags</span>
          )}
          {course.tagList && course.tagList.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{course.tagList.length - 3} more
            </Badge>
          )}
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center space-x-2">
          <BookOpenIcon className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm">View lessons</span>
        </div>
      </TableCell>
      <TableCell>
        <Badge variant={course.active ? 'default' : 'secondary'}>
          {course.active ? 'Active' : 'Inactive'}
        </Badge>
      </TableCell>
      <TableCell>
        <div className="flex items-center space-x-2">
          <CalendarIcon className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm">{createdDate}</span>
        </div>
      </TableCell>
      <TableCell>
        <Button variant="ghost" size="sm" asChild>
          <Link href={`/courses/${course.slug}`}>View</Link>
        </Button>
      </TableCell>
    </TableRow>
  );
}

/**
 * Loading skeleton for course list
 */
function CourseListSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>
        <Skeleton className="h-10 w-32" />
      </div>

      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-48" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-8 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="h-6 w-full" />
              ))}
            </div>
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="grid grid-cols-8 gap-4">
                <Skeleton className="h-12 w-12 rounded-lg" />
                {Array.from({ length: 7 }).map((_, j) => (
                  <Skeleton key={j} className="h-15 w-full" />
                ))}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

/**
 * Error state component
 */
function CourseListError({
  error,
  onRetry,
}: {
  error: unknown;
  onRetry: () => void;
}) {
  const errorMessage =
    error instanceof Error
      ? error.message
      : 'An unexpected error occurred while loading courses.';

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Courses</h1>
        <p className="text-muted-foreground">
          Manage your meditation courses and lessons
        </p>
      </div>

      <Card>
        <CardContent className="flex flex-col items-center justify-center p-8 text-center">
          <AlertCircleIcon className="h-12 w-12 text-destructive mb-4" />
          <h3 className="text-lg font-semibold mb-2">Failed to load courses</h3>
          <p className="text-muted-foreground mb-4 max-w-md">{errorMessage}</p>
          <Button onClick={onRetry} variant="outline">
            Try Again
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

/**
 * Empty state when no courses exist
 */
function EmptyState() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Courses</h1>
          <p className="text-muted-foreground">
            Manage your meditation courses and lessons
          </p>
        </div>
        <Button asChild>
          <Link href="/courses/new">
            <PlusIcon className="mr-2 h-4 w-4" />
            Create Course
          </Link>
        </Button>
      </div>

      <Card>
        <CardContent className="flex flex-col items-center justify-center p-12 text-center">
          <BookOpenIcon className="h-16 w-16 text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold mb-2">No courses yet</h3>
          <p className="text-muted-foreground mb-6 max-w-md">
            Get started by creating your first meditation course. You can add
            lessons, generate scripts, and create audio content.
          </p>
          <Button asChild>
            <Link href="/courses/new">
              <PlusIcon className="mr-2 h-4 w-4" />
              Create Your First Course
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
