'use client';

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
import { Textarea } from '@/components/ui/textarea';

import { cn } from '@/lib/utils';

import useConnect from './connect';
import { TONE_SUGGESTIONS } from './constants';
import type { LessonFormProps } from './types';

export function LessonForm({
  defaultValues,
  onSubmit,
  onDirtyChange,
  id = 'lesson-form',
  autoFocusTitle = false,
  showDescriptions = false,
  className,
  children,
}: LessonFormProps) {
  const { form, handleSubmit } = useConnect({
    defaultValues,
    onSubmit,
    onDirtyChange,
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className={cn('space-y-4', className)}
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Title <span className="text-destructive">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter lesson title"
                  autoFocus={autoFocusTitle}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="durationMinutes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Duration (minutes) <span className="text-destructive">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min={1}
                  max={120}
                  placeholder="10"
                  {...field}
                  onChange={(e) => {
                    const value = e.target.value;
                    field.onChange(value === '' ? '' : parseInt(value, 10));
                  }}
                />
              </FormControl>
              {showDescriptions && (
                <FormDescription>
                  Target duration from 1 to 120 minutes
                </FormDescription>
              )}
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="corePractice"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Core Practice <span className="text-destructive">*</span>
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe the main meditation practice for this lesson"
                  className="min-h-20 resize-none"
                  {...field}
                />
              </FormControl>
              {showDescriptions && (
                <FormDescription>
                  The main technique or practice for this meditation
                </FormDescription>
              )}
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="keyPoint"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Key Point <span className="text-destructive">*</span>
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder="The central learning outcome for this lesson"
                  className="min-h-20 resize-none"
                  {...field}
                />
              </FormControl>
              {showDescriptions && (
                <FormDescription>
                  The main insight or message the practitioner should gain
                </FormDescription>
              )}
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Tone <span className="text-destructive">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Type or select a tone (e.g., Calming, Energizing)"
                  list={`${id}-tone-suggestions`}
                  {...field}
                />
              </FormControl>
              <datalist id={`${id}-tone-suggestions`}>
                {TONE_SUGGESTIONS.map((tone) => (
                  <option key={tone} value={tone} />
                ))}
              </datalist>
              <FormMessage />
            </FormItem>
          )}
        />

        {children}
      </form>
    </Form>
  );
}

export { type LessonFormData } from './constants';
