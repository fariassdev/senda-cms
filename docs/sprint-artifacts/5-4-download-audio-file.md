# Story 5.4: Download Audio File

Status: Done

## Story

As a **Content Manager**,
I want **to download the generated audio**,
so that **I can use it in other platforms or for distribution**.

## Acceptance Criteria

1. **Given** a lesson has completed audio and the Audio Player is active (or about to play)
   **When** I click the "Download" button (icon: `Download`) in the Audio Player controls
   **Then** the audio file downloads to my device
   **And** the filename follows the format: `{lesson-order}_{lesson-title}.mp3` (sanitized)

2. **Given** the download is initiated
   **Then** it starts immediately (no page navigation)
   **And** the button shows a loading state (e.g., spinner or disabled) if fetching is required

3. **Given** the download fails (e.g., network error or CORS issue)
   **Then** I see a toast error: "Download failed. Please try again."
   **And** the loading state is cleared

## Tasks / Subtasks

- [x] **Task 1: Shared Utility** (AC: #1)
  - [x] 1.1 Update `src/lib/utils.ts` to include a `sanitizeFilename(text: string): string` function.
    - [x] Replace non-alphanumeric characters with underscores or hyphens.
    - [x] Ensure safe filesystem characters only.

- [x] **Task 2: Implement Download Logic in AudioPlayer** (AC: #1, #2, #3)
  - [x] 2.1 Modify `src/components/AudioPlayer/index.tsx` to add a "Download" button (use `Download` icon from lucide-react).
    - [x] **Position**: In the "Right: Secondary Controls" group, specifically **between the Speed Selector and the Minimize Button**.
  - [x] 2.2 Implement `handleDownload` in `src/components/AudioPlayer/connect.ts`:
    - [x] Use `sanitizeFilename` from `src/lib/utils.ts` to generate `[order]_[title].mp3`.
    - [x] **Method**: Use `fetch(audioUrl)` -> `blob()` -> `URL.createObjectURL(blob)` -> temporary `<a download>` tag -> `click()` -> `URL.revokeObjectURL()`.
      - _Reason_: This method forces the browser to respect the filename instead of the S3 URL's original filename.
    - [x] **CORS Handling**: Wrap the fetch in a try/catch block. If the fetch fails (likely due to CORS if headers are missing on S3), catch the error, log it, and show a user-friendly `toast.error('Download failed. Please try again.')`.
    - [x] Manage `isDownloading` state to show a loading spinner on the button while fetching.

- [x] **Task 3: Quality & Polish**
  - [x] 3.1 Verify filename format matches requirements (e.g., `01_intro.mp3`).
  - [x] 3.2 Ensure download works without stopping playback (or handles it gracefully).
  - [x] 3.3 Run `bun typecheck` and `bun lint`.

## Dev Notes

### Architecture Patterns and Constraints

- **Download Method**: Use the `fetch` + `blob` pattern to ensure the filename is respected, as cross-origin S3 URLs often ignore the `download` attribute.
- **CORS Prerequisite**: The storage bucket (S3/Supabase Storage) **MUST** have CORS headers configured to allow GET requests from the application domain (or localhost during dev). If this is not configured, the download will fail.
- **Sanitization**: Use a centralized `sanitizeFilename` utility in `src/lib/utils.ts` to ensure consistency across the application.

### Files to Modify

- `src/lib/utils.ts` (New utility)
- `src/components/AudioPlayer/index.tsx` (UI update)
- `src/components/AudioPlayer/connect.ts` (Logic update)

### References

- [Source: docs/epics.md#Story-5.4-Download-Audio-File] - Requirements
- [Source: docs/architecture.md#Frontend-Architecture] - Component patterns

## Dev Agent Record

### Context Reference

Loaded from epics.md and architecture.md.

### Agent Model Used

Antigravity (Google DeepMind)

### Debug Log References

None - implementation proceeded without issues.

### Completion Notes List

- **Task 1 Complete**: Implemented `sanitizeFilename` utility in `src/lib/utils.ts`. The function replaces non-alphanumeric characters (except hyphens and underscores) with underscores, collapses consecutive underscores, and trims leading/trailing underscores.
- **Task 2 Complete**:
  - Added `Download` button to AudioPlayer between Speed Selector and Minimize Button.
  - Implemented `handleDownload` function in `connect.ts` using fetch+blob pattern.
  - Added `isDownloading` state for loading spinner.
  - Error handling with toast notification on failure.
  - Filename format: `{lessonNumber padded to 2 digits}_{sanitized title}.mp3` (e.g., `01_Introduction.mp3`).
- **Task 3 Complete**:
  - `bun typecheck` passes.
  - `bun lint` passes.
  - Download does not interrupt playback (uses separate fetch, does not affect audio element).
- **Tests Added**: 10 new unit tests for `sanitizeFilename` function covering edge cases (special chars, accents, empty strings, consecutive underscores).

### File List

- `src/lib/utils.ts` (modified - added sanitizeFilename function)
- `src/lib/utils.test.ts` (modified - added sanitizeFilename tests)
- `src/components/AudioPlayer/index.tsx` (modified - added Download button UI)
- `src/components/AudioPlayer/connect.ts` (modified - added handleDownload logic and isDownloading state)
- `src/components/AudioPlayer/types.ts` (modified - added isDownloading and handleDownload to interface)

## Change Log

- 2025-12-16: Implemented download audio functionality - all tasks complete
