# Senda CMS - Epic Breakdown

**Author:** Rupo
**Date:** 2025-11-28
**Project Level:** Brownfield (Next.js 15 meditation course CMS)
**Target Scale:** MVP - Admin-only meditation content management system

---

## Overview

This document provides the complete epic and story breakdown for Senda CMS, decomposing the requirements from the [PRD](./PRD.md) into implementable stories. Each story is sized for single dev agent completion in one focused session.

**Living Document Notice:** This epic breakdown incorporates context from:

- ✅ PRD.md - Functional requirements
- ✅ UX Design Specification - Interaction patterns, visual design
- ✅ Architecture Document - Technical decisions, implementation patterns

### Epic Summary

| Epic | Title                         | Status      | FRs Covered                  |
| ---- | ----------------------------- | ----------- | ---------------------------- |
| 1    | Foundation & Authentication   | ✅ Complete | FR8, FR9, FR10, FR11         |
| 2    | Course Discovery & Management | ✅ Complete | FR1, FR2, FR6, FR7 (partial) |
| 3    | Lesson Management             | 🎯 Current  | FR3                          |
| 4    | AI Script Generation          | ⏳ Pending  | FR4, FR7 (partial)           |
| 5    | Audio Generation & Playback   | ⏳ Pending  | FR5, FR7 (partial)           |
| 6    | Polish & Production Readiness | ⏳ Pending  | NFRs                         |

---

## Functional Requirements Inventory

| FR ID | Category          | Requirement                                                                        | Priority |
| ----- | ----------------- | ---------------------------------------------------------------------------------- | -------- |
| FR1   | Course Management | Course Listing - Display, filter, search, sort courses                             | High     |
| FR2   | Course Management | Course Creation - Form, metadata, validation, save as draft                        | High     |
| FR3   | Lesson Management | Lesson Organization - Display, status, reorder, batch operations                   | High     |
| FR4   | Lesson Management | Script Generation - One-click, progress tracking, preview, edit, versioning        | High     |
| FR5   | Lesson Management | Audio Generation - Auto-generation, preview, download, status tracking, retry      | High     |
| FR6   | User Interface    | Navigation - Sidebar, breadcrumbs, quick actions, recent items                     | Medium   |
| FR7   | User Interface    | Feedback System - Toasts, loading states, error messages, success confirmations    | Medium   |
| FR8   | Authentication    | User Authentication - Secure login, JWT, admin-only, session management            | Critical |
| FR9   | Authentication    | Session Management - Auto-renewal, token refresh, logout, cross-tab sync           | High     |
| FR10  | Authentication    | Access Control - Role-based, protected routes, redirect, permission validation     | High     |
| FR11  | Authentication    | Security Features - HTTPS, CSRF, secure storage, rate limiting, input sanitization | High     |

---

## FR Coverage Map

| FR   | Epic      | Stories                            |
| ---- | --------- | ---------------------------------- |
| FR1  | Epic 2 ✅ | Course listing, filtering, sorting |
| FR2  | Epic 2 ✅ | Course creation with AI prompt     |
| FR3  | Epic 3 🎯 | Stories 3.1-3.6                    |
| FR4  | Epic 4    | Stories 4.1-4.6                    |
| FR5  | Epic 5    | Stories 5.1, 5.2, 5.3, 5.4         |
| FR5  | Epic 7    | Stories 7.1-7.3                    |
| FR6  | Epic 2 ✅ | Sidebar navigation                 |
| FR7  | Epics 2-6 | Feedback patterns across all epics |
| FR8  | Epic 1 ✅ | Login form, JWT auth               |
| FR9  | Epic 1 ✅ | Token refresh, session sync        |
| FR10 | Epic 1 ✅ | Route protection, middleware       |
| FR11 | Epic 1 ✅ | Security headers, validation       |

---

## Epic 1: Foundation & Authentication ✅

**Goal:** Users can securely access the CMS with proper authentication and session management.

**Status:** ✅ COMPLETED (Phases 1-2 of implementation roadmap)

**FRs Covered:** FR8, FR9, FR10, FR11

**Implemented Features:**

- Project setup with Next.js 15, TypeScript, Tailwind CSS
- Login form with email/password validation
- JWT-based authentication with Zustand store
- Route protection via Next.js middleware
- Token refresh mechanism
- Cross-tab session synchronization
- Security headers and input validation

---

## Epic 2: Course Discovery & Management ✅

**Goal:** Users can browse, search, filter courses and create new courses with AI assistance.

**Status:** ✅ COMPLETED (Phases 3-4 of implementation roadmap)

**FRs Covered:** FR1, FR2, FR6, FR7 (partial)

**Implemented Features:**

- Course listing with grid view
- Course cards with progress, status badges
- Sidebar navigation with collapsible behavior
- Course creation via AI prompt
- Course detail page with lesson list
- Toast notifications for feedback
- Loading skeletons and error states

---

## Epic 3: Lesson Management 🎯

**Goal:** Users can organize and manage lessons within meditation courses, including viewing, creating, editing, deleting, and reordering lessons.

**FRs Covered:** FR3 (Lesson Organization)

**User Value:** After completing this epic, Content Managers can fully manage the lesson structure of any course, preparing lessons for script and audio generation.

---

### Story 3.1: Display Lesson List in Course Detail

**As a** Content Manager,
**I want** to see all lessons of a course in an organized list,
**So that** I can understand the complete course structure and each lesson's status.

**Acceptance Criteria:**

**Given** I am on the course detail page with lessons
**When** the page loads
**Then** I see a table/list with all lessons ordered by `order` field

**And** each row displays:

- Drag handle (⋮⋮) for reordering
- Lesson title (primary text)
- Duration in minutes
- Status badge with semantic colors
- Last updated timestamp (relative format)
- Actions menu (edit, delete icons)

**And** status badges use semantic colors from UX spec:

- PENDING: grey (#6b7280)
- SCRIPT_GENERATING / AUDIO_GENERATING: blue (#7aa2f7) with pulse animation
- SCRIPT_COMPLETED: orange (#e0af68)
- COMPLETED: green (#9ece6a)
- FAILED: red (#f7768e)

**And** if there are no lessons, I see empty state with:

- Icon (document with plus)
- Title: "No lessons yet"
- Description: "Create your first lesson to start building this course"
- CTA button: "Add First Lesson" (primary cyan)

**Prerequisites:** Epic 2 completed (CourseDetail page exists)

**Technical Notes:**

- Use existing `$api.useQuery('get', '/api/courses/{slug}')` which includes lessons
- Create `LessonListItem` component in `src/components/`
- Use `Table` from shadcn/ui with custom styling
- Status badge component with color mapping
- Responsive: stack on mobile, table on desktop

---

### Story 3.2: Create New Lesson

**As a** Content Manager,
**I want** to add a new lesson to a course,
**So that** I can expand the course content as needed.

**Acceptance Criteria:**

**Given** I am on the course detail page
**When** I click the "Add Lesson" button
**Then** a modal dialog opens with a creation form

**And** the form includes:

- Title (required, min 3 characters, max 100)
- Duration in minutes (required, number input, min 1, max 120)
- Key Themes (optional, comma-separated, converted to array)
- Description/Notes (optional, textarea, max 500 characters)

**When** I complete the form and click "Create Lesson"
**Then** the lesson is created with status PENDING
**And** appears at the end of the lesson list
**And** success toast: "Lesson created successfully"
**And** the modal closes automatically

**Given** I submit the form with invalid data
**Then** I see inline validation errors below each field
**And** the form does not submit

**Given** I click outside the modal or press Escape
**Then** the modal closes without saving
**And** if I had entered data, I see confirmation: "Discard changes?"

**Prerequisites:** Story 3.1

**Technical Notes:**

- Container: `containers/Main/LessonCreate/` with connect.ts, constants.ts, types.ts
- Use `Dialog` from shadcn/ui
- Form with React Hook Form + Zod validation
- Mutation: `$api.useMutation('post', '/api/courses/{id}/lessons')`
- Invalidate course query on success for cache update
- Zod schema in constants.ts:
  ```typescript
  const lessonSchema = z.object({
    title: z.string().min(3).max(100),
    duration: z.number().min(1).max(120),
    key_themes: z.string().optional(),
    description: z.string().max(500).optional(),
  });
  ```

---

### Story 3.3: Edit Existing Lesson

**As a** Content Manager,
**I want** to edit the details of an existing lesson,
**So that** I can correct errors or update content.

**Acceptance Criteria:**

**Given** I see the lesson list
**When** I click the edit icon (✏️) on a lesson row
**Then** a modal opens with the form pre-populated with current data

**And** all fields are editable:

- Title (current value shown)
- Duration (current value shown)
- Key Themes (current values as comma-separated string)
- Description (current value shown)

**When** I modify fields and click "Save Changes"
**Then** the changes are saved to the backend
**And** success toast: "Lesson updated"
**And** the list updates with new data
**And** the modal closes

**Given** I submit with invalid data
**Then** I see inline validation errors

**Given** I haven't made changes and click "Save"
**Then** the modal closes without API call

**Prerequisites:** Story 3.2 (reuse form component)

**Technical Notes:**

- Reuse LessonForm component from Story 3.2
- Pass `initialData` prop to pre-populate form
- Mutation: `$api.useMutation('patch', '/api/lessons/{id}')`
- Use `defaultValues` in React Hook Form
- Optimistic update for instant feedback

---

### Story 3.4: Delete Lesson

**As a** Content Manager,
**I want** to delete a lesson I no longer need,
**So that** I can keep the course clean and organized.

**Acceptance Criteria:**

**Given** I see the lesson list
**When** I click the delete icon (🗑️) on a lesson row
**Then** a confirmation dialog appears with:

- Title: "Delete Lesson"
- Message: "Are you sure you want to delete '[lesson title]'?"
- Warning: "This will permanently delete any generated scripts and audio."
- Buttons: "Cancel" (outline) and "Delete" (destructive red)

**When** I click "Delete"
**Then** the lesson is deleted from the backend
**And** success toast: "Lesson deleted"
**And** the lesson disappears from the list with fade animation
**And** the dialog closes

**When** I click "Cancel" or press Escape
**Then** the dialog closes
**And** no changes are made

**Prerequisites:** Story 3.1

**Technical Notes:**

- Use `AlertDialog` from shadcn/ui
- Mutation: `$api.useMutation('delete', '/api/lessons/{id}')`
- Invalidate course query on success
- Add exit animation with Tailwind/Framer Motion

---

### Story 3.5: Reorder Lessons with Drag-and-Drop

**As a** Content Manager,
**I want** to reorder lessons by dragging them,
**So that** I can adjust the pedagogical flow easily.

**Acceptance Criteria:**

**Given** I see the lesson list with 2+ lessons
**When** I grab a lesson by its drag handle (⋮⋮)
**Then** the cursor changes to grabbing
**And** I see visual feedback (ghost element follows cursor)

**When** I drag over another position
**Then** I see drop zone indicator (line or highlight)

**When** I drop the lesson in a new position
**Then** the order updates immediately (optimistic)
**And** the new order is saved to backend
**And** brief toast: "Order saved"

**Given** the save fails
**Then** the order reverts to original
**And** error toast: "Failed to update order. Please try again."

**And** drag-and-drop is accessible via keyboard:

- Tab to drag handle
- Enter/Space to start drag mode
- Arrow Up/Down to move position
- Enter to confirm, Escape to cancel
- Screen reader announces: "Lesson [title] moved to position [n]"

**Prerequisites:** Story 3.1

**Technical Notes:**

- Install: `bun add --exact @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities`
- Mutation: `$api.useMutation('patch', '/api/courses/{id}/lessons/reorder')`
- Request body: `{ lesson_ids: ['id1', 'id2', 'id3'] }` (ordered array)
- Implement keyboard accessibility per @dnd-kit documentation
- Optimistic update with React Query `onMutate` / `onError` rollback

---

### Story 3.6: Real-time Status Indicators

**As a** Content Manager,
**I want** to see generation status update in real-time,
**So that** I know when my scripts/audio are ready without refreshing.

**Acceptance Criteria:**

**Given** a lesson has status SCRIPT_GENERATING or AUDIO_GENERATING
**When** I view the lesson list
**Then** the status badge shows a pulse/spinner animation

**And** React Query polls the course endpoint every 5 seconds

**When** the status changes to COMPLETED
**Then** polling stops for that lesson
**And** badge updates to green with checkmark
**And** toast: "Script ready for [lesson title]" or "Audio ready for [lesson title]"

**When** the status changes to FAILED
**Then** polling stops for that lesson
**And** badge updates to red with X icon
**And** toast error: "Generation failed for [lesson title]"

**Given** no lessons are in GENERATING status
**Then** polling is disabled (no unnecessary API calls)

**Prerequisites:** Story 3.1

**Technical Notes:**

- Use `refetchInterval` option in React Query:
  ```typescript
  refetchInterval: (data) => {
    const hasGenerating = data?.lessons?.some(
      (l) =>
        l.status === 'SCRIPT_GENERATING' || l.status === 'AUDIO_GENERATING',
    );
    return hasGenerating ? 3000 : false;
  };
  ```
- Badge with `animate-pulse` class from Tailwind
- Toast notifications triggered by comparing previous vs current status

---

## Epic 4: AI Script Generation

**Goal:** Users can generate meditation scripts with AI, track progress, and edit the generated content.

**FRs Covered:** FR4 (Script Generation), FR7 (Feedback)

**User Value:** After completing this epic, Content Managers can transform lesson outlines into complete meditation scripts with AI assistance, review and edit scripts, and regenerate with different parameters.

---

### Story 4.1: Generate Script Button and Status

**As a** Content Manager,
**I want** to generate a script for a lesson with one click,
**So that** I can quickly create meditation content.

**Acceptance Criteria:**

**Given** I am viewing a lesson with status PENDING or SCRIPT_FAILED
**When** I see the lesson row
**Then** I see a "Generate Script" button (cyan, with sparkle icon ✨)

**When** I click "Generate Script"
**Then** the button shows loading spinner
**And** the lesson status changes to SCRIPT_GENERATING
**And** the badge shows pulse animation
**And** toast: "Script generation started..."

**Given** the lesson already has status SCRIPT_COMPLETED or higher
**Then** the "Generate Script" button shows as "Regenerate Script" (outline style)

**Given** generation is in progress
**Then** the button is disabled with "Generating..." text

**Prerequisites:** Story 3.6 (real-time status)

**Technical Notes:**

- Mutation: `$api.useMutation('post', '/api/lessons/{id}/generate-script')`
- Button states: idle → loading → disabled (while generating)
- Rely on Story 3.6 polling to detect completion
- Add to lesson row actions or as inline button

---

### Story 4.2: Script Generation Configuration

**As a** Content Manager,
**I want** to configure script generation parameters,
**So that** I can control the tone and style of the meditation.

**Acceptance Criteria:**

**Given** I click "Generate Script" on a lesson
**When** the button is clicked
**Then** a configuration modal appears with:

- Tone selector: Calming (default), Energizing, Neutral, Guided Visualization
- Target duration: Pre-filled from lesson duration, adjustable ±5 min
- Additional instructions: Optional textarea for specific guidance
- Preview of lesson key themes (read-only)

**When** I click "Generate" in the modal
**Then** the generation starts with my configuration
**And** the modal closes
**And** status updates to SCRIPT_GENERATING

**When** I click "Cancel" or press Escape
**Then** the modal closes without starting generation

**Given** I want to skip configuration
**Then** I can hold Shift+Click on "Generate Script" to use defaults

**Prerequisites:** Story 4.1

**Technical Notes:**

- Create `ScriptConfigModal` component
- Mutation includes config in body:
  ```typescript
  {
    tone: 'calming' | 'energizing' | 'neutral' | 'visualization',
    target_duration: number,
    instructions?: string
  }
  ```
- Store last-used config in localStorage for convenience
- Use `Select` from shadcn/ui for tone dropdown

---

### Story 4.3: View and Preview Generated Script

**As a** Content Manager,
**I want** to view the generated script,
**So that** I can review the content before generating audio.

**Acceptance Criteria:**

**Given** a lesson has status SCRIPT_COMPLETED or higher
**When** I click on the lesson row or "View Script" action
**Then** I navigate to the Script Editor page `/courses/[slug]/lessons/[id]/script`

**And** I see:

- Lesson title as page heading
- Script content in a readable format
  - Meditation cues highlighted: [PAUSE 3s]
- Word count and estimated reading time
- Character count

**And** I see action buttons:

- "Edit Script" (primary)
- "Generate Audio" (secondary, enabled only if script complete)
- "Regenerate Script" (outline)
- "Back to Course" (ghost)

**Prerequisites:** Story 4.1

**Technical Notes:**

- Create container: `containers/Main/ScriptViewer/`
- Route: `src/app/courses/[slug]/lessons/[id]/script/page.tsx`
- Query: `$api.useQuery('get', '/api/lessons/{id}')`
- Highlight cues with regex and styled spans
- Calculate reading time: ~150 words/minute for meditation pace

---

### Story 4.4: Edit Script Content

**As a** Content Manager,
**I want** to edit the generated script,
**So that** I can customize content and fix any issues.

**Acceptance Criteria:**

**Given** I am on the Script Viewer page
**When** I click "Edit Script"
**Then** the view switches to edit mode with:

    - Large textarea with monospace font
    - Toolbar with meditation cue buttons:
      - [PAUSE 3s] - inserts pause marker
      - [PAUSE 5s] - inserts 5-second pause
      - [PAUSE 10s] - inserts 10-second pause
      - [PAUSE 30s] - inserts 30-second pause
      - [PAUSE 50s] - inserts 50-second pause

- Real-time word/character count
- Save state indicator and explicit save control ("Save changes" button)

**When** I make changes
**Then** the editor is marked as "dirty" and the `Save changes` button becomes enabled — there is NO auto-save or debounce; saving is explicit

**When** I click `Save changes`
**Then** the editor shows "Saving..." while the save is in progress, and on success shows "Saved ✓"; the updated content is persisted and version history updated

**When** I click "Done Editing"
**Then** if there are no unsaved changes I return to view mode with updated content
**If** there are unsaved changes I am prompted: `Save`, `Discard`, or `Cancel` (must choose before leaving)

**Given** save fails
**Then** I see error indicator "Failed to save - Retry"
**And** clicking `Retry` attempts save again

**Prerequisites:** Story 4.3

**Technical Notes:**

- Use controlled textarea with `useState` to track current content and a `dirty` flag
- No debounced auto-save: saving is performed only when user presses `Save changes`
- Mutation: `$api.useMutation('patch', '/api/lessons/{id}')` with payload `{ script_text: string }`
  - `Save changes` calls `mutateAsync` and shows saving state
  - On success: show toast and update React Query cache / version history
  - On error: show inline error state + toast and allow retry
- Show persistent `Save changes` button (disabled when not dirty)
- Prompt user with "Unsaved changes" modal when navigating away or clicking "Done Editing" with dirty state
- Toolbar buttons insert text at cursor position and preserve cursor location after insertion

---

### Story 4.5: Regenerate Script

**As a** Content Manager,
**I want** to regenerate a script with different parameters,
**So that** I can get a better result if the first generation wasn't ideal.

**Acceptance Criteria:**

**Given** I am viewing a script (status SCRIPT_COMPLETED or higher)
**When** I click "Regenerate Script"
**Then** I see configuration modal (same as Story 4.2)
**And** a warning: "This will replace the current script. The current version will be saved to history."

**When** I confirm regeneration
**Then** new script generation starts
**And** status changes to SCRIPT_GENERATING
**And** I can view generation progress

**When** regeneration completes
**Then** I see the new script
**And** I can access previous version from "Version History" dropdown

**Prerequisites:** Story 4.2, Story 4.3

**Technical Notes:**

- Same mutation as Story 4.1 but with `replace: true` flag
- Backend should preserve script_parts history
- Add version selector dropdown if multiple versions exist
- Show timestamp for each version

---

### Story 4.6: Batch Script Generation

**As a** Content Manager,
**I want** to generate scripts for multiple lessons at once,
**So that** I can quickly create content for an entire course.

**Acceptance Criteria:**

**Given** I am on the course detail page
**When** I see multiple lessons with PENDING status
**Then** I see a "Generate All Scripts" button in the header

**When** I click "Generate All Scripts"
**Then** a confirmation modal appears:

- Title: "Generate Scripts for X Lessons"
- List of lessons that will be processed
- Configuration options (apply same settings to all)
- Warning about processing time

**When** I confirm
**Then** all selected lessons start generating
**And** I see a progress summary: "Generating: 2/5 complete"
**And** each lesson updates independently as it completes

**Given** some generations fail
**Then** I see summary: "4 succeeded, 1 failed"
**And** failed lessons show retry option

**Prerequisites:** Story 4.1, Story 4.2

**Technical Notes:**

- Mutation: `$api.useMutation('post', '/api/courses/{id}/generate-all-scripts')`
- Show progress modal with lesson-by-lesson status
- Use optimistic updates for each lesson
- Allow partial failure handling

---

## Epic 5: Audio Generation & Playback

**Goal:** Users can convert completed scripts into audio files with text-to-speech and play/download the results.

**FRs Covered:** FR5 (Audio Generation), FR7 (Feedback)

**User Value:** After completing this epic, Content Managers can generate professional meditation audio from scripts, preview audio with an integrated player, download files, and regenerate with different voice settings.

---

### Story 5.1: Generate Audio Button and Status

**As a** Content Manager,
**I want** to generate audio from a completed script,
**So that** I can create the final meditation content.

**Acceptance Criteria:**

**Given** a lesson has status SCRIPT_COMPLETED
**When** I view the lesson row
**Then** I see a "Generate Audio" button (secondary style)

**When** I click "Generate Audio"
**Then** the button shows loading spinner
**And** status changes to AUDIO_GENERATING
**And** badge shows pulse animation
**And** toast: "Audio generation started..."

**Given** the lesson has status COMPLETED (audio exists)
**Then** the button shows as "Regenerate Audio" (outline style)

**Given** generation is in progress
**Then** button is disabled with "Generating..." text

**Prerequisites:** Epic 4 complete, Story 3.6 (polling)

**Technical Notes:**

- Mutation: `$api.useMutation('post', '/api/lessons/{id}/generate-audio')`
- Reuse polling logic from Story 3.6
- Enable button only when script_parts exist and are complete

---

### Story 5.2: Audio Configuration Modal

**As a** Content Manager,
**I want** to configure voice and audio settings,
**So that** I can customize the meditation audio style.

**Acceptance Criteria:**

**Given** I click "Generate Audio"
**When** the modal appears
**Then** I see configuration options:

- Voice Selection: Dropdown with voice names and descriptions
  - "Aria - Calm, soothing female voice"
  - "Leo - Warm, grounding male voice"
  - (etc. from available TTS voices)
- Speech Rate: Slider 0.8x to 1.2x (default 1.0x)

**When** I click "Generate"
**Then** generation starts with my configuration
**And** modal closes

**When** I click "Cancel"
**Then** modal closes without action

**Prerequisites:** Story 5.1

**Technical Notes:**

- Create `AudioConfigModal` component
- Mutation body includes all config options
- Use `Slider` from shadcn/ui for speech rate

---

### Story 5.3: Integrated Audio Player

**As a** Content Manager,
**I want** to play generated audio directly in the app,
**So that** I can preview the final meditation content.

**Acceptance Criteria:**

**Given** a lesson has status COMPLETED with audio_url
**When** I click the play button on the lesson row
**Then** an audio player appears (inline or modal):

- Play/Pause toggle button
- Progress bar with current time / total time
- Volume slider
- Playback speed options (0.75x, 1x, 1.25x, 1.5x)

**When** I click Play
**Then** audio starts playing
**And** play button changes to pause icon
**And** progress bar updates in real-time

**When** I click on the progress bar
**Then** audio seeks to that position

**When** audio finishes
**Then** player shows replay option

**And** I can minimize player and navigate while audio plays

**Prerequisites:** Story 5.1, Story 3.6

**Technical Notes:**

- Use HTML5 `<audio>` element with custom controls
- Create `AudioPlayer` component with Tailwind styling
- Consider `react-h5-audio-player` only if native is insufficient
- Store volume/speed preference in localStorage
- Support keyboard: Space for play/pause, arrow keys for seek

---

### Story 5.4: Download Audio File

**As a** Content Manager,
**I want** to download the generated audio,
**So that** I can use it in other platforms or for distribution.

**Acceptance Criteria:**

**Given** a lesson has completed audio
**When** I click the "Download" button/icon
**Then** the audio file downloads with filename: `{lesson-number}_{lesson-title}.mp3`

**And** download starts immediately (no page navigation)

**Given** download fails
**Then** toast error: "Download failed. Please try again."

**Prerequisites:** Story 5.4

**Technical Notes:**

- Use `<a download>` with audio_url
- Place the button in the audio player

---

## Epic 6: Polish & Production Readiness

**Goal:** System is polished, performant, accessible, and ready for production deployment.

**FRs Covered:** NFRs (Performance, Accessibility, Responsive Design)

**User Value:** After completing this epic, the CMS provides a smooth, professional experience across devices with fast load times, proper error handling, and accessibility compliance.

---

### Story 6.1: Production Deployment

**As a** project owner,
**I want** the CMS deployed to production,
**So that** it's accessible to the team.

**Acceptance Criteria:**

**Given** code is merged to main branch
**When** the merge completes
**Then** Vercel automatically deploys to production

**And** environment variables are configured:

- `NEXT_PUBLIC_API_BASE_URL` = production API
- `NEXT_PUBLIC_BUILD` = "production"

**And** the production URL is accessible:

- HTTPS enforced
- Custom domain configured (if applicable)
- Health check endpoint responds

**And** preview deployments work:

- Each PR gets unique preview URL
- Preview uses staging API (if available)

**Given** deployment fails
**Then** team is notified (Vercel email/Slack)
**And** previous version remains active

**Prerequisites:** Epics 2-5 complete

**Technical Notes:**

- Connect GitHub repo to Vercel
- Configure environment variables in Vercel dashboard
- Set up custom domain in Vercel
- Create `.env.production` example in repo
- Document deployment process in README

---

## Epic 7: Post-MVP Features

**Goal:** Future enhancements and features deferred from the MVP to keep scope focused.

**Status:** 🔮 Future

**FRs Covered:** FR5 (Enhancements)

---

### Story 7.1: Audio Generation Progress

**As a** Content Manager,
**I want** to see audio generation progress,
**So that** I know how long until my audio is ready.

**Acceptance Criteria:**

**Given** audio generation is in progress
**When** I view the lesson
**Then** I see a simulated progress bar (visual feedback only)

**And** the status updates to COMPLETED via polling when finished

**When** generation completes (100%)
**Then** status changes to COMPLETED
**And** toast: "Audio ready for [lesson title]"
**And** play button appears

**When** generation fails
**Then** status changes to AUDIO_FAILED
**And** toast error: "Audio generation failed"
**And** retry button appears

**Prerequisites:** Story 5.1, Story 3.6

**Technical Notes:**

- Backend does NOT return progress; use `SimulatedProgressBar` pattern (approx 20s)
- Display progress bar in lesson row
- Use same polling mechanism as script generation

---

### Story 7.2: Regenerate Audio

**As a** Content Manager,
**I want** to regenerate audio with different settings,
**So that** I can improve the audio quality or change the voice.

**Acceptance Criteria:**

**Given** a lesson has existing audio (status COMPLETED)
**When** I click "Regenerate Audio"
**Then** configuration modal appears (same as Story 5.2)
**And** warning: "This will replace the current audio file."

**When** I confirm
**Then** new generation starts
**And** previous audio URL remains accessible until new one completes

**When** regeneration completes
**Then** new audio replaces old
**And** player updates to new audio

**Prerequisites:** Story 5.2, Story 5.4

**Technical Notes:**

- Same mutation as 5.1 with different config
- Backend handles old file cleanup
- Consider keeping last 2 versions for rollback (future)

---

### Story 7.3: Batch Audio Generation

**As a** Content Manager,
**I want** to generate audio for all lessons with completed scripts,
**So that** I can quickly complete an entire course.

**Acceptance Criteria:**

**Given** I am on course detail page
**When** I have multiple lessons with SCRIPT_COMPLETED status
**Then** I see "Generate All Audio" button in header

**When** I click "Generate All Audio"
**Then** confirmation modal shows:

- Number of lessons to process
- Shared audio configuration (applied to all)
- Estimated processing time
- Warning about server load

**When** I confirm
**Then** all eligible lessons start generating
**And** progress summary: "Generating audio: 3/8 complete"

**Given** some fail
**Then** summary shows: "6 succeeded, 2 failed"
**And** failed lessons have individual retry buttons

**Prerequisites:** Story 5.1, Story 5.2

**Technical Notes:**

- Mutation: `$api.useMutation('post', '/api/courses/{id}/generate-all-audios')`
- Progress modal with per-lesson status
- Rate limit awareness (don't overwhelm TTS service)

---

### Story 7.4: Skeleton Loaders for All Views

**As a** user,
**I want** to see loading skeletons while content loads,
**So that** I have visual feedback and the page doesn't jump around.

**Acceptance Criteria:**

**Given** I navigate to any page with async data
**When** the data is loading
**Then** I see skeleton placeholders matching the content layout:

- Course list: Card-shaped skeletons in grid
- Course detail: Header skeleton + lesson list skeletons
- Script viewer: Text block skeletons
- Audio player: Player control skeletons

**And** skeletons have subtle pulse animation

**When** data loads
**Then** skeletons fade out and real content fades in

**And** there is no layout shift (CLS < 0.1)

**Prerequisites:** Epics 2-6 complete

**Technical Notes:**

- Use `Skeleton` from shadcn/ui
- Create skeleton variants for each component type
- Match exact dimensions to prevent layout shift
- Use `Suspense` boundaries where appropriate

---

### Story 7.5: Error Boundaries and Graceful Degradation

**As a** user,
**I want** errors to be handled gracefully,
**So that** one error doesn't break the entire application.

**Acceptance Criteria:**

**Given** a component throws an error
**When** I'm viewing that section
**Then** only that section shows an error state:

- Friendly error message
- "Try again" button
- Option to "Report issue" (logs to console for now)

**And** the rest of the app remains functional

**Given** the API is completely unavailable
**Then** I see a full-page error state:

- "Unable to connect to server"
- Automatic retry every 30 seconds
- Manual "Retry now" button

**Given** my session expires
**Then** I see a modal: "Session expired. Please log in again."
**And** I'm redirected to login after clicking OK

**Prerequisites:** Epics 1-6 complete

**Technical Notes:**

- Create `ErrorBoundary` component using React error boundary pattern
- Wrap each major section (sidebar, main content, modals)
- Log errors to console (future: Sentry integration)
- Use `error.tsx` and `global-error.tsx` in Next.js App Router

---

### Story 7.6: Full Responsive Design

**As a** user on tablet or mobile,
**I want** the CMS to work well on my device,
**So that** I can manage content on the go.

**Acceptance Criteria:**

**Given** I access the CMS on a tablet (768px - 1024px)
**Then** the layout adapts:

- Sidebar collapses automatically
- Course grid shows 2 columns
- Tables show essential columns only
- Touch targets are 44px minimum

**Given** I access on mobile (< 768px)
**Then** the layout adapts:

- Sidebar hidden, accessible via hamburger menu
- Course grid shows 1 column
- Tables become card-based lists
- Full-width modals
- Bottom-fixed action buttons

**And** all interactions work with touch:

- Tap to select/open
- Swipe for actions (optional)
- Pinch-zoom disabled (not needed)

**Prerequisites:** Epics 2-6 complete

**Technical Notes:**

- Tailwind responsive classes: `sm:`, `md:`, `lg:`
- Test with Chrome DevTools device emulation
- Test on real devices if available
- Use `@container` queries for component-level responsiveness

---

### Story 7.7: Performance Optimization

**As a** user,
**I want** the app to load and respond quickly,
**So that** I can work efficiently without waiting.

**Acceptance Criteria:**

**Given** I load the course list page
**Then** LCP (Largest Contentful Paint) is < 2.5 seconds

**Given** I interact with any button or input
**Then** FID (First Input Delay) is < 100ms

**Given** content loads on any page
**Then** CLS (Cumulative Layout Shift) is < 0.1

**And** bundle size is optimized:

- Code splitting for heavy components (editor, audio player)
- Lazy loading for images
- Tree-shaking for unused code

**And** API responses are cached:

- Course list: 5 min stale time
- Single course: 2 min stale time
- Fresh data on mutations

**When** I run Lighthouse performance audit
**Then** score is 85+ on all pages

**Prerequisites:** Epics 2-6 complete

**Technical Notes:**

- Use Next.js dynamic imports: `const Editor = dynamic(() => import('./Editor'))`
- Use `next/image` for optimized images
- Verify React Query cache settings
- Analyze bundle with `@next/bundle-analyzer`
- Remove unused dependencies

---

### Story 7.8: Accessibility Compliance (WCAG AA)

**As a** user with disabilities,
**I want** the CMS to be fully accessible,
**So that** I can use it with assistive technologies.

**Acceptance Criteria:**

**Given** I navigate with keyboard only
**Then** I can:

- Tab through all interactive elements in logical order
- See visible focus indicators (cyan ring)
- Activate buttons with Enter/Space
- Navigate menus with arrow keys
- Close modals with Escape

**Given** I use a screen reader
**Then** I hear:

- Page titles announced on navigation
- Button labels and states ("Generate Script button, disabled")
- Form labels and error messages
- Status changes ("Script generation complete")
- Progress updates ("Loading, 50% complete")

**And** all images have alt text
**And** color is never the only indicator (icons + text for status)
**And** contrast ratio is 4.5:1 minimum for text

**When** I run Lighthouse accessibility audit
**Then** score is 90+ on all pages

**Prerequisites:** Epics 2-6 complete

**Technical Notes:**

- Use semantic HTML (button, nav, main, etc.)
- Add `aria-label` to icon-only buttons
- Use `aria-live` for dynamic content updates
- Test with NVDA (Windows) or VoiceOver (Mac)
- Run axe DevTools browser extension

---

## FR Coverage Matrix

| FR   | Description          | Epic      | Stories                      | Status      |
| ---- | -------------------- | --------- | ---------------------------- | ----------- |
| FR1  | Course Listing       | Epic 2    | ✅                           | Complete    |
| FR2  | Course Creation      | Epic 2    | ✅                           | Complete    |
| FR3  | Lesson Organization  | Epic 3    | 3.1, 3.2, 3.3, 3.4, 3.5, 3.6 | 🎯 Current  |
| FR4  | Script Generation    | Epic 4    | 4.1, 4.2, 4.3, 4.4, 4.5, 4.6 | Pending     |
| FR5  | Audio Generation     | Epic 5    | 5.1, 5.2, 5.4, 5.5           | Pending     |
| FR5  | Audio Gen (Advanced) | Epic 7    | 7.1, 7.2, 7.3                | Backlog     |
| FR6  | Navigation           | Epic 2    | ✅                           | Complete    |
| FR7  | Feedback System      | Epics 2-7 | Distributed                  | In Progress |
| FR8  | User Authentication  | Epic 1    | ✅                           | Complete    |
| FR9  | Session Management   | Epic 1    | ✅                           | Complete    |
| FR10 | Access Control       | Epic 1    | ✅                           | Complete    |
| FR11 | Security Features    | Epic 1    | ✅                           | Complete    |

---

## Summary

| Epic                                  | Stories        | Status      |
| ------------------------------------- | -------------- | ----------- |
| Epic 1: Foundation & Authentication   | 8+ (completed) | ✅ Complete |
| Epic 2: Course Discovery & Management | 6+ (completed) | ✅ Complete |
| Epic 3: Lesson Management             | 6 stories      | 🎯 Current  |
| Epic 4: AI Script Generation          | 6 stories      | ⏳ Pending  |
| Epic 5: Audio Generation & Playback   | 4 stories      | ⏳ Pending  |
| Epic 6: Polish & Production Readiness | 6 stories      | ⏳ Pending  |
| Epic 7: Post-MVP Features             | 3 stories      | 🔮 Backlog  |
| **Total Remaining**                   | **25 stories** |             |

---

## Implementation Priority

1. **Epic 3** (Current): Foundation for script/audio work
2. **Epic 4**: Core AI functionality
3. **Epic 5**: Complete meditation workflow
4. **Epic 6**: Production polish

---

_For implementation: Use the `create-story` workflow to generate individual story implementation plans from this epic breakdown._

_This document will be updated as implementation progresses._

---

**Version History:**

| Date       | Version | Changes                                 | Author          |
| ---------- | ------- | --------------------------------------- | --------------- |
| 2025-11-28 | 1.0     | Initial epic breakdown with all stories | Rupo (PM Agent) |
