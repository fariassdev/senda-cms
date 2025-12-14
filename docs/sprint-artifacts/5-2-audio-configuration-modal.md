# Story 5.2: Audio Configuration Modal

Status: ready-for-dev

## Story

As a **Content Manager**,
I want to configure voice and audio settings,
So that I can customize the meditation audio style.

## Acceptance Criteria

1. **Given** I click "Generate Audio" on an eligible lesson
   **When** the modal appears
   **Then** I see a configuration modal titled "Generate Audio" or "Regenerate Audio" (based on context)
   **And** the modal contains:
   - Voice Selection dropdown with voice names and descriptions
   - Speech Rate slider (0.5x to 2.0x, default 1.0x)
   - Cancel and Generate/Regenerate buttons

2. **Given** the modal is open
   **When** I see the Voice Selection dropdown
   **Then** I see at least 2 voice options:
   - "Aria - Calm, soothing female voice" (or similar description)
   - "Leo - Warm, grounding male voice" (or similar description)
     **And** the first voice is selected by default

3. **Given** the modal is open
   **When** I adjust the Speech Rate slider
   **Then** I see visual feedback showing the current rate value (e.g., "1.0x")
   **And** I can adjust in 0.1 increments between 0.5x and 2.0x
   **And** the value updates in real-time as I drag the slider

4. **Given** I have configured my options and click "Generate"
   **When** the button is clicked
   **Then** the modal closes
   **And** audio generation starts with my configuration
   **And** the lesson status changes to `AUDIO_GENERATING`
   **And** toast notification: "Audio generation started..."

5. **Given** I click "Cancel" or press Escape
   **When** the event fires
   **Then** the modal closes without starting generation
   **And** no changes are made

6. **Given** the lesson already has audio (status `AUDIO_COMPLETED`/`COMPLETED`)
   **When** I click "Regenerate Audio"
   **Then** the modal title shows "Regenerate Audio"
   **And** a warning banner displays: "This will replace the current audio file."

7. **Given** audio generation is in progress
   **When** I view the modal buttons
   **Then** the Generate/Regenerate button shows loading spinner
   **And** the button is disabled during generation
   **And** the Cancel button remains enabled

## Tasks / Subtasks

- [ ] **Task 1: Add Slider Component to shadcn/ui** (Prerequisites: None)
  - [ ] 1.1 Run `bunx shadcn@latest add slider` to add Slider component
  - [ ] 1.2 Verify slider component is added to `src/components/ui/slider.tsx`

- [ ] **Task 2: Create AudioConfigModal Component** (AC: #1, #2, #3, #6, #7) (Prerequisites: Task 1)
  - [ ] 2.1 Create `src/components/AudioConfigModal/index.tsx`
  - [ ] 2.2 Create `src/components/AudioConfigModal/types.ts` with `AudioConfigModalProps`
  - [ ] 2.3 Create `src/components/AudioConfigModal/constants.ts` with voice options and slider config
  - [ ] 2.4 Create `src/components/AudioConfigModal/connect.ts` with local state management
  - [ ] 2.5 Implement Voice Selection dropdown using `Select` from shadcn/ui
  - [ ] 2.6 Implement Speech Rate slider using `Slider` from shadcn/ui (0.5x - 2.0x, step 0.1)
  - [ ] 2.7 Implement modal title/description variants (generate vs regenerate)
  - [ ] 2.8 Implement warning banner for regeneration (same pattern as ScriptGenerationModal)
  - [ ] 2.9 Style with cyan accent colors matching GenerateAudioButton theme

- [ ] **Task 3: Update useAudioGeneration Hook** (AC: #4) (Prerequisites: None, can run parallel)
  - [ ] 3.1 Add `AudioConfig` interface to hook parameters
  - [ ] 3.2 Update `generateAudio` to accept optional `config` parameter
  - [ ] 3.3 Pass config to mutation body when provided
  - [ ] 3.4 **NOTE:** Current API does not accept body; prepare for future API update

- [ ] **Task 4: Update GenerateAudioButton to Use Modal** (AC: #1, #4, #5, #6) (Prerequisites: Task 2, Task 3)
  - [ ] 4.1 Add modal open state to GenerateAudioButton
  - [ ] 4.2 Import and integrate AudioConfigModal
  - [ ] 4.3 On button click → open modal (instead of direct generation)
  - [ ] 4.4 Pass isRegeneration prop based on lesson status (`AUDIO_COMPLETED`)
  - [ ] 4.5 Maintain Shift+Click for quick generation (bypass modal, use defaults)

- [ ] **Task 5: Integration into SortableLessonItem** (AC: #1, #4, #6) (Prerequisites: Task 4)
  - [ ] 5.1 Update GenerateAudioButton integration in SortableLessonItem
  - [ ] 5.2 Pass required props for modal (lesson info, handlers)
  - [ ] 5.3 Verify modal opens correctly from lesson list

- [ ] **Task 6: Testing and Validation** (AC: #1-7) (Prerequisites: Tasks 1-5 complete)
  - [ ] 6.1 Run `bun typecheck` - verify no type errors
  - [ ] 6.2 Run `bun lint:fix` - verify no lint errors
  - [ ] 6.3 Manual test: Click "Generate Audio" → modal opens with correct options
  - [ ] 6.4 Manual test: Voice dropdown shows available options
  - [ ] 6.5 Manual test: Speech rate slider shows current value (0.8x - 1.2x)
  - [ ] 6.6 Manual test: Configure and click "Generate" → generation starts
  - [ ] 6.7 Manual test: "Regenerate Audio" shows warning banner
  - [ ] 6.8 Manual test: Cancel closes modal without action
  - [ ] 6.9 Manual test: Shift+Click bypasses modal, uses defaults
  - [ ] 6.10 Manual test: Escape key closes modal

## Dev Notes

### Architecture Patterns and Constraints

This story creates a configuration modal for audio generation, following the pattern established by `ScriptGenerationModal`. The key difference is that this modal is simpler - it only handles configuration options, not lesson form editing.

**Key Patterns:**

- **Modal Pattern**: Follow `ScriptGenerationModal` for structure, but simpler (no form editing)
- **Component Location**: `src/components/` since it's reusable across contexts
- **Hook Extension**: Extend `useAudioGeneration` to accept configuration options
- **Container Integration**: Update `GenerateAudioButton` to incorporate modal

[Source: docs/architecture.md#Container-Pattern-CRITICAL]
[Source: docs/architecture.md#Frontend-Architecture]

### API Integration Notes

**API Schema - AudioConfigRequest:**

The endpoint `POST /api/courses/{slug}/lessons/{id}/generate-audio` accepts an optional request body with `AudioConfigRequest`:

```typescript
// From src/types/api.d.ts - AudioConfigRequest schema
interface AudioConfigRequest {
  /**
   * Voice to use for TTS (e.g., 'af_nicole', 'af_bella').
   * If not provided, uses the default voice.
   */
  voice?: string | null;

  /**
   * Speech rate multiplier (0.5 to 2.0, default 1.0).
   */
  speed: number; // Required field with default 1.0
}
```

**Request Body:**

The endpoint accepts `SingleAudioGenerationRequest | null` which wraps `AudioConfigRequest`.

**Voice Options (from TTS provider - Kokoro):**

- Voice IDs follow pattern like `af_nicole`, `af_bella`, etc.
- The exact list should be hardcoded based on available Kokoro voices
- Consider fetching from a voices endpoint if available in future

**Speed Range:**

- Minimum: 0.5x
- Maximum: 2.0x
- Default: 1.0x
- Step: 0.1 recommended for usability

[Source: src/types/api.d.ts - lines 580-595]
[Source: docs/epics.md#Story-5.2 - lines 693-727]

### Source Tree Components to Touch

**Files to Create:**

```
src/components/ui/
├── slider.tsx                         ← Add via shadcn CLI

src/components/AudioConfigModal/
├── index.tsx                          ← Modal component
├── types.ts                           ← AudioConfigModalProps, AudioConfig
├── constants.ts                       ← VOICE_OPTIONS, SLIDER_CONFIG
└── connect.ts                         ← Local state hook

src/types/
├── audio-config.ts                    ← Shared audio config types (optional)
```

**Files to Modify:**

```
src/hooks/
├── useAudioGeneration.ts              ← Add config parameter support

src/containers/Main/CourseDetail/SortableLessonList/SortableLessonItem/GenerateAudioButton/
├── index.tsx                          ← Add modal integration
├── connect.ts                         ← Add modal state
├── types.ts                           ← Add modal-related types
```

### AudioConfigModal Component Implementation

**Follow ScriptGenerationModal pattern with these simplifications:**

1. **No form editing** - Just configuration options
2. **Voice dropdown** - Simple `Select` component
3. **Speech rate slider** - `Slider` component with value display
4. **Warning banner** - Reuse pattern from ScriptGenerationModal

**Component Structure:**

```typescript
// src/components/AudioConfigModal/types.ts
export interface AudioConfig {
  voice: string;
  speechRate: number;
}

export interface AudioConfigModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lessonTitle: string;
  onGenerate: (config: AudioConfig) => void;
  isGenerating: boolean;
  isRegeneration?: boolean;
}
```

**Voice Options:**

```typescript
// src/components/AudioConfigModal/constants.ts
export const VOICE_OPTIONS = [
  { value: 'aria', label: 'Aria', description: 'Calm, soothing female voice' },
  { value: 'leo', label: 'Leo', description: 'Warm, grounding male voice' },
] as const;

export const SPEECH_RATE_CONFIG = {
  min: 0.5,
  max: 2.0,
  step: 0.1,
  default: 1.0,
} as const;

export const MODAL_CONFIG = {
  generate: {
    title: 'Generate Audio',
    description: 'Configure voice and audio settings for this lesson.',
    submitLabel: 'Generate',
  },
  regenerate: {
    title: 'Regenerate Audio',
    description:
      'Configure voice and audio settings. Current audio will be replaced.',
    submitLabel: 'Regenerate',
  },
} as const;

export const WARNING_BANNER_TEXT = 'This will replace the current audio file.';
```

[Source: docs/epics.md#Story-5.2 - lines 705-710]
[Source: src/components/ScriptGenerationModal/constants.ts - pattern reference]

### useAudioGeneration Hook Update

**Extend hook to accept optional configuration:**

```typescript
// From src/types/api.d.ts
import type {
  AudioConfigRequest,
  SingleAudioGenerationRequest,
} from '@/types/api';

const useAudioGeneration = ({
  courseSlug,
  lessonId,
}: {
  courseSlug: string;
  lessonId: number;
}) => {
  // ... existing code ...

  const generateAudio = (config?: AudioConfigRequest) => {
    generateMutation.mutate({
      params: {
        path: {
          slug: courseSlug,
          id: lessonId,
        },
      },
      body: {
        content: {
          'application/json': config ? { audio_config: config } : null,
        },
      } as unknown as {
        content: { 'application/json': SingleAudioGenerationRequest | null };
      }, // Cast needed until generated types match perfectly if they don't already
    });
  };

  return {
    generateAudio,
    isGenerating: generateMutation.isPending,
  };
};
```

[Source: src/hooks/useAudioGeneration.ts - current implementation]
[Source: src/hooks/useScriptGeneration.ts - pattern reference]

### GenerateAudioButton Modal Integration

**Update button to show modal instead of direct generation:**

```typescript
// In GenerateAudioButton/connect.ts - add modal state
import { useState } from 'react';

export default function useConnect() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // ... existing getButtonState logic ...

  return {
    getButtonState,
    isModalOpen,
    setIsModalOpen,
  };
}
```

**In GenerateAudioButton/index.tsx:**

```typescript
// Handle Shift+Click for quick generation (bypass modal)
const handleClick = (e: React.MouseEvent) => {
  if (e.shiftKey) {
    // Quick generation with defaults
    onGenerate();
  } else {
    // Open modal for configuration
    setIsModalOpen(true);
  }
};
```

[Source: src/containers/Main/CourseDetail/SortableLessonList/SortableLessonItem/GenerateAudioButton/]
[Source: docs/sprint-artifacts/5-1-generate-audio-button-and-status.md - Shift+Click pattern]

### Slider Component (shadcn/ui)

**Add slider using shadcn CLI:**

```bash
bunx shadcn@latest add slider
```

**Usage Pattern:**

```tsx
import { Slider } from '@/components/ui/slider';

<div className="space-y-2">
  <Label htmlFor="speech-rate">Speech Rate: {speechRate.toFixed(1)}x</Label>
  <Slider
    id="speech-rate"
    min={0.5}
    max={2.0}
    step={0.1}
    value={[speechRate]}
    onValueChange={(values) => setSpeechRate(values[0])}
    className="w-full"
  />
</div>;
```

### Select Component Usage (shadcn/ui)

**Voice Selection Pattern:**

```tsx
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

<div className="space-y-2">
  <Label htmlFor="voice-select">Voice</Label>
  <Select value={voice} onValueChange={setVoice}>
    <SelectTrigger id="voice-select">
      <SelectValue placeholder="Select a voice" />
    </SelectTrigger>
    <SelectContent>
      {VOICE_OPTIONS.map((option) => (
        <SelectItem key={option.value} value={option.value}>
          <div className="flex flex-col">
            <span>{option.label}</span>
            <span className="text-xs text-muted-foreground">
              {option.description}
            </span>
          </div>
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
</div>;
```

### Styling Guidelines

**Cyan Accent Theme (consistent with GenerateAudioButton):**

```css
/* Primary action button */
.bg-[#7dcfff] .text-slate-900 .hover:bg-[#7dcfff]/90

/* Outline buttons */
.border-[#7dcfff] .text-[#7dcfff] .hover:bg-[#7dcfff]/10

/* Focus states */
.focus-visible:ring-[#7dcfff] .focus-visible:ring-2

/* Slider track accent */
/* Use Tailwind CSS variables or custom styling to match cyan theme */
```

[Source: docs/sprint-artifacts/5-1-generate-audio-button-and-status.md - Button styling]
[Source: docs/ux-design-specification.md#Button-Hierarchy]

### Learnings from Previous Stories

**From Story 5.1 (Generate Audio Button):**

- Button state logic with status-to-config mapping
- Shift+Click pattern for quick actions (bypass modal)
- Cyan color theme (#7dcfff) for audio-related components
- Integration pattern with SortableLessonItem

**From Story 4.2 (Script Generation Configuration):**

- Modal configuration pattern (though 4.2 used LessonForm)
- This story is simpler - just dropdown + slider, no form

**From ScriptGenerationModal (refactored component):**

- Warning banner pattern for regeneration
- Modal structure with Dialog from shadcn/ui
- Loading state handling in buttons
- `useMemo` for stable default values

[Source: docs/sprint-artifacts/5-1-generate-audio-button-and-status.md]
[Source: src/components/ScriptGenerationModal/]

### Accessibility Requirements

Per WCAG 2.1 Level AA compliance:

- Voice dropdown: Proper `aria-label` and keyboard navigation
- Slider: Associated label, keyboard accessible (arrow keys)
- Modal: Focus trap, Escape to close, proper dialog roles
- Warning banner: `role="alert"` for screen readers
- Loading states: `aria-busy="true"` on buttons during generation
- All interactive elements have visible focus indicators

[Source: docs/ux-design-specification.md#Accessibility-Patterns]
[Source: docs/architecture.md - WCAG 2.1 AA]

### Testing Checklist

| Test Case                    | Expected Result                    |
| ---------------------------- | ---------------------------------- |
| Click "Generate Audio"       | Modal opens with config options    |
| Voice dropdown               | Shows Aria, Leo options            |
| Speech rate slider           | Adjusts 0.5x - 2.0x, shows value   |
| Click "Generate"             | Modal closes, generation starts    |
| Click "Cancel"               | Modal closes, no action            |
| Press Escape                 | Modal closes, no action            |
| Shift+Click "Generate Audio" | Direct generation (no modal)       |
| Status is AUDIO_COMPLETED    | Modal shows "Regenerate", warning  |
| Generation in progress       | Button shows spinner, disabled     |
| Keyboard navigation          | Tab through options works          |
| Screen reader                | Voice selection announced properly |

### Dependencies and Prerequisites

**Prerequisites:**

- Story 5.1: Generate Audio Button ✅ (completed)
- Story 3.6: Real-time Status Indicators ✅ (polling mechanism)

**External Dependencies:**

- shadcn/ui Slider component (add via CLI)
- Backend API update (future) for configuration support

### Project Structure Notes

**Component Hierarchy Update:**

```
SortableLessonItem (parent)
├── StatusBadge (existing)
├── GenerateScriptButton (existing - Story 4.1)
├── GenerateAudioButton (Story 5.1) ← Modified
│   └── AudioConfigModal (NEW - this story)
└── Edit/Delete actions (existing)
```

**Modal Location:**

`src/components/AudioConfigModal/` - Reusable component at project level since it may be used from multiple contexts (lesson list, script preview page).

### References

- [Source: docs/epics.md#Story-5.2-Audio-Configuration-Modal] - Story requirements
- [Source: docs/architecture.md#Frontend-Architecture] - Component structure
- [Source: docs/architecture.md#Container-Pattern-CRITICAL] - Container pattern
- [Source: src/components/ScriptGenerationModal/] - Modal pattern reference
- [Source: src/hooks/useAudioGeneration.ts] - Hook to extend
- [Source: src/containers/Main/CourseDetail/SortableLessonList/SortableLessonItem/GenerateAudioButton/] - Button to update
- [Source: docs/sprint-artifacts/5-1-generate-audio-button-and-status.md] - Previous story learnings
- [Source: docs/ux-design-specification.md#Button-Hierarchy] - Button styling

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

| Date       | Author         | Change                                                                              |
| ---------- | -------------- | ----------------------------------------------------------------------------------- |
| 2025-12-14 | SM Agent (Bob) | Ultimate context engine analysis - story created with comprehensive developer guide |
