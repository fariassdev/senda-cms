# senda-cms - Epic Breakdown

**Author:** farias
**Date:** 2025-12-11
**Project Level:** intermediate
**Target Scale:** MVP

---

## Overview

This document provides the complete epic and story breakdown for senda-cms, decomposing the requirements from the [PRD](./PRD.md) into implementable stories.

**Living Document Notice:** This is the initial version. It will be updated after UX Design and Architecture workflows add interaction and technical details to stories.

---

## Functional Requirements Inventory

### 2.1 Course Management

- **FR-2.1.1 Course Listing** (Priority: High)
  - Display courses in a grid/list view
  - Show course title, description, and status
  - Support filtering and searching
  - Enable sorting by different criteria
  - Show progress of course generation

- **FR-2.1.2 Course Creation** (Priority: High)
  - Intuitive form for course details
  - Support for course metadata (title, description)
  - Preview capabilities
  - Validation of required fields
  - Save as draft functionality

### 2.2 Lesson Management

- **FR-2.2.1 Lesson Organization** (Priority: High)
  - Display lessons within a course
  - Show lesson status and progress
  - Support reordering of lessons
  - Batch operations for multiple lessons

- **FR-2.2.2 Script Generation** (Priority: High)
  - One-click script generation
  - Progress tracking
  - Preview generated scripts
  - Edit capabilities post-generation
  - Version history

- **FR-2.2.3 Audio Generation** (Priority: High)
  - Automatic audio generation from scripts
  - Audio preview functionality
  - Download capabilities
  - Generation status tracking
  - Error handling and retry options

### 2.3 User Interface

- **FR-2.3.1 Navigation** (Priority: Medium)
  - Intuitive sidebar navigation
  - Breadcrumb navigation
  - Quick actions menu
  - Recent items access

- **FR-2.3.2 Feedback System** (Priority: Medium)
  - Toast notifications for actions
  - Loading states and progress indicators
  - Error messages with recovery options
  - Success confirmations

### 2.4 Authentication and Security

- **FR-2.4.1 User Authentication** (Priority: Critical)
  - Secure login form (email/password)
  - JWT-based authentication
  - Admin-only access control
  - Session management with auto logout
  - "Remember me" functionality
  - Failed login attempt tracking

- **FR-2.4.2 Session Management** (Priority: High)
  - Automatic session renewal
  - Secure token refresh
  - Clear session termination
  - Cross-tab synchronization

- **FR-2.4.3 Access Control** (Priority: High)
  - Role-based access control (Admin)
  - Protected routes
  - Automatic redirect for unauthenticated users
  - Graceful expired session handling

- **FR-2.4.4 Security Features** (Priority: High)
  - HTTPS enforcement
  - CSRF protection
  - Secure password hashing
  - Rate limiting
  - Input sanitization

---

## Epics Structure Plan

The project is divided into 5 strategic epics, designed to deliver incremental value from "Secure Access" to "Content Structure" to "AI Content Generation".

### Epic 1: Core Foundation & Authentication

- **Goal**: Establish the secure application shell and access control.
- **User Value**: A secure, accessible platform where admins can log in and navigate the interface.
- **PRD Coverage**: FR-2.3.1 (Navigation), FR-2.4.1 (Auth), FR-2.4.2 (Session), FR-2.4.3 (Access), FR-2.4.4 (Security).
- **Architecture**: Next.js App Router, Middleware protection, Zustand Auth Store, Shadcn/ui Layout.
- **UX**: Journey 1 (Authentication), Dashboard Shell, Pastel Theme Implementation.
- **Dependencies**: None.

### Epic 2: Course & Lesson Structure

- **Goal**: Implement the core content management capability.
- **User Value**: Users can define the structure of their courses and organize lessons efficiently.
- **PRD Coverage**: FR-2.1.1 (Listing), FR-2.1.2 (Creation), FR-2.2.1 (Organization).
- **Architecture**: Container/Component patterns for `CourseList` and `CourseDetail`. CRUD Hooks (`useCourse*`).
- **UX**: Journey 2 (Create Course), Journey 5 (Manage Lessons), Grid/List views, Drag-and-drop reordering.
- **Dependencies**: Epic 1.

### Epic 3: AI Script Generation Workflow

- **Goal**: Implement the text content generation engine.
- **User Value**: Users can transform outlines into full meditation scripts 10x faster.
- **PRD Coverage**: FR-2.2.2 (Script Gen), FR-2.3.2 (Feedback).
- **Architecture**: AI Polling strategy, Rich Text Editor integration, `useCourseActions` for generation.
- **UX**: Journey 3 (Generate Scripts), Progress feedback, Script Editor UI.
- **Dependencies**: Epic 2.

### Epic 4: AI Audio Production Workflow

- **Goal**: Implement the audio synthesis engine.
- **User Value**: Users can produce final publishable audio assets without a studio.
- **PRD Coverage**: FR-2.2.3 (Audio Gen).
- **Architecture**: TTS Integration, S3 file handling, HTML5 Audio Player.
- **UX**: Journey 4 (Generate Audio), Audio Configuration Modal, Waveforms/Preview.
- **Dependencies**: Epic 3.

### Epic 5: Polish & Bulk Operations

- **Goal**: Refine efficiency and system hardening.
- **User Value**: Efficient management of large-scale content and assured system reliability.
- **PRD Coverage**: FR-2.2.1 (Batch ops), FR-2.3.2 (Enhanced Feedback), FR-3.1 (Performance).
- **Architecture**: Optimization, Testing, Final Security Audits.
- **UX**: Batch actions UI, Filter refinements, Final visual polish.
- **Dependencies**: Epic 4.

---

## Technical Context Summary

This plan aligns with the architectural decisions documented in `architecture.md`:

1.  **Strict Container/Component Separation**: Epics 2, 3, and 4 effectively build out the `src/containers` hierarchy (`Main/CourseList`, `Main/CourseDetail`, `Main/ScriptEditor`).
2.  **API Patterns**: The "Action" hooks (`useCourseActions`) will be incrementally implemented across Epics 2 (CRUD), 3 (Script Gen), and 4 (Audio Gen).
3.  **State Management**: Epic 1 handles Client State (Zustand/Auth). Epics 2-5 build out the Server State (React Query) layer.
4.  **UX Patterns**: The "Pastel Meditation" theme and "Balanced" density will be applied from Epic 1 onwards.

---

## Epic 1: Core Foundation & Authentication

**Goal:** Establish the secure application shell and access control.

**User Value:** A secure, accessible platform where admins can log in and navigate the interface.

**PRD Coverage:** FR-2.3.1 (Navigation), FR-2.4.1 (Auth), FR-2.4.2 (Session), FR-2.4.3 (Access), FR-2.4.4 (Security)

---

### Story 1.1: Project Shell & Theme Configuration

As a **developer**,
I want **the application shell configured with the Pastel Meditation theme**,
So that **all subsequent features have a consistent visual foundation**.

**Acceptance Criteria:**

**Given** the Next.js 15 App Router project is initialized
**When** a user loads any page
**Then** the following should be in place:

- CSS variables match the Pastel Meditation theme (Architecture + UX Design 3.1)
  - `--background: #1a1d29`
  - `--surface: #24283b`
  - `--border: #343b58`
  - `--primary: #7dcfff`
  - `--text-primary: #e1e8ed`
  - `--text-secondary: #a9b1d6`
- Inter font family loaded via Google Fonts
- Base layout with `<html>` dark mode class
- Tailwind CSS 4 configured with custom theme tokens

**And** the following semantic colors are defined:

- Success: `#9ece6a`
- Warning: `#e0af68`
- Error: `#f7768e`
- Info: `#7aa2f7`

**Technical Notes:**

- Configure in `src/app/globals.css` (Architecture section: Styling)
- Use shadcn/ui theming conventions
- Typography scale per UX Design 3.1

**Prerequisites:** None

---

### Story 1.2: Application Layout with Collapsible Sidebar

As an **admin user**,
I want **a main application layout with collapsible sidebar navigation**,
So that **I can navigate between sections efficiently while maximizing content area**.

**Acceptance Criteria:**

**Given** I am on any authenticated page
**When** the page loads
**Then** I see:

- Left sidebar (240px width) with navigation items
- Main content area (fluid width, max 1440px)
- Header with breadcrumbs and user menu

**And** the sidebar contains:

- Senda logo at top
- Navigation items: Dashboard, Courses
- Active route highlighted with primary color (`#7dcfff`) + left border
- Collapse/expand toggle button

**When** I click the collapse toggle
**Then** the sidebar animates to icon-only mode (64px width)
**And** tooltips appear on hover for navigation items

**When** viewport is below 1024px
**Then** sidebar is hidden by default
**And** hamburger menu appears in header to toggle sidebar

**Technical Notes:**

- Use `src/components/Navigation/` structure (Architecture: Component Boundaries)
- Implement with shadcn/ui Sidebar component
- Store collapse state in localStorage for persistence
- UX Design 4.2: Navigation Behavior

**Prerequisites:** Story 1.1

---

### Story 1.3: Login Page UI

As an **admin user**,
I want **a secure, visually calming login page**,
So that **I can authenticate to access the CMS**.

**Acceptance Criteria:**

**Given** I navigate to `/login`
**When** the page loads
**Then** I see:

- Centered login form card on dark background
- Senda logo above the form
- Email/username input field with label
- Password input field with label and show/hide toggle
- "Remember me" checkbox
- Primary "Sign In" button (cyan, full width)
- Calm, meditation-appropriate aesthetic

**And** the form has:

- Required field indicators (asterisk)
- Placeholder text in inputs
- Focus states with cyan border glow

**When** I submit with empty fields
**Then** inline validation errors appear below each field
**And** input borders turn red (`#f7768e`)

**Technical Notes:**

- Create at `src/containers/Guest/SignIn/` (Architecture: Feature Mapping)
- Use React Hook Form with Zod validation (Architecture: State Management)
- Form components from shadcn/ui
- UX Design 5.1: Journey 1 Authentication Flow

**Prerequisites:** Story 1.1

---

### Story 1.4: Authentication API Integration

As an **admin user**,
I want **my credentials validated against the backend API**,
So that **only authorized users can access the CMS**.

**Acceptance Criteria:**

**Given** I am on the login page with valid credentials
**When** I submit the login form
**Then** POST `/api/auth/login` is called with email and password
**And** the button shows loading spinner with "Signing in..."
**And** on success:

- JWT access token is received
- Token stored in localStorage
- Redirect to `/courses` dashboard
- Success toast: "Welcome back!"

**When** I submit with invalid credentials
**Then** error response is received
**And** toast error: "Invalid email or password"
**And** form remains on login page
**And** failed attempt is tracked (FR-2.4.1)

**When** I submit with "Remember me" checked
**Then** token persistence is extended (30 days vs 24 hours)

**Technical Notes:**

- Use `openapi-fetch` client (Architecture: API Pattern)
- Store token in Zustand `authStore` (Architecture: State Management)
- Implement rate limiting display for lockout (3 failed attempts = 15 min lockout)
- Error handling per Architecture: Process Patterns

**Prerequisites:** Story 1.3

---

### Story 1.5: Auth State Management with Zustand

As an **admin user**,
I want **my authentication state persisted and synchronized**,
So that **I remain logged in across page refreshes and tabs**.

**Acceptance Criteria:**

**Given** I have successfully logged in
**When** I refresh the page
**Then** my auth state is restored from localStorage
**And** I remain on the authenticated page

**Given** I have multiple browser tabs open
**When** I log out in one tab
**Then** all other tabs detect the logout
**And** redirect to `/login` with "Session ended" message

**Given** my session is active
**When** I navigate between pages
**Then** my auth context is available throughout the app
**And** API requests include the Authorization header

**Technical Notes:**

- Implement at `src/stores/authStore.ts` (Architecture: Client State)
- Use Zustand persist middleware with localStorage
- Subscribe to storage events for cross-tab sync (FR-2.4.2)
- Expose: `user`, `token`, `isAuthenticated`, `login()`, `logout()`

**Prerequisites:** Story 1.4

---

### Story 1.6: Route Protection Middleware

As an **admin user**,
I want **protected routes to require authentication**,
So that **unauthenticated users cannot access sensitive content**.

**Acceptance Criteria:**

**Given** I am not authenticated
**When** I try to access `/courses` (or any protected route)
**Then** I am redirected to `/login`
**And** the original URL is preserved for post-login redirect

**Given** I am authenticated
**When** I try to access `/login`
**Then** I am redirected to `/courses` (already logged in)

**Given** my token expires while on a protected page
**When** an API request fails with 401
**Then** I see a toast: "Session expired. Please log in again."
**And** I am redirected to `/login`

**Technical Notes:**

- Implement in `src/middleware.ts` (Architecture: Cross-Cutting Concerns)
- Protected routes: `/courses/*`, `/settings/*`
- Public routes: `/login`
- Check token validity on each request
- FR-2.4.3: Access Control

**Prerequisites:** Story 1.5

---

### Story 1.7: API Client with Auth Interceptor

As a **developer**,
I want **all API requests to automatically include authentication headers**,
So that **I don't need to manually add auth to each request**.

**Acceptance Criteria:**

**Given** the user is authenticated
**When** any API request is made via `openapi-fetch`
**Then** the `Authorization: Bearer <token>` header is automatically included

**Given** an API response returns 401 Unauthorized
**When** the interceptor catches this error
**Then** the auth store is cleared
**And** user is redirected to login
**And** error toast is shown

**Given** an API response returns 5xx Server Error
**When** the interceptor catches this error
**Then** error toast: "Server error. Please try again."
**And** automatic retry with exponential backoff (3 attempts)

**Technical Notes:**

- Configure in `src/lib/api.ts` (Architecture: API Client)
- Use openapi-fetch middleware for interceptors
- Global error handling per Architecture: Process Patterns
- FR-2.4.4: Security Features (HTTPS, headers)

**Prerequisites:** Story 1.5

---

### Story 1.8: Session Renewal & Auto-Logout

As an **admin user**,
I want **my session to auto-renew while active and auto-logout when idle**,
So that **I have a seamless experience with appropriate security**.

**Acceptance Criteria:**

**Given** I am actively using the application
**When** my token is within 5 minutes of expiring
**Then** the system silently refreshes the token in the background
**And** my session continues uninterrupted

**Given** I am idle for 30 minutes (no mouse/keyboard activity)
**When** the idle timeout is reached
**Then** a modal appears: "Session about to expire. Continue?"
**And** if no response in 60 seconds, auto-logout occurs
**And** redirect to login with "Logged out due to inactivity"

**Given** I click "Continue" on the idle warning
**Then** the session is renewed
**And** the timer resets

**Technical Notes:**

- Token refresh via POST `/api/auth/refresh`
- Idle detection using `react-idle-timer` or native events
- FR-2.4.2: Session Management + Auto-renewal
- Store last activity timestamp

**Prerequisites:** Story 1.7

---

### Story 1.9: Logout Functionality

As an **admin user**,
I want **to securely log out of the application**,
So that **my session is terminated and credentials cleared**.

**Acceptance Criteria:**

**Given** I am authenticated
**When** I click the user menu in the header
**Then** I see a dropdown with "Log Out" option

**When** I click "Log Out"
**Then** my local token is cleared
**And** Zustand auth store is reset
**And** POST `/api/auth/logout` is called (optional invalidation)
**And** I am redirected to `/login`
**And** toast: "You have been logged out"

**And** if I use the browser back button
**Then** I cannot access protected routes
**And** I am redirected to login

**Technical Notes:**

- User menu in header component
- Clear localStorage and Zustand state
- FR-2.4.2: Clear session termination
- Prevent back-button access via route guards

**Prerequisites:** Story 1.2, Story 1.5

---

### Story 1.10: Toast Notification System

As an **admin user**,
I want **consistent toast notifications for all actions**,
So that **I receive clear feedback on success, errors, and system status**.

**Acceptance Criteria:**

**Given** any action completes successfully
**When** the success handler fires
**Then** a green toast appears (top-right position)
**And** auto-dismisses after 4 seconds
**And** includes success icon (✓)

**Given** any action fails with an error
**When** the error handler fires
**Then** a red toast appears (top-right position)
**And** auto-dismisses after 6 seconds (longer for reading)
**And** includes error icon (✕)
**And** shows actionable message

**Given** any toast is visible
**When** I click on it
**Then** it dismisses immediately

**Technical Notes:**

- Use shadcn/ui Sonner component (already installed)
- Position: top-right
- Configure in root layout
- UX Design 7.1: Feedback & Notifications
- FR-2.3.2: Feedback System

**Prerequisites:** Story 1.1

---

**Epic 1 Summary:**

| Story | Title                                       | PRD Coverage       |
| ----- | ------------------------------------------- | ------------------ |
| 1.1   | Project Shell & Theme Configuration         | FR-2.3.1           |
| 1.2   | Application Layout with Collapsible Sidebar | FR-2.3.1           |
| 1.3   | Login Page UI                               | FR-2.4.1           |
| 1.4   | Authentication API Integration              | FR-2.4.1, FR-2.4.4 |
| 1.5   | Auth State Management with Zustand          | FR-2.4.2           |
| 1.6   | Route Protection Middleware                 | FR-2.4.3           |
| 1.7   | API Client with Auth Interceptor            | FR-2.4.4           |
| 1.8   | Session Renewal & Auto-Logout               | FR-2.4.2           |
| 1.9   | Logout Functionality                        | FR-2.4.2           |
| 1.10  | Toast Notification System                   | FR-2.3.2           |

---

## Epic 2: Course & Lesson Structure

**Goal:** Implement the core content management capability.

**User Value:** Users can define the structure of their courses and organize lessons efficiently.

**PRD Coverage:** FR-2.1.1 (Listing), FR-2.1.2 (Creation), FR-2.2.1 (Organization)

---

### Story 2.1: Course Listing Page

As an **admin user**,
I want **to see all my courses in a dashboard view**,
So that **I can quickly find and manage my content**.

**Acceptance Criteria:**

**Given** I am authenticated and navigate to `/courses`
**When** the page loads
**Then** I see:

- Page header: "Courses" with "Create Course" primary button
- Search bar (placeholder: "Search courses...")
- Filter dropdowns: Status (All, Draft, Published, In Progress)
- Sort dropdown (Date Created, Title, Status)
- View toggle: Grid / List icons
- Course cards in responsive grid (3 → 2 → 1 columns)

**And** each CourseCard displays:

- Course title (h4, truncated if long)
- Description (2 lines max, ellipsis)
- Progress bar with percentage (lessons completed / total)
- Status badge (Published/Draft/In Progress)
- Last updated timestamp
- Overflow menu (⋮) with Edit, Delete options

**When** there are no courses
**Then** I see empty state:

- Centered illustration
- "No courses yet"
- "Create your first course" CTA button

**Technical Notes:**

- Container: `src/containers/Main/CourseList/` (Architecture: Project Structure)
- Use `useCourses()` hook for data (Architecture: API Hooks)
- Grid: CSS Grid `repeat(auto-fill, minmax(350px, 1fr))`
- UX Design 4.2: Direction 1 Balanced & Clear

**Prerequisites:** Epic 1 complete

---

### Story 2.2: Course Card Component

As an **admin user**,
I want **course cards with visual hierarchy and quick actions**,
So that **I can assess course status at a glance and take action**.

**Acceptance Criteria:**

**Given** I am viewing the course list
**When** I see a course card
**Then** it displays with:

- Dark surface background (`#24283b`)
- 16px padding, 8px border-radius
- Border: `1px solid #343b58`

**When** I hover over the card
**Then** it lifts (4px translateY)
**And** border glows with primary color (`#7dcfff`)
**And** transition is smooth (0.2s ease)

**When** I click the card body
**Then** I navigate to `/courses/[slug]` detail page

**When** I click the overflow menu (⋮)
**Then** dropdown appears with:

- "Edit" → navigates to edit mode
- "Delete" → opens confirmation dialog

**Technical Notes:**

- Custom component: `CourseCard` (UX Design 6.1)
- Use shadcn/ui Card as base
- Hover states per UX Design 7.1

**Prerequisites:** Story 2.1

---

### Story 2.3: Course Search & Filtering

As an **admin user**,
I want **to search and filter courses**,
So that **I can find specific courses quickly**.

**Acceptance Criteria:**

**Given** I am on the courses page with multiple courses
**When** I type in the search bar
**Then** courses are filtered in real-time (300ms debounce)
**And** matching is case-insensitive on title and description

**When** I select a status filter (e.g., "Draft")
**Then** only courses with that status are shown
**And** the filter chip appears showing active filter
**And** "Clear filters" link appears

**When** I change sort order
**Then** courses reorder immediately
**And** sort preference persists in URL params

**When** no courses match filters
**Then** I see "No courses match your filters" with clear filters button

**Technical Notes:**

- Use URL search params for filter state (shareable URLs)
- Client-side filtering for MVP (server-side for scale)
- Debounce search with `useDeferredValue` or lodash

**Prerequisites:** Story 2.1

---

### Story 2.4: Create Course Form

As an **admin user**,
I want **to create a new course with essential details**,
So that **I can start building content structure**.

**Acceptance Criteria:**

**Given** I click "Create Course" button
**When** the form opens (modal or page)
**Then** I see:

- Title field (required, max 100 chars)
- Description textarea (optional, max 500 chars)
- Cover image upload (optional, drag-and-drop)
- Save as Draft / Publish buttons

**And** validation:

- Title required, min 3 characters
- Real-time character count
- Image: max 5MB, jpg/png formats

**When** I submit a valid form
**Then** POST `/api/courses` is called
**And** loading state shows on button
**And** on success: redirect to new course detail page
**And** toast: "Course created successfully!"

**When** I click "Save as Draft"
**Then** course is saved with status: DRAFT

**When** I click outside modal or press Escape
**Then** confirmation if form has unsaved changes

**Technical Notes:**

- Use React Hook Form + Zod schema
- `useCourseActions().create()` mutation (Architecture: API Hooks)
- Optimistic UI update on success
- FR-2.1.2: Course Creation

**Prerequisites:** Story 2.1

---

### Story 2.5: Course Detail Page

As an **admin user**,
I want **a dedicated page for each course with all details**,
So that **I can manage its content and lessons**.

**Acceptance Criteria:**

**Given** I navigate to `/courses/[slug]`
**When** the page loads
**Then** I see:

- Breadcrumb: Courses > [Course Title]
- Course header with title, status badge, edit button
- Description (expandable if long)
- Cover image (if set)
- Statistics: Total lessons, Completed scripts, Completed audio
- Lessons section (see Story 2.6)

**When** course is loading
**Then** skeleton UI is shown for each section

**When** course not found
**Then** 404 page with "Course not found" and link back to courses

**Technical Notes:**

- Container: `src/containers/Main/CourseDetail/`
- Use `useCourse(slug)` hook
- Dynamic route: `app/courses/[slug]/page.tsx`

**Prerequisites:** Story 2.4

---

### Story 2.6: Lesson List Display

As an **admin user**,
I want **to see all lessons within a course**,
So that **I can manage the course content structure**.

**Acceptance Criteria:**

**Given** I am on a course detail page
**When** the page loads
**Then** I see the lesson list with:

- Section header: "Lessons" with lesson count
- "Add Lesson" button
- List of LessonListItem components

**And** each lesson item shows:

- Drag handle (⋮⋮ icon, left side)
- Lesson number (order)
- Lesson title
- Status badge (PENDING, SCRIPT_GENERATING, SCRIPT_COMPLETED, AUDIO_GENERATING, AUDIO_COMPLETED)
- Duration (if set)
- Actions: Generate Script, View, Edit, Delete icons

**When** there are no lessons
**Then** I see empty state with "Add your first lesson" CTA

**Technical Notes:**

- Component: `src/containers/Main/CourseDetail/LessonList/`
- Use `useLessons(courseSlug)` hook
- Status colors per UX Design 6.1: StatusBadge
- FR-2.2.1: Lesson Organization

**Prerequisites:** Story 2.5

---

### Story 2.7: Create New Lesson

As an **admin user**,
I want **to add new lessons to a course**,
So that **I can build out the course content**.

**Acceptance Criteria:**

**Given** I am on a course detail page
**When** I click "Add Lesson" button
**Then** a modal opens with:

- Title field (required)
- Description textarea (optional)
- Duration input (minutes, optional)
- Key themes/keywords (comma-separated tags)
- "Create Lesson" primary button

**When** I submit valid data
**Then** POST `/api/courses/[slug]/lessons` is called
**And** new lesson appears at end of list
**And** modal closes
**And** toast: "Lesson added"

**When** I create lesson with title only
**Then** defaults are applied (no duration, no themes)
**And** lesson status is PENDING

**Technical Notes:**

- Use `useLessonActions().create()` mutation
- Invalidate lessons query on success
- New lesson `order` = max(existing orders) + 1

**Prerequisites:** Story 2.6

---

### Story 2.8: Edit Lesson Details

As an **admin user**,
I want **to edit existing lesson details**,
So that **I can refine course content**.

**Acceptance Criteria:**

**Given** I am on the lesson list
**When** I click the Edit icon on a lesson
**Then** a modal opens pre-filled with:

- Current title
- Current description
- Current duration
- Current key themes

**When** I modify fields and submit
**Then** PATCH `/api/courses/[slug]/lessons/[id]` is called
**And** lesson updates in list (optimistic update)
**And** modal closes
**And** toast: "Lesson updated"

**When** I edit without changes and submit
**Then** no API call is made
**And** modal closes silently

**Technical Notes:**

- Reuse lesson form component from Story 2.7
- `useLessonActions().update()` mutation
- Optimistic updates with React Query

**Prerequisites:** Story 2.7

---

### Story 2.9: Delete Lesson

As an **admin user**,
I want **to delete lessons from a course**,
So that **I can remove unwanted content**.

**Acceptance Criteria:**

**Given** I click the Delete icon on a lesson
**When** the confirmation dialog opens
**Then** I see:

- "Delete Lesson?" title
- "This will permanently delete '[Lesson Title]' and its script/audio."
- Cancel (secondary) and Delete (destructive red) buttons

**When** I click Delete
**Then** DELETE `/api/courses/[slug]/lessons/[id]` is called
**And** lesson is removed from list (optimistic)
**And** remaining lessons reorder
**And** toast: "Lesson deleted"

**When** I click Cancel
**Then** dialog closes, no action taken

**Technical Notes:**

- Use shadcn/ui AlertDialog
- `useLessonActions().delete()` mutation
- Cascade delete: script and audio also removed

**Prerequisites:** Story 2.8

---

### Story 2.10: Drag-and-Drop Lesson Reordering

As an **admin user**,
I want **to reorder lessons by dragging**,
So that **I can organize the course flow**.

**Acceptance Criteria:**

**Given** I am viewing the lesson list with multiple lessons
**When** I click and drag the drag handle (⋮⋮)
**Then** the lesson becomes draggable
**And** a ghost placeholder shows the drop target
**And** other lessons shift to make room

**When** I drop the lesson in a new position
**Then** PATCH `/api/courses/[slug]/lessons/reorder` is called
**And** new order is saved immediately
**And** UI reflects new order
**And** toast: "Lesson order saved"

**When** I release without moving
**Then** no API call is made

**Technical Notes:**

- Use `@dnd-kit/core` for drag-and-drop
- Optimistic update with rollback on error
- Send array of { id, order } pairs to API
- FR-2.2.1: Support reordering of lessons

**Prerequisites:** Story 2.6

---

### Story 2.11: Edit Course Details

As an **admin user**,
I want **to edit course title, description, and cover image**,
So that **I can update course information**.

**Acceptance Criteria:**

**Given** I am on the course detail page
**When** I click the "Edit" button in the header
**Then** the course form modal opens pre-filled with:

- Current title
- Current description
- Current cover image preview

**When** I modify and submit
**Then** PATCH `/api/courses/[slug]` is called
**And** course detail updates
**And** breadcrumb updates if title changed
**And** toast: "Course updated"

**Technical Notes:**

- Reuse course form from Story 2.4
- `useCourseActions().update()` mutation

**Prerequisites:** Story 2.5

---

### Story 2.12: Delete Course

As an **admin user**,
I want **to delete an entire course**,
So that **I can remove outdated content**.

**Acceptance Criteria:**

**Given** I am on the course detail page or course card menu
**When** I click "Delete" option
**Then** confirmation dialog shows:

- "Delete Course?" title
- "This will permanently delete '[Course Title]' and all its lessons, scripts, and audio files."
- Type course name to confirm
- Cancel and Delete buttons

**When** I type the correct course name and click Delete
**Then** DELETE `/api/courses/[slug]` is called
**And** redirect to `/courses` list
**And** toast: "Course deleted"

**When** I type incorrect name
**Then** Delete button remains disabled

**Technical Notes:**

- Destructive action requires name confirmation
- `useCourseActions().delete()` mutation
- Cascade delete all related content

**Prerequisites:** Story 2.11

---

**Epic 2 Summary:**

| Story | Title                           | PRD Coverage       |
| ----- | ------------------------------- | ------------------ |
| 2.1   | Course Listing Page             | FR-2.1.1           |
| 2.2   | Course Card Component           | FR-2.1.1           |
| 2.3   | Course Search & Filtering       | FR-2.1.1           |
| 2.4   | Create Course Form              | FR-2.1.2           |
| 2.5   | Course Detail Page              | FR-2.1.1, FR-2.1.2 |
| 2.6   | Lesson List Display             | FR-2.2.1           |
| 2.7   | Create New Lesson               | FR-2.2.1           |
| 2.8   | Edit Lesson Details             | FR-2.2.1           |
| 2.9   | Delete Lesson                   | FR-2.2.1           |
| 2.10  | Drag-and-Drop Lesson Reordering | FR-2.2.1           |
| 2.11  | Edit Course Details             | FR-2.1.2           |
| 2.12  | Delete Course                   | FR-2.1.2           |

---

## Epic 3: AI Script Generation Workflow

**Goal:** Implement the text content generation engine.

**User Value:** Users can transform lesson outlines into full meditation scripts 10x faster.

**PRD Coverage:** FR-2.2.2 (Script Generation), FR-2.3.2 (Feedback System)

---

### Story 3.1: Generate Script Button & Status

As an **admin user**,
I want **a clear call-to-action to generate scripts**,
So that **I can initiate AI content creation for any lesson**.

**Acceptance Criteria:**

**Given** I am viewing a lesson with status PENDING
**When** I see the lesson row
**Then** a "Generate Script" button is visible (wand icon + text)
**And** the button is primary style (cyan)

**When** I click "Generate Script"
**Then** the generation process starts
**And** lesson status changes to SCRIPT_GENERATING
**And** button transforms to progress indicator
**And** I can navigate away (generation continues in background)

**Given** a lesson has status SCRIPT_COMPLETED
**When** I view the lesson row
**Then** the button shows "Regenerate" option
**And** status badge shows green "Script Ready"

**Technical Notes:**

- Use `useCourseActions().generateScript(lessonId)` mutation
- Polling for status updates (5s interval)
- FR-2.2.2: One-click script generation

**Prerequisites:** Story 2.6

---

### Story 3.2: Script Generation Configuration Modal

As an **admin user**,
I want **to configure generation parameters before starting**,
So that **I can guide the AI output to my needs**.

**Acceptance Criteria:**

**Given** I click "Generate Script" on a lesson
**When** the configuration modal opens
**Then** I see:

- Lesson title (read-only reference)
- Tone selection dropdown: Calming (default), Energizing, Neutral, Guided Visualization
- Duration target slider: 5-30 minutes (pre-filled from lesson)
- Key themes input (comma-separated, pre-filled if exists)
- Custom instructions textarea (optional, max 500 chars)
- "✨ Generate Script" primary button

**When** I submit the configuration
**Then** POST `/api/courses/[slug]/lessons/[id]/generate-script` is called with parameters
**And** modal closes
**And** lesson enters SCRIPT_GENERATING status

**When** I click Cancel or outside modal
**Then** modal closes, no generation started

**Technical Notes:**

- Store last-used configuration in localStorage for defaults
- Tone maps to AI prompt system instructions
- UX Design 5.1: Journey 3 Script Generation

**Prerequisites:** Story 3.1

---

### Story 3.3: Script Generation Progress Tracking

As an **admin user**,
I want **real-time feedback during script generation**,
So that **I know the system is working and can estimate completion**.

**Acceptance Criteria:**

**Given** a lesson is in SCRIPT_GENERATING status
**When** I view the lesson list
**Then** I see:

- Animated progress bar on the lesson row
- Progress percentage (if available from API)
- "Generating script..." status text
- Spinning indicator icon

**And** the progress updates via polling:

- Poll GET `/api/courses/[slug]/lessons/[id]` every 5 seconds
- Update progress bar based on response

**When** generation completes
**Then** status changes to SCRIPT_COMPLETED
**And** progress bar fills to 100% briefly
**And** toast: "Script generated for '[Lesson Title]'"
**And** progress indicator transitions to success state

**When** generation fails
**Then** status changes to SCRIPT_FAILED
**And** error badge appears
**And** toast error: "Script generation failed. Click to retry."

**Technical Notes:**

- Use React Query `refetchInterval` when status is GENERATING
- Stop polling when status is COMPLETED or FAILED
- FR-2.2.2: Progress tracking

**Prerequisites:** Story 3.2

---

### Story 3.4: View Generated Script

As an **admin user**,
I want **to view the AI-generated script**,
So that **I can review the content before proceeding**.

**Acceptance Criteria:**

**Given** a lesson has status SCRIPT_COMPLETED
**When** I click "View Script" action on the lesson
**Then** I navigate to `/courses/[slug]/lessons/[id]/script`
**Or** a side panel opens with script content

**And** I see:

- Lesson title as header
- Generated script content with formatting
- Meditation cues highlighted: [PAUSE 3s], [BREATHE], etc.
- Word count and estimated read time
- Character count
- Generation metadata (timestamp, parameters used)

**When** script is loading
**Then** skeleton UI shows for content area

**Technical Notes:**

- Container: `src/containers/Main/ScriptEditor/`
- Use `useLesson(id)` hook to fetch script content
- Preserve whitespace and line breaks from API

**Prerequisites:** Story 3.3

---

### Story 3.5: Script Editor with Rich Controls

As an **admin user**,
I want **to edit the generated script with meditation-specific tools**,
So that **I can refine the content to my exact needs**.

**Acceptance Criteria:**

**Given** I am viewing a script
**When** the editor loads
**Then** I see:

- Large textarea/editor with the script content
- Toolbar above with meditation controls
- Word count updating in real-time
- Save button (explicit save, not autosave)
- "Saved" indicator when content matches server

**And** the toolbar contains:

- Pause insertion buttons: [PAUSE 3s], [PAUSE 5s], [PAUSE 10s], [PAUSE 30s], [PAUSE 50s]
- [BREATHE] cue button
- Undo/Redo buttons
- Format options (if rich text)

**When** I click a pause button
**Then** the pause marker is inserted at cursor position
**And** cursor moves after the inserted text

**When** I modify the script
**Then** the "Save" button becomes active
**And** word count updates
**And** "Unsaved changes" indicator appears

**Technical Notes:**

- Use native textarea for MVP (Architecture: Rich Text Editor)
- Script formatting: cues in square brackets
- UX Design 6.1: ScriptEditor component
- FR-2.2.2: Edit capabilities post-generation

**Prerequisites:** Story 3.4

---

### Story 3.6: Save Script Changes

As an **admin user**,
I want **to save my script edits explicitly**,
So that **I have control over when changes are persisted**.

**Acceptance Criteria:**

**Given** I have made changes to the script
**When** I click the "Save" button
**Then** PATCH `/api/courses/[slug]/lessons/[id]` is called with script content
**And** button shows loading state
**And** on success: toast "Script saved"
**And** "Unsaved changes" indicator disappears

**Given** I have unsaved changes
**When** I try to navigate away
**Then** browser confirmation dialog appears: "You have unsaved changes. Are you sure?"

**When** I click "Save" with no changes
**Then** button does nothing (disabled state)

**Technical Notes:**

- Track dirty state with form state comparison
- Debounce is NOT used (explicit save only)
- Use `beforeunload` event for navigation warning

**Prerequisites:** Story 3.5

---

### Story 3.7: Regenerate Script

As an **admin user**,
I want **to regenerate a script with different parameters**,
So that **I can get alternative versions if the first isn't right**.

**Acceptance Criteria:**

**Given** a lesson has an existing script (SCRIPT_COMPLETED)
**When** I click "Regenerate" in the editor or lesson row
**Then** the configuration modal opens (same as Story 3.2)
**And** previous parameters are pre-filled

**When** I confirm regeneration
**Then** warning appears: "This will replace the current script. Continue?"
**And** if confirmed: new generation starts
**And** old script is saved to version history
**And** lesson status returns to SCRIPT_GENERATING

**When** regeneration completes
**Then** new script replaces old content
**And** version history shows both versions

**Technical Notes:**

- Version history stored in API
- Include warning before overwriting
- FR-2.2.2: Regenerate sections or entire script

**Prerequisites:** Story 3.6

---

### Story 3.8: Script Version History

As an **admin user**,
I want **to view and restore previous script versions**,
So that **I can recover from unwanted changes**.

**Acceptance Criteria:**

**Given** I am in the script editor
**When** I click "Version History" button
**Then** a sidebar or modal opens showing:

- List of versions with timestamps
- "AI Generated" or "Manual Edit" labels
- Version preview on hover/click
- "Restore" button for each version

**When** I click "Restore" on a version
**Then** confirmation: "Restore this version? Your current script will be saved as a new version."
**And** if confirmed: that version becomes current content
**And** a new version is created from the previous current

**Technical Notes:**

- GET `/api/courses/[slug]/lessons/[id]/versions`
- POST `/api/courses/[slug]/lessons/[id]/versions/restore`
- FR-2.2.2: Version history

**Prerequisites:** Story 3.7

---

### Story 3.9: Batch Script Generation

As an **admin user**,
I want **to generate scripts for multiple lessons at once**,
So that **I can efficiently create content for an entire course**.

**Acceptance Criteria:**

**Given** I am on the course detail page
**When** I select multiple lessons using checkboxes
**Then** a bulk actions toolbar appears

**When** I click "Generate Scripts" in the bulk toolbar
**Then** configuration modal opens with:

- "Generate scripts for X lessons" header
- Shared tone setting (applies to all)
- "Generate All" button

**When** I confirm bulk generation
**Then** all selected lessons enter SCRIPT_GENERATING status
**And** each generates independently
**And** toast: "Generating scripts for X lessons..."
**And** I can track progress on each lesson row

**When** any lesson fails
**Then** only that lesson shows error
**And** others continue independently

**Technical Notes:**

- POST `/api/courses/[slug]/generate-scripts` with lesson IDs array
- Parallel generation with individual status tracking
- FR-2.2.1: Batch operations for multiple lessons

**Prerequisites:** Story 3.3

---

### Story 3.10: Script Preview in Lesson List

As an **admin user**,
I want **to quickly preview script content without leaving the list**,
So that **I can assess content without full navigation**.

**Acceptance Criteria:**

**Given** a lesson has status SCRIPT_COMPLETED
**When** I hover over the lesson row or click an expand icon
**Then** a preview panel expands below showing:

- First 200 characters of script
- "View Full Script" link
- Quick actions: Edit, Regenerate

**When** I click outside the preview
**Then** it collapses

**Technical Notes:**

- Use Collapsible or Accordion from shadcn/ui
- Lazy load script content on expand
- FR-2.2.2: Preview generated scripts

**Prerequisites:** Story 3.4

---

**Epic 3 Summary:**

| Story | Title                                 | PRD Coverage       |
| ----- | ------------------------------------- | ------------------ |
| 3.1   | Generate Script Button & Status       | FR-2.2.2           |
| 3.2   | Script Generation Configuration Modal | FR-2.2.2           |
| 3.3   | Script Generation Progress Tracking   | FR-2.2.2, FR-2.3.2 |
| 3.4   | View Generated Script                 | FR-2.2.2           |
| 3.5   | Script Editor with Rich Controls      | FR-2.2.2           |
| 3.6   | Save Script Changes                   | FR-2.2.2           |
| 3.7   | Regenerate Script                     | FR-2.2.2           |
| 3.8   | Script Version History                | FR-2.2.2           |
| 3.9   | Batch Script Generation               | FR-2.2.2, FR-2.2.1 |
| 3.10  | Script Preview in Lesson List         | FR-2.2.2           |

---

## Epic 4: AI Audio Production Workflow

**Goal:** Implement the audio synthesis engine.

**User Value:** Users can produce final publishable audio assets without a studio.

**PRD Coverage:** FR-2.2.3 (Audio Generation)

---

### Story 4.1: Generate Audio Button & Status

As an **admin user**,
I want **a clear action to generate audio from completed scripts**,
So that **I can create the final audio content**.

**Acceptance Criteria:**

**Given** a lesson has status SCRIPT_COMPLETED
**When** I view the lesson row
**Then** a "Generate Audio" button is visible (speaker icon)
**And** button is enabled only when script exists

**When** I click "Generate Audio"
**Then** audio configuration modal opens (Story 4.2)

**Given** a lesson has status AUDIO_COMPLETED
**When** I view the lesson row
**Then** status badge shows "Audio Ready" (green)
**And** play button appears for quick preview
**And** "Regenerate Audio" option available

**Given** a lesson is AUDIO_GENERATING
**When** I view the lesson row
**Then** progress indicator shows with percentage
**And** "Generating audio..." text

**Technical Notes:**

- Use `useLessonActions().generateAudio(lessonId, config)` mutation
- Disable button if script not completed
- FR-2.2.3: Automatic audio generation from scripts

**Prerequisites:** Story 3.4

---

### Story 4.2: Audio Configuration Modal

As an **admin user**,
I want **to configure TTS settings before generating audio**,
So that **I can customize the voice and production quality**.

**Acceptance Criteria:**

**Given** I click "Generate Audio" on a lesson
**When** the modal opens
**Then** I see:

- Lesson title (read-only)
- Voice selection dropdown with samples: Aria-Calm, Leo-Deep, Maya-Soothing, etc.
- Background music dropdown: Peaceful Garden, Ocean Waves, Silence, Forest Rain
- Speech rate slider: 0.8x - 1.2x (default 1.0)
- Pitch adjustment slider: -10% to +10% (default 0)
- Volume slider: 50% - 100% (default 80%)
- Preview button (plays 10-second sample)
- "✨ Generate Audio" primary button

**When** I click Preview
**Then** a 10-second clip generates with current settings
**And** plays immediately in modal
**And** loading indicator during generation

**When** I submit the configuration
**Then** POST `/api/courses/[slug]/lessons/[id]/generate-audio` is called
**And** modal closes
**And** lesson status becomes AUDIO_GENERATING

**Technical Notes:**

- Voice options come from Kokoro TTS (Architecture: External Services)
- Store last-used settings as defaults
- UX Design 5.1: Journey 4 Audio Configuration

**Prerequisites:** Story 4.1

---

### Story 4.3: Audio Generation Progress

As an **admin user**,
I want **real-time progress during audio generation**,
So that **I can track completion and estimate wait time**.

**Acceptance Criteria:**

**Given** a lesson is in AUDIO_GENERATING status
**When** I view the lesson list
**Then** I see:

- Progress bar with percentage
- Estimated time remaining (if available)
- "Generating audio..." text with spinning icon

**And** progress updates via polling (10s interval for audio)

**When** generation completes
**Then** status changes to AUDIO_COMPLETED
**And** toast: "Audio ready for '[Lesson Title]'"
**And** play button becomes active

**When** generation fails
**Then** status shows AUDIO_FAILED
**And** error badge appears
**And** toast error with retry option

**Technical Notes:**

- Audio generation typically longer than script (30s-2min)
- Use React Query polling with longer interval
- FR-2.2.3: Generation status tracking

**Prerequisites:** Story 4.2

---

### Story 4.4: Audio Player & Preview

As an **admin user**,
I want **to listen to generated audio with player controls**,
So that **I can review the final output**.

**Acceptance Criteria:**

**Given** a lesson has AUDIO_COMPLETED status
**When** I click the play button or navigate to audio view
**Then** I see an audio player with:

- Play/Pause button (large, centered)
- Progress timeline with scrubbing
- Current time / Total duration display
- Volume slider
- Download button (MP3)
- Playback speed selector (0.75x, 1x, 1.25x, 1.5x)

**When** I click Play
**Then** audio streams from S3 URL
**And** timeline updates in real-time
**And** pause button replaces play

**When** I click on timeline
**Then** playback jumps to that position

**When** audio ends
**Then** player resets to beginning
**And** play button reappears

**Technical Notes:**

- Use native HTML5 Audio element (Architecture: Audio Player)
- S3 presigned URLs for secure access
- Waveform visualization optional for MVP
- FR-2.2.3: Audio preview functionality

**Prerequisites:** Story 4.3

---

### Story 4.5: Download Audio File

As an **admin user**,
I want **to download the generated audio file**,
So that **I can use it outside the CMS**.

**Acceptance Criteria:**

**Given** a lesson has AUDIO_COMPLETED status
**When** I click the Download button
**Then** the audio file downloads to my device
**And** filename is formatted: `[CourseSlug]-[LessonNumber]-[LessonTitle].mp3`

**When** I right-click the player
**Then** context menu includes "Download audio" option

**And** the download respects:

- Original generation quality
- MP3 format (WAV option in future)
- Proper metadata tags (title, artist, album)

**Technical Notes:**

- GET `/api/courses/[slug]/lessons/[id]/audio/download`
- Returns presigned S3 URL with download headers
- FR-2.2.3: Download capabilities

**Prerequisites:** Story 4.4

---

### Story 4.6: Regenerate Audio

As an **admin user**,
I want **to regenerate audio with different settings**,
So that **I can improve the output quality**.

**Acceptance Criteria:**

**Given** a lesson has existing audio (AUDIO_COMPLETED)
**When** I click "Regenerate Audio"
**Then** confirmation modal appears:

- "This will replace the current audio. Continue?"
- Shows current settings for reference
- Cancel and Regenerate buttons

**When** I confirm regeneration
**Then** audio configuration modal opens (Story 4.2)
**And** previous settings are pre-filled

**When** new generation completes
**Then** old audio is replaced
**And** download link updates to new file

**Technical Notes:**

- Old audio files cleaned up by backend
- No version history for audio (unlike scripts)
- FR-2.2.3: Regeneration with different settings

**Prerequisites:** Story 4.4

---

### Story 4.7: Audio Generation Error Handling

As an **admin user**,
I want **clear error messages when audio generation fails**,
So that **I can understand and fix the problem**.

**Acceptance Criteria:**

**Given** audio generation fails (TTS service error)
**When** the error is caught
**Then** lesson status becomes AUDIO_FAILED
**And** error badge shows with tooltip explanation
**And** toast error: "Audio generation failed: [reason]"

**And** the error states include:

- "TTS service unavailable - please retry"
- "Script too long for audio generation"
- "Invalid voice configuration"
- "Network error - check connection"

**When** I click "Retry" on the error
**Then** previous configuration is restored
**And** generation attempts again (max 3 auto-retries)

**Technical Notes:**

- Error handling per Architecture: Process Patterns
- Retry with exponential backoff
- FR-2.2.3: Error handling and retry options

**Prerequisites:** Story 4.3

---

### Story 4.8: Batch Audio Generation

As an **admin user**,
I want **to generate audio for multiple lessons at once**,
So that **I can efficiently produce an entire course**.

**Acceptance Criteria:**

**Given** I am on the course detail page
**When** I select multiple lessons with SCRIPT_COMPLETED status
**Then** bulk actions toolbar shows "Generate Audio" option

**When** I click "Generate Audio" for batch
**Then** configuration modal opens with:

- "Generate audio for X lessons" header
- Shared voice selection (applies to all)
- Shared music selection
- Individual lessons can override (expandable list)
- "Generate All Audio" button

**When** I confirm batch generation
**Then** all selected lessons enter AUDIO_GENERATING status
**And** each generates independently
**And** toast: "Generating audio for X lessons..."

**And** I can see individual progress for each lesson

**Technical Notes:**

- POST `/api/courses/[slug]/generate-audio` with lesson IDs
- Parallel generation with individual tracking
- Memory management for concurrent TTS calls

**Prerequisites:** Story 4.3

---

### Story 4.9: Audio Waveform Visualization (Optional)

As an **admin user**,
I want **to see a visual waveform of the audio**,
So that **I can identify sections and navigate easily**.

**Acceptance Criteria:**

**Given** I am viewing the audio player
**When** the audio loads
**Then** a waveform visualization appears above the timeline
**And** the waveform shows amplitude variations

**When** audio plays
**Then** a playhead moves across the waveform
**And** played portion is highlighted

**When** I click on the waveform
**Then** playback jumps to that position

**Technical Notes:**

- Use WaveSurfer.js or similar library
- Optional for MVP - can use simple timeline instead
- Pregenerate waveform data on backend for performance

**Prerequisites:** Story 4.4

---

### Story 4.10: Lesson Completion Status

As an **admin user**,
I want **to see which lessons are fully complete**,
So that **I know the course is ready for publishing**.

**Acceptance Criteria:**

**Given** a lesson has status AUDIO_COMPLETED
**When** I view the lesson row
**Then** a completion badge shows (✓ or green checkmark)
**And** all actions show as "completed"

**Given** all lessons in a course are AUDIO_COMPLETED
**When** I view the course detail
**Then** course status updates to "Ready to Publish"
**And** overall progress shows 100%

**And** the course card on dashboard shows:

- Full progress bar (green)
- "Complete" badge
- Ready for export/publish

**Technical Notes:**

- Aggregate lesson states to determine course completion
- Progress calculation: AUDIO_COMPLETED lessons / total lessons
- FR-2.2.3: Generation status tracking

**Prerequisites:** Story 4.4

---

**Epic 4 Summary:**

| Story | Title                           | PRD Coverage |
| ----- | ------------------------------- | ------------ |
| 4.1   | Generate Audio Button & Status  | FR-2.2.3     |
| 4.2   | Audio Configuration Modal       | FR-2.2.3     |
| 4.3   | Audio Generation Progress       | FR-2.2.3     |
| 4.4   | Audio Player & Preview          | FR-2.2.3     |
| 4.5   | Download Audio File             | FR-2.2.3     |
| 4.6   | Regenerate Audio                | FR-2.2.3     |
| 4.7   | Audio Generation Error Handling | FR-2.2.3     |
| 4.8   | Batch Audio Generation          | FR-2.2.3     |
| 4.9   | Audio Waveform Visualization    | FR-2.2.3     |
| 4.10  | Lesson Completion Status        | FR-2.2.3     |

---

## Epic 5: Polish & Bulk Operations

**Goal:** Refine efficiency and system hardening.

**User Value:** Efficient management of large-scale content and assured system reliability.

**PRD Coverage:** FR-2.2.1 (Batch ops), FR-2.3.2 (Enhanced Feedback), NFR-3.1 (Performance)

---

### Story 5.1: Bulk Selection UI

As an **admin user**,
I want **an intuitive way to select multiple items**,
So that **I can perform batch operations efficiently**.

**Acceptance Criteria:**

**Given** I am viewing a list (lessons or courses)
**When** I click a checkbox on any item
**Then** selection mode activates
**And** bulk actions toolbar appears at top
**And** selected count shows: "X items selected"

**When** I click "Select All"
**Then** all visible items are selected
**And** count updates to total

**When** I click "Clear Selection"
**Then** all items are deselected
**And** toolbar disappears

**And** keyboard shortcuts:

- Shift+Click: Select range
- Ctrl/Cmd+Click: Toggle single item
- Ctrl/Cmd+A: Select all

**Technical Notes:**

- Use React state for selection tracking
- Persist selection across pagination
- FR-2.2.1: Batch operations for multiple lessons

**Prerequisites:** Story 2.6

---

### Story 5.2: Bulk Actions Toolbar

As an **admin user**,
I want **a contextual toolbar for bulk actions**,
So that **I can act on multiple items at once**.

**Acceptance Criteria:**

**Given** I have items selected
**When** the toolbar appears
**Then** I see available actions:

- For lessons: Generate Scripts, Generate Audio, Delete
- For courses: Delete, Export

**And** actions are contextually enabled:

- "Generate Audio" disabled if no scripts completed
- "Generate Scripts" disabled if no pending lessons

**When** I click a bulk action
**Then** confirmation shows: "This action will affect X items. Continue?"

**When** I navigate away
**Then** selection state is preserved (until cleared)

**Technical Notes:**

- Sticky toolbar at top of list
- Action availability computed from selected items' states
- Clear visual feedback for disabled actions

**Prerequisites:** Story 5.1

---

### Story 5.3: Bulk Delete with Confirmation

As an **admin user**,
I want **to delete multiple items with a single confirmation**,
So that **I can clean up content efficiently**.

**Acceptance Criteria:**

**Given** I have multiple lessons selected
**When** I click "Delete Selected"
**Then** confirmation modal shows:

- "Delete X lessons?"
- List of lesson titles to be deleted
- Warning: "This will also delete scripts and audio files"
- Cancel and "Delete All" buttons

**When** I confirm deletion
**Then** DELETE calls are made for each item
**And** progress indicator shows: "Deleting X of Y..."
**And** items are removed from list as completed
**And** toast: "X lessons deleted"

**When** any deletion fails
**Then** error shown with specific items that failed
**And** retry option for failed items

**Technical Notes:**

- Parallel delete requests with error handling
- Rollback on partial failure is not possible
- Log all deletions for audit

**Prerequisites:** Story 5.2

---

### Story 5.4: Loading States & Skeleton UI

As an **admin user**,
I want **visual feedback during all loading operations**,
So that **I know the system is responding**.

**Acceptance Criteria:**

**Given** any page is loading data
**When** the request is in flight
**Then** skeleton UI displays matching the expected layout:

- Course list: Skeleton cards matching grid layout
- Lesson list: Skeleton rows matching table layout
- Script editor: Skeleton textarea and toolbar

**And** skeletons:

- Animate with shimmer effect
- Match actual content dimensions
- Use theme surface color

**When** data loads
**Then** skeleton transitions smoothly to content
**And** no layout shift occurs

**Technical Notes:**

- Use shadcn/ui Skeleton component
- Match exact dimensions of real components
- Architecture: Loading State Patterns

**Prerequisites:** Story 1.1

---

### Story 5.5: Error Boundary & Recovery

As an **admin user**,
I want **graceful error handling when things go wrong**,
So that **I can recover without losing work**.

**Acceptance Criteria:**

**Given** a component throws an error
**When** the error boundary catches it
**Then** I see:

- Friendly error message (not technical stack trace)
- "Something went wrong" heading
- "Try Again" button
- "Go to Dashboard" link

**When** I click "Try Again"
**Then** the component remounts and retries

**Given** a form has unsaved data when error occurs
**When** the error boundary renders
**Then** data is preserved in localStorage
**And** recovery option shows: "Restore unsaved changes?"

**Technical Notes:**

- React Error Boundaries at route level
- Log errors to console/monitoring service
- FR-2.3.2: Error messages with recovery options

**Prerequisites:** Epic 1 complete

---

### Story 5.6: Performance Optimization

As an **admin user**,
I want **the application to load quickly and respond instantly**,
So that **I can work efficiently**.

**Acceptance Criteria:**

**Given** I navigate to any page
**When** the page loads
**Then** initial content visible in <2 seconds (PRD 3.1)

**And** optimizations include:

- Lazy loading for routes with React.lazy
- Prefetching next likely routes on hover
- Optimistic UI updates for all mutations
- Image optimization with next/image
- React Query staleTime of 5 minutes

**When** I perform common actions
**Then** UI responds in <100ms
**And** no visible jank or stutter

**Technical Notes:**

- Use Lighthouse for performance auditing
- Target 90+ performance score
- NFR-3.1: Page load time <2 seconds

**Prerequisites:** All previous epics

---

### Story 5.7: Keyboard Navigation & Accessibility

As an **admin user**,
I want **full keyboard navigation support**,
So that **I can work efficiently and the app is accessible**.

**Acceptance Criteria:**

**Given** I am using keyboard navigation
**When** I press Tab
**Then** focus moves through interactive elements in logical order
**And** focus ring is visible (cyan outline)

**When** I press Enter on a button
**Then** the action is triggered

**When** I press Escape on a modal
**Then** the modal closes (if no unsaved changes)

**And** accessibility requirements:

- All images have alt text
- Form fields have labels
- Color contrast meets WCAG 2.1 AA
- Screen reader announces state changes

**Technical Notes:**

- Use shadcn/ui components (built for accessibility)
- Test with VoiceOver/NVDA
- PRD 4.1: WCAG 2.1 AA compliance

**Prerequisites:** Epic 1 complete

---

### Story 5.8: Responsive Design Polish

As an **admin user**,
I want **the application to work well on tablet screens**,
So that **I can work from different devices**.

**Acceptance Criteria:**

**Given** viewport is 768px - 1024px (tablet)
**When** the page renders
**Then**:

- Sidebar collapses to icon-only by default
- Course grid shows 2 columns
- Forms remain usable
- Touch targets are at least 44px

**Given** viewport is below 768px (mobile)
**When** the page renders
**Then**:

- Sidebar becomes overlay (hamburger menu)
- Course grid shows 1 column
- Tables become card layout
- Modals become full-screen

**Technical Notes:**

- Tailwind responsive breakpoints: sm, md, lg
- Test on actual tablet devices
- PRD 3.2: Responsive for tablets and desktops

**Prerequisites:** All UI stories complete

---

### Story 5.9: Recent Items Quick Access

As an **admin user**,
I want **quick access to recently visited items**,
So that **I can resume work efficiently**.

**Acceptance Criteria:**

**Given** I visit a course or lesson
**When** I click on the sidebar "Recent" section
**Then** I see up to 5 most recent items:

- Course: Course title, last visited time
- Lesson: Lesson title, course name, last visited

**When** I click a recent item
**Then** I navigate directly to that item

**And** recent items:

- Persist across sessions (localStorage)
- Update on each visit
- Show relative time ("2 hours ago")

**Technical Notes:**

- Store in localStorage with timestamp
- Limit to 10 items max
- FR-2.3.1: Recent items access

**Prerequisites:** Story 1.2

---

### Story 5.10: Confirmation for Destructive Actions

As an **admin user**,
I want **confirmation dialogs for all destructive actions**,
So that **I don't accidentally delete important content**.

**Acceptance Criteria:**

**Given** I attempt any destructive action
**When** the action is triggered
**Then** a confirmation dialog appears:

- Clear title: "Delete X?" or "Remove Y?"
- Explanation of consequences
- Cancel button (secondary, focused)
- Destructive button (red, not focused)

**And** destructive actions include:

- Delete course
- Delete lesson
- Regenerate script (replaces existing)
- Regenerate audio (replaces existing)
- Bulk delete

**When** I press Escape or click Cancel
**Then** action is aborted
**And** no changes occur

**Technical Notes:**

- Use shadcn/ui AlertDialog
- Destructive button never auto-focused
- PRD 4.2: Confirmation for destructive actions

**Prerequisites:** Epic 1 complete

---

**Epic 5 Summary:**

| Story | Title                                | PRD Coverage |
| ----- | ------------------------------------ | ------------ |
| 5.1   | Bulk Selection UI                    | FR-2.2.1     |
| 5.2   | Bulk Actions Toolbar                 | FR-2.2.1     |
| 5.3   | Bulk Delete with Confirmation        | FR-2.2.1     |
| 5.4   | Loading States & Skeleton UI         | FR-2.3.2     |
| 5.5   | Error Boundary & Recovery            | FR-2.3.2     |
| 5.6   | Performance Optimization             | NFR-3.1      |
| 5.7   | Keyboard Navigation & Accessibility  | NFR-4.1      |
| 5.8   | Responsive Design Polish             | NFR-3.2      |
| 5.9   | Recent Items Quick Access            | FR-2.3.1     |
| 5.10  | Confirmation for Destructive Actions | NFR-4.2      |

---

## FR Coverage Matrix

| FR ID    | Requirement         | Stories                                           |
| -------- | ------------------- | ------------------------------------------------- |
| FR-2.1.1 | Course Listing      | 2.1, 2.2, 2.3, 2.5                                |
| FR-2.1.2 | Course Creation     | 2.4, 2.5, 2.11, 2.12                              |
| FR-2.2.1 | Lesson Organization | 2.6, 2.7, 2.8, 2.9, 2.10, 3.9, 5.1, 5.2, 5.3      |
| FR-2.2.2 | Script Generation   | 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.8, 3.9, 3.10 |
| FR-2.2.3 | Audio Generation    | 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7, 4.8, 4.9, 4.10 |
| FR-2.3.1 | Navigation          | 1.2, 5.9                                          |
| FR-2.3.2 | Feedback System     | 1.10, 3.3, 5.4, 5.5                               |
| FR-2.4.1 | User Authentication | 1.3, 1.4                                          |
| FR-2.4.2 | Session Management  | 1.5, 1.8, 1.9                                     |
| FR-2.4.3 | Access Control      | 1.6                                               |
| FR-2.4.4 | Security Features   | 1.4, 1.7                                          |

---

## Summary

| Epic                                     | Stories        | PRD Coverage                         |
| ---------------------------------------- | -------------- | ------------------------------------ |
| Epic 1: Core Foundation & Authentication | 10             | FR-2.3.1, FR-2.4.1-2.4.4             |
| Epic 2: Course & Lesson Structure        | 12             | FR-2.1.1, FR-2.1.2, FR-2.2.1         |
| Epic 3: AI Script Generation Workflow    | 10             | FR-2.2.2, FR-2.3.2                   |
| Epic 4: AI Audio Production Workflow     | 10             | FR-2.2.3                             |
| Epic 5: Polish & Bulk Operations         | 10             | FR-2.2.1, FR-2.3.2, NFR-3.1, NFR-4.x |
| **Total**                                | **52 stories** | **All FRs covered**                  |

---

**Document Status:** COMPLETE ✅

**Next Steps:**

1. Use `create-story` workflow to generate implementation-ready stories
2. Begin Sprint Planning with Epic ordering
3. Proceed to Phase 4: Implementation

---

_Generated by BMad Method - Create Epics and Stories Workflow_
_Last Updated: 2025-12-11_
