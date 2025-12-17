'use client';

import { PlusIcon } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import { CourseCard } from './CourseCard';
import { CourseListError } from './CourseListError';
import { CourseListSkeleton } from './CourseListSkeleton';
import { CourseRow } from './CourseRow';
import { EmptyState } from './EmptyState';
import useConnect from './connect';

/**
 * CourseList - Connected component for displaying the list of courses
 * Follows container pattern: handles data fetching and business logic
 * Delegates pure UI rendering to child components
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
          {/* Desktop: Table layout */}
          <div className="hidden lg:block overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">Image</TableHead>
                  <TableHead className="w-[300px]">Title</TableHead>
                  <TableHead className="w-[120px]">Author</TableHead>
                  <TableHead className="w-[150px]">Tags</TableHead>
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

          {/* Tablet/Mobile: Card layout */}
          <div className="lg:hidden space-y-3">
            {courses.map((course) => (
              <CourseCard key={course.slug} course={course} />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
