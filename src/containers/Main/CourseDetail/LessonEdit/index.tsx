'use client';

import { Loader2, Pencil } from 'lucide-react';
import { useMemo } from 'react';

import { LessonForm, type LessonFormData } from '@/components/LessonForm';
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
import type { LessonEditProps } from './types';

export default function LessonEdit({
  courseSlug,
  lesson,
  open,
  onOpenChange,
  onSuccess,
}: LessonEditProps) {
  const {
    onSubmit,
    isLoading,
    showDiscardDialog,
    handleClose,
    handleConfirmDiscard,
    handleCancelDiscard,
    setIsDirty,
  } = useConnect({ courseSlug, lesson, onOpenChange, onSuccess });

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      handleClose();
    } else {
      onOpenChange(newOpen);
    }
  };

  const handleFormSubmit = async (data: LessonFormData) => {
    await onSubmit(data);
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

  return (
    <>
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Pencil className="h-5 w-5" />
              Edit Lesson
            </DialogTitle>
            <DialogDescription>
              Update the lesson details below.
            </DialogDescription>
          </DialogHeader>

          <LessonForm
            defaultValues={defaultValues}
            onSubmit={handleFormSubmit}
            onDirtyChange={setIsDirty}
            autoFocusTitle
            id="edit-lesson"
          >
            <DialogFooter className="gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Pencil className="mr-2 h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </DialogFooter>
          </LessonForm>
        </DialogContent>
      </Dialog>

      {/* Discard Changes Confirmation Dialog */}
      <AlertDialog open={showDiscardDialog} onOpenChange={handleCancelDiscard}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Discard changes?</AlertDialogTitle>
            <AlertDialogDescription>
              You have unsaved changes. Are you sure you want to discard them?
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancelDiscard}>
              Keep Editing
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDiscard}
              className="bg-destructive hover:bg-destructive/90"
            >
              Discard Changes
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
