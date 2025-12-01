# Story 4.3: View and Preview Generated Script

Status: ready-for-dev

## Story

As a **Content Manager**,
I want to view the generated script for a lesson,
so that I can review the content before generating audio.

## Acceptance Criteria

1. **Given** a lesson has status `SCRIPT_COMPLETED` or higher (e.g., `AUDIO_GENERATING`, `COMPLETED`), **When** I click on the lesson row or a "View Script" action, **Then**:
   - I navigate to the Script Preview page at `/courses/[slug]/lessons/[id]/script`
   - The page loads the lesson data including the script array

2. **Given** I am on the Script Preview page, **When** the page loads, **Then** I see:
   - **Header Section:**
     - "Back to Course" link/button (ghost style, left arrow icon)
     - Lesson title as page heading (h1)
     - Status badge showing current lesson status
     - Last updated timestamp (relative format if < 7 days)
   - **Script Content Area:**
     - Script parts rendered in a readable format
     - `speak` parts displayed as paragraphs with proper typography
     - `pause` parts displayed as visual cues (e.g., "[PAUSE 3s]" styled distinctly)
   - **Metrics Section:**
     - Word count (sum of all `speak` part content words)
     - Estimated reading time (calculated at ~150 words/minute for meditation pace)
     - Character count (total characters in all `speak` parts)

3. **Given** the script contains both `speak` and `pause` parts, **When** I view the script, **Then**:
   - `speak` parts are displayed as readable text blocks with adequate line height (1.6)
   - `pause` parts are visually distinct with:
     - A styled badge/tag showing "[PAUSE Xs]" where X is the duration
     - Subtle background or border to differentiate from speak content
     - Proper spacing above and below

4. **Given** I am viewing the script, **When** I look at the action buttons, **Then** I see:
   - "Edit Script" button (primary cyan) - navigates to edit mode (Story 4.4, can be placeholder)
   - "Generate Audio" button (secondary) - enabled only if status is `SCRIPT_COMPLETED`, disabled otherwise with tooltip explaining why
   - "Regenerate Script" button (outline) - opens regeneration flow (Story 4.5, can be placeholder)
   - "Back to Course" button (ghost) - navigates back to course detail page

5. **Given** the lesson does NOT have a completed script (status is `PENDING`, `SCRIPT_GENERATING`, or `SCRIPT_FAILED`), **When** I try to access the Script Preview page directly via URL, **Then**:
   - I see an empty state with:
     - Icon (document with question mark or similar)
     - Title: "No script available"
     - Description based on status:
       - PENDING: "Generate a script first to preview it here."
       - SCRIPT_GENERATING: "Script is currently being generated. Please wait..."
       - SCRIPT_FAILED: "Script generation failed. Try regenerating."
     - CTA button: "Back to Course" (primary)
   - The page does NOT show an error, just a helpful empty state

6. **Given** I am on the Script Preview page, **When** I view the page on mobile, **Then**:
   - The layout adapts responsively (single column)
   - Action buttons stack vertically
   - Script content remains readable with appropriate font size
   - Header condenses but remains functional

7. **Given** the API call to fetch lesson data fails, **When** the page loads, **Then**:
   - I see an error state with:
     - Error icon
     - Title: "Failed to load script"
     - Description: Error message from API or generic "Please try again"
     - CTA: "Try Again" button that refetches data

8. **Given** I click the "Back to Course" button, **When** the navigation occurs, **Then**:
   - I am navigated back to `/courses/[slug]` (course detail page)
   - The lesson list is visible with the lesson I was viewing

## Tasks / Subtasks

- [ ] **Task 1: Create Script Preview Page Route** (AC: #1)
  - [ ] 1.1 Create `src/app/courses/[slug]/lessons/[id]/script/page.tsx`
  - [ ] 1.2 Page delegates to `ScriptPreview` container
  - [ ] 1.3 Extract `slug` and `id` from route params

- [ ] **Task 2: Create ScriptPreview Container** (AC: #1, #2, #7)
  - [ ] 2.1 Create `src/containers/Main/ScriptPreview/index.tsx`
  - [ ] 2.2 Create `src/containers/Main/ScriptPreview/connect.ts` with `useConnect` hook
  - [ ] 2.3 Create `src/containers/Main/ScriptPreview/types.ts` for local types
  - [ ] 2.4 Create `src/containers/Main/ScriptPreview/constants.ts` for constants
  - [ ] 2.5 Use `$api.useQuery` to fetch lesson data: `GET /api/courses/{slug}/lessons/{id}` or derive from course query
  - [ ] 2.6 Handle loading state with skeleton
  - [ ] 2.7 Handle error state with retry functionality

- [ ] **Task 3: Implement Script Content Rendering** (AC: #2, #3)
  - [ ] 3.1 Create `ScriptContent` component in `src/components/ScriptContent.tsx`
  - [ ] 3.2 Parse script array (ScriptPartResponse[])
  - [ ] 3.3 Render `speak` parts as styled paragraphs
  - [ ] 3.4 Render `pause` parts as visual badges with duration
  - [ ] 3.5 Apply proper spacing between parts

- [ ] **Task 4: Implement Script Metrics Calculation** (AC: #2)
  - [ ] 4.1 Create utility function `calculateScriptMetrics(script: ScriptPart[])`
  - [ ] 4.2 Calculate word count from `speak` parts
  - [ ] 4.3 Calculate character count from `speak` parts
  - [ ] 4.4 Calculate estimated reading time (words / 150 for meditation pace)
  - [ ] 4.5 Display metrics in a subtle info bar

- [ ] **Task 5: Implement Action Buttons** (AC: #4)
  - [ ] 5.1 Add "Edit Script" button (navigates to edit route or shows placeholder)
  - [ ] 5.2 Add "Generate Audio" button with conditional disabled state
  - [ ] 5.3 Add tooltip on disabled "Generate Audio" explaining prerequisite
  - [ ] 5.4 Add "Regenerate Script" button (placeholder for Story 4.5)
  - [ ] 5.5 Add "Back to Course" button with proper navigation

- [ ] **Task 6: Implement Empty State for No Script** (AC: #5)
  - [ ] 6.1 Create empty state component with status-specific messaging
  - [ ] 6.2 Show appropriate icon and description based on lesson status
  - [ ] 6.3 Add CTA button to navigate back to course

- [ ] **Task 7: Implement Responsive Design** (AC: #6)
  - [ ] 7.1 Use Tailwind responsive classes for layout adaptation
  - [ ] 7.2 Stack action buttons on mobile
  - [ ] 7.3 Ensure readable typography at all breakpoints
  - [ ] 7.4 Test at mobile, tablet, and desktop breakpoints

- [ ] **Task 8: Testing and Validation** (AC: #1-8)
  - [ ] 8.1 Run `bun typecheck` - verify no type errors
  - [ ] 8.2 Run `bun lint:fix` - verify no lint errors
  - [ ] 8.3 Manual test: Navigate to script page for lesson with completed script
  - [ ] 8.4 Manual test: Verify script content renders correctly (speak + pause parts)
  - [ ] 8.5 Manual test: Verify metrics display correctly
  - [ ] 8.6 Manual test: Verify action buttons work (navigation, disabled states)
  - [ ] 8.7 Manual test: Verify empty state for lessons without script
  - [ ] 8.8 Manual test: Verify error state on API failure
  - [ ] 8.9 Manual test: Verify responsive behavior on mobile

## Dev Notes

### Architecture Patterns and Constraints

This story follows the established **Container Pattern** and **OpenAPI-First** approach:

- Page route (`page.tsx`) is minimal, delegates to container
- Business logic in `connect.ts` (query, derived state, navigation handlers)
- Presentation in `index.tsx` (receives props from hook)
- Use `$api.useQuery` for data fetching with auto-generated types
- Types imported from `@/types/models`

**Route Structure:**

```
src/app/courses/[slug]/lessons/[id]/script/page.tsx
```

[Source: docs/architecture.md#Container-Pattern-CRITICAL]

### API Integration

The lesson data including script is available via the course query or a direct lesson fetch:

```typescript
// Option 1: Fetch course and find lesson
const { data: course } = $api.useQuery('get', '/api/courses/{slug}', {
  params: { path: { slug } },
});
const lesson = course?.lessons?.find((l) => l.id === Number(id));

// Option 2: If separate lesson endpoint exists
// Check API spec for GET /api/courses/{slug}/lessons/{id}
```

**Script Data Structure (from OpenAPI):**

```typescript
// ScriptPartResponse from api.d.ts
interface ScriptPartResponse {
  type: 'speak' | 'pause';
  content?: string | null; // For speak parts
  duration?: number | null; // For pause parts (seconds)
}

// Lesson includes script array
interface LessonData {
  // ... other fields
  script?: ScriptPartResponse[] | null;
  status: string;
}
```

[Source: src/types/api.d.ts#ScriptPartResponse]
[Source: docs/architecture.md#API-Architecture-OpenAPI-First]

### Script Content Rendering

**Speak Parts:**

- Render as `<p>` with appropriate styling
- Use `text-text-primary` color, `leading-relaxed` (1.6 line-height)
- Add `mb-4` spacing between paragraphs

**Pause Parts:**

- Render as styled badge: `[PAUSE Xs]`
- Use `Badge` from shadcn/ui or custom styled span
- Background: `bg-surface/50`, text: `text-text-muted`
- Center within content flow, add vertical margin

**Example rendering:**

```tsx
{
  script?.map((part, index) =>
    part.type === 'speak' ? (
      <p key={index} className="text-text-primary leading-relaxed mb-4">
        {part.content}
      </p>
    ) : (
      <div key={index} className="flex justify-center my-6">
        <span className="px-4 py-2 bg-surface/50 rounded-full text-text-muted text-sm">
          [PAUSE {part.duration}s]
        </span>
      </div>
    ),
  );
}
```

[Source: docs/ux-design-specification.md#Component-Library]

### Metrics Calculation

**Word count:** Sum words from all `speak` parts

```typescript
const wordCount = script
  .filter((p) => p.type === 'speak' && p.content)
  .reduce((acc, p) => acc + (p.content?.split(/\s+/).length || 0), 0);
```

**Character count:** Sum characters from all `speak` parts

```typescript
const charCount = script
  .filter((p) => p.type === 'speak' && p.content)
  .reduce((acc, p) => acc + (p.content?.length || 0), 0);
```

**Reading time:** Words divided by 150 (meditation pace, slower than normal reading)

```typescript
const readingTimeMinutes = Math.ceil(wordCount / 150);
```

[Source: docs/epics.md#Story-4.3-View-and-Preview-Generated-Script]

### Status-Based Conditional Rendering

Check lesson status to determine what to show:

```typescript
const SCRIPT_AVAILABLE_STATUSES = [
  'SCRIPT_COMPLETED',
  'AUDIO_GENERATING',
  'COMPLETED'
];

const hasScript = lesson?.script && lesson.script.length > 0;
const isScriptAvailable = SCRIPT_AVAILABLE_STATUSES.includes(lesson?.status || '');

// Show empty state if no script or status indicates no script yet
if (!hasScript || !isScriptAvailable) {
  return <EmptyState status={lesson?.status} />;
}
```

[Source: docs/architecture.md#Lesson-Generation-Lifecycle]

### Navigation

Use Next.js `useRouter` for navigation:

```typescript
import { useRouter } from 'next/navigation';

const router = useRouter();

const handleBackToCourse = () => {
  router.push(`/courses/${slug}`);
};

const handleEditScript = () => {
  router.push(`/courses/${slug}/lessons/${id}/script/edit`);
  // Or open modal for Story 4.4
};
```

[Source: docs/architecture.md#Navigation-Behavior]

### Empty State Design

Per UX specification, empty states should include:

- Large icon (64px), centered
- Clear title explaining the situation
- Helpful description with next steps
- Primary CTA button

```tsx
<div className="flex flex-col items-center justify-center py-16 text-center">
  <FileQuestion className="h-16 w-16 text-text-muted mb-4" />
  <h2 className="text-xl font-semibold text-text-primary mb-2">
    No script available
  </h2>
  <p className="text-text-secondary mb-6 max-w-md">{statusMessage}</p>
  <Button onClick={handleBackToCourse}>Back to Course</Button>
</div>
```

[Source: docs/ux-design-specification.md#Empty-State-Patterns]

### Learnings from Previous Story

**From Story 4-2-script-generation-configuration (Status: done)**

- **Lesson data structure confirmed**: Lesson includes `script` array of `ScriptPartResponse`
- **LessonScriptGeneration container**: Located at `src/containers/Main/LessonScriptGeneration/` - can reference patterns
- **CourseDetail context**: Course data fetched via `$api.useQuery('get', '/api/courses/{slug}')` includes lessons
- **Status constants**: Use existing status type/constants if available
- **Toast patterns**: Use `toast.success/error/info` from sonner for feedback

**Files for reference:**

- `src/containers/Main/CourseDetail/connect.ts` - Query pattern for course/lesson data
- `src/components/StatusBadge.tsx` - Existing status badge component
- `src/containers/Main/LessonScriptGeneration/constants.ts` - Status and config constants

[Source: docs/sprint-artifacts/4-2-script-generation-configuration.md#Dev-Agent-Record]

### Project Structure Notes

**New files to create:**

```
src/app/courses/[slug]/lessons/[id]/script/page.tsx
src/containers/Main/ScriptPreview/
├── index.tsx
├── connect.ts
├── types.ts
└── constants.ts
src/components/ScriptContent.tsx  (optional, can be inline)
```

**Files to reference:**

- `src/containers/Main/CourseDetail/` - Pattern for detail views
- `src/components/StatusBadge.tsx` - Reuse for status display
- `src/components/ui/badge.tsx` - For pause part styling
- `src/components/ui/button.tsx` - For action buttons
- `src/components/ui/skeleton.tsx` - For loading state

[Source: docs/architecture.md#Project-Structure]

### Accessibility Requirements

Per WCAG 2.1 Level AA compliance:

- Script content uses semantic HTML (`<article>`, `<p>`)
- Pause indicators have accessible text (not just visual)
- All buttons have proper labels
- Focus management on navigation
- Screen reader announces page title on load

```tsx
// Example accessible pause part
<div
  role="separator"
  aria-label={`Pause for ${duration} seconds`}
  className="..."
>
  <span aria-hidden="true">[PAUSE {duration}s]</span>
</div>
```

[Source: docs/ux-design-specification.md#Accessibility-Patterns]

### Testing Strategy

Per project testing standards:

- Type checking with `bun typecheck`
- Linting with `bun lint:fix`
- Manual testing for all acceptance criteria
- Focus on script rendering, metrics accuracy, and navigation

Future unit tests (post-story):

- `calculateScriptMetrics` returns correct values
- `ScriptContent` renders speak and pause parts correctly
- Empty state shows correct message per status

[Source: docs/architecture.md#Testing-Strategy]

### References

- [Source: docs/epics.md#Story-4.3] - Story requirements and acceptance criteria
- [Source: docs/architecture.md#Container-Pattern-CRITICAL] - Container pattern for business logic
- [Source: docs/architecture.md#API-Architecture-OpenAPI-First] - Query patterns
- [Source: docs/ux-design-specification.md#Empty-State-Patterns] - Empty state design
- [Source: docs/ux-design-specification.md#Button-Hierarchy] - Button styling
- [Source: docs/ux-design-specification.md#Accessibility-Patterns] - ARIA and keyboard accessibility
- [Source: src/types/api.d.ts#ScriptPartResponse] - Script data structure
- [Source: src/types/api.d.ts#LessonData] - Lesson data structure
- [Source: docs/sprint-artifacts/4-2-script-generation-configuration.md#Dev-Agent-Record] - Previous story patterns

## Dev Agent Record

### Context Reference

- `docs/sprint-artifacts/4-3-view-preview-generated-script.context.xml`

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

### File List

---

## Change Log

| Date       | Author         | Change                                        |
| ---------- | -------------- | --------------------------------------------- |
| 2025-12-01 | SM Agent (Bob) | Initial story creation from Epic 4, Story 4.3 |
