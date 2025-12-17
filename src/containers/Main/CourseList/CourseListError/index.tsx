'use client';

import { AlertCircleIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

import type { CourseListErrorProps } from './types';

/**
 * CourseListError - Error state component for CourseList
 */
export function CourseListError({ error, onRetry }: CourseListErrorProps) {
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
