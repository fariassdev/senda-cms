'use client';

import { formatDistanceToNow } from 'date-fns';
import { AlertCircle, ArrowLeft, FileQuestion, Loader2 } from 'lucide-react';

import { FixedActionBar } from '@/components/FixedActionBar';
import { ScriptContent } from '@/components/ScriptContent';
import { ScriptEditor } from '@/components/ScriptEditor';
import { ScriptHeader } from '@/components/ScriptHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';

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
    // Edit mode
    isEditing,
    editedContent,
    hasUnsavedChanges,
    saveStatus,
    isUnsavedModalOpen,
    editedMetrics,
    handleCancelEdit,
    handleSaveScript,
    handleSaveAndExit,
    handleDiscardChanges,
    handleContentChange,
    setIsUnsavedModalOpen,
    textareaRef,
    handleInsertPause,
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
      {/* Unified Sticky Header (includes metrics) */}
      <ScriptHeader
        lessonTitle={lesson.title}
        status={lesson.status}
        lastUpdated={lastUpdated}
        onBack={handleBackToCourse}
        metrics={isEditing ? editedMetrics : metrics}
        onInsertPause={isEditing ? handleInsertPause : undefined}
      />

      {/* Conditional rendering: Edit mode vs Preview mode */}
      <div className="mt-5">
        {isEditing ? (
          <>
            {/* Edit Mode */}
            <ScriptEditor
              content={editedContent}
              onChange={handleContentChange}
              ref={textareaRef}
            />

            {/* Unsaved Changes Modal */}
            <Dialog
              open={isUnsavedModalOpen}
              onOpenChange={setIsUnsavedModalOpen}
            >
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Unsaved Changes</DialogTitle>
                  <DialogDescription>
                    You have unsaved changes. What would you like to do?
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter className="flex flex-col sm:flex-row gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsUnsavedModalOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button variant="destructive" onClick={handleDiscardChanges}>
                    Discard Changes
                  </Button>
                  <Button onClick={handleSaveAndExit}>Save & Exit</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </>
        ) : (
          <>
            {/* Preview Mode */}

            {/* Script Content Area */}
            <Card className="mb-6">
              <CardHeader>
                <h2 className="text-lg font-semibold">Script Content</h2>
              </CardHeader>
              <CardContent>
                <ScriptContent script={lesson.script || []} />
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* Fixed action bar (edit/save or preview actions) */}
      <FixedActionBar
        isEditing={isEditing}
        onEdit={handleEditScript}
        onGenerateAudio={handleGenerateAudio}
        onRegenerate={handleRegenerateScript}
        canGenerateAudio={canGenerateAudio}
        hasUnsavedChanges={hasUnsavedChanges}
        saveStatus={saveStatus}
        onSave={handleSaveScript}
        onCancelEdit={handleCancelEdit}
      />
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
