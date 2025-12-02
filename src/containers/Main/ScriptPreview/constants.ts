import type { LessonStatus } from '@/components/StatusBadge';
import type { ScriptPart } from '@/types/models';

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

  // Calculate reading time in minutes (without pauses)
  const readingTimeMinutes = Math.max(
    1,
    Math.ceil(wordCount / MEDITATION_WORDS_PER_MINUTE),
  );

  // Calculate total duration including pauses
  const totalDurationMinutes = Math.max(
    1,
    Math.ceil(readingTimeMinutes + totalPauseSeconds / 60),
  );

  // Calculate pause percentage
  const pausePercentage =
    totalDurationMinutes > 0
      ? Math.round((totalPauseSeconds / 60 / totalDurationMinutes) * 100)
      : 0;

  return {
    wordCount,
    charCount,
    totalPauseSeconds,
    totalDurationMinutes,
    pausePercentage,
    targetDurationMinutes,
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
    const pauseMatch = line.match(/\[PAUSE (\d+)s\]/);
    const breatheInMatch = line.match(/\[BREATHE IN\]/);
    const breatheOutMatch = line.match(/\[BREATHE OUT\]/);
    const silenceMatch = line.match(/\[SILENCE (\d+)s\]/);

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
    } else if (breatheInMatch) {
      // Save accumulated speak content before breath cue
      if (currentSpeakContent.trim()) {
        parts.push({
          type: 'speak',
          content: currentSpeakContent.trim(),
          duration: null,
        });
        currentSpeakContent = '';
      }

      // BREATHE IN is a speak cue, not a pause
      parts.push({
        type: 'speak',
        content: '[BREATHE IN]',
        duration: null,
      });
    } else if (breatheOutMatch) {
      // Save accumulated speak content before breath cue
      if (currentSpeakContent.trim()) {
        parts.push({
          type: 'speak',
          content: currentSpeakContent.trim(),
          duration: null,
        });
        currentSpeakContent = '';
      }

      // BREATHE OUT is a speak cue, not a pause
      parts.push({
        type: 'speak',
        content: '[BREATHE OUT]',
        duration: null,
      });
    } else if (silenceMatch) {
      // Save accumulated speak content before silence
      if (currentSpeakContent.trim()) {
        parts.push({
          type: 'speak',
          content: currentSpeakContent.trim(),
          duration: null,
        });
        currentSpeakContent = '';
      }

      // SILENCE is a pause
      parts.push({
        type: 'pause',
        content: null,
        duration: parseInt(silenceMatch[1] || '0', 10),
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
 */
export function calculateMetricsFromText(
  text: string,
  targetDurationMinutes: number,
): ScriptMetrics {
  // Parse the text into structured script parts
  const parsedScript = parseScriptText(text);

  // Calculate word and char count from speak parts only
  const speakParts = parsedScript.filter(
    (p) => p.type === 'speak' && p.content,
  );
  const wordCount = speakParts.reduce((acc, p) => {
    const words = p.content?.trim().split(/\s+/).filter(Boolean) || [];
    return acc + words.length;
  }, 0);
  const charCount = speakParts.reduce(
    (acc, p) => acc + (p.content?.replace(/\n/g, '').length || 0),
    0,
  );

  // Extract pause durations
  const pauseMatches = [
    ...text.matchAll(/\[PAUSE (\d+)s\]/g),
    ...text.matchAll(/\[SILENCE (\d+)s\]/g),
  ];
  const totalPauseSeconds = pauseMatches.reduce(
    (sum, match) => sum + parseInt(match[1] || '0', 10),
    0,
  );

  // Calculate reading time in minutes (without pauses)
  const readingTimeMinutes = Math.max(
    1,
    Math.ceil(wordCount / MEDITATION_WORDS_PER_MINUTE),
  );

  // Calculate total duration including pauses
  const totalDurationMinutes = Math.max(
    1,
    Math.ceil(readingTimeMinutes + totalPauseSeconds / 60),
  );

  // Calculate pause percentage
  const pausePercentage =
    totalDurationMinutes > 0
      ? Math.round((totalPauseSeconds / 60 / totalDurationMinutes) * 100)
      : 0;

  // Target duration comparison
  const targetDurationDiff = totalDurationMinutes - targetDurationMinutes;
  const isDurationOffTarget = Math.abs(targetDurationDiff) > 1;

  return {
    wordCount,
    charCount,
    totalPauseSeconds,
    totalDurationMinutes,
    pausePercentage,
    targetDurationMinutes,
    isDurationOffTarget,
  };
}
