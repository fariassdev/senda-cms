'use client';

import { Loader2 } from 'lucide-react';

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
  const { isDirty, setIsDirty } = useConnect();

  const isLoading = isGenerating || isUpdating;

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
    if (isGenerating) return 'Generating...';
    if (isDirty) return 'Save & Generate';
    return 'Generate';
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
          <DialogTitle>Review Lesson & Generate Script</DialogTitle>
          <DialogDescription>
            Review the lesson details before generating. Any changes will be
            saved automatically.
          </DialogDescription>
        </DialogHeader>

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
              ⚠️ You have unsaved changes. They will be saved before generating.
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
