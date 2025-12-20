import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';

import useCourseActions from '@/hooks/useCourseActions';

import { DELETE_COURSE_MODAL, getConfirmationText } from './constants';
import type { DeleteCourseModalProps } from './types';

const useConnect = ({
  course,
  open,
  onOpenChange,
  onSuccess,
}: DeleteCourseModalProps) => {
  const [inputValue, setInputValue] = useState('');
  const [isCopied, setIsCopied] = useState(false);

  const { deleteCourse, loadingDeleteCourse } = useCourseActions();

  // Reset input when modal closes
  useEffect(() => {
    if (!open) {
      setInputValue('');
      setIsCopied(false);
    }
  }, [open]);

  const confirmationText = course ? getConfirmationText(course.title) : '';

  const isValid =
    inputValue.toLowerCase() === confirmationText.toLowerCase() &&
    inputValue.length > 0;

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setInputValue(e.target.value);
    },
    [],
  );

  const handleCopyConfirmation = useCallback(async () => {
    if (!confirmationText) return;

    try {
      await navigator.clipboard.writeText(confirmationText);
      toast.success(DELETE_COURSE_MODAL.copyToast);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch {
      // Fallback for browsers without clipboard API
      toast.error('Failed to copy to clipboard');
    }
  }, [confirmationText]);

  const handleDelete = useCallback(async () => {
    if (!course || !isValid) return;

    try {
      await deleteCourse(course.slug);
      toast.success(DELETE_COURSE_MODAL.successToast(course.title));
      onOpenChange(false);
      onSuccess?.();
    } catch {
      toast.error(DELETE_COURSE_MODAL.errorToast);
      // Modal stays open for retry - input not cleared
    }
  }, [course, isValid, deleteCourse, onOpenChange, onSuccess]);

  const handleCancel = useCallback(() => {
    if (!loadingDeleteCourse) {
      onOpenChange(false);
    }
  }, [loadingDeleteCourse, onOpenChange]);

  return {
    inputValue,
    confirmationText,
    isValid,
    isCopied,
    isDeleting: loadingDeleteCourse,
    handleInputChange,
    handleCopyConfirmation,
    handleDelete,
    handleCancel,
  };
};

export default useConnect;
