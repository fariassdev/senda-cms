# Story 4.4: Edit Script Content

Status: drafted

## Story

As a **Content Manager**,
I want to edit the generated script content,
so that I can customize the meditation text and timing to better fit the course needs.

## Acceptance Criteria

1. **Given** I am on the Script Preview page with a completed script, **When** I click the "Edit Script" button, **Then**:
   - The view switches to edit mode without navigation
   - The script content becomes editable in a large textarea
   - A toolbar with meditation cue buttons appears above the textarea
   - Real-time metrics (word count, character count, reading time) update as I type
   - The "Edit Script" button changes to "Done Editing" (outline style)
   - Other action buttons (Generate Audio, Regenerate) are hidden during edit mode

2. **Given** I am in edit mode, **When** the editor loads, **Then** I see:
   - **Toolbar with meditation cue buttons:**
     - [PAUSE 3s] - inserts pause marker at cursor
     - [PAUSE 5s] - inserts 5-second pause
     - [BREATHE IN] - inserts breath in cue
     - [BREATHE OUT] - inserts breath out cue
     - [SILENCE 10s] - inserts longer silence marker
   - **Large textarea:**
     - Monospace font for better readability of cues
     - Minimum height: 400px
     - Auto-expanding height based on content
     - Proper padding and line height
   - **Save state indicator:**
     - Shows "Unsaved changes" when content is modified (dirty state)
     - "Save Changes" button (primary cyan) - enabled only when dirty
     - Button shows "Saving..." spinner during save operation
     - Success state: "Saved ✓" (green checkmark, 2 seconds, then back to idle)

3. **Given** I am editing the script, **When** I click a toolbar button (e.g., [PAUSE 3s]), **Then**:
   - The corresponding text is inserted at the current cursor position
   - The cursor remains positioned right after the inserted text
   - The textarea maintains focus
   - The dirty flag is set (Save button becomes enabled)
   - Metrics update immediately

4. **Given** I have made changes to the script, **When** the content changes, **Then**:
   - Real-time metrics update instantly:
     - Word count (from speak content)
     - Character count (total)
     - Estimated reading time (words / 150 wpm)
     - Total pause time (sum of all pause markers)
   - The "Save Changes" button becomes enabled
   - A "dirty" indicator appears (e.g., asterisk or "Unsaved changes" text)

5. **Given** I have unsaved changes, **When** I click "Save Changes", **Then**:
   - The button shows "Saving..." with spinner
   - A PATCH request is sent to update the lesson script
   - On success:
     - Toast notification: "Script saved successfully"
     - Button shows "Saved ✓" (green checkmark) for 2 seconds
     - Dirty flag is cleared (button becomes disabled again)
     - Metrics are recalculated and persisted
   - On error:
     - Toast error: "Failed to save script. Please try again."
     - Button shows "Failed to save - Retry" state
     - Clicking "Retry" attempts save again
     - Unsaved changes are preserved

6. **Given** I have unsaved changes, **When** I click "Done Editing", **Then**:
   - A confirmation modal appears with:
     - Title: "Unsaved Changes"
     - Message: "You have unsaved changes. What would you like to do?"
     - Three buttons:
       - "Save & Exit" (primary) - saves and exits edit mode
       - "Discard Changes" (destructive) - exits without saving
       - "Cancel" (outline) - closes modal and stays in edit mode

7. **Given** I have NO unsaved changes, **When** I click "Done Editing", **Then**:
   - Edit mode exits immediately (no modal)
   - The view returns to preview mode
   - The updated script is displayed with proper formatting
   - The "Done Editing" button changes back to "Edit Script"
   - All other action buttons (Generate Audio, Regenerate) reappear

8. **Given** I try to navigate away from the page with unsaved changes, **When** I click browser back or try to navigate, **Then**:
   - Browser shows native "Leave site?" confirmation
   - If I confirm, changes are lost
   - If I cancel, I stay on the page

9. **Given** the script save fails due to network/server error, **When** the error occurs, **Then**:
   - The error toast displays the error message or a generic message
   - The "Save Changes" button shows "Failed to save - Retry" state
   - Clicking the button attempts to save again
   - My changes remain in the textarea (not lost)
   - I can continue editing

10. **Given** I am in edit mode, **When** I view the page on mobile, **Then**:
    - The toolbar wraps to multiple rows if needed
    - Toolbar buttons are touch-friendly (min 44px tap target)
    - Textarea adapts to mobile viewport width
    - Save button is sticky at bottom or always visible
    - All functionality works with touch input

## Tasks / Subtasks

- [ ] **Task 1: Add Edit Mode State to ScriptPreview Container** (AC: #1, #7)
  - [ ] 1.1 Add `isEditing` state to `connect.ts`
  - [ ] 1.2 Add `isDirty` state to track unsaved changes
  - [ ] 1.3 Add `handleEnterEditMode` and `handleExitEditMode` functions
  - [ ] 1.4 Add conditional rendering logic in `index.tsx` to switch between preview and edit views
  - [ ] 1.5 Toggle button text between "Edit Script" and "Done Editing"

- [ ] **Task 2: Create Script Editor Component** (AC: #2, #3, #4)
  - [ ] 2.1 Create `src/components/ScriptEditor.tsx` component
  - [ ] 2.2 Implement controlled textarea with `value` and `onChange`
  - [ ] 2.3 Set up monospace font, proper sizing (min-h-[400px]), padding
  - [ ] 2.4 Track cursor position for toolbar insertions
  - [ ] 2.5 Implement `insertTextAtCursor` utility function
  - [ ] 2.6 Add real-time metrics calculation and display

- [ ] **Task 3: Implement Toolbar with Meditation Cue Buttons** (AC: #2, #3)
  - [ ] 3.1 Create toolbar component within `ScriptEditor`
  - [ ] 3.2 Add buttons: [PAUSE 3s], [PAUSE 5s], [BREATHE IN], [BREATHE OUT], [SILENCE 10s]
  - [ ] 3.3 Style buttons with secondary/outline variant
  - [ ] 3.4 Implement click handlers that insert text at cursor position
  - [ ] 3.5 Preserve cursor position and focus after insertion
  - [ ] 3.6 Ensure buttons are keyboard accessible (Tab + Enter/Space)

- [ ] **Task 4: Implement Save Functionality** (AC: #5, #9)
  - [ ] 4.1 Add mutation in `connect.ts`: `$api.useMutation('patch', '/api/courses/{slug}/lessons/{id}')`
  - [ ] 4.2 Create `handleSaveScript` function that calls mutation
  - [ ] 4.3 Track save state: idle, saving, success, error
  - [ ] 4.4 Update button text and icon based on save state
  - [ ] 4.5 Show success checkmark for 2 seconds after successful save
  - [ ] 4.6 Clear dirty flag on successful save
  - [ ] 4.7 Handle error state with retry option
  - [ ] 4.8 Preserve content on error

- [ ] **Task 5: Implement Unsaved Changes Modal** (AC: #6)
  - [ ] 5.1 Create `UnsavedChangesModal` component using `Dialog` from shadcn/ui
  - [ ] 5.2 Add modal state to `connect.ts`
  - [ ] 5.3 Show modal when "Done Editing" clicked with dirty state
  - [ ] 5.4 Implement "Save & Exit" button (save → exit)
  - [ ] 5.5 Implement "Discard Changes" button (revert → exit)
  - [ ] 5.6 Implement "Cancel" button (close modal, stay editing)

- [ ] **Task 6: Implement Browser Navigation Guard** (AC: #8)
  - [ ] 6.1 Add `useEffect` hook to set up `beforeunload` event listener
  - [ ] 6.2 Show browser confirmation if `isDirty` is true
  - [ ] 6.3 Clean up event listener on unmount or when dirty flag clears

- [ ] **Task 7: Implement Save State Indicator** (AC: #2, #4, #5)
  - [ ] 7.1 Create save state indicator component/section
  - [ ] 7.2 Display "Unsaved changes" text when dirty
  - [ ] 7.3 Display "Save Changes" button (enabled when dirty, disabled when clean)
  - [ ] 7.4 Display "Saving..." during save operation
  - [ ] 7.5 Display "Saved ✓" on success (2 seconds)
  - [ ] 7.6 Display "Failed to save - Retry" on error

- [ ] **Task 8: Responsive Design for Edit Mode** (AC: #10)
  - [ ] 8.1 Use Tailwind responsive classes for toolbar (flex-wrap on mobile)
  - [ ] 8.2 Ensure toolbar buttons have min 44px tap target
  - [ ] 8.3 Make Save button sticky or always visible on mobile
  - [ ] 8.4 Test touch input on mobile devices/emulation

- [ ] **Task 9: Testing and Validation** (AC: #1-10)
  - [ ] 9.1 Run `bun typecheck` - verify no type errors
  - [ ] 9.2 Run `bun lint:fix` - verify no lint errors
  - [ ] 9.3 Manual test: Enter edit mode, verify UI changes
  - [ ] 9.4 Manual test: Insert toolbar cues at various cursor positions
  - [ ] 9.5 Manual test: Verify real-time metrics update
  - [ ] 9.6 Manual test: Save changes, verify toast and state updates
  - [ ] 9.7 Manual test: Exit edit mode with unsaved changes, verify modal
  - [ ] 9.8 Manual test: Exit edit mode with no changes, verify no modal
  - [ ] 9.9 Manual test: Navigate away with unsaved changes, verify browser confirmation
  - [ ] 9.10 Manual test: Handle save error, verify retry functionality
  - [ ] 9.11 Manual test: Responsive behavior on mobile

## Dev Notes

### Architecture Patterns and Constraints

This story extends the **ScriptPreview container** created in Story 4.3 with inline editing capabilities. It follows the **Container Pattern** with business logic in `connect.ts` and presentation in `index.tsx`.

**Key patterns:**

- **Explicit save, NO auto-save**: Saving is performed only when the user clicks "Save Changes" button
- **Dirty state tracking**: Track when content differs from saved version
- **Optimistic updates**: Update UI immediately, show error if save fails
- **Browser navigation guard**: Prevent accidental data loss with `beforeunload` event
- **Controlled textarea**: React-controlled input with `value` and `onChange`

[Source: docs/architecture.md#Container-Pattern-CRITICAL]
[Source: docs/epics.md#Story-4.4-Edit-Script-Content]

### API Integration

**Update Lesson Script Endpoint:**

```typescript
// Mutation in connect.ts
const updateScriptMutation = $api.useMutation(
  'patch',
  '/api/courses/{slug}/lessons/{id}',
  {
    onMutate: async () => {
      // Set saving state
    },
    onSuccess: async (data) => {
      toast.success('Script saved successfully');
      setIsDirty(false);
      setSaveState('success');
      // Clear success state after 2 seconds
      setTimeout(() => setSaveState('idle'), 2000);

      // Invalidate queries to refresh data
      await queryClient.invalidateQueries({
        queryKey: ['get', `/api/courses/${slug}/lessons`],
      });
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to save script. Please try again.');
      setSaveState('error');
    },
  },
);

// Payload
const payload = {
  script_text: editedContent, // String containing the full script
};
```

**Note**: The backend may expect script as plain text (markdown-like format with cue markers) or as a structured array. Verify the API contract in `src/types/api.d.ts` and adapt accordingly.

[Source: docs/architecture.md#API-Architecture-OpenAPI-First]
[Source: docs/api-integration.md#Lesson-Update-Endpoint]

### Script Serialization

**From structured script to editable text:**

```typescript
// Convert ScriptPartResponse[] to plain text for editing
function serializeScript(script: ScriptPartResponse[]): string {
  return script
    .map((part) => {
      if (part.type === 'speak') {
        return part.content || '';
      } else if (part.type === 'pause') {
        return `[PAUSE ${part.duration}s]`;
      }
      return '';
    })
    .join('\n\n');
}

// Convert edited text back to structured format (if needed)
function parseScriptText(text: string): ScriptPartResponse[] {
  const parts: ScriptPartResponse[] = [];
  const lines = text.split('\n');

  for (const line of lines) {
    const pauseMatch = line.match(/\[PAUSE (\d+)s\]/);
    if (pauseMatch) {
      parts.push({
        type: 'pause',
        duration: parseInt(pauseMatch[1], 10),
        content: null,
      });
    } else if (line.trim()) {
      parts.push({
        type: 'speak',
        content: line.trim(),
        duration: null,
      });
    }
  }

  return parts;
}
```

**Note**: Check if the backend API expects structured script or plain text. If plain text, serialize for editing and parse before sending. If structured, send the parsed array.

[Source: docs/architecture.md#Data-Format-Patterns]

### Toolbar Text Insertion

**Insert text at cursor position:**

```typescript
function insertTextAtCursor(
  textarea: HTMLTextAreaElement,
  textToInsert: string,
): void {
  const startPos = textarea.selectionStart;
  const endPos = textarea.selectionEnd;
  const textBefore = textarea.value.substring(0, startPos);
  const textAfter = textarea.value.substring(endPos);

  const newValue = textBefore + textToInsert + textAfter;
  const newCursorPos = startPos + textToInsert.length;

  // Update value via React state
  setValue(newValue);

  // Set cursor position after React update
  setTimeout(() => {
    textarea.selectionStart = newCursorPos;
    textarea.selectionEnd = newCursorPos;
    textarea.focus();
  }, 0);
}
```

**Usage in toolbar:**

```tsx
<Button
  type="button"
  variant="outline"
  onClick={() => {
    const textarea = textareaRef.current;
    if (textarea) {
      insertTextAtCursor(textarea, '[PAUSE 3s]');
      setIsDirty(true);
    }
  }}
>
  [PAUSE 3s]
</Button>
```

[Source: docs/architecture.md#Form-Management-React-Hook-Form-+-Zod]

### Real-time Metrics Update

Reuse the `calculateScriptMetrics` utility from Story 4.3, but update it to work with plain text:

```typescript
// In connect.ts or constants.ts
function calculateMetricsFromText(text: string): {
  wordCount: number;
  charCount: number;
  readingTimeMinutes: number;
  totalPauseSeconds: number;
} {
  // Remove pause markers for word/char count
  const speakContent = text.replace(/\[PAUSE \d+s\]/g, '').trim();

  const wordCount = speakContent
    .split(/\s+/)
    .filter((w) => w.length > 0).length;
  const charCount = speakContent.length;
  const readingTimeMinutes = Math.ceil(wordCount / 150);

  // Extract pause durations
  const pauseMatches = text.matchAll(/\[PAUSE (\d+)s\]/g);
  const totalPauseSeconds = Array.from(pauseMatches).reduce(
    (sum, match) => sum + parseInt(match[1], 10),
    0,
  );

  return {
    wordCount,
    charCount,
    readingTimeMinutes,
    totalPauseSeconds,
  };
}

// Update metrics on every content change
useEffect(() => {
  if (isEditing) {
    const metrics = calculateMetricsFromText(editedContent);
    setMetrics(metrics);
  }
}, [editedContent, isEditing]);
```

[Source: docs/sprint-artifacts/4-3-view-preview-generated-script.md#Metrics-Calculation]

### Browser Navigation Guard

Prevent accidental navigation away with unsaved changes:

```typescript
useEffect(() => {
  if (isDirty) {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = ''; // Chrome requires returnValue to be set
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }
}, [isDirty]);
```

[Source: docs/architecture.md#Lifecycle-Patterns]

### Save State Management

Track save operation state for UI feedback:

```typescript
type SaveState = 'idle' | 'saving' | 'success' | 'error';

const [saveState, setSaveState] = useState<SaveState>('idle');

// Save button text and icon
const saveButtonContent = {
  idle: 'Save Changes',
  saving: 'Saving...',
  success: 'Saved ✓',
  error: 'Failed to save - Retry',
};

// Button appearance
<Button
  onClick={handleSaveScript}
  disabled={!isDirty || saveState === 'saving'}
  variant={saveState === 'success' ? 'default' : 'default'}
  className={saveState === 'error' ? 'border-error text-error' : ''}
>
  {saveState === 'saving' && <Spinner className="mr-2" />}
  {saveButtonContent[saveState]}
</Button>
```

[Source: docs/ux-design-specification.md#Button-States]

### Unsaved Changes Modal

Use shadcn/ui Dialog for confirmation modal:

```tsx
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';

<Dialog open={showUnsavedModal} onOpenChange={setShowUnsavedModal}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Unsaved Changes</DialogTitle>
      <DialogDescription>
        You have unsaved changes. What would you like to do?
      </DialogDescription>
    </DialogHeader>
    <DialogFooter className="flex gap-2">
      <Button variant="outline" onClick={() => setShowUnsavedModal(false)}>
        Cancel
      </Button>
      <Button
        variant="destructive"
        onClick={() => {
          setEditedContent(originalContent);
          setIsDirty(false);
          setIsEditing(false);
          setShowUnsavedModal(false);
        }}
      >
        Discard Changes
      </Button>
      <Button
        onClick={async () => {
          await handleSaveScript();
          if (saveState !== 'error') {
            setIsEditing(false);
            setShowUnsavedModal(false);
          }
        }}
      >
        Save & Exit
      </Button>
    </DialogFooter>
  </DialogContent>
</Dialog>;
```

[Source: docs/ux-design-specification.md#Modal-Dialog-Patterns]

### Learnings from Previous Story (4.3)

**From Story 4-3-view-preview-generated-script (Status: review)**

**New Components Created:**

- `src/containers/Main/ScriptPreview/` - Main container for script viewing
- `src/components/ScriptContent.tsx` - Renders speak/pause parts
- Script route: `/courses/[slug]/lessons/[id]/script`

**Data Structure:**

- Lesson includes `script: ScriptPartResponse[]` array
- ScriptPartResponse: `{ type: 'speak' | 'pause', content?: string, duration?: number }`
- Query: `$api.useQuery('get', '/api/courses/{slug}/lessons')` to fetch lessons

**Metrics Implemented:**

- `calculateScriptMetrics` utility with unit tests (8 tests pass)
- Metrics: word count, char count, reading time (150 wpm), pause time, pause %
- Target duration comparison with visual indicator

**UI Patterns:**

- Edit button already present in ScriptPreview (switches to edit mode)
- Status badge component available (`src/components/StatusBadge.tsx`)
- Responsive design with Tailwind (sm:, md:, lg:)
- Toast notifications for feedback (sonner)

**Architectural Decisions:**

- Container Pattern: logic in `connect.ts`, presentation in `index.tsx`
- OpenAPI-First: use `$api` hooks with auto-generated types
- No auto-save: explicit save button (confirmed in Epic 4.4 AC)
- Type imports from `@/types/models`, not raw API types

**Files to Extend:**

- `src/containers/Main/ScriptPreview/connect.ts` - Add edit state, save mutation
- `src/containers/Main/ScriptPreview/index.tsx` - Add conditional edit view
- Create `src/components/ScriptEditor.tsx` - New editor component

**Patterns to Follow:**

- Use `useState` for edit state, dirty state
- Use `useMutation` for save operation with toast feedback
- Reuse `calculateMetricsFromText` (adapt from `calculateScriptMetrics`)
- Follow responsive design patterns established in preview

[Source: docs/sprint-artifacts/4-3-view-preview-generated-script.md#Dev-Agent-Record]

### Project Structure Notes

**Files to modify:**

```
src/containers/Main/ScriptPreview/
├── index.tsx       ← Add edit mode conditional rendering
├── connect.ts      ← Add edit state, save mutation, handlers
└── constants.ts    ← Add script serialization/parsing utilities
```

**Files to create:**

```
src/components/ScriptEditor.tsx  ← New editor component with toolbar
```

**Files to reference:**

- `src/components/ScriptContent.tsx` - Preview rendering (to understand format)
- `src/components/ui/dialog.tsx` - For unsaved changes modal
- `src/components/ui/button.tsx` - For toolbar and save buttons
- `src/components/ui/textarea.tsx` - Base textarea component

[Source: docs/architecture.md#Project-Structure]

### Accessibility Requirements

Per WCAG 2.1 Level AA compliance:

- Toolbar buttons have proper labels (text + optional icon)
- Textarea has `aria-label="Script editor"`
- Keyboard navigation: Tab through toolbar, Enter/Space to activate
- Focus management: textarea receives focus on entering edit mode
- Save button states announced to screen readers (`aria-live="polite"`)
- Modal has proper ARIA attributes (Dialog component handles this)

```tsx
<textarea
  ref={textareaRef}
  aria-label="Script editor"
  value={editedContent}
  onChange={(e) => {
    setEditedContent(e.target.value);
    setIsDirty(true);
  }}
  className="w-full min-h-[400px] p-4 font-mono text-sm leading-relaxed"
/>
```

[Source: docs/ux-design-specification.md#Accessibility-Patterns]

### Testing Strategy

Per project testing standards:

- Type checking with `bun typecheck`
- Linting with `bun lint:fix`
- Manual testing for all 10 acceptance criteria
- Focus on save flow, dirty state, and modal interactions

Future unit tests (post-story):

- `serializeScript` converts structured script to text correctly
- `parseScriptText` converts text back to structured format
- `insertTextAtCursor` inserts text at correct position
- `calculateMetricsFromText` returns accurate metrics
- Dirty state tracking works correctly

[Source: docs/architecture.md#Testing-Strategy]

### References

- [Source: docs/epics.md#Story-4.4] - Story requirements and acceptance criteria
- [Source: docs/architecture.md#Container-Pattern-CRITICAL] - Container pattern
- [Source: docs/architecture.md#Form-Management-React-Hook-Form-+-Zod] - Form patterns
- [Source: docs/ux-design-specification.md#Modal-Dialog-Patterns] - Modal design
- [Source: docs/ux-design-specification.md#Button-States] - Button state styling
- [Source: docs/sprint-artifacts/4-3-view-preview-generated-script.md] - Previous story context
- [Source: src/types/api.d.ts#ScriptPartResponse] - Script data structure
- [Source: src/components/ScriptContent.tsx] - Script rendering patterns

## Dev Agent Record

### Context Reference

<!-- Path to story context XML will be added here by context workflow -->

### Agent Model Used

_To be filled by Dev Agent_

### Debug Log References

_To be filled by Dev Agent_

### Completion Notes List

_To be filled by Dev Agent upon completion_

### File List

**Expected new files:**

- `src/components/ScriptEditor.tsx` - NEW

**Expected modified files:**

- `src/containers/Main/ScriptPreview/index.tsx` - MODIFIED
- `src/containers/Main/ScriptPreview/connect.ts` - MODIFIED
- `src/containers/Main/ScriptPreview/constants.ts` - MODIFIED

---

## Change Log

| Date       | Author         | Change                                        |
| ---------- | -------------- | --------------------------------------------- |
| 2025-12-01 | SM Agent (Bob) | Initial story creation from Epic 4, Story 4.4 |
