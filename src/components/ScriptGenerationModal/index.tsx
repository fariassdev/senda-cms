'use client';

import { AlertTriangle, Loader2 } from 'lucide-react';
import { useMemo } from 'react';

import { LessonForm, type LessonFormData } from '@/components/LessonForm';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import useConnect from './connect';
import { MODAL_CONFIG, WARNING_BANNER_TEXT } from './constants';
import type { ScriptGenerationModalProps } from './types';

/**
 * ScriptGenerationModal Component
 * Unified modal for script generation and regeneration.
 * Shows warning banner when regenerating an existing script.
 *
 * Used by:
 * - ScriptPreview (regeneration flow)
 * - CourseDetail/SortableLessonList (initial generation and regeneration)
 */
export function ScriptGenerationModal({
  open,
  onOpenChange,
  lesson,
  onGenerate,
  onUpdateAndGenerate,
  isGenerating,
  isUpdating,
  isRegeneration = false,
}: ScriptGenerationModalProps) {
  const { isDirty, setIsDirty } = useConnect();

  const isLoading = isGenerating || isUpdating;
  const config = isRegeneration
    ? MODAL_CONFIG.regenerate
    : MODAL_CONFIG.generate;

  const handleSubmit = async (data: LessonFormData) => {
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
    if (isGenerating)
      return isRegeneration ? 'Regenerating...' : 'Generating...';
    if (isDirty) return config.submitLabelDirty;
    return config.submitLabel;
  };

  // Memoize defaultValues to prevent form reset on re-renders
  // The form's useEffect resets when defaultValues reference changes
  const defaultValues = useMemo(
    () => ({
      title: lesson.title,
      durationMinutes: lesson.durationMinutes,
      corePractice: lesson.corePractice,
      keyPoint: lesson.keyPoint,
      tone: lesson.tone,
    }),
    [
      lesson.title,
      lesson.durationMinutes,
      lesson.corePractice,
      lesson.keyPoint,
      lesson.tone,
    ],
  );

  // Show warning banner if regenerating (existing script)
  const showWarning =
    isRegeneration || (lesson.script && lesson.script.length > 0);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[600px] backdrop-blur-lg">
        <DialogHeader>
          <DialogTitle>{config.title}</DialogTitle>
          <DialogDescription>{config.description}</DialogDescription>
        </DialogHeader>

        {/* Warning Banner - WCAG accessible with role="alert" */}
        {showWarning && (
          <div
            role="alert"
            className="flex items-center gap-2 rounded-md bg-amber-500/10 border border-amber-500/30 p-3 text-amber-600 dark:text-amber-400"
          >
            <AlertTriangle
              className="h-5 w-5 flex-shrink-0"
              aria-hidden="true"
            />
            <p className="text-sm">{WARNING_BANNER_TEXT}</p>
          </div>
        )}

        {/* Reuse LessonForm */}
        <LessonForm
          defaultValues={defaultValues}
          onSubmit={handleSubmit}
          onDirtyChange={setIsDirty}
          showDescriptions
          className="space-y-5"
        >
          {/* Dirty form indicator */}
          {isDirty && (
            <p className="text-sm text-amber-500" role="status">
              ⚠️ Unsaved changes. They will be saved before{' '}
              {isRegeneration ? 'regenerating' : 'generating'}.
            </p>
          )}

          <DialogFooter className="gap-3 sm:gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && (
                <Loader2
                  className="mr-2 h-4 w-4 animate-spin"
                  aria-hidden="true"
                />
              )}
              {getSubmitButtonLabel()}
            </Button>
          </DialogFooter>
        </LessonForm>
      </DialogContent>
    </Dialog>
  );
}

// Re-export types for consumers
export type { ScriptGenerationModalProps } from './types';
