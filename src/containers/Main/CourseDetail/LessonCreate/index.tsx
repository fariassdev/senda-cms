'use client';

import { Loader2, Plus } from 'lucide-react';

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
import type { LessonCreateProps } from './types';

export default function LessonCreate({
  courseSlug,
  nextLessonNumber,
  open,
  onOpenChange,
  onSuccess,
}: LessonCreateProps) {
  const {
    onSubmit,
    isLoading,
    showDiscardDialog,
    handleClose,
    handleConfirmDiscard,
    handleCancelDiscard,
    setIsDirty,
  } = useConnect({ courseSlug, nextLessonNumber, onOpenChange, onSuccess });

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

  return (
    <>
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Create New Lesson
            </DialogTitle>
            <DialogDescription>
              Add a new lesson to this course. Fill in the details below.
            </DialogDescription>
          </DialogHeader>

          <LessonForm
            onSubmit={handleFormSubmit}
            onDirtyChange={setIsDirty}
            autoFocusTitle
            id="create-lesson"
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
              <Button
                type="submit"
                disabled={isLoading}
                className="bg-cyan-600 hover:bg-cyan-700"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Lesson
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
