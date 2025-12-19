'use client';

import {
  CalendarIcon,
  PencilIcon,
  TagIcon,
  Trash2Icon,
  UserIcon,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TableCell, TableRow } from '@/components/ui/table';

import type { CourseRowProps } from './types';

/**
 * CourseRow - Desktop table row component for displaying a single course
 */
export function CourseRow({ course, onDelete }: CourseRowProps) {
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
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
            <Link
              href={`/courses/${course.slug}`}
              aria-label={`Edit ${course.title}`}
            >
              <PencilIcon className="h-4 w-4" />
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
            onClick={() => onDelete?.(course)}
            aria-label={`Delete ${course.title}`}
          >
            <Trash2Icon className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}
