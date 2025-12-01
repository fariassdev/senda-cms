import type { LessonStatus } from '@/components/StatusBadge';

import type { EmptyStateStatus, ScriptMetrics } from './types';

/**
 * Statuses where script is available and viewable
 */
export const SCRIPT_AVAILABLE_STATUSES: LessonStatus[] = [
  'SCRIPT_COMPLETED',
  'AUDIO_GENERATING',
  'AUDIO_COMPLETED',
];

/**
 * Status that allows generating audio
 * Only SCRIPT_COMPLETED can trigger audio generation
 */
export const AUDIO_GENERATION_ELIGIBLE_STATUS: LessonStatus =
  'SCRIPT_COMPLETED';

/**
 * Words per minute for meditation pace (slower than normal reading)
 */
export const MEDITATION_WORDS_PER_MINUTE = 150;

/**
 * Empty state messages based on lesson status
 */
export const EMPTY_STATE_MESSAGES: Record<EmptyStateStatus, string> = {
  PENDING: 'Generate a script first to preview it here.',
  SCRIPT_GENERATING: 'Script is currently being generated. Please wait...',
  SCRIPT_FAILED: 'Script generation failed. Try regenerating.',
  unknown: 'No script content is available for this lesson.',
};

/**
 * Calculate metrics from script parts
 */
export function calculateScriptMetrics(
  script: Array<{ type: string; content?: string | null }>,
): ScriptMetrics {
  const speakParts = script.filter((p) => p.type === 'speak' && p.content);

  const wordCount = speakParts.reduce((acc, p) => {
    const words = p.content?.trim().split(/\s+/).filter(Boolean) || [];
    return acc + words.length;
  }, 0);

  const charCount = speakParts.reduce(
    (acc, p) => acc + (p.content?.length || 0),
    0,
  );

  const readingTimeMinutes = Math.max(
    1,
    Math.ceil(wordCount / MEDITATION_WORDS_PER_MINUTE),
  );

  return {
    wordCount,
    charCount,
    readingTimeMinutes,
  };
}
