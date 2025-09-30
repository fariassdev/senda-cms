'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import {
  AlertCircleIcon,
  BookOpenIcon,
  CalendarIcon,
  TagIcon,
  ImageIcon,
  PlusIcon,
  XIcon,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';

import useConnect from './connect';
import { courseUpdateSchema, type CourseUpdateFormData } from './constants';
import type { CourseDetailProps } from './types';

export default function CourseDetail({ courseId }: CourseDetailProps) {
  const {
    course,
    isLoading,
    isError,
    error,
    refetch,
    updateCourse,
    isUpdating,
  } = useConnect(courseId);
  const [newTag, setNewTag] = useState('');

  const form = useForm<CourseUpdateFormData>({
    resolver: zodResolver(courseUpdateSchema),
    defaultValues: {
      name: '',
      description: '',
      author: '',
      tags: [],
      active: true,
      imagePlaceholderUrl: '',
    },
  });

  // Update form when course data is loaded
  useEffect(() => {
    if (course) {
      form.reset({
        name: course.title,
        description: course.description,
        author: course.author,
        tags: course.tags,
        active: course.active,
        imagePlaceholderUrl: course.imagePlaceholderUrl || '',
      });
    }
  }, [course, form]);

  const onSubmit = async (data: CourseUpdateFormData) => {
    await updateCourse({
      name: data.name,
      description: data.description,
      author: data.author,
      tags: data.tags,
      active: data.active,
      imagePlaceholderUrl: data.imagePlaceholderUrl || null,
    });
  };

  const addTag = () => {
    if (newTag.trim() && !form.getValues('tags').includes(newTag.trim())) {
      const currentTags = form.getValues('tags');
      form.setValue('tags', [...currentTags, newTag.trim()]);
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    const currentTags = form.getValues('tags');
    form.setValue(
      'tags',
      currentTags.filter((tag) => tag !== tagToRemove),
    );
  };

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
        <h1 className="text-3xl font-bold tracking-tight">Course Details</h1>
        <p className="text-muted-foreground">
          Edit course information and settings
        </p>
      </div>

      {/* Course Edit Form */}
      <div className="grid gap-6 lg:grid-cols-4">
        <div className="lg:col-span-3">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Course Details */}
              <Card>
                <CardHeader>
                  <CardTitle>Course Information</CardTitle>
                  <CardDescription>
                    Basic course details and metadata
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Active Status Switch */}
                  <FormField
                    control={form.control}
                    name="active"
                    render={({ field }) => (
                      <FormItem className="rounded-lg border p-4">
                        <div className="flex flex-col space-y-3">
                          <div className="flex items-center space-x-2">
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <FormLabel className="text-base">
                              Course Active
                            </FormLabel>
                            <Badge
                              variant={field.value ? 'default' : 'secondary'}
                              className={
                                field.value
                                  ? 'bg-green-500 hover:bg-green-600'
                                  : 'bg-gray-500'
                              }
                            >
                              {field.value ? 'Active' : 'Inactive'}
                            </Badge>
                          </div>
                          <FormDescription>
                            {field.value
                              ? 'This course is visible and available to users'
                              : 'This course is hidden and not available to users'}
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Course title" {...field} />
                        </FormControl>
                        <FormDescription>
                          A clear, descriptive title for your course
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Course description"
                            className="min-h-24"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Describe the course content, goals, and target
                          audience
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="author"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Author</FormLabel>
                        <FormControl>
                          <Input placeholder="Author name" {...field} />
                        </FormControl>
                        <FormDescription>
                          The name of the course instructor or creator
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Dates at the end of course information */}
                  <div className="space-y-2 pt-4 border-t">
                    <div className="flex items-center space-x-2">
                      <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        <strong>Created:</strong>{' '}
                        {course.createdAt
                          ? new Date(course.createdAt).toLocaleDateString()
                          : 'Unknown'}
                      </span>
                    </div>
                    {course.updatedAt && (
                      <div className="flex items-center space-x-2">
                        <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">
                          <strong>Updated:</strong>{' '}
                          {new Date(course.updatedAt).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Lessons Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <BookOpenIcon className="h-5 w-5" />
                    <span>Lessons</span>
                  </CardTitle>
                  <CardDescription>
                    Manage individual meditation lessons for this course
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {course.lessons.length > 0 ? (
                    <p className="text-muted-foreground">
                      {course.lessons.length} lessons in this course. Lesson
                      management coming in Phase 5.
                    </p>
                  ) : (
                    <p className="text-muted-foreground">
                      No lessons created yet. Lesson creation coming in Phase 5.
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Submit Button */}
              <div className="flex justify-end space-x-4">
                <Button type="button" variant="outline" asChild>
                  <Link href="/courses">Back to Courses</Link>
                </Button>
                <Button type="submit" disabled={isUpdating}>
                  {isUpdating ? 'Updating...' : 'Update Course'}
                </Button>
              </div>
            </form>
          </Form>
        </div>

        {/* Right Sidebar - Course Image and Tags */}
        <div className="lg:col-span-1 space-y-6">
          {/* Course Image Card */}
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <ImageIcon className="h-5 w-5" />
                <span>Course Image</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {course.imagePlaceholderUrl ? (
                <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                  <Image
                    src={course.imagePlaceholderUrl}
                    alt="Course"
                    width={400}
                    height={225}
                    className="max-w-full max-h-full object-contain rounded-lg"
                  />
                </div>
              ) : (
                <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <ImageIcon className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">
                      No image uploaded
                    </p>
                  </div>
                </div>
              )}
              <p className="text-xs text-muted-foreground mt-2">
                Image upload functionality coming soon
              </p>
            </CardContent>
          </Card>

          {/* Tags Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TagIcon className="h-5 w-5" />
                <span>Tags</span>
              </CardTitle>
              <CardDescription>
                Categorize and organize your course
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {form.watch('tags').map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    {tag}
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-4 w-4 p-0 hover:bg-transparent"
                      onClick={() => removeTag(tag)}
                    >
                      <XIcon className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>

              <div className="flex gap-2">
                <Input
                  placeholder="Add a tag"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addTag();
                    }
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addTag}
                >
                  <PlusIcon className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function CourseDetailSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <Skeleton className="h-9 w-96" />
        <Skeleton className="h-6 w-128" />
      </div>

      {/* Main grid layout matching the actual component */}
      <div className="grid gap-6 lg:grid-cols-4">
        {/* Left side - Form content */}
        <div className="lg:col-span-3 space-y-6">
          {/* Course Information Card */}
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-64" />
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Switch skeleton */}
              <div className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-48" />
                </div>
                <Skeleton className="h-6 w-12 rounded-full" />
              </div>

              {/* Form fields */}
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-3 w-48" />
                </div>
              ))}

              {/* Dates section */}
              <div className="space-y-2 pt-4 border-t">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-36" />
              </div>
            </CardContent>
          </Card>

          {/* Lessons Card */}
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-4 w-64" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-5 w-96" />
            </CardContent>
          </Card>

          {/* Submit buttons */}
          <div className="flex justify-end space-x-4">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-36" />
          </div>
        </div>

        {/* Right side - Image and Tags */}
        <div className="lg:col-span-1 space-y-6">
          {/* Image Card */}
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent>
              <Skeleton className="aspect-video w-full rounded-lg" />
              <Skeleton className="h-3 w-48 mt-2" />
            </CardContent>
          </Card>

          {/* Tags Card */}
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-16" />
              <Skeleton className="h-4 w-40" />
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-6 w-16 rounded-full" />
                ))}
              </div>
              <div className="flex gap-2">
                <Skeleton className="h-10 flex-1" />
                <Skeleton className="h-10 w-10" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
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
