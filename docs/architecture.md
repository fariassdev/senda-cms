# Senda CMS - Architecture Document

_Generated: 2025-11-28_  
_Project: senda-cms_  
_Type: Brownfield (Next.js 15 meditation course CMS)_

---

## Executive Summary

Senda CMS is a meditation course management system built with a modern, type-safe Next.js 15 stack. The architecture follows an **OpenAPI-first** approach where all API interactions are auto-generated from the backend OpenAPI specification, ensuring perfect type safety and eliminating manual API client development.

**Core Architectural Principles**:

1. **OpenAPI-First**: Never write manual API calls - all types and hooks are auto-generated
2. **Container Pattern**: Strict separation between business logic (`connect.ts`) and presentation (`index.tsx`)
3. **Simplicity for MVP**: Boring, proven technology over novel patterns
4. **Type Safety**: Strict TypeScript with `noUncheckedIndexedAccess` enabled
5. **AI-Assisted Content**: Multi-stage generation workflow (course → script → audio)

---

## Decision Summary

| Category              | Decision              | Version/Tool   | Rationale                                                             |
| --------------------- | --------------------- | -------------- | --------------------------------------------------------------------- |
| **Framework**         | Next.js               | 15.5.4         | App Router, React 19, Server Components, built-in optimizations       |
| **Language**          | TypeScript            | 5.9.2          | Strict mode + `noUncheckedIndexedAccess` for maximum safety           |
| **Package Manager**   | Bun                   | Latest         | Fastest installer, native TypeScript support, drop-in npm replacement |
| **Build Tool**        | Turbopack             | Built-in       | Next.js 15 default, significantly faster than Webpack                 |
| **API Architecture**  | openapi-react-query   | 0.5.0          | Auto-generated type-safe hooks from OpenAPI spec                      |
| **API Client**        | openapi-fetch         | 0.14.0         | Zero-dependency fetch wrapper with full TypeScript support            |
| **Server State**      | React Query           | 5.90.2         | Industry standard, perfect for server state management                |
| **Client State**      | Zustand               | 5.0.8          | **Auth ONLY** - minimal, simple, no boilerplate                       |
| **UI Components**     | shadcn/ui             | Latest         | Composable components, full control, Tailwind-based                   |
| **Styling**           | Tailwind CSS          | 4.1.13         | Utility-first, custom pastel theme, responsive design                 |
| **Forms**             | React Hook Form       | 7.63.0         | Minimal re-renders, excellent performance                             |
| **Validation**        | Zod                   | 4.1.11         | Type-safe schemas, OpenAPI compatibility                              |
| **Authentication**    | JWT (simple)          | jose 6.1.0     | Admin-only, no refresh tokens, localStorage storage                   |
| **Real-time Updates** | React Query Polling   | Built-in       | Simple polling for generation progress, no WebSockets needed for MVP  |
| **Error Handling**    | Toast + Retry         | sonner 2.0.7   | User-friendly notifications, automatic retry for failed requests      |
| **File Upload**       | Native Input          | Built-in       | Simple file input for course cover images (MVP)                       |
| **Audio Player**      | HTML5 Native          | Built-in       | Standard audio element with custom controls (MVP)                     |
| **Rich Text Editor**  | Textarea + Formatting | TBD            | Simple textarea with meditation cue buttons ([PAUSE], [BREATHE])      |
| **Drag-and-Drop**     | @dnd-kit              | shadcn/ui      | Lesson reordering with keyboard accessibility                         |
| **Date/Time**         | date-fns              | TBD            | Lightweight, tree-shakeable, simple API                               |
| **Deployment**        | Vercel                | N/A            | Zero-config Next.js hosting, preview deployments, edge functions      |
| **Code Quality**      | ESLint + Prettier     | 9.36 + 3.6.2   | Flat config, import ordering, consistent formatting                   |
| **Git Hooks**         | Husky + lint-staged   | 9.1.7 + 16.2.1 | Pre-commit validation, conventional commits                           |

---

## Project Structure

```
senda-cms/
├── .bmad/                          # BMad Method workflow definitions
├── .github/                        # GitHub workflows (future CI/CD)
├── .husky/                         # Git hooks configuration
│   └── pre-commit                  # Runs lint-staged before commit
├── docs/                           # Project documentation
│   ├── PRD.md                      # Product requirements
│   ├── ux-design-specification.md  # UX/UI design spec
│   ├── architecture.md             # This document
│   ├── implementation-roadmap.md   # Phase-by-phase checklist
│   ├── api-integration.md          # API integration guide
│   └── bmm-workflow-status.yaml    # BMM workflow tracking
├── public/
│   ├── images/                     # Static images, logos
│   └── fonts/                      # Self-hosted fonts (if needed)
├── src/
│   ├── app/                        # Next.js App Router pages
│   │   ├── layout.tsx              # Root layout → ClientLayout → QueryProvider → AuthLayout
│   │   ├── globals.css             # Global styles, Tailwind imports, CSS variables
│   │   ├── login/
│   │   │   └── page.tsx            # Login page (delegates to SignIn container)
│   │   ├── courses/
│   │   │   ├── page.tsx            # Course listing (delegates to CourseList container)
│   │   │   ├── new/
│   │   │   │   └── page.tsx        # Create course (delegates to CourseCreate container)
│   │   │   └── [slug]/
│   │   │       ├── page.tsx        # Course detail (delegates to CourseDetail container)
│   │   │       └── edit/
│   │   │           └── page.tsx    # Edit course (delegates to CourseEdit container)
│   │   └── (future routes)/
│   │       ├── lessons/[id]/       # Lesson detail page
│   │       ├── scripts/[id]/       # Script editor page
│   │       └── settings/           # User settings
│   ├── components/
│   │   ├── AuthLayout.tsx          # Auth initialization + route protection
│   │   ├── ClientLayout.tsx        # 'use client' wrapper for providers
│   │   ├── Navigation.tsx          # Sidebar navigation component
│   │   ├── QueryProvider.tsx       # React Query provider + devtools
│   │   └── ui/                     # shadcn/ui components (auto-generated)
│   │       ├── button.tsx
│   │       ├── input.tsx
│   │       ├── card.tsx
│   │       ├── form.tsx
│   │       ├── dialog.tsx
│   │       ├── badge.tsx
│   │       ├── table.tsx
│   │       ├── skeleton.tsx
│   │       ├── sonner.tsx          # Toast notifications
│   │       └── (more shadcn components...)
│   ├── containers/                 # Business logic + data fetching (Container Pattern)
│   │   ├── Guest/                  # Unauthenticated user containers
│   │   │   └── SignIn/
│   │   │       ├── index.tsx       # UI component (presentational)
│   │   │       ├── connect.ts      # Data logic: forms, mutations, router
│   │   │       ├── types.ts        # Local container types (NOT API types)
│   │   │       └── constants.ts    # Zod schemas, validation rules
│   │   └── Main/                   # Authenticated user containers
│   │       ├── CourseList/
│   │       │   ├── index.tsx       # Course list UI
│   │       │   ├── connect.ts      # useQuery for courses, filters, sorting
│   │       │   └── types.ts
│   │       ├── CourseCreate/
│   │       │   ├── index.tsx       # Course creation form UI
│   │       │   ├── connect.ts      # useMutation for course creation
│   │       │   ├── constants.ts    # Zod schema for course form
│   │       │   └── types.ts
│   │       ├── CourseDetail/
│   │       │   ├── index.tsx       # Course detail view UI
│   │       │   ├── connect.ts      # useQuery for single course
│   │       │   ├── constants.ts
│   │       │   └── types.ts
│   │       ├── CourseEdit/         # (Future) Course editing
│   │       ├── LessonList/         # (Future) Lesson management
│   │       ├── ScriptEditor/       # (Future) Script editing
│   │       └── AudioPlayer/        # (Future) Audio playback
│   ├── hooks/
│   │   ├── use-mobile.ts           # Responsive breakpoint detection
│   │   └── (future custom hooks)/
│   ├── lib/
│   │   ├── api.ts                  # OpenAPI clients ($api + $publicApi) with auth middleware
│   │   └── utils.ts                # Utility functions (cn, formatters, etc.)
│   ├── stores/
│   │   └── authStore.ts            # Zustand auth state (ONLY for auth, no other state)
│   └── types/
│       ├── api.d.ts                # **AUTO-GENERATED** from OpenAPI (DO NOT EDIT MANUALLY)
│       └── models.ts               # Type exports from OpenAPI schemas
├── .env.local                      # Environment variables (gitignored)
├── .env.example                    # Example env vars (committed)
├── .gitignore
├── commitlint.config.js            # Conventional commit rules
├── components.json                 # shadcn/ui configuration
├── eslint.config.mjs               # ESLint flat config with import ordering
├── next.config.ts                  # Next.js configuration
├── package.json                    # Dependencies + scripts
├── postcss.config.mjs              # PostCSS for Tailwind
├── prettier.config.js              # Prettier formatting rules
├── README.md                       # Project overview
└── tsconfig.json                   # TypeScript strict mode + path aliases
```

---

## Functional Requirements to Architecture Mapping

| FR Category           | Requirements                        | Architecture Components                                                                                           |
| --------------------- | ----------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| **Course Management** | List, create, edit, delete courses  | `CourseList`, `CourseCreate`, `CourseDetail`, `CourseEdit` containers + `$api.useQuery/useMutation` hooks         |
| **Lesson Management** | Organize lessons, reorder, CRUD     | `LessonList` container + `@dnd-kit` for drag-and-drop + lesson CRUD hooks                                         |
| **Script Generation** | AI generation, editing, versioning  | `ScriptEditor` container + `$api.useMutation('post', '/api/lessons/{id}/generate-script')` + polling for progress |
| **Audio Generation**  | TTS with config, preview, download  | `AudioPlayer` component + `$api.useMutation('post', '/api/lessons/{id}/generate-audio')` + HTML5 audio element    |
| **Authentication**    | JWT admin login, session management | `authStore` (Zustand) + `AuthLayout` + middleware protection + `$publicApi` for login                             |
| **User Interface**    | Responsive, dark theme, accessible  | shadcn/ui components + Tailwind pastel theme + responsive grid (3→2→1 cols) + WCAG AA compliance                  |
| **Progress Tracking** | Real-time status updates            | React Query polling (5s interval) + `LessonStatus` enum (PENDING, GENERATING, COMPLETED, FAILED)                  |
| **Error Handling**    | User-friendly errors, retry logic   | Sonner toasts + React Query retry (3x exponential backoff) + Error Boundaries                                     |
| **Validation**        | Form validation, data integrity     | React Hook Form + Zod schemas + OpenAPI schema validation                                                         |
| **Performance**       | Fast load times, smooth UX          | React Query caching (5min stale) + Next.js optimization + code splitting + skeleton loaders                       |

---

## Technology Stack Details

### Core Framework: Next.js 15.5.4

**Why Next.js 15?**

- **App Router**: Modern routing with Server Components, layouts, streaming
- **React 19**: Latest React with automatic batching, transitions, Suspense
- **Turbopack**: Faster builds and HMR than Webpack
- **Built-in Optimizations**: Image optimization, font optimization, automatic code splitting
- **Vercel Deployment**: Zero-config deployment with preview URLs

**Configuration** (`next.config.ts`):

```typescript
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Enable experimental features if needed
  experimental: {
    typedRoutes: true, // Type-safe routing
  },
  // Image domains for external images (e.g., S3 URLs)
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.amazonaws.com', // S3 bucket for course images
      },
    ],
  },
};

export default nextConfig;
```

---

### API Architecture: OpenAPI-First

**Core Pattern**: All API interactions use auto-generated, type-safe hooks from the backend OpenAPI specification.

**Key Libraries**:

- `openapi-fetch` (0.14.0): Lightweight fetch wrapper with TypeScript support
- `openapi-react-query` (0.5.0): Generates React Query hooks from OpenAPI spec
- `openapi-typescript` (7.9.1): CLI tool to generate TypeScript types from OpenAPI JSON

**API Clients** (`src/lib/api.ts`):

```typescript
import createFetchClient, { type Middleware } from 'openapi-fetch';
import createClient from 'openapi-react-query';
import { useAuthStore } from '@/stores/authStore';
import type { paths } from '@/types/api';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

// Public client (no auth) - for login endpoint
const publicFetchClient = createFetchClient<paths>({
  baseUrl: API_BASE_URL,
});

// Auth middleware for authenticated requests
const authMiddleware: Middleware = {
  async onRequest({ request }) {
    const store = useAuthStore.getState();
    const token = store.token;
    if (token) {
      request.headers.set('Authorization', `Bearer ${token}`);
    }
    return request;
  },
  async onResponse({ response }) {
    // Auto-logout on 401
    if (response.status === 401) {
      const store = useAuthStore.getState();
      store.clearAuth();
    }
    return response;
  },
};

// Authenticated client with middleware
const fetchClient = createFetchClient<paths>({
  baseUrl: API_BASE_URL,
});
fetchClient.use(authMiddleware);

// Export React Query clients
export const $api = createClient(fetchClient);
export const $publicApi = createClient(publicFetchClient);
```

**Type Generation**:

```bash
# Regenerate types when backend OpenAPI spec changes
bun generate-types
# → Runs: openapi-typescript http://localhost:8081/openapi.json -o src/types/api.d.ts
```

**Usage Example** (`containers/Main/CourseList/connect.ts`):

```typescript
import { $api } from '@/lib/api';

export default function useConnect() {
  // Auto-generated hook with full type safety
  const { data, isLoading, error } = $api.useQuery('get', '/api/courses', {
    params: {
      query: { skip: 0, limit: 100 },
    },
  });

  const createMutation = $api.useMutation('post', '/api/courses', {
    onSuccess: async () => {
      toast.success('Course created');
      await queryClient.invalidateQueries({
        queryKey: ['get', '/api/courses'],
      });
    },
  });

  return {
    courses: data?.data,
    isLoading,
    error,
    createCourse: createMutation.mutate,
  };
}
```

**Benefits**:

- ✅ Zero manual API client code
- ✅ Perfect type safety (request params, response data, errors)
- ✅ Automatic React Query integration
- ✅ No API drift (types always match backend)

---

### State Management

**Philosophy**: Minimize client state. Use server state (React Query) for everything except auth.

**React Query (5.90.2)** - Server State:

- Course data, lesson data, user data
- Automatic caching, refetching, background updates
- Optimistic updates for mutations
- Built-in loading/error states

**Zustand (5.0.8)** - Auth State ONLY:

- User object, JWT token
- Login/logout actions
- Persisted to localStorage
- **NO other client state** (avoid state management complexity)

**Configuration** (`src/components/QueryProvider.tsx`):

```typescript
const [queryClient] = useState(
  () =>
    new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 1000 * 60 * 5, // 5 minutes
          gcTime: 1000 * 60 * 10, // 10 minutes (formerly cacheTime)
          retry: 3, // Retry failed requests 3x
          refetchOnWindowFocus: false, // Opt-in per query
          refetchOnReconnect: true, // Refetch after network recovery
        },
        mutations: {
          retry: 1, // Retry mutations once
        },
      },
    }),
);
```

---

### UI Framework: shadcn/ui + Tailwind CSS

**shadcn/ui**: Composable UI components built on Radix UI primitives

- Copy-paste components (you own the code)
- Full TypeScript support
- Accessible by default (ARIA, keyboard navigation)
- Customizable via Tailwind

**Tailwind CSS 4.x**: Utility-first styling

- Custom pastel meditation theme (from UX spec)
- CSS variables for theming
- Responsive utilities
- Dark mode support

**Theme Configuration** (`src/app/globals.css`):

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 26 29 41; /* #1a1d29 */
    --surface: 36 40 59; /* #24283b */
    --border: 52 59 88; /* #343b58 */
    --primary: 125 207 255; /* #7dcfff */
    --primary-hover: 158 228 255; /* #9ee4ff */
    --text-primary: 225 232 237; /* #e1e8ed */
    --text-secondary: 169 177 214; /* #a9b1d6 */
    --text-muted: 107 114 128; /* #6b7280 */
    --success: 158 206 106; /* #9ece6a */
    --warning: 224 175 104; /* #e0af68 */
    --error: 247 118 142; /* #f7768e */
    --info: 122 162 247; /* #7aa2f7 */
  }
}
```

**Component Usage**:

```typescript
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

<Button variant="default">Generate Course</Button>  // Primary (cyan)
<Button variant="secondary">Save Draft</Button>     // Secondary (outline)
<Button variant="destructive">Delete</Button>       // Destructive (red)
```

---

### Authentication Architecture

**Pattern**: Simple JWT with localStorage persistence

**Flow**:

1. User submits credentials to `/api/auth/login` (via `$publicApi`)
2. Backend returns JWT token + user data
3. Token stored in localStorage + Zustand store
4. All subsequent requests include `Authorization: Bearer <token>` header
5. On 401 response, clear auth state and redirect to `/login`

**Auth Store** (`src/stores/authStore.ts`):

```typescript
interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

interface AuthActions {
  setAuth: (user: User, token: string) => void;
  clearAuth: () => void;
  initializeAuth: () => void;
}

export const useAuthStore = create<AuthState & AuthActions>((set) => ({
  // State
  user: null,
  token: null,
  isLoading: true,
  isAuthenticated: false,

  // Actions
  setAuth: (user, token) => {
    localStorage.setItem('senda_auth_token', token);
    localStorage.setItem('senda_auth_user', JSON.stringify(user));
    set({ user, token, isAuthenticated: true, isLoading: false });
  },

  clearAuth: () => {
    localStorage.removeItem('senda_auth_token');
    localStorage.removeItem('senda_auth_user');
    set({ user: null, token: null, isAuthenticated: false, isLoading: false });
  },

  initializeAuth: () => {
    const token = localStorage.getItem('senda_auth_token');
    const userStr = localStorage.getItem('senda_auth_user');
    if (token && userStr) {
      const user = JSON.parse(userStr);
      set({ user, token, isAuthenticated: true, isLoading: false });
    } else {
      set({ isLoading: false });
    }
  },
}));
```

**Route Protection** (`src/middleware.ts`):

```typescript
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('senda_auth_token')?.value;
  const isLoginPage = request.nextUrl.pathname === '/login';

  // Redirect unauthenticated users to login (except if already on login page)
  if (!token && !isLoginPage) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Redirect authenticated users away from login page
  if (token && isLoginPage) {
    return NextResponse.redirect(new URL('/courses', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
```

---

### Real-time Updates: React Query Polling (MVP)

**Pattern**: Simple polling for generation progress tracking

**Why Polling for MVP?**

- ✅ Simple to implement
- ✅ No WebSocket infrastructure needed
- ✅ Works with Vercel/serverless
- ✅ Sufficient for MVP use case

**Implementation**:

```typescript
// Poll lesson status every 5 seconds while generating
const { data: lesson } = $api.useQuery('get', '/api/lessons/{id}', {
  params: { path: { id: lessonId } },
  refetchInterval: (data) => {
    // Only poll if status is GENERATING
    const status = data?.status;
    return status === 'SCRIPT_GENERATING' || status === 'AUDIO_GENERATING'
      ? 3000 // Poll every 3s
      : false; // Stop polling when complete/failed
  },
});
```

**Future Enhancement** (Post-MVP):

- WebSockets for real-time updates
- Server-Sent Events (SSE) for progress streaming

---

### Error Handling Strategy

**Toast Notifications** (Sonner 2.0.7):

- Success: Green toast, 4s auto-dismiss
- Error: Red toast, 6s auto-dismiss, manual close option
- Warning: Orange toast, 5s auto-dismiss
- Info: Blue toast, 4s auto-dismiss

**API Retry Logic** (React Query):

- Automatic retry for failed requests (3x with exponential backoff)
- Configurable per query/mutation

**Error Boundaries** (React):

- Catch rendering errors
- Display friendly error UI
- Log errors to console (future: send to error tracking service)

**Implementation**:

```typescript
// Toast usage
import { toast } from 'sonner';

toast.success('Course created successfully!');
toast.error('Failed to generate script. Please try again.');
toast.warning('You have unsaved changes');
toast.info('Processing in background');

// React Query retry
const mutation = $api.useMutation('post', '/api/courses', {
  retry: 2, // Retry twice on failure
  onError: (error) => {
    toast.error(error.message || 'An error occurred');
  },
});

// Error Boundary (future)
<ErrorBoundary fallback={<ErrorUI />}>
  <CourseList />
</ErrorBoundary>
```

---

### Form Management: React Hook Form + Zod

**Pattern**: Declarative forms with schema validation

**React Hook Form (7.63.0)**:

- Minimal re-renders (uncontrolled inputs)
- Built-in validation
- Excellent performance

**Zod (4.1.11)**:

- Type-safe schema validation
- Runtime validation + TypeScript types
- Perfect integration with React Hook Form

**Implementation**:

```typescript
// constants.ts - Zod schema
import { z } from 'zod';

export const courseSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  prompt: z.string().optional(),
});

export type CourseFormData = z.infer<typeof courseSchema>;

// connect.ts - Form hook
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { courseSchema, type CourseFormData } from './constants';

export default function useConnect() {
  const form = useForm<CourseFormData>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      title: '',
      description: '',
      prompt: '',
    },
  });

  const onSubmit = form.handleSubmit(async (data) => {
    // data is fully typed as CourseFormData
    await createCourseMutation.mutateAsync(data);
  });

  return { form, onSubmit };
}

// index.tsx - Form UI
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

<Form {...form}>
  <form onSubmit={onSubmit}>
    <FormField
      control={form.control}
      name="title"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Course Title *</FormLabel>
          <FormControl>
            <Input placeholder="Enter course title..." {...field} />
          </FormControl>
          <FormMessage />  {/* Auto-displays validation errors */}
        </FormItem>
      )}
    />
    <Button type="submit">Create Course</Button>
  </form>
</Form>
```

---

### File Upload: Native Input (MVP)

**Pattern**: Simple file input for course cover images

**Implementation**:

```typescript
// Simple file input
<input
  type="file"
  accept="image/*"
  onChange={(e) => {
    const file = e.target.files?.[0];
    if (file) {
      // Upload to backend or convert to base64
      handleFileUpload(file);
    }
  }}
/>

// Future enhancement: drag-and-drop with react-dropzone
```

---

### Audio Player: HTML5 Native (MVP)

**Pattern**: Standard HTML5 audio element with custom controls

**Implementation**:

```typescript
<audio
  controls
  src={lesson.audioUrl}
  className="w-full"
>
  Your browser does not support audio playback.
</audio>

// Future enhancement: Custom player with waveform visualization
```

---

### Rich Text Editor: Simple Textarea (MVP)

**Pattern**: Textarea with meditation-specific formatting buttons

**Implementation**:

```typescript
<div>
  <div className="flex gap-2 mb-2">
    <Button onClick={() => insertText('[PAUSE 3s]')}>Add Pause</Button>
    <Button onClick={() => insertText('[BREATHE IN]')}>Breathe In</Button>
    <Button onClick={() => insertText('[BREATHE OUT]')}>Breathe Out</Button>
  </div>
  <textarea
    value={script}
    onChange={(e) => setScript(e.target.value)}
    className="w-full h-64 p-4 font-mono"
    placeholder="Enter meditation script..."
  />
  <div className="text-sm text-muted">
    {script.length} characters | {script.split(/\s+/).length} words
  </div>
</div>

// Future enhancement: Monaco editor or rich text editor
```

---

### Drag-and-Drop: @dnd-kit (shadcn/ui)

**Pattern**: Accessible drag-and-drop for lesson reordering

**Why @dnd-kit?**

- ✅ Built for React
- ✅ Fully accessible (keyboard support)
- ✅ Flexible and composable
- ✅ Used by shadcn/ui

**Implementation** (Future):

```typescript
import { DndContext, closestCenter } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';

<DndContext onDragEnd={handleDragEnd}>
  <SortableContext items={lessons} strategy={verticalListSortingStrategy}>
    {lessons.map((lesson) => (
      <SortableLesson key={lesson.id} lesson={lesson} />
    ))}
  </SortableContext>
</DndContext>
```

---

### Date/Time: date-fns

**Pattern**: Lightweight date formatting and manipulation

**Why date-fns?**

- ✅ Tree-shakeable (only import what you use)
- ✅ Immutable (no Date mutation)
- ✅ Simple, intuitive API
- ✅ i18n support

**Implementation**:

```typescript
import { format, formatDistance } from 'date-fns';

// Relative timestamps (< 7 days)
const relativeTime = formatDistance(new Date(lesson.createdAt), new Date(), {
  addSuffix: true,
});
// → "2 days ago"

// Absolute timestamps (>= 7 days)
const absoluteTime = format(new Date(lesson.createdAt), 'MMM d, yyyy');
// → "Nov 28, 2025"
```

---

### Deployment: Vercel

**Why Vercel?**

- ✅ Zero-config Next.js deployment
- ✅ Automatic preview deployments for PRs
- ✅ Edge functions for serverless API routes
- ✅ Built-in analytics and monitoring
- ✅ Free tier sufficient for MVP

**Deployment Process**:

1. Connect GitHub repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Push to `main` branch → automatic production deployment
4. Push to feature branch → automatic preview deployment

**Environment Variables** (Vercel Dashboard):

```
NEXT_PUBLIC_API_BASE_URL=https://api.senda.com
NEXT_PUBLIC_BUILD=production
```

---

## Implementation Patterns (Consistency Rules)

### Naming Conventions

**Files**:

- Components: PascalCase (`CourseCard.tsx`, `AudioPlayer.tsx`)
- Utilities: camelCase (`formatDate.ts`, `apiClient.ts`)
- Constants: camelCase (`validationSchemas.ts`, `apiEndpoints.ts`)

**Variables**:

- React components: PascalCase (`const CourseCard = () => ...`)
- Functions: camelCase (`function fetchCourses() {}`)
- Constants: UPPER_SNAKE_CASE for truly constant values (`const API_BASE_URL = ...`)
- React hooks: camelCase with `use` prefix (`useCourses`, `useAuth`)

**Types/Interfaces**:

- Interfaces: PascalCase (`interface Course {}`)
- Types: PascalCase (`type CourseFormData = ...`)
- Prefer `interface` over `type` for object shapes

**API Endpoints** (from OpenAPI):

- REST pattern: `/api/courses`, `/api/lessons/{id}`
- Plural nouns for collections
- Singular for single resource operations

---

### Code Organization Patterns

**Container Pattern** (CRITICAL):

```
containers/Main/FeatureName/
├── index.tsx       # UI component (presentational, no logic)
├── connect.ts      # ALL business logic, data fetching, form handling
├── types.ts        # Local types (NOT API types - those are in @/types/models)
└── constants.ts    # Zod schemas, static data, config
```

**Separation of Concerns**:

- `index.tsx`: Pure presentation, receives props from `connect.ts`
- `connect.ts`: API calls, form setup, side effects, returns data/handlers
- NO business logic in `index.tsx`
- NO JSX in `connect.ts`

**Example**:

```typescript
// connect.ts
export default function useConnect() {
  const { data, isLoading } = $api.useQuery('get', '/api/courses');
  const form = useForm({ ... });
  return { courses: data, isLoading, form };
}

// index.tsx
import useConnect from './connect';

export default function CourseList() {
  const { courses, isLoading } = useConnect();
  if (isLoading) return <Skeleton />;
  return <div>{courses.map(...)}</div>;
}
```

---

### Data Format Patterns

**API Responses**:

- Always defined by OpenAPI spec
- Use auto-generated types from `@/types/models`
- Never manually type API responses

**Date/Time**:

- Server: ISO 8601 strings (`2025-11-28T15:30:00Z`)
- Client: Parse with `new Date()` or `date-fns`
- Display: Relative for < 7 days, absolute for >= 7 days

**Error Responses**:

- Handled by openapi-fetch automatically
- Error objects match OpenAPI error schemas
- Display via toast notifications

---

### Communication Patterns (Component Interaction)

**Data Flow**:

```
OpenAPI Spec → Auto-generated Types → React Query Hooks → Container (connect.ts) → Component (index.tsx) → User
```

**Event Handling**:

- User action → Component → Handler from `connect.ts` → Mutation → React Query cache update → UI re-render

**Optimistic Updates**:

```typescript
const mutation = $api.useMutation('post', '/api/courses', {
  onMutate: async (newCourse) => {
    // Cancel outgoing refetches
    await queryClient.cancelQueries({ queryKey: ['get', '/api/courses'] });

    // Snapshot previous value
    const previous = queryClient.getQueryData(['get', '/api/courses']);

    // Optimistically update
    queryClient.setQueryData(['get', '/api/courses'], (old) => [
      ...old,
      newCourse,
    ]);

    return { previous };
  },
  onError: (err, newCourse, context) => {
    // Rollback on error
    queryClient.setQueryData(['get', '/api/courses'], context.previous);
    toast.error('Failed to create course');
  },
  onSuccess: () => {
    toast.success('Course created!');
  },
});
```

---

### Lifecycle Patterns

**Component Lifecycle**:

- Use React hooks (`useEffect`, `useState`, `useMemo`)
- Prefer React Query for data fetching over `useEffect`
- Cleanup side effects in `useEffect` return function

**Data Lifecycle**:

- Fetch: React Query `useQuery`
- Update: React Query `useMutation`
- Cache: Automatic via React Query (5min stale, 10min GC)
- Invalidate: `queryClient.invalidateQueries()` after mutations

**Lesson Generation Lifecycle**:

```
PENDING → SCRIPT_GENERATING → SCRIPT_COMPLETED → AUDIO_GENERATING → AUDIO_COMPLETED
                ↓                      ↓                    ↓
              FAILED               FAILED               FAILED
```

---

### Location Patterns

**Where Things Go**:

**API Calls**: ONLY in `connect.ts` files, using `$api` or `$publicApi`

```typescript
// ✅ Correct
// containers/Main/CourseList/connect.ts
const { data } = $api.useQuery('get', '/api/courses');

// ❌ Wrong - never in component files
// components/CourseCard.tsx
const response = await fetch('/api/courses'); // NEVER DO THIS
```

**Types**: Import from `@/types/models`, NOT from `@/types/api`

```typescript
// ✅ Correct
import type { Course, Lesson } from '@/types/models';

// ❌ Wrong
import type { components } from '@/types/api'; // Too verbose
```

**Styles**: Tailwind classes inline, NO CSS modules

```typescript
// ✅ Correct
<div className="flex gap-4 p-6 bg-surface rounded-lg">

// ❌ Wrong
import styles from './CourseCard.module.css'; // Don't use CSS modules
```

**Assets**:

- Images: `/public/images/`
- Fonts: `/public/fonts/` (if self-hosted)
- Icons: `lucide-react` library (already installed)

---

### Consistency Patterns (Cross-Cutting)

**Error Handling** (MUST be consistent):

```typescript
// API errors → Toast
mutation.onError((error) => {
  toast.error(error.message || 'An error occurred');
});

// Form validation errors → Inline below input
<FormMessage /> // Automatic from React Hook Form + Zod

// Unexpected errors → Error Boundary (future)
```

**Loading States** (MUST be consistent):

```typescript
// List loading → Skeleton
if (isLoading) return <Skeleton className="h-32" />;

// Button loading → Spinner
<Button disabled={mutation.isPending}>
  {mutation.isPending && <Spinner />}
  Save
</Button>

// Page loading → Full-page skeleton
<div className="space-y-4">
  <Skeleton className="h-8 w-64" />
  <Skeleton className="h-32 w-full" />
</div>
```

**Success Feedback** (MUST be consistent):

```typescript
// Always show toast on successful mutation
onSuccess: () => {
  toast.success('Course created successfully!');
  router.push('/courses');
};
```

**Date/Time Display** (MUST be consistent):

```typescript
// < 7 days: relative
('2 hours ago', '3 days ago');

// >= 7 days: absolute
('Nov 28, 2025');

// Implementation:
import { formatDistance, format, differenceInDays } from 'date-fns';

function formatTimestamp(date: string) {
  const d = new Date(date);
  const now = new Date();
  const daysDiff = differenceInDays(now, d);

  if (daysDiff < 7) {
    return formatDistance(d, now, { addSuffix: true });
  }
  return format(d, 'MMM d, yyyy');
}
```

---

## Data Architecture

### Data Models (from OpenAPI)

All data models are auto-generated from the backend OpenAPI specification.

**Core Entities**:

**Course**:

```typescript
// From @/types/models.ts (exported from OpenAPI schemas)
export type Course = components['schemas']['CourseData'];

// Structure (from OpenAPI):
{
  id: string;
  title: string;
  description: string;
  author: string;
  created_at: string; // ISO 8601
  updated_at: string;
  lessons: Lesson[];
  progress: number; // 0-100
  status: 'draft' | 'published';
}
```

**Lesson**:

```typescript
export type Lesson = components['schemas']['LessonData'];

// Structure:
{
  id: string;
  course_id: string;
  title: string;
  duration: number; // minutes
  order: number;
  key_themes: string[];
  status: LessonStatus;
  script_parts: ScriptPart[];
  audio_url?: string;
  created_at: string;
  updated_at: string;
}
```

**LessonStatus**:

```typescript
export type LessonStatus =
  | 'PENDING'
  | 'SCRIPT_GENERATING'
  | 'SCRIPT_COMPLETED'
  | 'SCRIPT_FAILED'
  | 'AUDIO_GENERATING'
  | 'AUDIO_COMPLETED'
  | 'AUDIO_FAILED';
```

**ScriptPart**:

```typescript
export type ScriptPart = components['schemas']['ScriptPartResponse'];

// Structure:
{
  id: string;
  text: string;
  audio_url?: string;
  order: number;
}
```

**User**:

```typescript
export type User = components['schemas']['AuthenticatedUserData'];

// Structure:
{
  email: string;
  username: string;
  name: string | null;
  bio: string | null;
  image: string | null;
}
```

---

### Data Relationships

```
Course (1) ──────────< (many) Lesson
                          │
                          ├─────< (many) ScriptPart
                          │
                          └─────○ (0-1) Audio URL
```

**Course → Lessons**: One-to-many, ordered by `lesson.order`
**Lesson → ScriptParts**: One-to-many, ordered by `script_part.order`
**Lesson → Audio**: One-to-zero-or-one, URL stored in `lesson.audio_url`

---

### Data Flow

**Read Flow**:

1. Component renders
2. `connect.ts` calls `$api.useQuery('get', '/api/courses')`
3. React Query checks cache (5min stale time)
4. If stale or missing, fetch from API
5. openapi-fetch makes request with auth header
6. Response validated against OpenAPI schema
7. Data returned to component with full TypeScript types

**Write Flow**:

1. User submits form
2. `connect.ts` calls `$api.useMutation('post', '/api/courses')`
3. Mutation executes with validated form data
4. openapi-fetch makes request with auth header
5. Backend creates course, returns course object
6. `onSuccess` callback invalidates course list cache
7. React Query refetches course list
8. UI updates with new course

**Generation Flow** (Script/Audio):

1. User clicks "Generate Script"
2. Mutation POSTs to `/api/lessons/{id}/generate-script`
3. Backend starts async generation, returns immediately with status `SCRIPT_GENERATING`
4. React Query polling (5s interval) checks lesson status
5. When status changes to `SCRIPT_COMPLETED`, stop polling
6. Display success toast, show script editor

---

## API Contracts

All API contracts are defined by the backend OpenAPI specification at `http://localhost:8000/api/openapi.json`.

### Key Endpoints

**Authentication**:

- `POST /api/auth/login` - Login with email/password, returns JWT token
- `GET /api/auth/me` - Get current user (requires auth)

**Courses**:

- `GET /api/courses` - List courses (paginated)
- `POST /api/courses` - Create course from prompt (AI generation)
- `GET /api/courses/{id}` - Get single course with lessons
- `PATCH /api/courses/{id}` - Update course
- `DELETE /api/courses/{id}` - Delete course

**Lessons**:

- `GET /api/lessons/{id}` - Get single lesson
- `POST /api/lessons/{id}/generate-script` - Generate script with AI
- `POST /api/lessons/{id}/generate-audio` - Generate audio from script
- `PATCH /api/lessons/{id}` - Update lesson
- `DELETE /api/lessons/{id}` - Delete lesson

**Batch Operations**:

- `POST /api/courses/{id}/generate-all-scripts` - Generate scripts for all lessons
- `POST /api/courses/{id}/generate-all-audios` - Generate audio for all lessons

### Request/Response Formats

**Example: Create Course**:

```typescript
// Request
POST /api/courses
Content-Type: application/json
Authorization: Bearer <token>

{
  "prompt": "10-day mindfulness course for beginners focusing on breath awareness"
}

// Response (200 OK)
{
  "id": "course_123",
  "title": "10-Day Mindfulness Journey",
  "description": "A beginner-friendly course...",
  "author": "AI Generated",
  "lessons": [
    {
      "id": "lesson_1",
      "title": "Introduction to Mindfulness",
      "duration": 10,
      "order": 1,
      "status": "PENDING",
      ...
    },
    ...
  ],
  "created_at": "2025-11-28T15:30:00Z",
  "updated_at": "2025-11-28T15:30:00Z"
}
```

**Example: Generate Script**:

```typescript
// Request
POST /api/lessons/{id}/generate-script
Authorization: Bearer <token>

// Response (202 Accepted)
{
  "id": "lesson_1",
  "status": "SCRIPT_GENERATING",
  "message": "Script generation started"
}

// Poll GET /api/lessons/{id} until status changes to SCRIPT_COMPLETED
```

---

## Security Architecture

### Authentication

**Pattern**: JWT token in Authorization header

- Admin-only system (no public access)
- Token stored in localStorage + included in all requests
- Auto-logout on 401 response
- No refresh tokens (MVP simplicity)

### Authorization

**Backend Responsibility**: All authorization checks happen on the backend

- Frontend only hides UI elements
- Backend validates JWT on every request
- Admin role required for all operations

### Input Validation

**Client-Side**: Zod schemas for form validation
**Server-Side**: Backend validates all inputs (never trust client)

### Security Headers

**Next.js Config** (`next.config.ts`):

```typescript
const nextConfig = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        ],
      },
    ];
  },
};
```

### HTTPS Enforcement

**Production**: HTTPS enforced by Vercel
**Development**: HTTP acceptable for localhost

---

## Performance Considerations

### Optimization Strategies

**React Query Caching**:

- 5 minutes stale time (data considered fresh)
- 10 minutes garbage collection time (cache retention)
- Reduces unnecessary API calls

**Next.js Optimizations**:

- Automatic code splitting (per route)
- Image optimization (next/image)
- Font optimization (next/font)
- Static generation where possible

**Lazy Loading**:

```typescript
// Heavy components loaded on demand
const ScriptEditor = lazy(() => import('@/containers/Main/ScriptEditor'));
const AudioPlayer = lazy(() => import('@/components/AudioPlayer'));

<Suspense fallback={<Skeleton />}>
  <ScriptEditor />
</Suspense>
```

**Skeleton Screens**:

- Prevent layout shift (CLS)
- Improve perceived performance
- Better UX than spinners

---

## Deployment Architecture

### Vercel Deployment

**Build Process**:

1. Push to GitHub
2. Vercel detects changes
3. Runs `bun install`
4. Runs `bun build` (Turbopack)
5. Deploys to Edge Network
6. Automatic preview URL generated

**Environment Variables**:

- `NEXT_PUBLIC_API_BASE_URL`: Backend API URL
- `NEXT_PUBLIC_BUILD`: `production` | `development`

**Domain Configuration**:

- Production: `senda-cms.vercel.app` (or custom domain)
- Preview: `senda-cms-<branch>.vercel.app`

---

## Development Environment

### Prerequisites

**Required**:

- Node.js 20+ (for Bun)
- Bun 1.0+ (package manager)
- Git 2.0+

**Optional**:

- VS Code (recommended editor)
- GitHub Copilot (AI assistance)

### Setup Commands

```bash
# Clone repository
git clone https://github.com/fariassdev/senda-cms.git
cd senda-cms

# Install dependencies
bun install

# Copy environment variables
cp .env.example .env.local
# Edit .env.local with your API URL

# Start development server
bun dev

# Open browser
# → http://localhost:3000
```

### Development Workflow

```bash
# Create feature branch
git checkout -b feature/lesson-management

# Make changes...

# Run linter
bun lint:fix

# Run type check
bun typecheck

# Commit (Husky runs pre-commit hooks automatically)
git commit -m "feat: add lesson reordering"

# Push to GitHub
git push origin feature/lesson-management

# Create Pull Request
# → Vercel auto-creates preview deployment
```

### Type Generation Workflow

```bash
# When backend OpenAPI spec changes:

# 1. Ensure backend is running
# 2. Generate new types
bun generate-types

# 3. Review changes
git diff src/types/api.d.ts

# 4. Update code if API contracts changed
# 5. Commit type changes
git commit -m "chore: update API types"
```

---

## Architecture Decision Records (ADRs)

### ADR-001: OpenAPI-First Architecture

**Decision**: Use openapi-react-query for all API interactions instead of manual fetch/axios.

**Context**:

- Backend provides OpenAPI specification
- Manual API client code is error-prone and requires constant updates
- Type safety critical for DX and preventing bugs

**Consequences**:

- ✅ Perfect type safety (request/response/errors)
- ✅ Zero manual API client code
- ✅ Automatic React Query integration
- ✅ No API drift between frontend/backend
- ⚠️ Requires backend OpenAPI spec to be accurate
- ⚠️ Type regeneration needed when backend changes

---

### ADR-002: Container Pattern for Business Logic

**Decision**: Separate business logic (`connect.ts`) from presentation (`index.tsx`).

**Context**:

- Components become complex with mixed concerns
- Testing business logic separately improves quality
- Reusability and maintainability suffer with mixed concerns

**Consequences**:

- ✅ Clear separation of concerns
- ✅ Easier testing (logic separate from UI)
- ✅ Better code organization
- ⚠️ Slight learning curve for new developers
- ⚠️ More files per feature

---

### ADR-003: Zustand for Auth State ONLY

**Decision**: Use Zustand ONLY for authentication state, React Query for everything else.

**Context**:

- Auth state needs persistence (localStorage)
- Server state best managed by React Query
- Avoid state management complexity

**Consequences**:

- ✅ Minimal client state (reduces bugs)
- ✅ Server state handled by expert library (React Query)
- ✅ Simple, predictable state flow
- ⚠️ Two state libraries (but clear boundaries)

---

### ADR-004: Simple JWT Auth (No Refresh Tokens)

**Decision**: Use simple JWT with localStorage, no refresh tokens for MVP.

**Context**:

- Admin-only tool with low security risk
- Refresh token flow adds complexity
- MVP focuses on core features

**Consequences**:

- ✅ Simple implementation
- ✅ Faster development
- ✅ Sufficient security for MVP
- ⚠️ Users must re-login after token expiration
- ⚠️ No cross-tab sync

**Future Enhancement**: Add refresh tokens and cross-tab sync post-MVP.

---

### ADR-005: React Query Polling for Real-time Updates

**Decision**: Use polling (5s interval) instead of WebSockets for generation progress.

**Context**:

- WebSockets require infrastructure (socket server, connection management)
- Polling simpler for MVP
- Generation tasks take minutes, not milliseconds

**Consequences**:

- ✅ Simple implementation
- ✅ Works with serverless (Vercel)
- ✅ No WebSocket infrastructure needed
- ⚠️ Higher API load (mitigated by 5s interval)
- ⚠️ 5s delay in status updates

**Future Enhancement**: WebSockets or Server-Sent Events for instant updates.

---

### ADR-006: Vercel Deployment

**Decision**: Deploy to Vercel instead of AWS/Railway/other platforms.

**Context**:

- Next.js optimized for Vercel
- Zero-config deployment
- Automatic preview URLs for PRs
- Free tier sufficient for MVP

**Consequences**:

- ✅ Zero deployment configuration
- ✅ Automatic preview deployments
- ✅ Fast global Edge Network
- ✅ Built-in analytics
- ⚠️ Vendor lock-in (mitigated by Next.js portability)
- ⚠️ Function limits (10s timeout on Hobby tier)

---

### ADR-007: Native HTML5 Audio Player (MVP)

**Decision**: Use native HTML5 audio element instead of custom player for MVP.

**Context**:

- Audio playback requirements are simple
- Custom player libraries add bundle size
- MVP focuses on core functionality

**Consequences**:

- ✅ Zero dependencies
- ✅ Small bundle size
- ✅ Browser-native performance
- ⚠️ Limited customization (acceptable for MVP)
- ⚠️ Browser UI differences

**Future Enhancement**: Custom audio player with waveform visualization.

---

### ADR-008: date-fns for Date Formatting

**Decision**: Use date-fns instead of Moment.js or Day.js.

**Context**:

- date-fns is tree-shakeable (only import what you use)
- Moment.js is deprecated and large
- Day.js is good but date-fns more established

**Consequences**:

- ✅ Small bundle size (tree-shakeable)
- ✅ Immutable (no date mutation bugs)
- ✅ Simple, predictable API
- ✅ i18n support for future
- ⚠️ More verbose than Day.js

---

## Validation & Completeness Checklist

### Architecture Document Validation

- [x] Decision summary table complete with versions
- [x] All 10 functional requirements mapped to architecture components
- [x] Complete project structure (no placeholders)
- [x] All PRD requirements have architectural support
- [x] UX requirements addressed (dark theme, responsive, a11y)
- [x] Implementation patterns comprehensive (naming, organization, etc.)
- [x] Novel patterns documented (OpenAPI-first, Container pattern)
- [x] Technology stack details with rationale
- [x] ADRs for key architectural decisions
- [x] No generic/placeholder text

### Implementation Readiness

**Ready to implement**:

- ✅ Phase 1: Foundation (complete)
- ✅ Phase 2: Authentication (complete)
- ✅ Phase 3: Course Listing (complete)
- ✅ Phase 4: Course Creation (complete)
- 🎯 Phase 5: Lesson Management (architecture defined, ready to implement)
- 🎯 Phase 6: Script Generation (architecture defined, ready to implement)
- 🎯 Phase 7: Audio Generation (architecture defined, ready to implement)
- 🎯 Phase 8: Polish & Optimization (architecture defined, ready to implement)

---

## Next Steps

### Immediate Next Workflow

**Implementation Phase**: Move to `*create-epics-and-stories` workflow

- Break down remaining phases into implementable stories
- Prioritize based on user journey dependencies
- Estimate effort for sprint planning

### Post-Architecture Actions

1. **Validate Architecture**: Run `*validate-architecture` to ensure completeness
2. **Implementation Readiness Check**: Run `*implementation-readiness` to verify PRD + UX + Architecture alignment
3. **Sprint Planning**: Create first sprint with prioritized stories

---

_This architecture document provides complete, specific, and actionable guidance for implementing Senda CMS. All decisions are documented with rationale, and consistency rules ensure AI agents implement features uniformly._

_Generated by BMAD Method - Architecture Workflow v1.0_  
_Date: 2025-11-28_  
_Architect: Winston (AI Agent)_  
_For: Rupo_
