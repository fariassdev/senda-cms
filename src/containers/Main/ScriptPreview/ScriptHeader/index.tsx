'use client';

import { ArrowLeft, History, Pause, Target, Type } from 'lucide-react';

import { StatusBadge } from '@/components/StatusBadge';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

import useConnect from './connect';
import { PAUSE_BUTTONS } from './constants';
import type { ScriptHeaderProps } from './types';

export function ScriptHeader({
  lessonTitle,
  status,
  lastUpdated,
  onBack,
  metrics,
  onInsertPause,
}: ScriptHeaderProps) {
  const { formatDuration } = useConnect();

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
          <h1 className="text-2xl font-bold text-foreground leading-tight">
            {lessonTitle}
          </h1>
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            {status && <StatusBadge status={status} />}
            {lastUpdated && (
              <span className="text-xs text-muted-foreground">
                Updated {lastUpdated}
              </span>
            )}
            {/* Version History Placeholder (Task 7) */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  disabled
                  className="text-muted-foreground"
                >
                  <History className="h-4 w-4" />
                  <span className="hidden sm:inline">History</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Version history coming soon</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>

        {/* Metrics - single row */}
        {metrics && (
          <div className="flex items-center text-center gap-6 text-xs overflow-x-auto pb-1">
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
            <div className="flex gap-2 flex-wrap">
              {PAUSE_BUTTONS.map((button) => (
                <Button
                  key={button.label}
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => onInsertPause(button.text)}
                  className={`min-h-[36px] h-7 px-6 text-sm ${button.hideMobile ? 'hidden sm:inline-flex' : ''}`}
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
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-3">
        <Icon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
        <span className="text-sm text-muted-foreground">{label}:</span>
      </div>
      <span
        className={`text-sm font-semibold ${highlight ? 'text-orange-400' : 'text-foreground'}`}
      >
        {value}
      </span>
    </div>
  );
}
