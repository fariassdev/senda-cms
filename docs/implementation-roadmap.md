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

- [ ] Install UI dependencies for forms
  - [ ] `bunx --bun shadcn@latest init` - Initialize shadcn/ui
  - [ ] `bunx --bun shadcn@latest add button input card form` - Basic UI components
  - [ ] `bun add --exact react-hook-form @hookform/resolvers zod` - Form handling
- [ ] Create login page
  - [ ] `src/app/login/page.tsx` - Login route
  - [ ] Login form with email/password fields
  - [ ] Form validation with Zod schema
  - [ ] Loading states and error handling
- [ ] Implement login API integration
  - [ ] `src/lib/auth.ts` - Auth API functions
  - [ ] Login mutation with error handling
  - [ ] Token parsing and user data extraction
  - [ ] Redirect logic after successful login

#### 2.3 Route Protection

- [ ] Create auth middleware
  - [ ] `src/middleware.ts` - Route protection middleware
  - [ ] Redirect unauthenticated users to login
  - [ ] Protect all routes except `/login`
- [ ] Implement auth layout wrapper
  - [ ] `src/components/AuthLayout.tsx` - Auth state provider
  - [ ] Handle loading states during auth check
  - [ ] Auto-logout on token expiration

### Phase 3: Course Listing 📚

#### 3.1 Data Fetching Setup

- [ ] Install data fetching dependencies
  - [ ] `bun add --exact @tanstack/react-query` - Server state management
  - [ ] `bun add -D --exact @tanstack/react-query-devtools` - Development tools (dev dependency)
- [ ] Setup React Query provider
  - [ ] Update `src/app/layout.tsx` with QueryClient provider
  - [ ] Configure default query options
  - [ ] Add dev tools in development mode

#### 3.2 Course API Integration

- [ ] Create course types
  - [ ] `src/types/course.ts` - Course and Lesson interfaces
  - [ ] Based on Senda API OpenAPI spec structure
- [ ] Implement course API client
  - [ ] `src/lib/api/courses.ts` - Course CRUD operations
  - [ ] `getCourses()` function with proper typing
  - [ ] Error handling and response parsing

#### 3.3 Course Listing UI

- [ ] Install additional UI components
  - [ ] `bunx --bun shadcn@latest add table skeleton badge` - List components
- [ ] Create course list page
  - [ ] `src/app/courses/page.tsx` - Courses listing route
  - [ ] Course list component with React Query
  - [ ] Loading skeletons and empty states
  - [ ] Error boundaries for failed requests
- [ ] Add navigation structure
  - [ ] `src/components/Navigation.tsx` - Main navigation
  - [ ] Sidebar or top navigation with course link
  - [ ] Active route highlighting

### Phase 4: Course Creation ➕

#### 4.1 Course Creation Form

- [ ] Install additional form components
  - [ ] `bunx --bun shadcn@latest add textarea select label` - Form inputs
- [ ] Create course creation page
  - [ ] `src/app/courses/new/page.tsx` - New course route
  - [ ] Course creation form with all required fields
  - [ ] Form validation with Zod schema
  - [ ] Handle form submission and loading states

#### 4.2 Course Creation API

- [ ] Implement course creation API
  - [ ] `createCourse()` function in courses API client
  - [ ] Optimistic updates with React Query
  - [ ] Success/error toast notifications
- [ ] Install toast notifications
  - [ ] `bunx --bun shadcn@latest add sonner` - Toast notifications
  - [ ] Add Toaster provider to layout
  - [ ] Success and error message handling

#### 4.3 Course Management

- [ ] Add course actions
  - [ ] Edit course functionality
  - [ ] Delete course with confirmation dialog
  - [ ] `bunx --bun shadcn@latest add dialog` - Confirmation modals
- [ ] Create course detail page
  - [ ] `src/app/courses/[id]/page.tsx` - Individual course view
  - [ ] Display course metadata and lesson list
  - [ ] Navigation between course list and detail

### Phase 5: Lesson Management 📝

#### 5.1 Lesson Data Structure

- [ ] Update lesson types
  - [ ] Extend lesson interface with all required fields
  - [ ] Lesson status enum (NOT_GENERATED, GENERATING, etc.)
  - [ ] Lesson form validation schemas

#### 5.2 Lesson CRUD Operations

- [ ] Implement lesson API client
  - [ ] `src/lib/api/lessons.ts` - Lesson operations
  - [ ] Create, read, update, delete lesson functions
  - [ ] Lesson reordering functionality
- [ ] Create lesson management UI
  - [ ] Lesson list within course detail page
  - [ ] Add/edit lesson form modal or page
  - [ ] Lesson status indicators and progress bars

#### 5.3 Lesson Form Implementation

- [ ] Create comprehensive lesson form
  - [ ] All lesson fields (title, duration, tone, key points, etc.)
  - [ ] Dynamic form validation
  - [ ] Save as draft functionality
- [ ] Add lesson ordering
  - [ ] Drag and drop lesson reordering
  - [ ] `bun add --exact @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities` - Only if needed
  - [ ] Update lesson numbers automatically

### Phase 6: Script Generation 🤖

#### 6.1 Script Generation API Integration

- [ ] Implement script generation API
  - [ ] `src/lib/api/scripts.ts` - Script generation functions
  - [ ] `generateScript()` function with lesson parameters
  - [ ] Script generation status polling
  - [ ] Script retrieval and caching

#### 6.2 Script Generation UI

- [ ] Add script generation interface
  - [ ] Generate script button in lesson detail
  - [ ] Progress indicators during generation
  - [ ] Script preview and editing capabilities
- [ ] Install code/text editor if needed
  - [ ] `bun add --exact @monaco-editor/react monaco-editor` - Only if advanced editing needed
  - [ ] Rich text editor for script content
  - [ ] Auto-save functionality

#### 6.3 Script Management

- [ ] Implement script versioning
  - [ ] Script history and version comparison
  - [ ] Rollback to previous versions
  - [ ] Script approval workflow if needed

### Phase 7: Audio Generation 🎵

#### 7.1 Audio Generation API

- [ ] Implement audio generation API
  - [ ] `src/lib/api/audio.ts` - Audio generation functions
  - [ ] `generateAudio()` function from script content
  - [ ] Audio generation progress tracking
  - [ ] Audio file management and URLs

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
  - [ ] Audio generation queue management
  - [ ] Batch audio generation for multiple lessons
  - [ ] Audio quality validation and retry logic

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
