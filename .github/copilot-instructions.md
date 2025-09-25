# Senda CMS - AI Coding Agent Instructions

## Project Overview

Senda CMS is a meditation course management system built with Next.js 15 and TypeScript. The CMS enables content managers to create guided meditation courses, generate lesson scripts using AI, and produce audio content through the Senda API integration.

**Current State**: See `docs/implementation-roadmap.md` for detailed implementation status. Phase 1 (Foundation) complete ✅, currently focusing on Phase 2 (Authentication System) 🎯.

## Tech Stack & Architecture

### Current Implementation

- **Framework**: Next.js 15 App Router with TypeScript
- **Package Manager**: Bun (preferred over npm/yarn)
- **Styling**: Tailwind CSS 4.x with CSS custom properties
- **Linting**: ESLint 9+ with flat config, Prettier, and import ordering
- **Git Hooks**: Husky + lint-staged + commitlint (conventional commits)
- **Development**: Turbopack for fast dev server and builds

### Planned Architecture

- **State Management**: React Query (TanStack Query) + Zustand
- **UI Components**: shadcn/ui with Tailwind CSS
- **Authentication**: JWT-based admin-only access
- **API Integration**: REST client for Senda API (meditation courses/lessons)
- **Forms**: React Hook Form + Zod validation

## Development Commands

### Package Management

Use Bun commands (never npm/yarn):

- `bun install` - Install dependencies
- `bun add <package>` - Add new dependency
- `bun add -d <package>` - Add new dev dependency
- `bun remove <package>` - Remove dependency

### Development Workflow

- `bun dev` - Start dev server with Turbopack
- `bun build` - Production build with Turbopack
- `bun lint` - Run ESLint
- `bun lint:fix` - Auto-fix linting issues
- `bun format` - Format code with Prettier

### Environment Setup

- Environment variables in `.env` (use `.env.example` as template)
- API base URL: `NEXT_PUBLIC_API_BASE_URL=http://localhost:8000`
- Build identifier: `NEXT_PUBLIC_BUILD=development`

## Project Structure

### Current Layout

```
src/
├── app/                 # Next.js App Router (currently minimal)
│   ├── layout.tsx       # Root layout with fonts
│   ├── page.tsx         # Homepage
│   └── globals.css      # Tailwind CSS imports + theme
```

### Planned Structure

```
src/
├── app/                 # Next.js App Router pages
│   ├── (auth)/          # Auth group routes
│   ├── courses/         # Course management pages
│   └── lessons/         # Lesson management pages
├── components/          # Reusable UI components
│   └── ui/             # shadcn/ui components
├── hooks/              # Custom React hooks
├── lib/                # Utility functions
├── services/           # API clients and services
└── stores/             # Zustand state stores
```

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

### Component Development Strategy

1. **Start Simple**: Begin with basic Tailwind-styled components
2. **Add shadcn/ui**: Install and customize needed components (`bunx --bun shadcn@latest add button`)
3. **State Management**: Add React Query for server state, Zustand for client state
4. **Form Handling**: Use React Hook Form + Zod for type-safe forms

### Authentication Implementation

- JWT-based admin-only system
- Store auth state in Zustand store
- Protect all routes (no public access)
- Handle token refresh and session management

## Current Development Status

**📋 Implementation Roadmap**: See `docs/implementation-roadmap.md` for comprehensive phase-by-phase implementation plan.

**✅ Phase 1 Complete**: Project Foundation

**🎯 Phase 2 Current**: Authentication System

**⏭️ Upcoming Phases**:

- Phase 3: Course Listing (React Query + shadcn/ui tables)
- Phase 4: Course Creation (Forms with validation)
- Phase 5: Lesson Management (CRUD operations)
- Phase 6: Script Generation (AI integration)
- Phase 7: Audio Generation (TTS integration)
