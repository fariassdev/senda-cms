export interface Metrics {
  wordCount?: number;
  charCount?: number;
  totalDurationSeconds?: number;
  targetDurationMinutes?: number;
  totalPauseSeconds?: number;
  pausePercentage?: number | string;
  isDurationOffTarget?: boolean;
}

export interface ScriptHeaderProps {
  lessonTitle: string;
  status?: string | null;
  lastUpdated?: string | null;
  onBack: () => void;
  metrics?: Metrics | null;
  onInsertPause?: (text: string) => void;
}
