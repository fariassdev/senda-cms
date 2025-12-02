'use client';

import {
  ArrowLeft,
  Clock,
  FileText,
  Pause,
  Percent,
  Target,
  Type,
} from 'lucide-react';
import { StatusBadge } from '@/components/StatusBadge';
import { Button } from '@/components/ui/button';

interface Metrics {
  wordCount?: number;
  charCount?: number;
  estimatedDurationMinutes?: number;
  totalDurationMinutes?: number;
  targetDurationMinutes?: number;
  totalPauseSeconds?: number;
  pausePercentage?: number | string;
  isDurationOffTarget?: boolean;
}

export function ScriptHeader({
  lessonTitle,
  status,
  lastUpdated,
  onBack,
  metrics,
}: {
  lessonTitle: string;
  status?: string | null;
  lastUpdated?: string | null;
  onBack: () => void;
  metrics?: Metrics | null;
}) {
  return (
    <div className="sticky top-0 z-50">
      <div className="bg-background/95 backdrop-blur-md rounded-md p-4 shadow-sm">
        <div className="space-y-2">
          {/* Back button above title */}
          <Button variant="ghost" size="sm" onClick={onBack} className="-ml-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Course
          </Button>

          {/* Title and status row */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-foreground">
                {lessonTitle}
              </h1>
              <div className="flex items-center gap-3 flex-wrap">
                {status && <StatusBadge status={status} />}
                {lastUpdated && (
                  <span className="text-sm text-muted-foreground">
                    Updated {lastUpdated}
                  </span>
                )}
              </div>
            </div>

            {/* Placeholder for potential right-side controls (keeps header balanced) */}
            <div className="flex items-center gap-3" />
          </div>
        </div>

        {/* Metrics (kept in header so they remain visible while scrolling) */}
        {metrics && (
          <div className="mt-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              <MetricItem
                icon={Type}
                label="Words"
                value={metrics.wordCount?.toLocaleString() ?? '-'}
              />
              <MetricItem
                icon={FileText}
                label="Characters"
                value={metrics.charCount?.toLocaleString() ?? '-'}
              />
              <MetricItem
                icon={Target}
                label="Target"
                value={
                  metrics.targetDurationMinutes !== undefined
                    ? `${metrics.targetDurationMinutes} min`
                    : '-'
                }
              />
              <MetricItem
                icon={Clock}
                label="Est. Duration"
                value={(() => {
                  const durationValue =
                    metrics.totalDurationMinutes ??
                    metrics.estimatedDurationMinutes;
                  return durationValue !== undefined
                    ? `${durationValue.toFixed(1)} min`
                    : '-';
                })()}
                highlight={metrics.isDurationOffTarget}
              />
              <MetricItem
                icon={Pause}
                label="Total Pauses"
                value={
                  metrics.totalPauseSeconds
                    ? `${metrics.totalPauseSeconds}s`
                    : '-'
                }
              />
              <MetricItem
                icon={Percent}
                label="Pause %"
                value={
                  metrics.pausePercentage !== undefined
                    ? `${metrics.pausePercentage}%`
                    : '-'
                }
              />
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
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 text-muted-foreground" />
        <span className="text-xs text-muted-foreground">{label}</span>
      </div>
      <span
        className={`text-base font-semibold ${highlight ? 'text-orange-400' : 'text-foreground'}`}
      >
        {value}
      </span>
    </div>
  );
}
