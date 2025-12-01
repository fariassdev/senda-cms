'use client';

import { Loader2, Sparkles } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

import { ScriptConfigModal } from '@/components/ScriptConfigModal';
import { Button } from '@/components/ui/button';
import {
  DEFAULT_SCRIPT_CONFIG,
  getStorageKey,
} from '@/containers/Main/LessonScriptGeneration';
import type {
  ScriptConfigFormData,
  ToneValue,
} from '@/containers/Main/LessonScriptGeneration';
import { cn } from '@/lib/utils';

export type LessonStatus =
  | 'PENDING'
  | 'SCRIPT_GENERATING'
  | 'SCRIPT_COMPLETED'
  | 'AUDIO_GENERATING'
  | 'AUDIO_COMPLETED'
  | 'SCRIPT_FAILED'
  | 'AUDIO_FAILED';

interface GenerateScriptButtonProps {
  lessonId: number;
  lessonTitle: string;
  lessonDuration: number;
  keyThemes?: string[];
  status: LessonStatus;
  courseSlug: string;
  onGenerate: (config?: ScriptConfigFormData) => void;
  isGenerating?: boolean;
  className?: string;
}

/**
 * Determines button state based on lesson status
 */
function getButtonState(status: LessonStatus, isGenerating: boolean) {
  // If mutation is in progress or status is generating
  if (isGenerating || status === 'SCRIPT_GENERATING') {
    return {
      variant: 'outline' as const,
      label: 'Generating...',
      icon: 'spinner' as const,
      disabled: true,
    };
  }

  // Audio generating - show regenerate but disabled
  if (status === 'AUDIO_GENERATING') {
    return {
      variant: 'outline' as const,
      label: 'Regenerate Script',
      icon: 'sparkles' as const,
      disabled: true,
    };
  }

  // PENDING or FAILED states - show primary generate button
  if (status === 'PENDING' || status.includes('FAILED')) {
    return {
      variant: 'default' as const,
      label: 'Generate Script',
      icon: 'sparkles' as const,
      disabled: false,
    };
  }

  // SCRIPT_COMPLETED, AUDIO_COMPLETED - show secondary regenerate button
  return {
    variant: 'outline' as const,
    label: 'Regenerate Script',
    icon: 'sparkles' as const,
    disabled: false,
  };
}

/**
 * Load saved tone preference from localStorage
 */
function getSavedTone(courseSlug: string): ToneValue | undefined {
  if (typeof window === 'undefined') return undefined;
  try {
    const stored = localStorage.getItem(getStorageKey(courseSlug));
    if (
      stored &&
      ['calming', 'energizing', 'neutral', 'visualization'].includes(stored)
    ) {
      return stored as ToneValue;
    }
  } catch {
    // localStorage not available or parsing error
  }
  return undefined;
}

/**
 * Save tone preference to localStorage
 */
function saveTone(courseSlug: string, tone: ToneValue): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(getStorageKey(courseSlug), tone);
  } catch {
    // localStorage not available
  }
}

export function GenerateScriptButton({
  lessonTitle,
  lessonDuration,
  keyThemes = [],
  status,
  courseSlug,
  onGenerate,
  isGenerating = false,
  className,
}: GenerateScriptButtonProps) {
  const buttonState = getButtonState(status, isGenerating);
  const isPrimary = buttonState.variant === 'default';

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [savedTone, setSavedTone] = useState<ToneValue | undefined>(undefined);

  // Load saved tone on mount
  useEffect(() => {
    setSavedTone(getSavedTone(courseSlug));
  }, [courseSlug]);

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      // Shift+Click bypasses modal with default settings
      if (e.shiftKey) {
        const defaultConfig: ScriptConfigFormData = {
          ...DEFAULT_SCRIPT_CONFIG,
          target_duration: lessonDuration,
        };
        onGenerate(defaultConfig);
        return;
      }

      // Normal click opens configuration modal
      setIsModalOpen(true);
    },
    [lessonDuration, onGenerate],
  );

  const handleGenerate = useCallback(
    (config: ScriptConfigFormData) => {
      // Save tone preference
      saveTone(courseSlug, config.tone);
      setSavedTone(config.tone);

      // Trigger generation
      onGenerate(config);
    },
    [courseSlug, onGenerate],
  );

  return (
    <>
      <Button
        type="button"
        variant={buttonState.variant}
        size="sm"
        className={cn(
          // Base styles - ensure minimum touch target
          'min-h-[36px] min-w-[36px]',
          // Primary variant (Generate Script): solid cyan background
          isPrimary && 'bg-[#7dcfff] text-slate-900 hover:bg-[#7dcfff]/90',
          // Secondary variant (Regenerate): cyan border and text
          !isPrimary &&
            !buttonState.disabled &&
            'border-[#7dcfff] text-[#7dcfff] hover:bg-[#7dcfff]/10',
          // Focus state: visible cyan outline
          'focus-visible:ring-[#7dcfff] focus-visible:ring-2',
          // Responsive: hide text on small screens, show only icon
          'px-2 sm:px-3',
          className,
        )}
        onClick={handleClick}
        disabled={buttonState.disabled}
        aria-label={`${buttonState.label} for ${lessonTitle}`}
        aria-busy={isGenerating || status === 'SCRIPT_GENERATING'}
        title="Hold Shift and click for quick generation with defaults"
      >
        {buttonState.icon === 'spinner' ? (
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
        ) : (
          <Sparkles className="h-4 w-4" aria-hidden="true" />
        )}
        {/* Hide text on mobile, show on sm+ */}
        <span className="hidden sm:inline">{buttonState.label}</span>
      </Button>

      <ScriptConfigModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        lessonTitle={lessonTitle}
        lessonDuration={lessonDuration}
        keyThemes={keyThemes}
        defaultTone={savedTone ?? DEFAULT_SCRIPT_CONFIG.tone}
        onGenerate={handleGenerate}
        isGenerating={isGenerating}
      />
    </>
  );
}
