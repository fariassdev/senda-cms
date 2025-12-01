'use client';

import { formatDistanceToNow } from 'date-fns';
import {
  AlertCircle,
  ArrowLeft,
  Clock,
  Edit,
  FileQuestion,
  FileText,
  Loader2,
  Pause,
  Percent,
  RefreshCw,
  Target,
  Type,
  Volume2,
} from 'lucide-react';

import { ScriptContent } from '@/components/ScriptContent';
import { StatusBadge } from '@/components/StatusBadge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

import useConnect from './connect';
import { EMPTY_STATE_MESSAGES } from './constants';
import type { EmptyStateStatus, ScriptPreviewProps } from './types';

/**
 * ScriptPreview Container
 * Displays the generated script for a lesson with metrics and action buttons.
 */
export default function ScriptPreview(props: ScriptPreviewProps) {
  const {
    lesson,
    isLoading,
    isError,
    hasScriptAvailable,
    metrics,
    canGenerateAudio,
    handleBackToCourse,
    handleEditScript,
    handleRegenerateScript,
    handleGenerateAudio,
    handleRetry,
  } = useConnect(props);

  // Loading state
  if (isLoading) {
    return <ScriptPreviewSkeleton onBack={handleBackToCourse} />;
  }

  // Error state
  if (isError) {
    return <ErrorState onBack={handleBackToCourse} onRetry={handleRetry} />;
  }

  // Lesson not found
  if (!lesson) {
    return <EmptyState status="unknown" onBack={handleBackToCourse} />;
  }

  // Empty state - no script available
  if (!hasScriptAvailable) {
    const emptyStatus = (
      ['PENDING', 'SCRIPT_GENERATING', 'SCRIPT_FAILED'].includes(lesson.status)
        ? lesson.status
        : 'unknown'
    ) as EmptyStateStatus;

    return <EmptyState status={emptyStatus} onBack={handleBackToCourse} />;
  }

  // Format the last updated date
  const lastUpdated = lesson.scriptGeneratedAt
    ? formatDistanceToNow(new Date(lesson.scriptGeneratedAt), {
        addSuffix: true,
      })
    : lesson.updatedAt
      ? formatDistanceToNow(new Date(lesson.updatedAt), { addSuffix: true })
      : null;

  return (
    <div className="container mx-auto py-6 px-4 max-w-4xl">
      {/* Header Section */}
      <header className="mb-8">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleBackToCourse}
          className="mb-4 -ml-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Course
        </Button>

        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-foreground">
              {lesson.title}
            </h1>
            <div className="flex items-center gap-3 flex-wrap">
              <StatusBadge status={lesson.status} />
              {lastUpdated && (
                <span className="text-sm text-muted-foreground">
                  Updated {lastUpdated}
                </span>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Metrics Section */}
      {metrics && (
        <Card className="mb-6">
          <CardContent className="py-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              <MetricItem
                icon={Type}
                label="Words"
                value={metrics.wordCount.toLocaleString()}
              />
              <MetricItem
                icon={FileText}
                label="Characters"
                value={metrics.charCount.toLocaleString()}
              />
              <MetricItem
                icon={Target}
                label="Target Duration"
                value={`${metrics.targetDurationMinutes} min`}
              />
              <MetricItem
                icon={Clock}
                label="Est. Duration"
                value={`${metrics.totalDurationMinutes} min`}
                highlight={
                  Math.abs(
                    metrics.totalDurationMinutes -
                      metrics.targetDurationMinutes,
                  ) > 1
                }
              />
              <MetricItem
                icon={Pause}
                label="Total Pauses"
                value={`${metrics.totalPauseSeconds}s`}
              />
              <MetricItem
                icon={Percent}
                label="Pause %"
                value={`${metrics.pausePercentage}%`}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Script Content Area */}
      <Card className="mb-6">
        <CardHeader>
          <h2 className="text-lg font-semibold">Script Content</h2>
        </CardHeader>
        <CardContent>
          <ScriptContent script={lesson.script || []} />
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 justify-end">
        <Button
          variant="ghost"
          onClick={handleBackToCourse}
          className="order-4 sm:order-1"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Course
        </Button>

        <Button
          variant="outline"
          onClick={handleRegenerateScript}
          className="order-3 sm:order-2"
        >
          <RefreshCw className="h-4 w-4" />
          Regenerate Script
        </Button>

        <Tooltip>
          <TooltipTrigger asChild>
            <span className="order-2 sm:order-3">
              <Button
                variant="secondary"
                onClick={handleGenerateAudio}
                disabled={!canGenerateAudio}
                className="w-full sm:w-auto"
              >
                <Volume2 className="h-4 w-4" />
                Generate Audio
              </Button>
            </span>
          </TooltipTrigger>
          {!canGenerateAudio && (
            <TooltipContent>
              <p>Audio can only be generated when script is completed</p>
            </TooltipContent>
          )}
        </Tooltip>

        <Button
          variant="default"
          onClick={handleEditScript}
          className="order-1 sm:order-4"
        >
          <Edit className="h-4 w-4" />
          Edit Script
        </Button>
      </div>
    </div>
  );
}

/**
 * Metric display item component
 */
function MetricItem({
  icon: Icon,
  label,
  value,
  highlight = false,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 text-muted-foreground" />
        <span className="text-xs text-muted-foreground">{label}</span>
      </div>
      <span
        className={`text-base font-semibold ${
          highlight ? 'text-orange-400' : 'text-foreground'
        }`}
      >
        {value}
      </span>
    </div>
  );
}

/**
 * Loading skeleton component
 */
function ScriptPreviewSkeleton({ onBack }: { onBack: () => void }) {
  return (
    <div className="container mx-auto py-6 px-4 max-w-4xl">
      <header className="mb-8">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="mb-4 -ml-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Course
        </Button>

        <div className="space-y-3">
          <Skeleton className="h-8 w-64" />
          <div className="flex gap-3">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-6 w-32" />
          </div>
        </div>
      </header>

      <Card className="mb-6">
        <CardContent className="py-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            <Skeleton className="h-14 w-full" />
            <Skeleton className="h-14 w-full" />
            <Skeleton className="h-14 w-full" />
            <Skeleton className="h-14 w-full" />
            <Skeleton className="h-14 w-full" />
            <Skeleton className="h-14 w-full" />
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <Skeleton className="h-6 w-32" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <div className="flex justify-center my-6">
            <Skeleton className="h-8 w-24 rounded-full" />
          </div>
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </CardContent>
      </Card>
    </div>
  );
}

/**
 * Empty state component for when no script is available
 */
function EmptyState({
  status,
  onBack,
}: {
  status: EmptyStateStatus;
  onBack: () => void;
}) {
  const isGenerating = status === 'SCRIPT_GENERATING';
  const message = EMPTY_STATE_MESSAGES[status];

  return (
    <div className="container mx-auto py-6 px-4 max-w-4xl">
      <Button variant="ghost" size="sm" onClick={onBack} className="mb-8 -ml-2">
        <ArrowLeft className="h-4 w-4" />
        Back to Course
      </Button>

      <div className="flex flex-col items-center justify-center py-16 text-center">
        {isGenerating ? (
          <Loader2 className="h-16 w-16 text-muted-foreground mb-4 animate-spin" />
        ) : (
          <FileQuestion className="h-16 w-16 text-muted-foreground mb-4" />
        )}
        <h2 className="text-xl font-semibold text-foreground mb-2">
          No script available
        </h2>
        <p className="text-muted-foreground mb-6 max-w-md">{message}</p>
        <Button onClick={onBack}>Back to Course</Button>
      </div>
    </div>
  );
}

/**
 * Error state component
 */
function ErrorState({
  onBack,
  onRetry,
}: {
  onBack: () => void;
  onRetry: () => void;
}) {
  return (
    <div className="container mx-auto py-6 px-4 max-w-4xl">
      <Button variant="ghost" size="sm" onClick={onBack} className="mb-8 -ml-2">
        <ArrowLeft className="h-4 w-4" />
        Back to Course
      </Button>

      <div className="flex flex-col items-center justify-center py-16 text-center">
        <AlertCircle className="h-16 w-16 text-destructive mb-4" />
        <h2 className="text-xl font-semibold text-foreground mb-2">
          Failed to load script
        </h2>
        <p className="text-muted-foreground mb-6 max-w-md">
          There was an error loading the script data. Please try again.
        </p>
        <Button onClick={onRetry}>Try Again</Button>
      </div>
    </div>
  );
}
