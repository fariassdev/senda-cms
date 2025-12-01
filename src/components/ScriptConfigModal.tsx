'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import { Badge } from '@/components/ui/badge';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import {
  MAX_INSTRUCTIONS_LENGTH,
  scriptConfigSchema,
  TONE_OPTIONS,
} from '@/containers/Main/LessonScriptGeneration';
import type {
  ScriptConfigFormData,
  ScriptConfigModalProps,
} from '@/containers/Main/LessonScriptGeneration';

export function ScriptConfigModal({
  open,
  onOpenChange,
  lessonTitle,
  lessonDuration,
  keyThemes = [],
  defaultTone = 'calming',
  onGenerate,
  isGenerating,
}: ScriptConfigModalProps) {
  const form = useForm<ScriptConfigFormData>({
    resolver: zodResolver(scriptConfigSchema),
    defaultValues: {
      tone: defaultTone,
      target_duration: lessonDuration,
      instructions: '',
    },
  });

  // Reset form when modal opens with new values
  useEffect(() => {
    if (open) {
      form.reset({
        tone: defaultTone,
        target_duration: lessonDuration,
        instructions: '',
      });
    }
  }, [open, defaultTone, lessonDuration, form]);

  const instructionsValue = form.watch('instructions') ?? '';
  const charactersRemaining =
    MAX_INSTRUCTIONS_LENGTH - instructionsValue.length;

  const handleSubmit = (data: ScriptConfigFormData) => {
    onGenerate(data);
    onOpenChange(false);
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-[600px] backdrop-blur-lg"
        aria-labelledby="script-config-title"
        aria-describedby="script-config-description"
      >
        <DialogHeader>
          <DialogTitle id="script-config-title">
            Configure Script Generation
          </DialogTitle>
          <DialogDescription id="script-config-description">
            Set the tone and style for &ldquo;{lessonTitle}&rdquo; script
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            {/* Tone Selector */}
            <FormField
              control={form.control}
              name="tone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tone</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger
                        className="w-full"
                        aria-label="Select tone for script generation"
                      >
                        <SelectValue placeholder="Select a tone" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {TONE_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Target Duration */}
            <FormField
              control={form.control}
              name="target_duration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Target Duration (minutes)</FormLabel>
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
                    Adjustable from 1 to 120 minutes
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
                      placeholder="Enter specific guidance for the script generation..."
                      className="min-h-[100px] resize-none"
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

            {/* Key Themes Preview */}
            {keyThemes.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium leading-none">Key Themes</p>
                <div
                  className="flex flex-wrap gap-2"
                  role="list"
                  aria-label="Key themes for this lesson"
                >
                  {keyThemes.map((theme, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="text-xs"
                      role="listitem"
                    >
                      {theme}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={isGenerating}
                className="border-[#7dcfff] text-[#7dcfff] hover:bg-[#7dcfff]/10"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isGenerating || !form.formState.isValid}
                className="bg-[#7dcfff] text-slate-900 hover:bg-[#7dcfff]/90"
              >
                {isGenerating ? 'Generating...' : 'Generate'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
