# Senda CMS Project Checklist

## Project Overview

The Senda CMS is a modern web application built with Next.js and TypeScript to manage meditation courses and lessons. It interfaces with the Senda API to handle course creation, lesson script generation, and audio generation.

**Implementation Priority**: Login → Course listing → Course creation → Lesson management → Script generation → Audio generation

**Development Philosophy**: YAGNI (You Aren't Gonna Need It) - implement features and add dependencies only when needed.

## Implementation Checklist

### Phase 1: Project Foundation ✅

- [x] Initialize project structure
  - [x] Initialize project using `bun create next-app`
  - [x] Configure ESLint with flat config format
  - [x] Install and configure Prettier
  - [x] Install and configure Husky with Commitlint for pre-commit hooks
  - [x] Setup TypeScript strict mode with path aliases
  - [x] Configure Tailwind CSS 4.x with custom properties
  - [x] Update project documentation and Copilot instructions

### Phase 2: Authentication System 🎯

#### 2.1 Basic Authentication Setup

- [x] Install authentication dependencies
  - [x] `bun add --exact zustand` - Client state management for auth
  - [x] `bun add -D --exact @types/jsonwebtoken` - JWT token types (dev dependency)
- [x] Create auth store with Zustand
  - [x] `src/stores/authStore.ts` - Auth state management
  - [x] Define user interface and auth actions
  - [x] Handle token storage in localStorage
- [x] Create basic API client
  - [x] `src/lib/api.ts` - Fetch wrapper with base URL
  - [x] Add authorization header injection
  - [x] Basic error handling for 401/403 responses

#### 2.2 Login Implementation

- [x] Install UI dependencies for forms
  - [x] `bunx --bun shadcn@latest init` - Initialize shadcn/ui
  - [x] `bunx --bun shadcn@latest add button input card form` - Basic UI components
  - [x] `bun add --exact react-hook-form @hookform/resolvers zod` - Form handling
- [x] Create login page
  - [x] `src/app/login/page.tsx` - Login route
  - [x] Login form with email/password fields
  - [x] Form validation with Zod schema
  - [x] Loading states and error handling
- [x] Implement login API integration
  - [x] `src/lib/auth.ts` - Auth API functions
  - [x] Login mutation with error handling
  - [x] Token parsing and user data extraction
  - [x] Redirect logic after successful login

#### 2.3 Token Management System

- [x] Enhance auth store for token management
  - [x] Update `src/stores/authStore.ts` to store both access and refresh tokens
  - [x] Add token refresh logic and error handling
  - [x] Implement cross-tab session synchronization via localStorage events
- [x] Implement automatic token refresh
  - [x] Create `src/hooks/useAuthRefresh.ts` hook for background token refresh
  - [x] Add token expiration checking with JWT payload parsing
  - [x] Implement periodic refresh (every 5 minutes) and on window focus
- [x] Update API client for token handling
  - [x] Add automatic token refresh on 401 responses in `src/lib/api.ts`
  - [x] Implement request retry with new token after refresh
  - [x] Handle refresh failures with automatic logout
- [x] Enhance auth API functions
  - [x] Add `refreshAccessToken()` function to `src/lib/auth.ts`
  - [x] Update `verifyToken()` to use actual `/auth/me` endpoint
  - [x] Implement graceful error handling for all auth operations

#### 2.4 Route Protection

- [x] Create auth middleware
  - [x] `src/middleware.ts` - Route protection middleware
  - [x] Redirect unauthenticated users to login
  - [x] Protect all routes except `/login`
- [x] Implement auth layout wrapper
  - [x] `src/components/AuthLayout.tsx` - Auth state provider
  - [x] Handle loading states during auth check
  - [x] Auto-logout on token expiration

### Phase 3: Course Listing 📚

> **🚀 ARCHITECTURAL SHIFT**: Phase 3.1 introduced openapi-react-query as the core data fetching strategy. This eliminated the need for manual API client development and type definitions. All subsequent phases now leverage auto-generated, type-safe React Query hooks from the OpenAPI specification.

#### 3.1 OpenAPI-First Data Fetching Setup ✅

- [x] Install data fetching dependencies
  - [x] `bun add --exact @tanstack/react-query` - Server state management
  - [x] `bun add -D --exact @tanstack/react-query-devtools` - Development tools (dev dependency)
  - [x] `bun add --exact openapi-fetch openapi-react-query` - OpenAPI integration
  - [x] `bun add --exact jose` - Secure JWT token handling
- [x] Setup React Query provider
  - [x] Update `src/app/layout.tsx` with QueryClient provider
  - [x] Configure default query options
  - [x] Add dev tools in development mode
- [x] **MAJOR**: Implement OpenAPI-first architecture
  - [x] Replace custom API client with openapi-react-query
  - [x] Auto-generate TypeScript types from OpenAPI spec (`src/types/api.d.ts`)
  - [x] Create type generation script: `bun run generate-types`
  - [x] Enhanced JWT handling with jose library
  - [x] Improved token refresh and error handling
  - [x] Add strict TypeScript mode with `noUncheckedIndexedAccess`

#### 3.2 Course API Integration

- [x] **Auto-Generated API Types**: Complete TypeScript definitions from OpenAPI spec
  - [x] Course, Lesson, User, and all API schemas automatically typed
  - [x] Full endpoint coverage with request/response typing
- [x] **Type-Safe API Client**: openapi-fetch integration
  - [x] Automatic API client generation from OpenAPI schema
  - [x] Built-in authentication and error handling
  - [x] Optimized React Query hooks for all endpoints

#### 3.3 Course Listing UI

- [x] Install additional UI components
  - [x] `bunx --bun shadcn@latest add table skeleton badge` - List components
- [x] Create course list page
  - [x] `src/app/courses/page.tsx` - Courses listing route
  - [x] Use auto-generated `useGetCourses()` hook from openapi-react-query
  - [x] Loading skeletons and empty states
  - [x] Error boundaries for failed requests
- [x] Add navigation structure
  - [x] `src/components/Navigation.tsx` - Main navigation
  - [x] Sidebar or top navigation with course link
  - [x] Active route highlighting

### Phase 4: Course Creation ➕

#### 4.1 Course Creation Form

- [ ] Install additional form components
  - [ ] `bunx --bun shadcn@latest add textarea select label` - Form inputs
- [ ] Create course creation page
  - [ ] `src/app/courses/new/page.tsx` - New course route
  - [ ] Course creation form with prompt-based generation
  - [ ] Form validation with Zod schema (auto-generated from OpenAPI)
  - [ ] Handle form submission and loading states

#### 4.2 Course Creation API

- [ ] Implement course creation with auto-generated hooks
  - [ ] Use `useCreateCourseFromPrompt()` mutation from openapi-react-query
  - [ ] Optimistic updates with React Query
  - [ ] Success/error toast notifications
- [ ] Install toast notifications
  - [ ] `bunx --bun shadcn@latest add sonner` - Toast notifications
  - [ ] Add Toaster provider to layout
  - [ ] Success and error message handling

#### 4.3 Course Management

- [ ] Add course actions using auto-generated hooks
  - [ ] Edit course functionality with `useUpdateCourse()` mutation
  - [ ] Delete course with confirmation dialog
  - [ ] `bunx --bun shadcn@latest add dialog` - Confirmation modals
- [ ] Create course detail page
  - [ ] `src/app/courses/[id]/page.tsx` - Individual course view
  - [ ] Use `useGetCourse()` hook for course details
  - [ ] Display course metadata and lesson list
  - [ ] Navigation between course list and detail

### Phase 5: Lesson Management 📝

#### 5.1 Lesson Data Structure

- [x] **Auto-Generated Lesson Types**: Complete lesson interfaces from OpenAPI spec
  - [x] Lesson, LessonStatus, ScriptPart types automatically available
  - [x] Lesson status enum (PENDING, SCRIPT_GENERATING, SCRIPT_COMPLETED, etc.)
  - [x] Full typing for lesson metadata, script parts, and audio URLs

#### 5.2 Lesson CRUD Operations

- [ ] Implement lesson management with auto-generated hooks
  - [ ] Use lesson-related hooks from openapi-react-query (when available)
  - [ ] Create, read, update, delete lesson operations
  - [ ] Lesson reordering functionality within courses
- [ ] Create lesson management UI
  - [ ] Lesson list within course detail page
  - [ ] Add/edit lesson form modal or page
  - [ ] Lesson status indicators and progress bars

#### 5.3 Lesson Form Implementation

- [ ] Create comprehensive lesson form
  - [ ] All lesson fields with auto-generated validation schemas
  - [ ] Dynamic form validation using OpenAPI-derived types
  - [ ] Save as draft functionality
- [ ] Add lesson ordering (if needed)
  - [ ] Drag and drop lesson reordering
  - [ ] `bun add --exact @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities` - Only if needed
  - [ ] Update lesson numbers automatically

### Phase 6: Script Generation 🤖

#### 6.1 Script Generation API Integration

- [x] **Auto-Generated Script API**: Script generation hooks from openapi-react-query
  - [x] `useGenerateLessonScript()` mutation for individual lessons
  - [x] `useGenerateAllLessonsScripts()` mutation for batch generation
  - [x] Built-in progress tracking and error handling
- [ ] Implement script generation UI integration
  - [ ] Script generation status polling with React Query
  - [ ] Script retrieval and caching with auto-refresh
  - [ ] Progress indicators during generation

#### 6.2 Script Generation UI

- [ ] Add script generation interface
  - [ ] Generate script button in lesson detail
  - [ ] Progress indicators during generation using lesson status
  - [ ] Script preview and editing capabilities
- [ ] Install code/text editor if needed
  - [ ] `bun add --exact @monaco-editor/react monaco-editor` - Only if advanced editing needed
  - [ ] Rich text editor for script content
  - [ ] Auto-save functionality

#### 6.3 Script Management

- [ ] Implement script workflow
  - [ ] Script regeneration controls
  - [ ] Script status management (PENDING → GENERATING → COMPLETED/FAILED)
  - [ ] Batch script generation for multiple lessons
  - [ ] Error handling and retry logic for failed generations

### Phase 7: Audio Generation 🎵

#### 7.1 Audio Generation API

- [x] **Auto-Generated Audio API**: Audio generation hooks from openapi-react-query
  - [x] `useGenerateLessonAudio()` mutation for individual lessons
  - [x] `useGenerateCourseAudios()` mutation for batch audio generation
  - [x] Built-in progress tracking and audio URL management
- [ ] Implement audio generation workflow
  - [ ] Audio generation from lesson scripts
  - [ ] Audio generation progress tracking with lesson status
  - [ ] Audio file management and URL handling

#### 7.2 Audio Player Integration

- [ ] Install audio components if needed
  - [ ] `bun add --exact react-h5-audio-player` - Only if custom player needed
  - [ ] Native HTML5 audio player implementation
  - [ ] Audio controls and progress indicators
- [ ] Create audio management UI
  - [ ] Audio player in lesson detail
  - [ ] Download audio functionality
  - [ ] Audio regeneration controls

#### 7.3 Audio Status Management

- [ ] Implement audio workflow
  - [ ] Audio generation queue management with lesson status
  - [ ] Batch audio generation for multiple lessons
  - [ ] Audio quality validation and retry logic
  - [ ] Integration with lesson status (AUDIO_GENERATING → AUDIO_COMPLETED/FAILED)

### Phase 8: Polish and Optimization 🎨

#### 8.1 UI/UX Improvements

- [ ] Add loading states everywhere
  - [ ] Skeleton components for all loading states
  - [ ] Consistent loading indicators
  - [ ] Proper error boundaries
- [ ] Implement responsive design
  - [ ] Mobile-first approach with Tailwind breakpoints
  - [ ] Tablet and desktop optimizations
  - [ ] Touch-friendly interactions

#### 8.2 Performance Optimization

- [ ] Optimize bundle size
  - [ ] Code splitting for large pages
  - [ ] Dynamic imports for heavy components
  - [ ] Image optimization with Next.js Image
- [ ] Add caching strategies
  - [ ] React Query cache optimization
  - [ ] API response caching headers
  - [ ] Static generation where possible

#### 8.3 Testing and Quality Assurance

- [ ] Add testing setup only when needed
  - [ ] `bun add -D --exact vitest @testing-library/react @testing-library/jest-dom jsdom` - Unit testing
  - [ ] `bun add -D --exact @playwright/test` - E2E testing if needed
  - [ ] Critical path testing for auth and core features
- [ ] Add monitoring and analytics
  - [ ] Error tracking (Sentry) if needed
  - [ ] Performance monitoring
  - [ ] User analytics for usage patterns

### Phase 9: Deployment and DevOps 🚀

#### 9.1 Deployment Setup

- [ ] Configure deployment pipeline
  - [ ] Vercel deployment configuration
  - [ ] Environment variable setup for production
  - [ ] Branch-based deployments (main → production)
- [ ] Add deployment documentation
  - [ ] Update README with deployment instructions
  - [ ] Environment setup guide
  - [ ] Troubleshooting guide

#### 9.2 Production Readiness

- [ ] Security hardening
  - [ ] Security headers in Next.js config
  - [ ] API rate limiting considerations
  - [ ] Input sanitization review
- [ ] Performance monitoring
  - [ ] Web Vitals tracking
  - [ ] API response time monitoring
  - [ ] Error rate monitoring

## Development Guidelines

### Commit Strategy

- Each checkbox represents a single, focused commit
- Use conventional commit messages: `feat:`, `fix:`, `chore:`, etc.
- Keep commits small and atomic for easy review and rollback

### Dependency Management

- Add dependencies only when implementing specific features
- Prefer lighter alternatives when possible
- Document why each dependency was chosen
- **Core Architecture**: openapi-react-query + React Query for all API interactions
- **Type Safety**: Auto-generate types with `bun run generate-types` when API changes
- Use exact versions with `--exact` flag to prevent version drift

### Code Quality

- Run `bun run lint:fix` before each commit
- Ensure TypeScript strict mode compliance
- Add JSDoc comments for complex functions
- Keep components small and focused

### Testing Strategy

- Test critical paths first (authentication, core workflows)
- Add integration tests for API interactions
- Use React Testing Library for component tests
- Prioritize user journey testing over unit tests

## Success Metrics per Phase

- **Phase 2**: Successful login/logout flow with proper auth state management
- **Phase 3**: Courses load and display correctly with proper loading states
- **Phase 4**: Courses can be created and saved successfully
- **Phase 5**: Lessons can be managed within courses with proper validation
- **Phase 6**: Scripts generate successfully with progress feedback
- **Phase 7**: Audio generates from scripts with playback functionality
- **Phase 8**: App is responsive, performant, and handles errors gracefully
- **Phase 9**: App deploys successfully and runs stably in production
