'use client';

import { BookOpenIcon, PlusIcon } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

/**
 * EmptyState - Empty state component when no courses exist
 */
export function EmptyState() {
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
