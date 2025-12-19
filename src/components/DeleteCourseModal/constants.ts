/**
 * Generates the confirmation text required to delete a course
 * Pattern: 'delete "[Course Name]"'
 */
export const getConfirmationText = (courseName: string): string =>
  `delete "${courseName}"`;

/**
 * Modal copy strings
 */
export const DELETE_COURSE_MODAL = {
  title: 'Delete Course',
  description: (courseName: string) =>
    `You are about to permanently delete "${courseName}" and all its lessons.`,
  warning: 'This action cannot be undone.',
  confirmationInstruction: 'To confirm, type:',
  inputPlaceholder: 'Type confirmation text...',
  cancelButton: 'Cancel',
  deleteButton: 'Delete Course',
  deletingButton: 'Deleting...',
  copyToast: 'Confirmation text copied',
  successToast: (courseName: string) =>
    `Course "${courseName}" deleted successfully`,
  errorToast: 'Failed to delete course',
} as const;
