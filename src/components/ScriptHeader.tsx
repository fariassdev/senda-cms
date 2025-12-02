'use client';

import { ArrowLeft, Pause, Target, Type } from 'lucide-react';
import { StatusBadge } from '@/components/StatusBadge';
import { Button } from '@/components/ui/button';

interface Metrics {
  wordCount?: number;
  charCount?: number;
  totalDurationSeconds?: number;
  targetDurationMinutes?: number;
  totalPauseSeconds?: number;
  pausePercentage?: number | string;
  isDurationOffTarget?: boolean;
}

/**
 * Format duration in seconds to XXm XXs format
 */
function formatDuration(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  if (minutes === 0) {
    return `${seconds}s`;
  }
  if (seconds === 0) {
    return `${minutes}m`;
  }
  return `${minutes}m ${seconds}s`;
}

export function ScriptHeader({
  lessonTitle,
  status,
  lastUpdated,
  onBack,
  metrics,
  onInsertPause,
}: {
  lessonTitle: string;
  status?: string | null;
  lastUpdated?: string | null;
  onBack: () => void;
  metrics?: Metrics | null;
  onInsertPause?: (text: string) => void;
}) {
  return (
    <div className="sticky top-0 z-50">
      <div className="bg-background/95 backdrop-blur-md rounded-md p-3 shadow-sm space-y-4">
        {/* Back button */}
        <Button variant="ghost" size="sm" onClick={onBack} className="-ml-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Course
        </Button>

        {/* Title row */}
        <div className="flex-1">
          <h1 className="text-lg font-bold text-foreground leading-tight">
            {lessonTitle}
          </h1>
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            {status && <StatusBadge status={status} />}
            {lastUpdated && (
              <span className="text-xs text-muted-foreground">
                Updated {lastUpdated}
              </span>
            )}
          </div>
        </div>

        {/* Metrics - single row */}
        {metrics && (
          <div className="flex items-center gap-4 text-xs overflow-x-auto pb-1">
            <MetricItem
              icon={Type}
              label="Words"
              value={metrics.wordCount?.toLocaleString() ?? '-'}
            />
            <div className="w-px h-4 bg-border" />
            <MetricItem
              icon={Target}
              label="Duration"
              value={
                metrics.targetDurationMinutes !== undefined
                  ? `${metrics.totalDurationSeconds !== undefined ? formatDuration(metrics.totalDurationSeconds) : '-'} / ${metrics.targetDurationMinutes} min`
                  : '-'
              }
              highlight={metrics.isDurationOffTarget}
            />
            <div className="w-px h-4 bg-border" />
            <MetricItem
              icon={Pause}
              label="Pauses"
              value={`${metrics.totalPauseSeconds ? `${metrics.totalPauseSeconds}s` : '-'} (${metrics.pausePercentage ?? '-'}%)`}
            />
          </div>
        )}

        {/* Toolbar for inserting pauses (only in edit mode) */}
        {onInsertPause && (
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-muted-foreground mr-1">
              Insert pause:
            </span>
            <div className="flex gap-1 flex-wrap">
              {[
                { label: '3s', text: '[PAUSE 3s]' },
                { label: '5s', text: '[PAUSE 5s]', hideMobile: true },
                { label: '10s', text: '[PAUSE 10s]', hideMobile: true },
                { label: '30s', text: '[PAUSE 30s]' },
                { label: '50s', text: '[PAUSE 50s]', hideMobile: true },
              ].map((button) => (
                <Button
                  key={button.label}
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => onInsertPause(button.text)}
                  className={`h-7 px-2 text-sm ${button.hideMobile ? 'hidden sm:inline-flex' : ''}`}
                  aria-label={`Insert ${button.label} pause`}
                >
                  {button.label}
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function MetricItem({
  icon: Icon,
  label,
  value,
  highlight = false,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string | number;
  highlight?: boolean;
}) {
  return (
    <div className="flex items-center gap-1">
      <Icon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
      <span className="text-sm text-muted-foreground">{label}:</span>
      <span
        className={`text-sm font-semibold ${highlight ? 'text-orange-400' : 'text-foreground'}`}
      >
        {value}
      </span>
    </div>
  );
}
