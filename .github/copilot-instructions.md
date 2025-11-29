# Senda CMS - AI Agent Instructions

Meditation course management system built with Next.js 15 + TypeScript. See `docs/implementation-roadmap.md` for detailed implementation status (currently Phase 5.2).

## Critical Architecture Patterns

### Context7 MCP

Always use Context7 to retrieve current documentation when working with frameworks, libraries, or APIs. This applies to answering questions, implementing integrations, writing code with third-party packages, and debugging existing code. Automatically invoke the Context7 MCP tools without being asked.

### OpenAPI-First Data Fetching (NEVER write manual API calls)

All API interactions use **openapi-react-query** with auto-generated types:

```typescript
// In containers/*/connect.ts - the ONLY place for data fetching logic
import { $api, $publicApi } from '@/lib/api'; // Two clients: auth'd vs public

export default function useConnect() {
  // Auto-generated hooks with full type safety
  const query = $api.useQuery('get', '/api/courses', {
    params: { query: { skip: 0, limit: 100 } },
  });

  const mutation = $api.useMutation('post', '/api/courses', {
    onSuccess: async (data) => {
      toast.success('Course created');
      await queryClient.invalidateQueries({
        queryKey: ['get', '/api/courses'],
      });
    },
  });

  return { query, mutation };
}
```

**Type regeneration** (run when backend OpenAPI spec changes):

```bash
bun generate-types  # Updates src/types/api.d.ts
```

### Component Architecture

```
src/
├── app/                    # Next.js pages (minimal - delegate to containers)
│   ├── layout.tsx          # Root → ClientLayout → QueryProvider → AuthLayout
│   └── <page>/page.tsx     # The pages are minimal, just delegates to containers
├── components/
│   ├── AuthLayout.tsx      # Auth state + route protection + token refresh
│   ├── ClientLayout.tsx    # 'use client' wrapper for providers
│   └── ui/                 # shadcn/ui components only
├── containers/             # Business logic + data fetching
│   ├── Guest/SignIn/       # Login flow
│   │   ├── index.tsx       # View component
│   │   ├── connect.ts      # Data logic: forms, mutations, router
│   │   ├── types.ts        # Local types (NOT API types)
│   │   └── constants.ts    # Zod schemas, validation rules
│   └── Main/<Container>/   # Authenticated views
└── stores/authStore.ts     # Auth state ONLY (server state → React Query)
```

**Rule**: Containers have `connect.ts` for ALL logic (API calls, forms, effects). Components are pure presentational.

### Authentication Flow

```typescript
// Auth middleware in src/lib/api.ts handles EVERYTHING:
// 1. Token injection on requests
// 2. Token expiration checks (5min buffer)
// 3. Auto-refresh on 401 or expired tokens
// 4. Cross-tab sync via localStorage events

// Route protection in src/middleware.ts
// - All routes except /login require auth
// - Redirects unauthenticated → /login
// - Redirects authenticated /login → /courses
```

Token refresh runs automatically:

- Every 5 minutes (background)
- On window focus
- Before requests if token expires in <5min
- On 401 responses

**Never manually handle auth** - middleware + store handle everything.

## Development Workflow

### Package Management (Bun ONLY)

```bash
bun add --exact <pkg>       # ALWAYS use --exact flag
bun add -d --exact <pkg>    # Dev dependencies
bun remove <pkg>

# Common commands
bun dev                     # Dev server (Turbopack)
bun typecheck               # Full TS validation (pre-commit runs this)
bun lint:fix                # Linter auto-fix
bun format                  # Format
```

### Pre-Commit Hooks (Husky + lint-staged)

On every commit for `*.{ts,tsx}` files:

1. `eslint --fix` - Auto-fixes linting
2. `prettier --write` - Formats code
3. `bun typecheck` - Validates entire project (catches type errors)

**Commit format**: `feat/fix/docs/refactor/test: description` (max 110 chars)

### Environment Variables

```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000  # Required
NEXT_PUBLIC_BUILD=development                    # Required
JWT_SECRET=<secret>                              # Optional (middleware validation)
```

## Code Standards

### ESLint Rules (eslint.config.mjs)

- **Import ordering enforced**: builtin → external → `@/*` internal → relative
- **Consistent type imports**: `import type { Foo } from 'bar'` (required)
- **Single quotes** for strings (except template literals)
- **Ignored files**: `src/types/api.d.ts` (auto-generated)

### TypeScript Patterns

```typescript
// Use interface, not type (for objects)
interface CourseFormData {
  prompt: string;
}

// Import types consistently
import type { Course, Lesson } from '@/types/models';

// Path alias @/* = src/*
import { $api } from '@/lib/api';

// Strict mode enabled: noUncheckedIndexedAccess
const item = array[0]; // Type: Item | undefined
```

### React Query Patterns

```typescript
// Optimistic updates + cache invalidation
const mutation = $api.useMutation('post', '/api/courses', {
  onSuccess: async () => {
    // Invalidate queries to refetch
    await queryClient.invalidateQueries({
      queryKey: ['get', '/api/courses'],
      refetchType: 'active', // Only refetch mounted queries
    });
  },
});

// Query config in QueryProvider.tsx:
// - staleTime: 5min
// - gcTime: 10min
// - retry: 3x with backoff
// - NO refetchOnWindowFocus (opt-in per query)
```

## Common Tasks

### Adding a New Container

```bash
# 1. Create structure
mkdir -p src/containers/Main/FeatureName
touch src/containers/Main/FeatureName/{index.tsx,connect.ts,types.ts,constants.ts}

# 2. In connect.ts - use auto-generated hooks
import { $api } from '@/lib/api';
export default function useConnect() {
  const query = $api.useQuery('get', '/api/endpoint');
  return { query };
}

# 3. In index.tsx - consume hook
import useConnect from './connect';
export default function FeatureName() {
  const { query } = useConnect();
  return <div>{query.data}</div>;
}
```

### Adding shadcn/ui Components

```bash
bunx --bun shadcn@latest add button input table
# Always use --bun flag, components go to src/components/ui/
```

### Form Validation with Zod

```typescript
// In constants.ts
import { z } from 'zod';

export const validationSchema = z.object({
  prompt: z.string().min(10, 'At least 10 characters'),
});

// In connect.ts
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { validationSchema } from './constants';

const form = useForm({
  resolver: zodResolver(validationSchema),
  defaultValues: { prompt: '' },
});
```

## Business Domain (Meditation CMS)

**Workflow**: Course creation → Lesson management → Script generation (AI) → Audio generation (TTS)

**Models** (from `src/types/models.ts` - all from OpenAPI):

- `Course`: Course metadata (title, description, author)
- `Lesson`: Lesson details (duration, key_points, tone)
- `LessonStatus`: PENDING | SCRIPT_GENERATING | SCRIPT_COMPLETED | AUDIO_GENERATING | COMPLETED
- `ScriptPart`: Script sections with text/audio URLs

**API**: JWT admin-only, OpenAPI spec at `http://localhost:8000/api/openapi.json`

## Key Files Reference

| File                             | Purpose                                                                          |
| -------------------------------- | -------------------------------------------------------------------------------- |
| `src/lib/api.ts`                 | OpenAPI clients with auth middleware (token refresh, 401 handling)               |
| `src/stores/authStore.ts`        | Auth state + cross-tab sync + token storage                                      |
| `src/middleware.ts`              | Route protection (redirects based on auth)                                       |
| `src/components/AuthLayout.tsx`  | Auth initialization + loading states                                             |
| `src/types/api.d.ts`             | **Auto-generated** - NEVER edit manually                                         |
| `src/types/models.ts`            | Type exports from OpenAPI schemas **Always use these types to reference models** |
| `docs/implementation-roadmap.md` | Full implementation checklist                                                    |

## Troubleshooting

**Token refresh failures**: Check JWT expiration, refresh token validity, API availability  
**Type errors after API changes**: Run `bun generate-types && bun typecheck`  
**Pre-commit failing**: Run `bun lint:fix && bun typecheck` manually  
**401 errors**: Check token in localStorage, auth middleware logs
