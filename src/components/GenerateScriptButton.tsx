'use client';

import { Loader2, Sparkles } from 'lucide-react';
import { useCallback, useState } from 'react';

import { ScriptConfigModal } from '@/components/ScriptConfigModal';
import { Button } from '@/components/ui/button';
import type { LessonEditFormData } from '@/containers/Main/LessonScriptGeneration';
import { cn } from '@/lib/utils';
import type { Lesson } from '@/types/models';

export type LessonStatus =
  | 'PENDING'
  | 'SCRIPT_GENERATING'
  | 'SCRIPT_COMPLETED'
  | 'AUDIO_GENERATING'
  | 'AUDIO_COMPLETED'
  | 'SCRIPT_FAILED'
  | 'AUDIO_FAILED';

interface GenerateScriptButtonProps {
  lesson: Lesson;
  courseSlug: string;
  onGenerate: () => void;
  onUpdateAndGenerate: (data: LessonEditFormData) => Promise<void>;
  isGenerating?: boolean;
  isUpdating?: boolean;
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

export function GenerateScriptButton({
  lesson,
  courseSlug,
  onGenerate,
  onUpdateAndGenerate,
  isGenerating = false,
  isUpdating = false,
  className,
}: GenerateScriptButtonProps) {
  const status = lesson.status as LessonStatus;
  const buttonState = getButtonState(status, isGenerating);
  const isPrimary = buttonState.variant === 'default';

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      // Shift+Click bypasses modal and generates directly
      if (e.shiftKey) {
        onGenerate();
        return;
      }

      // Normal click opens configuration modal
      setIsModalOpen(true);
    },
    [onGenerate],
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
        aria-label={`${buttonState.label} for ${lesson.title}`}
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
        lesson={lesson}
        courseSlug={courseSlug}
        onGenerate={onGenerate}
        onUpdateAndGenerate={onUpdateAndGenerate}
        isGenerating={isGenerating}
        isUpdating={isUpdating}
      />
    </>
  );
}
