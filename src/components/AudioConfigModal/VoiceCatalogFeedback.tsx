'use client';

import { AlertCircle, Loader2, MicOff } from 'lucide-react';

import { Button } from '@/components/ui/button';

function getVoiceCatalogErrorMessage(error: unknown): string {
  if (error && typeof error === 'object' && 'detail' in error) {
    const detail = (error as { detail?: Array<{ msg: string }> }).detail;
    if (detail?.[0]?.msg) {
      return detail[0].msg;
    }
  }
  return 'Could not load the voice catalog. Please try again.';
}

export function VoiceCatalogLoading() {
  return (
    <div className="flex items-center gap-2.5 px-3 py-3 border border-border bg-secondary/30 rounded-xl text-muted-foreground text-sm">
      <Loader2 className="h-4 w-4 animate-spin text-primary" />
      <span>Loading active voices catalog...</span>
    </div>
  );
}

interface VoiceCatalogErrorProps {
  error: unknown;
  onRetry: () => void;
}

export function VoiceCatalogError({ error, onRetry }: VoiceCatalogErrorProps) {
  return (
    <div
      role="alert"
      className="rounded-xl bg-destructive/10 border border-destructive/20 p-3.5 space-y-3"
    >
      <div className="flex items-start gap-2.5">
        <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5 text-destructive" />
        <div className="space-y-1 text-xs">
          <p className="font-semibold text-destructive">
            Failed to load voice catalog
          </p>
          <p className="text-muted-foreground leading-normal">
            {getVoiceCatalogErrorMessage(error)}
          </p>
        </div>
      </div>
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="h-8 text-xs"
        onClick={onRetry}
      >
        Try again
      </Button>
    </div>
  );
}

export function VoiceCatalogEmpty() {
  return (
    <div className="rounded-xl bg-amber-500/10 border border-amber-500/25 p-3.5 text-xs space-y-1">
      <div className="flex items-start gap-2.5">
        <MicOff className="h-4 w-4 flex-shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
        <div className="space-y-1">
          <p className="font-semibold text-amber-700 dark:text-amber-300">
            No active voices available
          </p>
          <p className="text-muted-foreground leading-normal">
            The voice catalog has no active entries. Add or activate voices in
            the admin catalog before generating audio.
          </p>
        </div>
      </div>
    </div>
  );
}
