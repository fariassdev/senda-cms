# Story 2.7: Delete Course with Confirmation Modal

Status: in-progress

## Story

As a **Content Manager (Admin)**,
I want to delete a course I no longer need with a confirmation modal that requires typing an explicit confirmation text,
So that I can remove unwanted courses while being protected from accidental deletion.

## Acceptance Criteria

1. **Given** I see the course list (both table row on desktop and card on mobile), **When** I click the delete action on a course, **Then** a confirmation modal appears with:
   - Title: "Delete Course"
   - Warning icon (destructive/red)
   - Message: "You are about to permanently delete **[Course Name]** and all its lessons."
   - Secondary warning: "This action cannot be undone."
   - Confirmation instruction: "To confirm, type: `delete [Course Name]`"
   - Copy button next to the confirmation text to copy it to clipboard
   - Input field for typing the confirmation text
   - Buttons: "Cancel" (outline) and "Delete Course" (destructive red, disabled until text matches)

2. **Given** I am on the Course Details page, **When** I click the Delete Course action, **Then** the same confirmation modal from AC#1 appears.

3. **Given** the delete confirmation modal is open, **When** I type the exact confirmation text (case-insensitive), **Then**:
   - The "Delete Course" button becomes enabled
   - The input field shows a visual success indicator (green checkmark)

4. **Given** I type an incorrect confirmation text, **Then**:
   - The "Delete Course" button remains disabled
   - No error message shown (just button remains disabled)

5. **Given** I click the copy button next to the confirmation text, **Then**:
   - The text "delete [Course Name]" is copied to clipboard
   - Toast feedback: "Confirmation text copied"
   - The copy icon briefly changes to a checkmark

6. **Given** the confirmation text matches and I click "Delete Course", **Then**:
   - The button shows loading spinner with "Deleting..."
   - The course is deleted from the backend (hard delete, cascades to lessons)
   - Success toast: "Course '[Course Name]' deleted successfully"
   - The modal closes automatically
   - **If on Course List**: Course disappears from the list
   - **If on Course Details**: User is redirected to `/courses`

7. **Given** the delete API request fails, **Then**:
   - An error toast shows: "Failed to delete course"
   - The modal remains open (allows retry)
   - The input field is not cleared
   - The "Delete Course" button is re-enabled

8. **Given** the delete confirmation modal is open, **When** I click "Cancel", press Escape, or click outside the modal, **Then**:
   - The modal closes
   - No changes are made
   - The input field is reset on next open

## Tasks / Subtasks

- [x] **Task 1: Create DeleteCourseModal component structure** (AC: #1)
  - [x] 1.1 Create `src/components/DeleteCourseModal/` directory
  - [x] 1.2 Create `types.ts` with DeleteCourseModalProps interface
  - [x] 1.3 Create `constants.ts` with confirmation text template
  - [x] 1.4 Create `connect.ts` with state logic (input value, validation, copy to clipboard)
  - [x] 1.5 Create `index.tsx` with AlertDialog UI

- [x] **Task 2: Implement confirmation modal UI** (AC: #1, #3, #4)
  - [x] 2.1 Use `AlertDialog` components from shadcn/ui
  - [x] 2.2 Add destructive warning icon and styling
  - [x] 2.3 Display course name dynamically in confirmation message
  - [x] 2.4 Create confirmation text display with copy button
  - [x] 2.5 Add input field for confirmation text
  - [x] 2.6 Implement text validation (case-insensitive match)
  - [x] 2.7 Show visual success indicator when text matches
  - [x] 2.8 Style "Cancel" button as outline variant
  - [x] 2.9 Style "Delete Course" button as destructive variant (disabled when text doesn't match)

- [x] **Task 3: Implement copy to clipboard functionality** (AC: #5)
  - [x] 3.1 Add copy button with Copy icon from lucide-react
  - [x] 3.2 Implement clipboard copy using `navigator.clipboard.writeText()`
  - [x] 3.3 Show toast on successful copy
  - [x] 3.4 Toggle icon to checkmark briefly after copy (2 seconds)

- [x] **Task 4: Implement delete mutation in connect.ts** (AC: #6, #7)
  - [x] 4.1 Use existing `useCourseActions.deleteCourse(slug)` hook
  - [x] 4.2 Handle loading state (button disabled + spinner)
  - [x] 4.3 Handle `onSuccess`: show toast, close modal, redirect if on CourseDetails
  - [x] 4.4 Handle `onError`: show error toast, keep modal open

- [x] **Task 5: Add delete action to CourseRow component** (AC: #1)
  - [x] 5.1 Modify `src/containers/Main/CourseList/CourseRow/index.tsx`
  - [x] 5.2 Add direct Delete icon button (Trash2) next to existing View button
  - [x] 5.3 Style delete button as ghost variant with destructive hover color
  - [x] 5.4 Pass `onDelete` callback with course data

- [x] **Task 6: Add delete action to CourseCard component** (AC: #1)
  - [x] 6.1 Modify `src/containers/Main/CourseList/CourseCard/index.tsx`
  - [x] 6.2 Add Delete icon button in card header (top-right corner)
  - [x] 6.3 Style as small ghost button with destructive hover
  - [x] 6.4 Pass `onDelete` callback with course data

- [x] **Task 7: Integrate with CourseList container** (AC: #1)
  - [x] 7.1 Add modal state to CourseList connect.ts (isDeleteOpen, courseToDelete)
  - [x] 7.2 Create handlers for opening/closing delete modal
  - [x] 7.3 Pass onDelete handler to CourseRow and CourseCard
  - [x] 7.4 Render DeleteCourseModal in CourseList index.tsx

- [x] **Task 8: Add delete action to CourseDetail page** (AC: #2)
  - [x] 8.1 Add "Delete Course" button in CourseDetail header (destructive style)
  - [x] 8.2 Add modal state to CourseDetail connect.ts
  - [x] 8.3 Render DeleteCourseModal in CourseDetail index.tsx
  - [x] 8.4 Implement redirect to `/courses` on successful deletion

- [x] **Task 9: Implement modal dismiss behavior** (AC: #8)
  - [x] 9.1 Wire Cancel button to close modal
  - [x] 9.2 Ensure Escape key closes modal (AlertDialog built-in)
  - [x] 9.3 Reset input field state when modal closes
  - [x] 9.4 Prevent modal close while delete is pending

- [ ] **Task 10: Testing and validation** (AC: #1-8)
  - [x] 10.1 Run `bun typecheck` - verify no type errors
  - [x] 10.2 Run `bun lint:fix` - verify no lint errors
  - [ ] 10.3 Manual test: delete from CourseRow (desktop)
  - [ ] 10.4 Manual test: delete from CourseCard (mobile)
  - [ ] 10.5 Manual test: delete from CourseDetail page
  - [ ] 10.6 Manual test: copy confirmation text works
  - [ ] 10.7 Manual test: incorrect text keeps button disabled
  - [ ] 10.8 Manual test: correct text enables button
  - [ ] 10.9 Manual test: Cancel/Escape closes without changes
  - [ ] 10.10 Manual test: successful deletion removes course and shows toast
  - [ ] 10.11 Manual test: deletion from CourseDetail redirects to /courses

## Dev Notes

### Architecture Patterns and Constraints

This story follows the established **Container Pattern** where:

- `DeleteCourseModal/connect.ts` handles validation logic, clipboard, and loading state
- `DeleteCourseModal/index.tsx` is purely presentational AlertDialog UI
- State management lives in parent components (CourseList, CourseDetail)

**API Integration** - Uses existing hook:

```typescript
// Already exists in src/hooks/useCourseActions.ts
const { deleteCourse, loadingDeleteCourse } = useCourseActions();

// Usage
await deleteCourse(courseSlug);
```

**API Endpoint** - From OpenAPI spec:

- **Method**: DELETE
- **Path**: `/api/courses/{slug}`
- **Path Parameters**: `slug: string`
- **Response**: 204 No Content on success
- **Behavior**: Hard delete with cascade (lessons deleted automatically)

[Source: src/hooks/useCourseActions.ts#L82-91]

### Component Integration Pattern

The delete modal is used in two locations:

**1. CourseList Container:**

```typescript
// CourseList/connect.ts
const [isDeleteOpen, setIsDeleteOpen] = useState(false);
const [courseToDelete, setCourseToDelete] = useState<Course | null>(null);

const handleDeleteCourse = (course: Course) => {
  setCourseToDelete(course);
  setIsDeleteOpen(true);
};

const handleCloseDelete = (open: boolean) => {
  setIsDeleteOpen(open);
  if (!open) {
    setCourseToDelete(null);
  }
};
```

**2. CourseDetail Container:**

```typescript
// CourseDetail/connect.ts
const [isDeleteCourseOpen, setIsDeleteCourseOpen] = useState(false);
const router = useRouter();

const handleDeleteSuccess = () => {
  router.push('/courses');
};
```

### Confirmation Text Pattern

The confirmation text follows the pattern `delete [Course Name]` (case-insensitive):

```typescript
// constants.ts
export const getConfirmationText = (courseName: string) =>
  `delete ${courseName}`;

// connect.ts
const expectedText = getConfirmationText(course.title).toLowerCase();
const isValid = inputValue.toLowerCase() === expectedText;
```

### Copy to Clipboard Pattern

```typescript
const handleCopyConfirmation = async () => {
  const text = getConfirmationText(course.title);
  await navigator.clipboard.writeText(text);
  toast.success('Confirmation text copied');
  setIsCopied(true);
  setTimeout(() => setIsCopied(false), 2000);
};
```

### shadcn/ui Components to Use

- `AlertDialog`, `AlertDialogContent`, `AlertDialogHeader`, `AlertDialogFooter` - Modal wrapper
- `AlertDialogTitle`, `AlertDialogDescription` - Header content
- `AlertDialogCancel`, `AlertDialogAction` - Footer buttons
- `Input` - Confirmation text input
- `Button` - Copy button
  **AlertDialog vs Dialog**: Use AlertDialog for confirmations (requires explicit user action).

**Direct Buttons Pattern**: Use direct icon buttons instead of dropdown menus for actions:

- View button: Eye icon or "View" text (ghost variant)
- Delete button: Trash2 icon (ghost variant, destructive hover color)

### UX Pattern Compliance

From UX Design Specification - Destructive Confirmations:

- Pattern: Modal with explicit confirmation text
- Content: Clear warning about irreversible action
- Protection: Require typing confirmation to prevent accidents
- Buttons: "Cancel" (secondary) + "Delete" (destructive primary, initially disabled)

### Accessibility Requirements

- AlertDialog traps focus when open
- Escape key closes dialog (built-in)
- Delete button has proper aria-label
- Input field has associated label
- Destructive button styled with high contrast red
- Screen reader announces dialog content

### Learnings from Previous Story (3.4: Delete Lesson)

**From Story 3-4-delete-lesson (Status: done)**

- **AlertDialog Pattern**: Used successfully for confirmation - extend with text input requirement
- **Container Pattern**: `connect.ts` + `index.tsx` structure - follow same approach
- **State Management**: Modal state in parent container - follow same pattern
- **Cache Invalidation**: Invalidate `['get', '/api/courses']` on success
- **Error Handling**: Show toast.error, keep modal open for retry

**Key Difference from Delete Lesson:**

- Delete Course requires typing confirmation text (higher protection level)
- Added copy-to-clipboard functionality for convenience
- Redirect behavior when deleting from Course Details page

[Source: docs/sprint-artifacts/3-4-delete-lesson.md]

### Project Structure Notes

**Files to create:**

- `src/components/DeleteCourseModal/index.tsx` - AlertDialog confirmation component
- `src/components/DeleteCourseModal/connect.ts` - Validation and clipboard logic
- `src/components/DeleteCourseModal/types.ts` - DeleteCourseModalProps interface
- `src/components/DeleteCourseModal/constants.ts` - Confirmation text template

**Files to modify:**

- `src/containers/Main/CourseList/CourseRow/index.tsx` - Add delete action
- `src/containers/Main/CourseList/CourseRow/types.ts` - Add onDelete prop
- `src/containers/Main/CourseList/CourseCard/index.tsx` - Add delete action
- `src/containers/Main/CourseList/CourseCard/types.ts` - Add onDelete prop
- `src/containers/Main/CourseList/connect.ts` - Add delete modal state
- `src/containers/Main/CourseList/index.tsx` - Render DeleteCourseModal
- `src/containers/Main/CourseDetail/connect.ts` - Add delete course state and redirect
- `src/containers/Main/CourseDetail/index.tsx` - Add delete button and render modal

### Error Handling

Per project patterns, errors are handled via:

1. `onError` callback shows toast with error message
2. Modal stays open to allow user to retry
3. Input field is not cleared (user doesn't need to re-type)

[Source: docs/architecture.md#Error-Handling-Strategy]

### Testing Strategy

Per project testing standards:

- Verify modal displays correct course name in title and confirmation text
- Test copy to clipboard functionality
- Test that incorrect text keeps delete button disabled
- Test that correct text (case-insensitive) enables delete button
- Test Cancel button closes without side effects
- Test Escape key closes without side effects
- Test successful deletion removes course from list
- Test deletion from CourseDetail redirects to /courses
- Test failed deletion shows error toast and preserves modal state
- Verify keyboard navigation works

[Source: docs/architecture.md#Consistency-Patterns]

### References

- [Source: src/hooks/useCourseActions.ts] - Existing deleteCourse mutation
- [Source: docs/sprint-artifacts/3-4-delete-lesson.md] - Delete pattern reference
- [Source: docs/architecture.md#Container-Pattern] - Container pattern implementation
- [Source: docs/ux-design-specification.md#Confirmation-Patterns] - Confirmation dialog patterns

## Dev Agent Record

### Context Reference

- Story 3.4 (Delete Lesson) used as pattern reference

### Agent Model Used

- Gemini 2.5 Flash

### Debug Log References

- No issues encountered

### Completion Notes List

- Created `DeleteCourseModal` component following Container Pattern (connect.ts + index.tsx + types.ts + constants.ts)
- Modal uses AlertDialog with confirmation text input, copy-to-clipboard, and validation
- Integrated with CourseList (table row + card) and CourseDetail page
- Delete button added as direct icon button (Trash2) - no dropdown menu as per user preference
- Redirect to `/courses` on successful deletion from CourseDetail
- All typecheck and lint validations passed

### File List

**Created:**

- `src/components/DeleteCourseModal/types.ts`
- `src/components/DeleteCourseModal/constants.ts`
- `src/components/DeleteCourseModal/connect.ts`
- `src/components/DeleteCourseModal/index.tsx`

**Modified:**

- `src/containers/Main/CourseList/CourseRow/types.ts`
- `src/containers/Main/CourseList/CourseRow/index.tsx`
- `src/containers/Main/CourseList/CourseCard/types.ts`
- `src/containers/Main/CourseList/CourseCard/index.tsx`
- `src/containers/Main/CourseList/connect.ts`
- `src/containers/Main/CourseList/index.tsx`
- `src/containers/Main/CourseDetail/connect.ts`
- `src/containers/Main/CourseDetail/index.tsx`
- `docs/sprint-artifacts/sprint-status.yaml`

---

## Change Log

| Date       | Author             | Change                                             |
| ---------- | ------------------ | -------------------------------------------------- |
| 2025-12-19 | PM Agent (John)    | Initial story creation                             |
| 2025-12-19 | Dev Agent (Amelia) | Implementation complete - ready for manual testing |
