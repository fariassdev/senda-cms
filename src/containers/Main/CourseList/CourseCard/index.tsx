'use client';

import { CalendarIcon, TagIcon, Trash2Icon, UserIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

import type { CourseCardProps } from './types';

/**
 * CourseCard - Mobile/Tablet card component for displaying a single course
 */
export function CourseCard({ course, onDelete }: CourseCardProps) {
  const createdDate = course.createdAt
    ? new Date(course.createdAt).toLocaleDateString()
    : 'Unknown';

  return (
    <Card className="relative">
      {/* Delete button in top-right corner */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-2 right-2 h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 z-10"
        onClick={() => onDelete?.(course)}
        aria-label={`Delete ${course.title}`}
      >
        <Trash2Icon className="h-4 w-4" />
      </Button>

      <CardContent className="p-4">
        {/* Header: Image and Title */}
        <div className="flex gap-4 mb-3">
          <div className="relative h-20 w-20 flex-shrink-0 rounded-lg overflow-hidden bg-muted">
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
          <div className="flex-1 min-w-0 pr-8">
            <div className="flex items-start justify-between gap-2 mb-1">
              <Link
                href={`/courses/${course.slug}`}
                className="font-medium hover:underline line-clamp-2 leading-tight"
              >
                {course.title}
              </Link>
              <Badge
                variant={course.active ? 'default' : 'secondary'}
                className="flex-shrink-0"
              >
                {course.active ? 'Active' : 'Inactive'}
              </Badge>
            </div>
            {course.description && (
              <p className="text-sm text-muted-foreground line-clamp-2">
                {course.description}
              </p>
            )}
          </div>
        </div>

        {/* Metadata: Author, Created */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground mb-3">
          <span className="inline-flex items-center gap-1">
            <UserIcon className="h-3.5 w-3.5" aria-hidden="true" />
            <span>{course.author?.username || 'Unknown'}</span>
          </span>
          <span className="inline-flex items-center gap-1">
            <CalendarIcon className="h-3.5 w-3.5" aria-hidden="true" />
            <span>{createdDate}</span>
          </span>
        </div>

        {/* Tags */}
        {course.tagList && course.tagList.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {course.tagList.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                <TagIcon className="mr-1 h-3 w-3" />
                {tag}
              </Badge>
            ))}
            {course.tagList.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{course.tagList.length - 3} more
              </Badge>
            )}
          </div>
        )}

        {/* Action */}
        <Button variant="outline" size="sm" className="w-full" asChild>
          <Link href={`/courses/${course.slug}`}>Edit Course</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
