'use client';

import {
  AlertTriangleIcon,
  CheckIcon,
  CopyIcon,
  Loader2Icon,
} from 'lucide-react';

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
import { Input } from '@/components/ui/input';

import useConnect from './connect';
import { DELETE_COURSE_MODAL } from './constants';
import type { DeleteCourseModalProps } from './types';

/**
 * DeleteCourseModal - Confirmation modal for deleting a course
 * Requires typing explicit confirmation text as protection against accidental deletion
 */
export function DeleteCourseModal(props: DeleteCourseModalProps) {
  const { course, open, onOpenChange } = props;

  const {
    inputValue,
    confirmationText,
    isValid,
    isCopied,
    isDeleting,
    handleInputChange,
    handleCopyConfirmation,
    handleDelete,
    handleCancel,
  } = useConnect(props);

  if (!course) return null;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="sm:max-w-[425px]">
        <AlertDialogHeader>
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10">
              <AlertTriangleIcon className="h-5 w-5 text-destructive" />
            </div>
            <AlertDialogTitle>{DELETE_COURSE_MODAL.title}</AlertDialogTitle>
          </div>
          <AlertDialogDescription className="pt-2">
            <span
              dangerouslySetInnerHTML={{
                __html: DELETE_COURSE_MODAL.description(course.title),
              }}
            />
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="space-y-4 py-4">
          {/* Warning */}
          <p className="text-sm font-medium text-destructive">
            {DELETE_COURSE_MODAL.warning}
          </p>

          {/* Confirmation instruction */}
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              {DELETE_COURSE_MODAL.confirmationInstruction}
            </p>

            {/* Confirmation text with copy button */}
            <div className="flex items-center gap-2 rounded-md bg-muted p-2">
              <code className="flex-1 text-sm font-mono">
                {confirmationText}
              </code>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8 shrink-0"
                onClick={handleCopyConfirmation}
                aria-label="Copy confirmation text"
              >
                {isCopied ? (
                  <CheckIcon className="h-4 w-4 text-green-500" />
                ) : (
                  <CopyIcon className="h-4 w-4" />
                )}
              </Button>
            </div>

            {/* Input field */}
            <div className="relative">
              <Input
                value={inputValue}
                onChange={handleInputChange}
                placeholder={DELETE_COURSE_MODAL.inputPlaceholder}
                disabled={isDeleting}
                className={`pr-8 ${
                  isValid ? 'border-green-500 focus-visible:ring-green-500' : ''
                }`}
                aria-label="Confirmation text"
              />
              {isValid && (
                <CheckIcon className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-green-500" />
              )}
            </div>
          </div>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleCancel} disabled={isDeleting}>
            {DELETE_COURSE_MODAL.cancelButton}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={!isValid || isDeleting}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isDeleting ? (
              <>
                <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                {DELETE_COURSE_MODAL.deletingButton}
              </>
            ) : (
              DELETE_COURSE_MODAL.deleteButton
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default DeleteCourseModal;
