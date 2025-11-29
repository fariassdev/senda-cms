# Story 3.4: Delete Lesson

Status: review

## Story

As a **Content Manager**,
I want to delete a lesson I no longer need,
so that I can keep the course clean and organized.

## Acceptance Criteria

1. **Given** I see the lesson list, **When** I click the delete icon (🗑️) on a lesson row, **Then** a confirmation dialog appears with:
   - Title: "Delete Lesson"
   - Message: "Are you sure you want to delete '[lesson title]'?"
   - Warning: "This will permanently delete any generated scripts and audio."
   - Buttons: "Cancel" (outline) and "Delete" (destructive red)

2. **Given** the delete confirmation dialog is open, **When** I click "Delete", **Then**:
   - The lesson is deleted from the backend
   - A success toast shows: "Lesson deleted"
   - The lesson disappears from the list with fade animation
   - The dialog closes automatically

3. **Given** the delete confirmation dialog is open, **When** I click "Cancel" or press Escape, **Then**:
   - The dialog closes
   - No changes are made to the lesson or course

4. **Given** a delete API request fails, **Then**:
   - An error toast shows: "Failed to delete lesson"
   - The lesson remains in the list unchanged
   - The dialog closes

## Tasks / Subtasks

- [x] **Task 1: Create LessonDelete container structure** (AC: #1)
  - [x] 1.1 Create `src/containers/Main/LessonDelete/` directory
  - [x] 1.2 Create `connect.ts` with delete mutation and dialog state logic
  - [x] 1.3 Create `types.ts` with LessonDeleteProps interface
  - [x] 1.4 Create `index.tsx` with AlertDialog confirmation UI

- [x] **Task 2: Implement delete confirmation dialog UI** (AC: #1)
  - [x] 2.1 Use `AlertDialog` components from shadcn/ui
  - [x] 2.2 Display lesson title dynamically in the confirmation message
  - [x] 2.3 Add warning text about permanent deletion of scripts/audio
  - [x] 2.4 Style "Cancel" button as outline variant
  - [x] 2.5 Style "Delete" button as destructive variant (red)

- [x] **Task 3: Implement delete mutation in connect.ts** (AC: #2, #4)
  - [x] 3.1 Implement `$api.useMutation('delete', '/api/courses/{slug}/lessons/{id}')`
  - [x] 3.2 Handle `onSuccess`: invalidate lessons query, show success toast, close dialog
  - [x] 3.3 Handle `onError`: show error toast with message, close dialog
  - [x] 3.4 Pass `courseSlug` and `lesson.id` to mutation params

- [x] **Task 4: Implement dialog dismiss behavior** (AC: #3)
  - [x] 4.1 Wire Cancel button to close dialog via `onOpenChange`
  - [x] 4.2 Ensure Escape key closes dialog (built-in AlertDialog behavior)
  - [x] 4.3 Prevent dialog close while delete is pending (optional: disable buttons)

- [x] **Task 5: Integrate with CourseDetail container** (AC: #1)
  - [x] 5.1 Add delete modal state (`isLessonDeleteOpen`) to CourseDetail connect.ts
  - [x] 5.2 Add `lessonToDelete` state to track selected lesson for deletion
  - [x] 5.3 Create `handleDeleteLesson` callback to open dialog with lesson data
  - [x] 5.4 Create `handleCloseLessonDelete` callback to close dialog and reset state
  - [x] 5.5 Pass `onDelete` handler to LessonList component
  - [x] 5.6 Render LessonDelete dialog in CourseDetail index.tsx

- [n/a] **Task 6: Add fade-out animation for deleted lesson** (AC: #2)
  - [n/a] 6.1 Consider using React Query optimistic update for instant visual feedback
  - [n/a] 6.2 Or implement CSS transition on lesson removal (optional enhancement)

- [x] **Task 7: Testing and validation** (AC: #1-4)
  - [x] 7.1 Run `bun typecheck` - verify no type errors
  - [x] 7.2 Run `bun lint:fix` - verify no lint errors
  - [x] 7.3 Manual test: dialog opens with correct lesson title
  - [x] 7.4 Manual test: clicking Cancel closes dialog without changes
  - [x] 7.5 Manual test: pressing Escape closes dialog without changes
  - [x] 7.6 Manual test: clicking Delete removes lesson and shows toast
  - [x] 7.7 Manual test: lesson list updates after successful deletion

## Dev Notes

### Architecture Patterns and Constraints

This story follows the established **Container Pattern** where:

- `LessonDelete/connect.ts` handles delete mutation logic and loading state
- `LessonDelete/index.tsx` is purely presentational AlertDialog UI
- State management lives in `CourseDetail/connect.ts` (parent orchestration)

**API Integration Pattern** - Use OpenAPI-first approach:

```typescript
// In LessonDelete/connect.ts
const deleteMutation = $api.useMutation(
  'delete',
  '/api/courses/{slug}/lessons/{id}',
  {
    onSuccess: async () => {
      toast.success('Lesson deleted');
      await queryClient.invalidateQueries({
        queryKey: ['get', '/api/courses/{slug}/lessons'],
      });
      onClose();
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to delete lesson');
      onClose();
    },
  },
);
```

**API Endpoint** - From OpenAPI spec:

- **Method**: DELETE
- **Path**: `/api/courses/{slug}/lessons/{id}`
- **Path Parameters**: `slug: string`, `id: number`
- **Response**: 204 No Content on success

[Source: src/types/api.d.ts#delete_lesson_api_courses__slug__lessons__id__delete]

### Component Integration Pattern

The delete flow integrates with existing CourseDetail orchestration:

```typescript
// CourseDetail/connect.ts - Add delete modal state
const [isLessonDeleteOpen, setIsLessonDeleteOpen] = useState(false);
const [lessonToDelete, setLessonToDelete] = useState<Lesson | null>(null);

const handleDeleteLesson = (lesson: Lesson) => {
  setLessonToDelete(lesson);
  setIsLessonDeleteOpen(true);
};

const handleCloseLessonDelete = (open: boolean) => {
  setIsLessonDeleteOpen(open);
  if (!open) {
    setLessonToDelete(null);
  }
};
```

### LessonListItem Integration

The delete button in `LessonListItem` is already wired with `onDelete` callback:

```typescript
// From src/components/LessonListItem.tsx (existing)
<Button
  type="button"
  variant="ghost"
  size="icon"
  className="h-8 w-8 text-destructive hover:text-destructive"
  aria-label={`Delete ${lesson.title}`}
  onClick={() => onDelete?.(lesson)}
  disabled={!onDelete}
>
  <Trash2 className="h-4 w-4" />
</Button>
```

[Source: src/components/LessonListItem.tsx#L66-75]

### shadcn/ui Components to Use

Use AlertDialog for confirmation (already installed):

- `AlertDialog`, `AlertDialogTrigger`, `AlertDialogContent` - Dialog wrapper
- `AlertDialogHeader`, `AlertDialogTitle`, `AlertDialogDescription` - Header content
- `AlertDialogFooter`, `AlertDialogCancel`, `AlertDialogAction` - Footer buttons

**AlertDialog vs Dialog**: Use AlertDialog for confirmations (requires explicit user action, no outside-click dismiss by default).

[Source: docs/architecture.md#UI-Framework-shadcn-ui-Tailwind-CSS]

### UX Pattern Compliance

From UX Design Specification - Delete Confirmations:

- Pattern: Modal dialog
- Content: "Are you sure you want to delete [item name]?"
- Warning: "This action cannot be undone"
- Buttons: "Cancel" (secondary) + "Delete" (destructive primary)

[Source: docs/ux-design-specification.md#Confirmation-Patterns]

### Accessibility Requirements

- AlertDialog traps focus when open
- Escape key closes dialog (built-in)
- Delete button has `aria-label="Delete [lesson title]"` (existing in LessonListItem)
- Destructive button styled with high contrast red (#f7768e)
- Screen reader announces dialog content via proper heading structure

[Source: docs/ux-design-specification.md#Accessibility-Patterns]

### Learnings from Previous Story

**From Story 3-3-edit-existing-lesson (Status: review)**

- **LessonEdit Container**: Created at `src/containers/Main/LessonEdit/` - Follow same structure for LessonDelete (connect.ts, index.tsx, types.ts)
- **AlertDialog Pattern**: Installed and used for unsaved changes confirmation - **REUSE** same pattern for delete confirmation
- **CourseDetail State Management**: `selectedLesson` state pattern for edit modal - **FOLLOW** same approach for `lessonToDelete`
- **Modal State Handlers**: `handleCloseLessonEdit(open: boolean)` pattern - **FOLLOW** same for delete modal
- **Cache Invalidation**: Invalidate `['get', '/api/courses/{slug}/lessons']` on success - **USE SAME** pattern

**Key Files Created in 3.3:**

- `src/containers/Main/LessonEdit/connect.ts` - Form setup and mutation pattern
- `src/containers/Main/LessonEdit/index.tsx` - Modal UI with AlertDialog for confirmation
- Modified `src/containers/Main/CourseDetail/connect.ts` - Added edit modal state

[Source: docs/sprint-artifacts/3-3-edit-existing-lesson.md#Dev-Agent-Record]

### Project Structure Notes

Files to create:

- `src/containers/Main/LessonDelete/index.tsx` - AlertDialog confirmation component
- `src/containers/Main/LessonDelete/connect.ts` - Delete mutation logic
- `src/containers/Main/LessonDelete/types.ts` - LessonDeleteProps interface

Files to modify:

- `src/containers/Main/CourseDetail/connect.ts` - Add delete modal state and handlers
- `src/containers/Main/CourseDetail/index.tsx` - Add LessonDelete dialog render

### Error Handling

Per project patterns, errors are handled via:

1. `onError` callback in mutation shows toast with error message
2. Dialog closes after error to allow user to retry
3. Original lesson data remains unchanged in the list

[Source: docs/architecture.md#Error-Handling-Strategy]

### Testing Strategy

Per project testing standards:

- Verify dialog displays correct lesson title
- Test Cancel button closes without side effects
- Test Escape key closes without side effects
- Test successful deletion removes lesson from list
- Test failed deletion shows error toast and preserves lesson
- Verify keyboard navigation works (Tab through buttons, Enter to activate)

[Source: docs/architecture.md#Consistency-Patterns]

### References

- [Source: docs/epics.md#Story-3.4] - Story requirements and acceptance criteria
- [Source: docs/architecture.md#Container-Pattern] - Container pattern implementation
- [Source: docs/architecture.md#API-Architecture-OpenAPI-First] - API integration approach
- [Source: docs/ux-design-specification.md#Confirmation-Patterns] - Confirmation dialog patterns
- [Source: docs/ux-design-specification.md#Accessibility-Patterns] - Accessibility requirements
- [Source: docs/sprint-artifacts/3-3-edit-existing-lesson.md#Dev-Agent-Record] - Previous story patterns
- [Source: src/types/api.d.ts#delete_lesson] - Delete endpoint specification
- [Source: src/components/LessonListItem.tsx] - Existing onDelete callback integration

## Dev Agent Record

### Context Reference

- `docs/sprint-artifacts/3-4-delete-lesson.context.xml`

### Agent Model Used

Claude Opus 4.5 (Preview)

### Debug Log References

### Completion Notes List

### File List

---

## Change Log

| Date       | Author         | Change                                        |
| ---------- | -------------- | --------------------------------------------- |
| 2025-11-29 | SM Agent (Bob) | Initial story creation from Epic 3, Story 3.4 |
