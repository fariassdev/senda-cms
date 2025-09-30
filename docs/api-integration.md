# API Integration Documentation

## Overview

The Senda CMS uses an **OpenAPI-first architecture** for all API interactions. Instead of manually writing API functions, we auto-generate type-safe React Query hooks from the OpenAPI specification using `openapi-react-query`.

**Key Benefits:**

- 🔒 **Type Safety**: All API calls are fully typed with auto-generated TypeScript interfaces
- ⚡ **Zero Manual Setup**: No need to write custom API functions or manage request/response types
- 🔄 **Always in Sync**: Types automatically update when the backend API changes
- 🎯 **React Query Integration**: Built-in caching, error handling, and optimistic updates

## Architecture Overview

### Auto-Generated Types & Client

```typescript
// Generated from OpenAPI spec at http://localhost:8000/api/openapi.json
import type { paths, components } from '@/types/api';
import { $api } from '@/lib/api';

// Use shorthand imports from models.ts for cleaner code
import type { Course, Lesson, LessonStatus } from '@/types/models';
```

### Type Generation Workflow

```bash
# Regenerate types when backend API changes
bun run generate-types

# This updates src/types/api.d.ts with latest OpenAPI schema
# Run this whenever the backend API specification changes
```

## Data Models Reference

All data models are auto-generated from the OpenAPI specification. For convenient access:

1. **Shorthand Imports**: Use `src/types/models.ts` for cleaner imports
2. **Generated Types**: Check `src/types/api.d.ts` for all current interfaces
3. **OpenAPI Spec**: View live spec at `http://localhost:8000/api/openapi.json`
4. **Type Regeneration**: Run `bun run generate-types` to update types

**Recommended Import Pattern:**

```typescript
// ✅ Use shorthand imports from models.ts
import type {
  Course,
  Lesson,
  LessonStatus,
  ScriptPart,
  User,
} from '@/types/models';

// ✅ Direct import when needed for less common types
import type { components } from '@/types/api';
type LoginResponse = components['schemas']['LoginResponse'];
```

## API Usage Patterns

### Query Operations (Data Fetching)

```typescript
// In containers/[Name]/connect.ts
import { $api } from '@/lib/api';
import type { Course } from '@/types/models';

export default function useConnect() {
  // Auto-generated React Query hooks
  const coursesQuery = $api.useQuery('get', '/api/courses');
  const courseQuery = $api.useQuery('get', '/api/courses/{course_id}', {
    params: { path: { course_id: courseId } },
  });

  // Types are automatically inferred, but can be explicit if needed
  const courses: Course[] = coursesQuery.data || [];

  return {
    courses,
    isLoadingCourses: coursesQuery.isLoading,
    coursesError: coursesQuery.error,
    course: courseQuery.data,
    // All React Query features available: refetch, invalidate, etc.
  };
}
```

### Mutation Operations (Data Updates)

```typescript
// In containers/[Name]/connect.ts
export default function useConnect() {
  const createCourseMutation = $api.useMutation('post', '/api/courses');
  const updateCourseMutation = $api.useMutation(
    'put',
    '/api/courses/{course_id}',
  );
  const generateScriptMutation = $api.useMutation(
    'post',
    '/api/courses/{course_id}/generate-all-scripts',
  );

  const handleCreateCourse = async (prompt: string) => {
    try {
      const result = await createCourseMutation.mutateAsync({
        body: { prompt },
      });
      // Auto-typed result
      console.log('Created course:', result.data);
    } catch (error) {
      // Auto-typed error handling
      console.error('Failed to create course:', error);
    }
  };

  return {
    createCourse: handleCreateCourse,
    isCreating: createCourseMutation.isPending,
    createError: createCourseMutation.error,
  };
}
```

## Error Handling

All API operations include automatic error handling with typed responses:

```typescript
const coursesQuery = $api.useQuery('get', '/api/courses');

if (coursesQuery.error) {
  // Typed error object with proper HTTP status codes
  console.error('API Error:', coursesQuery.error);

  // Handle specific error cases
  if (coursesQuery.error.status === 401) {
    // Unauthorized - handled automatically by auth middleware
  } else if (coursesQuery.error.status === 422) {
    // Validation error - typed validation details
    const validationErrors = coursesQuery.error.data?.detail;
  }
}
```

## Best Practices

### 1. Never Write Manual API Functions

```typescript
// ❌ DON'T: Manual API calls
const fetchCourses = async () => {
  const response = await fetch('/api/courses');
  return response.json();
};

// ✅ DO: Use auto-generated hooks
const coursesQuery = $api.useQuery('get', '/api/courses');
```

### 2. Use Container Pattern for API Logic

```typescript
// ✅ Keep API calls in containers/[Name]/connect.ts
import type { Course } from '@/types/models';

export default function useConnect() {
  const coursesQuery = $api.useQuery('get', '/api/courses');

  // Clean type usage with models.ts imports
  const courses: Course[] = coursesQuery.data || [];

  return { courses };
}
```

### 3. Regenerate Types on API Changes

```typescript
// When backend OpenAPI spec changes:
bun generate-types

// This ensures frontend stays in sync with backend
```

### 4. Leverage React Query Features

```typescript
const coursesQuery = $api.useQuery('get', '/api/courses', {
  staleTime: 5 * 60 * 1000, // 5 minutes
  cacheTime: 10 * 60 * 1000, // 10 minutes
  refetchOnWindowFocus: false,
});

// Invalidate cache after mutations
const queryClient = useQueryClient();
await createCourseMutation.mutateAsync(data);
queryClient.invalidateQueries(['get', '/api/courses']);
```

## Environment Configuration

```bash
# Required environment variables
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
NEXT_PUBLIC_BUILD=development
```

The OpenAPI specification is fetched from `${API_BASE_URL}/api/openapi.json` during type generation.

## Troubleshooting

### Type Generation Issues

```bash
# Ensure backend is running
curl http://localhost:8000/api/openapi.json

# Regenerate types
bun generate-types

# Check for TypeScript errors
bun build
```
