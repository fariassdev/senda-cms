'use client';

import { ArrowLeft } from 'lucide-react';
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
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';

import useConnect from './connect';
import type { CourseCreateProps } from './types';

export default function CourseCreate(_props: CourseCreateProps) {
  const { form, onSubmit, isLoading, error } = useConnect();

  return (
    <div className="container mx-auto py-8">
      {/* Header with back button */}
      <div className="mb-8">
        <Link href="/courses">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Courses
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Create New Course</h1>
        <p className="text-muted-foreground mt-2">
          Generate a new meditation course with AI-powered content creation
        </p>
      </div>

      {/* Course creation form */}
      <div className="max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Course Generation Prompt</CardTitle>
            <CardDescription>
              Describe the meditation course you want to create. Be specific
              about the topic, style, and target audience.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="prompt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Course Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Example: Create a 7-day mindfulness course for beginners focusing on breath awareness and body scanning techniques. Each session should be 10-15 minutes long with gentle guidance suitable for people new to meditation..."
                          className="min-h-32"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Provide a detailed description of the course you want to
                        generate. Include duration, target audience, meditation
                        style, and any specific requirements.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Error display */}
                {error && (
                  <div className="rounded-md bg-destructive/15 p-3">
                    <p className="text-sm text-destructive">
                      Failed to create course. Please try again.
                    </p>
                  </div>
                )}

                {/* Submit button */}
                <div className="flex justify-end">
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? 'Generating Course...' : 'Create Course'}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
