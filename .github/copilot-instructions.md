# Senda CMS - AI Coding Agent Instructions

## Project Overview

Senda CMS is a meditation course management system built with Next.js 15 and TypeScript. The CMS enables content managers to create guided meditation courses, generate lesson scripts using AI, and produce audio content through the Senda API integration.

**Current State**: Phase 2 (Authentication) ✅ complete, Phase 3.1 (OpenAPI Setup) ✅ complete. Currently implementing Phase 3.2 (Course Listing UI). See `docs/implementation-roadmap.md` for comprehensive implementation status.

## Tech Stack & Architecture

### Core Implementation

- **Framework**: Next.js 15 App Router with TypeScript + Turbopack
- **Package Manager**: Bun (never use npm/yarn - use `--exact` flag always)
- **Data Fetching**: openapi-react-query + @tanstack/react-query (auto-generated from OpenAPI spec)
- **State Management**: Zustand for auth state, React Query for server state
- **Authentication**: JWT with automatic refresh using `jose` library
- **UI Components**: shadcn/ui with Tailwind CSS 4.x
- **Forms**: React Hook Form + Zod validation with auto-generated schemas
- **Linting**: ESLint 9+ flat config + Prettier + import ordering
- **Git Hooks**: Husky + lint-staged + commitlint (conventional commits)

## Development Commands & Critical Workflows

### Package Management (Bun Only)

```bash
bun install                          # Install dependencies
bun add --exact <package>           # Add production dependency
bun add -d --exact <package>        # Add dev dependency
bun remove <package>                # Remove dependency
```

**CRITICAL**: Always use `--exact` flag to prevent version drift.

### Development Workflow

```bash
bun dev                            # Start dev server with Turbopack
bun build                          # Production build with Turbopack
bun typecheck                      # Run TypeScript type checking (no emit)
bun lint                           # Run ESLint
bun lint:fix                       # Auto-fix linting issues
bun format                         # Format code with Prettier
bun generate-types             # Generate TypeScript types from OpenAPI spec
```

### Type Generation (Essential for API changes)

```bash
# Regenerate API types when backend OpenAPI spec changes
bun generate-types
# This updates src/types/api.d.ts with latest API schemas

# Validate types after regeneration
bun generate-types && bun typecheck
```

### Environment Setup

- Copy `.env.example` to `.env`
- Required: `NEXT_PUBLIC_API_BASE_URL=http://localhost:8000`
- Required: `NEXT_PUBLIC_BUILD=development`

### Pre-Commit Quality Gates

Pre-commit hooks automatically run on TypeScript files:

```bash
# Triggered on git commit for *.{ts,tsx} files
eslint --fix                       # Auto-fix linting issues
prettier --write                   # Format code consistently
bun typecheck                      # Validate TypeScript types (entire project)
```

## Project Architecture & Data Flow

### OpenAPI-First Architecture (CRITICAL)

This project uses **openapi-react-query** for ALL API interactions:

- `src/types/api.d.ts` - Auto-generated TypeScript types from OpenAPI spec
- `src/lib/api.ts` - Configured openapi-fetch client with auth middleware
- All API calls use auto-generated, type-safe React Query hooks
- **Never write manual API functions** - use generated hooks instead

### Authentication Flow

```typescript
// Authentication state in Zustand store (src/stores/authStore.ts)
useAuthStore() → { user, token, refreshToken, isAuthenticated }

// Auto-refresh middleware in API client handles token renewal
// Cross-tab sync via localStorage events
// Route protection via middleware.ts
```

### Component Architecture Patterns

```
src/
├── app/                 # Next.js App Router (minimal pages)
│   ├── layout.tsx       # Root layout → ClientLayout → QueryProvider → AuthLayout
│   └── login/page.tsx   # Route delegates to containers
├── components/          # Pure UI components (no data fetching)
│   ├── AuthLayout.tsx   # Auth state management + route protection
│   ├── ClientLayout.tsx # Provider wrapper for client-side features
│   └── ui/              # shadcn/ui components
├── containers/          # Connected components with business logic
│   ├── Guest/SignIn/    # Login form with connect.ts for data logic
│   └── Main/            # Authenticated container views
└── stores/              # Zustand stores (auth only - server state via React Query)
```

### Data Fetching Pattern

```typescript
// In containers/[Name]/connect.ts
import { $api } from '@/lib/api';

export default function useConnect() {
  // Use auto-generated hooks from openapi-react-query
  const coursesQuery = $api.useQuery('get', '/api/courses');
  const createCourseMutation = $api.useMutation('post', '/api/courses');

  return { coursesQuery, createCourseMutation };
}
```

## Component Architecture

### Component Structure

The **Components** (`src/components/`) are pure, reusable UI components.

Every component follows this convention in `src/components/[Name]/`:

- index.tsx: Main component export (the view)
- types.ts: TypeScript interfaces/types for the component
- logic.ts: (Optional) Complex logic, handlers, or hooks
- spec.ts: (Optional) Component tests

### Containers

The **Containers** (`src/containers/`) are connected components that handle data fetching and business logic. Each container folder in `src/containers/Guest/[Name]/` or `src/containers/Main/[Name]/` typically includes:

- index.tsx: Container view
- types.ts: Container types/interfaces
- connect.ts: Data fetching, effects, and logic (for API integration)
- constants.ts: (Optional) For static values like container validation schemas
- spec.ts: (Optional) Container tests

## Next.js Specific Patterns

### App Router Structure

- Parallel routes: `@login` for guest views, `@dashboard` for authenticated
- Layout hierarchy: `layout.tsx` → `client.layout.tsx` (providers) → `AuthLayout`
- Use `'use client'` for components with hooks, state, or event handlers

### Route Organization

- Page components are minimal - delegate to containers
- Use `usePathname()` for route-based logic

## Code Quality & Standards

### ESLint Configuration

- Flat config format (eslint.config.mjs)
- TypeScript strict rules with consistent-type-imports
- Import ordering: builtin → external → internal (@/\*) → relative
- Prettier integration for formatting consistency

### TypeScript Patterns

- Use `interface` over `type` for object shapes
- Strict mode enabled with consistent type imports
- Path aliases: `@/*` maps to `./src/*`

### Commit Standards

- Conventional Commits enforced via commitlint
- Husky pre-commit hooks for linting and formatting
- Format: `feat/fix/docs/style/refactor/test/chore: description`

## Business Domain - Meditation Content

### Core Models

**Courses**: Meditation course management with metadata and lesson organization
**Lessons**: Individual meditation sessions with AI-generated scripts and audio
**Content Generation**: Script creation via Senda API integration
**Audio Production**: Text-to-speech conversion using Kokoro TTS

### Content Workflow

1. Create course with metadata (title, description, author)
2. Add lessons with practice parameters (duration, tone, key points)
3. Generate lesson scripts using AI integration
4. Convert scripts to audio content
5. Track generation status and handle errors

### API Integration

- **Base URL**: `http://localhost:8000` (configurable via env)
- **OpenAPI Spec**: Available at `/api/openapi.json`
- **Key Endpoints**: Courses CRUD, lesson management, script/audio generation
- **Authentication**: JWT-based admin-only access

## Implementation Guidelines

### When Adding Dependencies

Use Bun for all package management:

```bash
bun add --exact @tanstack/react-query zustand react-hook-form zod
bun add -d --exact @types/node
```

**NOTE:** Always use `--exact` to avoid version drift.

### Authentication Implementation

- JWT-based admin-only system
- Store auth state in Zustand store
- Protect all routes (no public access)
- Handle token refresh and session management

## Current Development Status

**📋 Implementation Roadmap**: See `docs/implementation-roadmap.md` for comprehensive phase-by-phase implementation plan.

**✅ Phase 1 Complete**: Project Foundation

**✅ Phase 2 Complete**: Authentication System

**✅ Phase 3.1 Complete**: OpenAPI-First Data Fetching Setup

**🎯 Phase 3.2 Current**: Course Listing UI

**⏭️ Upcoming Phases**:

- Phase 3.3: Course Management (Create/Edit forms)
- Phase 4: Lesson Management (CRUD operations)
- Phase 5: Script Generation (AI integration)
- Phase 6: Audio Generation (TTS integration)
