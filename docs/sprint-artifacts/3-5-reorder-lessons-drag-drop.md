# Story 3.5: Reorder Lessons with Drag-and-Drop

Status: ready-for-dev

## Story

As a **Content Manager**,
I want to reorder lessons by dragging them,
so that I can adjust the pedagogical flow easily.

## Acceptance Criteria

1. **Given** I see the lesson list with 2+ lessons, **When** I grab a lesson by its drag handle (⋮⋮), **Then**:
   - The cursor changes to grabbing
   - I see visual feedback (ghost element follows cursor)
   - The lesson row has elevated visual treatment

2. **Given** I am dragging a lesson, **When** I drag over another position, **Then**:
   - I see a drop zone indicator (line or highlight between rows)
   - Other lessons visually shift to make room for the drop target

3. **Given** I am dragging a lesson, **When** I drop the lesson in a new position, **Then**:
   - The order updates immediately (optimistic update)
   - The new order is saved to backend
   - A brief toast appears: "Order saved"
   - The lesson numbers update to reflect new positions

4. **Given** a reorder API request fails, **Then**:
   - The order reverts to original positions (rollback)
   - An error toast shows: "Failed to update order. Please try again."

5. **Given** I am using keyboard navigation, **Then** drag-and-drop is accessible:
   - Tab to focus the drag handle
   - Enter/Space to start drag mode
   - Arrow Up/Down to move position
   - Enter to confirm, Escape to cancel
   - Screen reader announces: "Lesson [title] moved to position [n]"

6. **Given** there is only 1 lesson, **Then**:
   - The drag handle is visible but non-functional (disabled state)
   - No reorder actions are possible

## Tasks / Subtasks

- [ ] **Task 1: Install @dnd-kit dependencies** (AC: #1, #2, #5)
  - [ ] 1.1 Run `bun add --exact @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities`
  - [ ] 1.2 Run `bun typecheck` to verify no type conflicts
  - [ ] 1.3 Document any peer dependency warnings

- [ ] **Task 2: Create LessonReorder container structure** (AC: #3, #4)
  - [ ] 2.1 Create `src/containers/Main/LessonReorder/` directory
  - [ ] 2.2 Create `connect.ts` with reorder mutation and optimistic update logic
  - [ ] 2.3 Create `types.ts` with ReorderParams interface
  - [ ] 2.4 Create `constants.ts` with any needed schemas

- [ ] **Task 3: Implement reorder mutation in connect.ts** (AC: #3, #4)
  - [ ] 3.1 Implement `$api.useMutation('patch', '/api/courses/{slug}/lessons/reorder')` with proper body structure
  - [ ] 3.2 Build request body as `{ lessons: [{ lesson_id, lesson_number }] }` from reordered items
  - [ ] 3.3 Implement `onMutate` for optimistic updates (cache snapshot + update)
  - [ ] 3.4 Implement `onError` with rollback to previous lesson order
  - [ ] 3.5 Implement `onSuccess` with toast notification
  - [ ] 3.6 Handle query cache invalidation for lessons query

- [ ] **Task 4: Create SortableLessonItem component** (AC: #1, #2)
  - [ ] 4.1 Create `src/components/SortableLessonItem.tsx`
  - [ ] 4.2 Integrate `useSortable` hook from @dnd-kit/sortable
  - [ ] 4.3 Apply drag handle using `attributes` and `listeners` on GripVertical button
  - [ ] 4.4 Style dragging state (transform, opacity, elevated shadow)
  - [ ] 4.5 Ensure existing edit/delete callbacks still work

- [ ] **Task 5: Create SortableLessonList component** (AC: #1, #2, #3)
  - [ ] 5.1 Create `src/components/SortableLessonList.tsx`
  - [ ] 5.2 Wrap table body with `DndContext` and `SortableContext`
  - [ ] 5.3 Configure `closestCenter` collision detection strategy
  - [ ] 5.4 Implement `handleDragEnd` callback with reorder logic
  - [ ] 5.5 Create custom `DragOverlay` for smooth dragging visualization
  - [ ] 5.6 Add drop indicator line between rows during drag

- [ ] **Task 6: Implement keyboard accessibility** (AC: #5)
  - [ ] 6.1 Configure `KeyboardSensor` from @dnd-kit with proper activation
  - [ ] 6.2 Add `useSensors` hook with PointerSensor and KeyboardSensor
  - [ ] 6.3 Implement keyboard coordinate getter for vertical sorting
  - [ ] 6.4 Add `aria-describedby` announcements for screen readers
  - [ ] 6.5 Create `announcements` prop for DndContext with proper messages

- [ ] **Task 7: Integrate with CourseDetail container** (AC: #1-6)
  - [ ] 7.1 Replace `LessonList` with `SortableLessonList` in CourseDetail
  - [ ] 7.2 Pass courseSlug and mutation handlers from CourseDetail connect.ts
  - [ ] 7.3 Add `handleReorderLessons` callback to CourseDetail connect.ts
  - [ ] 7.4 Ensure edit/delete modals still function correctly with new structure

- [ ] **Task 8: Handle edge cases** (AC: #6)
  - [ ] 8.1 Disable drag when only 1 lesson exists
  - [ ] 8.2 Handle concurrent updates (refetch on reorder complete)
  - [ ] 8.3 Add loading state during reorder API call

- [ ] **Task 9: Testing and validation** (AC: #1-6)
  - [ ] 9.1 Run `bun typecheck` - verify no type errors
  - [ ] 9.2 Run `bun lint:fix` - verify no lint errors
  - [ ] 9.3 Manual test: drag lesson to new position, verify order updates
  - [ ] 9.4 Manual test: keyboard reorder with Tab → Enter → Arrow → Enter
  - [ ] 9.5 Manual test: simulate API error, verify rollback
  - [ ] 9.6 Manual test: verify edit/delete still work after reorder
  - [ ] 9.7 Manual test: verify toast notifications appear correctly

## Dev Notes

### Architecture Patterns and Constraints

This story follows the established **Container Pattern** where:

- Business logic for reorder mutation goes in container's `connect.ts`
- `SortableLessonList` handles DnD context and coordination
- `SortableLessonItem` wraps individual lesson rows with sortable behavior

**OpenAPI-First API Integration Pattern:**

The backend provides a dedicated endpoint for batch reordering:

```typescript
// API Endpoint: PATCH /api/courses/{slug}/lessons/reorder
// Request body: { lessons: [{ lesson_id: number, lesson_number: number }] }
// Response: LessonsListResponse (updated lessons list)

interface ReorderLessonItem {
  lesson_id: number; // The ID of the lesson to reorder
  lesson_number: number; // The new position/order number (1-based)
}

interface ReorderLessonsRequest {
  lessons: ReorderLessonItem[];
}

const reorderMutation = $api.useMutation(
  'patch',
  '/api/courses/{slug}/lessons/reorder',
  {
    onMutate: async (variables) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({
        queryKey: ['get', '/api/courses/{slug}/lessons'],
      });

      // Snapshot previous value
      const previousLessons = queryClient.getQueryData([
        'get',
        '/api/courses/{slug}/lessons',
      ]);

      // Optimistically update to new order
      queryClient.setQueryData(
        ['get', '/api/courses/{slug}/lessons'],
        (old) => ({
          ...old,
          lessons: reorderLessons(old?.lessons, variables.body.lessons),
        }),
      );

      return { previousLessons };
    },
    onError: (err, variables, context) => {
      // Rollback on error
      queryClient.setQueryData(
        ['get', '/api/courses/{slug}/lessons'],
        context?.previousLessons,
      );
      toast.error('Failed to update order. Please try again.');
    },
    onSuccess: () => {
      toast.success('Order saved');
    },
  },
);
```

**✅ API Endpoint Available:**

- **Endpoint:** `PATCH /api/courses/{slug}/lessons/reorder`
- **Path Parameter:** `slug: string` - Course slug
- **Request Body:** `ReorderLessonsRequest` with array of `{ lesson_id, lesson_number }`
- **Response:** `LessonsListResponse` - Updated list of lessons with new order

[Source: src/types/api.d.ts#reorder_lessons_api_courses__slug__lessons_reorder_patch]

### @dnd-kit Implementation Pattern

**Required dependencies:**

```bash
bun add --exact @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
```

**Core @dnd-kit concepts:**

- `DndContext`: Provider component that enables drag and drop
- `SortableContext`: Provides sorting context for sortable items
- `useSortable`: Hook that makes an item sortable
- `DragOverlay`: Renders the dragged item overlay for smooth animations
- `closestCenter`: Collision detection algorithm for vertical lists

**Implementation structure:**

```typescript
// SortableLessonList.tsx
import { DndContext, closestCenter, DragOverlay, type DragEndEvent } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';

<DndContext
  sensors={sensors}
  collisionDetection={closestCenter}
  onDragEnd={handleDragEnd}
>
  <SortableContext items={lessonIds} strategy={verticalListSortingStrategy}>
    <TableBody>
      {sortedLessons.map((lesson) => (
        <SortableLessonItem key={lesson.id} lesson={lesson} ... />
      ))}
    </TableBody>
  </SortableContext>
  <DragOverlay>
    {activeLesson ? <LessonListItem lesson={activeLesson} isDragOverlay /> : null}
  </DragOverlay>
</DndContext>
```

```typescript
// SortableLessonItem.tsx
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
  useSortable({
    id: lesson.id,
  });

const style = {
  transform: CSS.Transform.toString(transform),
  transition,
  opacity: isDragging ? 0.5 : 1,
};
```

[Source: docs/architecture.md#Drag-and-Drop-dnd-kit]

### Keyboard Accessibility Requirements

Per WCAG 2.1 AA and project UX specification:

```typescript
import {
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';

const sensors = useSensors(
  useSensor(PointerSensor, {
    activationConstraint: {
      distance: 8, // 8px drag threshold before activation
    },
  }),
  useSensor(KeyboardSensor, {
    coordinateGetter: sortableKeyboardCoordinates,
  }),
);

// Accessibility announcements
const announcements = {
  onDragStart({ active }) {
    return `Picked up lesson ${active.id}. Use arrow keys to move, Enter to drop, Escape to cancel.`;
  },
  onDragOver({ active, over }) {
    if (over) {
      return `Lesson ${active.id} is over position ${over.id}.`;
    }
    return `Lesson ${active.id} is no longer over a droppable area.`;
  },
  onDragEnd({ active, over }) {
    if (over) {
      return `Lesson ${active.id} was dropped at position ${over.id}.`;
    }
    return `Lesson ${active.id} was dropped.`;
  },
  onDragCancel({ active }) {
    return `Dragging cancelled. Lesson ${active.id} was returned to its original position.`;
  },
};
```

[Source: docs/ux-design-specification.md#Accessibility-Patterns]

### Visual Styling for Drag States

Per UX Design Specification:

- **Drag handle (⋮⋮)**: `cursor-grab` on hover, `cursor-grabbing` while dragging
- **Dragging item**: Elevated shadow, slightly reduced opacity (0.5), cyan border
- **Drop indicator**: 2px cyan line between rows at drop target position
- **Disabled state** (single lesson): Grey out drag handle, `cursor-not-allowed`

```css
/* Tailwind classes for drag states */
.dragging {
  @apply shadow-lg border-2 border-primary opacity-50;
}

.drag-handle {
  @apply cursor-grab hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring;
}

.drag-handle:active {
  @apply cursor-grabbing;
}

.drop-indicator {
  @apply h-0.5 bg-primary rounded-full;
}
```

[Source: docs/ux-design-specification.md#Interactive-States]

### Component Integration Pattern

The new sortable components integrate with existing CourseDetail:

```
CourseDetail (container)
├── connect.ts (adds handleReorderLessons)
└── index.tsx
    ├── SortableLessonList (new - wraps DnD context)
    │   └── SortableLessonItem (new - sortable wrapper)
    │       └── LessonListItem (existing - presentation)
    ├── LessonCreate (existing)
    ├── LessonEdit (existing)
    └── LessonDelete (existing)
```

**Key integration points:**

1. Replace `<LessonList>` with `<SortableLessonList>` in CourseDetail
2. Pass mutation handler from connect.ts to SortableLessonList
3. SortableLessonItem wraps existing LessonListItem for presentation
4. Edit/delete callbacks pass through unchanged

[Source: docs/architecture.md#Container-Pattern]

### Learnings from Previous Story

**From Story 3-4-delete-lesson (Status: review)**

- **AlertDialog pattern**: Used for confirmations - relevant if we add reorder undo
- **CourseDetail state management**: Pattern for managing modal states works well
- **Cache invalidation**: `refetchLessons()` called on success - follow same for reorder
- **Toast notifications**: Success/error toasts work correctly

**Key files from Epic 3:**

- `src/components/LessonList.tsx` - Current list component to extend
- `src/components/LessonListItem.tsx` - Row component with drag handle placeholder
- `src/containers/Main/CourseDetail/connect.ts` - Orchestration logic

[Source: docs/sprint-artifacts/3-4-delete-lesson.md#Dev-Agent-Record]

### Project Structure Notes

**Files to create:**

- `src/containers/Main/LessonReorder/connect.ts` - Reorder mutation and optimistic update logic
- `src/containers/Main/LessonReorder/types.ts` - ReorderParams interface
- `src/components/SortableLessonList.tsx` - DnD context wrapper for lesson table
- `src/components/SortableLessonItem.tsx` - Sortable wrapper for lesson row

**Files to modify:**

- `src/containers/Main/CourseDetail/connect.ts` - Add reorder handler
- `src/containers/Main/CourseDetail/index.tsx` - Replace LessonList with SortableLessonList
- `src/components/LessonListItem.tsx` - Add support for drag handle activation
- `package.json` - Add @dnd-kit dependencies

**Files unchanged:**

- `src/components/LessonList.tsx` - Keep for fallback/non-sortable scenarios
- `src/components/LessonListEmpty.tsx` - Empty state unchanged

### Optimistic Update Pattern

Per React Query best practices:

```typescript
// Reorder helper function
function reorderLessons(
  lessons: Lesson[] | undefined,
  orderedIds: number[],
): Lesson[] {
  if (!lessons) return [];

  return orderedIds.map((id, index) => {
    const lesson = lessons.find((l) => l.id === id);
    if (!lesson) throw new Error(`Lesson ${id} not found`);
    return { ...lesson, lessonNumber: index + 1 };
  });
}

// onMutate captures previous state for rollback
const context = { previousLessons: queryClient.getQueryData(queryKey) };

// onError restores previous state
queryClient.setQueryData(queryKey, context.previousLessons);
```

[Source: docs/architecture.md#Optimistic-Update-Pattern]

### Testing Strategy

Per project testing standards:

- Verify drag interaction initiates on mousedown + movement
- Verify drop updates lesson order visually
- Test keyboard navigation (Tab, Enter, Arrow, Enter)
- Test Escape cancels drag without changes
- Verify API error shows error toast and reverts order
- Test with 1 lesson (drag should be disabled)
- Test with many lessons (10+) for performance
- Verify screen reader announcements fire correctly

[Source: docs/architecture.md#Testing-Strategy]

### References

- [Source: docs/epics.md#Story-3.5] - Story requirements and acceptance criteria
- [Source: docs/architecture.md#Drag-and-Drop-dnd-kit] - DnD library choice and rationale
- [Source: docs/architecture.md#Container-Pattern] - Container pattern implementation
- [Source: docs/architecture.md#API-Architecture-OpenAPI-First] - API integration approach
- [Source: docs/architecture.md#Optimistic-Update-Pattern] - Optimistic update with rollback
- [Source: docs/ux-design-specification.md#Accessibility-Patterns] - Keyboard accessibility
- [Source: docs/ux-design-specification.md#Journey-5-Manage-Lesson-Collection] - Reorder UX flow
- [Source: docs/sprint-artifacts/3-4-delete-lesson.md#Dev-Agent-Record] - Previous story patterns
- [Source: src/components/LessonListItem.tsx] - Existing drag handle placeholder

## Dev Agent Record

### Context Reference

- `docs/sprint-artifacts/3-5-reorder-lessons-drag-drop.context.xml`

### Agent Model Used

Claude Opus 4.5 (Preview)

### Debug Log References

### Completion Notes List

### File List

---

## Change Log

| Date       | Author         | Change                                        |
| ---------- | -------------- | --------------------------------------------- |
| 2025-11-30 | SM Agent (Bob) | Initial story creation from Epic 3, Story 3.5 |
