# Story 4.2: Script Generation Configuration

Status: ready-for-dev

## Story

As a **Content Manager**,
I want to configure script generation parameters before generating,
so that I can control the tone and style of the meditation script.

## Acceptance Criteria

1. **Given** I click "Generate Script" on a lesson, **When** the button is clicked, **Then**:
   - A configuration modal appears
   - The modal contains tone selection, duration adjustment, and additional instructions fields
   - The modal title indicates this is for script configuration

2. **Given** the configuration modal is open, **When** I view the form, **Then** I see:
   - **Tone selector**: Dropdown with options: Calming (default), Energizing, Neutral, Guided Visualization
   - **Target duration**: Number input pre-filled from lesson duration, adjustable ±5 min (min 1, max 120)
   - **Additional instructions**: Optional textarea for specific guidance (max 500 characters)
   - **Key themes preview**: Read-only display of lesson's existing key_themes

3. **When** I select a tone and click "Generate" in the modal, **Then**:
   - The generation starts with my selected configuration
   - The modal closes automatically
   - The lesson status updates to `SCRIPT_GENERATING`
   - A toast notification appears: "Script generation started..."

4. **When** I click "Cancel" or press Escape in the modal, **Then**:
   - The modal closes without starting generation
   - No API call is made
   - The lesson status remains unchanged

5. **Given** I want to skip configuration, **When** I hold Shift+Click on "Generate Script", **Then**:
   - Generation starts immediately with default settings (tone: calming, duration: lesson default)
   - No modal appears
   - Toast notification: "Script generation started with default settings..."

6. **Given** I have previously configured generation for this course, **When** I open the configuration modal, **Then**:
   - The last-used tone preference is pre-selected (stored in localStorage)
   - Target duration defaults to the lesson's configured duration

7. **Given** the form has invalid data (duration < 1 or > 120), **When** I attempt to submit, **Then**:
   - Inline validation errors appear below the invalid field
   - The form does not submit
   - The modal remains open

## Tasks / Subtasks

- [ ] **Task 1: Create ScriptConfigModal component** (AC: #1, #2)
  - [ ] 1.1 Create `src/components/ScriptConfigModal.tsx`
  - [ ] 1.2 Implement modal layout with Dialog from shadcn/ui
  - [ ] 1.3 Add tone selector using Select component with 4 options
  - [ ] 1.4 Add target duration number input with min/max constraints
  - [ ] 1.5 Add additional instructions textarea with character counter
  - [ ] 1.6 Display key themes as read-only Badge components
  - [ ] 1.7 Add aria-labels and accessibility attributes

- [ ] **Task 2: Create ScriptConfigForm with validation** (AC: #2, #7)
  - [ ] 2.1 Create Zod schema in `src/containers/Main/LessonScriptGeneration/constants.ts`
  - [ ] 2.2 Integrate React Hook Form with zodResolver
  - [ ] 2.3 Implement inline validation error display
  - [ ] 2.4 Add character counter for instructions field (max 500)

- [ ] **Task 3: Integrate modal with GenerateScriptButton** (AC: #1, #3, #4)
  - [ ] 3.1 Modify `src/components/GenerateScriptButton.tsx` to open modal on click
  - [ ] 3.2 Add modal open/close state management
  - [ ] 3.3 Pass lesson data (duration, key_themes) to modal
  - [ ] 3.4 Handle modal close via Cancel button and Escape key

- [ ] **Task 4: Update mutation to include configuration** (AC: #3)
  - [ ] 4.1 Update `src/containers/Main/LessonScriptGeneration/connect.ts` mutation
  - [ ] 4.2 Add configuration body to POST request: `{ tone, target_duration, instructions }`
  - [ ] 4.3 Update types to include ScriptGenerationConfig interface

- [ ] **Task 5: Implement Shift+Click bypass** (AC: #5)
  - [ ] 5.1 Add event handler to detect Shift key on button click
  - [ ] 5.2 If Shift held, skip modal and call mutation with defaults
  - [ ] 5.3 Show appropriate toast message for default generation

- [ ] **Task 6: Implement localStorage preference persistence** (AC: #6)
  - [ ] 6.1 Create localStorage key: `senda_script_config_${courseId}`
  - [ ] 6.2 Save last-used tone on successful generation
  - [ ] 6.3 Load saved tone as default when opening modal
  - [ ] 6.4 Clear stored preference on course deletion (optional)

- [ ] **Task 7: Testing and validation** (AC: #1-7)
  - [ ] 7.1 Run `bun typecheck` - verify no type errors
  - [ ] 7.2 Run `bun lint:fix` - verify no lint errors
  - [ ] 7.3 Manual test: modal opens on button click
  - [ ] 7.4 Manual test: form submits with valid data
  - [ ] 7.5 Manual test: form shows validation errors for invalid duration
  - [ ] 7.6 Manual test: Escape key closes modal
  - [ ] 7.7 Manual test: Shift+click bypasses modal
  - [ ] 7.8 Manual test: saved tone preference is loaded on reopening

## Dev Notes

### Architecture Patterns and Constraints

This story follows the established **Container Pattern** and **OpenAPI-First** approach:

- Business logic in `connect.ts` (mutation, form handling)
- Modal component is presentational, receives props and callbacks
- Use `$api.useMutation` for all API calls with auto-generated types
- Validation schemas defined in `constants.ts` using Zod

**Modal Pattern:**
Per UX specification, modals should:

- Use backdrop blur (8px) for depth
- Trap focus within modal
- Close on Escape key
- Auto-focus first input on open
- Medium size (600px max-width) for forms

[Source: docs/ux-design-specification.md#Modal-&-Dialog-Patterns]

### API Integration

The mutation endpoint accepts configuration in the request body:

```typescript
// Updated mutation signature
$api.useMutation('post', '/api/courses/{slug}/lessons/{id}/generate-script', {
  body: {
    tone: 'calming' | 'energizing' | 'neutral' | 'visualization',
    target_duration: number,
    instructions?: string
  },
  onSuccess: async () => {
    toast.info('Script generation started...');
    await queryClient.invalidateQueries({
      queryKey: ['get', '/api/courses/{slug}']
    });
  }
});
```

**Note:** Verify backend API supports these parameters. If not, coordinate with backend team or implement as future enhancement.

[Source: docs/architecture.md#API-Architecture-OpenAPI-First]

### Form Validation Schema

```typescript
// In constants.ts
import { z } from 'zod';

export const TONE_OPTIONS = [
  { value: 'calming', label: 'Calming' },
  { value: 'energizing', label: 'Energizing' },
  { value: 'neutral', label: 'Neutral' },
  { value: 'visualization', label: 'Guided Visualization' },
] as const;

export const scriptConfigSchema = z.object({
  tone: z.enum(['calming', 'energizing', 'neutral', 'visualization']),
  target_duration: z
    .number()
    .min(1, 'Duration must be at least 1 minute')
    .max(120, 'Duration cannot exceed 120 minutes'),
  instructions: z
    .string()
    .max(500, 'Instructions cannot exceed 500 characters')
    .optional(),
});

export type ScriptConfigFormData = z.infer<typeof scriptConfigSchema>;
```

[Source: docs/architecture.md#Form-Management-React-Hook-Form--Zod]

### Component Integration

The ScriptConfigModal will be rendered conditionally within GenerateScriptButton:

```typescript
// GenerateScriptButton.tsx pattern
const [isModalOpen, setIsModalOpen] = useState(false);

const handleClick = (e: React.MouseEvent) => {
  if (e.shiftKey) {
    // Bypass modal, generate with defaults
    handleGenerate({ tone: 'calming', target_duration: lesson.duration });
  } else {
    setIsModalOpen(true);
  }
};

return (
  <>
    <Button onClick={handleClick}>...</Button>
    <ScriptConfigModal
      open={isModalOpen}
      onOpenChange={setIsModalOpen}
      lesson={lesson}
      onGenerate={handleGenerate}
      defaultTone={storedTone}
    />
  </>
);
```

[Source: src/components/GenerateScriptButton.tsx]

### Learnings from Previous Story

**From Story 4-1-generate-script-button-status (Status: done)**

- **GenerateScriptButton created**: Located at `src/components/GenerateScriptButton.tsx` - extend this component to support modal
- **LessonScriptGeneration container**: Located at `src/containers/Main/LessonScriptGeneration/` - add configuration types and schema here
- **Mutation pattern established**: Uses `$api.useMutation('post', '/api/courses/{slug}/lessons/{id}/generate-script')`
- **Integration point**: Button integrated into `SortableLessonItem.tsx`, receives courseSlug via props
- **Polling handles completion**: Story 3.6 polling infrastructure handles SCRIPT_GENERATING → SCRIPT_COMPLETED transitions

**Files to modify:**

- `src/components/GenerateScriptButton.tsx` - Add modal trigger and state
- `src/containers/Main/LessonScriptGeneration/constants.ts` - Add validation schema
- `src/containers/Main/LessonScriptGeneration/types.ts` - Add ScriptConfigFormData type
- `src/containers/Main/LessonScriptGeneration/connect.ts` - Update mutation to accept config

**Reuse patterns:**

- Follow same toast notification pattern (toast.info for start, polling handles completion)
- Use same cache invalidation pattern on success
- Leverage existing error handling in mutation

[Source: docs/sprint-artifacts/4-1-generate-script-button-status.md#Dev-Agent-Record]

### Project Structure Notes

**New files to create:**

- `src/components/ScriptConfigModal.tsx` - Modal component with form

**Files to modify:**

- `src/components/GenerateScriptButton.tsx` - Add modal state and Shift+click handling
- `src/containers/Main/LessonScriptGeneration/constants.ts` - Add TONE_OPTIONS and scriptConfigSchema
- `src/containers/Main/LessonScriptGeneration/types.ts` - Add ScriptConfigFormData type
- `src/containers/Main/LessonScriptGeneration/connect.ts` - Update mutation signature

**localStorage key convention:**

- Pattern: `senda_{feature}_{scope}`
- For this feature: `senda_script_config_${courseId}`
- Store only the tone preference (simple string value)

[Source: docs/architecture.md#Project-Structure]

### Accessibility Requirements

Per WCAG 2.1 Level AA compliance:

- Modal must trap focus when open
- First focusable element (tone selector) receives focus on open
- Escape key closes modal
- Form inputs have proper labels and aria-describedby for errors
- Submit button is keyboard accessible
- Screen reader announces modal opening: `aria-labelledby` on dialog

```typescript
<Dialog open={open} onOpenChange={onOpenChange}>
  <DialogContent aria-labelledby="script-config-title">
    <DialogHeader>
      <DialogTitle id="script-config-title">Configure Script Generation</DialogTitle>
    </DialogHeader>
    ...
  </DialogContent>
</Dialog>
```

[Source: docs/ux-design-specification.md#Accessibility-Patterns]

### Testing Strategy

Per project testing standards:

- Type checking with `bun typecheck`
- Linting with `bun lint:fix`
- Manual testing for all acceptance criteria
- Focus on form validation, modal behavior, and Shift+click bypass

Future unit tests (post-story):

- ScriptConfigModal renders correct form fields
- Validation rejects invalid duration values
- Shift+click triggers mutation without modal
- localStorage saves and restores tone preference

[Source: docs/architecture.md#Testing-Strategy]

### UX Design Compliance

**Modal Styling (from UX spec):**

- Size: Medium (600px max-width)
- Backdrop: Semi-transparent dark overlay with backdrop blur
- Animation: Fade in, slide up
- Close button (×) in top-right corner

**Form Styling:**

- Labels above inputs (stacked)
- Required indicator (\*) not needed (all optional except tone has default)
- Help text below textarea showing character count
- Error messages in red below invalid fields

**Button Hierarchy:**

- Primary: "Generate" (cyan background)
- Secondary: "Cancel" (transparent, cyan border)

[Source: docs/ux-design-specification.md#Form-Patterns]
[Source: docs/ux-design-specification.md#Modal-&-Dialog-Patterns]

### References

- [Source: docs/epics.md#Story-4.2] - Story requirements and acceptance criteria
- [Source: docs/architecture.md#Container-Pattern-CRITICAL] - Container pattern for business logic
- [Source: docs/architecture.md#API-Architecture-OpenAPI-First] - Mutation patterns
- [Source: docs/architecture.md#Form-Management-React-Hook-Form--Zod] - Form validation patterns
- [Source: docs/ux-design-specification.md#Modal-&-Dialog-Patterns] - Modal design guidelines
- [Source: docs/ux-design-specification.md#Form-Patterns] - Form design guidelines
- [Source: docs/ux-design-specification.md#Accessibility-Patterns] - ARIA and keyboard accessibility
- [Source: docs/sprint-artifacts/4-1-generate-script-button-status.md#Dev-Agent-Record] - Previous story patterns
- [Source: src/components/GenerateScriptButton.tsx] - Component to modify
- [Source: src/containers/Main/LessonScriptGeneration/] - Container to extend

## Dev Agent Record

### Context Reference

- `docs/sprint-artifacts/4-2-script-generation-configuration.context.xml`

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

### File List

---

## Change Log

| Date       | Author         | Change                                        |
| ---------- | -------------- | --------------------------------------------- |
| 2025-12-01 | SM Agent (Bob) | Initial story creation from Epic 4, Story 4.2 |
