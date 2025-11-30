// Keyboard accessibility announcements for screen readers
export const ANNOUNCEMENTS = {
  onDragStart: (title: string) =>
    `Picked up lesson "${title}". Use arrow keys to move, Enter to drop, Escape to cancel.`,
  onDragOver: (title: string, position: number) =>
    `Lesson "${title}" is over position ${position}.`,
  onDragEnd: (title: string, position: number) =>
    `Lesson "${title}" was dropped at position ${position}.`,
  onDragCancel: (title: string) =>
    `Dragging cancelled. Lesson "${title}" was returned to its original position.`,
};

// Drag activation constraints
export const POINTER_SENSOR_OPTIONS = {
  activationConstraint: {
    distance: 8, // 8px drag threshold before activation
  },
};

// Toast messages
export const TOAST_MESSAGES = {
  success: 'Order saved',
  error: 'Failed to update order. Please try again.',
};
