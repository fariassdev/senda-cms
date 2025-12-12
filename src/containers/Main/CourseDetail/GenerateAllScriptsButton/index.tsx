'use client';

import { Eye, Sparkles } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

import type { GenerateAllScriptsButtonProps } from './types';

/**
 * GenerateAllScriptsButton Component
 *
 * Button to trigger batch script generation for all eligible lessons.
 * Shows count badge with number of eligible lessons.
 * Disabled with tooltip when no eligible lessons exist.
 * Shows "View Progress" button when batch generation is active.
 *
 * @param props - GenerateAllScriptsButtonProps
 */
export function GenerateAllScriptsButton({
  eligibleCount,
  isGenerating,
  batchState,
  onClick,
  onViewProgress,
}: GenerateAllScriptsButtonProps) {
  const isDisabled = eligibleCount === 0 && !batchState?.isActive;
  const isBatchActive = batchState?.isActive ?? false;

  // Render "View Progress" button if batch is active
  if (isBatchActive && onViewProgress) {
    return (
      <Button
        type="button"
        variant="outline"
        onClick={onViewProgress}
        className="border-blue-500 text-blue-500 hover:bg-blue-500/10"
      >
        <Eye className="mr-2 h-4 w-4" aria-hidden="true" />
        View Progress
      </Button>
    );
  }

  // Render disabled button with tooltip if no eligible lessons
  if (isDisabled) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <span tabIndex={0}>
              <Button
                type="button"
                disabled
                className="bg-[#7dcfff]/50 text-slate-900 cursor-not-allowed"
              >
                <Sparkles className="mr-2 h-4 w-4" aria-hidden="true" />
                Generate Scripts
              </Button>
            </span>
          </TooltipTrigger>
          <TooltipContent>
            <p>All lessons have scripts</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  // Render active button with count badge
  return (
    <Button
      type="button"
      onClick={onClick}
      disabled={isGenerating}
      className="bg-[#7dcfff] text-slate-900 hover:bg-[#7dcfff]/90"
    >
      <Sparkles className="mr-2 h-4 w-4" aria-hidden="true" />
      Generate Scripts ({eligibleCount})
    </Button>
  );
}

export default GenerateAllScriptsButton;
