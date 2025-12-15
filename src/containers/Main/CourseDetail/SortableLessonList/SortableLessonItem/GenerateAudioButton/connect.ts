import type { LessonStatus } from '@/types/models';

export default function useConnect() {
  /**
   * Determines button state based on lesson status for audio generation
   * Status mapping:
   * - SCRIPT_COMPLETED → "Generate Audio" (enabled, outline cyan)
   * - COMPLETED (AUDIO_COMPLETED) → "Regenerate Audio" (enabled, outline)
   * - AUDIO_GENERATING → "Generating..." (disabled, spinner)
   * - AUDIO_FAILED → "Retry Audio" (enabled, outline)
   * - Other states → disabled with tooltip: "Generate script first"
   */
  function getButtonState(status: LessonStatus, isGenerating: boolean) {
    // If mutation is in progress or status is generating
    if (isGenerating || status === 'AUDIO_GENERATING') {
      return {
        variant: 'outline' as const,
        label: 'Generating...',
        icon: 'spinner' as const,
        disabled: true,
        tooltip: 'Audio generation in progress',
      };
    }

    // Script generating - disable audio button
    if (status === 'SCRIPT_GENERATING') {
      return {
        variant: 'outline' as const,
        label: 'Generate Audio',
        icon: 'volume' as const,
        disabled: true,
        tooltip: 'Wait for script generation to complete',
      };
    }

    // AUDIO_FAILED - show retry button
    if (status === 'AUDIO_FAILED') {
      return {
        variant: 'outline' as const,
        label: 'Retry Audio',
        icon: 'volume' as const,
        disabled: false,
        tooltip: null,
      };
    }

    // AUDIO_COMPLETED (mapped as COMPLETED in some contexts) - show regenerate
    if (status === 'AUDIO_COMPLETED') {
      return {
        variant: 'outline' as const,
        label: 'Regenerate Audio',
        icon: 'volume' as const,
        disabled: false,
        tooltip: null,
      };
    }

    // SCRIPT_COMPLETED - ready to generate audio
    if (status === 'SCRIPT_COMPLETED') {
      return {
        variant: 'outline' as const,
        label: 'Generate Audio',
        icon: 'volume' as const,
        disabled: false,
        tooltip: null,
      };
    }

    // PENDING, SCRIPT_FAILED, or other states - button disabled
    return {
      variant: 'outline' as const,
      label: 'Generate Audio',
      icon: 'volume' as const,
      disabled: true,
      tooltip: 'Generate script first',
    };
  }

  return {
    getButtonState,
  };
}
