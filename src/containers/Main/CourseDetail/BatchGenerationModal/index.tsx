'use client';

import {
  CheckCircle,
  Clock,
  Loader2,
  Sparkles,
  Timer,
  XCircle,
} from 'lucide-react';
import { useEffect } from 'react';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import type { LessonBatchStatus } from '@/hooks/useBatchScriptGeneration';

import { SimulatedProgressBar } from './SimulatedProgressBar';
import useConnect from './connect';
import { BATCH_MESSAGES, MODAL_CONFIG } from './constants';
import type { BatchGenerationModalProps } from './types';

/**
 * Status icon component for each lesson in progress view
 */
function StatusIcon({ status }: { status?: LessonBatchStatus }) {
  switch (status) {
    case 'generating':
      return (
        <Loader2
          className="h-4 w-4 animate-spin text-blue-500"
          aria-hidden="true"
        />
      );
    case 'completed':
      return (
        <CheckCircle className="h-4 w-4 text-green-500" aria-hidden="true" />
      );
    case 'failed':
      return <XCircle className="h-4 w-4 text-red-500" aria-hidden="true" />;
    case 'pending':
    default:
      return <Clock className="h-4 w-4 text-gray-400" aria-hidden="true" />;
  }
}

/**
 * Get status label for accessibility
 */
function getStatusLabel(status?: LessonBatchStatus): string {
  switch (status) {
    case 'generating':
      return 'Generating...';
    case 'completed':
      return 'Complete';
    case 'failed':
      return 'Failed';
    case 'pending':
    default:
      return 'Waiting';
  }
}

/**
 * BatchGenerationModal Component
 *
 * Multi-view modal for batch script generation:
 * - Selection view: Choose lessons and configure generation
 * - Progress view: Real-time status of each lesson generation
 * - Complete view: Summary with retry option for failures
 *
 * @param props - BatchGenerationModalProps
 */
export function BatchGenerationModal({
  open,
  onOpenChange,
  lessons,
  onGenerate,
  onRetryFailed,
  batchState,
  isGenerating,
  initialView = 'selection',
}: BatchGenerationModalProps) {
  const {
    view,
    setView,
    initializeSelection,
    selectedIds,
    toggleLesson,
    selectAll,
    deselectAll,
    isGenerateDisabled,
    selectedCount,
    eligibleCount,
    getSelectedLessonIds,
    eligibleLessons,
    allLessonsWithStatus,
    progressStats,
  } = useConnect(lessons, batchState, initialView);

  // Initialize selection when modal opens
  useEffect(() => {
    if (open && !batchState?.isActive) {
      initializeSelection();
    } else if (open && batchState?.isActive) {
      // Show progress view if batch is active
      setView('progress');
    }
  }, [open, batchState?.isActive, initializeSelection, setView]);

  // Switch to complete view when batch finishes
  useEffect(() => {
    if (progressStats.isComplete && view === 'progress') {
      setView('complete');
    }
  }, [progressStats.isComplete, view, setView]);

  const handleGenerate = () => {
    const lessonIds = getSelectedLessonIds();
    onGenerate(lessonIds);
    setView('progress');
  };

  const handleClose = () => {
    onOpenChange(false);
  };

  const handleRetry = () => {
    onRetryFailed();
    setView('progress');
  };

  // Render selection view
  const renderSelectionView = () => (
    <>
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-[#7dcfff]" aria-hidden="true" />
          {MODAL_CONFIG.title(selectedCount)}
        </DialogTitle>
        <DialogDescription>{MODAL_CONFIG.description}</DialogDescription>
      </DialogHeader>

      {/* Warning banner */}
      <div
        role="alert"
        className="flex items-center gap-2 rounded-md bg-amber-500/10 border border-amber-500/30 p-3 text-amber-600 dark:text-amber-400"
      >
        <Timer className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
        <p className="text-sm">{BATCH_MESSAGES.PROCESSING_WARNING}</p>
      </div>

      {/* Lesson selection list */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-sm text-muted-foreground">
            Select lessons ({selectedCount}/{eligibleCount})
          </Label>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={selectAll}
              className="text-xs"
            >
              Select All
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={deselectAll}
              className="text-xs"
            >
              Deselect All
            </Button>
          </div>
        </div>

        <div className="max-h-[300px] overflow-y-auto rounded-md border border-border/50 p-2 space-y-1">
          {eligibleLessons.map((lesson) => (
            <div
              key={lesson.id}
              className="flex items-center gap-3 p-2 rounded-md hover:bg-muted/50 transition-colors"
            >
              <Checkbox
                id={`lesson-${lesson.id}`}
                checked={selectedIds.has(lesson.id)}
                onCheckedChange={() => toggleLesson(lesson.id)}
              />
              <Label
                htmlFor={`lesson-${lesson.id}`}
                className="flex-1 cursor-pointer text-sm"
              >
                <span className="text-muted-foreground mr-2">
                  #{lesson.lessonNumber}
                </span>
                {lesson.title}
              </Label>
            </div>
          ))}

          {eligibleLessons.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">
              No eligible lessons found
            </p>
          )}
        </div>
      </div>

      <DialogFooter className="gap-3 sm:gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={handleClose}
          className="border-[#7dcfff] text-[#7dcfff] hover:bg-[#7dcfff]/10"
        >
          {MODAL_CONFIG.cancelLabel}
        </Button>
        <Button
          type="button"
          onClick={handleGenerate}
          disabled={isGenerateDisabled || isGenerating}
          className="bg-[#7dcfff] text-slate-900 hover:bg-[#7dcfff]/90"
        >
          {isGenerating && (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
          )}
          <Sparkles className="mr-2 h-4 w-4" aria-hidden="true" />
          {MODAL_CONFIG.submitLabel(selectedCount)}
        </Button>
      </DialogFooter>
    </>
  );

  // Render progress view
  const renderProgressView = () => (
    <>
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <Loader2
            className="h-5 w-5 animate-spin text-[#7dcfff]"
            aria-hidden="true"
          />
          {MODAL_CONFIG.titleProgress}
        </DialogTitle>
        <DialogDescription>
          Generating: {progressStats.completed + progressStats.failed}/
          {progressStats.total} complete
        </DialogDescription>
      </DialogHeader>

      {/* Screen reader announcement */}
      <div role="status" aria-live="polite" className="sr-only">
        {progressStats.completed} of {progressStats.total} scripts generated
      </div>

      {/* Overall progress bar - isolated component for performance */}
      <SimulatedProgressBar
        lessonCount={progressStats.total}
        isGenerating={batchState?.isActive ?? false}
        isComplete={progressStats.isComplete}
      />

      {/* Per-lesson status list */}
      <div
        className="max-h-[300px] overflow-y-auto rounded-md border border-border/50 p-2 space-y-1"
        role="status"
        aria-live="polite"
      >
        {allLessonsWithStatus.map((lesson) => (
          <div
            key={lesson.id}
            className="flex items-center gap-3 p-2 rounded-md"
          >
            <StatusIcon status={lesson.batchStatus} />
            <span className="flex-1 text-sm">
              <span className="text-muted-foreground mr-2">
                #{lesson.lessonNumber}
              </span>
              {lesson.title}
            </span>
            <span
              className={`text-xs ${
                lesson.batchStatus === 'completed'
                  ? 'text-green-500'
                  : lesson.batchStatus === 'failed'
                    ? 'text-red-500'
                    : lesson.batchStatus === 'generating'
                      ? 'text-blue-500'
                      : 'text-gray-400'
              }`}
            >
              {getStatusLabel(lesson.batchStatus)}
            </span>
          </div>
        ))}
      </div>

      <DialogFooter>
        <Button
          type="button"
          variant="outline"
          onClick={handleClose}
          className="border-[#7dcfff] text-[#7dcfff] hover:bg-[#7dcfff]/10"
        >
          {MODAL_CONFIG.closeLabel}
        </Button>
      </DialogFooter>
    </>
  );

  // Render complete view
  const renderCompleteView = () => (
    <>
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          {progressStats.failed > 0 ? (
            <XCircle className="h-5 w-5 text-amber-500" aria-hidden="true" />
          ) : (
            <CheckCircle
              className="h-5 w-5 text-green-500"
              aria-hidden="true"
            />
          )}
          {MODAL_CONFIG.titleComplete}
        </DialogTitle>
        <DialogDescription>
          {progressStats.failed === 0
            ? BATCH_MESSAGES.COMPLETE_SUCCESS(progressStats.completed)
            : BATCH_MESSAGES.COMPLETE_PARTIAL(
                progressStats.completed,
                progressStats.failed,
              )}
        </DialogDescription>
      </DialogHeader>

      {/* Summary of failed lessons if any */}
      {progressStats.failed > 0 && (
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Failed lessons:</p>
          <div className="max-h-[200px] overflow-y-auto rounded-md border border-red-500/30 bg-red-500/5 p-2 space-y-2">
            {allLessonsWithStatus
              .filter((l) => l.batchStatus === 'failed')
              .map((lesson) => (
                <div
                  key={lesson.id}
                  className="flex flex-col gap-1 p-2 rounded bg-red-500/5"
                >
                  <div className="flex items-center gap-2 text-sm text-red-500">
                    <XCircle
                      className="h-4 w-4 flex-shrink-0"
                      aria-hidden="true"
                    />
                    <span className="font-medium">
                      #{lesson.lessonNumber} {lesson.title}
                    </span>
                  </div>
                  {lesson.error && (
                    <p className="text-xs text-red-400 ml-6">
                      {lesson.error.errorMessage}
                    </p>
                  )}
                </div>
              ))}
          </div>
        </div>
      )}

      <DialogFooter className="gap-3 sm:gap-2">
        {progressStats.failed > 0 && (
          <Button
            type="button"
            variant="outline"
            onClick={handleRetry}
            className="border-amber-500 text-amber-500 hover:bg-amber-500/10"
          >
            {BATCH_MESSAGES.RETRY_BUTTON(progressStats.failed)}
          </Button>
        )}
        <Button
          type="button"
          onClick={handleClose}
          className="bg-[#7dcfff] text-slate-900 hover:bg-[#7dcfff]/90"
        >
          Done
        </Button>
      </DialogFooter>
    </>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[700px] backdrop-blur-lg">
        {view === 'selection' && renderSelectionView()}
        {view === 'progress' && renderProgressView()}
        {view === 'complete' && renderCompleteView()}
      </DialogContent>
    </Dialog>
  );
}

export default BatchGenerationModal;
