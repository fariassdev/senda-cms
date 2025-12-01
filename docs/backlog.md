# Engineering Backlog

This backlog collects cross-cutting or future action items that emerge from reviews and planning.

Routing guidance:

- Use this file for non-urgent optimizations, refactors, or follow-ups that span multiple stories/epics.
- Must-fix items to ship a story belong in that story's `Tasks / Subtasks`.
- Same-epic improvements may also be captured under the epic Tech Spec `Post-Review Follow-ups` section.

| Date       | Story                          | Epic | Type | Severity | Owner | Status | Notes                                                                                                       |
| ---------- | ------------------------------ | ---- | ---- | -------- | ----- | ------ | ----------------------------------------------------------------------------------------------------------- |
| 2025-11-30 | 3-1-display-lesson-list        | 3    | Test | Low      | TBD   | Open   | Add unit tests for StatusBadge component color mapping                                                      |
| 2025-11-30 | 3-1-display-lesson-list        | 3    | Test | Low      | TBD   | Open   | Add unit tests for formatTimestamp utility function                                                         |
| 2025-12-01 | 3-6-realtime-status-indicators | 3    | Test | Medium   | TBD   | Open   | Add unit tests for hasGeneratingLessons helper function [src/containers/Main/CourseDetail/connect.ts:50-54] |
| 2025-12-01 | 3-6-realtime-status-indicators | 3    | Test | Medium   | TBD   | Open   | Add unit tests for status change detection logic [src/containers/Main/CourseDetail/connect.ts:64-89]        |
| 2025-12-01 | 3-6-realtime-status-indicators | 3    | Test | Low      | TBD   | Open   | Add integration test for toast notifications on status changes                                              |
