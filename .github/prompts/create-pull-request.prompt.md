---
mode: agent
---

# Goal

Create a pull request on the current branch with a comprehensive description of the changes made, following best practices and providing context for reviewers.

# Workflow

Execute this iterative process:

1. **Analyze**: Review the commits and changes made in the current branch to identify key aspects and improvements. Compare against the ${input:branch} branch to ensure all changes are captured.
2. **Draft**: Use the provided template to draft a detailed pull request description, ensuring clarity and completeness.
3. **Review**: Ensure the description highlights the purpose, changes, and next steps clearly.
4. **Submit**: Create the pull request with the drafted description. Configure the PR to the base following base branch: ${input:branch}. Use the GitKraken MCP tool for this operation.

# Pull Request Title

Use a semantic conventional commit format for the pull request title, capturing the essence of the changes made. For example:

```
feat: implement basic authentication setup (Phase 2.1)
```

# Pull Request Description

Use the template below to create a detailed pull request description for the changes made in this branch. Ensure it highlights the key aspects of the implementation, follows best practices, and provides context for reviewers:

```markdown
## Phase 2.1: Basic Authentication Setup Implementation

This PR implements the first part of the authentication system as outlined in the implementation roadmap. It establishes the foundation for user authentication with proper state management and API integration.

### ✅ Changes Included

#### 🔧 **Dependencies Added**

- **zustand** `5.0.8` - Client state management for authentication
- **@types/jsonwebtoken** `9.0.10` - TypeScript definitions for JWT tokens (dev dependency)
- Updated `package.json` with static version numbers (no `^` notation)

#### 🏪 **Auth Store Implementation**

- **Created `src/stores/authStore.ts`**
  - Complete Zustand store for authentication state management
  - User interface definition with `id`, `email`, and `name` fields
  - Auth actions: `setAuth`, `clearAuth`, `setLoading`, `initializeAuth`
  - localStorage integration for token and user data persistence
  - Proper error handling for corrupted localStorage data
  - Loading states management for auth initialization

#### 🌐 **API Client Implementation**

- **Created `src/lib/api.ts`** - Core API client with:
  - Configurable base URL (uses `NEXT_PUBLIC_API_BASE_URL` environment variable)
  - Custom `ApiError` class for structured error handling
  - Authorization header injection for authenticated requests
  - Comprehensive HTTP methods (GET, POST, PUT, PATCH, DELETE)
  - Proper error handling for 401/403 responses
  - JSON response parsing with error recovery

- **Created `src/lib/authenticatedApi.ts`** - Auth store integration:
  - Automatic token injection from Zustand auth store
  - `withAuthErrorHandling` utility for automatic logout on auth failures
  - Pre-configured authenticated API client instance

### 🎯 **Implementation Highlights**

- **Type Safety**: Full TypeScript support with proper error types
- **Error Handling**: Comprehensive error handling with structured error messages
- **State Management**: Clean separation between client state (Zustand) and server state
- **localStorage**: Robust token persistence with error recovery
- **API Integration**: Ready for Senda API integration with configurable base URL

### 📋 **Roadmap Progress**

- [x] **Phase 1**: Project Foundation ✅
- [x] **Phase 2.1**: Basic Authentication Setup ✅ ← **This PR**
- [ ] **Phase 2.2**: Login Implementation 🎯 Next
- [ ] **Phase 2.3**: Token management system
- [ ] **Phase 2.4**: Route Protection
- [ ] **Phase 3**: Course Listing
- [ ] **Phase 4**: Course Creation

### 🧪 **Testing**

- All files pass ESLint with strict TypeScript rules
- Code formatted with Prettier
- Conventional commits followed with Husky pre-commit hooks

### 🔄 **What's Next**

This PR establishes the authentication foundation. Next up is **Phase 2.2: Login Implementation** which will include:

- shadcn/ui components setup
- Login page with form validation
- API integration for authentication
- Error handling and loading states

---

**Review Focus Areas:**

- Auth store state management logic
- API client error handling patterns
- TypeScript type definitions
- localStorage integration and error recovery
```
