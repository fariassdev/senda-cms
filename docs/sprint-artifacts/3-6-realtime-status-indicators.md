# Story 3.6: Real-time Status Indicators

Status: ready-for-dev

## Story

As a **Content Manager**,
I want to see generation status update in real-time,
so that I know when my scripts/audio are ready without refreshing.

## Acceptance Criteria

1. **Given** a lesson has status `SCRIPT_GENERATING` or `AUDIO_GENERATING`, **When** I view the lesson list, **Then**:
   - The status badge shows a pulse/spinner animation (blue #7aa2f7)
   - The badge displays the generating status text with spinning icon

2. **Given** lessons are in a generating state, **When** I view the course detail page, **Then**:
   - React Query polls the course endpoint every 5 seconds
   - Polling is automatic and requires no user interaction

3. **Given** polling is active, **When** a lesson's status changes to `SCRIPT_COMPLETED`, **Then**:
   - Polling stops for that lesson (no more generating lessons)
   - Badge updates to orange (#e0af68) with checkmark icon
   - Toast notification: "Script ready for [lesson title]"

4. **Given** polling is active, **When** a lesson's status changes to `COMPLETED`, **Then**:
   - Polling stops for that lesson
   - Badge updates to green (#9ece6a) with checkmark icon
   - Toast notification: "Audio ready for [lesson title]"

5. **Given** polling is active, **When** a lesson's status changes to `FAILED`, **Then**:
   - Polling stops for that lesson
   - Badge updates to red (#f7768e) with X icon
   - Toast error: "Generation failed for [lesson title]"

6. **Given** no lessons are in `SCRIPT_GENERATING` or `AUDIO_GENERATING` status, **Then**:
   - Polling is disabled (no unnecessary API calls)
   - No refetchInterval is set on the query

7. **Given** multiple lessons are generating simultaneously, **When** one completes, **Then**:
   - Toast notification appears for the completed lesson
   - Polling continues for remaining generating lessons
   - All status updates are tracked independently

8. **Given** I navigate away and return to the course detail page, **Then**:
   - Polling resumes if any lessons are still generating
   - The correct generating animation is displayed

## Tasks / Subtasks

- [ ] **Task 1: Enhance StatusBadge component with animations** (AC: #1)
  - [ ] 1.1 Add spinning icon for SCRIPT_GENERATING and AUDIO_GENERATING states
  - [ ] 1.2 Add `animate-pulse` class to generating status badges
  - [ ] 1.3 Add checkmark icon (✓) for SCRIPT_COMPLETED and COMPLETED states
  - [ ] 1.4 Add X icon (✕) for FAILED states
  - [ ] 1.5 Ensure icons are accessible with aria-labels

- [ ] **Task 2: Implement dynamic polling in CourseDetail connect.ts** (AC: #2, #6)
  - [ ] 2.1 Add `refetchInterval` callback function to useQuery
  - [ ] 2.2 Implement `hasGeneratingLessons` helper function
  - [ ] 2.3 Return 5000ms interval when generating, false otherwise
  - [ ] 2.4 Add `previousLessonsRef` to track status changes between polls

- [ ] **Task 3: Implement status change detection** (AC: #3, #4, #5, #7)
  - [ ] 3.1 Create `usePreviousLessons` hook or useRef to store previous data
  - [ ] 3.2 Compare current vs previous lesson statuses on each poll
  - [ ] 3.3 Detect transitions: GENERATING → COMPLETED, GENERATING → FAILED
  - [ ] 3.4 Extract lesson titles for notification messages

- [ ] **Task 4: Add toast notifications for status changes** (AC: #3, #4, #5, #7)
  - [ ] 4.1 Show success toast "Script ready for [title]" on SCRIPT_COMPLETED
  - [ ] 4.2 Show success toast "Audio ready for [title]" on COMPLETED (audio)
  - [ ] 4.3 Show error toast "Generation failed for [title]" on FAILED
  - [ ] 4.4 Handle multiple simultaneous transitions (multiple toasts)

- [ ] **Task 5: Create polling constants** (AC: #2)
  - [ ] 5.1 Add constants.ts to CourseDetail container
  - [ ] 5.2 Define POLLING_INTERVAL = 5000 constant
  - [ ] 5.3 Define GENERATING_STATUSES array

- [ ] **Task 6: Update LessonReorder to support polling** (AC: #8)
  - [ ] 6.1 Ensure pending order state resets when polled data changes
  - [ ] 6.2 Verify reorder state handles status transitions correctly
  - [ ] 6.3 Handle case where generating lesson becomes COMPLETED

- [ ] **Task 7: Testing and validation** (AC: #1-8)
  - [ ] 7.1 Run `bun typecheck` - verify no type errors
  - [ ] 7.2 Run `bun lint:fix` - verify no lint errors
  - [ ] 7.3 Manual test: verify generating lessons show animated badge
  - [ ] 7.4 Manual test: verify polling stops when no generating lessons
  - [ ] 7.5 Manual test: verify toast appears on status completion
  - [ ] 7.6 Manual test: verify toast error appears on failure
  - [ ] 7.7 Manual test: verify multiple generating lessons poll correctly
  - [ ] 7.8 Manual test: navigate away and back, verify polling resumes

## Dev Notes

### Architecture Patterns and Constraints

This story follows the established **Container Pattern** where:

- Polling logic goes in `connect.ts` for CourseDetail container
- StatusBadge component is enhanced with animation states (presentational)
- Status change detection uses React refs to compare previous vs current data

**React Query Polling Pattern:**

The key pattern is using a callback function for `refetchInterval` that dynamically enables/disables polling:

```typescript
// In connect.ts
const { data: course } = $api.useQuery('get', '/api/courses/{slug}', {
  params: { path: { slug } },
  refetchInterval: (query) => {
    const lessons = query.state.data?.lessons;
    const hasGenerating = lessons?.some(
      (l) =>
        l.status === 'SCRIPT_GENERATING' || l.status === 'AUDIO_GENERATING',
    );
    return hasGenerating ? 5000 : false; // Poll every 5s or disable
  },
});
```

[Source: docs/architecture.md#Real-time-Updates-React-Query-Polling]

### Status Change Detection Pattern

To detect status changes and trigger notifications, we compare previous and current lesson data:

```typescript
// Pattern for detecting status changes
const previousLessonsRef = useRef<Lesson[] | null>(null);

useEffect(() => {
  if (!course?.lessons) return;

  const previousLessons = previousLessonsRef.current;
  if (previousLessons) {
    course.lessons.forEach((lesson) => {
      const prev = previousLessons.find((p) => p.id === lesson.id);
      if (!prev) return;

      // Detect: GENERATING → COMPLETED
      const wasGenerating =
        prev.status === 'SCRIPT_GENERATING' ||
        prev.status === 'AUDIO_GENERATING';

      if (wasGenerating && lesson.status === 'SCRIPT_COMPLETED') {
        toast.success(`Script ready for ${lesson.title}`);
      }
      if (wasGenerating && lesson.status === 'COMPLETED') {
        toast.success(`Audio ready for ${lesson.title}`);
      }
      if (wasGenerating && lesson.status.includes('FAILED')) {
        toast.error(`Generation failed for ${lesson.title}`);
      }
    });
  }

  previousLessonsRef.current = course.lessons;
}, [course?.lessons]);
```

### StatusBadge Animation Requirements

Per UX Design Specification, status badges must:

- **PENDING**: Grey (#6b7280), no animation
- **SCRIPT_GENERATING / AUDIO_GENERATING**: Blue (#7aa2f7) with pulse animation + spinning icon
- **SCRIPT_COMPLETED**: Orange (#e0af68) with checkmark icon
- **COMPLETED**: Green (#9ece6a) with checkmark icon
- **FAILED**: Red (#f7768e) with X icon

```typescript
// StatusBadge animation classes
const getStatusConfig = (status: LessonStatus) => {
  switch (status) {
    case 'SCRIPT_GENERATING':
    case 'AUDIO_GENERATING':
      return {
        color: 'bg-info/20 text-info',
        icon: <Loader2 className="h-3 w-3 animate-spin" />,
        pulse: true,
      };
    case 'SCRIPT_COMPLETED':
      return {
        color: 'bg-warning/20 text-warning',
        icon: <CheckCircle className="h-3 w-3" />,
        pulse: false,
      };
    case 'COMPLETED':
      return {
        color: 'bg-success/20 text-success',
        icon: <CheckCircle className="h-3 w-3" />,
        pulse: false,
      };
    case 'FAILED':
      return {
        color: 'bg-error/20 text-error',
        icon: <XCircle className="h-3 w-3" />,
        pulse: false,
      };
    default:
      return {
        color: 'bg-muted/20 text-muted-foreground',
        icon: null,
        pulse: false,
      };
  }
};
```

[Source: docs/ux-design-specification.md#Color-System]
[Source: docs/epics.md#Story-3.6]

### Integration with LessonReorder

The polling mechanism must work correctly with the reorder feature from Story 3.5:

- When lessons data changes from polling, pending reorder state should NOT reset automatically
- Only reset pending order when user explicitly adds/edits/deletes lessons
- Status changes from polling should update the display without affecting reorder state

```typescript
// In connect.ts, modify getReorderState to handle polling updates
// The displayLessons should update status badges but preserve pending order positions
```

[Source: docs/sprint-artifacts/3-5-reorder-lessons-drag-drop.md#Dev-Agent-Record]

### Project Structure Notes

**Files to modify:**

- `src/components/StatusBadge.tsx` - Add animation classes and icons
- `src/containers/Main/CourseDetail/connect.ts` - Add polling logic and status detection
- `src/containers/Main/CourseDetail/constants.ts` - Add polling constants (create if not exists)

**Files unchanged:**

- `src/components/SortableLessonList.tsx` - Receives updated data via props
- `src/components/SortableLessonItem.tsx` - Renders updated StatusBadge
- `src/components/LessonListItem.tsx` - Uses StatusBadge for display

### Toast Notification Patterns

Per UX Design Specification:

- **Success toasts**: Auto-dismiss in 4 seconds
- **Error toasts**: Auto-dismiss in 6 seconds (longer to read)
- Position: Top-right
- Multiple toasts stack vertically

```typescript
import { toast } from 'sonner';

// Success notification
toast.success(`Script ready for ${lesson.title}`);

// Error notification
toast.error(`Generation failed for ${lesson.title}`);
```

[Source: docs/architecture.md#Error-Handling-Strategy]

### Learnings from Previous Story

**From Story 3-5-reorder-lessons-drag-drop (Status: review)**

- **LessonReorder container**: Created for reorder state management - avoid conflicts
- **pendingOrder state**: Must be preserved during polling updates
- **SortableLessonList**: Receives `displayLessons` - now may receive updated statuses
- **Cache invalidation**: `refetchLessons()` works - polling will use same pattern
- **Toast notifications**: Pattern established - follow same approach

**Key files from Story 3.5:**

- `src/containers/Main/LessonReorder/connect.ts` - Reorder state management
- `src/containers/Main/CourseDetail/connect.ts` - Main orchestration
- `src/components/StatusBadge.tsx` - Status display (needs animation)

[Source: docs/sprint-artifacts/3-5-reorder-lessons-drag-drop.md#Dev-Agent-Record]

### LessonStatus Type Reference

From OpenAPI-generated types:

```typescript
export type LessonStatus =
  | 'PENDING'
  | 'SCRIPT_GENERATING'
  | 'SCRIPT_COMPLETED'
  | 'AUDIO_GENERATING'
  | 'COMPLETED'
  | 'FAILED';
```

The generating statuses that trigger polling:

- `SCRIPT_GENERATING`
- `AUDIO_GENERATING`

[Source: src/types/models.ts]

### Testing Strategy

Per project testing standards:

- Verify animated badge appears for GENERATING statuses
- Test that polling interval is 5000ms when generating lessons exist
- Test that polling stops when no generating lessons
- Verify toast notifications appear for each status transition
- Test multiple simultaneous transitions (edge case)
- Test navigation away and back preserves correct state
- Verify reorder state is preserved during polling updates
- Verify accessibility: animated icons have aria-labels

[Source: docs/architecture.md#Testing-Strategy]

### References

- [Source: docs/epics.md#Story-3.6] - Story requirements and acceptance criteria
- [Source: docs/architecture.md#Real-time-Updates-React-Query-Polling] - Polling pattern
- [Source: docs/architecture.md#Error-Handling-Strategy] - Toast notification patterns
- [Source: docs/ux-design-specification.md#Color-System] - Semantic status colors
- [Source: docs/ux-design-specification.md#Journey-3-Generate-Lesson-Scripts] - Status update UX
- [Source: docs/sprint-artifacts/3-5-reorder-lessons-drag-drop.md] - Previous story patterns
- [Source: src/types/models.ts] - LessonStatus type definition
- [Source: src/components/StatusBadge.tsx] - Current StatusBadge implementation

## Dev Agent Record

### Context Reference

- `docs/sprint-artifacts/3-6-realtime-status-indicators.context.xml`

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

### File List

---

## Change Log

| Date       | Author         | Change                                        |
| ---------- | -------------- | --------------------------------------------- |
| 2025-11-30 | SM Agent (Bob) | Initial story creation from Epic 3, Story 3.6 |
