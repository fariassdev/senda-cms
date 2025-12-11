---
project_name: 'senda-cms'
user_name: 'farias'
date: '2025-12-04'
sections_completed:
  [
    'technology_stack',
    'language_rules',
    'framework_rules',
    'testing_rules',
    'quality_rules',
    'workflow_rules',
    'anti_patterns',
  ]
status: 'complete'
rule_count: 25
optimized_for_llm: true
---

# Project Context for AI Agents

_This file contains critical rules and patterns that AI agents must follow when implementing code in this project. Focus on unobvious details that agents might otherwise miss._

---

## Technology Stack & Versions

- **Framework:** Next.js 15.5.4 (App Router)
- **Language:** TypeScript 5.x (Strict Mode)
- **Styling:** Tailwind CSS 4.x + shadcn/ui
- **State Management:** React Query 5.x (Server) + Zustand (Auth)
- **API Client:** openapi-fetch + openapi-react-query
- **Runtime:** Bun

## Critical Implementation Rules

### Language-Specific Rules

- **TypeScript:** Strict mode enabled. No `any`. Use `unknown` with narrowing if needed.
- **Imports:** Use `@/` alias for internal imports. Order: React -> 3rd Party -> Internal -> Relative.
- **Async:** Always use `async/await` over `.then()`.

### Framework-Specific Rules

- **Components:**
  - **Reusable:** `src/components/` (Generic logic allowed).
  - **Feature:** `src/containers/` (Business logic).
  - **UI Primitives:** `src/components/ui/` (Pure UI only).
- **Internal Structure:** `index.tsx` (UI) + `connect.ts` (Logic) + `types.ts` + `constants.ts`. Only create if non-empty.
- **Hooks:**
  - `use{Entity}` (Single GET).
  - `use{Entity}s` (List GET).
  - `use{Entity}Actions` (Mutations).

### Testing Rules

- **Location:** Co-located `__tests__` or `.test.tsx` files.
- **Strategy:** Test behavior, not implementation details. Mock API calls using MSW or similar.

### Code Quality & Style Rules

- **Naming:**
  - Components: `PascalCase`
  - Hooks/Functions: `camelCase`
  - API Types: `snake_case` (OpenAPI strict)
- **Linting:** No unused variables. Fix lint errors immediately.

### Development Workflow Rules

- **API Changes:** Never manually type API responses. Regenerate types from OpenAPI spec.
- **State:** Use React Query for server data. Invalidate cache on mutations.

### Critical Don't-Miss Rules

- **Anti-Pattern:** Creating empty `connect.ts` files.
- **Anti-Pattern:** Manually defining types that exist in `src/types/api.d.ts`.
- **Anti-Pattern:** Putting business logic in `src/components/ui`.
- **Edge Case:** Handle 401 errors globally via middleware/interceptors.

---

## Usage Guidelines

**For AI Agents:**

- Read this file before implementing any code
- Follow ALL rules exactly as documented
- When in doubt, prefer the more restrictive option
- Update this file if new patterns emerge

**For Humans:**

- Keep this file lean and focused on agent needs
- Update when technology stack changes
- Review quarterly for outdated rules
- Remove rules that become obvious over time

Last Updated: 2025-12-04
