# Story 4.6: Batch Script Generation

Status: ready-for-dev

## Story

As a **Content Manager**,
I want to generate scripts for multiple lessons at once,
So that I can quickly create content for an entire course.

## Acceptance Criteria

1. **Given** I am on the course detail page
   **When** I see multiple lessons with PENDING or SCRIPT_FAILED status (eligible for generation)
   **Then** I see a "Generate All Scripts" button in the course header area (positioned near "Add Lesson" button)
   **And** the button shows count of eligible lessons: "Generate Scripts (X)"
   **And** the button is styled with cyan primary color (#7dcfff) and Sparkles icon

2. **Given** all lessons already have scripts (status >= SCRIPT_COMPLETED)
   **When** I view the course detail page
   **Then** the "Generate All Scripts" button is hidden or disabled with tooltip: "All lessons have scripts"

3. **Given** I click "Generate All Scripts" button
   **When** the modal appears
   **Then** I see a confirmation modal with:
   - Title: "Generate Scripts for X Lessons"
   - List of lessons to be processed (checkboxes, all selected by default)
   - Warning about processing time: "⏱️ This may take several minutes depending on the number of lessons"
   - "Generate" button and "Cancel" button
   - Note: Tone configuration is defined per lesson, not in batch modal

4. **Given** I see the batch generation modal
   **When** I toggle individual lesson checkboxes
   **Then** I can select/deselect which lessons to include in the batch
   **And** the count updates: "Generate Scripts for X of Y Lessons"
   **And** if I deselect all, the "Generate" button becomes disabled

5. **Given** I have lessons selected and click "Generate"
   **When** the batch generation starts
   **Then** the modal changes to a progress view showing:
   - Overall progress: "Generating: 2/5 complete"
   - Individual lesson status indicators (pending → generating → completed/failed)
   - Each lesson row shows: lesson title, status icon (spinner/check/X), status text
   - "Close" button (allows viewing course page while generation continues)

6. **Given** batch generation is in progress
   **When** I close the progress modal
   **Then** I return to the course detail page
   **And** individual lesson cards show SCRIPT_GENERATING status with pulse animation
   **And** polling from Story 3.6 continues to update statuses
   **And** I can reopen the batch progress by clicking "View Progress" button (appears during batch)

7. **Given** batch generation completes
   **When** all lessons finish (success or failure)
   **Then** the progress view shows summary:
   - Success: "✅ 4/5 scripts generated successfully"
   - If any failures: "❌ 1 failed - click to retry"
     **And** toast notification: "Batch generation complete: X succeeded, Y failed"
     **And** the "Generate All Scripts" button updates its count

8. **Given** some generations fail
   **When** I see the failure in progress modal
   **Then** I can click "Retry Failed" to retry only the failed lessons
   **And** failed lessons show specific error message if available
   **And** successfully generated lessons are not affected

9. **Given** I click "Cancel" before starting generation
   **Then** the modal closes without any API calls
   **And** no lessons are affected

10. **Given** batch generation is in progress
    **When** I navigate away from the course detail page
    **Then** generation continues in the background
    **And** when I return, I see current status of each lesson via polling
    **And** toast notifications still fire for completions

## Tasks / Subtasks

- [x] **Task 1: Create useBatchScriptGeneration Hook** (AC: #5, #6, #7, #8, #10)
  - [x] 1.1 Create `src/hooks/useBatchScriptGeneration.ts` following hook naming convention
  - [x] 1.2 Implement batch mutation using `$api.useMutation('post', '/api/courses/{slug}/generate-batch-scripts')`
  - [x] 1.3 Track batch state: `lessonStatuses: Map<number, LessonBatchStatus>`, `completedCount`, `failedCount`, `totalCount`
  - [x] 1.4 Implement `generateBatch(lessonIds: number[])` to call batch endpoint (tone is defined per lesson)
  - [x] 1.5 Implement `retryFailed()` to call batch endpoint with only failed lesson IDs
  - [x] 1.6 Store batch state in React Query cache with key `['batch-generation', courseSlug]` and `staleTime: Infinity`
  - [x] 1.7 Return `{ generateBatch, retryFailed, batchState, isGeneratingBatch }`

- [x] **Task 2: Create BatchGenerationModal Component** (AC: #3, #4, #5, #7, #8, #9)
  - [x] 2.1 Create `src/containers/Main/CourseDetail/BatchGenerationModal/index.tsx`
  - [x] 2.2 Create `connect.ts` with selected lessons state and view state (tone removed - defined per lesson)
  - [x] 2.3 Create `types.ts` with `BatchGenerationModalProps` interface
  - [x] 2.4 Create `constants.ts` with `BATCH_MESSAGES` and `MODAL_CONFIG`
  - [x] 2.5 Implement selection view: lesson checkboxes (tone selector removed)
  - [x] 2.6 Implement progress view: per-lesson status + overall progress bar with Progress component
  - [x] 2.7 Implement complete view: summary + "Retry Failed" button (if failures exist)
  - [x] 2.8 View state toggle: `'selection' | 'progress' | 'complete'`

- [x] **Task 3: Create GenerateAllScriptsButton Component** (AC: #1, #2)
  - [x] 3.1 Create `src/containers/Main/CourseDetail/GenerateAllScriptsButton/index.tsx`
  - [x] 3.2 Create `connect.ts` with eligible lesson count logic
  - [x] 3.3 Create `types.ts` with component props
  - [x] 3.4 Count eligible lessons: `lessons.filter(l => l.status === 'PENDING' || l.status === 'SCRIPT_FAILED')`
  - [x] 3.5 Show count badge: "Generate Scripts (5)"
  - [x] 3.6 Disable with tooltip when no eligible lessons
  - [x] 3.7 Style with cyan primary color and Sparkles icon

- [x] **Task 4: Integrate into CourseDetail Page** (AC: #1, #6, #10)
  - [x] 4.1 Import BatchGenerationModal and GenerateAllScriptsButton in CourseDetail
  - [x] 4.2 Add modal state management in CourseDetail connect.ts
  - [x] 4.3 Position button in course header area (near lesson count or actions)
  - [x] 4.4 Render BatchGenerationModal with proper props
  - [x] 4.5 Add "View Progress" button in header area (next to GenerateAllScriptsButton) - visible only during active batch

- [x] **Task 5: Progress Persistence and Background State** (AC: #10)
  - [x] 5.1 Store batch generation state in React Query with dedicated key
  - [x] 5.2 Use `staleTime: Infinity` to persist batch state across navigation
  - [x] 5.3 Leverage existing polling (Story 3.6) to sync individual lesson statuses
  - [x] 5.4 Clear batch state when all generations complete successfully

- [ ] **Task 6: Testing and Validation** (AC: #1-10)
  - [x] 6.1 Run `bun typecheck` - verify no type errors ✅ PASSED
  - [x] 6.2 Run `bun lint:fix` - verify no lint errors ✅ PASSED (0 errors, 2 warnings)
  - [ ] 6.3 Manual test: Click "Generate All Scripts", verify modal with lesson list
  - [ ] 6.4 Manual test: Toggle lesson checkboxes, verify count updates
  - [ ] 6.5 Manual test: Start generation, verify progress view with individual statuses
  - [ ] 6.6 Manual test: Close modal during generation, verify lessons show SCRIPT_GENERATING
  - [ ] 6.7 Manual test: Navigate away and return, verify status persistence
  - [ ] 6.8 Manual test: When generation completes, verify summary shown
  - [ ] 6.9 Manual test: Simulate failure (if possible), verify retry button works
  - [ ] 6.10 Manual test: Verify button hidden when all lessons have scripts

## Dev Notes

### Architecture Patterns and Constraints

This story creates a new batch generation feature integrated with existing script generation infrastructure from Stories 4.1-4.5. It follows the **Container Pattern** and reuses established patterns.

**Key Patterns:**

- **Reuse existing hooks**: Extend from `useScriptGeneration` pattern for mutations
- **Modal pattern**: Similar to `ScriptGenerationModal` with selection + progress views
- **Polling integration**: Leverage Story 3.6 polling for real-time status updates
- **State persistence**: Use React Query cache for batch state across navigation
- **Optimistic updates**: Update individual lesson statuses immediately

[Source: docs/architecture.md#Container-Pattern-CRITICAL]
[Source: docs/architecture.md#API-Architecture-OpenAPI-First]
[Source: docs/epics.md#Story-4.6-Batch-Script-Generation]

### API Integration

**Batch Script Generation Endpoint (UPDATED):**

```typescript
// Use the batch endpoint - backend handles orchestration
$api.useMutation('post', '/api/courses/{slug}/generate-batch-scripts');

// Request body:
interface BatchGenerateRequest {
  lesson_ids?: number[]; // Optional: if empty array = no generation, if undefined = all eligible
}

// Response: The backend starts generation for specified lessons.
// Individual lesson statuses update via polling (Story 3.6).
```

**IMPORTANT:** Use `{slug}` (not `{id}`) to match project's URL pattern convention.

[Source: docs/architecture.md#API-Hook-Structure-Strict]

### Source Tree Components to Touch

**Files to Create:**

```
src/hooks/
├── useBatchScriptGeneration.ts    ← New hook for batch state management

src/containers/Main/CourseDetail/
├── BatchGenerationModal/
│   ├── index.tsx                  ← Modal with selection + progress views
│   ├── connect.ts                 ← Selection state, configuration form
│   ├── types.ts                   ← BatchGenerationModalProps
│   └── constants.ts               ← Modal config, warning messages
├── GenerateAllScriptsButton/
│   ├── index.tsx                  ← Button with count badge
│   ├── connect.ts                 ← Eligible lesson count logic
│   └── types.ts                   ← GenerateAllScriptsButtonProps
```

**Files to Modify:**

```
src/containers/Main/CourseDetail/
├── connect.ts                     ← Add batch modal state, batch hook
├── index.tsx                      ← Render button and modal
```

**Files to Reference (DO NOT MODIFY):**

```
src/hooks/useScriptGeneration.ts           ← Pattern reference for mutations
src/components/ScriptGenerationModal/      ← Pattern reference for modal structure
src/containers/Main/CourseDetail/SortableLessonList/
                                           ← Lesson list structure reference
```

[Source: docs/architecture.md#Project-Structure]

### Project Structure Notes

**Container Hierarchy:**

```
CourseDetail (parent container)
├── GenerateAllScriptsButton (NEW - shows count, triggers modal)
├── SortableLessonList (existing - lesson cards)
├── BatchGenerationModal (NEW - selection + progress views)
│   ├── LessonSelectionList (lesson checkboxes)
│   ├── ConfigurationForm (tone selector)
│   └── ProgressView (per-lesson status, overall progress)
├── LessonCreate, LessonEdit, LessonDelete (existing modals)
└── ScriptConfigModal (existing - individual generation)
```

**Component Responsibility:**

- `GenerateAllScriptsButton`: Shows count of eligible lessons (PENDING or SCRIPT_FAILED), triggers batch modal
- `BatchGenerationModal`: Multi-view modal ('selection' | 'progress' | 'complete')
- `useBatchScriptGeneration`: Calls batch endpoint, tracks per-lesson statuses via polling, handles retry

### BatchGenerationModal Implementation

**Follow `ScriptGenerationModal` pattern from `src/components/ScriptGenerationModal/`.**

**Key Implementation Details:**

- **Modal size:** `sm:max-w-[700px]` (wider than individual generation modal)
- **Selection view:** Checkbox list + tone selector. Use `Checkbox` from shadcn/ui.
- **Progress view:** `Progress` component + per-lesson status icons (Clock/Loader2/CheckCircle/XCircle)
- **Complete view:** Summary message + "Retry Failed" button (if failures)
- **View state:** Local state `view: 'selection' | 'progress' | 'complete'`

**Status Icons Mapping:**

```typescript
const STATUS_ICONS = {
  pending: <Clock className="h-4 w-4 text-gray-400" />,
  generating: <Loader2 className="h-4 w-4 animate-spin text-blue-500" />,
  completed: <CheckCircle className="h-4 w-4 text-green-500" />,
  failed: <XCircle className="h-4 w-4 text-red-500" />,
};
```

[Source: docs/ux-design-specification.md#Modal-Dialog-Patterns]

### useBatchScriptGeneration Hook Implementation

**Key Implementation Patterns:**

```typescript
type LessonBatchStatus = 'pending' | 'generating' | 'completed' | 'failed';

interface BatchState {
  lessonStatuses: Map<number, LessonBatchStatus>;
  totalCount: number;
  completedCount: number;
  failedCount: number;
  isGenerating: boolean;
}

export function useBatchScriptGeneration(courseSlug: string) {
  // 1. Use batch endpoint mutation
  const batchMutation = $api.useMutation('post', '/api/courses/{slug}/generate-all-scripts');

  // 2. Store batch state in React Query cache for persistence
  const queryClient = useQueryClient();
  const BATCH_QUERY_KEY = ['batch-generation', courseSlug];

  // 3. generateBatch: Initialize statuses → call batch endpoint → rely on polling for updates
  const generateBatch = async (lessonIds: number[], config?: { tone: string }) => {
    // Set all to 'generating' immediately (backend orchestrates individually)
    const statuses = new Map(lessonIds.map(id => [id, 'generating' as LessonBatchStatus]));
    queryClient.setQueryData(BATCH_QUERY_KEY, { lessonStatuses: statuses, ... });

    // Call batch endpoint - backend starts all generations
    await batchMutation.mutateAsync({
      params: { path: { slug: courseSlug } },
      body: { lesson_ids: lessonIds, config },
    });

    // Polling (Story 3.6) updates individual lesson statuses.
    // Sync batch state by watching lesson query updates.
  };

  // 4. retryFailed: Extract failed IDs → call generateBatch again
  const retryFailed = async () => { ... };

  return { generateBatch, retryFailed, batchState, isGeneratingBatch };
}
```

**IMPORTANT:** The batch endpoint triggers server-side orchestration. Individual lesson status updates come via existing polling (Story 3.6). The hook should sync `batchState.lessonStatuses` by watching the lessons query data.

[Source: src/hooks/useScriptGeneration.ts - pattern reference]

### Learnings from Previous Stories

**From Story 4-5-regenerate-script (Status: done):**

- Shared `ScriptGenerationModal` component pattern with configuration form
- `useMemo` for defaultValues to prevent form resets on re-renders
- Dynamic button labels based on form state
- Warning banner with amber styling and `role="alert"` for accessibility
- Refactored to shared component eliminating duplication

**From Story 4-2-script-generation-configuration (Status: done):**

- Tone selector with predefined options: calming, energizing, neutral, visualization
- Form dirty state tracking via `onDirtyChange` callback
- Modal structure with DialogHeader, DialogContent, DialogFooter

**From Story 4-1-generate-script-button-status (Status: done):**

- `useScriptGeneration` hook for generation mutation
- Optimistic update to SCRIPT_GENERATING status
- Error rollback using `previousDataRef`
- Toast notifications for generation start/complete/error

**From Story 3-6-real-time-status-indicators (Status: done):**

- React Query polling with `refetchInterval`
- Polling only active when lessons in GENERATING status
- Toast notifications on status change (COMPLETED, FAILED)
- Badge pulse animation for generating states

[Source: docs/sprint-artifacts/4-5-regenerate-script.md#Learnings-from-Previous-Stories]

### Accessibility Requirements

Per WCAG 2.1 Level AA compliance:

- Warning banner has `role="alert"` for screen reader announcement
- Modal has proper ARIA attributes (Dialog component handles this)
- Checkbox list is keyboard navigable (Tab, Space to toggle)
- Progress updates announced to screen readers via `role="status"` on progress container
- Focus management: first checkbox receives focus when modal opens
- Button states communicated: "Generating..." during loading, disabled state announced

```tsx
<div role="status" aria-live="polite" className="sr-only">
  {completedCount} of {totalCount} scripts generated
</div>
```

[Source: docs/ux-design-specification.md#Accessibility-Patterns]

### Testing Strategy

Per project testing standards:

- Type checking with `bun typecheck`
- Linting with `bun lint:fix`
- Manual testing for all 10 acceptance criteria

**Key Test Scenarios:**

1. Button shows correct count of eligible lessons
2. Button hidden/disabled when no eligible lessons
3. Modal opens with lesson list and all selected
4. Toggle checkboxes updates count correctly
5. Click Generate → progress view shows
6. Per-lesson status updates during generation
7. Close modal → lessons show SCRIPT_GENERATING on page
8. Navigate away and return → statuses persist via polling
9. Generation completes → summary shown with success/failure counts
10. Retry failed → only failed lessons regenerate

[Source: docs/architecture.md#Testing-Strategy]

### Constants Reference (for BatchGenerationModal/constants.ts)

```typescript
// BatchGenerationModal/constants.ts
export const BATCH_MESSAGES = {
  PROCESSING_WARNING:
    'This may take several minutes depending on the number of lessons.',
  START_TOAST: (count: number) =>
    `Batch generation started for ${count} lessons...`,
  COMPLETE_SUCCESS: (count: number) =>
    `✅ ${count} scripts generated successfully`,
  COMPLETE_PARTIAL: (success: number, failed: number) =>
    `Batch complete: ${success} succeeded, ${failed} failed`,
  RETRY_BUTTON: (count: number) => `Retry Failed (${count})`,
};

export const MODAL_CONFIG = {
  title: (count: number) => `Generate Scripts for ${count} Lessons`,
  description: 'Select lessons and configure generation options.',
  submitLabel: (count: number) => `Generate ${count} Scripts`,
};

export const ELIGIBLE_STATUSES = ['PENDING', 'SCRIPT_FAILED'] as const;
```

### State Persistence Pattern

**Batch generation state must persist across navigation:**

```typescript
// Store batch state in React Query cache
const BATCH_QUERY_KEY = ['batch-generation', courseSlug];

// When batch starts:
queryClient.setQueryData(BATCH_QUERY_KEY, {
  lessonStatuses: initialStatuses,
  startTime: Date.now(),
  isActive: true,
});

// Use staleTime: Infinity to prevent garbage collection:
useQuery({
  queryKey: BATCH_QUERY_KEY,
  queryFn: () => queryClient.getQueryData(BATCH_QUERY_KEY),
  staleTime: Infinity,
});

// Sync with lesson statuses from polling:
useEffect(() => {
  // When lessons query updates, sync batch statuses
  // Map lesson.status -> batchState.lessonStatuses
}, [lessonsData]);

// Clear when complete:
queryClient.removeQueries({ queryKey: BATCH_QUERY_KEY });
```

**"View Progress" button visibility:**

- Show when `batchState?.isActive === true`
- Position: In header area next to GenerateAllScriptsButton
- Opens BatchGenerationModal directly to 'progress' view

### Dependencies and Prerequisites

**Prerequisites:**

- Story 4.1: Generate Script Button (useScriptGeneration hook) ✅
- Story 4.2: Script Generation Configuration (modal pattern, tone selector) ✅
- Story 3.6: Real-time Status Indicators (polling mechanism) ✅

**External Dependencies:**

- ✅ Batch endpoint confirmed: `POST /api/courses/{slug}/generate-all-scripts`
- Existing polling mechanism (Story 3.6) handles individual status updates

### UI/UX Design Guidelines

**Button Placement:**

- Position "Generate All Scripts (X)" button in course header area
- Adjacent to "Add Lesson" button or in actions dropdown
- Priority: visible when course has pending lessons

**Modal Sizing:**

- Use `sm:max-w-[700px]` for wider modal to accommodate lesson list
- Max height with scroll for lesson list: `max-h-[300px] overflow-y-auto`

**Progress Indicators:**

- Overall: shadcn/ui `Progress` component with percentage
- Per-lesson: Icon-based status (spinner, check, X) with text
- Colors: blue for generating, green for completed, red for failed

**Toast Notifications:**

- Start: "Batch generation started for X lessons..."
- Complete: "Batch generation complete: X succeeded, Y failed"
- Individual completions handled by existing polling toasts

[Source: docs/ux-design-specification.md#Progress-Indicators]
[Source: docs/ux-design-specification.md#Button-Styles]

### References

- [Source: docs/epics.md#Story-4.6-Batch-Script-Generation] - Story requirements
- [Source: docs/architecture.md#Container-Pattern-CRITICAL] - Container pattern
- [Source: docs/architecture.md#API-Hook-Structure-Strict] - Hook naming conventions
- [Source: docs/ux-design-specification.md#Modal-Dialog-Patterns] - Modal design patterns
- [Source: src/hooks/useScriptGeneration.ts] - Existing generation hook
- [Source: src/components/ScriptGenerationModal/index.tsx] - Modal pattern reference
- [Source: docs/sprint-artifacts/4-5-regenerate-script.md] - Previous story learnings
- [Source: docs/sprint-artifacts/4-2-script-generation-configuration.md] - Configuration modal pattern
- [Source: docs/project_context.md] - AI agent implementation rules

## Dev Agent Record

### Context Reference

<!-- Path(s) to story context XML will be added here by context workflow -->

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

### File List

---

## Change Log

| Date       | Author         | Change                                                                                                                                                                                                                                                  |
| ---------- | -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 2025-12-11 | SM Agent (Bob) | Ultimate context engine analysis - story created with comprehensive developer guide                                                                                                                                                                     |
| 2025-12-12 | SM Agent (Bob) | Validation review - applied 10 improvements: fixed AC#1 eligible status, clarified batch endpoint (slug not id), consolidated task structure, added Constants Reference, added State Persistence Pattern, condensed verbose examples for LLM efficiency |
