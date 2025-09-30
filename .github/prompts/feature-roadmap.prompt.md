---
mode: agent
---

# Goal

Implement ${input:section} section from the implementation roadmap following incremental development and best practices.

# Context

- **Project roadmap**: Use #file:implementation-roadmap.md for overall guidance about the feature and the current project state
- **Current branch**: Use the active Git branch for all commits
- **Repository tool**: Use GitKraken MCP for all Git operations
- **Commit strategy**: Small, atomic, semantic commits with descriptive messages

# Development Principles

Apply these principles throughout implementation:

- **SOLID principles**: Single responsibility, open/closed, Liskov substitution, interface segregation, dependency inversion
- **Twelve-Factor App**: Config in environment, dependencies explicit, stateless processes, dev/prod parity
- **Best practices**: Clean code, proper error handling, comprehensive testing, clear documentation

# Workflow

Execute this iterative process:

1. **Analyze**: Review the roadmap section and current project state to identify all required changes
2. **Plan**: Break down into minimal, logical units of work (baby steps)
3. **Propose**: For each change unit:
   - Explain what will change and why
   - Show how it follows SOLID and twelve-factor principles
   - Describe impact on current codebase state
   - Wait for confirmation before proceeding
4. **Implement**: Write clean, well-tested code for the approved change
5. **Commit**: Create a semantic commit with descriptive message following conventional commits
6. **Iterate**: Repeat steps 3-5 until section is complete

# Constraints

- No large commits mixing multiple concerns
- Each commit must be independently reviewable
- Code must be production-ready (tested, documented, error-handled)
- Maintain consistency with existing project architecture
- Ask for confirmation before every commit
