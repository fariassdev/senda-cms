# Story 3.3: Edit Existing Lesson

Status: ready-for-dev

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

- [ ] **Task 1: Create LessonEdit container structure** (AC: #1, #2)
  - [ ] 1.1 Create `src/containers/Main/LessonEdit/` directory
  - [ ] 1.2 Create `connect.ts` with form setup, pre-populated values, and mutation logic
  - [ ] 1.3 Create `constants.ts` - reuse validation schema from LessonCreate
  - [ ] 1.4 Create `types.ts` with LessonEditProps interface (including lesson data)
  - [ ] 1.5 Create `index.tsx` with modal dialog and pre-populated form UI

- [ ] **Task 2: Implement form pre-population logic** (AC: #1, #2)
  - [ ] 2.1 Accept `lesson` prop with current lesson data
  - [ ] 2.2 Set form `defaultValues` from lesson data
  - [ ] 2.3 Map lesson fields to form schema (handle field name differences if any)
  - [ ] 2.4 Initialize tone dropdown with current lesson tone value

- [ ] **Task 3: Implement update mutation in connect.ts** (AC: #3, #5)
  - [ ] 3.1 Implement `$api.useMutation('patch', '/api/lessons/{id}')`
  - [ ] 3.2 Handle `onSuccess`: invalidate course query, show toast, close modal
  - [ ] 3.3 Handle `onError`: show error toast with message
  - [ ] 3.4 Implement dirty state check - skip API call if no changes (AC #5)
  - [ ] 3.5 Compare current values vs default values to detect changes

- [ ] **Task 4: Implement validation and error handling** (AC: #4)
  - [ ] 4.1 Reuse `lessonSchema` from LessonCreate/constants.ts
  - [ ] 4.2 Configure `zodResolver` with same validation rules
  - [ ] 4.3 Focus first invalid field on validation failure
  - [ ] 4.4 Display inline errors using `FormMessage` component

- [ ] **Task 5: Implement unsaved changes confirmation** (AC: #6)
  - [ ] 5.1 Track dirty state with `formState.isDirty`
  - [ ] 5.2 Intercept Cancel button click - show confirmation if dirty
  - [ ] 5.3 Intercept Escape key - show confirmation if dirty
  - [ ] 5.4 Intercept outside click - show confirmation if dirty
  - [ ] 5.5 Reuse `AlertDialog` pattern from LessonCreate

- [ ] **Task 6: Integrate with LessonListItem** (AC: #1)
  - [ ] 6.1 Add `onEdit` callback prop to `LessonListItem` component
  - [ ] 6.2 Connect edit button click to trigger onEdit with lesson data
  - [ ] 6.3 Update `LessonList` to pass onEdit handler to each item
  - [ ] 6.4 Update `CourseDetail/connect.ts` to manage LessonEdit modal state
  - [ ] 6.5 Pass selected lesson data to LessonEdit modal

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

<!-- Will be filled by dev agent -->

### Debug Log References

<!-- Will be filled by dev agent -->

### Completion Notes List

<!-- Will be filled by dev agent -->

### File List

<!-- Will be filled by dev agent with NEW/MODIFIED/DELETED markers -->

---

## Change Log

| Date       | Author         | Change                                        |
| ---------- | -------------- | --------------------------------------------- |
| 2025-11-29 | SM Agent (Bob) | Initial story creation from Epic 3, Story 3.3 |
