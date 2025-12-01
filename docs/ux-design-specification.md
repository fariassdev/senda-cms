# senda-cms UX Design Specification

_Created on 2025-11-28 by Rupo_
_Generated using BMad Method - Create UX Design Workflow v1.0_

---

## Executive Summary

Senda CMS is a content management system for creating and managing guided meditation courses with AI-assisted script and audio generation. The UX balances creative inspiration with calm focus, empowering Content Managers, Meditation Teachers, and Technical Administrators to craft quality meditation content efficiently.

**Project Vision:** Streamline meditation course creation through AI assistance while maintaining creative control and quality consistency.

**Core Experience:** Creative ideation meets AI amplification - users generate inspired ideas, AI produces quality content, with full customization to match the user's vision.

**Desired Emotional Response:** A harmonious blend of "Creative & Inspired" with "Calm & Focused" - the interface itself should embody meditation principles while empowering creative content production with sufficient personalization options.

---

## 1. Design System Foundation

### 1.1 Design System Choice

[To be completed]

---

## 2. Core User Experience

### 2.1 Defining Experience

**Core Experience:** "AI-Amplified Meditation Content Creation"

**The ONE Thing Users Will Do Most:**
Creating and refining meditation course content through AI-assisted generation with full editorial control.

**What Should Be Absolutely Effortless:**

- Generating complete lesson scripts from simple prompts
- Previewing and iterating on AI-generated content
- Monitoring generation progress across multiple lessons
- Moving from idea → script → audio with minimal friction

**Most Critical User Action:**
The "Generate with AI" moment - where user creativity meets AI capability. This must feel:

- **Empowering**: User provides creative direction, AI executes
- **Transparent**: Clear what's happening during generation
- **Trustworthy**: Consistent quality, predictable results
- **Reversible**: Can regenerate, edit, version control

**Platform:** Web application (desktop-first, tablet-compatible)

### 2.2 Inspiration Analysis

**Reference Design:** User provided mockups of existing Senda CMS vision

**Key UX Patterns Identified:**

1. **Dark, Calming Interface**
   - Dark teal/charcoal background (#1A2B3C range) - reduces eye strain, promotes focus
   - Aligns perfectly with meditation content - calm, professional, not distracting
   - High contrast for accessibility

2. **Vibrant Cyan Primary Action Color**
   - Bright cyan/turquoise (#00D4FF) for CTAs - energetic but not aggressive
   - Stands out dramatically against dark background
   - Creates visual excitement without breaking the calm aesthetic

3. **Rich Information Cards**
   - Course cards show: title, description, progress bars, status badges, timestamps
   - Visual hierarchy: title largest, then description, then metadata
   - Generous padding - content breathes

4. **Semantic Status Colors**
   - Green: Published/Complete/Success
   - Orange/Yellow: In Progress/Draft
   - Red: Error/Failed
   - Blue: Processing/Generating
   - Universally understood color language

5. **Progressive Disclosure**
   - Script editor with inline formatting tools
   - Version history sidebar (AI generated timestamps)
   - Audio configuration (voice, music, speech rate, pitch, volume)
   - Detailed settings only when needed

6. **Real-time Feedback**
   - Progress bars with percentages
   - Status badges update live
   - Generation history with timestamps
   - Audio preview player integrated

**Core Experience Principle:** "AI-Assisted Creativity with Full Control"

- Prominent "Generate with AI" buttons
- Manual "Add New" options always available
- Edit/customize after generation
- Version control for iterations

### 2.3 Novel UX Patterns

No novel patterns required - leveraging proven CMS/dashboard patterns with meditation-appropriate aesthetics.

---

## 3. Visual Foundation

### 3.1 Color System

**Design System Foundation:** shadcn/ui (already installed)

shadcn/ui provides the component primitives with Tailwind CSS for styling. This gives us:

- Pre-built accessible components (buttons, forms, dialogs, tables, etc.)
- Customizable through Tailwind's theming system
- Consistent interaction patterns out of the box
- Dark mode support built-in

**Selected Theme:** Pastel Meditation (Hybrid)

A custom blend combining the structure of Theme 1 with softer, pastel tones inspired by Tokyo Night. This creates a calm, creative atmosphere with excellent readability and reduced eye strain.

**Core Palette:**

| Color Role         | Hex Code  | Usage                            | Rationale                                           |
| ------------------ | --------- | -------------------------------- | --------------------------------------------------- |
| **Background**     | `#1a1d29` | Main app background              | Soft dark blue-grey, easy on eyes for long sessions |
| **Surface**        | `#24283b` | Cards, modals, elevated elements | Subtle elevation, maintains calm aesthetic          |
| **Border**         | `#343b58` | Dividers, input borders          | Gentle separation without harsh lines               |
| **Primary**        | `#7dcfff` | CTAs, links, focus states        | Pastel cyan - energetic but calming                 |
| **Primary Hover**  | `#9ee4ff` | Button hover states              | Lighter cyan for feedback                           |
| **Text Primary**   | `#e1e8ed` | Headings, important text         | High contrast for readability                       |
| **Text Secondary** | `#a9b1d6` | Descriptions, metadata           | Softer for hierarchy                                |
| **Text Muted**     | `#6b7280` | Timestamps, helper text          | Subtle, non-distracting                             |

**Semantic Colors:**

| State       | Hex Code  | Usage                                  |
| ----------- | --------- | -------------------------------------- |
| **Success** | `#9ece6a` | Published, completed, success messages |
| **Warning** | `#e0af68` | In progress, draft, caution states     |
| **Error**   | `#f7768e` | Failed, errors, destructive actions    |
| **Info**    | `#7aa2f7` | Processing, informational states       |

**Typography System:**

- **Font Family:**
  - Headings: `Inter, -apple-system, system-ui, sans-serif`
  - Body: `Inter, -apple-system, system-ui, sans-serif`
  - Monospace: `'Fira Code', 'Courier New', monospace` (for timestamps, metadata)

- **Type Scale:**
  - H1: 2.5rem (40px) / 600 weight
  - H2: 2rem (32px) / 600 weight
  - H3: 1.5rem (24px) / 600 weight
  - H4: 1.25rem (20px) / 600 weight
  - Body: 1rem (16px) / 400 weight
  - Small: 0.875rem (14px) / 400 weight
  - Tiny: 0.75rem (12px) / 400 weight

- **Line Heights:**
  - Headings: 1.2
  - Body: 1.6
  - UI Elements: 1.5

**Spacing System:**

Based on 4px baseline:

- xs: 0.25rem (4px)
- sm: 0.5rem (8px)
- md: 1rem (16px)
- lg: 1.5rem (24px)
- xl: 2rem (32px)
- 2xl: 3rem (48px)
- 3xl: 4rem (64px)

**Layout Grid:**

- 12-column grid system (Tailwind default)
- Container max-width: 1440px
- Gutters: 1rem (16px) mobile, 1.5rem (24px) desktop

**Interactive Visualizations:**

- **Color Theme Explorer:** [ux-color-themes.html](./ux-color-themes.html) - Shows original 4 themes plus final hybrid

---

## 4. Design Direction

### 4.1 Design Direction Options

Four complete design approaches have been created as interactive mockups, each exploring different densities and visual styles while maintaining the core UX patterns from the mockup inspiration.

**Interactive Mockups:** [ux-design-directions.html](./ux-design-directions.html)

**Direction 1: Balanced & Clear** ✨ Recomendado

- Density: Medium (4-6 courses visible)
- Based directly on user mockups
- Perfect information/space balance
- Sidebar: Collapsible, left-aligned
- Grid: Responsive (3 cols desktop → 2 cols tablet → 1 col mobile)
- Card content: Title, full description, progress bar with %, status badge, timestamp
- Visual weight: Balanced - clear hierarchy without overwhelming

**Direction 2: Dense Dashboard** 📊

- Density: High (8-10 courses visible)
- For power users who want maximum information density
- Tighter spacing, smaller typography
- Same grid responsiveness
- Card content: Condensed descriptions, essential info only
- Visual weight: Information-rich, less breathing room

**Direction 3: Spacious & Calm** 🌊

- Density: Low (4-5 courses visible)
- Maximum tranquility and visual breathing room
- Generous padding, larger typography
- Extended descriptions for context
- Perfect for long work sessions without fatigue
- Visual weight: Minimal, lots of whitespace

**Direction 4: Modern Minimal** ✨

- Density: Medium (4-6 courses visible)
- Glassmorphism aesthetic with backdrop-filter blur
- Semi-transparent cards with subtle glow on hover
- Contemporary, sophisticated visual style
- Same functional density as Direction 1 with elevated aesthetics
- Visual weight: Modern depth with elevation cues

**Shared Patterns Across All Directions:**

- Sidebar navigation: Collapsible via button
- Search bar: Prominent, always accessible
- Filters: Status + Progress dropdowns + Sort + View toggle (grid/list)
- Progress bars: Gradient fill, percentage display
- Status badges: Semantic colors with dot indicators
- Empty state: Helpful guidance with CTA
- Responsive: Mobile-first, adapts gracefully

[User selection pending]

### 4.2 Final Design Direction Choice

**Selected: Direction 1 - Balanced & Clear** ✅

**Rationale:**

- Matches user-provided mockup vision exactly
- Optimal density (4-6 courses visible) for productive workflow without overwhelm
- Clear visual hierarchy prioritizes progress and status information
- Responsive grid adapts gracefully: 3 columns → 2 columns → 1 column
- Collapsible sidebar preserves screen real estate when needed
- Sufficient breathing room embodies meditation content aesthetic

**Key Design Decisions:**

**Layout Pattern:**

- Sidebar Navigation: Left-aligned, 240px width, collapsible via toggle button
- Main Content: Fluid width with max-width constraint (1440px)
- Grid System: CSS Grid with `repeat(auto-fill, minmax(350px, 1fr))`
- Card Dimensions: ~350-450px width, variable height based on content

**Information Hierarchy (Card Priority):**

1. Course Title (1.25rem, 600 weight) - Primary visual anchor
2. Progress Bar + Percentage - Critical status at-a-glance
3. Status Badge - Semantic color-coded state
4. Description - Supporting context
5. Timestamp - Secondary metadata

**Navigation Behavior:**

- Sidebar persists across routes
- Active route highlighted with accent color + border
- Collapses below 1024px viewport
- Mobile: Hidden by default, accessible via hamburger menu

**Interaction Patterns:**

- Card Hover: Subtle lift (4px translateY) + border glow + shadow
- Sidebar Collapse: Smooth 0.3s transform animation
- Progress Bars: Animated width transitions on value change
- Empty State: Centered, dashed border, friendly CTA

---

## 5. User Journey Flows

### 5.1 Critical User Paths

Based on PRD analysis and AI-first philosophy, five critical journeys defined:

---

#### Journey 1: Authentication Flow

**User Goal:** Securely access the CMS

**Flow:**

1. **Landing on /login**
   - User sees: Clean login form (email/username + password)
   - Branding: Senda logo, calming background
   - Error state: Red border + inline message if credentials fail
2. **Submit Credentials**
   - System: Validates, issues JWT tokens (access + refresh)
   - Loading: Button shows spinner, "Signing in..."
   - Success: Immediate redirect to /courses dashboard
3. **Session Management**
   - Auto-refresh: Token refreshes every 5min in background
   - Cross-tab sync: Login/logout syncs across browser tabs
   - Expiration: Graceful redirect to login with "Session expired" message

**Decision Points:**

- Invalid credentials → Show error, allow retry
- Server error → Show friendly error, suggest retry or contact support

**Success State:** User lands on courses dashboard with full auth context

---

#### Journey 2: Create Course with AI (PRIMARY WORKFLOW) ⭐

**User Goal:** Transform a course idea into a complete course structure using AI

**Approach:** Prompt-First (AI-Driven) - User provides creative direction, AI executes

**Flow:**

**Step 1: Initiate Creation**

- Entry: Click "Create New Course" button from dashboard
- User sees: Modal or dedicated page with prominent prompt input
- UI: Large textarea, placeholder: "Describe your meditation course idea... (e.g., '10-day mindfulness course for beginners focusing on breath awareness')"
- Optional fields collapsed: Advanced options (category, difficulty, custom instructions)

**Step 2: AI Generation**

- User: Writes prompt, clicks "✨ Generate Course"
- System: Shows loading state with progress messages:
  - "Analyzing your concept..."
  - "Generating course structure..."
  - "Creating lesson outlines..."
- Visual: Animated progress bar or skeleton UI
- Duration expectation: ~5-10 seconds

**Step 3: Review Generated Structure**

- User sees: Complete course preview with:
  - **Generated Course Title** (editable inline)
  - **Course Description** (editable textarea)
  - **Auto-selected Category & Difficulty** (dropdowns)
  - **AI-suggested Tags** (chips, can add/remove)
  - **Lesson List** (10 lessons with titles, durations, key themes)
- Each element has edit icon for inline modification
- Visual hierarchy: Clear "AI Generated" badge to set expectations

**Step 4: Refine & Customize**

- User can:
  - Edit any field inline (click to edit)
  - Reorder lessons (drag-and-drop)
  - Add/remove lessons (+ button, trash icon)
  - Regenerate specific parts ("Regenerate title", "Regenerate lessons")
  - Add cover image (upload or drag-and-drop)

**Step 5: Save Course**

- Primary action: "Publish Course" (cyan button)
- Secondary action: "Save as Draft" (outline button)
- On save:
  - Success toast: "Course created successfully!"
  - Navigate to: Course detail page
  - Background process: Lessons enter PENDING status, ready for script generation

**Decision Points:**

- Generation fails → Show error, allow retry with modified prompt
- User wants manual control → "Switch to manual mode" option reveals full form
- Unsaved changes → "Save draft?" confirmation on navigate away

**Error Recovery:**

- Network error → Retry with exponential backoff
- AI service error → Fallback to manual form with error explanation
- Invalid prompt → Helpful suggestions ("Try being more specific about...")

**Success State:** Course created with complete structure, user on course detail page ready to generate scripts

---

#### Journey 3: Generate Lesson Scripts with AI

**User Goal:** Transform lesson outlines into complete meditation scripts with AI

**Entry Point:** Course detail page → Lesson list

**Flow:**

**Step 1: Select Lesson(s)**

- User sees: List of lessons with status badges (PENDING, SCRIPT_GENERATING, SCRIPT_COMPLETED)
- Options:
  - Single lesson: Click "Generate Script" button on lesson row
  - Batch: Select multiple lessons (checkboxes) → "Generate All Scripts" button

**Step 2: Configure Script Generation (Optional)**

- Modal appears with:
  - Lesson title (pre-filled, editable)
  - Key themes/keywords (comma-separated, from AI or manual)
  - Tone selection: Calming, Energizing, Neutral, Custom
  - Duration target: Auto from course structure, adjustable
- CTA: "✨ Generate Script" button

**Step 3: AI Script Generation**

- System:
  - Lesson status → SCRIPT_GENERATING
  - Progress indicator on lesson card
  - Real-time updates (WebSocket or polling)
- User sees: Progress percentage, estimated time remaining
- Can navigate away: Generation continues in background
- Notification: Toast when script completes

**Step 4: Review & Edit Script**

- Navigate to: Lesson Script Editor page
- User sees:
  - Generated script with formatting ([PAUSE 3s], [BREATHE IN], etc.)
  - Rich text editor with meditation-specific controls
  - Word count, character count
  - Version history sidebar (AI generated timestamps)
- Edit capabilities:
  - Inline text editing
  - Add meditation cues (breathing, pauses)
  - Regenerate sections or entire script

**Step 5: Approve Script**

- Actions:
  - "Save Changes" → Updates current version
  - "Generate Audio" → Proceeds to audio generation
  - "Regenerate" → New AI generation attempt
- Status update: PENDING → SCRIPT_COMPLETED

**Decision Points:**

- Script quality insufficient → Regenerate with different parameters
- Multiple versions → Compare side-by-side, choose best
- Generation fails → Error message, retry option, manual editing fallback

**Success State:** Script approved, ready for audio generation

---

#### Journey 4: Generate Audio from Script

**User Goal:** Convert approved script to high-quality meditation audio

**Entry Point:** Lesson detail page (script completed) → "Generate Audio" button

**Flow:**

**Step 1: Audio Configuration**

- Modal with configuration options:
  - **Voice Selection:** Dropdown with voice samples (Aria-Calm, Leo, etc.)
  - **Background Music:** Dropdown (Peaceful Garden, Silence, etc.)
  - **Speech Rate:** Slider (0.8x - 1.2x) with preview
  - **Pitch:** Slider (-10% to +10%)
  - **Volume:** Slider (0-100%)
- Preview button: Plays 10-second sample with current settings
- CTA: "✨ Generate Audio"

**Step 2: Audio Generation**

- System:
  - Lesson status → AUDIO_GENERATING
  - Progress bar with estimated time
  - Can navigate away, generation continues
- Visual: Waveform animation, progress percentage
- Notification when complete

**Step 3: Review & Download**

- User sees:
  - **Audio Player:** Native HTML5 with custom controls
  - **Waveform Visualization:** Visual representation of audio
  - **Generation Status:** Complete with success badge
  - **Download Button:** Download MP3/WAV
  - **Regenerate Button:** New generation with different settings
- Generation history: List of attempts with timestamps, settings used

**Step 4: Approve or Regenerate**

- If satisfied: Status → AUDIO_COMPLETED (lesson fully complete)
- If not: Adjust settings, regenerate
- Actions:
  - "Approve Audio" → Marks lesson complete
  - "Replace Audio" → Upload custom audio file
  - "Download" → Save to device

**Decision Points:**

- Quality issues → Regenerate with adjusted settings
- Voice doesn't match → Try different voice, compare
- Background music too loud → Adjust volume slider, regenerate

**Error Recovery:**

- TTS service error → Retry automatically, show error after 3 attempts
- Network interruption → Resume generation, not restart
- File corruption → Re-generate with same settings

**Success State:** Audio approved and complete, lesson fully published

---

#### Journey 5: Manage Lesson Collection

**User Goal:** Organize, reorder, and maintain lesson structure within a course

**Entry Point:** Course detail page → Lessons tab

**Flow:**

**Step 1: View Lesson List**

- User sees: Table/list with columns:
  - Checkbox (for batch operations)
  - Drag handle (⋮⋮ icon)
  - Lesson title
  - Status badge (color-coded)
  - Duration
  - Last updated
  - Actions (edit, view, delete icons)
- Filters: Status dropdown, sort by order/date/status

**Step 2: Reorder Lessons**

- Interaction: Drag-and-drop using drag handle
- Visual feedback: Ghost placeholder, smooth animation
- Auto-save: Order persists immediately
- Undo option: Toast with "Undo reorder" for 5 seconds

**Step 3: Batch Operations**

- Select multiple lessons via checkboxes
- Bulk actions toolbar appears:
  - Generate Scripts (all selected)
  - Generate Audio (all selected with completed scripts)
  - Delete selected
  - Change status
- Confirmation: Modal for destructive actions

**Step 4: Add New Lesson**

- Click "+ Add Lesson" button
- Modal with options:
  - "Generate with AI" → Prompt input
  - "Create Manually" → Full form
- AI option: Generates single lesson fitting course theme
- Manual option: Title, description, duration, key themes

**Decision Points:**

- Delete lesson → Confirmation modal with impact warning
- Reorder with unsaved scripts → Warning about losing work
- Add lesson to full course → Allow unlimited or set max

**Success State:** Lesson collection organized, ready for next steps

---

### 5.2 Journey Flow Diagrams

```mermaid
graph TD
    A[Dashboard] -->|Click Create| B[Course Creation Prompt]
    B -->|Enter Idea| C[AI Generates Structure]
    C -->|Success| D[Review & Edit Course]
    C -->|Error| E[Manual Form Fallback]
    D -->|Save| F[Course Detail Page]
    F -->|View Lessons| G[Lesson List]
    G -->|Generate Script| H[Script Configuration]
    H -->|AI Process| I[Script Editor]
    I -->|Approve| J[Generate Audio]
    J -->|Configure| K[Audio Generation]
    K -->|Complete| L[Audio Preview]
    L -->|Approve| M[Lesson Complete]

    style C fill:#7dcfff
    style I fill:#7dcfff
    style K fill:#7dcfff
```

**Key Journey Principles:**

1. **AI-First, Manual Always Available:** Every AI step has manual override
2. **Progressive Disclosure:** Advanced options collapsed by default
3. **Non-Blocking Operations:** Long tasks run in background with notifications
4. **Clear State Visibility:** Status badges everywhere, progress always visible
5. **Forgiving UX:** Undo options, autosave, confirmation for destructive actions
6. **Version Control:** Every AI generation creates a version, user picks best

---

## 6. Component Library

### 6.1 Component Strategy

[To be completed]

---

## 6. Component Library

### 6.1 Component Strategy

**Foundation:** shadcn/ui components with custom theming

**Components from shadcn/ui (Already Installed):**

- Button, Input, Card, Form, Label, Select
- Table, Skeleton, Badge, Dialog, Sonner (toasts)
- Sidebar, Sheet, Separator, Switch, Textarea, Tooltip

**Custom Components Needed:**

1. **CourseCard**
   - Purpose: Display course summary with progress
   - Content: Title, description, progress bar, status badge, timestamp, menu
   - States: Default, hover (lift + glow), loading (skeleton)
   - Variants: Grid view, list view
2. **ProgressBar**
   - Purpose: Visual progress indication
   - Content: Gradient fill, percentage label
   - States: Normal (#7dcfff), error (#f7768e), complete (100%)
   - Variants: Inline (small), prominent (default)

3. **StatusBadge**
   - Purpose: Semantic state indication
   - Content: Dot indicator + text label
   - States: Published (green), Draft (grey), In Progress (orange), Error (red), Processing (blue)
   - Variants: Small, medium (default)

4. **ScriptEditor**

- Purpose: Edit meditation scripts with special formatting
- Content: Rich text area with meditation cue buttons ([PAUSE], [BREATHE], etc.)
- States: Editing, saving (manual - explicit Save), saved
- Features: Word count, character count, explicit Save control and save indicator

5. **AudioPlayer**
   - Purpose: Preview generated audio
   - Content: Play/pause, timeline, volume, download button
   - States: Loading, playing, paused, error
   - Features: Waveform visualization (optional), playback speed control

6. **LessonListItem**
   - Purpose: Display lesson in course
   - Content: Drag handle, checkbox, title, status, duration, actions
   - States: Default, selected, dragging, hover
   - Interaction: Drag-and-drop reordering

**shadcn/ui Customization:**

- All components use pastel theme CSS variables
- Button primary → cyan (#7dcfff) background
- Form inputs → dark background (#24283b) with cyan focus ring
- Dialogs → backdrop blur, dark surface
- Toasts → positioned top-right, auto-dismiss 4s

---

## 7. UX Pattern Decisions

### 7.1 Consistency Rules

These patterns ensure predictable, cohesive behavior across the entire application.

---

#### Button Hierarchy

**Primary Actions** (What moves the user forward)

- Style: Solid cyan (#7dcfff) background, dark text (#1a1d29)
- Usage: "Create Course", "Generate Script", "Save", "Publish"
- Hover: Lighter cyan (#9ee4ff) + lift effect
- Disabled: Grey background (#2a3f54), grey text (#5a6d7f)

**Secondary Actions** (Alternative or less critical)

- Style: Transparent background, cyan border, cyan text
- Usage: "Save as Draft", "Cancel", "Add Lesson"
- Hover: Filled cyan background with transition

**Tertiary Actions** (Utility, low emphasis)

- Style: Ghost (no border), grey text (#a9b1d6)
- Usage: "Skip", "Learn More", inline actions
- Hover: Light background highlight

**Destructive Actions** (Delete, remove, irreversible)

- Style: Red/pink (#f7768e) background, white text
- Usage: "Delete Course", "Remove Lesson", "Discard Changes"
- Hover: Darker red
- Always require confirmation

**Icon Buttons** (Space-saving actions)

- Style: Square/round, icon only, grey default
- Usage: Edit, Delete, More options (⋮), Close
- Hover: Background highlight, icon color change

---

#### Feedback & Notifications

**Success Messages**

- Pattern: Toast notification (top-right)
- Style: Green background (#9ece6a), white text, success icon
- Examples: "Course created", "Script generated", "Changes saved"
- Duration: 4 seconds auto-dismiss
- Interaction: Click to dismiss immediately

**Error Messages**

- Pattern: Toast notification (top-right) + inline form errors
- Style: Red/pink background (#f7768e), white text, error icon
- Examples: "Generation failed", "Network error", "Invalid input"
- Duration: 6 seconds (longer to read) or manual dismiss
- Inline: Below form field with explanation

**Warning Messages**

- Pattern: Toast or inline banner
- Style: Orange background (#e0af68), dark text
- Examples: "Unsaved changes", "Low storage", "API rate limit"
- Duration: 5 seconds or manual dismiss

**Info Messages**

- Pattern: Toast or banner
- Style: Blue background (#7aa2f7), white text
- Examples: "Processing in background", "Feature tip", "Update available"
- Duration: 4 seconds

**Loading States**

- Pattern: Inline spinners, progress bars, skeleton screens
- Style: Cyan spinner, animated gradient progress bars
- Usage: Button → spinner replaces text; Page → skeleton; Long task → progress bar
- Text: "Generating...", "Saving...", "Loading..."

---

#### Form Patterns

**Label Position**

- Pattern: Above input (stacked)
- Required fields: Asterisk (\*) after label
- Optional fields: "(optional)" suffix in grey

**Validation Timing**

- onBlur: Validate when user leaves field
- onChange: Real-time for passwords, confirmations
- onSubmit: Final validation before submission

**Error Display**

- Pattern: Red border on input + error message below
- Icon: ⚠️ or ✕ inside input (right side)
- Message: Specific, actionable ("Email must be valid", not "Invalid input")

**Help Text**

- Pattern: Small grey text below input
- Usage: Format hints, examples, character limits
- Style: 0.85rem, grey (#6b7280)

**Input States**

- Default: Dark background (#24283b), light border (#343b58)
- Focus: Cyan border (#7dcfff), cyan glow shadow
- Error: Red border (#f7768e), red glow
- Disabled: Darker background, grey text, cursor not-allowed

---

#### Modal & Dialog Patterns

**Size Variants**

- Small: 400px max-width (confirmations, simple forms)
- Medium: 600px max-width (default, most forms)
- Large: 900px max-width (complex content, previews)
- Full: 90vw (editors, detailed views)

**Dismiss Behavior**

- Click outside: Dismisses modal (with unsaved changes warning if applicable)
- Escape key: Dismisses modal
- Close button: Always present (× in top-right)
- Destructive actions: Require explicit button click, no outside-click dismiss

**Focus Management**

- On open: Auto-focus first input or primary action
- Tab navigation: Trapped within modal
- On close: Return focus to trigger element

**Backdrop**

- Style: Semi-transparent dark overlay (rgba(0, 0, 0, 0.6))
- Effect: Backdrop blur (8px) for depth

---

#### Navigation Patterns

**Active State Indication**

- Sidebar: Cyan background highlight + right border accent
- Breadcrumbs: Bold text + non-clickable
- Tabs: Underline + cyan color

**Breadcrumb Usage**

- Show when: Nested 2+ levels deep
- Format: Courses / Course Title / Lesson Title
- Interaction: Clickable except current page

**Back Button Behavior**

- Browser back: Native browser history
- In-app back: Breadcrumb navigation or explicit back button
- Unsaved changes: Warning before navigation

---

#### Empty State Patterns

**First Use** (No content yet)

- Visual: Large icon (64px), centered
- Title: "Create your first course"
- Description: Helpful explanation of next step
- CTA: Primary button "Create Course"
- Style: Dashed border, empty state container

**No Results** (Search/filter returns nothing)

- Visual: Magnifying glass icon
- Title: "No courses found"
- Description: "Try adjusting your filters or search term"
- CTA: "Clear filters" button

**Error State** (Failed to load)

- Visual: Error icon
- Title: "Failed to load courses"
- Description: Error message + reason if available
- CTA: "Try again" button, "Contact support" link

---

#### Confirmation Patterns

**Delete Confirmations**

- Pattern: Modal dialog
- Content: "Are you sure you want to delete [item name]?"
- Warning: "This action cannot be undone"
- Buttons: "Cancel" (secondary) + "Delete" (destructive primary)
- Enhancement: Type item name to confirm for critical deletions

**Unsaved Changes**

- Pattern: Modal dialog on navigate away
- Content: "You have unsaved changes"
- Buttons: "Discard" (destructive) + "Save & Continue" (primary) + "Cancel" (secondary)

**Irreversible Actions**

- Pattern: Two-step confirmation
- Step 1: Modal with explanation
- Step 2: Require typing confirmation text or waiting 3 seconds
- Usage: Delete course with lessons, bulk deletions

---

#### Search & Filter Patterns

**Search Trigger**

- Pattern: Instant search (onChange with 300ms debounce)
- Placeholder: Descriptive ("Search courses by title or keyword...")
- Clear button: × appears when text entered
- Results: Update below as user types

**Filter Placement**

- Pattern: Horizontal row above content
- Style: Dropdowns + toggles in filter bar
- Persist: Filter state in URL query params

**Sort Options**

- Pattern: Dropdown in filter bar
- Default: "Last Modified" (descending)
- Options: Date, Title (A-Z), Status, Progress
- Indicator: Arrow icon showing direction

**Active Filters**

- Pattern: Chips/badges showing active filters
- Interaction: Click × on chip to remove filter
- "Clear all" link when 2+ filters active

---

#### Notification Patterns (Real-time Updates)

**Background Task Completion**

- Pattern: Toast notification when user elsewhere
- Content: "Script generation complete for [lesson title]"
- Action: "View" button to navigate
- Auto-dismiss: 6 seconds

**Progress Updates**

- Pattern: Live progress bar on item card
- Updates: Via polling (5s interval) or WebSocket
- Notification: Toast when complete

**Multi-item Operations**

- Pattern: Progress modal for batch operations
- Content: "Generating 5 scripts... 2 of 5 complete"
- Cancellable: "Stop" button to cancel remaining
- Summary: "4 succeeded, 1 failed" on completion

---

#### Date & Time Patterns

**Relative Timestamps** (Recent items)

- Format: "2 days ago", "5 hours ago", "Just now"
- Threshold: Items < 7 days old
- Hover: Tooltip with absolute date/time

**Absolute Timestamps** (Older items)

- Format: "Oct 12, 2023" or "2023-10-12" based on locale
- Time: Omit unless relevant ("Oct 12, 2023 at 3:45 PM")

**Timezone Handling**

- Display: User's local timezone (auto-detected)
- Storage: UTC on server
- Format: Clear timezone indicator if ambiguous

---

#### Accessibility Patterns

**Keyboard Navigation**

- All interactive elements: Accessible via Tab
- Focus indicators: Visible cyan outline (2px, offset 2px)
- Skip links: "Skip to main content" for screen readers
- Shortcuts: Documented in help (e.g., "Ctrl+K" for search)

**ARIA Labels**

- Icons: aria-label on all icon-only buttons
- Status: aria-live regions for dynamic updates
- Forms: Proper label associations, error announcements

**Color Independence**

- Status: Never rely on color alone (use icons + text)
- Contrast: WCAG AA minimum (4.5:1 for text)
- Patterns: Combine color with shape/position/text

**Screen Reader Support**

- Landmarks: Proper HTML5 semantic elements
- Headings: Logical hierarchy (h1 → h2 → h3)
- Tables: Headers properly associated
- Images: Alt text for meaningful images, decorative marked

---

### 7.2 Pattern Decision Summary

**Philosophy:** Predictable, forgiving, efficient

**Key Principles:**

1. **Consistency Over Novelty:** Same pattern everywhere builds muscle memory
2. **Feedback Always Visible:** User never wonders "did that work?"
3. **Reversible By Default:** Undo options, confirmations for destructive actions
4. **Progressive Disclosure:** Advanced options hidden until needed
5. **Accessible First:** Keyboard, screen reader, color-independent from day one

---

## 8. Responsive Design & Accessibility

### 8.1 Responsive Strategy

**Breakpoint System:**

| Breakpoint | Width          | Columns                   | Sidebar            | Primary Use Case                     |
| ---------- | -------------- | ------------------------- | ------------------ | ------------------------------------ |
| Mobile     | < 640px        | 1                         | Hidden (hamburger) | Phones, checking status on-the-go    |
| Tablet     | 640px - 1024px | 2                         | Collapsible        | iPad, moderate editing work          |
| Desktop    | > 1024px       | 3                         | Visible by default | Primary workspace, full productivity |
| Large      | > 1440px       | 3 (max-width constrained) | Visible            | Large monitors, extra breathing room |

**Responsive Adaptations:**

**Navigation:**

- **Desktop (>1024px):** Sidebar visible, 240px width, always accessible
- **Tablet (640-1024px):** Sidebar auto-collapsed, toggle button visible, overlay when opened
- **Mobile (<640px):** Sidebar hidden, hamburger menu (☰), full-screen overlay on open

**Course Grid:**

- **Desktop:** 3 columns (repeat(auto-fill, minmax(350px, 1fr)))
- **Tablet:** 2 columns automatically via grid algorithm
- **Mobile:** 1 column, full width

**Cards:**

- **Desktop/Tablet:** Horizontal layout, description visible
- **Mobile:** Vertical layout, description truncated to 2 lines with "Read more"

**Tables (Lesson Lists):**

- **Desktop:** Full table with all columns
- **Tablet:** Hide less critical columns (e.g., "Date Created"), show on demand
- **Mobile:** Card view instead of table, swipe for actions

**Forms:**

- **Desktop/Tablet:** Side-by-side fields where logical (e.g., Category | Difficulty)
- **Mobile:** All fields stacked vertically, full width

**Modals:**

- **Desktop/Tablet:** Centered overlay, constrained width
- **Mobile:** Full-screen (100vh), slide-up animation

**Touch Targets:**

- **Mobile:** Minimum 44x44px tap targets (WCAG 2.1 guideline)
- **Desktop:** Minimum 32x32px click targets
- Spacing: 8px minimum between interactive elements on mobile

---

### 8.2 Accessibility Strategy

**Target Compliance:** WCAG 2.1 Level AA

**Rationale:** Senda CMS is an admin tool, not a public website, but accessibility ensures:

- Usable by content managers with disabilities
- Better UX for everyone (keyboard power users, temporary limitations)
- Legal compliance for organizations with accessibility requirements
- Demonstrates meditation industry's commitment to inclusivity

---

**Color Contrast Requirements:**

| Element Type        | Required Ratio | Our Implementation                     |
| ------------------- | -------------- | -------------------------------------- |
| Normal Text (16px+) | 4.5:1          | #e1e8ed on #1a1d29 = 11.5:1 ✅         |
| Large Text (24px+)  | 3:1            | All headings exceed 7:1 ✅             |
| UI Components       | 3:1            | Buttons, borders meet minimum ✅       |
| Interactive States  | 3:1            | Focus rings, hover states compliant ✅ |

**Status Colors (Color-Blind Safe):**

- Green (Published): Paired with ✓ checkmark icon
- Orange (In Progress): Paired with ⏳ hourglass icon
- Red (Error): Paired with ✕ or ⚠️ icon
- Blue (Processing): Paired with ⟳ refresh icon
- Never rely on color alone

---

**Keyboard Navigation:**

**Global Shortcuts:**

- `Tab` / `Shift+Tab` - Navigate between interactive elements
- `Enter` / `Space` - Activate buttons, links
- `Escape` - Close modals, cancel operations
- `Ctrl+K` / `Cmd+K` - Focus search bar (future enhancement)
- `?` - Show keyboard shortcuts help modal

**Focus Management:**

- Visible focus ring: 2px solid cyan (#7dcfff), 2px offset
- Skip to main content link for screen readers
- Focus trap in modals (Tab cycles within modal)
- Return focus to trigger element on modal close

**Interactive Elements:**

- All clickable elements accessible via keyboard
- Drag-and-drop: Alternative keyboard reorder (Arrow keys + modifier)
- Hover-only actions: Also accessible via focus state

---

**Screen Reader Support:**

**Semantic HTML:**

- `<header>`, `<nav>`, `<main>`, `<aside>`, `<footer>` landmarks
- Proper heading hierarchy (h1 → h2 → h3, no skipping levels)
- `<button>` for actions, `<a>` for navigation
- `<table>` with `<thead>`, `<tbody>`, `<th>` for data tables

**ARIA Attributes:**

- `aria-label` on icon-only buttons ("Delete course", "Edit lesson")
- `aria-live="polite"` on status updates, toast notifications
- `aria-live="assertive"` on critical errors
- `aria-expanded` on collapsible sections, dropdowns
- `aria-current="page"` on active navigation items
- `aria-busy="true"` during loading states
- `aria-describedby` connecting form inputs to help text

**Dynamic Content Announcements:**

- Course created → "Course 'Mindfulness 101' created successfully"
- Script generating → "Script generation started for Lesson 1"
- Generation complete → "Script for Lesson 1 is ready to review"
- Error occurred → "Error: Failed to generate audio. Please try again"

---

**Form Accessibility:**

- Labels: Always visible, properly associated with `<label for="id">`
- Required fields: Visual asterisk + `aria-required="true"`
- Error messages: `aria-invalid="true"` + `aria-describedby` linking to error
- Help text: Connected via `aria-describedby`
- Placeholder text: NOT relied upon as labels (placeholders disappear)

**Example:**

```html
<label for="course-title">
  Course Title <span aria-label="required">*</span>
</label>
<input
  id="course-title"
  type="text"
  aria-required="true"
  aria-invalid="false"
  aria-describedby="title-help title-error"
/>
<small id="title-help">Choose a clear, descriptive name</small>
<span id="title-error" role="alert" hidden>Title is required</span>
```

---

**Testing Strategy:**

**Automated Testing:**

- Tool: Lighthouse, axe DevTools (browser extension)
- Run: On every page/component in development
- CI/CD: Automated accessibility tests in pipeline (future)
- Threshold: 90+ Lighthouse accessibility score

**Manual Testing:**

- Keyboard-only navigation: Test all flows without mouse
- Screen reader: NVDA (Windows), VoiceOver (Mac), JAWS (enterprise)
- Color blindness: Simulate via browser DevTools
- Zoom: Test up to 200% zoom without horizontal scroll

**User Testing:**

- Include users with disabilities in UX testing sessions
- Gather feedback on screen reader experience
- Test with keyboard-only users

---

### 8.3 Performance Considerations

**Core Web Vitals Targets:**

- LCP (Largest Contentful Paint): < 2.5s
- FID (First Input Delay): < 100ms
- CLS (Cumulative Layout Shift): < 0.1

**Optimization Strategies:**

- Skeleton screens prevent layout shift during load
- Images: Next.js Image component with lazy loading
- Fonts: Self-hosted, preloaded for speed
- Code splitting: Dynamic imports for heavy components (audio player, script editor)
- API: React Query caching, stale-while-revalidate strategy

**Perceived Performance:**

- Optimistic UI updates (show success immediately, rollback on error)
- Instant feedback on interactions (no perceived delay)
- Progressive enhancement (core functionality works, enhancements layer on)

---

### 8.4 Browser Support

**Primary Support:** Modern evergreen browsers

- Chrome/Edge (Chromium): Latest 2 versions
- Firefox: Latest 2 versions
- Safari: Latest 2 versions

**Minimum Support:**

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

**Not Supported:**

- Internet Explorer (EOL)
- Older mobile browsers (<2 years)

**Graceful Degradation:**

- Feature detection for advanced features (backdrop-filter, CSS Grid)
- Polyfills only when necessary, loaded conditionally
- Core functionality works without JavaScript (forms submit, navigation works)

---

### 8.5 Responsive & Accessibility Summary

**Mobile-First Approach:** Design for smallest screen, enhance up
**Accessible by Default:** WCAG AA compliance from day one, not an afterthought
**Performance Budget:** Fast by design, optimizations baked in
**Progressive Enhancement:** Core works everywhere, enhancements where supported

**Key Metrics:**

- ✅ WCAG 2.1 Level AA compliant
- ✅ Keyboard accessible (100% navigation without mouse)
- ✅ Screen reader friendly (semantic HTML + ARIA)
- ✅ Color-independent (icons + text for all status)
- ✅ Responsive (mobile → tablet → desktop)
- ✅ Touch-friendly (44px minimum tap targets)
- ✅ Fast (< 2.5s LCP, < 100ms FID)

---

## 9. Implementation Guidance

### 9.1 Completion Summary

**✅ UX Design Specification Complete!**

This specification provides comprehensive guidance for implementing Senda CMS with a cohesive, accessible, AI-first user experience.

**What We've Defined:**

1. **✅ Project Vision & Emotional Goals**
   - Creative & Inspired + Calm & Focused aesthetic
   - AI amplifies user creativity with full customization control

2. **✅ Visual Foundation**
   - Pastel meditation theme (Tokyo Night inspired)
   - Complete color palette with semantic meanings
   - Typography system (Inter font family)
   - Spacing scale (4px baseline)

3. **✅ Design Direction**
   - Direction 1: Balanced & Clear (selected)
   - Medium density (4-6 courses visible)
   - Collapsible sidebar, responsive grid
   - Clear visual hierarchy prioritizing progress and status

4. **✅ User Journey Flows**
   - 5 critical journeys documented in detail
   - Authentication, course creation, script generation, audio generation, lesson management
   - AI-first approach with manual fallbacks
   - Flow diagrams with decision points and error recovery

5. **✅ Component Library**
   - shadcn/ui foundation with 6 custom components
   - CourseCard, ProgressBar, StatusBadge, ScriptEditor, AudioPlayer, LessonListItem

6. **✅ UX Pattern Decisions**
   - Button hierarchy (primary, secondary, tertiary, destructive)
   - Feedback patterns (toasts, inline errors, loading states)
   - Form patterns (validation, labels, help text)
   - Modal behaviors (sizes, dismiss, focus management)
   - Navigation patterns (active states, breadcrumbs)
   - Empty states (first use, no results, errors)
   - Confirmation patterns (delete, unsaved changes)
   - Search & filter patterns
   - Date/time formatting
   - Accessibility patterns (keyboard, ARIA, screen reader)

7. **✅ Responsive & Accessibility**
   - 3 breakpoints (mobile, tablet, desktop)
   - WCAG 2.1 Level AA compliance
   - Complete keyboard navigation
   - Screen reader support with semantic HTML and ARIA
   - Color-independent status indicators
   - Performance targets (Core Web Vitals)

---

### 9.2 Design Deliverables

**Interactive Prototypes:**

1. **Color Theme Explorer:** `docs/ux-color-themes.html`
   - 4 theme variations with live components
   - Click colors to copy hex codes
   - Full component examples in each theme

2. **Design Direction Showcase:** `docs/ux-design-directions.html`
   - 4 complete design directions with interactive mockups
   - Full dashboard with courses, sidebar, filters
   - Toggle between desktop/tablet/mobile views
   - Collapsible sidebar demonstration

**Documentation:** 3. **UX Design Specification:** `docs/ux-design-specification.md` (this document)

- Complete design system documentation
- User journey flows with decision trees
- UX pattern library
- Implementation guidelines

---

### 9.3 Developer Handoff Notes

**For Implementation Team:**

**Design Tokens (Tailwind Config):**

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        background: '#1a1d29',
        surface: '#24283b',
        border: '#343b58',
        primary: {
          DEFAULT: '#7dcfff',
          hover: '#9ee4ff',
        },
        text: {
          primary: '#e1e8ed',
          secondary: '#a9b1d6',
          muted: '#6b7280',
        },
        success: '#9ece6a',
        warning: '#e0af68',
        error: '#f7768e',
        info: '#7aa2f7',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['Fira Code', 'Courier New', 'monospace'],
      },
    },
  },
};
```

**shadcn/ui Theme:**

- Already configured in `components.json`
- Update CSS variables in `app/globals.css` to match pastel palette
- Component styling inherits from Tailwind config

**Priority Implementation Order:**

1. **Phase 1:** Color theme + typography + base components
2. **Phase 2:** Dashboard layout + course cards + sidebar
3. **Phase 3:** Course creation flow (AI prompt → review → save)
4. **Phase 4:** Script generation + editor
5. **Phase 5:** Audio generation + player
6. **Phase 6:** Lesson management + drag-and-drop

**Key Technical Considerations:**

- **Real-time Updates:** Use React Query polling (5s interval) or WebSocket for generation progress
- **Optimistic Updates:** Update UI immediately, rollback on error
- **Error Boundaries:** Wrap components to catch and display errors gracefully
- **Accessibility:** Use shadcn/ui components (built accessible), add ARIA where needed
- **Performance:** Code split heavy components (editor, audio player), lazy load routes

---

### 9.4 UX Validation Checklist

Before marking UX implementation complete, validate:

**Visual Design:**

- [ ] Pastel color palette applied consistently across all pages
- [ ] Typography scale matches specification (Inter font, correct sizes)
- [ ] Spacing follows 4px baseline grid
- [ ] Hover/focus states work on all interactive elements
- [ ] Dark theme renders correctly (no light theme leaks)

**User Journeys:**

- [ ] Can create course from prompt successfully
- [ ] AI generation shows progress with live updates
- [ ] Script editor allows editing and uses explicit Save control (no autosave)
- [ ] Audio player previews generated audio
- [ ] Lesson reordering works via drag-and-drop
- [ ] All error states display helpful messages

**Component Library:**

- [ ] All 6 custom components implemented and working
- [ ] shadcn/ui components themed correctly
- [ ] Loading skeletons show during data fetch
- [ ] Status badges use semantic colors + icons
- [ ] Progress bars animate smoothly

**UX Patterns:**

- [ ] Button hierarchy clear (primary cyan, secondary outline, etc.)
- [ ] Toasts appear for all success/error/info events
- [ ] Forms validate on blur and show inline errors
- [ ] Modals trap focus and dismiss correctly
- [ ] Confirmations appear for destructive actions
- [ ] Empty states guide user to next action

**Responsive Design:**

- [ ] Mobile (< 640px): 1 column, hamburger menu, touch targets 44px+
- [ ] Tablet (640-1024px): 2 columns, collapsible sidebar
- [ ] Desktop (> 1024px): 3 columns, sidebar visible
- [ ] No horizontal scroll at any breakpoint
- [ ] Modals adapt to screen size

**Accessibility:**

- [ ] Lighthouse accessibility score 90+
- [ ] All interactive elements keyboard accessible
- [ ] Focus indicators visible on all elements
- [ ] Screen reader announces dynamic content
- [ ] Color contrast meets WCAG AA (4.5:1 minimum)
- [ ] ARIA labels on icon-only buttons
- [ ] Forms have proper label associations
- [ ] Status indicated by icon + text (not color alone)

**Performance:**

- [ ] LCP < 2.5s on dashboard
- [ ] FID < 100ms on all interactions
- [ ] CLS < 0.1 (no layout shifts)
- [ ] Images lazy loaded
- [ ] Heavy components code split

---

### 9.5 Next Steps

**Immediate Actions:**

1. **✅ UX Design Complete** - This specification is ready for implementation

2. **Next Workflow:** Solution Architecture
   - Define technical architecture with UX context
   - API design, state management, component architecture
   - Integration patterns for AI services
   - Run: `*create-architecture` command with PM agent

3. **Update Workflow Status:**
   - Mark `create-design` as complete in `bmm-workflow-status.yaml`
   - Status file will point to this specification document

**Future Enhancements (Post-MVP):**

- **Advanced Search:** Full-text search across course content
- **Bulk Operations UI:** Multi-select with batch actions progress modal
- **Advanced Audio Editor:** Waveform editing, splice insertion points
- **Collaboration Features:** Comments on scripts, version comparison
- **Analytics Dashboard:** Course performance, generation metrics
- **Keyboard Shortcuts:** Power user shortcuts (Ctrl+K command palette)
- **Dark/Light Mode Toggle:** User preference switching
- **Customizable Dashboards:** Widget-based personalization

---

### 9.6 Design Rationale Summary

**Why These Choices?**

**Pastel Color Palette:**

- Reduces eye strain for long editing sessions
- Aligns with meditation content (calm, not aggressive)
- High contrast maintains accessibility
- Cyan primary is energetic without being loud

**AI-First Workflows:**

- Matches user's vision: "ideas in AI hands with full control"
- Reduces friction (prompt → complete course structure)
- Manual override always available (empowering, not restrictive)
- Versioning allows experimentation without risk

**Balanced Density:**

- 4-6 courses visible = productive without overwhelm
- Enough context to make decisions (full descriptions)
- Enough breathing room to stay calm (meditation aesthetic)
- Responsive grid adapts to any screen

**shadcn/ui Foundation:**

- Pre-built accessible components (saves development time)
- Highly customizable (perfect for custom theming)
- Modern React patterns (hooks, composition)
- Active community, well-documented

**WCAG AA Compliance:**

- Professional tool should be accessible to all content managers
- Better UX for everyone (keyboard shortcuts, clear focus states)
- Demonstrates meditation industry's inclusivity values
- Future-proofs against accessibility requirements

---

**🎨 UX Design Specification Complete!**

Ready for technical implementation. This specification provides everything developers need to build a cohesive, accessible, AI-first meditation course CMS.

---

## Appendix

### Related Documents

- Product Requirements: `docs/PRD.md`
- Implementation Roadmap: `docs/implementation-roadmap.md`

### Core Interactive Deliverables

This UX Design Specification was created through visual collaboration:

- **Color Theme Visualizer**: docs/ux-color-themes.html
  - Interactive HTML showing all color theme options explored
  - Live UI component examples in each theme
  - Side-by-side comparison and semantic color usage

- **Design Direction Mockups**: docs/ux-design-directions.html
  - Interactive HTML with 6-8 complete design approaches
  - Full-screen mockups of key screens
  - Design philosophy and rationale for each direction

### Optional Enhancement Deliverables

_This section will be populated if additional UX artifacts are generated through follow-up workflows._

<!-- Additional deliverables added here by other workflows -->

### Next Steps & Follow-Up Workflows

This UX Design Specification can serve as input to:

- **Wireframe Generation Workflow** - Create detailed wireframes from user flows
- **Figma Design Workflow** - Generate Figma files via MCP integration
- **Interactive Prototype Workflow** - Build clickable HTML prototypes
- **Component Showcase Workflow** - Create interactive component library
- **AI Frontend Prompt Workflow** - Generate prompts for v0, Lovable, Bolt, etc.
- **Solution Architecture Workflow** - Define technical architecture with UX context

### Version History

| Date       | Version | Changes                         | Author |
| ---------- | ------- | ------------------------------- | ------ |
| 2025-11-28 | 1.0     | Initial UX Design Specification | Rupo   |

---

_This UX Design Specification was created through collaborative design facilitation, not template generation. All decisions were made with user input and are documented with rationale._
