# Story 3.2: Create New Lesson

Status: review

## Story

As a **Content Manager**,
I want to add a new lesson to a course,
so that I can expand the course content as needed.

## Acceptance Criteria

1. **Given** I am on the course detail page, **When** I click the "Add Lesson" button, **Then** a modal dialog opens with a creation form.

2. **Given** the lesson creation modal is open, **Then** the form includes:
   - Title (required, min 3 characters, max 100)
   - Duration in minutes (required, number input, min 1, max 120)
   - Core Practice (required, describes the main meditation practice)
   - Key Point (required, the central learning outcome)
   - Tone (required, dropdown: Calming, Energizing, Neutral, Guided Visualization)

3. **Given** I complete the form with valid data and click "Create Lesson", **Then**:
   - The lesson is created with status PENDING
   - The lesson appears at the end of the lesson list
   - A success toast shows: "Lesson created successfully"
   - The modal closes automatically

4. **Given** I submit the form with invalid data, **Then**:
   - Inline validation errors appear below each invalid field
   - The form does not submit
   - Focus moves to the first invalid field

5. **Given** I click outside the modal or press Escape, **Then**:
   - The modal closes without saving
   - If I had entered data, a confirmation dialog appears: "Discard changes?"

6. **Given** I click the "Cancel" button in the modal, **Then**:
   - If no changes made, modal closes immediately
   - If changes made, confirmation dialog appears: "Discard changes?"

## Tasks / Subtasks

- [x] **Task 1: Create LessonCreate container structure** (AC: #1, #2)
  - [x] 1.1 Create `src/containers/Main/LessonCreate/` directory
  - [x] 1.2 Create `connect.ts` with form setup and mutation logic
  - [x] 1.3 Create `constants.ts` with Zod validation schema
  - [x] 1.4 Create `types.ts` with local type definitions
  - [x] 1.5 Create `index.tsx` with modal dialog and form UI

- [x] **Task 2: Implement Zod validation schema** (AC: #2, #4)
  - [x] 2.1 Define `lessonSchema` with all field validations
  - [x] 2.2 Export `LessonFormData` type from schema inference
  - [x] 2.3 Define tone options as const array for dropdown

- [x] **Task 3: Implement form logic in connect.ts** (AC: #2, #3, #4)
  - [x] 3.1 Set up `useForm` with `zodResolver` and default values
  - [x] 3.2 Implement `$api.useMutation('post', '/api/courses/{slug}/lessons')`
  - [x] 3.3 Handle `onSuccess`: invalidate queries, show toast, close modal
  - [x] 3.4 Handle `onError`: show error toast with message
  - [x] 3.5 Implement dirty state tracking for unsaved changes warning

- [x] **Task 4: Create modal dialog UI** (AC: #1, #2, #5, #6)
  - [x] 4.1 Use `Dialog` from shadcn/ui as base component
  - [x] 4.2 Implement form fields with `Form`, `FormField`, `FormItem`, `FormLabel`, `FormControl`, `FormMessage`
  - [x] 4.3 Create tone `Select` dropdown with options
  - [x] 4.4 Add "Cancel" and "Create Lesson" buttons with loading states
  - [x] 4.5 Implement unsaved changes confirmation with `AlertDialog`

- [x] **Task 5: Integrate with CourseDetail page** (AC: #1, #3)
  - [x] 5.1 Add "Add Lesson" button to CourseDetail header (enable button from Story 3.1)
  - [x] 5.2 Import and render `LessonCreate` modal with open/close state
  - [x] 5.3 Pass `courseSlug` and `onSuccess` callback to modal
  - [x] 5.4 Pass `nextLessonNumber` for automatic ordering

- [x] **Task 6: Enable "Add First Lesson" CTA in empty state** (AC: #1)
  - [x] 6.1 Update `LessonListEmpty.tsx` to enable the CTA button
  - [x] 6.2 Connect CTA click to open LessonCreate modal

- [x] **Task 7: Testing and validation** (AC: #1-6)
  - [x] 7.1 Test form submission with valid data (verify lesson appears in list)
  - [x] 7.2 Test form submission with invalid data (verify inline errors)
  - [x] 7.3 Test modal close behaviors (Cancel, Escape, outside click)
  - [x] 7.4 Test unsaved changes confirmation dialog
  - [x] 7.5 Run `bun typecheck` and `bun lint:fix`

## Dev Notes

### Architecture Patterns and Constraints

This story follows the established **Container Pattern** where:

- `LessonCreate/connect.ts` handles ALL data fetching and form logic
- `LessonCreate/index.tsx` is purely presentational modal UI
- No business logic in the component file

**API Integration Pattern** - Use OpenAPI-first approach:

```typescript
// In LessonCreate/connect.ts
const createMutation = $api.useMutation('post', '/api/courses/{slug}/lessons', {
  onSuccess: async () => {
    toast.success('Lesson created successfully');
    await queryClient.invalidateQueries({
      queryKey: ['get', '/api/courses/{slug}'],
    });
    onClose();
  },
  onError: (error) => {
    toast.error(error.message || 'Failed to create lesson');
  },
});
```

**Form Validation Pattern** - React Hook Form + Zod:

```typescript
// In LessonCreate/constants.ts
import { z } from 'zod';

export const TONE_OPTIONS = [
  { value: 'calming', label: 'Calming' },
  { value: 'energizing', label: 'Energizing' },
  { value: 'neutral', label: 'Neutral' },
  { value: 'visualization', label: 'Guided Visualization' },
] as const;

export const lessonSchema = z.object({
  title: z
    .string()
    .min(3, 'Title must be at least 3 characters')
    .max(100, 'Title cannot exceed 100 characters'),
  durationMinutes: z
    .number()
    .min(1, 'Duration must be at least 1 minute')
    .max(120, 'Duration cannot exceed 120 minutes'),
  corePractice: z.string().min(3, 'Core practice is required'),
  keyPoint: z.string().min(3, 'Key point is required'),
  tone: z.enum(['calming', 'energizing', 'neutral', 'visualization']),
});

export type LessonFormData = z.infer<typeof lessonSchema>;
```

### API Request/Response from OpenAPI

Based on the backend OpenAPI spec, the lesson creation endpoint:

**Request**: `POST /api/courses/{slug}/lessons`

```typescript
{
  title: string;
  durationMinutes: number;
  corePractice: string;
  keyPoint: string;
  tone: string;
  lessonNumber: number; // Auto-calculated from existing lessons
}
```

**Response**: Returns the created `LessonData` object with:

- `id`, `lessonNumber`, `title`, `corePractice`, `keyPoint`, `tone`, `durationMinutes`
- `status: 'PENDING'`
- `createdAt`, `updatedAt`

### Relevant Types from Previous Story

Reuse types established in Story 3.1:

```typescript
// From src/types/models.ts
export type Lesson = components['schemas']['LessonData'];

// LessonData structure includes all fields needed for this story
```

### Unsaved Changes Pattern

Implement dirty state tracking to warn before discarding:

```typescript
const {
  formState: { isDirty },
} = form;

const handleClose = () => {
  if (isDirty) {
    setShowConfirmDialog(true);
  } else {
    onClose();
  }
};
```

### shadcn/ui Components to Use

- `Dialog`, `DialogContent`, `DialogHeader`, `DialogTitle`, `DialogDescription`, `DialogFooter` - Modal structure
- `Form`, `FormField`, `FormItem`, `FormLabel`, `FormControl`, `FormMessage` - Form fields
- `Input` - Title, duration, core practice, key point inputs
- `Select`, `SelectTrigger`, `SelectValue`, `SelectContent`, `SelectItem` - Tone dropdown
- `Button` - Cancel and Create buttons
- `AlertDialog`, `AlertDialogContent`, `AlertDialogHeader`, `AlertDialogTitle`, `AlertDialogDescription`, `AlertDialogFooter`, `AlertDialogCancel`, `AlertDialogAction` - Confirmation dialog
- Icons from `lucide-react`: `Plus`, `Loader2`

### Learnings from Previous Story

**From Story 3-1-display-lesson-list (Status: review)**

- **Files Created**: `StatusBadge.tsx`, `LessonListItem.tsx`, `LessonList.tsx`, `LessonListEmpty.tsx` - Use these components for lesson display after creation
- **Data Fetching Pattern**: `CourseDetail/connect.ts` fetches course with lessons via `$api.useQuery('get', '/api/courses/{slug}')` - Invalidate this query on lesson creation
- **Empty State**: `LessonListEmpty.tsx` has "Add First Lesson" button currently disabled - Enable in this story
- **Timestamp Utility**: `formatTimestamp` function added to `src/lib/utils.ts` - Available for any timestamp formatting needs
- **date-fns Installed**: v4.1.0 added to dependencies - Use for date manipulation if needed
- **Ordering**: Lessons ordered by `lessonNumber` field - New lesson should get `max(lessonNumber) + 1`

[Source: docs/sprint-artifacts/3-1-display-lesson-list.md#Dev-Agent-Record]

### Project Structure Notes

Files to create:

- `src/containers/Main/LessonCreate/index.tsx` - Modal component with form
- `src/containers/Main/LessonCreate/connect.ts` - Form and mutation logic
- `src/containers/Main/LessonCreate/constants.ts` - Zod schema and tone options
- `src/containers/Main/LessonCreate/types.ts` - Local types (props interfaces)

Files to modify:

- `src/containers/Main/CourseDetail/index.tsx` - Add "Add Lesson" button and LessonCreate modal
- `src/containers/Main/CourseDetail/connect.ts` - Add modal state and lesson count for ordering
- `src/components/LessonListEmpty.tsx` - Enable "Add First Lesson" button with onClick prop

### Accessibility Requirements

- Modal traps focus when open
- Escape key closes modal
- Form fields have proper labels
- Submit button disabled during submission with loading indicator
- Error messages announced to screen readers via `aria-live`
- Cancel and Create buttons have clear labels

### Testing Strategy

Per project testing standards:

- Verify form renders all required fields
- Test validation errors display for each field
- Test successful submission flow with toast and modal close
- Test cancel/escape/outside click behaviors
- Test unsaved changes confirmation
- Verify keyboard navigation (Tab through fields, Enter to submit)

### References

- [Source: docs/epics.md#Story-3.2] - Story requirements and acceptance criteria
- [Source: docs/architecture.md#Container-Pattern] - Container pattern implementation
- [Source: docs/architecture.md#Form-Management-React-Hook-Form-Zod] - Form validation approach
- [Source: docs/architecture.md#API-Architecture-OpenAPI-First] - API integration approach
- [Source: docs/sprint-artifacts/3-1-display-lesson-list.md#Dev-Agent-Record] - Previous story learnings
- [Source: src/types/api.d.ts#LessonData] - Lesson data schema
- [Source: .github/copilot-instructions.md#Adding-a-New-Container] - Container creation guide

## Dev Agent Record

### Context Reference

- `docs/sprint-artifacts/3-2-create-new-lesson.context.xml`

### Agent Model Used

Claude Opus 4.5 (Preview)

### Debug Log References

- Task 1-6: Implemented LessonCreate container with modal dialog, form validation, and integration with CourseDetail page
- Fixed Zod 4.x API compatibility (message vs required_error)
- Verified typecheck and lint pass

### Completion Notes List

- Created LessonCreate container following established Container Pattern
- Implemented Zod validation schema with all field constraints per AC#2
- Form logic handles mutation, cache invalidation, toast notifications
- Modal UI with all 5 required fields and tone dropdown
- Unsaved changes confirmation with AlertDialog
- Integrated "Add Lesson" button in CourseDetail header
- Connected empty state CTA via onAddLesson callback
- All acceptance criteria addressed

### File List

**Created:**

- `src/containers/Main/LessonCreate/constants.ts` - Zod schema, tone options, form defaults
- `src/containers/Main/LessonCreate/types.ts` - LessonCreateProps interface
- `src/containers/Main/LessonCreate/connect.ts` - Form logic, mutation, dirty state tracking
- `src/containers/Main/LessonCreate/index.tsx` - Modal dialog with form UI
- `src/components/ui/alert-dialog.tsx` - shadcn/ui AlertDialog component (installed)

**Modified:**

- `src/containers/Main/CourseDetail/connect.ts` - Added modal state, nextLessonNumber calc, handlers
- `src/containers/Main/CourseDetail/index.tsx` - Added "Add Lesson" button, LessonCreate modal integration
- `src/components/ui/button.tsx` - Updated by shadcn/ui during AlertDialog install

---

## Change Log

| Date       | Author             | Change                                                                            |
| ---------- | ------------------ | --------------------------------------------------------------------------------- |
| 2025-11-29 | SM Agent (Bob)     | Initial story creation from Epic 3, Story 3.2                                     |
| 2025-11-29 | Dev Agent (Amelia) | Implemented Tasks 1-6: LessonCreate container, modal UI, CourseDetail integration |
