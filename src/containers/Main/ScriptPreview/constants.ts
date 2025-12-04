import type { LessonStatus, ScriptPart } from '@/types/models';

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
  script: Array<{
    type: string;
    content?: string | null;
    duration?: number | null;
  }>,
  targetDurationMinutes: number,
): ScriptMetrics {
  const speakParts = script.filter((p) => p.type === 'speak' && p.content);
  const pauseParts = script.filter((p) => p.type === 'pause' && p.duration);

  const wordCount = speakParts.reduce((acc, p) => {
    const words = p.content?.trim().split(/\s+/).filter(Boolean) || [];
    return acc + words.length;
  }, 0);

  const charCount = speakParts.reduce(
    (acc, p) => acc + (p.content?.replace(/\n/g, '').length || 0),
    0,
  );

  // Calculate total pause time in seconds
  const totalPauseSeconds = pauseParts.reduce(
    (acc, p) => acc + (p.duration || 0),
    0,
  );

  // Calculate reading time in seconds (words / words per minute * 60)
  const readingTimeSeconds = Math.round(
    (wordCount / MEDITATION_WORDS_PER_MINUTE) * 60,
  );

  // Calculate total duration in seconds (reading time + pauses)
  const totalDurationSeconds = readingTimeSeconds + totalPauseSeconds;

  // Calculate pause percentage based on total duration
  const pausePercentage =
    totalDurationSeconds > 0
      ? Math.round((totalPauseSeconds / totalDurationSeconds) * 100)
      : 0;

  // Target duration comparison (convert target to seconds for comparison)
  const targetDurationSeconds = targetDurationMinutes * 60;
  const isDurationOffTarget =
    Math.abs(totalDurationSeconds - targetDurationSeconds) > 60;

  return {
    wordCount,
    charCount,
    totalPauseSeconds,
    totalDurationSeconds,
    pausePercentage,
    targetDurationMinutes,
    isDurationOffTarget,
  };
}

/**
 * Serialize structured script to plain text for editing
 */
export function serializeScript(script: ScriptPart[]): string {
  return script
    .map((part) => {
      if (part.type === 'speak') {
        return part.content || '';
      } else if (part.type === 'pause') {
        return `[PAUSE ${part.duration}s]`;
      }
      return '';
    })
    .join('\n\n');
}

/**
 * Parse plain text back to structured script format
 */
export function parseScriptText(text: string): ScriptPart[] {
  const parts: ScriptPart[] = [];
  const lines = text.split('\n');

  let currentSpeakContent = '';

  for (const line of lines) {
    // Accept cue tokens case-insensitively
    const pauseMatch = line.match(/\[PAUSE (\d+)s\]/i);

    if (pauseMatch) {
      // Save accumulated speak content before pause
      if (currentSpeakContent.trim()) {
        parts.push({
          type: 'speak',
          content: currentSpeakContent.trim(),
          duration: null,
        });
        currentSpeakContent = '';
      }

      parts.push({
        type: 'pause',
        content: null,
        duration: parseInt(pauseMatch[1] || '0', 10),
      });
    } else if (line.trim()) {
      // Accumulate speak content
      currentSpeakContent += (currentSpeakContent ? '\n' : '') + line;
    }
  }

  // Add any remaining speak content
  if (currentSpeakContent.trim()) {
    parts.push({
      type: 'speak',
      content: currentSpeakContent.trim(),
      duration: null,
    });
  }

  return parts;
}

/**
 * Calculate metrics from plain text (for edit mode)
 * Uses the same logic as calculateScriptMetrics for consistency
 */
export function calculateMetricsFromText(
  text: string,
  targetDurationMinutes: number,
): ScriptMetrics {
  // Parse the text into structured script parts and use the same calculation
  const parsedScript = parseScriptText(text);
  return calculateScriptMetrics(parsedScript, targetDurationMinutes);
}
