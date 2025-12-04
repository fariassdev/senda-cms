'use client';

import {
  AlertCircleIcon,
  ArrowLeft,
  BookOpenIcon,
  CalendarIcon,
  TagIcon,
  ImageIcon,
  Plus,
  Save,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
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
import LessonCreate from './LessonCreate';
import LessonDelete from './LessonDelete';
import LessonEdit from './LessonEdit';
import { UNSAVED_CHANGES } from './LessonReorder';
import { SortableLessonList } from './SortableLessonList';

import useConnect from './connect';
import type { CourseDetailProps } from './types';

export default function CourseDetail({ courseSlug }: CourseDetailProps) {
  const {
    course,
    form,
    isLoading,
    isError,
    error,
    refetch,
    isLessonsLoading,
    isLessonsError,
    refetchLessons,
    isUpdating,
    onSubmit,
    isLessonCreateOpen,
    nextLessonNumber,
    handleOpenLessonCreate,
    handleCloseLessonCreate,
    handleLessonCreateSuccess,
    isLessonEditOpen,
    selectedLesson,
    handleEditLesson,
    handleCloseLessonEdit,
    handleLessonEditSuccess,
    isLessonDeleteOpen,
    lessonToDelete,
    handleDeleteLesson,
    handleCloseLessonDelete,
    handleLessonDeleteSuccess,
    handleLocalReorder,
    saveReorder,
    reorderState,
    isReordering,
    isUnsavedChangesModalOpen,
    handleNavigateWithCheck,
    handleSaveAndNavigate,
    handleDiscardAndNavigate,
    handleCancelNavigation,
  } = useConnect(courseSlug);
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
      {/* Header with back button */}
      <div className="space-y-4">
        <Button
          variant="ghost"
          className="mb-4"
          onClick={(e) => {
            e.preventDefault();
            handleNavigateWithCheck('/courses');
          }}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Courses
        </Button>
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Course Details</h1>
          <p className="text-muted-foreground">
            Edit course information and settings
          </p>
        </div>
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
                    name="title"
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

                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm">
                        <strong>Author:</strong>{' '}
                        {course.author?.username || 'Unknown'}
                      </span>
                    </div>
                  </div>

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
                <CardHeader className="flex flex-row items-center justify-between space-y-0">
                  <div className="space-y-1.5">
                    <CardTitle className="flex items-center space-x-2">
                      <BookOpenIcon className="h-5 w-5" />
                      <span>Lessons</span>
                    </CardTitle>
                    <CardDescription>
                      Manage individual meditation lessons for this course
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    {reorderState.hasUnsavedChanges && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={saveReorder}
                        disabled={isReordering}
                        className="border-cyan-600 text-cyan-600 hover:bg-cyan-50 hover:text-cyan-700"
                      >
                        <Save className="mr-2 h-4 w-4" />
                        {isReordering ? 'Saving...' : 'Save Changes'}
                      </Button>
                    )}
                    <Button
                      type="button"
                      onClick={handleOpenLessonCreate}
                      className="bg-cyan-600 hover:bg-cyan-700"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add Lesson
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <SortableLessonList
                    lessons={reorderState.displayLessons}
                    courseSlug={courseSlug}
                    isLoading={isLessonsLoading}
                    isError={isLessonsError}
                    onRetry={refetchLessons}
                    onAddLesson={handleOpenLessonCreate}
                    onEditLesson={handleEditLesson}
                    onDeleteLesson={handleDeleteLesson}
                    onReorder={handleLocalReorder}
                    isReordering={isReordering}
                  />
                </CardContent>
              </Card>

              {/* Submit Button */}
              <div className="flex justify-end">
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

          {/* Tags Card - Read-only for now */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TagIcon className="h-5 w-5" />
                <span>Tags</span>
              </CardTitle>
              <CardDescription>Course categories and topics</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {course.tagList && course.tagList.length > 0 ? (
                  course.tagList.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No tags assigned
                  </p>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                Tag management coming soon
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Lesson Modals - Outside the form grid to prevent submit interference */}
      <LessonCreate
        courseSlug={courseSlug}
        nextLessonNumber={nextLessonNumber}
        open={isLessonCreateOpen}
        onOpenChange={handleCloseLessonCreate}
        onSuccess={handleLessonCreateSuccess}
      />

      {selectedLesson && (
        <LessonEdit
          courseSlug={courseSlug}
          lesson={selectedLesson}
          open={isLessonEditOpen}
          onOpenChange={handleCloseLessonEdit}
          onSuccess={handleLessonEditSuccess}
        />
      )}

      {lessonToDelete && (
        <LessonDelete
          courseSlug={courseSlug}
          lesson={lessonToDelete}
          open={isLessonDeleteOpen}
          onOpenChange={handleCloseLessonDelete}
          onSuccess={handleLessonDeleteSuccess}
        />
      )}

      {/* Unsaved Changes Modal */}
      <AlertDialog
        open={isUnsavedChangesModalOpen}
        onOpenChange={handleCancelNavigation}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{UNSAVED_CHANGES.title}</AlertDialogTitle>
            <AlertDialogDescription>
              {UNSAVED_CHANGES.description}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col gap-2 sm:flex-row">
            <AlertDialogCancel onClick={handleCancelNavigation}>
              {UNSAVED_CHANGES.cancelButton}
            </AlertDialogCancel>
            <Button
              variant="outline"
              onClick={handleDiscardAndNavigate}
              className="border-destructive text-destructive hover:bg-destructive/10"
            >
              {UNSAVED_CHANGES.discardButton}
            </Button>
            <AlertDialogAction
              onClick={handleSaveAndNavigate}
              disabled={isReordering}
              className="bg-cyan-600 hover:bg-cyan-700"
            >
              <Save className="mr-2 h-4 w-4" />
              {isReordering ? 'Saving...' : UNSAVED_CHANGES.saveButton}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function CourseDetailSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header with back button */}
      <div className="space-y-4">
        <Skeleton className="h-10 w-32" />
        <div className="space-y-2">
          <Skeleton className="h-9 w-96" />
          <Skeleton className="h-6 w-128" />
        </div>
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

          {/* Submit button */}
          <div className="flex justify-end">
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
