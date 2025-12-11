'use client';

import { AlertTriangle, Loader2 } from 'lucide-react';

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
import type { RegenerateScriptModalProps } from './types';

/**
 * RegenerateScriptModal Component
 * Modal for confirming script regeneration with lesson parameter editing.
 * Shows warning banner about replacing existing script. (Task 2)
 */
export function RegenerateScriptModal({
  open,
  onOpenChange,
  lesson,
  onGenerate,
  onUpdateAndGenerate,
  isGenerating,
  isUpdating,
}: RegenerateScriptModalProps) {
  const { isDirty, setIsDirty } = useConnect();

  const isLoading = isGenerating || isUpdating;

  const handleSubmit = async (data: LessonFormData) => {
    if (isDirty) {
      // Form has changes - update lesson first, then generate (Task 2.8)
      await onUpdateAndGenerate(data);
    } else {
      // No changes - just generate (Task 2.9)
      onGenerate();
    }
  };

  const handleCancel = () => {
    // Task 2.7: Cancel button closes modal without changes
    onOpenChange(false);
  };

  // Dynamic button label based on form state (Task 2.6)
  const getSubmitButtonLabel = () => {
    if (isUpdating) return 'Saving...';
    if (isGenerating) return 'Regenerating...';
    if (isDirty) return 'Save & Regenerate';
    return 'Regenerate';
  };

  // Convert lesson to defaultValues format
  const defaultValues = {
    title: lesson.title,
    durationMinutes: lesson.durationMinutes,
    corePractice: lesson.corePractice,
    keyPoint: lesson.keyPoint,
    tone: lesson.tone,
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[600px] backdrop-blur-lg">
        <DialogHeader>
          <DialogTitle>Regenerate Script</DialogTitle>
          <DialogDescription>
            Review and optionally update lesson parameters before regenerating.
          </DialogDescription>
        </DialogHeader>

        {/* Warning Banner (Task 2.5) - WCAG accessible with role="alert" */}
        <div
          role="alert"
          className="flex items-center gap-2 rounded-md bg-amber-500/10 border border-amber-500/30 p-3 text-amber-600 dark:text-amber-400"
        >
          <AlertTriangle className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
          <p className="text-sm">
            This will replace the current script. The current version will be
            saved to history.
          </p>
        </div>

        {/* Reuse LessonForm (Task 2.4) */}
        <LessonForm
          defaultValues={defaultValues}
          onSubmit={handleSubmit}
          onDirtyChange={setIsDirty}
          showDescriptions
          className="space-y-5"
        >
          {/* Dirty form indicator (AC #2) */}
          {isDirty && (
            <p className="text-sm text-amber-500" role="status">
              ⚠️ Unsaved changes. They will be saved before regenerating.
            </p>
          )}

          <DialogFooter className="gap-3 sm:gap-2">
            {/* Cancel button (Task 2.7) */}
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isLoading}
              className="border-[#7dcfff] text-[#7dcfff] hover:bg-[#7dcfff]/10"
            >
              Cancel
            </Button>
            {/* Submit button with dynamic label (Task 2.6) */}
            <Button
              type="submit"
              disabled={isLoading}
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
        </LessonForm>
      </DialogContent>
    </Dialog>
  );
}
