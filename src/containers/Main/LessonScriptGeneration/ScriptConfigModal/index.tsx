'use client';

import { Loader2 } from 'lucide-react';
import { useEffect } from 'react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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
import { TONE_SUGGESTIONS } from '@/containers/Main/LessonCreate/constants';
import type { LessonEditFormData } from '../constants';
import { MAX_INSTRUCTIONS_LENGTH } from '../constants';

import useConnect from './connect';
import type { ScriptConfigModalProps } from './types';

export function ScriptConfigModal({
  open,
  onOpenChange,
  lesson,
  onGenerate,
  onUpdateAndGenerate,
  isGenerating,
  isUpdating,
}: ScriptConfigModalProps) {
  const { form, isDirty, isValid, charactersRemaining } = useConnect();

  const isLoading = isGenerating || isUpdating;

  // Reset form when modal opens with fresh lesson data
  useEffect(() => {
    if (open) {
      form.reset({
        title: lesson.title,
        corePractice: lesson.corePractice,
        keyPoint: lesson.keyPoint,
        tone: lesson.tone,
        durationMinutes: lesson.durationMinutes,
        instructions: '',
      });
    }
  }, [open, lesson, form]);

  const handleSubmit = async (data: LessonEditFormData) => {
    if (isDirty) {
      // Form has changes - update lesson first, then generate
      await onUpdateAndGenerate(data);
    } else {
      // No changes - just generate
      onGenerate();
    }
    onOpenChange(false);
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  // Dynamic button label based on form state
  const getSubmitButtonLabel = () => {
    if (isUpdating) return 'Saving...';
    if (isGenerating) return 'Generating...';
    if (isDirty) return 'Save & Generate';
    return 'Generate';
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[600px] backdrop-blur-lg">
        <DialogHeader>
          <DialogTitle>Review Lesson & Generate Script</DialogTitle>
          <DialogDescription>
            Review the lesson details before generating. Any changes will be
            saved automatically.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-5"
          >
            {/* Lesson Title */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Lesson Title</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter lesson title"
                      {...field}
                      aria-describedby="title-error"
                    />
                  </FormControl>
                  <FormMessage id="title-error" />
                </FormItem>
              )}
            />

            {/* Core Practice */}
            <FormField
              control={form.control}
              name="corePractice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Core Practice</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe the core meditation practice..."
                      className="min-h-[80px] resize-none"
                      {...field}
                      aria-describedby="core-practice-help core-practice-error"
                    />
                  </FormControl>
                  <FormDescription id="core-practice-help">
                    The main technique or practice for this meditation
                  </FormDescription>
                  <FormMessage id="core-practice-error" />
                </FormItem>
              )}
            />

            {/* Key Point */}
            <FormField
              control={form.control}
              name="keyPoint"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Key Point</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="What is the key takeaway for this lesson..."
                      className="min-h-[80px] resize-none"
                      {...field}
                      aria-describedby="key-point-help key-point-error"
                    />
                  </FormControl>
                  <FormDescription id="key-point-help">
                    The main insight or message the practitioner should gain
                  </FormDescription>
                  <FormMessage id="key-point-error" />
                </FormItem>
              )}
            />

            {/* Tone - Combobox with suggestions */}
            <FormField
              control={form.control}
              name="tone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tone</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Type or select a tone (e.g., Calming, Energizing)"
                      list="tone-suggestions-script-modal"
                      {...field}
                      aria-describedby="tone-error"
                    />
                  </FormControl>
                  <datalist id="tone-suggestions-script-modal">
                    {TONE_SUGGESTIONS.map((tone) => (
                      <option key={tone} value={tone} />
                    ))}
                  </datalist>
                  <FormMessage id="tone-error" />
                </FormItem>
              )}
            />

            {/* Duration */}
            <FormField
              control={form.control}
              name="durationMinutes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Duration (minutes)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={1}
                      max={120}
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                      aria-describedby="duration-help duration-error"
                    />
                  </FormControl>
                  <FormDescription id="duration-help">
                    Target duration from 1 to 120 minutes
                  </FormDescription>
                  <FormMessage id="duration-error" />
                </FormItem>
              )}
            />

            {/* Additional Instructions */}
            <FormField
              control={form.control}
              name="instructions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Additional Instructions (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter any specific guidance for the script generation..."
                      className="min-h-[80px] resize-none"
                      maxLength={MAX_INSTRUCTIONS_LENGTH}
                      {...field}
                      aria-describedby="instructions-help instructions-error"
                    />
                  </FormControl>
                  <FormDescription
                    id="instructions-help"
                    className={
                      charactersRemaining < 50
                        ? 'text-amber-500'
                        : charactersRemaining < 0
                          ? 'text-destructive'
                          : ''
                    }
                  >
                    {charactersRemaining} characters remaining
                  </FormDescription>
                  <FormMessage id="instructions-error" />
                </FormItem>
              )}
            />

            {/* Dirty form indicator */}
            {isDirty && (
              <p className="text-sm text-amber-500" role="status">
                ⚠️ You have unsaved changes. They will be saved before
                generating.
              </p>
            )}

            <DialogFooter className="gap-3 sm:gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={isLoading}
                className="border-[#7dcfff] text-[#7dcfff] hover:bg-[#7dcfff]/10"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading || !isValid}
                className="bg-[#7dcfff] text-slate-900 hover:bg-[#7dcfff]/90"
              >
                {isLoading && (
                  <Loader2
                    className="mr-2 h-4 w-4 animate-spin"
                    aria-hidden="true"
                  />
                )}
                {getSubmitButtonLabel()}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
