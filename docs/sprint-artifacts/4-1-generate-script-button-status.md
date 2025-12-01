# Story 4.1: Generate Script Button and Status

Status: review

## Story

As a **Content Manager**,
I want to generate a script for a lesson with one click,
so that I can quickly create meditation content.

## Acceptance Criteria

1. **Given** I am viewing a lesson with status `PENDING` or a status containing `FAILED`, **When** I see the lesson row, **Then**:
   - I see a "Generate Script" button (cyan #7dcfff, with sparkle icon ✨)
   - The button is clearly visible in the lesson row actions area

2. **Given** the lesson has status `SCRIPT_COMPLETED`, `AUDIO_GENERATING`, or `COMPLETED`, **When** I see the lesson row, **Then**:
   - The "Generate Script" button shows as "Regenerate Script" (outline style)
   - The button uses secondary styling (transparent background, cyan border)

3. **Given** the lesson has status `SCRIPT_GENERATING`, **When** I view the lesson row, **Then**:
   - The button is disabled with "Generating..." text
   - A spinner icon replaces the sparkle icon
   - The button shows a loading state

4. **When** I click "Generate Script" on an eligible lesson, **Then**:
   - The button immediately shows a loading spinner
   - The lesson status changes to `SCRIPT_GENERATING`
   - The status badge shows pulse animation (from Story 3.6)
   - A toast notification appears: "Script generation started..."

5. **Given** I start script generation, **When** the backend processes the request, **Then**:
   - The existing polling mechanism (Story 3.6) detects status changes
   - When status changes to `SCRIPT_COMPLETED`, a success toast appears
   - When status changes to a `FAILED` state, an error toast appears

6. **Given** the API returns an error when triggering generation, **Then**:
   - An error toast appears with the error message
   - The button returns to its idle state (not disabled)
   - The lesson status remains unchanged

7. **Given** I view the lesson list on a mobile device, **Then**:
   - The generate button is accessible (touch target ≥ 44px)
   - The button text may be hidden with only the icon visible on smaller screens

## Tasks / Subtasks

- [x] **Task 1: Create GenerateScriptButton component** (AC: #1, #2, #3)
  - [x] 1.1 Create `src/components/GenerateScriptButton.tsx`
  - [x] 1.2 Implement button variants: primary (Generate Script), secondary (Regenerate Script)
  - [x] 1.3 Add sparkle icon (Sparkles from lucide-react) for idle state
  - [x] 1.4 Add spinner icon (Loader2 from lucide-react) for loading state
  - [x] 1.5 Implement disabled state with "Generating..." text
  - [x] 1.6 Add aria-label for accessibility ("Generate script for [lesson title]")

- [x] **Task 2: Create LessonScriptGeneration container** (AC: #4, #5, #6)
  - [x] 2.1 Create `src/containers/Main/LessonScriptGeneration/` directory structure
  - [x] 2.2 Create `connect.ts` with script generation mutation
  - [x] 2.3 Create `constants.ts` with eligible statuses array
  - [x] 2.4 Create `types.ts` for container-local types
  - [x] 2.5 Implement `useScriptGeneration` hook with mutation logic

- [x] **Task 3: Integrate button into LessonListItem** (AC: #1, #2, #3, #7)
  - [x] 3.1 Import GenerateScriptButton into `src/components/SortableLessonItem.tsx` (modified from LessonListItem)
  - [x] 3.2 Pass lesson status and mutation handlers as props
  - [x] 3.3 Determine button variant based on lesson status
  - [x] 3.4 Ensure responsive behavior (icon-only on mobile via Tailwind classes)

- [x] **Task 4: Implement script generation mutation** (AC: #4, #6)
  - [x] 4.1 Add mutation: `$api.useMutation('post', '/api/courses/{slug}/lessons/{id}/generate-script')`
  - [x] 4.2 Handle successful mutation response
  - [x] 4.3 Implement error handling with toast notification
  - [x] 4.4 Invalidate course query to trigger refetch

- [x] **Task 5: Add toast notifications** (AC: #4, #5, #6)
  - [x] 5.1 Show "Script generation started..." toast on mutation start
  - [x] 5.2 Leverage existing polling toasts from Story 3.6 for completion
  - [x] 5.3 Show error toast with API error message on failure

- [ ] **Task 6: Testing and validation** (AC: #1-7)
  - [x] 6.1 Run `bun typecheck` - verify no type errors
  - [x] 6.2 Run `bun lint:fix` - verify no lint errors
  - [x] 6.3 Manual test: verify button appears for PENDING lessons
  - [x] 6.4 Manual test: verify "Regenerate" appears for SCRIPT_COMPLETED
  - [x] 6.5 Manual test: verify loading state during generation
  - [x] 6.6 Manual test: verify toast on generation start
  - [x] 6.7 Manual test: verify disabled state for SCRIPT_GENERATING
  - [x] 6.8 Manual test: verify mobile responsiveness (icon-only)

## Dev Notes

### Architecture Patterns and Constraints

This story follows the established **Container Pattern** where:

- Business logic goes in `connect.ts` (mutation, handlers)
- Presentation goes in component files (GenerateScriptButton.tsx)
- The LessonListItem component orchestrates the button display

**Button State Logic:**

```typescript
const getButtonState = (status: LessonStatus) => {
  if (status === 'SCRIPT_GENERATING' || status === 'AUDIO_GENERATING') {
    return { variant: 'disabled', label: 'Generating...', icon: 'spinner' };
  }
  if (status === 'PENDING' || status.includes('FAILED')) {
    return { variant: 'primary', label: 'Generate Script', icon: 'sparkles' };
  }
  // SCRIPT_COMPLETED, AUDIO_GENERATING, COMPLETED
  return { variant: 'secondary', label: 'Regenerate Script', icon: 'sparkles' };
};
```

[Source: docs/architecture.md#Container-Pattern-CRITICAL]

### API Integration

The script generation endpoint follows the OpenAPI specification:

```typescript
// Mutation in connect.ts
const generateScript = $api.useMutation(
  'post',
  '/api/lessons/{id}/generate-script',
  {
    onSuccess: async () => {
      toast.success('Script generation started...');
      await queryClient.invalidateQueries({
        queryKey: ['get', '/api/courses/{slug}'],
      });
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to start script generation');
    },
  },
);
```

[Source: docs/architecture.md#API-Architecture-OpenAPI-First]
[Source: docs/api-integration.md]

### Status Types and Transitions

From the OpenAPI-generated types, the relevant status transitions are:

```
PENDING → SCRIPT_GENERATING → SCRIPT_COMPLETED
                ↓
            SCRIPT_FAILED → PENDING (can retry)
```

The button must handle all states:

- `PENDING`: Show "Generate Script" (primary)
- `SCRIPT_GENERATING`: Show "Generating..." (disabled with spinner)
- `SCRIPT_COMPLETED`: Show "Regenerate Script" (secondary)
- `AUDIO_GENERATING`: Show "Regenerate Script" (secondary, disabled if desired)
- `COMPLETED`: Show "Regenerate Script" (secondary)
- `*FAILED`: Show "Generate Script" (primary, retry action)

[Source: src/types/models.ts]

### UX Design Compliance

Per UX Design Specification:

**Button Styling:**

- Primary: Solid cyan (#7dcfff) background, dark text
- Secondary (Regenerate): Transparent background, cyan border, cyan text
- Disabled: Grey background, cursor not-allowed

**Icons:**

- Sparkles icon (✨) for generate action
- Loader2 with animate-spin for loading state

**Feedback:**

- Toast notifications positioned top-right
- Success toast auto-dismisses in 4 seconds
- Error toast auto-dismisses in 6 seconds

[Source: docs/ux-design-specification.md#Button-Hierarchy]
[Source: docs/ux-design-specification.md#Feedback-&-Notifications]

### Integration with Existing Components

The GenerateScriptButton will be rendered within LessonListItem alongside existing action buttons (edit, delete):

```typescript
// In LessonListItem.tsx actions area
<div className="flex items-center gap-2">
  <GenerateScriptButton
    lessonId={lesson.id}
    lessonTitle={lesson.title}
    status={lesson.status}
    onGenerate={handleGenerateScript}
    isGenerating={isGenerating}
  />
  <Button variant="ghost" size="icon" onClick={handleEdit}>
    <Pencil className="h-4 w-4" />
  </Button>
  <Button variant="ghost" size="icon" onClick={handleDelete}>
    <Trash2 className="h-4 w-4" />
  </Button>
</div>
```

[Source: src/components/LessonListItem.tsx]

### Polling Integration

Story 3.6 established real-time status indicators with polling. This story leverages that infrastructure:

1. Mutation triggers API call → lesson status changes to `SCRIPT_GENERATING`
2. React Query polling (3s interval) detects the generating status
3. Polling continues until status changes to `SCRIPT_COMPLETED` or `FAILED`
4. Status change detection (from Story 3.6) triggers toast notifications

No additional polling logic needed - reuse existing implementation.

[Source: docs/sprint-artifacts/3-6-realtime-status-indicators.md#Dev-Agent-Record]

### Learnings from Previous Story

**From Story 3-6-realtime-status-indicators (Status: done)**

- **Polling infrastructure**: Already implemented in `CourseDetail/connect.ts` with 3000ms interval
- **Status change detection**: Uses `previousLessonsRef` to compare status transitions
- **Toast notifications**: Pattern established for COMPLETED and FAILED transitions
- **StatusBadge**: Enhanced with pulse animation for GENERATING states
- **Files modified**:
  - `src/containers/Main/CourseDetail/connect.ts` - Polling logic
  - `src/containers/Main/CourseDetail/constants.ts` - POLLING_INTERVAL, GENERATING_STATUSES
  - `src/components/StatusBadge.tsx` - Animation and icons

**Reuse patterns:**

- Use `GENERATING_STATUSES` constant to determine button disabled state
- Leverage existing cache invalidation pattern
- Follow same toast notification conventions

**Pending Review Items from Story 3.6:**

- [Medium] Add unit tests for hasGeneratingLessons helper function
- [Medium] Add unit tests for status change detection logic
- [Low] Add integration test for toast notifications on status changes

These test items are epic-wide and will be addressed in a future testing story.

[Source: docs/sprint-artifacts/3-6-realtime-status-indicators.md#Dev-Agent-Record]

### Project Structure Notes

**New files to create:**

- `src/components/GenerateScriptButton.tsx` - Presentational component
- `src/containers/Main/LessonScriptGeneration/connect.ts` - Business logic
- `src/containers/Main/LessonScriptGeneration/constants.ts` - Status constants
- `src/containers/Main/LessonScriptGeneration/types.ts` - Local types

**Files to modify:**

- `src/components/LessonListItem.tsx` - Integrate GenerateScriptButton

**Unchanged files:**

- `src/containers/Main/CourseDetail/connect.ts` - Polling already handles status changes
- `src/components/StatusBadge.tsx` - Already has pulse animation

[Source: docs/architecture.md#Project-Structure]

### Accessibility Requirements

Per WCAG 2.1 Level AA compliance:

- Button must have `aria-label` describing the action
- Focus state must show visible cyan outline (2px)
- Touch target minimum 44x44px on mobile
- Button must be keyboard accessible (Tab + Enter/Space)
- Loading state must use `aria-busy="true"`
- Disabled state must use `aria-disabled="true"` or native `disabled`

```typescript
<Button
  aria-label={`Generate script for ${lessonTitle}`}
  aria-busy={isGenerating}
  disabled={isGenerating}
  ...
>
```

[Source: docs/ux-design-specification.md#Accessibility-Patterns]

### Error Handling Strategy

Per architecture error handling patterns:

```typescript
// In mutation onError callback
onError: (error: ApiError) => {
  // Show user-friendly error message
  toast.error(
    error.message || 'Failed to start script generation. Please try again.',
  );

  // Log error for debugging (future: send to error tracking service)
  console.error('Script generation error:', error);
};
```

Errors should NOT change the lesson status - only the backend does that.

[Source: docs/architecture.md#Error-Handling-Strategy]

### Testing Strategy

Per project testing standards:

- Type checking with `bun typecheck`
- Linting with `bun lint:fix`
- Manual testing for all acceptance criteria
- Focus on button states, mutation flow, and toast notifications

Future unit tests (post-story):

- GenerateScriptButton component renders correct variants
- Mutation triggers correctly with lesson ID
- Error handling displays toast

[Source: docs/architecture.md#Testing-Strategy]

### References

- [Source: docs/epics.md#Story-4.1] - Story requirements and acceptance criteria
- [Source: docs/architecture.md#Container-Pattern-CRITICAL] - Container pattern for business logic
- [Source: docs/architecture.md#API-Architecture-OpenAPI-First] - Mutation patterns
- [Source: docs/architecture.md#Error-Handling-Strategy] - Toast notification patterns
- [Source: docs/ux-design-specification.md#Button-Hierarchy] - Button styling
- [Source: docs/ux-design-specification.md#Feedback-&-Notifications] - Toast patterns
- [Source: docs/ux-design-specification.md#Accessibility-Patterns] - ARIA and keyboard
- [Source: docs/sprint-artifacts/3-6-realtime-status-indicators.md#Dev-Agent-Record] - Previous story patterns
- [Source: src/types/models.ts] - LessonStatus type definition
- [Source: src/components/LessonListItem.tsx] - Component to modify
- [Source: src/containers/Main/CourseDetail/connect.ts] - Polling implementation

## Dev Agent Record

### Context Reference

- `docs/sprint-artifacts/4-1-generate-script-button-status.context.xml`

### Agent Model Used

Claude Opus 4.5 (Preview)

### Debug Log References

- Task 1: Created GenerateScriptButton component with primary/secondary variants based on lesson status
- Task 2: Created LessonScriptGeneration container following project patterns (connect.ts, constants.ts, types.ts)
- Task 3: Integrated button into SortableLessonItem (primary lesson display component), added courseSlug prop to SortableLessonList
- Task 4: Implemented mutation using $api.useMutation with correct endpoint path `/api/courses/{slug}/lessons/{id}/generate-script`
- Task 5: Added toast notifications - info on start, success/error handled by polling (Story 3.6)

### Completion Notes List

- GenerateScriptButton: Uses cyan (#7dcfff) for primary, outline with cyan border for secondary
- Button state logic handles PENDING, FAILED → primary "Generate Script", COMPLETED states → secondary "Regenerate"
- SCRIPT_GENERATING shows disabled with spinner, AUDIO_GENERATING shows disabled regenerate
- Responsive: min-h-[44px] touch target, text hidden on mobile (sm:inline)
- Accessibility: aria-label with lesson title, aria-busy for loading state

### File List

**New files:**

- `src/components/GenerateScriptButton.tsx` - Button component with variants
- `src/containers/Main/LessonScriptGeneration/connect.ts` - useScriptGeneration hook
- `src/containers/Main/LessonScriptGeneration/constants.ts` - Status arrays
- `src/containers/Main/LessonScriptGeneration/types.ts` - TypeScript interfaces
- `src/containers/Main/LessonScriptGeneration/index.ts` - Barrel export

**Modified files:**

- `src/components/SortableLessonItem.tsx` - Added GenerateScriptButton integration
- `src/components/SortableLessonList.tsx` - Added courseSlug prop
- `src/containers/Main/CourseDetail/index.tsx` - Pass courseSlug to SortableLessonList

---

## Change Log

| Date       | Author             | Change                                            |
| ---------- | ------------------ | ------------------------------------------------- |
| 2025-12-01 | SM Agent (Bob)     | Initial story creation from Epic 4, Story 4.1     |
| 2025-12-01 | Dev Agent (Amelia) | Implemented Tasks 1-5, typecheck and lint passing |
