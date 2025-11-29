# Story 3.1: Display Lesson List in Course Detail

Status: review

## Story

As a **Content Manager**,
I want to see all lessons of a course in an organized list,
so that I can understand the complete course structure and each lesson's status.

## Acceptance Criteria

1. **Given** I am on the course detail page with lessons, **When** the page loads, **Then** I see a table/list with all lessons ordered by `lessonNumber` field.

2. **Given** the lesson list is displayed, **Then** each row displays:
   - Drag handle (⋮⋮) for reordering (placeholder for Story 3.5)
   - Lesson title (primary text)
   - Duration in minutes
   - Status badge with semantic colors
   - Last updated timestamp (relative format < 7 days, absolute >= 7 days)
   - Actions menu (edit, delete icons)

3. **Given** lessons have different statuses, **Then** status badges use semantic colors:
   - PENDING: grey (#6b7280)
   - SCRIPT_GENERATING / AUDIO_GENERATING: blue (#7aa2f7) with pulse animation
   - SCRIPT_COMPLETED: orange (#e0af68)
   - COMPLETED: green (#9ece6a)
   - FAILED states: red (#f7768e)

4. **Given** a course has no lessons, **When** I view the course detail, **Then** I see an empty state with:
   - Icon (document with plus)
   - Title: "No lessons yet"
   - Description: "Create your first lesson to start building this course"
   - CTA button: "Add First Lesson" (primary cyan)

5. **Given** lessons are loading, **Then** I see skeleton placeholders matching the list layout.

6. **Given** an API error occurs while fetching lessons, **Then** I see an error state with retry button.

## Tasks / Subtasks

- [ ] **Task 1: Create LessonListItem component** (AC: #2, #3)
  - [ ] 1.1 Create `src/components/LessonListItem.tsx` with TypeScript props interface
  - [ ] 1.2 Implement row layout with drag handle, title, duration, status badge, timestamp, actions
  - [ ] 1.3 Add status badge with semantic color mapping based on lesson status
  - [ ] 1.4 Implement pulse animation for GENERATING states using Tailwind `animate-pulse`
  - [ ] 1.5 Format timestamps with date-fns (relative < 7 days, absolute >= 7 days)

- [ ] **Task 2: Create StatusBadge component** (AC: #3)
  - [ ] 2.1 Create `src/components/StatusBadge.tsx` component
  - [ ] 2.2 Implement color mapping for all lesson statuses (PENDING, SCRIPT_GENERATING, etc.)
  - [ ] 2.3 Add icon + text pattern for accessibility (not color-only)
  - [ ] 2.4 Add pulse animation variant for generating states

- [ ] **Task 3: Create LessonList component with data fetching** (AC: #1, #5, #6)
  - [ ] 3.1 Update `CourseDetail/connect.ts` to fetch lessons via `$api.useQuery('get', '/api/courses/{slug}/lessons')`
  - [ ] 3.2 Create `src/components/LessonList.tsx` to render list of `LessonListItem` components
  - [ ] 3.3 Order lessons by `lessonNumber` field from API response
  - [ ] 3.4 Implement loading skeleton for lesson list
  - [ ] 3.5 Implement error state with retry functionality

- [ ] **Task 4: Create LessonListEmpty component** (AC: #4)
  - [ ] 4.1 Create empty state component with icon, title, description
  - [ ] 4.2 Add "Add First Lesson" CTA button (placeholder - disabled for now, enabled in Story 3.2)
  - [ ] 4.3 Style with dashed border container per UX spec

- [ ] **Task 5: Integrate LessonList into CourseDetail** (AC: #1)
  - [ ] 5.1 Replace placeholder text in CourseDetail Lessons section
  - [ ] 5.2 Render LessonList component with lessons from API
  - [ ] 5.3 Handle empty/loading/error states appropriately

- [ ] **Task 6: Add date-fns dependency** (AC: #2)
  - [ ] 6.1 Install date-fns: `bun add --exact date-fns`
  - [ ] 6.2 Create utility function for timestamp formatting in `src/lib/utils.ts`

- [ ] **Task 7: Testing and validation** (AC: #1-6)
  - [ ] 7.1 Test with course that has lessons (verify ordering, status colors)
  - [ ] 7.2 Test with course that has no lessons (verify empty state)
  - [ ] 7.3 Test loading state (verify skeletons appear)
  - [ ] 7.4 Verify ARIA labels and keyboard accessibility
  - [ ] 7.5 Run `bun typecheck` and `bun lint:fix`

## Dev Notes

### Architecture Patterns and Constraints

This story follows the established **Container Pattern** where:

- `CourseDetail/connect.ts` handles ALL data fetching logic
- `CourseDetail/index.tsx` is purely presentational
- New components (`LessonListItem`, `StatusBadge`, `LessonList`) go in `src/components/`

**API Integration Pattern** - Use OpenAPI-first approach:

```typescript
// In CourseDetail/connect.ts
const lessonsQuery = $api.useQuery('get', '/api/courses/{slug}/lessons', {
  params: { path: { slug: courseSlug } },
});
```

**Lesson Status Values** from API (`LessonData.status`):

- `PENDING` - Not yet processed
- `SCRIPT_GENERATING` - Script generation in progress
- `SCRIPT_COMPLETED` - Script ready, audio not generated
- `AUDIO_GENERATING` - Audio generation in progress
- `AUDIO_COMPLETED` - Fully complete (COMPLETED in epics)
- `SCRIPT_FAILED` / `AUDIO_FAILED` - Generation failed

### Relevant Types from OpenAPI

```typescript
// From src/types/models.ts
export type Lesson = components['schemas']['LessonData'];

// LessonData structure (from api.d.ts):
{
  id: number;
  lessonNumber: number;
  title: string;
  corePractice: string;
  keyPoint: string;
  tone: string;
  durationMinutes: number;
  status: string;  // See status values above
  script?: Record<string, never> | null;
  audioUrl: string | null;
  scriptGeneratedAt: string | null;
  audioGeneratedAt: string | null;
  createdAt: string;  // ISO 8601
  updatedAt: string;  // ISO 8601
}
```

### Status Badge Color Mapping

Per UX Design Specification:
| Status | Hex | Tailwind Class | Icon |
|--------|-----|----------------|------|
| PENDING | #6b7280 | `text-muted` | ○ (circle) |
| SCRIPT_GENERATING | #7aa2f7 | `text-info` + `animate-pulse` | ⟳ (refresh) |
| AUDIO_GENERATING | #7aa2f7 | `text-info` + `animate-pulse` | ⟳ (refresh) |
| SCRIPT_COMPLETED | #e0af68 | `text-warning` | ◐ (half-circle) |
| AUDIO_COMPLETED | #9ece6a | `text-success` | ✓ (check) |
| \*\_FAILED | #f7768e | `text-error` | ✕ (x) |

### Timestamp Formatting Pattern

Per UX spec, use relative timestamps for recent items:

```typescript
import { formatDistance, format, differenceInDays } from 'date-fns';

function formatTimestamp(date: string): string {
  const d = new Date(date);
  const now = new Date();
  const daysDiff = differenceInDays(now, d);

  if (daysDiff < 7) {
    return formatDistance(d, now, { addSuffix: true }); // "2 hours ago"
  }
  return format(d, 'MMM d, yyyy'); // "Nov 28, 2025"
}
```

### Project Structure Notes

Files to create:

- `src/components/LessonListItem.tsx` - Individual lesson row component
- `src/components/StatusBadge.tsx` - Reusable status indicator
- `src/components/LessonList.tsx` - List container with loading/empty/error states
- `src/components/LessonListEmpty.tsx` - Empty state component

Files to modify:

- `src/containers/Main/CourseDetail/connect.ts` - Add lessons query
- `src/containers/Main/CourseDetail/index.tsx` - Replace placeholder with LessonList
- `src/lib/utils.ts` - Add timestamp formatting utility

### shadcn/ui Components to Use

- `Table`, `TableHeader`, `TableRow`, `TableCell` - For lesson list structure
- `Badge` - Base for StatusBadge (with custom colors)
- `Button` - For action icons and CTA
- `Skeleton` - For loading states
- Icons from `lucide-react`: `GripVertical`, `Pencil`, `Trash2`, `Plus`, `FileText`, `Clock`, `RefreshCw`, `Check`, `X`, `Circle`, `Loader2`

### Accessibility Requirements

- Table uses proper `<th>` headers with `scope="col"`
- Status badges include icon + text (not color-only)
- Action buttons have `aria-label` attributes
- Focus visible on all interactive elements
- Drag handle: `aria-label="Reorder lesson"` (functional in Story 3.5)

### References

- [Source: docs/epics.md#Story-3.1] - Story requirements and acceptance criteria
- [Source: docs/architecture.md#Container-Pattern] - Container pattern implementation
- [Source: docs/architecture.md#API-Architecture-OpenAPI-First] - API integration approach
- [Source: docs/ux-design-specification.md#Status-Badge] - Status badge design
- [Source: docs/ux-design-specification.md#Date-Time-Patterns] - Timestamp formatting rules
- [Source: docs/ux-design-specification.md#Empty-State-Patterns] - Empty state design
- [Source: src/types/api.d.ts#LessonData] - Lesson data schema

## Dev Agent Record

### Context Reference

- `docs/sprint-artifacts/3-1-display-lesson-list.context.xml`

### Agent Model Used

Claude Opus 4.5 (Preview)

### Debug Log References

- Installed date-fns@4.1.0 via `bun add --exact date-fns`
- TypeScript validation passed (`bun typecheck`)
- ESLint validation passed (`bun lint:fix`)

### Completion Notes List

- **AC #1**: Lessons displayed in table ordered by `lessonNumber` (ascending sort in LessonList.tsx)
- **AC #2**: Each row displays drag handle, title, duration, status badge, timestamp, and action buttons
- **AC #3**: Status badges use semantic colors with icons (gray/pending, blue+spin/generating, orange/script-ready, green/completed, red/failed)
- **AC #4**: Empty state component with FilePlus2 icon, "No lessons yet" title, description, and disabled "Add First Lesson" CTA (cyan)
- **AC #5**: Skeleton loading state with 4 placeholder rows matching table layout
- **AC #6**: Error state with AlertCircle icon, message, and Retry button triggering refetch
- All components follow Container Pattern: data fetching in connect.ts, presentation in components
- Accessibility: ARIA labels on all interactive elements, scope="col" on headers, sr-only for icon-only columns

### File List

**NEW:**

- `src/components/StatusBadge.tsx`
- `src/components/LessonListItem.tsx`
- `src/components/LessonList.tsx`
- `src/components/LessonListEmpty.tsx`

**MODIFIED:**

- `src/lib/utils.ts` (added formatTimestamp function)
- `src/containers/Main/CourseDetail/connect.ts` (added lessons query)
- `src/containers/Main/CourseDetail/index.tsx` (integrated LessonList component)
- `package.json` (added date-fns dependency)

---

## Change Log

| Date       | Author         | Change                                        |
| ---------- | -------------- | --------------------------------------------- |
| 2025-11-28 | SM Agent (Bob) | Initial story creation from Epic 3, Story 3.1 |
