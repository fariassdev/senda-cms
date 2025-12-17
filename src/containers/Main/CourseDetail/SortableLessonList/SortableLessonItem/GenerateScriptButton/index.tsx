'use client';

import { Loader2, Sparkles } from 'lucide-react';
import { useCallback } from 'react';

import { ScriptGenerationModal } from '@/components/ScriptGenerationModal';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

import type { LessonStatus } from '@/types/models';
import useConnect from './connect';
import type { GenerateScriptButtonProps } from './types';

export function GenerateScriptButton({
  lesson,
  onGenerate,
  onUpdateAndGenerate,
  isGenerating = false,
  isUpdating = false,
  className,
}: GenerateScriptButtonProps) {
  const { isModalOpen, setIsModalOpen, getButtonState } = useConnect();

  const status = lesson.status as LessonStatus;
  const buttonState = getButtonState(status, isGenerating);

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
    [onGenerate, setIsModalOpen],
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
          // Responsive: hide text on small screens, show only icon, fixed width on desktop
          'px-2 sm:px-0 sm:w-[155px]',
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

      <ScriptGenerationModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        lesson={lesson}
        onGenerate={onGenerate}
        onUpdateAndGenerate={onUpdateAndGenerate}
        isGenerating={isGenerating}
        isUpdating={isUpdating}
      />
    </>
  );
}
