# Story 3.3: Edit Existing Lesson

Status: review

## Story

As a **Content Manager**,
I want to edit the details of an existing lesson,
so that I can correct errors or update content.

## Acceptance Criteria

1. **Given** I see the lesson list, **When** I click the edit icon (✏️) on a lesson row, **Then** a modal opens with the form pre-populated with current data.

2. **Given** the edit modal is open, **Then** all fields are editable:
   - Title (current value shown)
   - Duration in minutes (current value shown)
   - Core Practice (current value shown)
   - Key Point (current value shown)
   - Tone (current value shown in dropdown)

3. **Given** I modify fields and click "Save Changes", **Then**:
   - The changes are saved to the backend
   - A success toast shows: "Lesson updated"
   - The list updates with new data
   - The modal closes

4. **Given** I submit with invalid data, **Then**:
   - Inline validation errors appear below each invalid field
   - The form does not submit
   - Focus moves to the first invalid field

5. **Given** I haven't made changes and click "Save", **Then** the modal closes without API call.

6. **Given** I have unsaved changes and click "Cancel" or press Escape, **Then**:
   - A confirmation dialog appears: "Discard changes?"
   - If confirmed, modal closes without saving
   - If cancelled, modal remains open

## Tasks / Subtasks

- [x] **Task 1: Create LessonEdit container structure** (AC: #1, #2)
  - [x] 1.1 Create `src/containers/Main/LessonEdit/` directory
  - [x] 1.2 Create `connect.ts` with form setup, pre-populated values, and mutation logic
  - [x] 1.3 Create `constants.ts` - reuse validation schema from LessonCreate
  - [x] 1.4 Create `types.ts` with LessonEditProps interface (including lesson data)
  - [x] 1.5 Create `index.tsx` with modal dialog and pre-populated form UI

- [x] **Task 2: Implement form pre-population logic** (AC: #1, #2)
  - [x] 2.1 Accept `lesson` prop with current lesson data
  - [x] 2.2 Set form `defaultValues` from lesson data
  - [x] 2.3 Map lesson fields to form schema (handle field name differences if any)
  - [x] 2.4 Initialize tone dropdown with current lesson tone value

- [x] **Task 3: Implement update mutation in connect.ts** (AC: #3, #5)
  - [x] 3.1 Implement `$api.useMutation('put', '/api/courses/{slug}/lessons/{id}')`
  - [x] 3.2 Handle `onSuccess`: invalidate course query, show toast, close modal
  - [x] 3.3 Handle `onError`: show error toast with message
  - [x] 3.4 Implement dirty state check - skip API call if no changes (AC #5)
  - [x] 3.5 Compare current values vs default values to detect changes

- [x] **Task 4: Implement validation and error handling** (AC: #4)
  - [x] 4.1 Reuse `lessonSchema` from LessonCreate/constants.ts
  - [x] 4.2 Configure `zodResolver` with same validation rules
  - [x] 4.3 Focus first invalid field on validation failure
  - [x] 4.4 Display inline errors using `FormMessage` component

- [x] **Task 5: Implement unsaved changes confirmation** (AC: #6)
  - [x] 5.1 Track dirty state with `formState.isDirty`
  - [x] 5.2 Intercept Cancel button click - show confirmation if dirty
  - [x] 5.3 Intercept Escape key - show confirmation if dirty
  - [x] 5.4 Intercept outside click - show confirmation if dirty
  - [x] 5.5 Reuse `AlertDialog` pattern from LessonCreate

- [x] **Task 6: Integrate with CourseDetail container** (AC: #1)
  - [x] 6.1 LessonListItem already has `onEdit` callback prop wired up
  - [x] 6.2 LessonList already passes onEdit handler to each item
  - [x] 6.3 Update `CourseDetail/connect.ts` to manage LessonEdit modal state
  - [x] 6.4 Pass selected lesson data to LessonEdit modal
  - [x] 6.5 Wire up LessonEdit modal open/close handlers

- [x] **Task 7: Testing and validation** (AC: #1-6)
  - [x] 7.1 Run `bun typecheck` - passed
  - [x] 7.2 Run `bun lint:fix` - passed
  - [ ] 7.3 Manual test: modal opens with pre-populated data (all fields)
  - [ ] 7.4 Manual test: form submission with valid changed data
  - [ ] 7.5 Manual test: form submission with no changes (verify no API call)
  - [ ] 7.6 Manual test: form submission with invalid data (verify inline errors)
  - [ ] 7.7 Manual test: unsaved changes confirmation (Cancel, Escape, outside click)
  - [ ] 7.8 Manual test: list updates after successful edit

- [ ] **Task 7: Testing and validation** (AC: #1-6)
  - [ ] 7.1 Test modal opens with pre-populated data (all fields)
  - [ ] 7.2 Test form submission with valid changed data
  - [ ] 7.3 Test form submission with no changes (verify no API call)
  - [ ] 7.4 Test form submission with invalid data (verify inline errors)
  - [ ] 7.5 Test unsaved changes confirmation (Cancel, Escape, outside click)
  - [ ] 7.6 Verify list updates after successful edit
  - [ ] 7.7 Run `bun typecheck` and `bun lint:fix`

## Dev Notes

### Architecture Patterns and Constraints

This story follows the established **Container Pattern** where:

- `LessonEdit/connect.ts` handles ALL form and mutation logic
- `LessonEdit/index.tsx` is purely presentational modal UI
- Reuse validation schema from `LessonCreate/constants.ts`

**API Integration Pattern** - Use OpenAPI-first approach:

```typescript
// In LessonEdit/connect.ts
const updateMutation = $api.useMutation('patch', '/api/lessons/{id}', {
  onSuccess: async () => {
    toast.success('Lesson updated');
    await queryClient.invalidateQueries({
      queryKey: ['get', '/api/courses/{slug}'],
    });
    onClose();
  },
  onError: (error) => {
    toast.error(error.message || 'Failed to update lesson');
  },
});
```

**Form Pre-population Pattern** - React Hook Form defaultValues:

```typescript
// In LessonEdit/connect.ts
const form = useForm<LessonFormData>({
  resolver: zodResolver(lessonSchema),
  defaultValues: {
    title: lesson.title,
    durationMinutes: lesson.durationMinutes,
    corePractice: lesson.corePractice,
    keyPoint: lesson.keyPoint,
    tone: lesson.tone as ToneValue,
  },
});
```

**No-Change Detection Pattern**:

```typescript
// Skip API call if no changes made
const handleSubmit = form.handleSubmit(async (data) => {
  if (!form.formState.isDirty) {
    onClose();
    return;
  }
  await updateMutation.mutateAsync({
    params: { path: { id: lesson.id } },
    body: data,
  });
});
```

### API Request/Response from OpenAPI

Based on the backend OpenAPI spec, the lesson update endpoint:

**Request**: `PATCH /api/lessons/{id}`

```typescript
{
  title?: string;
  durationMinutes?: number;
  corePractice?: string;
  keyPoint?: string;
  tone?: string;
}
```

**Response**: Returns the updated `LessonData` object with all fields.

### Relevant Types from Previous Stories

Reuse types and schemas established in Stories 3.1 and 3.2:

```typescript
// From src/types/models.ts
export type Lesson = components['schemas']['LessonData'];

// From LessonCreate/constants.ts - reuse validation
export {
  lessonSchema,
  TONE_OPTIONS,
  type LessonFormData,
} from '@/containers/Main/LessonCreate/constants';
```

### LessonListItem Integration

Update the edit button click handler in LessonListItem:

```typescript
// Current state (from Story 3.1):
<Button variant="ghost" size="icon" aria-label="Edit lesson">
  <Pencil className="h-4 w-4" />
</Button>

// Updated for this story:
interface LessonListItemProps {
  lesson: Lesson;
  onEdit?: (lesson: Lesson) => void;  // NEW
  onDelete?: (lesson: Lesson) => void;
}

<Button
  variant="ghost"
  size="icon"
  aria-label="Edit lesson"
  onClick={() => onEdit?.(lesson)}
>
  <Pencil className="h-4 w-4" />
</Button>
```

### Unsaved Changes Pattern

Reuse the pattern established in LessonCreate (Story 3.2):

```typescript
// Track if form has unsaved changes
const {
  formState: { isDirty },
} = form;

// Show confirmation before discarding
const handleClose = () => {
  if (isDirty) {
    setShowDiscardConfirm(true);
  } else {
    onClose();
  }
};
```

### shadcn/ui Components to Use

Reuse components from LessonCreate:

- `Dialog`, `DialogContent`, `DialogHeader`, `DialogTitle`, `DialogFooter` - Modal structure
- `Form`, `FormField`, `FormItem`, `FormLabel`, `FormControl`, `FormMessage` - Form fields
- `Input` - Title, duration, core practice, key point inputs
- `Select`, `SelectTrigger`, `SelectValue`, `SelectContent`, `SelectItem` - Tone dropdown
- `Button` - Cancel and Save Changes buttons
- `AlertDialog` - Unsaved changes confirmation
- Icons from `lucide-react`: `Pencil`, `Loader2`

### Learnings from Previous Story

**From Story 3-2-create-new-lesson (Status: review)**

- **LessonCreate Container**: Created at `src/containers/Main/LessonCreate/` - Use same structure for LessonEdit
- **Zod Schema**: `lessonSchema` in `LessonCreate/constants.ts` validates title (3-100 chars), durationMinutes (1-120), corePractice, keyPoint, tone enum - **REUSE** for LessonEdit
- **Tone Options**: `TONE_OPTIONS` const array available - **REUSE** for dropdown
- **AlertDialog**: Installed for unsaved changes confirmation - **REUSE** pattern
- **Form Pattern**: React Hook Form with zodResolver pattern established - **FOLLOW** same approach
- **Modal State**: CourseDetail/connect.ts manages modal open/close state - **EXTEND** for edit modal
- **Cache Invalidation**: Query key `['get', '/api/courses/{slug}']` invalidated on lesson changes - **USE SAME** key

**Key Files to Reference:**

- `src/containers/Main/LessonCreate/constants.ts` - Reuse schema and tone options
- `src/containers/Main/LessonCreate/connect.ts` - Follow form setup pattern
- `src/containers/Main/LessonCreate/index.tsx` - Follow modal UI pattern
- `src/components/LessonListItem.tsx` - Add onEdit callback

[Source: docs/sprint-artifacts/3-2-create-new-lesson.md#Dev-Agent-Record]

### Project Structure Notes

Files to create:

- `src/containers/Main/LessonEdit/index.tsx` - Modal component with pre-populated form
- `src/containers/Main/LessonEdit/connect.ts` - Form logic with defaultValues and update mutation
- `src/containers/Main/LessonEdit/types.ts` - LessonEditProps interface

Files to modify:

- `src/components/LessonListItem.tsx` - Add onEdit callback prop
- `src/components/LessonList.tsx` - Pass onEdit handler to items
- `src/containers/Main/CourseDetail/connect.ts` - Add edit modal state and selected lesson
- `src/containers/Main/CourseDetail/index.tsx` - Add LessonEdit modal with lesson data

### Accessibility Requirements

- Modal traps focus when open
- Escape key closes modal (with confirmation if dirty)
- Form fields have proper labels with current values
- Submit button disabled during submission with loading indicator
- Error messages announced to screen readers via `aria-live`
- Edit button in list has `aria-label="Edit lesson"`

### Testing Strategy

Per project testing standards:

- Verify modal opens with all fields pre-populated
- Test validation errors display for each field
- Test successful submission flow with toast and list update
- Test no-change submission (verify no API call made)
- Test cancel/escape/outside click with unsaved changes
- Verify keyboard navigation (Tab through fields, Enter to submit)

### References

- [Source: docs/epics.md#Story-3.3] - Story requirements and acceptance criteria
- [Source: docs/architecture.md#Container-Pattern] - Container pattern implementation
- [Source: docs/architecture.md#Form-Management-React-Hook-Form-Zod] - Form validation approach
- [Source: docs/architecture.md#API-Architecture-OpenAPI-First] - API integration approach
- [Source: docs/sprint-artifacts/3-2-create-new-lesson.md#Dev-Agent-Record] - Previous story learnings and patterns
- [Source: src/types/api.d.ts#LessonData] - Lesson data schema
- [Source: src/containers/Main/LessonCreate/constants.ts] - Validation schema to reuse

## Dev Agent Record

### Context Reference

- docs/sprint-artifacts/3-3-edit-existing-lesson.context.xml

### Agent Model Used

Claude Opus 4.5 (Preview)

### Debug Log References

None - implementation passed typecheck and lint on first attempt.

### Completion Notes List

1. **Container Pattern Applied**: Created LessonEdit container following same pattern as LessonCreate - separate `connect.ts` for logic, `index.tsx` for UI, `types.ts` for interfaces, `constants.ts` re-exports from LessonCreate.

2. **Schema Reuse**: `constants.ts` re-exports `lessonSchema`, `TONE_SUGGESTIONS`, `LessonFormData` from LessonCreate - no duplication.

3. **Form Pre-population**: `defaultValues` in `useForm` populated from `lesson` prop with proper field mapping (camelCase to API snake_case).

4. **Dirty State Optimization**: AC #5 implemented - `onSubmit` checks `isDirty` and closes modal without API call if no changes.

5. **Unsaved Changes Dialog**: AC #6 implemented via `showDiscardDialog` state and `AlertDialog` - triggers on Cancel, Escape, and outside click via `onOpenChange` handler.

6. **API Endpoint**: Used `PUT /api/courses/{slug}/lessons/{id}` as per OpenAPI spec.

7. **LessonList Integration**: `LessonListItem` already had `onEdit` prop from Story 3.1 - only needed to wire up CourseDetail state management.

8. **Selected Lesson State**: Added `selectedLesson: Lesson | null` to CourseDetail connect to pass lesson data to edit modal.

9. **Tone Combobox (Story 3.2 learning)**: Following learning from 3.2, updated tone field to use `Input` + `datalist` combobox pattern instead of Select enum. Users can type custom values or select from `TONE_SUGGESTIONS`: Calming, Energizing, Neutral, Guided Visualization, Soothing, Motivating, Reflective.

### File List

- NEW: `src/containers/Main/LessonEdit/types.ts` - LessonEditProps interface
- NEW: `src/containers/Main/LessonEdit/constants.ts` - Re-exports from LessonCreate
- NEW: `src/containers/Main/LessonEdit/connect.ts` - Form logic, mutation, dirty state handling
- NEW: `src/containers/Main/LessonEdit/index.tsx` - Modal UI with form and AlertDialog
- MODIFIED: `src/containers/Main/CourseDetail/connect.ts` - Added edit modal state and handlers
- MODIFIED: `src/containers/Main/CourseDetail/index.tsx` - Added LessonEdit import and modal render

---

## Change Log

| Date       | Author         | Change                                        |
| ---------- | -------------- | --------------------------------------------- |
| 2025-11-29 | SM Agent (Bob) | Initial story creation from Epic 3, Story 3.3 |
